import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates PRIVACY_POLICY_CHANGELOG.md — a structured changelog tracking
 * all changes to the privacy policy over time.
 *
 * GDPR Art. 13(1) and Art. 14(1) require notification of material changes.
 * CCPA/CPRA requires disclosure of when the privacy policy was last updated.
 *
 * Includes:
 * - Version history table with dates, summaries, and change types
 * - Auto-populated initial entry from current scan results
 * - Material vs. non-material change classification
 * - Notification requirements per change type
 * - Diff summary showing detected services and data categories
 *
 * Returns null when no services are detected (no privacy policy = no changelog needed).
 */
export function generatePrivacyPolicyChangelog(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const website = ctx?.website || "[https://your-website.com]";
  const date = new Date().toISOString().split("T")[0];

  // Gather current state for the initial changelog entry
  const serviceNames = scan.services.map((s) => s.name).sort();
  const categorySet = new Set(scan.services.map((s) => s.category));
  const dataTypes = new Set<string>();
  for (const service of scan.services) {
    for (const d of service.dataCollected) {
      dataTypes.add(d);
    }
  }

  const hasAI = categorySet.has("ai");
  const hasPayment = categorySet.has("payment");
  const hasAnalytics = categorySet.has("analytics");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Privacy Policy Changelog");
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push(`**Website:** ${website}`);
  sections.push(`**Last updated:** ${date}`);
  sections.push(`**Maintained by:** ${dpoName} (${dpoEmail})`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    "This document tracks all changes to our Privacy Policy. We maintain this changelog " +
    "to comply with GDPR transparency obligations (Art. 12-14) and CCPA/CPRA requirements. " +
    "Users are notified of material changes as described in Section 3.",
  );
  sections.push("");
  sections.push("> **GDPR Requirement:** Data subjects must be informed of any changes to how their " +
    "personal data is processed. Material changes require active notification.");
  sections.push("");

  // ── 1. Version History ──────────────────────────────────────────────
  sections.push("## 1. Version History");
  sections.push("");
  sections.push("| Version | Date | Change Type | Summary | Material? | Notification Sent |");
  sections.push("|---------|------|-------------|---------|-----------|-------------------|");
  sections.push(`| 1.0 | ${date} | Initial release | Initial privacy policy generated from code scan | Yes | N/A (initial publication) |`);
  sections.push("| [1.1] | [DATE] | [TYPE] | [SUMMARY] | [YES/NO] | [YES/NO — DATE] |");
  sections.push("| [1.2] | [DATE] | [TYPE] | [SUMMARY] | [YES/NO] | [YES/NO — DATE] |");
  sections.push("");

  // ── 2. Change Type Definitions ──────────────────────────────────────
  sections.push("## 2. Change Type Definitions");
  sections.push("");
  sections.push("| Change Type | Description | Material? | Notification Required? |");
  sections.push("|-------------|-------------|-----------|----------------------|");
  sections.push("| **New data collection** | Adding new categories of personal data | Yes | Yes — email + banner |");
  sections.push("| **New third-party service** | Adding a new data processor/sub-processor | Yes | Yes — email + banner |");
  sections.push("| **New purpose** | Processing data for a new purpose | Yes | Yes — email + banner |");
  sections.push("| **Jurisdiction change** | Expanding to new geographic regions | Yes | Yes — email + banner |");
  sections.push("| **Retention change** | Modifying data retention periods | Yes | Yes — email + banner |");
  sections.push("| **Rights change** | Modifying data subject rights processes | Yes | Yes — email + banner |");
  sections.push("| **Legal basis change** | Changing lawful basis for processing | Yes | Yes — email + consent re-collection |");
  sections.push("| **Service removal** | Removing a third-party service | No | No (may notify for transparency) |");
  sections.push("| **Clarification** | Rewording for clarity, no substantive change | No | No |");
  sections.push("| **Formatting** | Layout, typo fixes, link updates | No | No |");
  sections.push("| **Contact update** | Updated DPO/contact information | No | No (update in policy) |");
  sections.push("");

  // ── 3. Notification Procedures ──────────────────────────────────────
  sections.push("## 3. Notification Procedures");
  sections.push("");
  sections.push("### 3.1 Material Changes");
  sections.push("");
  sections.push("When a material change is made to the Privacy Policy:");
  sections.push("");
  sections.push("1. **Pre-publication review:** Legal Counsel and DPO review the changes");
  sections.push("2. **Effective date:** Set the effective date at least 30 days in the future");
  sections.push("3. **Email notification:** Send notification email to all registered users");
  sections.push("4. **In-app banner:** Display a prominent banner linking to the updated policy");
  sections.push("5. **Changelog update:** Add entry to Section 1 of this document");
  sections.push("6. **Consent re-collection:** If legal basis changed, collect fresh consent before the effective date");
  sections.push("7. **Archive:** Store the previous version in the policy archive (Section 5)");
  sections.push("");
  sections.push("### 3.2 Non-Material Changes");
  sections.push("");
  sections.push("1. Update the Privacy Policy with the new effective date");
  sections.push("2. Add entry to Section 1 of this document");
  sections.push("3. No user notification required");
  sections.push("");

  // ── 4. Current State (from scan) ────────────────────────────────────
  sections.push("## 4. Current Privacy Policy Baseline");
  sections.push("");
  sections.push(`As of ${date}, the privacy policy covers the following (auto-detected from codebase scan):`);
  sections.push("");

  sections.push("### 4.1 Third-Party Services");
  sections.push("");
  if (serviceNames.length > 0) {
    for (const name of serviceNames) {
      sections.push(`- ${name}`);
    }
  } else {
    sections.push("- No third-party services detected");
  }
  sections.push("");

  sections.push("### 4.2 Data Categories Collected");
  sections.push("");
  if (dataTypes.size > 0) {
    for (const dt of [...dataTypes].sort()) {
      sections.push(`- ${dt}`);
    }
  } else {
    sections.push("- No specific data categories detected");
  }
  sections.push("");

  sections.push("### 4.3 Processing Features");
  sections.push("");
  if (hasAI) sections.push("- AI/ML processing");
  if (hasPayment) sections.push("- Payment processing");
  if (hasAnalytics) sections.push("- Analytics and tracking");
  if (categorySet.has("auth")) sections.push("- Authentication and user accounts");
  if (categorySet.has("email")) sections.push("- Email communications");
  if (categorySet.has("storage")) sections.push("- File/data storage");
  if (categorySet.has("monitoring")) sections.push("- Error monitoring and logging");
  sections.push("");

  // ── 5. Policy Archive ──────────────────────────────────────────────
  sections.push("## 5. Policy Version Archive");
  sections.push("");
  sections.push("Maintain a copy of each version of the Privacy Policy for audit purposes.");
  sections.push("");
  sections.push("| Version | Effective Date | Superseded Date | Archive Location |");
  sections.push("|---------|---------------|-----------------|------------------|");
  sections.push(`| 1.0 | ${date} | Current | PRIVACY_POLICY.md |`);
  sections.push("| [0.x] | [DATE] | [DATE] | [ARCHIVE PATH OR URL] |");
  sections.push("");
  sections.push("> **Best practice:** Store archived versions in version control (git) or a dedicated " +
    "compliance document management system. Each version should be immutable once superseded.");
  sections.push("");

  // ── 6. Review Schedule ─────────────────────────────────────────────
  sections.push("## 6. Review Schedule");
  sections.push("");
  sections.push("| Review Type | Frequency | Next Review | Owner |");
  sections.push("|-------------|-----------|-------------|-------|");
  sections.push("| Scheduled review | Quarterly | [DATE] | DPO |");
  sections.push("| Post-deployment review | After each release with data changes | Ongoing | Engineering + DPO |");
  sections.push("| Annual comprehensive review | Annually | [DATE] | Legal + DPO |");
  sections.push("| Regulatory trigger review | When regulations change | As needed | Legal |");
  sections.push("");
  sections.push("> **Tip:** Run `codepliant diff` after each deployment to detect changes that may require " +
    "a privacy policy update. Integrate into CI/CD for automated detection.");
  sections.push("");

  // ── Contact ─────────────────────────────────────────────────────────
  sections.push("## 7. Contact");
  sections.push("");
  sections.push(`For questions about privacy policy changes:`);
  sections.push("");
  sections.push(`- **Data Protection Officer:** ${dpoName} (${dpoEmail})`);
  sections.push(`- **General inquiries:** ${contactEmail}`);
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This Privacy Policy Changelog was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `The baseline in Section 4 is auto-populated from detected services and data types. ` +
    `This template should be maintained by your DPO and reviewed by legal counsel.*`,
  );

  return sections.join("\n");
}
