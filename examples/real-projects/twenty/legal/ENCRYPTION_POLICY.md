# Encryption Policy

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** twenty
**Organization:** [Your Company Name]

## Related Documents

- Security Policy (`SECURITY.md`)
- Information Security Policy (`INFORMATION_SECURITY_POLICY.md`)
- Backup Policy (`BACKUP_POLICY.md`)

---

This Encryption Policy defines the encryption requirements for data at rest, data in transit, and key management procedures for **[Your Company Name]**'s **twenty** application. It supports compliance with GDPR Article 32, SOC 2 CC6.1, ISO 27001 Annex A.10, and PCI DSS Requirement 3 & 4.

## 1. Encryption at Rest

All persistent data stores must encrypt data at rest using AES-256 or equivalent. The following table defines requirements per detected data store.

| Data Store | Encryption Method | Recommendation | Key Type |
|-----------|-------------------|----------------|----------|
| Postgresql | Transparent Data Encryption (TDE) or filesystem-level encryption | Enable TDE or use encrypted storage volumes (e | Cloud KMS (AWS KMS, GCP KMS, Azure Key Vault) |
| Redis | No native encryption at rest | Use encrypted storage volumes | Cloud KMS for volume encryption |
| @aws-sdk/client-s3 (Storage) | AES-256 server-side encryption (SSE-S3, SSE-KMS, or SSE-C for AWS S3 | Cloud-managed keys | Cloud-managed or CMEK |

### 1.1 Encryption Requirements by Data Type

| Data Type | Minimum Encryption | Additional Requirements |
|-----------|-------------------|------------------------|
| User credentials (passwords, tokens) | AES-256 + hashing (bcrypt/scrypt/argon2) | Never store plaintext; use one-way hash for passwords |
| Personal Identifiable Information (PII) | AES-256 at rest | Column-level encryption recommended; access logging required |
| Payment card data (PAN, CVV) | AES-256 + PCI DSS Req. 3 | Never store CVV; tokenize PAN; use PCI-compliant processor |
| Financial transaction data | AES-256 at rest | Audit trail required; key rotation every 12 months |
| Session data | AES-256 at rest | Short TTL; encrypted cookies with Secure + HttpOnly flags |
| OAuth tokens | AES-256 at rest | Encrypt in database; never log token values |
| AI training data / prompts | AES-256 at rest | Data minimization; purpose limitation per AI provider DPA |
| Audit logs | AES-256 at rest | Immutable storage recommended; integrity verification |
| Backups | AES-256 at rest | Encrypted independently of source; separate key from primary |

## 2. Encryption in Transit

All data transmitted over a network must be encrypted using TLS 1.2 or higher. TLS 1.3 is recommended for all new deployments.

### 2.1 TLS Configuration Requirements

| Requirement | Minimum | Recommended |
|------------|---------|-------------|
| TLS version | TLS 1.2 | TLS 1.3 |
| Certificate type | Domain Validated (DV) | Organization Validated (OV) or Extended Validation (EV) |
| Certificate authority | Trusted public CA | Trusted public CA with Certificate Transparency |
| Cipher suites | AEAD ciphers only | TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256 |
| HSTS | Enabled | max-age=31536000; includeSubDomains; preload |
| Certificate pinning | Optional | Recommended for mobile apps and high-security APIs |

### 2.2 In-Transit Requirements by Connection Type

| Connection | Requirement | Verification |
|-----------|-------------|-------------|
| Browser to application | TLS 1.2+ (HTTPS enforced) | HSTS header; redirect HTTP to HTTPS |
| Application to database | TLS 1.2+ (verify-full mode recommended) | Connection string parameter; certificate validation |
| Application to third-party APIs | TLS 1.2+ | Certificate validation; no self-signed certs in production |
| Internal service-to-service | TLS 1.2+ or mTLS | Mutual TLS for zero-trust architecture |
| Backup transfers | TLS 1.2+ or encrypted tunnel (VPN/SSH) | Encrypted before transfer; verify at destination |
| Payment processor communication | TLS 1.2+ (PCI DSS Req. 4) | PCI-validated endpoint; no fallback to HTTP |
| AI service API calls | TLS 1.2+ | Verify AI provider certificate; do not disable certificate validation |

## 3. Key Management Procedures

### 3.1 Key Lifecycle

| Phase | Requirement | Responsibility |
|-------|------------|----------------|
| Generation | Use cryptographically secure random number generators (CSPRNG) | Security team |
| Storage | Keys must never be stored in source code, logs, or plaintext config files | Engineering team |
| Distribution | Use secure channels (KMS API, encrypted transfer) | Security team |
| Rotation | Rotate encryption keys on a defined schedule (see 3.2) | Security team + automation |
| Revocation | Immediately revoke compromised keys; re-encrypt affected data | Incident response team |
| Destruction | Securely destroy retired keys after retention period | Security team |

### 3.2 Key Rotation Schedule

| Key Type | Rotation Frequency | Trigger for Immediate Rotation |
|---------|-------------------|-------------------------------|
| Database encryption keys | Every 12 months | Key compromise, personnel departure |
| TLS certificates | Before expiry (auto-renew via ACME/Let's Encrypt) | Certificate compromise |
| API keys and secrets | Every 90 days | Key exposure in logs, code, or breach |
| Session signing keys | Every 30 days | Suspected session hijacking |
| Backup encryption keys | Every 12 months | Backup key compromise |
| Payment encryption keys | Every 12 months (PCI DSS Req. 3.6) | Key compromise; personnel with key knowledge leaves |

### 3.3 Key Storage Requirements

Keys must be stored using one of the following approved methods:

1. **Cloud Key Management Service (KMS)** — AWS KMS, GCP KMS, Azure Key Vault
2. **Hardware Security Module (HSM)** — For highest-assurance requirements
3. **Secrets Manager** — AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault
4. **Environment variables** — Acceptable for non-sensitive keys in development only

**Prohibited key storage:**

- Source code repositories (even private repos)
- Unencrypted configuration files
- Application logs
- Email, chat, or shared documents
- Client-side code or mobile app bundles

## 4. Compliance Mapping

| Regulation | Requirement | This Policy Section |
|-----------|-------------|-------------------|
| GDPR Article 32 | Encryption of personal data | Sections 1, 2 |
| SOC 2 CC6.1 | Logical and physical access controls including encryption | Sections 1, 2, 3 |
| ISO 27001 A.10 | Cryptographic controls | Sections 1, 2, 3 |
| PCI DSS Req. 3 | Protect stored cardholder data | Section 1 |
| PCI DSS Req. 4 | Encrypt transmission of cardholder data | Section 2 |
| NIST SP 800-111 | Guide to storage encryption | Section 1 |
| NIST SP 800-52 | TLS implementation guidelines | Section 2 |

## 5. Policy Review

This encryption policy must be reviewed:

- At minimum **annually**
- When new data stores or cloud services are added
- After any security incident involving data exposure
- When regulatory requirements change

For questions about this policy, contact **[your-email@example.com]**.

---

*This Encryption Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **twenty** codebase. It should be reviewed by your security and engineering teams and customized to reflect your actual encryption implementation.*