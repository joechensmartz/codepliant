import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a Regulatory Updates document listing upcoming regulatory changes
 * that affect the project, based on detected jurisdictions and services.
 */
export function generateRegulatoryUpdates(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasAnalytics = scan.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasAuth = scan.services.some((s) => s.category === "auth");

  // Determine which jurisdictions are relevant
  const showEU =
    jurisdictions.length === 0 ||
    jurisdictions.includes("gdpr") ||
    jurisdictions.includes("eu");
  const showUS =
    jurisdictions.length === 0 ||
    jurisdictions.includes("ccpa") ||
    (ctx?.companyLocation || "").toUpperCase() === "US";
  const showUK =
    jurisdictions.includes("uk-gdpr") ||
    jurisdictions.includes("uk");

  const updates: RegulatoryUpdate[] = [];

  // ── EU AI Act enforcement dates (by article) ──────────────────────
  if (showEU && hasAI) {
    updates.push({
      regulation: "EU AI Act — Prohibited Practices (Art. 5)",
      date: "2 February 2025",
      status: "In effect",
      impact:
        "AI systems that use subliminal techniques, exploit vulnerabilities, perform social scoring, or use real-time remote biometric identification (with narrow exceptions) are banned.",
      actionRequired:
        "Audit all AI features against the prohibited practices list. Remove or redesign any AI functionality that falls within the prohibited categories.",
    });

    updates.push({
      regulation: "EU AI Act — AI Literacy Obligation (Art. 4)",
      date: "2 February 2025",
      status: "In effect",
      impact:
        "Providers and deployers must ensure staff involved in AI operation and use have sufficient AI literacy, considering their technical knowledge, experience, and context of use.",
      actionRequired:
        "Implement AI literacy training for all personnel who develop, deploy, or oversee AI systems. Document training records.",
    });

    updates.push({
      regulation: "EU AI Act — GPAI Model Obligations (Art. 51-56)",
      date: "2 August 2025",
      status: "Upcoming",
      impact:
        "General-purpose AI model providers must provide technical documentation, comply with EU copyright law, and publish a training content summary. Systemic risk models face additional obligations.",
      actionRequired:
        "If using or providing GPAI models, review provider compliance. Request technical documentation and copyright compliance evidence from AI providers.",
    });

    updates.push({
      regulation: "EU AI Act — Transparency Obligations (Art. 50)",
      date: "2 August 2026",
      status: "Upcoming",
      impact:
        "Deployers must inform users when they interact with AI systems. AI-generated content (text, images, audio, video, deepfakes) must be labelled as such in a machine-readable format.",
      actionRequired:
        "Implement AI interaction disclosure in UI. Add machine-readable labels (C2PA or equivalent) to AI-generated content. Update privacy notices to cover AI usage.",
    });

    updates.push({
      regulation: "EU AI Act — High-Risk System Requirements (Art. 6-49)",
      date: "2 August 2027",
      status: "Upcoming",
      impact:
        "High-risk AI systems must undergo conformity assessments, maintain risk management systems, meet data governance standards, implement human oversight, and register in the EU database.",
      actionRequired:
        "Classify all AI systems by risk level. For high-risk systems: begin conformity assessment preparation, establish risk management framework, implement logging and monitoring.",
    });
  }

  // ── US State Privacy Law Amendments ────────────────────────────────
  if (showUS) {
    updates.push({
      regulation: "California — CPRA Enforcement (Regulations finalized)",
      date: "29 March 2024",
      status: "In effect",
      impact:
        "California Privacy Protection Agency (CPPA) actively enforcing CPRA amendments including automated decision-making technology (ADMT) rules, opt-out preference signals, and dark pattern prohibitions.",
      actionRequired:
        "Honour Global Privacy Control (GPC) signals. Review consent flows for dark patterns. If using ADMT, prepare for pre-decision notice and opt-out requirements.",
    });

    updates.push({
      regulation: "Texas Data Privacy and Security Act (TDPSA)",
      date: "1 July 2024",
      status: "In effect",
      impact:
        "Applies to entities conducting business in Texas or producing products/services consumed by Texas residents. No revenue or processing volume thresholds.",
      actionRequired:
        "Review applicability — the TDPSA has no minimum thresholds. Implement consumer rights mechanisms (access, correction, deletion, opt-out of sale/targeted advertising).",
    });

    updates.push({
      regulation: "Florida Digital Bill of Rights (FDBR)",
      date: "1 July 2024",
      status: "In effect",
      impact:
        "Applies to companies with >$1B global revenue or meeting specific criteria (app stores, digital advertisers, large platforms). Includes children's privacy provisions.",
      actionRequired:
        "Assess applicability based on revenue thresholds. If applicable, implement consent mechanisms for children under 16 and targeted advertising opt-outs.",
    });

    updates.push({
      regulation: "Oregon Consumer Privacy Act (OCPA)",
      date: "1 July 2024",
      status: "In effect",
      impact:
        "Applies to businesses processing data of 100,000+ Oregon consumers, or 25,000+ consumers if 25%+ of revenue comes from selling data. Includes sensitive data protections.",
      actionRequired:
        "Conduct data inventory for Oregon residents. Implement opt-in consent for sensitive data processing. Provide universal opt-out mechanism.",
    });

    updates.push({
      regulation: "New Jersey Data Privacy Act (NJDPA)",
      date: "15 January 2025",
      status: "In effect",
      impact:
        "Applies to controllers processing data of 100,000+ NJ consumers or 25,000+ consumers with revenue from data sales. Notably broad sensitive data definition.",
      actionRequired:
        "Review sensitive data processing — NJ includes financial data, geolocation, and union membership. Implement data protection assessments for high-risk processing.",
    });

    updates.push({
      regulation: "Tennessee Information Protection Act (TIPA)",
      date: "1 July 2025",
      status: "Upcoming",
      impact:
        "Applies to companies conducting business in Tennessee with >$25M revenue processing 175,000+ consumers, or 25,000+ consumers with 50%+ revenue from data sales. Includes affirmative defense for NIST framework adherence.",
      actionRequired:
        "Assess applicability. Consider adopting NIST Privacy Framework for affirmative defense. Implement consumer rights and opt-out mechanisms.",
    });

    updates.push({
      regulation: "Minnesota Consumer Data Privacy Act",
      date: "31 July 2025",
      status: "Upcoming",
      impact:
        "Applies to entities processing data of 100,000+ Minnesota consumers. Includes unique provisions: right to question profiling results, data portability in machine-readable format.",
      actionRequired:
        "Implement profiling disclosure and challenge mechanisms. Ensure data export capabilities meet machine-readable format requirements.",
    });

    updates.push({
      regulation: "Maryland Online Data Privacy Act (MODPA)",
      date: "1 October 2025",
      status: "Upcoming",
      impact:
        "One of the strictest US state laws. Prohibits selling sensitive data entirely. Requires data minimisation — may not process data beyond what is reasonably necessary.",
      actionRequired:
        "Audit all data collection for necessity. Cease any sale of sensitive data for Maryland residents. Implement strict data minimisation controls.",
    });

    if (hasAI) {
      updates.push({
        regulation: "Colorado AI Act (SB 24-205)",
        date: "1 February 2026",
        status: "Upcoming",
        impact:
          "First comprehensive US state AI law. Applies to developers and deployers of high-risk AI systems that make consequential decisions in employment, finance, housing, insurance, education, and other areas.",
        actionRequired:
          "Classify AI systems for consequential decision-making. Implement algorithmic impact assessments. Provide AI-related disclosures to consumers. Establish human oversight for high-risk AI decisions.",
      });
    }
  }

  // ── UK GDPR Divergence / Data Use and Access Act ──────────────────
  if (showUK || showEU) {
    updates.push({
      regulation: "UK Data (Use and Access) Act (DUAA)",
      date: "Royal Assent: November 2024; enforcement phased 2025-2026",
      status: "Phased enforcement",
      impact:
        "Reforms UK data protection law to diverge from EU GDPR. Key changes: replaces DPO requirement with 'Senior Responsible Individual'; introduces 'recognised legitimate interests' that do not require balancing test; reforms automated decision-making rules (removes Art. 22 equivalent for some decisions); new cookie rules allowing broader analytics without consent.",
      actionRequired:
        "Review DPO arrangements — may transition to Senior Responsible Individual model under UK law while maintaining DPO for EU GDPR compliance. Reassess cookie consent for UK users (analytics cookies may no longer require prior consent). Update international transfer mechanisms to use UK IDTA or UK Addendum. Monitor ICO implementation guidance.",
    });

    if (hasAI) {
      updates.push({
        regulation: "UK AI Regulation — Sector-led Framework",
        date: "Ongoing — no single enforcement date",
        status: "In development",
        impact:
          "The UK has opted for a sector-led, principles-based approach rather than a single AI law. Existing regulators (ICO, FCA, CMA, Ofcom) are developing AI guidance for their sectors. The AI Safety Institute conducts frontier model evaluations.",
        actionRequired:
          "Monitor guidance from sector regulators relevant to your industry. Implement the five cross-sector AI principles: safety, fairness, transparency, accountability, contestability. Consider voluntary compliance with the UK AI Code of Practice.",
      });
    }
  }

  // ── ePrivacy Regulation ───────────────────────────────────────────
  if (showEU && (hasAnalytics || hasAuth)) {
    updates.push({
      regulation: "EU ePrivacy Regulation (proposed replacement for Directive 2002/58/EC)",
      date: "No confirmed date — legislative process stalled",
      status: "Stalled",
      impact:
        "If adopted, would replace the ePrivacy Directive with a directly applicable regulation. Expected changes: harmonised cookie rules across EU, expanded scope to cover OTT communications (WhatsApp, Messenger), stricter consent requirements for metadata processing, and potential shift toward browser-level consent settings.",
      actionRequired:
        "Continue complying with current ePrivacy Directive (transposed into national law). Monitor EU legislative progress — the proposal has been in trilogue since 2021 with no agreement. Ensure current cookie consent mechanisms meet the strictest national implementation (e.g., CNIL, BfDI guidance).",
    });
  }

  // ── EU-US Data Privacy Framework ──────────────────────────────────
  if (showEU || showUS) {
    const usBasedServices = scan.services.filter((s) => isUSBased(s.name));
    if (usBasedServices.length > 0) {
      updates.push({
        regulation: "EU-US Data Privacy Framework (DPF) — Adequacy Review",
        date: "First review expected by July 2025",
        status: "Under review",
        impact:
          `You use ${usBasedServices.length} US-based service(s). The DPF adequacy decision enables EU-US data transfers without SCCs, but is subject to periodic review. A CJEU challenge (similar to Schrems I/II) remains possible.`,
        actionRequired:
          "Verify each US-based provider's DPF certification at dataprivacyframework.gov. Maintain fallback SCCs in DPAs in case the DPF is invalidated. Document transfer impact assessments.",
      });
    }
  }

  if (updates.length === 0) {
    return null;
  }

  // ── Build document ────────────────────────────────────────────────
  const sections: string[] = [];

  sections.push(`# Regulatory Updates

**Company:** ${company}
**Project:** ${scan.projectName}
**Last checked:** ${date}. Review quarterly.

---

This document lists upcoming and recent regulatory changes that may affect your project based on detected services and configured jurisdictions. Each entry includes the enforcement date, expected impact, and recommended actions.

> **Disclaimer:** This is not legal advice. Regulatory timelines and requirements may change. Consult qualified legal counsel and monitor official sources for the latest developments.`);

  // Group updates by status
  const inEffect = updates.filter((u) => u.status === "In effect");
  const upcoming = updates.filter((u) => u.status === "Upcoming");
  const other = updates.filter(
    (u) => u.status !== "In effect" && u.status !== "Upcoming"
  );

  if (inEffect.length > 0) {
    sections.push(`\n## Recently Enacted (Now In Effect)\n`);
    for (const update of inEffect) {
      sections.push(formatUpdate(update));
    }
  }

  if (upcoming.length > 0) {
    sections.push(`\n## Upcoming Enforcement Dates\n`);
    for (const update of upcoming) {
      sections.push(formatUpdate(update));
    }
  }

  if (other.length > 0) {
    sections.push(`\n## In Development / Under Review\n`);
    for (const update of other) {
      sections.push(formatUpdate(update));
    }
  }

  // ── Action Summary ────────────────────────────────────────────────

  {
    let summary = `\n## Action Summary\n\n`;
    summary += `| # | Regulation | Date | Status | Priority |\n`;
    summary += `|---|-----------|------|--------|----------|\n`;

    let idx = 0;
    for (const update of updates) {
      idx++;
      const priority = update.status === "In effect"
        ? "Review now"
        : update.status === "Upcoming"
          ? "Plan ahead"
          : "Monitor";
      summary += `| ${idx} | ${update.regulation} | ${update.date} | ${update.status} | ${priority} |\n`;
    }

    sections.push(summary);
  }

  // ── Footer ────────────────────────────────────────────────────────

  sections.push(`\n---\n\n*This regulatory updates document was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis and known regulatory timelines. Regulatory landscapes evolve — verify all dates and requirements against official sources.*`);

  return sections.join("\n");
}

