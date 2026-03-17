import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateComplianceCalendar } from "./compliance-calendar.js";
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

describe("generateComplianceCalendar", () => {
  // ── Null return cases ──────────────────────────────────────────────

  it("returns null when services array is empty", () => {
    const scan = makeScan({ services: [] });
    assert.strictEqual(generateComplianceCalendar(scan), null);
  });

  // ── Generation with services ───────────────────────────────────────

  it("generates calendar with a single service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result !== null);
    assert.ok(result.includes("# Compliance Calendar"));
  });

  it("generates calendar with multiple services", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
      ],
    });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("# Compliance Calendar"));
    assert.ok(result.includes("3 detected service(s)"));
  });

  // ── Context values ─────────────────────────────────────────────────

  it("uses context company name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "a@a.com" };
    const result = generateComplianceCalendar(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("[Your Company Name]"));
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(result));
  });

  it("includes project name", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("test-project"));
  });

  it("includes disclaimer about legal advice", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("not legal advice"));
  });

  // ── Applicable Regulations section ─────────────────────────────────

  it("includes Applicable Regulations section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Applicable Regulations"));
  });

  it("shows GDPR by default when no jurisdictions specified", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("**GDPR**"));
  });

  it("shows GDPR when gdpr in jurisdictions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["gdpr"] };
    const result = generateComplianceCalendar(scan, ctx)!;
    assert.ok(result.includes("**GDPR**"));
  });

  it("shows CCPA when ccpa in jurisdictions", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", jurisdictions: ["ccpa"] };
    const result = generateComplianceCalendar(scan, ctx)!;
    assert.ok(result.includes("**CCPA/CPRA**"));
  });

  it("shows CCPA when companyLocation is US", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "a@a.com", companyLocation: "US" };
    const result = generateComplianceCalendar(scan, ctx)!;
    assert.ok(result.includes("**CCPA/CPRA**"));
  });

  it("shows CCPA when analytics services detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("**CCPA/CPRA**"));
  });

  it("shows EU AI Act when AI services detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("**EU AI Act**"));
  });

  it("does not show EU AI Act without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("**EU AI Act**"));
  });

  it("shows PCI DSS when payment services detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("**PCI DSS**"));
  });

  it("shows ePrivacy Directive when analytics services detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("**ePrivacy Directive**"));
  });

  it("shows CAN-SPAM when email services detected", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("**CAN-SPAM Act**"));
  });

  // ── Monthly Calendar section ───────────────────────────────────────

  it("includes Monthly Calendar section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Monthly Calendar"));
  });

  it("includes all 12 months", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    for (const month of monthNames) {
      assert.ok(result.includes(`### ${month}`), `Missing month: ${month}`);
    }
  });

  // ── Recurring monthly activities ───────────────────────────────────

  it("includes recurring monthly review activities", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review data breach and incident logs"));
    assert.ok(result.includes("Verify consent mechanisms are operational"));
  });

  it("includes monitoring review when monitoring service detected", () => {
    const scan = makeScan({ services: [makeService("sentry", "monitoring")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review error monitoring and alerting thresholds"));
  });

  it("does not include monitoring review without monitoring service", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("Review error monitoring and alerting thresholds"));
  });

  // ── Quarterly activities ───────────────────────────────────────────

  it("includes quarterly re-run Codepliant activity", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Re-run Codepliant to detect new services"));
  });

  it("includes quarterly compliance status report", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Quarterly compliance status report"));
  });

  it("includes quarterly DSAR review when GDPR shown", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    // GDPR is shown by default
    assert.ok(result.includes("Verify DSAR response procedures"));
  });

  it("includes quarterly PCI DSS vulnerability scan when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("PCI DSS quarterly vulnerability scan"));
  });

  it("does not include PCI DSS scan without payment services", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("PCI DSS quarterly vulnerability scan"));
  });

  it("includes quarterly analytics review when analytics detected", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review analytics data sharing and cookie consent"));
  });

  // ── Semi-annual activities ─────────────────────────────────────────

  it("includes semi-annual compliance audits in January and July", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Conduct internal compliance audit (H1)"));
    assert.ok(result.includes("Conduct internal compliance audit (H2)"));
  });

  it("includes semi-annual AI risk assessment when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("AI system risk re-assessment (H1)"));
    assert.ok(result.includes("AI system risk re-assessment (H2)"));
  });

  it("does not include AI risk assessment without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("AI system risk re-assessment"));
  });

  // ── Annual activities ──────────────────────────────────────────────

  it("includes annual privacy policy review in January", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Full privacy policy review and update"));
  });

  it("includes annual compliance summary report in January", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Annual compliance summary report"));
  });

  it("includes CCPA disclosures update when CCPA shown", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Update CCPA disclosures"));
    assert.ok(result.includes("Do Not Sell or Share"));
  });

  it("includes PCI DSS annual self-assessment when payment detected", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("PCI DSS annual Self-Assessment Questionnaire"));
  });

  it("includes staff training in February", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Staff data protection training refresh"));
  });

  it("includes vendor review in March", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Annual vendor and sub-processor review"));
  });

  it("includes backup and DR review in March when storage detected", () => {
    const scan = makeScan({ services: [makeService("s3", "storage")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review data backup and disaster recovery procedures"));
  });

  it("does not include backup review without storage/database services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("Review data backup and disaster recovery procedures"));
  });

  it("includes data retention review in May", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review and enforce data retention schedules"));
  });

  it("includes encryption verification in May when storage detected", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Verify encryption at rest for all personal data stores"));
  });

  it("includes access control review in June", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review access controls and authentication policies"));
  });

  it("includes auth session audit in June when auth detected", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Audit authentication session lengths and token lifetimes"));
  });

  it("does not include auth audit without auth services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("Audit authentication session lengths"));
  });

  it("includes AI disclosure review in August when AI detected", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review AI Disclosure document for EU AI Act compliance"));
    assert.ok(result.includes("Update AI Model Card and transparency documentation"));
  });

  it("does not include AI August activities without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("Review AI Disclosure document"));
  });

  it("includes breach response drill in September", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Conduct data breach response drill"));
  });

  it("includes email consent review in September when email detected", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review email marketing consent records"));
  });

  it("does not include email review without email services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("Review email marketing consent records"));
  });

  it("includes GDPR transfer review in October when GDPR shown", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Review international data transfer safeguards"));
    assert.ok(result.includes("Update Record of Processing Activities (GDPR Art. 30)"));
  });

  it("includes pre-audit preparation in November", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Pre-audit preparation and gap analysis"));
  });

  it("includes annual review report in December", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Annual compliance review report for board/leadership"));
  });

  // ── Annual Summary section ─────────────────────────────────────────

  it("includes Annual Summary table", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Annual Summary"));
    assert.ok(result.includes("| Month | Review | Update | Report |"));
    assert.ok(result.includes("**Total**"));
  });

  it("shows item counts per month in summary", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    // Each month should have at least the 2 recurring review items
    assert.ok(result.includes("items"));
  });

  // ── Service-Specific Compliance Activities section ─────────────────

  it("includes Service-Specific Compliance Activities section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Service-Specific Compliance Activities"));
  });

  it("includes AI services subsection with service names", () => {
    const scan = makeScan({ services: [makeService("openai", "ai")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("### AI Services (openai)"));
    assert.ok(result.includes("Semi-annual AI risk re-assessment"));
    assert.ok(result.includes("Annual AI Disclosure and Model Card review"));
  });

  it("includes Payment services subsection with service names", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("### Payment Services (stripe)"));
    assert.ok(result.includes("Annual PCI DSS Self-Assessment"));
    assert.ok(result.includes("Quarterly vulnerability scans"));
  });

  it("includes Analytics subsection with service names", () => {
    const scan = makeScan({ services: [makeService("posthog", "analytics")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("### Analytics / Advertising (posthog)"));
    assert.ok(result.includes("Quarterly cookie consent review"));
  });

  it("includes Auth services subsection with service names", () => {
    const scan = makeScan({ services: [makeService("@clerk/nextjs", "auth")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("### Authentication Services (@clerk/nextjs)"));
    assert.ok(result.includes("Semi-annual access control audit"));
  });

  it("includes Email services subsection with service names", () => {
    const scan = makeScan({ services: [makeService("resend", "email")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("### Email Services (resend)"));
    assert.ok(result.includes("Annual consent record review"));
  });

  it("includes Storage/Database services subsection with service names", () => {
    const scan = makeScan({ services: [makeService("prisma", "database")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("### Storage / Database Services (prisma)"));
    assert.ok(result.includes("Annual backup and DR review"));
    assert.ok(result.includes("Encryption verification"));
  });

  it("does not include AI subsection without AI services", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(!result.includes("### AI Services"));
  });

  // ── Tips section ───────────────────────────────────────────────────

  it("includes Tips section", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Tips for Using This Calendar"));
    assert.ok(result.includes("Set reminders"));
    assert.ok(result.includes("Assign owners"));
    assert.ok(result.includes("Re-generate"));
  });

  // ── Footer ─────────────────────────────────────────────────────────

  it("includes Codepliant attribution", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("Codepliant"));
  });

  it("includes informational purposes disclaimer", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const result = generateComplianceCalendar(scan)!;
    assert.ok(result.includes("informational purposes only"));
    assert.ok(result.includes("does not constitute legal advice"));
  });

  // ── Comprehensive test ─────────────────────────────────────────────

  it("generates comprehensive calendar with all service categories", () => {
    const scan = makeScan({
      services: [
        makeService("@clerk/nextjs", "auth"),
        makeService("prisma", "database"),
        makeService("stripe", "payment"),
        makeService("posthog", "analytics"),
        makeService("openai", "ai"),
        makeService("resend", "email"),
        makeService("sentry", "monitoring"),
        makeService("s3", "storage"),
      ],
    });
    const ctx: GeneratorContext = {
      companyName: "Acme Corp",
      contactEmail: "privacy@acme.com",
      jurisdictions: ["gdpr", "ccpa"],
      companyLocation: "US",
    };
    const result = generateComplianceCalendar(scan, ctx)!;
    assert.ok(result.includes("Acme Corp"));
    assert.ok(result.includes("8 detected service(s)"));
    // All regulations
    assert.ok(result.includes("**GDPR**"));
    assert.ok(result.includes("**CCPA/CPRA**"));
    assert.ok(result.includes("**EU AI Act**"));
    assert.ok(result.includes("**PCI DSS**"));
    assert.ok(result.includes("**ePrivacy Directive**"));
    assert.ok(result.includes("**CAN-SPAM Act**"));
    // All service-specific sections
    assert.ok(result.includes("### AI Services"));
    assert.ok(result.includes("### Payment Services"));
    assert.ok(result.includes("### Analytics / Advertising"));
    assert.ok(result.includes("### Authentication Services"));
    assert.ok(result.includes("### Email Services"));
    assert.ok(result.includes("### Storage / Database Services"));
    // Conditional activities present
    assert.ok(result.includes("AI system risk re-assessment"));
    assert.ok(result.includes("PCI DSS quarterly vulnerability scan"));
    assert.ok(result.includes("Review error monitoring and alerting thresholds"));
    assert.ok(result.includes("Audit authentication session lengths"));
  });
});
