import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";
import type { DatabaseScanResult, DatabaseType } from "../scanner/database-scanner.js";
import type { CloudScanResult } from "../scanner/cloud-scanner.js";

// ── Encryption metadata per database type ──────────────────────────────────

interface EncryptionProfile {
  atRestDefault: string;
  atRestRecommendation: string;
  inTransitDefault: string;
  keyManagementOptions: string[];
}

const DATABASE_ENCRYPTION: Record<DatabaseType, EncryptionProfile> = {
  postgresql: {
    atRestDefault: "Transparent Data Encryption (TDE) or filesystem-level encryption",
    atRestRecommendation: "Enable TDE or use encrypted storage volumes (e.g., AWS EBS encryption, GCP CMEK). Consider column-level encryption via pgcrypto for PII fields.",
    inTransitDefault: "TLS (sslmode=require or sslmode=verify-full)",
    keyManagementOptions: ["Cloud KMS (AWS KMS, GCP KMS, Azure Key Vault)", "pgcrypto with externally managed keys", "HashiCorp Vault"],
  },
  mysql: {
    atRestDefault: "InnoDB tablespace encryption (TDE)",
    atRestRecommendation: "Enable InnoDB TDE with keyring plugin. Use encrypted storage volumes for additional layer.",
    inTransitDefault: "TLS (require_secure_transport=ON)",
    keyManagementOptions: ["MySQL keyring plugin", "Cloud KMS", "HashiCorp Vault"],
  },
  mongodb: {
    atRestDefault: "WiredTiger encryption at rest (Enterprise) or filesystem-level encryption",
    atRestRecommendation: "Enable WiredTiger encryption or use MongoDB Atlas encrypted storage. Use Client-Side Field Level Encryption (CSFLE) for sensitive fields.",
    inTransitDefault: "TLS (net.tls.mode: requireTLS)",
    keyManagementOptions: ["MongoDB KMIP integration", "AWS KMS", "GCP KMS", "Azure Key Vault", "Local key file (development only)"],
  },
  redis: {
    atRestDefault: "No native encryption at rest",
    atRestRecommendation: "Use encrypted storage volumes. For managed services (ElastiCache, Upstash), enable encryption at rest. Avoid storing unencrypted PII in Redis.",
    inTransitDefault: "TLS (tls: true in client config)",
    keyManagementOptions: ["Cloud KMS for volume encryption", "Application-level encryption before caching"],
  },
  sqlite: {
    atRestDefault: "No native encryption",
    atRestRecommendation: "Use SQLCipher for database-level encryption or encrypt the entire volume. SQLite should not be used for sensitive data in production without encryption.",
    inTransitDefault: "N/A (local database)",
    keyManagementOptions: ["SQLCipher passphrase management", "OS-level keychain", "Environment variable (not recommended)"],
  },
  dynamodb: {
    atRestDefault: "AWS-managed encryption (AES-256) enabled by default",
    atRestRecommendation: "Default encryption is sufficient for most cases. Use customer-managed CMK for regulatory requirements (HIPAA, PCI DSS).",
    inTransitDefault: "TLS enforced by AWS SDK",
    keyManagementOptions: ["AWS-owned key (default)", "AWS-managed CMK", "Customer-managed CMK via AWS KMS"],
  },
  mariadb: {
    atRestDefault: "InnoDB/Aria tablespace encryption",
    atRestRecommendation: "Enable tablespace encryption with file_key_management or AWS KMS plugin. Use encrypted storage volumes.",
    inTransitDefault: "TLS (require_secure_transport=ON)",
    keyManagementOptions: ["file_key_management plugin", "AWS KMS plugin", "HashiCorp Vault"],
  },
  cassandra: {
    atRestDefault: "Transparent Data Encryption (TDE)",
    atRestRecommendation: "Enable TDE for SSTables and commit logs. Use encrypted storage volumes.",
    inTransitDefault: "TLS (client_encryption_options and server_encryption_options)",
    keyManagementOptions: ["JCE key store", "Cloud KMS", "HashiCorp Vault"],
  },
  elasticsearch: {
    atRestDefault: "Encrypted storage (Elastic Cloud) or filesystem-level",
    atRestRecommendation: "Enable encryption at rest via Elastic Cloud or encrypted volumes. Use field-level security to restrict access to sensitive fields.",
    inTransitDefault: "TLS (xpack.security.http.ssl.enabled: true)",
    keyManagementOptions: ["Elasticsearch keystore", "Cloud KMS for volume encryption"],
  },
};

