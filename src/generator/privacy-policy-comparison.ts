import type { ScanResult, DetectedService } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/**
 * Industry-standard privacy policy checklist items.
 * Each item represents a section/topic that mature privacy policies cover.
 */
interface ChecklistItem {
  id: string;
  section: string;
  description: string;
  /** Which companies typically include this — for reference. */
  examples: string[];
  /** How to detect if the generated policy covers this. */
  detectFn: (scan: ScanResult, ctx?: GeneratorContext) => boolean;
  /** Regulation that requires or recommends this. */
  regulation: string;
}

const CHECKLIST: ChecklistItem[] = [
  {
    id: "data-controller-identity",
    section: "Data Controller Identity",
    description: "Company name, address, and contact details of the data controller",
    examples: ["Stripe", "Vercel", "Linear", "Notion"],
    detectFn: (_, ctx) => !!(ctx?.companyName && !ctx.companyName.includes("[")),
    regulation: "GDPR Art. 13(1)(a)",
  },
  {
    id: "dpo-contact",
    section: "DPO Contact Information",
    description: "Contact details for the Data Protection Officer",
    examples: ["Stripe", "Vercel", "Linear"],
    detectFn: (_, ctx) => !!(ctx?.dpoEmail || ctx?.dpoName),
    regulation: "GDPR Art. 13(1)(b)",
  },
  {
    id: "data-collected",
    section: "Types of Data Collected",
    description: "Clear listing of personal data categories collected",
    examples: ["Stripe", "Vercel", "Linear", "Notion", "GitHub"],
    detectFn: (scan) => scan.services.length > 0,
    regulation: "GDPR Art. 13(1)(d)",
  },
  {
    id: "purpose-of-processing",
    section: "Purpose of Processing",
    description: "Specific purposes for each type of data processing",
    examples: ["Stripe", "Vercel", "Linear", "Notion"],
    detectFn: (scan) => scan.services.length > 0,
    regulation: "GDPR Art. 13(1)(c)",
  },
  {
    id: "legal-basis",
    section: "Legal Basis for Processing",
    description: "GDPR Article 6 lawful basis for each processing activity",
    examples: ["Stripe", "Vercel", "Linear"],
    detectFn: (scan) => scan.services.length > 0,
    regulation: "GDPR Art. 13(1)(c)",
  },
  {
    id: "data-retention",
    section: "Data Retention Periods",
    description: "How long each category of data is retained",
    examples: ["Stripe", "Vercel", "Linear", "Notion"],
    detectFn: (_, ctx) => !!(ctx?.dataRetentionDays),
    regulation: "GDPR Art. 13(2)(a)",
  },
  {
    id: "user-rights",
    section: "User Rights (Access, Rectification, Erasure, Portability)",
    description: "How users can exercise their GDPR/CCPA data rights",
    examples: ["Stripe", "Vercel", "Linear", "Notion", "GitHub"],
    detectFn: () => true, // Always generated
    regulation: "GDPR Art. 13(2)(b-d)",
  },
  {
    id: "third-party-sharing",
    section: "Third-Party Data Sharing",
    description: "Who data is shared with and why (sub-processors)",
    examples: ["Stripe", "Vercel", "Linear", "Notion"],
    detectFn: (scan) => scan.services.filter((s) => s.isDataProcessor !== false).length > 0,
    regulation: "GDPR Art. 13(1)(e-f)",
  },
  {
    id: "international-transfers",
    section: "International Data Transfers",
    description: "Cross-border data transfer mechanisms (SCCs, adequacy decisions)",
    examples: ["Stripe", "Vercel", "Linear"],
    detectFn: (scan) => scan.services.some((s) => s.category === "ai" || s.category === "analytics" || s.category === "payment"),
    regulation: "GDPR Art. 13(1)(f)",
  },
  {
    id: "cookie-policy",
    section: "Cookie Policy / Tracking Technologies",
    description: "Description of cookies, pixels, and tracking technologies used",
    examples: ["Stripe", "Vercel", "Linear", "Notion", "GitHub"],
    detectFn: (scan) => scan.services.some((s) => s.category === "analytics" || s.category === "advertising"),
    regulation: "ePrivacy Directive Art. 5(3)",
  },
  {
    id: "ai-disclosure",
    section: "AI / Automated Decision-Making Disclosure",
    description: "Description of AI usage, automated decisions, and user opt-out",
    examples: ["Notion", "Linear", "Vercel"],
    detectFn: (scan) => scan.services.some((s) => s.category === "ai"),
    regulation: "GDPR Art. 22, EU AI Act",
  },
  {
    id: "children-privacy",
    section: "Children's Privacy (COPPA)",
    description: "Age restrictions and parental consent mechanisms",
    examples: ["Stripe", "Notion", "GitHub"],
    detectFn: () => true, // Always recommended
    regulation: "COPPA, GDPR Art. 8",
  },
  {
    id: "security-measures",
    section: "Security Measures",
    description: "Technical and organizational measures to protect data",
    examples: ["Stripe", "Vercel", "Linear"],
    detectFn: () => true, // Always generated
    regulation: "GDPR Art. 32",
  },
  {
    id: "consent-mechanism",
    section: "Consent Collection / Withdrawal",
    description: "How consent is collected and how users can withdraw it",
    examples: ["Stripe", "Vercel", "Linear", "Notion"],
    detectFn: (scan) => scan.services.some((s) => s.category === "analytics" || s.category === "email" || s.category === "advertising"),
    regulation: "GDPR Art. 7",
  },
  {
    id: "right-to-complain",
    section: "Right to Lodge a Complaint",
    description: "Information about the right to complain to a supervisory authority",
    examples: ["Stripe", "Vercel", "Linear"],
    detectFn: () => true, // Always generated
    regulation: "GDPR Art. 13(2)(d)",
  },
  {
    id: "policy-updates",
    section: "Policy Update Notification",
    description: "How users will be notified of privacy policy changes",
    examples: ["Stripe", "Vercel", "Linear", "Notion", "GitHub"],
    detectFn: () => true, // Always generated
    regulation: "Best practice",
  },
  {
    id: "contact-information",
    section: "Contact Information for Privacy Inquiries",
    description: "Dedicated email/form for privacy-related questions",
    examples: ["Stripe", "Vercel", "Linear", "Notion", "GitHub"],
    detectFn: (_, ctx) => !!(ctx?.contactEmail && !ctx.contactEmail.includes("[")),
    regulation: "GDPR Art. 13(1)(a)",
  },
  {
    id: "ccpa-disclosure",
    section: "CCPA-Specific Disclosures",
    description: "California-specific rights, categories of data sold/shared, opt-out",
    examples: ["Stripe", "Vercel", "Notion", "GitHub"],
    detectFn: (_, ctx) => {
      const jurisdictions = ctx?.jurisdiction ? [ctx.jurisdiction] : (ctx?.jurisdictions || []);
      return jurisdictions.some((j) => j.toLowerCase().includes("ccpa")) || true; // Recommended for all US-serving companies
    },
    regulation: "CCPA/CPRA",
  },
  {
    id: "do-not-sell",
    section: "Do Not Sell My Personal Information",
    description: "Mechanism for opting out of data sale (CCPA requirement)",
    examples: ["Stripe", "Notion", "GitHub"],
    detectFn: (scan) => scan.services.some((s) => s.category === "analytics" || s.category === "advertising"),
    regulation: "CCPA Sec. 1798.120",
  },
  {
    id: "data-breach-notification",
    section: "Data Breach Notification Procedures",
    description: "How affected users will be notified in case of a data breach",
    examples: ["Stripe", "Vercel"],
    detectFn: () => true, // Always recommended
    regulation: "GDPR Art. 34",
  },
  {
    id: "sub-processor-list",
    section: "Sub-Processor List",
    description: "Published list of sub-processors with purposes and locations",
    examples: ["Stripe", "Vercel", "Linear", "Notion"],
    detectFn: (scan) => scan.services.filter((s) => s.isDataProcessor !== false).length >= 3,
    regulation: "GDPR Art. 28(2)",
  },
  {
    id: "data-portability",
    section: "Data Portability",
    description: "How users can export their data in a machine-readable format",
    examples: ["Stripe", "Linear", "Notion", "GitHub"],
    detectFn: () => true, // Always recommended
    regulation: "GDPR Art. 20",
  },
  {
    id: "eu-representative",
    section: "EU Representative",
    description: "Designated representative in the EU for non-EU companies",
    examples: ["Stripe", "Notion"],
    detectFn: (_, ctx) => !!ctx?.euRepresentative,
    regulation: "GDPR Art. 27",
  },
];

