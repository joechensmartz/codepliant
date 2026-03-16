import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates DATA_BREACH_NOTIFICATION_TEMPLATE.md — pre-filled notification
 * templates for supervisory authorities (GDPR Art. 33), affected individuals
 * (Art. 34), and US state Attorney General offices.
 *
 * Templates include fill-in fields: [DATE], [DESCRIPTION], [DATA AFFECTED],
 * [MEASURES TAKEN], and are customized per jurisdiction.
 *
 * Returns null when no services are detected (no data processing = no breach risk).
 */
export function generateDataBreachNotificationTemplates(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  const jurisdictions = ctx?.jurisdictions || [];
  const hasEU = jurisdictions.some((j) =>
    ["EU", "GDPR", "DE", "FR", "IT", "ES", "NL", "BE", "AT", "IE", "PL", "SE", "DK", "FI", "PT", "CZ", "RO", "HU", "BG", "HR", "SK", "SI", "LT", "LV", "EE", "CY", "MT", "LU", "GR"].includes(j.toUpperCase())
  );
  const hasUS = jurisdictions.some((j) =>
    ["US", "CA", "NY", "TX", "FL", "IL", "MA", "WA", "CO", "CT", "VA", "CCPA", "CPRA"].includes(j.toUpperCase())
  );
  const hasUK = jurisdictions.some((j) => j.toUpperCase() === "UK" || j.toUpperCase() === "GB");

  // If no jurisdictions configured, include all templates
  const includeEU = hasEU || jurisdictions.length === 0;
  const includeUS = hasUS || jurisdictions.length === 0;
  const includeUK = hasUK || jurisdictions.length === 0;

  // Detect data types from scan for pre-filling templates
  const dataTypes: string[] = [];
  for (const cat of scan.dataCategories) {
    dataTypes.push(cat.category);
  }

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Data Breach Notification Templates");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push(
    "This document provides pre-filled notification templates for reporting personal data breaches " +
    "to supervisory authorities, affected individuals, and regulatory bodies. Templates are organized " +
    "by jurisdiction and should be customized for each specific incident."
  );
  sections.push("");
  sections.push("> **Instructions:** Replace all bracketed fields (e.g., `[DATE]`, `[DESCRIPTION]`) " +
    "with incident-specific details before sending. Fields marked with `[REQUIRED]` must be completed " +
    "for the notification to be legally compliant.");

  // ── Table of Contents ───────────────────────────────────────────────
  sections.push("");
  sections.push("## Table of Contents");
  sections.push("");
  let tocNum = 1;
  if (includeEU) {
    sections.push(`${tocNum}. [EU/EEA — Supervisory Authority Notification (GDPR Art. 33)](#1-eueea--supervisory-authority-notification-gdpr-art-33)`);
    tocNum++;
    sections.push(`${tocNum}. [EU/EEA — Individual Notification (GDPR Art. 34)](#${tocNum}-eueea--individual-notification-gdpr-art-34)`);
    tocNum++;
  }
  if (includeUK) {
    sections.push(`${tocNum}. [UK — ICO Breach Notification (UK GDPR)](#${tocNum}-uk--ico-breach-notification-uk-gdpr)`);
    tocNum++;
  }
  if (includeUS) {
    sections.push(`${tocNum}. [US — State Attorney General Notification](#${tocNum}-us--state-attorney-general-notification)`);
    tocNum++;
    sections.push(`${tocNum}. [US — Individual Notification (State Laws)](#${tocNum}-us--individual-notification-state-laws)`);
    tocNum++;
  }
  sections.push(`${tocNum}. [Incident Log Template](#${tocNum}-incident-log-template)`);

  let sectionNum = 0;

  // ── EU Supervisory Authority (GDPR Art. 33) ─────────────────────────
  if (includeEU) {
    sectionNum++;
    sections.push("");
    sections.push(`## ${sectionNum}. EU/EEA — Supervisory Authority Notification (GDPR Art. 33)`);
    sections.push("");
    sections.push("**Deadline:** Within 72 hours of becoming aware of the breach.");
    sections.push("");
    sections.push("```");
    sections.push("PERSONAL DATA BREACH NOTIFICATION TO SUPERVISORY AUTHORITY");
    sections.push("==========================================================");
    sections.push("(Pursuant to Article 33 of Regulation (EU) 2016/679 — GDPR)");
    sections.push("");
    sections.push("SECTION 1: REPORTING ORGANIZATION");
    sections.push("----------------------------------");
    sections.push(`Organization Name:        ${company}`);
    sections.push(`Data Protection Officer:  ${dpoName}`);
    sections.push(`DPO Email:                ${dpoEmail}`);
    sections.push(`Organization Website:     ${website}`);
    sections.push(`Contact Email:            ${contactEmail}`);
    sections.push("Registration Number:      [COMPANY REGISTRATION NUMBER]");
    sections.push("");
    sections.push("SECTION 2: BREACH DETAILS");
    sections.push("-------------------------");
    sections.push("Date breach discovered:   [DATE] [REQUIRED]");
    sections.push("Date breach occurred:     [DATE OR \"UNKNOWN\"]");
    sections.push("Date of this report:      [DATE] [REQUIRED]");
    sections.push("");
    sections.push("If reporting after 72 hours, reason for delay:");
    sections.push("[EXPLANATION] [REQUIRED IF LATE]");
    sections.push("");
    sections.push("SECTION 3: NATURE OF THE BREACH");
    sections.push("-------------------------------");
    sections.push("Type of breach (select all that apply):");
    sections.push("  [ ] Confidentiality breach (unauthorized disclosure or access)");
    sections.push("  [ ] Integrity breach (unauthorized alteration of data)");
    sections.push("  [ ] Availability breach (loss of access or destruction of data)");
    sections.push("");
    sections.push("Description of the breach:");
    sections.push("[DESCRIPTION] [REQUIRED]");
    sections.push("");
    sections.push("SECTION 4: DATA AND DATA SUBJECTS AFFECTED");
    sections.push("-------------------------------------------");
    sections.push("Categories of data subjects affected:");
    sections.push("  [ ] Customers/Users");
    sections.push("  [ ] Employees");
    sections.push("  [ ] Partners/Vendors");
    sections.push("  [ ] Other: [SPECIFY]");
    sections.push("");
    sections.push("Approximate number of data subjects: [NUMBER] [REQUIRED]");
    sections.push("Approximate number of records:       [NUMBER] [REQUIRED]");
    sections.push("");
    sections.push("Categories of personal data affected:");
    if (dataTypes.length > 0) {
      for (const dt of dataTypes) {
        sections.push(`  [x] ${dt}`);
      }
    }
    sections.push("  [ ] Names and contact details");
    sections.push("  [ ] Email addresses");
    sections.push("  [ ] Financial/payment data");
    sections.push("  [ ] Authentication credentials");
    sections.push("  [ ] Health data (special category)");
    sections.push("  [ ] Location data");
    sections.push("  [ ] Other: [DATA AFFECTED]");
    sections.push("");
    sections.push("SECTION 5: LIKELY CONSEQUENCES");
    sections.push("------------------------------");
    sections.push("[DESCRIPTION OF LIKELY CONSEQUENCES FOR DATA SUBJECTS] [REQUIRED]");
    sections.push("");
    sections.push("SECTION 6: MEASURES TAKEN");
    sections.push("-------------------------");
    sections.push("Measures taken to address the breach:");
    sections.push("[MEASURES TAKEN] [REQUIRED]");
    sections.push("");
    sections.push("Measures taken to mitigate adverse effects on data subjects:");
    sections.push("[MEASURES TAKEN]");
    sections.push("");
    sections.push("SECTION 7: CROSS-BORDER CONSIDERATIONS");
    sections.push("---------------------------------------");
    sections.push("Does this breach affect data subjects in other EU/EEA member states?");
    sections.push("  [ ] Yes — List member states: [COUNTRIES]");
    sections.push("  [ ] No");
    sections.push("  [ ] Unknown at this time");
    sections.push("");
    sections.push("Has this breach been reported to other supervisory authorities?");
    sections.push("  [ ] Yes — Specify: [AUTHORITIES]");
    sections.push("  [ ] No");
    sections.push("```");

    // ── EU Individual Notification (GDPR Art. 34) ───────────────────────
    sectionNum++;
    sections.push("");
    sections.push(`## ${sectionNum}. EU/EEA — Individual Notification (GDPR Art. 34)`);
    sections.push("");
    sections.push("**Required when:** The breach is likely to result in a high risk to the rights and freedoms of natural persons.");
    sections.push("");
    sections.push("**Deadline:** Without undue delay.");
    sections.push("");
    sections.push("```");
    sections.push(`Subject: Security Incident Notification — ${company}`);
    sections.push("");
    sections.push("Dear [RECIPIENT NAME],");
    sections.push("");
    sections.push(`We are writing to inform you about a personal data breach at ${company} ` +
      "that may affect your personal data. We take this matter very seriously and are " +
      "providing this notice in accordance with Article 34 of the General Data Protection Regulation (GDPR).");
    sections.push("");
    sections.push("WHAT HAPPENED");
    sections.push("-------------");
    sections.push("On [DATE], we discovered that [DESCRIPTION].");
    sections.push("");
    sections.push("WHAT DATA WAS AFFECTED");
    sections.push("----------------------");
    sections.push("The following types of your personal data may have been affected:");
    sections.push("[DATA AFFECTED]");
    sections.push("");
    sections.push("WHAT WE ARE DOING");
    sections.push("------------------");
    sections.push("[MEASURES TAKEN]");
    sections.push("");
    sections.push("WHAT YOU CAN DO");
    sections.push("----------------");
    sections.push("We recommend you take the following steps:");
    sections.push("- Change your password for your account and any other accounts where");
    sections.push("  you use the same password");
    sections.push("- Enable two-factor authentication if not already active");
    sections.push("- Monitor your accounts for any suspicious activity");
    sections.push("- Be cautious of phishing emails that reference this incident");
    sections.push("");
    sections.push("CONTACT US");
    sections.push("----------");
    sections.push(`Our Data Protection Officer, ${dpoName}, is available to answer`);
    sections.push("your questions:");
    sections.push(`  Email: ${dpoEmail}`);
    sections.push(`  Web:   ${website}`);
    sections.push("");
    sections.push("You also have the right to lodge a complaint with your local");
    sections.push("data protection supervisory authority.");
    sections.push("");
    sections.push("We sincerely apologize for this incident.");
    sections.push("");
    sections.push("Sincerely,");
    sections.push(company);
    sections.push("```");
  }

  // ── UK ICO Notification ─────────────────────────────────────────────
  if (includeUK) {
    sectionNum++;
    sections.push("");
    sections.push(`## ${sectionNum}. UK — ICO Breach Notification (UK GDPR)`);
    sections.push("");
    sections.push("**Deadline:** Within 72 hours of becoming aware. Report to the Information Commissioner's Office (ICO).");
    sections.push("");
    sections.push("**Reporting portal:** https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/");
    sections.push("");
    sections.push("```");
    sections.push("PERSONAL DATA BREACH REPORT — UK INFORMATION COMMISSIONER'S OFFICE");
    sections.push("===================================================================");
    sections.push("");
    sections.push(`Organization:             ${company}`);
    sections.push(`DPO / Contact Person:     ${dpoName} (${dpoEmail})`);
    sections.push("UK Registration Number:   [ICO REGISTRATION NUMBER]");
    sections.push("");
    sections.push("Date breach discovered:   [DATE] [REQUIRED]");
    sections.push("Date breach occurred:     [DATE OR \"UNKNOWN\"]");
    sections.push("");
    sections.push("Nature of the breach:");
    sections.push("[DESCRIPTION] [REQUIRED]");
    sections.push("");
    sections.push("Data subjects affected:   [NUMBER] [REQUIRED]");
    sections.push("Records affected:         [NUMBER] [REQUIRED]");
    sections.push("");
    sections.push("Categories of personal data:");
    sections.push("[DATA AFFECTED] [REQUIRED]");
    sections.push("");
    sections.push("Likely consequences:");
    sections.push("[DESCRIPTION]");
    sections.push("");
    sections.push("Measures taken or proposed:");
    sections.push("[MEASURES TAKEN] [REQUIRED]");
    sections.push("");
    sections.push("Has this breach been reported to any other authority?");
    sections.push("[YES/NO — IF YES, SPECIFY]");
    sections.push("```");
  }

  // ── US State AG Notification ────────────────────────────────────────
  if (includeUS) {
    sectionNum++;
    sections.push("");
    sections.push(`## ${sectionNum}. US — State Attorney General Notification`);
    sections.push("");
    sections.push("**Note:** US breach notification laws vary by state. Most states require notification " +
      "within 30-60 days. Some states (e.g., Colorado, Florida) require notification within 30 days. " +
      "California requires notification to the AG when 500+ residents are affected.");
    sections.push("");
    sections.push("### Key State Deadlines");
    sections.push("");
    sections.push("| State | Deadline | AG Notification Threshold | Statute |");
    sections.push("|-------|----------|--------------------------|---------|");
    sections.push("| California | 15 business days (expedited) | 500+ residents | Cal. Civ. Code 1798.82 |");
    sections.push("| Colorado | 30 days | 500+ residents | CRS 6-1-716 |");
    sections.push("| Connecticut | 60 days | Any affected resident | CGS 36a-701b |");
    sections.push("| Florida | 30 days | 500+ residents | FS 501.171 |");
    sections.push("| Illinois | As expedient as possible | Any affected resident | 815 ILCS 530 |");
    sections.push("| Massachusetts | As soon as practicable | Any affected resident | MGL c.93H |");
    sections.push("| New York | As expedient as possible | Any affected resident | GBS 899-aa |");
    sections.push("| Texas | 60 days | 250+ residents | BCC 521.053 |");
    sections.push("| Virginia | 60 days | 1,000+ residents | Va. Code 18.2-186.6 |");
    sections.push("| Washington | 30 days | 500+ residents | RCW 19.255.010 |");
    sections.push("");
    sections.push("### AG Notification Template");
    sections.push("");
    sections.push("```");
    sections.push("DATA BREACH NOTIFICATION TO STATE ATTORNEY GENERAL");
    sections.push("==================================================");
    sections.push("");
    sections.push("State:                    [STATE NAME] [REQUIRED]");
    sections.push(`Reporting Organization:   ${company}`);
    sections.push(`Contact Person:           ${dpoName}`);
    sections.push(`Contact Email:            ${contactEmail}`);
    sections.push(`Contact Phone:            ${ctx?.tollFreeNumber || "[PHONE NUMBER]"}`);
    sections.push("");
    sections.push("DATE OF BREACH");
    sections.push("--------------");
    sections.push("Date breach occurred:     [DATE]");
    sections.push("Date breach discovered:   [DATE] [REQUIRED]");
    sections.push("Date of this notice:      [DATE] [REQUIRED]");
    sections.push("");
    sections.push("BREACH DESCRIPTION");
    sections.push("------------------");
    sections.push("[DESCRIPTION] [REQUIRED]");
    sections.push("");
    sections.push("INFORMATION COMPROMISED");
    sections.push("-----------------------");
    sections.push("Types of personal information affected:");
    sections.push("  [ ] Social Security numbers");
    sections.push("  [ ] Driver's license / State ID numbers");
    sections.push("  [ ] Financial account numbers");
    sections.push("  [ ] Credit/debit card numbers");
    sections.push("  [ ] Login credentials (username + password)");
    sections.push("  [ ] Medical/health information");
    sections.push("  [ ] Biometric data");
    sections.push("  [ ] Other: [DATA AFFECTED]");
    sections.push("");
    sections.push("AFFECTED INDIVIDUALS");
    sections.push("--------------------");
    sections.push("Total affected individuals:            [NUMBER] [REQUIRED]");
    sections.push("Residents of this state affected:      [NUMBER] [REQUIRED]");
    sections.push("");
    sections.push("REMEDIAL ACTIONS");
    sections.push("----------------");
    sections.push("[MEASURES TAKEN] [REQUIRED]");
    sections.push("");
    sections.push("Are you offering credit monitoring / identity theft protection?");
    sections.push("  [ ] Yes — Duration: [MONTHS]");
    sections.push("  [ ] No");
    sections.push("");
    sections.push("Has law enforcement been notified?");
    sections.push("  [ ] Yes — Agency: [NAME]");
    sections.push("  [ ] No");
    sections.push("```");

    // ── US Individual Notification ──────────────────────────────────────
    sectionNum++;
    sections.push("");
    sections.push(`## ${sectionNum}. US — Individual Notification (State Laws)`);
    sections.push("");
    sections.push("**Required when:** Personal information of state residents has been compromised.");
    sections.push("");
    sections.push("```");
    sections.push(`Subject: Notice of Data Breach — ${company}`);
    sections.push("");
    sections.push("Dear [RECIPIENT NAME],");
    sections.push("");
    sections.push(`We are writing to notify you of a data security incident at ${company} ` +
      "that may have involved your personal information.");
    sections.push("");
    sections.push("WHAT HAPPENED");
    sections.push("-------------");
    sections.push("On [DATE], we discovered that [DESCRIPTION].");
    sections.push("");
    sections.push("WHAT INFORMATION WAS INVOLVED");
    sections.push("-----------------------------");
    sections.push("[DATA AFFECTED]");
    sections.push("");
    sections.push("WHAT WE ARE DOING");
    sections.push("------------------");
    sections.push("[MEASURES TAKEN]");
    sections.push("");
    sections.push("WHAT YOU CAN DO");
    sections.push("----------------");
    sections.push("We recommend you take the following precautions:");
    sections.push("- Review your account statements and monitor credit reports");
    sections.push("- Place a fraud alert or security freeze on your credit files");
    sections.push("- Change your password and enable multi-factor authentication");
    sections.push("- Report any suspicious activity to your financial institution");
    sections.push("- File a report with the Federal Trade Commission at ftc.gov/idtheft");
    sections.push("");
    sections.push("COMPLIMENTARY SERVICES");
    sections.push("----------------------");
    sections.push("[We are offering [X] months of complimentary credit monitoring and");
    sections.push("identity theft protection through [PROVIDER]. To enroll, visit");
    sections.push("[URL] and use activation code [CODE].]");
    sections.push("");
    sections.push("FOR MORE INFORMATION");
    sections.push("--------------------");
    sections.push(`Contact us at ${contactEmail} or call ${ctx?.tollFreeNumber || "[TOLL-FREE NUMBER]"}.`);
    sections.push("");
    sections.push("Sincerely,");
    sections.push(company);
    sections.push("```");
  }

  // ── Incident Log Template ──────────────────────────────────────────
  sectionNum++;
  sections.push("");
  sections.push(`## ${sectionNum}. Incident Log Template`);
  sections.push("");
  sections.push("Use this template to maintain an internal log of all data breach incidents, " +
    "as required by GDPR Article 33(5).");
  sections.push("");
  sections.push("| Field | Details |");
  sections.push("|-------|---------|");
  sections.push("| **Incident ID** | [UNIQUE ID] |");
  sections.push("| **Date discovered** | [DATE] |");
  sections.push("| **Date occurred** | [DATE] |");
  sections.push("| **Reported by** | [NAME / ROLE] |");
  sections.push("| **Description** | [DESCRIPTION] |");
  sections.push("| **Data types affected** | [DATA AFFECTED] |");
  sections.push("| **Number of records** | [NUMBER] |");
  sections.push("| **Number of data subjects** | [NUMBER] |");
  sections.push("| **Severity** | [ ] Critical [ ] High [ ] Medium [ ] Low |");
  sections.push("| **Authority notified** | [ ] Yes — [DATE] [ ] No — [REASON] |");
  sections.push("| **Individuals notified** | [ ] Yes — [DATE] [ ] No — [REASON] |");
  sections.push("| **Measures taken** | [MEASURES TAKEN] |");
  sections.push("| **Root cause** | [DESCRIPTION] |");
  sections.push("| **Status** | [ ] Open [ ] Contained [ ] Resolved [ ] Closed |");

  // ── Disclaimer ─────────────────────────────────────────────────────
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*These notification templates were generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `They must be reviewed and approved by your legal team before use. Notification requirements vary ` +
    `by jurisdiction — consult local counsel to ensure compliance with applicable breach notification laws.*`
  );
  sections.push("");

  return sections.join("\n");
}