const STORAGE_ENCRYPTION: Record<string, { atRest: string; inTransit: string; keyManagement: string }> = {
  storage: {
    atRest: "AES-256 server-side encryption (SSE-S3, SSE-KMS, or SSE-C for AWS S3; CMEK for GCP; Azure Storage Service Encryption)",
    inTransit: "TLS 1.2+ enforced; bucket policies should deny non-TLS requests",
    keyManagement: "Cloud-managed keys (default) or Customer-Managed Encryption Keys (CMEK) for regulatory compliance",
  },
};

// ── Generator ──────────────────────────────────────────────────────────────

/**
 * Generates ENCRYPTION_POLICY.md based on detected databases and storage services.
 * Returns null if the project has fewer than 2 services (not enough data infrastructure
 * to warrant a standalone encryption policy).
 */
export function generateEncryptionPolicy(
  scan: ScanResult,
  ctx?: GeneratorContext,
  dbScan?: DatabaseScanResult,
  cloudScan?: CloudScanResult,
): string | null {
  const databaseServices = scan.services.filter((s) => s.category === "database");
  const storageServices = scan.services.filter((s) => s.category === "storage");

  // Need at least databases or storage to make this doc useful
  if (databaseServices.length === 0 && storageServices.length === 0 && (!dbScan || dbScan.databases.length === 0)) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const securityEmail = ctx?.securityEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];

  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasAI = scan.services.some((s) => s.category === "ai");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Encryption Policy");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `This Encryption Policy defines the encryption requirements for data at rest, data in transit, and key management procedures for **${company}**'s **${scan.projectName}** application. ` +
    `It supports compliance with GDPR Article 32, SOC 2 CC6.1, ISO 27001 Annex A.10, and PCI DSS Requirement 3 & 4.`
  );
  sections.push("");

  // ── 1. At-Rest Encryption ───────────────────────────────────────────
  sections.push("## 1. Encryption at Rest");
  sections.push("");
  sections.push("All persistent data stores must encrypt data at rest using AES-256 or equivalent. The following table defines requirements per detected data store.");
  sections.push("");
  sections.push("| Data Store | Encryption Method | Recommendation | Key Type |");
  sections.push("|-----------|-------------------|----------------|----------|");

  // Database-scanner detected databases
  if (dbScan && dbScan.databases.length > 0) {
    for (const db of dbScan.databases) {
      const profile = DATABASE_ENCRYPTION[db.type];
      if (profile) {
        const displayName = db.type.charAt(0).toUpperCase() + db.type.slice(1);
        sections.push(`| ${displayName} | ${profile.atRestDefault} | ${profile.atRestRecommendation.split(".")[0]} | ${profile.keyManagementOptions[0]} |`);
      }
    }
  }

  // Service-detected databases (if no dbScan or for additional coverage)
  for (const svc of databaseServices) {
    const key = svc.name.toLowerCase() as DatabaseType;
    if (DATABASE_ENCRYPTION[key] && (!dbScan || !dbScan.databases.some((d) => d.type === key))) {
      const profile = DATABASE_ENCRYPTION[key];
      sections.push(`| ${svc.name} | ${profile.atRestDefault} | ${profile.atRestRecommendation.split(".")[0]} | ${profile.keyManagementOptions[0]} |`);
    }
  }

  // Storage services
  if (storageServices.length > 0) {
    for (const svc of storageServices) {
      const enc = STORAGE_ENCRYPTION.storage;
      sections.push(`| ${svc.name} (Storage) | ${enc.atRest.split(";")[0]} | ${enc.keyManagement.split("(")[0].trim()} | Cloud-managed or CMEK |`);
    }
  }

  sections.push("");

  // ── Data type requirements ──────────────────────────────────────────
  sections.push("### 1.1 Encryption Requirements by Data Type");
  sections.push("");
  sections.push("| Data Type | Minimum Encryption | Additional Requirements |");
  sections.push("|-----------|-------------------|------------------------|");
  sections.push("| User credentials (passwords, tokens) | AES-256 + hashing (bcrypt/scrypt/argon2) | Never store plaintext; use one-way hash for passwords |");
  sections.push("| Personal Identifiable Information (PII) | AES-256 at rest | Column-level encryption recommended; access logging required |");

  if (hasPayment) {
    sections.push("| Payment card data (PAN, CVV) | AES-256 + PCI DSS Req. 3 | Never store CVV; tokenize PAN; use PCI-compliant processor |");
    sections.push("| Financial transaction data | AES-256 at rest | Audit trail required; key rotation every 12 months |");
  }

  if (hasAuth) {
    sections.push("| Session data | AES-256 at rest | Short TTL; encrypted cookies with Secure + HttpOnly flags |");
    sections.push("| OAuth tokens | AES-256 at rest | Encrypt in database; never log token values |");
  }

  if (hasAI) {
    sections.push("| AI training data / prompts | AES-256 at rest | Data minimization; purpose limitation per AI provider DPA |");
  }

  sections.push("| Audit logs | AES-256 at rest | Immutable storage recommended; integrity verification |");
  sections.push("| Backups | AES-256 at rest | Encrypted independently of source; separate key from primary |");
  sections.push("");

  // ── 2. In-Transit Encryption ────────────────────────────────────────
  sections.push("## 2. Encryption in Transit");
  sections.push("");
  sections.push("All data transmitted over a network must be encrypted using TLS 1.2 or higher. TLS 1.3 is recommended for all new deployments.");
  sections.push("");
  sections.push("### 2.1 TLS Configuration Requirements");
  sections.push("");
  sections.push("| Requirement | Minimum | Recommended |");
  sections.push("|------------|---------|-------------|");
  sections.push("| TLS version | TLS 1.2 | TLS 1.3 |");
  sections.push("| Certificate type | Domain Validated (DV) | Organization Validated (OV) or Extended Validation (EV) |");
  sections.push("| Certificate authority | Trusted public CA | Trusted public CA with Certificate Transparency |");
  sections.push("| Cipher suites | AEAD ciphers only | TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256 |");
  sections.push("| HSTS | Enabled | max-age=31536000; includeSubDomains; preload |");
  sections.push("| Certificate pinning | Optional | Recommended for mobile apps and high-security APIs |");
  sections.push("");

  sections.push("### 2.2 In-Transit Requirements by Connection Type");
  sections.push("");
  sections.push("| Connection | Requirement | Verification |");
  sections.push("|-----------|-------------|-------------|");
  sections.push("| Browser to application | TLS 1.2+ (HTTPS enforced) | HSTS header; redirect HTTP to HTTPS |");
  sections.push("| Application to database | TLS 1.2+ (verify-full mode recommended) | Connection string parameter; certificate validation |");
  sections.push("| Application to third-party APIs | TLS 1.2+ | Certificate validation; no self-signed certs in production |");
  sections.push("| Internal service-to-service | TLS 1.2+ or mTLS | Mutual TLS for zero-trust architecture |");
  sections.push("| Backup transfers | TLS 1.2+ or encrypted tunnel (VPN/SSH) | Encrypted before transfer; verify at destination |");

  if (hasPayment) {
    sections.push("| Payment processor communication | TLS 1.2+ (PCI DSS Req. 4) | PCI-validated endpoint; no fallback to HTTP |");
  }
  if (hasAI) {
    sections.push("| AI service API calls | TLS 1.2+ | Verify AI provider certificate; do not disable certificate validation |");
  }

  sections.push("");

  // ── 3. Key Management ──────────────────────────────────────────────
  sections.push("## 3. Key Management Procedures");
  sections.push("");
  sections.push("### 3.1 Key Lifecycle");
  sections.push("");
  sections.push("| Phase | Requirement | Responsibility |");
  sections.push("|-------|------------|----------------|");
  sections.push("| Generation | Use cryptographically secure random number generators (CSPRNG) | Security team |");
  sections.push("| Storage | Keys must never be stored in source code, logs, or plaintext config files | Engineering team |");
  sections.push("| Distribution | Use secure channels (KMS API, encrypted transfer) | Security team |");
  sections.push("| Rotation | Rotate encryption keys on a defined schedule (see 3.2) | Security team + automation |");
  sections.push("| Revocation | Immediately revoke compromised keys; re-encrypt affected data | Incident response team |");
  sections.push("| Destruction | Securely destroy retired keys after retention period | Security team |");
  sections.push("");

  sections.push("### 3.2 Key Rotation Schedule");
  sections.push("");
  sections.push("| Key Type | Rotation Frequency | Trigger for Immediate Rotation |");
  sections.push("|---------|-------------------|-------------------------------|");
  sections.push("| Database encryption keys | Every 12 months | Key compromise, personnel departure |");
  sections.push("| TLS certificates | Before expiry (auto-renew via ACME/Let's Encrypt) | Certificate compromise |");
  sections.push("| API keys and secrets | Every 90 days | Key exposure in logs, code, or breach |");
  sections.push("| Session signing keys | Every 30 days | Suspected session hijacking |");
  sections.push("| Backup encryption keys | Every 12 months | Backup key compromise |");

  if (hasPayment) {
    sections.push("| Payment encryption keys | Every 12 months (PCI DSS Req. 3.6) | Key compromise; personnel with key knowledge leaves |");
  }

  sections.push("");

  sections.push("### 3.3 Key Storage Requirements");
  sections.push("");
  sections.push("Keys must be stored using one of the following approved methods:");
  sections.push("");
  sections.push("1. **Cloud Key Management Service (KMS)** — AWS KMS, GCP KMS, Azure Key Vault");
  sections.push("2. **Hardware Security Module (HSM)** — For highest-assurance requirements");
  sections.push("3. **Secrets Manager** — AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault");
  sections.push("4. **Environment variables** — Acceptable for non-sensitive keys in development only");
  sections.push("");
  sections.push("**Prohibited key storage:**");
  sections.push("");
  sections.push("- Source code repositories (even private repos)");
  sections.push("- Unencrypted configuration files");
  sections.push("- Application logs");
  sections.push("- Email, chat, or shared documents");
  sections.push("- Client-side code or mobile app bundles");
  sections.push("");

  // ── 4. Cloud provider encryption ─────────────────────────────────────
  if (cloudScan && cloudScan.providers.length > 0) {
    sections.push("## 4. Cloud Provider Encryption");
    sections.push("");
    sections.push("| Provider | At-Rest Encryption | In-Transit Encryption | Key Management |");
    sections.push("|----------|-------------------|----------------------|----------------|");

    for (const p of cloudScan.providers) {
      const providerRows: Record<string, [string, string, string]> = {
        aws: ["AES-256 (SSE-S3, SSE-KMS, SSE-C)", "TLS 1.2+ enforced", "AWS KMS (AWS-managed or CMK)"],
        gcp: ["AES-256 (Google-managed or CMEK)", "TLS 1.2+ enforced", "GCP KMS / Cloud HSM"],
        azure: ["AES-256 (Azure Storage Service Encryption)", "TLS 1.2+ enforced", "Azure Key Vault"],
        vercel: ["Encrypted at rest (AWS infrastructure)", "TLS 1.2+ enforced", "Managed by Vercel (AWS KMS)"],
        railway: ["Encrypted at rest (GCP infrastructure)", "TLS 1.2+ enforced", "Managed by Railway"],
        "fly-io": ["Volume encryption available", "TLS 1.2+ via Fly Proxy", "User-managed"],
        netlify: ["CDN-level encryption", "TLS 1.2+ enforced", "Managed by Netlify"],
      };
      const row = providerRows[p.provider] || ["Verify with provider", "TLS 1.2+ recommended", "Verify with provider"];
      sections.push(`| ${p.displayName} | ${row[0]} | ${row[1]} | ${row[2]} |`);
    }

    sections.push("");
  }

  // ── 5. Compliance Mapping ───────────────────────────────────────────
  const complianceSection = cloudScan && cloudScan.providers.length > 0 ? "5" : "4";
  sections.push(`## ${complianceSection}. Compliance Mapping`);
  sections.push("");
  sections.push("| Regulation | Requirement | This Policy Section |");
  sections.push("|-----------|-------------|-------------------|");
  sections.push("| GDPR Article 32 | Encryption of personal data | Sections 1, 2 |");
  sections.push("| SOC 2 CC6.1 | Logical and physical access controls including encryption | Sections 1, 2, 3 |");
  sections.push("| ISO 27001 A.10 | Cryptographic controls | Sections 1, 2, 3 |");

  if (hasPayment) {
    sections.push("| PCI DSS Req. 3 | Protect stored cardholder data | Section 1 |");
    sections.push("| PCI DSS Req. 4 | Encrypt transmission of cardholder data | Section 2 |");
  }

  sections.push("| NIST SP 800-111 | Guide to storage encryption | Section 1 |");
  sections.push("| NIST SP 800-52 | TLS implementation guidelines | Section 2 |");
  sections.push("");

  // ── Review and Disclaimer ───────────────────────────────────────────
  const reviewSection = parseInt(complianceSection) + 1;
  sections.push(`## ${reviewSection}. Policy Review`);
  sections.push("");
  sections.push("This encryption policy must be reviewed:");
  sections.push("");
  sections.push("- At minimum **annually**");
  sections.push("- When new data stores or cloud services are added");
  sections.push("- After any security incident involving data exposure");
  sections.push("- When regulatory requirements change");
  sections.push("");
  sections.push(`For questions about this policy, contact **${securityEmail}**.`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This Encryption Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `It should be reviewed by your security and engineering teams and customized to reflect your actual encryption implementation.*`
  );

  return sections.join("\n");
}
