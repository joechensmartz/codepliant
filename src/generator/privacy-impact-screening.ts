import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates PRIVACY_IMPACT_SCREENING.md — a quick screening questionnaire
 * to determine if a full DPIA (Data Protection Impact Assessment) is needed.
 *
 * Yes/no questions about data processing activities, auto-pre-filled
 * from scan results. If multiple triggers are detected, recommends full DPIA.
 *
 * Returns null when no services are detected.
 */

interface ScreeningQuestion {
  id: string;
  question: string;
  answer: "Yes" | "No" | "Unknown";
  autoFilled: boolean;
  rationale: string;
  dpiaTriggered: boolean;
}

export function generatePrivacyImpactScreening(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];
  const jurisdictions = ctx?.jurisdictions || [];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasDatabase = scan.services.some((s) => s.category === "database");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const hasEmail = scan.services.some((s) => s.category === "email");
  const hasGDPR = jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || jurisdictions.length === 0;
  const serviceCount = scan.services.length;

  // All data types collected across services
  const allDataTypes = new Set<string>();
  for (const svc of scan.services) {
    for (const d of svc.dataCollected || []) {
      allDataTypes.add(d.toLowerCase());
    }
  }

  const collectsHealthData = [...allDataTypes].some((d) =>
    d.includes("health") || d.includes("medical") || d.includes("biometric")
  );
  const collectsLocationData = [...allDataTypes].some((d) =>
    d.includes("location") || d.includes("gps") || d.includes("geolocation")
  );
  const collectsFinancialData = [...allDataTypes].some((d) =>
    d.includes("payment") || d.includes("financial") || d.includes("credit card") || d.includes("bank")
  );
  const collectsBehavioralData = [...allDataTypes].some((d) =>
    d.includes("behavior") || d.includes("tracking") || d.includes("browsing") || d.includes("usage")
  );

  // Build screening questions with auto-fill
  const questions: ScreeningQuestion[] = [];

  // Q1: Systematic monitoring
  questions.push({
    id: "Q1",
    question: "Does the processing involve systematic monitoring of individuals (e.g., tracking, profiling, CCTV)?",
    answer: hasAnalytics || hasMonitoring || collectsBehavioralData ? "Yes" : "No",
    autoFilled: true,
    rationale: hasAnalytics || hasMonitoring
      ? `Detected ${[hasAnalytics ? "analytics/advertising" : "", hasMonitoring ? "monitoring" : ""].filter(Boolean).join(" and ")} services that may involve systematic monitoring.`
      : "No analytics, advertising, or monitoring services detected.",
    dpiaTriggered: hasAnalytics || hasMonitoring || collectsBehavioralData,
  });

  // Q2: Automated decision-making
  questions.push({
    id: "Q2",
    question: "Does the processing involve automated decision-making with legal or significant effects on individuals?",
    answer: hasAI ? "Yes" : "No",
    autoFilled: true,
    rationale: hasAI
      ? "AI/ML services detected that may perform automated decision-making."
      : "No AI/ML services detected.",
    dpiaTriggered: hasAI,
  });

  // Q3: Large-scale processing of special categories
  questions.push({
    id: "Q3",
    question: "Does the processing involve special category data (health, biometric, racial/ethnic origin, political opinions, religious beliefs, genetic data)?",
    answer: collectsHealthData ? "Yes" : "Unknown",
    autoFilled: collectsHealthData,
    rationale: collectsHealthData
      ? "Health or biometric data types detected in service configurations."
      : "No special category data explicitly detected. Manual review recommended.",
    dpiaTriggered: collectsHealthData,
  });

  // Q4: Large-scale processing
  questions.push({
    id: "Q4",
    question: "Is the processing carried out on a large scale (high volume of data subjects or large geographic area)?",
    answer: serviceCount >= 5 ? "Yes" : "Unknown",
    autoFilled: serviceCount >= 5,
    rationale: serviceCount >= 5
      ? `${serviceCount} services detected, suggesting potentially large-scale processing.`
      : "Scale of processing cannot be fully determined from code analysis alone.",
    dpiaTriggered: serviceCount >= 5,
  });

  // Q5: Data concerning vulnerable individuals
  questions.push({
    id: "Q5",
    question: "Does the processing involve data of vulnerable individuals (children, elderly, patients, employees)?",
    answer: "Unknown",
    autoFilled: false,
    rationale: "This requires manual assessment. Check if your user base includes children (COPPA/GDPR Art. 8) or other vulnerable groups.",
    dpiaTriggered: false,
  });

  // Q6: Innovative technology
  questions.push({
    id: "Q6",
    question: "Does the processing use innovative or new technological solutions?",
    answer: hasAI ? "Yes" : "Unknown",
    autoFilled: hasAI,
    rationale: hasAI
      ? "AI/ML services detected, which are considered innovative technology under GDPR guidelines."
      : "No clearly innovative technology detected, but manual review recommended.",
    dpiaTriggered: hasAI,
  });

  // Q7: Cross-border transfers
  questions.push({
    id: "Q7",
    question: "Does the processing involve transferring personal data outside the EEA/UK?",
    answer: hasGDPR && serviceCount >= 3 ? "Yes" : "Unknown",
    autoFilled: hasGDPR && serviceCount >= 3,
    rationale: hasGDPR && serviceCount >= 3
      ? "Multiple third-party services detected; many SaaS providers process data in the US or other non-EEA countries."
      : "Cross-border transfer status cannot be fully determined from code analysis.",
    dpiaTriggered: hasGDPR && serviceCount >= 3,
  });

  // Q8: Combining datasets
  questions.push({
    id: "Q8",
    question: "Does the processing involve combining or matching data from multiple sources?",
    answer: serviceCount >= 3 && hasDatabase ? "Yes" : "No",
    autoFilled: true,
    rationale: serviceCount >= 3 && hasDatabase
      ? `${serviceCount} services with database storage detected, suggesting data from multiple sources may be combined.`
      : "Limited evidence of dataset combination from code analysis.",
    dpiaTriggered: serviceCount >= 3 && hasDatabase,
  });

  // Q9: Preventing data subjects from exercising rights
  questions.push({
    id: "Q9",
    question: "Could the processing prevent individuals from exercising a right, using a service, or entering a contract?",
    answer: hasPayment || hasAuth ? "Yes" : "No",
    autoFilled: true,
    rationale: hasPayment || hasAuth
      ? "Payment or authentication services detected that may gate access to services."
      : "No evidence of processing that restricts service access.",
    dpiaTriggered: hasPayment && hasAuth,
  });

  // Q10: Location/movement tracking
  questions.push({
    id: "Q10",
    question: "Does the processing involve tracking individuals' location or movement?",
    answer: collectsLocationData ? "Yes" : "No",
    autoFilled: true,
    rationale: collectsLocationData
      ? "Location or geolocation data types detected."
      : "No location tracking data types detected.",
    dpiaTriggered: collectsLocationData,
  });

  // Calculate DPIA recommendation
  const triggeredCount = questions.filter((q) => q.dpiaTriggered).length;
  const unknownCount = questions.filter((q) => q.answer === "Unknown").length;
  const dpiaRequired = triggeredCount >= 2;
  const dpiaLikely = triggeredCount >= 1 && unknownCount >= 1;

  // --- Build document ---
  const lines: string[] = [];

  lines.push("# Privacy Impact Screening");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`> **Organization:** ${company}  `);
  lines.push(`> **Assessor:** ${dpoName} (${dpoEmail})  `);
  lines.push(`> **Date:** ${date}  `);
  lines.push(`> **Services Scanned:** ${serviceCount}`);
  lines.push("");

  lines.push("> **Disclaimer:** This screening questionnaire is auto-generated from code analysis and provides initial guidance only. A qualified Data Protection Officer or privacy professional should review and finalize this assessment. Consult legal counsel before making DPIA determinations.");
  lines.push("");

  // --- Screening Result ---
  lines.push("## Screening Result");
  lines.push("");
  if (dpiaRequired) {
    lines.push("**FULL DPIA RECOMMENDED**");
    lines.push("");
    lines.push(`This screening identified **${triggeredCount} trigger(s)** out of ${questions.length} criteria. Under GDPR Article 35 and WP29 guidelines, processing that meets two or more criteria from the screening list generally requires a full Data Protection Impact Assessment.`);
  } else if (dpiaLikely) {
    lines.push("**DPIA LIKELY NEEDED — FURTHER REVIEW REQUIRED**");
    lines.push("");
    lines.push(`This screening identified **${triggeredCount} trigger(s)** and **${unknownCount} unknown(s)** out of ${questions.length} criteria. Manual review of the unknown items is needed to determine if a full DPIA is required.`);
  } else {
    lines.push("**FULL DPIA NOT REQUIRED AT THIS TIME**");
    lines.push("");
    lines.push(`This screening identified **${triggeredCount} trigger(s)** out of ${questions.length} criteria. Based on current scan results, a full DPIA does not appear necessary. However, re-screen whenever processing activities change.`);
  }
  lines.push("");

  // --- Screening Questions ---
  lines.push("## Screening Questions");
  lines.push("");
  lines.push("| # | Question | Answer | Auto-Filled | DPIA Trigger |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const q of questions) {
    const trigger = q.dpiaTriggered ? "Yes" : "—";
    const auto = q.autoFilled ? "Yes" : "No";
    lines.push(`| ${q.id} | ${q.question} | **${q.answer}** | ${auto} | ${trigger} |`);
  }
  lines.push("");

  // --- Detailed Rationale ---
  lines.push("## Detailed Rationale");
  lines.push("");
  for (const q of questions) {
    lines.push(`### ${q.id}: ${q.question}`);
    lines.push("");
    lines.push(`**Answer:** ${q.answer}${q.autoFilled ? " (auto-filled from scan)" : " (manual review needed)"}`);
    lines.push("");
    lines.push(q.rationale);
    lines.push("");
  }

  // --- Next Steps ---
  lines.push("## Next Steps");
  lines.push("");
  if (dpiaRequired) {
    lines.push("1. **Conduct a full DPIA** — Use the PIA (Privacy Impact Assessment) template in `legal/PIA.md`");
    lines.push("2. **Document the assessment** — Record findings in the Privacy Impact Register (`legal/PRIVACY_IMPACT_REGISTER.md`)");
    lines.push("3. **Consult the DPO** — Review findings with your Data Protection Officer");
    lines.push("4. **Implement mitigations** — Address identified risks before proceeding with processing");
    lines.push("5. **Supervisory authority consultation** — If high risks remain after mitigation, consult your data protection authority (GDPR Art. 36)");
  } else if (dpiaLikely) {
    lines.push("1. **Resolve unknown answers** — Manually review items marked as \"Unknown\" above");
    lines.push("2. **Re-run screening** — After resolving unknowns, re-evaluate the DPIA requirement");
    lines.push("3. **Document decision** — Record the final determination and rationale");
    lines.push("4. **Set review date** — Schedule re-screening when processing changes");
  } else {
    lines.push("1. **Document this screening** — File this screening result for audit evidence");
    lines.push("2. **Set review date** — Re-screen quarterly or when processing activities change");
    lines.push("3. **Monitor changes** — Run `codepliant scan --watch` to detect new services that may trigger a DPIA");
  }
  lines.push("");

  // --- Data Types Detected ---
  if (allDataTypes.size > 0) {
    lines.push("## Data Types Detected");
    lines.push("");
    lines.push("The following data types were identified across all detected services:");
    lines.push("");
    const sorted = [...allDataTypes].sort();
    for (const dt of sorted) {
      lines.push(`- ${dt}`);
    }
    lines.push("");
  }

  // --- Services Assessed ---
  lines.push("## Services Assessed");
  lines.push("");
  lines.push("| Service | Category | Data Collected |");
  lines.push("| --- | --- | --- |");
  const seen = new Set<string>();
  for (const svc of scan.services) {
    if (seen.has(svc.name)) continue;
    seen.add(svc.name);
    const data = (svc.dataCollected || []).join(", ") || "—";
    lines.push(`| ${svc.name} | ${svc.category} | ${data} |`);
  }
  lines.push("");

  // --- Footer ---
  lines.push("---");
  lines.push("");
  lines.push(`*Generated by Codepliant on ${date}. This screening is based on GDPR Article 35, WP29 Guidelines on DPIAs (wp248rev.01), and ICO guidance. It should be reviewed by a qualified privacy professional.*`);
  lines.push("");

  return lines.join("\n");
}
