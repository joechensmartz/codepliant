import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates REGULATORY_MAPPING_MATRIX.md — maps each detected service
 * to ALL applicable regulations in a matrix table.
 *
 * Table format: Service | GDPR | CCPA | AI Act | PCI DSS | HIPAA | SOC 2
 * Shows which regulations apply to each service based on category and data.
 */

interface RegApplicability {
  applies: boolean;
  reason: string;
}

interface ServiceRegMap {
  serviceName: string;
  category: string;
  gdpr: RegApplicability;
  ccpa: RegApplicability;
  aiAct: RegApplicability;
  pci: RegApplicability;
  hipaa: RegApplicability;
  soc2: RegApplicability;
}

function assessGDPR(
  name: string,
  category: string,
  dataCollected: string[],
): RegApplicability {
  // GDPR applies to nearly all services that process personal data
  const personalDataKeywords = [
    "email", "name", "address", "ip", "cookie", "device",
    "location", "user", "account", "profile", "identity",
    "phone", "age", "gender", "biometric",
  ];
  const hasPersonalData = dataCollected.some((d) =>
    personalDataKeywords.some((kw) => d.toLowerCase().includes(kw))
  );
  if (hasPersonalData) {
    return { applies: true, reason: "Processes personal data" };
  }
  if (["auth", "analytics", "email", "social", "advertising", "ai"].includes(category)) {
    return { applies: true, reason: `${category} services typically process personal data` };
  }
  if (category === "database" || category === "storage") {
    return { applies: true, reason: "May store personal data" };
  }
  return { applies: false, reason: "No personal data processing identified" };
}

function assessCCPA(
  name: string,
  category: string,
  dataCollected: string[],
): RegApplicability {
  if (["analytics", "advertising", "social"].includes(category)) {
    return { applies: true, reason: "Collects/shares consumer information for commercial purposes" };
  }
  if (category === "auth") {
    return { applies: true, reason: "Collects consumer identity information" };
  }
  if (category === "email") {
    return { applies: true, reason: "Processes consumer contact information" };
  }
  const consumerDataKeywords = [
    "email", "name", "address", "phone", "purchase", "browsing",
    "device", "ip", "geolocation", "account",
  ];
  const hasConsumerData = dataCollected.some((d) =>
    consumerDataKeywords.some((kw) => d.toLowerCase().includes(kw))
  );
  if (hasConsumerData) {
    return { applies: true, reason: "Processes California consumer personal information" };
  }
  return { applies: false, reason: "No consumer PI processing identified" };
}

function assessAIAct(
  name: string,
  category: string,
  dataCollected: string[],
): RegApplicability {
  if (category === "ai") {
    return { applies: true, reason: "AI/ML service — subject to EU AI Act requirements" };
  }
  const aiKeywords = ["prediction", "recommendation", "model", "inference", "classification"];
  const hasAIData = dataCollected.some((d) =>
    aiKeywords.some((kw) => d.toLowerCase().includes(kw))
  );
  if (hasAIData) {
    return { applies: true, reason: "Data used for AI/ML inference" };
  }
  return { applies: false, reason: "Not an AI system" };
}

function assessPCI(
  name: string,
  category: string,
  dataCollected: string[],
): RegApplicability {
  if (category === "payment") {
    return { applies: true, reason: "Payment processing — PCI DSS applies" };
  }
  const paymentKeywords = [
    "card", "payment", "transaction", "billing", "credit",
    "debit", "checkout", "merchant",
  ];
  const hasPaymentData = dataCollected.some((d) =>
    paymentKeywords.some((kw) => d.toLowerCase().includes(kw))
  );
  if (hasPaymentData) {
    return { applies: true, reason: "Processes payment-related data" };
  }
  return { applies: false, reason: "No cardholder data processing" };
}

function assessHIPAA(
  name: string,
  category: string,
  dataCollected: string[],
): RegApplicability {
  const healthKeywords = [
    "health", "medical", "patient", "diagnosis", "treatment",
    "prescription", "clinical", "ehr", "phi", "hipaa",
  ];
  const hasHealthData = dataCollected.some((d) =>
    healthKeywords.some((kw) => d.toLowerCase().includes(kw))
  );
  if (hasHealthData) {
    return { applies: true, reason: "Processes protected health information (PHI)" };
  }
  // Storage/database could contain PHI
  if (category === "database" || category === "storage") {
    return { applies: false, reason: "May apply if storing PHI — requires manual assessment" };
  }
  return { applies: false, reason: "No PHI processing identified" };
}

