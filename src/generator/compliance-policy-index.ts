import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";

/**
 * Generates COMPLIANCE_POLICY_INDEX.md — a master index of ALL generated
 * compliance documents, grouped by category with descriptions and links.
 *
 * Always generated when documents exist (every compliance library needs
 * an index so stakeholders can find what they need).
 */

interface DocCategory {
  name: string;
  description: string;
  patterns: string[];
}

const DOC_CATEGORIES: DocCategory[] = [
  {
    name: "Privacy & Data Protection",
    description: "Core privacy policies, data handling procedures, and GDPR/CCPA compliance documents",
    patterns: [
      "PRIVACY_POLICY", "DATA_PROCESSING_AGREEMENT", "DATA_RETENTION",
      "DATA_CLASSIFICATION", "DATA_DICTIONARY", "DATA_FLOW", "DATA_MAPPING",
      "DATA_SUBJECT", "DATA_DELETION", "DATA_PORTABILITY", "DATA_PROTECTION",
      "DATA_LIFECYCLE", "DSAR", "RECORD_OF_PROCESSING", "LAWFUL_BASIS",
      "PRIVACY_NOTICE", "PRIVACY_IMPACT", "PRIVACY_RISK", "PRIVACY_BY_DESIGN",
      "PRIVACY_DASHBOARD", "PRIVACY_PROGRAM", "PRIVACY_ROADMAP",
      "PRIVACY_POLICY_CHANGELOG", "PRIVACY_POLICY_COMPARISON",
    ],
  },
  {
    name: "AI & Machine Learning",
    description: "AI governance, disclosure, ethics, and regulatory compliance for AI/ML systems",
    patterns: [
      "AI_DISCLOSURE", "AI_ACT", "AI_MODEL_CARD", "AI_GOVERNANCE",
      "AI_ETHICS", "AI_IMPACT", "AI_RED_TEAM", "AI_TRAINING_DATA",
      "AI_SUPPLY_CHAIN", "ACCEPTABLE_AI_USE",
    ],
  },
  {
    name: "Security",
    description: "Information security policies, access controls, encryption, and vulnerability management",
    patterns: [
      "SECURITY", "ACCESS_CONTROL", "ENCRYPTION", "VULNERABILITY",
      "PENTEST", "INFORMATION_SECURITY", "SECURITY_AWARENESS",
      "RESPONSIBLE_DISCLOSURE",
    ],
  },
  {
    name: "Incident Management",
    description: "Incident response plans, breach notification templates, and severity matrices",
    patterns: [
      "INCIDENT_RESPONSE", "INCIDENT_SEVERITY", "INCIDENT_COMMUNICATION",
      "DATA_BREACH", "DISASTER_RECOVERY", "BUSINESS_CONTINUITY", "BACKUP",
    ],
  },
  {
    name: "Vendor & Third-Party Management",
    description: "Sub-processor management, vendor risk assessment, and supplier compliance",
    patterns: [
      "SUBPROCESSOR", "VENDOR", "THIRD_PARTY", "SUPPLIER_CODE",
      "TRANSFER_IMPACT", "CROSS_BORDER",
    ],
  },
  {
    name: "Cookies & Consent",
    description: "Cookie policies, consent management, and tracking disclosure",
    patterns: [
      "COOKIE", "CONSENT",
    ],
  },
  {
    name: "Compliance Frameworks",
    description: "SOC 2, ISO 27001, and regulatory readiness checklists",
    patterns: [
      "SOC2", "ISO_27001", "REGULATORY_READINESS", "COMPLIANCE_GAP",
      "COMPLIANCE_MATURITY", "COMPLIANCE_SCORECARD", "COMPLIANCE_KPI",
      "COMPLIANCE_CERTIFICATE", "COMPLIANCE_OATH", "COMPLIANCE_AUTOMATION",
    ],
  },
  {
    name: "Legal & Terms",
    description: "Terms of service, acceptable use, refund policy, and API terms",
    patterns: [
      "TERMS_OF_SERVICE", "ACCEPTABLE_USE_POLICY", "REFUND_POLICY",
      "SERVICE_LEVEL", "API_TERMS", "API_PRIVACY",
    ],
  },
  {
    name: "Organizational",
    description: "Employee policies, training records, DPO handbook, and whistleblower protections",
    patterns: [
      "EMPLOYEE", "TRAINING_RECORD", "DPO_HANDBOOK", "WHISTLEBLOWER",
      "MEDIA_CONSENT", "KEY_PERSON", "CHANGE_MANAGEMENT",
    ],
  },
  {
    name: "Reporting & Communication",
    description: "Executive dashboards, compliance summaries, and stakeholder communications",
    patterns: [
      "EXECUTIVE", "COMPLIANCE_SUMMARY", "TRANSPARENCY_REPORT",
      "COMPLIANCE_COMMUNICATION", "COMPLIANCE_BUDGET", "COMPLIANCE_REPORT",
      "REGULATORY_CORRESPONDENCE",
    ],
  },
  {
    name: "Risk Management",
    description: "Risk registers, annual reviews, and compliance timelines",
    patterns: [
      "RISK_REGISTER", "ANNUAL_REVIEW", "COMPLIANCE_TIMELINE",
      "COMPLIANCE_ROADMAP", "AUDIT_LOG",
    ],
  },
  {
    name: "Guides & References",
    description: "Quick start guides, glossaries, FAQs, and open source notices",
    patterns: [
      "QUICK_START", "COMPLIANCE_GLOSSARY", "COMPLIANCE_FAQ",
      "OPEN_SOURCE_NOTICE", "LICENSE_COMPLIANCE", "COMPLIANCE_NOTES",
      "REGULATORY_UPDATES", "ENV_AUDIT",
    ],
  },
];

