import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyByDesignChecklist } from "./privacy-by-design.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  isDataProcessor?: boolean,
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    ...(isDataProcessor !== undefined ? { isDataProcessor } : {}),
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

describe("generatePrivacyByDesignChecklist", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generatePrivacyByDesignChecklist(scan), null);
  });

  // ── Generation with services ──────────────────────────────────────

  it("generates checklist with a single service", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan);
    assert.ok(result !== null);
    assert.ok(result.includes("Privacy by Design Checklist"));
  });

  it("generates checklist with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("@clerk/nextjs", "auth", ["user credentials"]),
      ],
    });
    const result = generatePrivacyByDesignChecklist(scan);
    assert.ok(result !== null);
  });

  // ── Context values ────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "legal@acme.com" };
    const result = generatePrivacyByDesignChecklist(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes GDPR Article 25 reference", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("GDPR Article 25"));
  });

  // ── Section 1: Data Minimization ──────────────────────────────────

  it("includes data minimization section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 1. Data Minimization (Article 5(1)(c))"));
    assert.ok(result.includes("Review each data collection point"));
    assert.ok(result.includes("minimum data required"));
  });

  it("includes auth-specific minimization items when auth services present", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user credentials"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("OAuth scopes"));
    assert.ok(result.includes("profile data essential for authentication"));
  });

  it("omits auth minimization items when no auth services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(!result.includes("OAuth scopes"));
  });

  it("includes analytics-specific minimization items when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("anonymize IP addresses"));
    assert.ok(result.includes("user-level tracking"));
    assert.ok(result.includes("analytics data retention"));
  });

  it("omits analytics minimization items when no analytics services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(!result.includes("anonymize IP addresses"));
  });

  it("includes advertising-specific minimization items when advertising present", () => {
    const scan = makeScan({
      services: [makeService("facebook-pixel", "advertising", ["ad interactions"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("advertising pixel"));
    assert.ok(result.includes("enhanced matching"));
  });

  it("includes email-specific minimization items when email present", () => {
    const scan = makeScan({
      services: [makeService("@sendgrid/mail", "email", ["email address"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("email addresses necessary for transactional"));
    assert.ok(result.includes("unsubscribe"));
  });

  it("includes monitoring-specific minimization items when monitoring present", () => {
    const scan = makeScan({
      services: [makeService("@sentry/node", "monitoring", ["error traces"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("Strip PII from error reports"));
    assert.ok(result.includes("anonymized identifiers"));
  });

  // ── Section 2: Purpose Limitation ─────────────────────────────────

  it("includes purpose limitation section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 2. Purpose Limitation (Article 5(1)(b))"));
    assert.ok(result.includes("lawful basis"));
    assert.ok(result.includes("Record of Processing Activities"));
  });

  it("includes AI-specific purpose limitation items when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("AI data processing"));
    assert.ok(result.includes("AI training data"));
    assert.ok(result.includes("model training"));
  });

  it("includes payment-specific purpose limitation items when payment present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("payment data usage to transaction processing"));
    assert.ok(result.includes("not use payment data for marketing"));
  });

  // ── Section 3: Storage Limitation ─────────────────────────────────

  it("includes storage limitation section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 3. Storage Limitation (Article 5(1)(e))"));
    assert.ok(result.includes("retention periods"));
    assert.ok(result.includes("automated data deletion"));
  });

  it("includes database-specific storage items when database present", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("soft-delete"));
    assert.ok(result.includes("automated database cleanup"));
  });

  it("includes storage-specific items when storage present", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage", ["files"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("object lifecycle policies"));
    assert.ok(result.includes("automated expiration"));
  });

  // ── Section 4: Integrity & Confidentiality ────────────────────────

  it("includes integrity and confidentiality section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 4. Integrity & Confidentiality (Article 5(1)(f))"));
    assert.ok(result.includes("Encrypt personal data at rest"));
    assert.ok(result.includes("TLS 1.2+"));
    assert.ok(result.includes("role-based access controls"));
    assert.ok(result.includes("audit logs"));
  });

  it("includes auth-specific integrity items when auth present", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user credentials"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("password hashing"));
    assert.ok(result.includes("session timeout"));
    assert.ok(result.includes("multi-factor authentication"));
  });

  it("includes payment-specific integrity items when payment present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("PCI DSS"));
    assert.ok(result.includes("tokenization"));
  });

  // ── Section 5: Transparency ───────────────────────────────────────

  it("includes transparency section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 5. Transparency (Articles 12-14)"));
    assert.ok(result.includes("Privacy Policy"));
    assert.ok(result.includes("sub-processors"));
  });

  it("includes AI transparency items when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("AI/automated decision-making"));
    assert.ok(result.includes("Article 22"));
  });

  it("includes cookie consent items when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("cookie consent banner"));
    assert.ok(result.includes("Cookie Policy"));
  });

  it("includes cookie consent items when advertising present", () => {
    const scan = makeScan({
      services: [makeService("facebook-pixel", "advertising", ["ad interactions"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("cookie consent banner"));
  });

  // ── Section 6: Data Subject Rights ────────────────────────────────

  it("includes data subject rights section", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 6. Data Subject Rights (Articles 15-22)"));
    assert.ok(result.includes("data access requests (Article 15)"));
    assert.ok(result.includes("data rectification (Article 16)"));
    assert.ok(result.includes("data erasure / right to be forgotten (Article 17)"));
    assert.ok(result.includes("data portability"));
    assert.ok(result.includes("30 days"));
  });

  it("includes AI-specific rights items when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("automated decision-making (Article 22)"));
    assert.ok(result.includes("human review"));
  });

  it("omits AI rights items when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(!result.includes("human review option for AI"));
  });

  // ── Section 7: PETs Recommendations ───────────────────────────────

  it("includes PETs recommendations section with general items", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 7. Privacy-Enhancing Technologies (PETs) Recommendations"));
    assert.ok(result.includes("Pseudonymization"));
    assert.ok(result.includes("Data masking"));
    assert.ok(result.includes("Access logging"));
  });

  it("includes analytics PETs when analytics present", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("### Analytics & Tracking"));
    assert.ok(result.includes("Differential privacy"));
    assert.ok(result.includes("K-anonymity"));
    assert.ok(result.includes("Server-side analytics"));
  });

  it("includes auth PETs when auth present", () => {
    const scan = makeScan({
      services: [makeService("@clerk/nextjs", "auth", ["user credentials"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("### Authentication & Identity"));
    assert.ok(result.includes("Zero-knowledge proofs"));
    assert.ok(result.includes("Token-based sessions"));
  });

  it("includes AI PETs when AI present", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("### AI & Machine Learning"));
    assert.ok(result.includes("Federated learning"));
    assert.ok(result.includes("Synthetic data"));
    assert.ok(result.includes("Model explainability"));
  });

  it("includes payment PETs when payment present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("### Payment Processing"));
    assert.ok(result.includes("Tokenization"));
    assert.ok(result.includes("Point-to-point encryption"));
  });

  it("includes storage PETs when database present", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("### Data Storage"));
    assert.ok(result.includes("Encryption at rest"));
    assert.ok(result.includes("Field-level encryption"));
    assert.ok(result.includes("Secure deletion"));
  });

  it("includes storage PETs when storage category present", () => {
    const scan = makeScan({
      services: [makeService("@aws-sdk/client-s3", "storage", ["files"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("### Data Storage"));
  });

  it("omits AI PETs section when no AI services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(!result.includes("### AI & Machine Learning"));
  });

  // ── Section 8: Detected Services Assessment ───────────────────────

  it("includes detected services assessment table", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info", "email"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 8. Detected Services"));
    assert.ok(result.includes("| Service | Category | Data Processed | Privacy Action Required |"));
    assert.ok(result.includes("stripe"));
    assert.ok(result.includes("payment info, email"));
  });

  it("shows correct privacy action for AI services", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("DPIA required"));
  });

  it("shows correct privacy action for analytics services", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("Consent mechanism"));
    assert.ok(result.includes("IP anonymization"));
  });

  it("shows correct privacy action for payment services", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("PCI DSS compliance"));
  });

  it("skips non-data-processor services in assessment table", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("zod", "other", ["validated input"], false),
      ],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("stripe"));
    // zod has isDataProcessor: false, so it should be excluded from the table
    const tableSection = result.split("Detected Services")[1]?.split("## 9")[0] || "";
    assert.ok(!tableSection.includes("| zod"));
  });

  // ── Section 9: Review Schedule ────────────────────────────────────

  it("includes review schedule", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("## 9. Review Schedule"));
    assert.ok(result.includes("Quarterly"));
    assert.ok(result.includes("Semi-annually"));
    assert.ok(result.includes("Annually"));
  });

  // ── Disclaimer ────────────────────────────────────────────────────

  it("includes Codepliant attribution and disclaimer", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    assert.ok(result.includes("Codepliant"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Combined categories trigger all conditional sections ──────────

  it("includes all conditional sections with comprehensive service set", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth", ["user credentials"]),
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("@aws-sdk/client-s3", "storage", ["files"]),
        makeService("@sendgrid/mail", "email", ["email address"]),
        makeService("@sentry/node", "monitoring", ["error traces"]),
        makeService("prisma", "database", ["user records"]),
      ],
    });
    const result = generatePrivacyByDesignChecklist(scan)!;
    // All conditional minimization items should be present
    assert.ok(result.includes("OAuth scopes"));
    assert.ok(result.includes("anonymize IP addresses"));
    assert.ok(result.includes("email addresses necessary"));
    assert.ok(result.includes("Strip PII from error reports"));
    // All conditional PETs should be present
    assert.ok(result.includes("### Analytics & Tracking"));
    assert.ok(result.includes("### Authentication & Identity"));
    assert.ok(result.includes("### AI & Machine Learning"));
    assert.ok(result.includes("### Payment Processing"));
    assert.ok(result.includes("### Data Storage"));
  });
});