function assessSOC2(
  name: string,
  category: string,
  dataCollected: string[],
): RegApplicability {
  // SOC 2 applies broadly to any service handling customer data
  if (["auth", "database", "storage", "monitoring", "email"].includes(category)) {
    return { applies: true, reason: `${category} service relevant to SOC 2 Trust Service Criteria` };
  }
  if (category === "payment") {
    return { applies: true, reason: "Payment service — relevant to SOC 2 confidentiality criteria" };
  }
  if (category === "ai") {
    return { applies: true, reason: "AI service — relevant to SOC 2 processing integrity criteria" };
  }
  if (category === "analytics" || category === "advertising") {
    return { applies: true, reason: "Processes customer data — relevant to SOC 2 privacy criteria" };
  }
  return { applies: false, reason: "Limited SOC 2 relevance" };
}

function mapService(
  name: string,
  category: string,
  dataCollected: string[],
): ServiceRegMap {
  return {
    serviceName: name,
    category,
    gdpr: assessGDPR(name, category, dataCollected),
    ccpa: assessCCPA(name, category, dataCollected),
    aiAct: assessAIAct(name, category, dataCollected),
    pci: assessPCI(name, category, dataCollected),
    hipaa: assessHIPAA(name, category, dataCollected),
    soc2: assessSOC2(name, category, dataCollected),
  };
}

function applicabilityIcon(a: RegApplicability): string {
  if (a.applies) return "YES";
  if (a.reason.includes("requires manual") || a.reason.includes("May apply")) return "?";
  return "—";
}