// ── Industry comparison data ────────────────────────────────────────

interface IndustryExample {
  company: string;
  url: string;
  strengths: string[];
  notableFeatures: string[];
}

const INDUSTRY_EXAMPLES: IndustryExample[] = [
  {
    company: "Stripe",
    url: "https://stripe.com/privacy",
    strengths: [
      "Comprehensive sub-processor list with change notification",
      "Clear data flow descriptions per product",
      "Jurisdiction-specific addenda (EU, UK, Japan, Brazil)",
      "Dedicated privacy center with visual data map",
    ],
    notableFeatures: [
      "Interactive privacy center",
      "Per-product data processing details",
      "Published DPA template",
      "Regular sub-processor change notifications",
    ],
  },
  {
    company: "Vercel",
    url: "https://vercel.com/legal/privacy-policy",
    strengths: [
      "Clear distinction between customer data and visitor data",
      "Specific analytics data collection disclosure",
      "Edge function data processing transparency",
    ],
    notableFeatures: [
      "Developer-friendly privacy documentation",
      "Clear data residency information",
      "Published sub-processor list",
    ],
  },
  {
    company: "Linear",
    url: "https://linear.app/privacy",
    strengths: [
      "Concise yet comprehensive privacy policy",
      "Clear AI feature data usage disclosure",
      "Specific data retention periods",
    ],
    notableFeatures: [
      "AI feature transparency",
      "Clear data minimization practices",
      "SOC 2 Type II reference",
    ],
  },
  {
    company: "Notion",
    url: "https://www.notion.so/Privacy-Policy",
    strengths: [
      "Detailed AI training data opt-out",
      "Comprehensive third-party service disclosure",
      "Clear data portability instructions",
    ],
    notableFeatures: [
      "AI training data transparency",
      "Workspace admin controls documentation",
      "Data export functionality highlighted",
    ],
  },
  {
    company: "GitHub",
    url: "https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement",
    strengths: [
      "Extremely detailed data collection inventory",
      "Repository data handling specifics",
      "Copilot AI data usage transparency",
    ],
    notableFeatures: [
      "Per-feature data collection breakdown",
      "Open-source policy approach",
      "Detailed telemetry disclosure",
    ],
  },
];