interface RegulatoryUpdate {
  regulation: string;
  date: string;
  status: string;
  impact: string;
  actionRequired: string;
}

function formatUpdate(update: RegulatoryUpdate): string {
  return `### ${update.regulation}

| | |
|---|---|
| **Enforcement Date** | ${update.date} |
| **Status** | ${update.status} |

**Impact:** ${update.impact}

**Action Required:** ${update.actionRequired}
`;
}

const US_BASED_PROVIDER_NAMES = new Set([
  "openai", "stripe", "@anthropic-ai/sdk", "replicate", "together-ai", "cohere",
  "@pinecone-database/pinecone", "@paypal/checkout-server-sdk", "@google-analytics/data",
  "posthog", "mixpanel", "@amplitude/analytics-browser", "@vercel/analytics", "hotjar",
  "@clerk/nextjs", "@sendgrid/mail", "resend", "@sentry/node", "@sentry/nextjs", "@sentry/react",
  "@aws-sdk/client-s3", "@uploadthing/react", "cloudinary", "twilio", "@twilio/voice-sdk",
  "intercom", "@intercom/messenger-js-sdk", "@hubspot/api-client",
  "firebase", "firebase-admin", "@google/generative-ai",
]);

function isUSBased(name: string): boolean {
  return US_BASED_PROVIDER_NAMES.has(name);
}