export function generateRegulatoryMappingMatrix(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];

  const mappings = scan.services.map((s) =>
    mapService(s.name, s.category, s.dataCollected)
  );

  const lines: string[] = [];

  // Header
  lines.push("# Regulatory Mapping Matrix");
  lines.push("");
  lines.push(`**Organization:** ${company}`);
  lines.push("");
  lines.push(`**Generated:** ${date}`);
  lines.push("");
  lines.push(
    "This matrix maps each detected third-party service to applicable regulations. " +
    "Use this to understand the regulatory landscape for your technology stack and " +
    "prioritize compliance efforts accordingly."
  );
  lines.push("");

  // Legend
  lines.push("## Legend");
  lines.push("");
  lines.push("| Symbol | Meaning |");
  lines.push("|--------|---------|");
  lines.push("| **YES** | Regulation applies to this service |");
  lines.push("| **?** | May apply — requires manual assessment |");
  lines.push("| **—** | Not applicable based on current analysis |");
  lines.push("");

  // Main matrix table
  lines.push("## Service-to-Regulation Matrix");
  lines.push("");
  lines.push("| Service | Category | GDPR | CCPA | EU AI Act | PCI DSS | HIPAA | SOC 2 |");
  lines.push("|---------|----------|------|------|-----------|---------|-------|-------|");

  for (const m of mappings) {
    lines.push(
      `| ${m.serviceName} | ${m.category} | ${applicabilityIcon(m.gdpr)} | ${applicabilityIcon(m.ccpa)} | ${applicabilityIcon(m.aiAct)} | ${applicabilityIcon(m.pci)} | ${applicabilityIcon(m.hipaa)} | ${applicabilityIcon(m.soc2)} |`
    );
  }
  lines.push("");

  // Summary counts
  const regs = ["gdpr", "ccpa", "aiAct", "pci", "hipaa", "soc2"] as const;
  const regLabels: Record<typeof regs[number], string> = {
    gdpr: "GDPR",
    ccpa: "CCPA",
    aiAct: "EU AI Act",
    pci: "PCI DSS",
    hipaa: "HIPAA",
    soc2: "SOC 2",
  };

  lines.push("## Regulation Coverage Summary");
  lines.push("");
  lines.push("| Regulation | Services Affected | Coverage % | Priority |");
  lines.push("|-----------|------------------|-----------|----------|");

  for (const reg of regs) {
    const affected = mappings.filter((m) => m[reg].applies).length;
    const maybe = mappings.filter((m) => !m[reg].applies && (m[reg].reason.includes("requires manual") || m[reg].reason.includes("May apply"))).length;
    const pct = Math.round((affected / mappings.length) * 100);
    const priority = affected > mappings.length * 0.5 ? "High" : affected > 0 ? "Medium" : "Low";
    const maybeStr = maybe > 0 ? ` (+${maybe} pending)` : "";
    lines.push(`| ${regLabels[reg]} | ${affected}/${mappings.length}${maybeStr} | ${pct}% | ${priority} |`);
  }
  lines.push("");

  // Detailed reasoning per regulation
  lines.push("## Detailed Assessment by Regulation");
  lines.push("");

  for (const reg of regs) {
    const label = regLabels[reg];
    const affectedServices = mappings.filter((m) => m[reg].applies);
    const maybeServices = mappings.filter((m) =>
      !m[reg].applies && (m[reg].reason.includes("requires manual") || m[reg].reason.includes("May apply"))
    );

    lines.push(`### ${label}`);
    lines.push("");

    if (affectedServices.length === 0 && maybeServices.length === 0) {
      lines.push(`No services identified as subject to ${label} requirements.`);
      lines.push("");
      continue;
    }

    if (affectedServices.length > 0) {
      lines.push("**Applicable services:**");
      lines.push("");
      lines.push("| Service | Reason |");
      lines.push("|---------|--------|");
      for (const m of affectedServices) {
        lines.push(`| ${m.serviceName} | ${m[reg].reason} |`);
      }
      lines.push("");
    }

    if (maybeServices.length > 0) {
      lines.push("**Requires manual assessment:**");
      lines.push("");
      lines.push("| Service | Reason |");
      lines.push("|---------|--------|");
      for (const m of maybeServices) {
        lines.push(`| ${m.serviceName} | ${m[reg].reason} |`);
      }
      lines.push("");
    }
  }

  // Category heatmap
  lines.push("## Category Heatmap");
  lines.push("");
  lines.push("Regulatory exposure by service category:");
  lines.push("");
  lines.push("| Category | # Services | GDPR | CCPA | AI Act | PCI | HIPAA | SOC 2 | Regulatory Exposure |");
  lines.push("|----------|-----------|------|------|--------|-----|-------|-------|-------------------|");

  const categories = [...new Set(mappings.map((m) => m.category))];
  for (const cat of categories) {
    const catMappings = mappings.filter((m) => m.category === cat);
    const count = catMappings.length;
    const regCounts: number[] = [];
    for (const reg of regs) {
      const c = catMappings.filter((m) => m[reg].applies).length;
      regCounts.push(c);
    }
    const totalApplicable = regCounts.reduce((a, b) => a + b, 0);
    const maxPossible = count * regs.length;
    const exposure = maxPossible > 0 ? Math.round((totalApplicable / maxPossible) * 100) : 0;
    const exposureLabel = exposure >= 70 ? "High" : exposure >= 40 ? "Medium" : "Low";
    lines.push(
      `| ${cat} | ${count} | ${regCounts[0]} | ${regCounts[1]} | ${regCounts[2]} | ${regCounts[3]} | ${regCounts[4]} | ${regCounts[5]} | ${exposure}% (${exposureLabel}) |`
    );
  }
  lines.push("");

  // Recommendations
  lines.push("## Recommendations");
  lines.push("");

  const gdprCount = mappings.filter((m) => m.gdpr.applies).length;
  const ccpaCount = mappings.filter((m) => m.ccpa.applies).length;
  const aiActCount = mappings.filter((m) => m.aiAct.applies).length;
  const pciCount = mappings.filter((m) => m.pci.applies).length;
  const hipaaCount = mappings.filter((m) => m.hipaa.applies).length;

  let recNum = 1;
  if (gdprCount > 0) {
    lines.push(`${recNum}. **GDPR:** ${gdprCount} service(s) process personal data. Ensure DPAs are in place, lawful basis is documented, and DSAR handling procedures are established.`);
    recNum++;
  }
  if (ccpaCount > 0) {
    lines.push(`${recNum}. **CCPA:** ${ccpaCount} service(s) process consumer information. Ensure "Do Not Sell" mechanisms are implemented and privacy notice is updated.`);
    recNum++;
  }
  if (aiActCount > 0) {
    lines.push(`${recNum}. **EU AI Act:** ${aiActCount} AI service(s) detected. Classify risk level, implement transparency requirements, and document human oversight measures.`);
    recNum++;
  }
  if (pciCount > 0) {
    lines.push(`${recNum}. **PCI DSS:** ${pciCount} payment service(s) detected. Verify PCI compliance of payment processors and minimize cardholder data exposure.`);
    recNum++;
  }
  if (hipaaCount > 0) {
    lines.push(`${recNum}. **HIPAA:** ${hipaaCount} service(s) may process PHI. Conduct BAA assessment and implement required safeguards.`);
    recNum++;
  }
  lines.push(`${recNum}. **SOC 2:** Review Trust Service Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy) against all applicable services.`);
  lines.push("");

  // Disclaimer
  lines.push("---");
  lines.push("");
  lines.push(
    `*This regulatory mapping matrix was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `Applicability assessments are based on service categories and detected data types. ` +
    `Consult legal counsel to confirm regulatory obligations for your specific jurisdiction and use case.*`
  );
  lines.push("");

  return lines.join("\n");
}