function categorizeDoc(doc: GeneratedDocument): string {
  const upper = doc.filename.toUpperCase();
  for (const cat of DOC_CATEGORIES) {
    for (const pattern of cat.patterns) {
      if (upper.includes(pattern)) {
        return cat.name;
      }
    }
  }
  return "Other";
}

export function generateCompliancePolicyIndex(
  scan: ScanResult,
  ctx?: GeneratorContext,
  docs?: GeneratedDocument[],
): string | null {
  if (!docs || docs.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  // Group documents by category
  const grouped = new Map<string, GeneratedDocument[]>();
  for (const doc of docs) {
    const cat = categorizeDoc(doc);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(doc);
  }

  // Sort categories by DOC_CATEGORIES order, then "Other" last
  const categoryOrder = DOC_CATEGORIES.map((c) => c.name);
  const sortedCategories = [...grouped.entries()].sort((a, b) => {
    const ai = categoryOrder.indexOf(a[0]);
    const bi = categoryOrder.indexOf(b[0]);
    if (ai === -1 && bi === -1) return a[0].localeCompare(b[0]);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const categoriesWithDocs = sortedCategories.filter(([, d]) => d.length > 0);
  const totalDocs = docs.length;
  const totalCategories = categoriesWithDocs.length;

  const lines: string[] = [];

  // Header
  lines.push("# Compliance Policy Index");
  lines.push("");
  lines.push(`**Organization:** ${company}`);
  lines.push(`**Last updated:** ${date}`);
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    `> Your compliance library contains **${totalDocs} documents** across **${totalCategories} categories**. This index provides a complete overview of every generated compliance document, organized by topic for easy navigation.`,
  );
  lines.push("");

  // Summary table
  lines.push("## Summary");
  lines.push("");
  lines.push("| Category | Documents |");
  lines.push("|----------|-----------|");
  for (const [cat, catDocs] of categoriesWithDocs) {
    lines.push(`| ${cat} | ${catDocs.length} |`);
  }
  lines.push(`| **Total** | **${totalDocs}** |`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Each category section
  for (const [cat, catDocs] of categoriesWithDocs) {
    const catMeta = DOC_CATEGORIES.find((c) => c.name === cat);
    const description = catMeta?.description || "Additional compliance documents";

    lines.push(`## ${cat}`);
    lines.push("");
    lines.push(`*${description}*`);
    lines.push("");
    lines.push("| Document | Filename |");
    lines.push("|----------|----------|");
    for (const doc of catDocs.sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(`| ${doc.name} | \`${doc.filename}\` |`);
    }
    lines.push("");
  }

  // How to use
  lines.push("---");
  lines.push("");
  lines.push("## How to Use This Index");
  lines.push("");
  lines.push("1. **New to compliance?** Start with the [Quick Start Compliance Guide](QUICK_START_COMPLIANCE_GUIDE.md) and [Compliance Roadmap](COMPLIANCE_ROADMAP.md)");
  lines.push("2. **Preparing for audit?** Review the [Compliance Certificate](COMPLIANCE_CERTIFICATE.md), [SOC 2 Readiness Checklist](SOC2_READINESS_CHECKLIST.md), and [ISO 27001 Checklist](ISO_27001_CHECKLIST.md)");
  lines.push("3. **Responding to a DSAR?** See [DSAR Handling Guide](DSAR_HANDLING_GUIDE.md), [Data Deletion Procedures](DATA_DELETION_PROCEDURES.md), and [Vendor Contacts Directory](VENDOR_CONTACTS.md)");
  lines.push("4. **Board reporting?** Use the [Executive Dashboard](EXECUTIVE_DASHBOARD.md) or [Compliance Summary Email](COMPLIANCE_SUMMARY_EMAIL.md)");
  lines.push("5. **Vendor evaluation?** Share the [Vendor Security Questionnaire](VENDOR_SECURITY_QUESTIONNAIRE.md) and [Compliance Certificate](COMPLIANCE_CERTIFICATE.md)");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) on ${date}. This index is auto-generated from code analysis. All documents should be reviewed by qualified legal counsel.*`);

  return lines.join("\n");
}