/**
 * Generate a PRIVACY_POLICY_COMPARISON.md that compares the generated
 * privacy policy against industry standards.
 *
 * Returns null when no services are detected.
 */
export function generatePrivacyPolicyComparison(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Evaluate checklist
  const results = CHECKLIST.map((item) => ({
    ...item,
    covered: item.detectFn(scan, ctx),
  }));

  const coveredCount = results.filter((r) => r.covered).length;
  const totalCount = results.length;
  const percentage = Math.round((coveredCount / totalCount) * 100);

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────

  sections.push(`# Privacy Policy Comparison

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Organization:** ${company}

---

## Purpose

This document compares your generated privacy policy against industry standards and best practices. It identifies gaps, provides recommendations, and benchmarks against privacy policies from leading technology companies.

For questions about this comparison, contact ${email}.

---

## Coverage Score

**${coveredCount} / ${totalCount} items covered (${percentage}%)**

${"#".repeat(Math.round(percentage / 5))}${"_".repeat(20 - Math.round(percentage / 5))} ${percentage}%

${percentage >= 90 ? "Excellent coverage. Your privacy policy meets or exceeds industry standards." : percentage >= 70 ? "Good coverage. A few areas could be strengthened to match industry leaders." : percentage >= 50 ? "Moderate coverage. Several important sections are missing or incomplete." : "Needs improvement. Many standard privacy policy sections are missing."}

---

## Checklist Comparison

| # | Section | Covered | Regulation | Industry Standard |
|---|---------|---------|-----------|-------------------|`);

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const status = r.covered ? "Yes" : "**No**";
    const exampleStr = r.examples.slice(0, 3).join(", ");
    sections.push(
      `| ${i + 1} | ${r.section} | ${status} | ${r.regulation} | ${exampleStr} |`,
    );
  }

  // ── Gap Analysis ───────────────────────────────────────────────────

  const gaps = results.filter((r) => !r.covered);

  if (gaps.length > 0) {
    sections.push(`
---

## Gap Analysis

The following sections are missing or incomplete in your current privacy policy configuration:
`);

    for (const gap of gaps) {
      sections.push(`### ${gap.section}

- **Description:** ${gap.description}
- **Regulation:** ${gap.regulation}
- **Industry examples:** ${gap.examples.join(", ")}
- **Recommendation:** Add this section to your privacy policy. ${getRecommendation(gap.id, ctx)}
`);
    }
  }

  // ── Industry Comparison ────────────────────────────────────────────

  sections.push(`
---

## Industry Benchmarks

How leading companies handle their privacy policies:
`);

  for (const example of INDUSTRY_EXAMPLES) {
    const strengthsList = example.strengths.map((s) => `- ${s}`).join("\n");
    const featuresList = example.notableFeatures.map((f) => `- ${f}`).join("\n");

    sections.push(`### ${example.company}

**Privacy Policy:** [${example.url}](${example.url})

**Strengths:**

${strengthsList}

**Notable Features:**

${featuresList}
`);
  }

  // ── Recommendations ────────────────────────────────────────────────

  sections.push(`---

## Recommendations

### Priority Actions`);

  const highPriority = gaps.filter((g) =>
    g.regulation.includes("GDPR Art. 13") || g.regulation.includes("CCPA"),
  );
  const mediumPriority = gaps.filter(
    (g) => !highPriority.includes(g) && g.regulation !== "Best practice",
  );
  const lowPriority = gaps.filter((g) => g.regulation === "Best practice");

  if (highPriority.length > 0) {
    sections.push(`
**High Priority (regulatory requirement):**
`);
    for (const g of highPriority) {
      sections.push(`- [ ] Add **${g.section}** (${g.regulation})`);
    }
  }

  if (mediumPriority.length > 0) {
    sections.push(`
**Medium Priority (recommended):**
`);
    for (const g of mediumPriority) {
      sections.push(`- [ ] Add **${g.section}** (${g.regulation})`);
    }
  }

  if (lowPriority.length > 0) {
    sections.push(`
**Low Priority (best practice):**
`);
    for (const g of lowPriority) {
      sections.push(`- [ ] Add **${g.section}**`);
    }
  }

  if (gaps.length === 0) {
    sections.push(`
All checklist items are covered. Consider the following enhancements to further align with industry leaders:

- [ ] Add an interactive privacy center (like Stripe)
- [ ] Publish per-feature data collection breakdowns (like GitHub)
- [ ] Provide visual data flow diagrams in your privacy policy
- [ ] Add jurisdiction-specific addenda for key markets
- [ ] Implement a privacy policy changelog with version history`);
  }

  // ── Configuration Tips ─────────────────────────────────────────────

  sections.push(`

---

## Improving Your Score

To improve your privacy policy coverage, update your \`.codepliantrc.json\` configuration:

\`\`\`json
{
  "companyName": "Your Company Name",
  "contactEmail": "privacy@yourcompany.com",
  "dpoName": "Jane Doe",
  "dpoEmail": "dpo@yourcompany.com",
  "euRepresentative": "EU Rep Name, Address",
  "dataRetentionDays": 365,
  "jurisdiction": "GDPR",
  "jurisdictions": ["GDPR", "CCPA"]
}
\`\`\`

Each configured field enables additional privacy policy sections that align with regulatory requirements.

---

## Review Schedule

This comparison should be reviewed:

- **Quarterly** to track improvement progress
- **When updating** your privacy policy
- **When adding** new third-party services
- **When entering** new geographic markets

---

*This privacy policy comparison was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. This is an internal assessment tool and does not constitute legal advice. Consult with a qualified privacy attorney for compliance guidance.*`);

  return sections.join("\n");
}

/** Get a specific recommendation for a gap. */
function getRecommendation(id: string, ctx?: GeneratorContext): string {
  switch (id) {
    case "data-controller-identity":
      return 'Run `codepliant init` to set your company name and address.';
    case "dpo-contact":
      return 'Add `"dpoName"` and `"dpoEmail"` to your `.codepliantrc.json`.';
    case "data-retention":
      return 'Add `"dataRetentionDays"` to your `.codepliantrc.json`.';
    case "contact-information":
      return 'Run `codepliant init` to set your contact email.';
    case "eu-representative":
      return 'Add `"euRepresentative"` to your `.codepliantrc.json` if your company is outside the EU.';
    case "international-transfers":
      return "This section is auto-generated when AI, analytics, or payment services are detected.";
    case "cookie-policy":
      return "This section is auto-generated when analytics or advertising services are detected.";
    case "ai-disclosure":
      return "This section is auto-generated when AI services are detected.";
    case "sub-processor-list":
      return "This section is auto-generated when 3+ third-party data processors are detected.";
    default:
      return "Review industry examples above for guidance on implementing this section.";
  }
}
