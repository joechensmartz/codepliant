import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

// ── Country mapping for known services ────────────────────────────────────

interface ServiceTransferInfo {
  country: string;
  countryCode: string;
  safeguard: string;
  adequacyDecision: boolean;
}

const SERVICE_COUNTRY_MAP: Record<string, ServiceTransferInfo> = {
  // AI — US
  openai: { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@anthropic-ai/sdk": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@google/generative-ai": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@ai-sdk/openai": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@ai-sdk/anthropic": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@ai-sdk/google": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@ai-sdk/google-vertex": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@vercel/ai": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  replicate: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "together-ai": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  cohere: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@pinecone-database/pinecone": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  langchain: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },

  // Payment — US
  stripe: { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@paypal/checkout-server-sdk": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  plaid: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },

  // Analytics — US
  "@google-analytics/data": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  posthog: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  mixpanel: { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@amplitude/analytics-browser": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@vercel/analytics": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  hotjar: { country: "Malta", countryCode: "MT", safeguard: "EU — no transfer required", adequacyDecision: true },
  "@segment/analytics-next": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "launchdarkly-js-client-sdk": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@launchdarkly/node-server-sdk": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },

  // Auth — US
  "next-auth": { country: "Self-hosted", countryCode: "—", safeguard: "No third-party transfer", adequacyDecision: true },
  "@clerk/nextjs": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@auth/core": { country: "Self-hosted", countryCode: "—", safeguard: "No third-party transfer", adequacyDecision: true },
  "@supabase/supabase-js": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },

  // Email — US
  "@sendgrid/mail": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  resend: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  postmark: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@mailchimp/mailchimp_marketing": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@mailchimp/mailchimp_transactional": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },

  // Storage — US
  "@aws-sdk/client-s3": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@uploadthing/react": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  cloudinary: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@google-cloud/storage": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },

  // Monitoring — US
  "@sentry/node": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@sentry/nextjs": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@sentry/react": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "dd-trace": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },

  // Database — US
  firebase: { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "firebase-admin": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@upstash/redis": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },

  // Other — US
  twilio: { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@twilio/voice-sdk": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  intercom: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@intercom/messenger-js-sdk": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@hubspot/api-client": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  algoliasearch: { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  googleapis: { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
  "@onesignal/node-onesignal": { country: "United States", countryCode: "US", safeguard: "SCCs", adequacyDecision: false },
  "@cloudflare/workers-types": { country: "United States", countryCode: "US", safeguard: "EU-US DPF / SCCs", adequacyDecision: true },
};

// ── Generator ─────────────────────────────────────────────────────────────

function getServiceTransferInfo(service: DetectedService): ServiceTransferInfo {
  if (SERVICE_COUNTRY_MAP[service.name]) {
    return SERVICE_COUNTRY_MAP[service.name];
  }
  return {
    country: "Unknown",
    countryCode: "??",
    safeguard: "[Verify with provider]",
    adequacyDecision: false,
  };
}

/**
 * Generates CROSS_BORDER_TRANSFER_MAP.md — a visual map of all international
 * data transfers showing country, service, data type, and safeguard for each.
 *
 * Only generates when services with data processing are detected.
 */
export function generateCrossBorderTransferMap(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const processors = scan.services.filter((s) => s.isDataProcessor !== false);
  if (processors.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];
  const location = ctx?.companyLocation || "[Your Location]";

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Cross-Border Data Transfer Map");
  lines.push("");
  lines.push(`**Organisation:** ${company}`);
  lines.push(`**Data Exporter Location:** ${location}`);
  lines.push(`**Project:** ${scan.projectName}`);
  lines.push(`**Generated:** ${date}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    "> This document maps all international data transfers identified through code analysis. " +
      "It identifies the destination country, service provider, data types transferred, and applicable " +
      "legal safeguards for each transfer. Required under GDPR Chapter V (Articles 44-49) for EU data exporters."
  );
  lines.push("");

  // ── Mermaid Diagram ─────────────────────────────────────────────────────
  lines.push("## Transfer Flow Diagram");
  lines.push("");
  lines.push("```mermaid");
  lines.push("graph LR");
  lines.push(`  A["${company}<br/>${location}"]`);

  // Group services by country
  const countryServices = new Map<string, DetectedService[]>();
  for (const svc of processors) {
    const info = getServiceTransferInfo(svc);
    const key = info.country;
    const existing = countryServices.get(key) || [];
    existing.push(svc);
    countryServices.set(key, existing);
  }

  let nodeId = 0;
  const countryNodeMap = new Map<string, string>();
  for (const [country, services] of countryServices) {
    const countryNode = `C${nodeId++}`;
    countryNodeMap.set(country, countryNode);
    const serviceNames = services.map((s) => s.name).join("<br/>");
    lines.push(`  ${countryNode}["${country}<br/>${serviceNames}"]`);
    const info = getServiceTransferInfo(services[0]);
    const safeguardShort = info.adequacyDecision ? "DPF/Adequacy" : "SCCs";
    lines.push(`  A -->|"${safeguardShort}"| ${countryNode}`);
  }

  lines.push("```");
  lines.push("");

  // ── Country Summary ─────────────────────────────────────────────────────
  lines.push("## Transfer Summary by Country");
  lines.push("");
  lines.push("| Country | Services | Data Types | Safeguard | Adequacy Decision |");
  lines.push("|---------|----------|-----------|-----------|-------------------|");

  for (const [country, services] of countryServices) {
    const info = getServiceTransferInfo(services[0]);
    const serviceNames = services.map((s) => s.name).join(", ");
    const allData = new Set<string>();
    for (const s of services) {
      for (const d of s.dataCollected) allData.add(d);
    }
    const dataTypes = [...allData].slice(0, 4).join(", ");
    const adequacy = info.adequacyDecision ? "Yes" : "No";
    lines.push(
      `| ${country} (${info.countryCode}) | ${serviceNames} | ${dataTypes} | ${info.safeguard} | ${adequacy} |`
    );
  }
  lines.push("");

  // ── Detailed Transfer Register ──────────────────────────────────────────
  lines.push("## Detailed Transfer Register");
  lines.push("");
  lines.push("| # | Service | Category | Country | Data Types | Safeguard | DPF Certified | DPA in Place |");
  lines.push("|---|---------|----------|---------|-----------|-----------|---------------|-------------|");

  let idx = 1;
  for (const svc of processors) {
    const info = getServiceTransferInfo(svc);
    const data = svc.dataCollected.slice(0, 3).join(", ");
    const dpf = info.adequacyDecision ? "[Verify](https://www.dataprivacyframework.gov/list)" : "N/A";
    lines.push(
      `| ${idx++} | ${svc.name} | ${svc.category} | ${info.country} | ${data} | ${info.safeguard} | ${dpf} | [ ] |`
    );
  }
  lines.push("");

  // ── Safeguard Assessment ────────────────────────────────────────────────
  const nonAdequateServices = processors.filter((s) => {
    const info = getServiceTransferInfo(s);
    return !info.adequacyDecision && info.country !== "Self-hosted";
  });

  if (nonAdequateServices.length > 0) {
    lines.push("## Services Requiring Additional Safeguards");
    lines.push("");
    lines.push(
      "The following services transfer data to countries without an EU adequacy decision. " +
        "Additional safeguards (SCCs + supplementary measures) are required per the Schrems II ruling."
    );
    lines.push("");

    for (const svc of nonAdequateServices) {
      const info = getServiceTransferInfo(svc);
      lines.push(`### ${svc.name}`);
      lines.push("");
      lines.push(`- **Destination:** ${info.country}`);
      lines.push(`- **Safeguard:** ${info.safeguard}`);
      lines.push(`- **Data:** ${svc.dataCollected.join(", ")}`);
      lines.push("- **Required actions:**");
      lines.push("  - [ ] Execute Standard Contractual Clauses (Module 2: Controller to Processor)");
      lines.push("  - [ ] Complete Annex I (List of parties)");
      lines.push("  - [ ] Complete Annex II (Technical and organisational measures)");
      lines.push("  - [ ] Verify provider's DPF certification status");
      lines.push("  - [ ] Implement supplementary encryption measures if needed");
      lines.push("");
    }
  }

  // ── Data Type Matrix ────────────────────────────────────────────────────
  lines.push("## Data Type × Service Matrix");
  lines.push("");

  const allDataTypes = new Set<string>();
  for (const svc of processors) {
    for (const d of svc.dataCollected) allDataTypes.add(d);
  }

  const dataTypes = [...allDataTypes];
  const headerCols = ["Data Type", ...processors.map((s) => s.name)];
  lines.push(`| ${headerCols.join(" | ")} |`);
  lines.push(`| ${headerCols.map(() => "---").join(" | ")} |`);

  for (const dt of dataTypes) {
    const cells = processors.map((s) =>
      s.dataCollected.includes(dt) ? "●" : "—"
    );
    lines.push(`| ${dt} | ${cells.join(" | ")} |`);
  }
  lines.push("");

  // ── Compliance Checklist ────────────────────────────────────────────────
  lines.push("## Transfer Compliance Checklist");
  lines.push("");
  lines.push("- [ ] All transfers have a valid legal basis under GDPR Chapter V");
  lines.push("- [ ] SCCs (2021 version) executed with all non-DPF-certified providers");
  lines.push("- [ ] DPF certification verified for applicable US providers");
  lines.push("- [ ] Transfer Impact Assessment completed for each non-adequate country");
  lines.push("- [ ] Supplementary measures implemented where SCCs are relied upon");
  lines.push("- [ ] Data Processing Agreements in place with all processors");
  lines.push("- [ ] Record of Processing Activities updated with transfer details");
  lines.push("- [ ] Privacy Policy discloses international transfers and safeguards");
  lines.push("- [ ] DPO informed of all cross-border transfers");
  lines.push("");

  // ── Review Schedule ─────────────────────────────────────────────────────
  lines.push("## Review Schedule");
  lines.push("");
  lines.push("| Review | Frequency | Next Due |");
  lines.push("|--------|-----------|----------|");
  lines.push(`| Full transfer map review | Annual | ${nextYear(date)} |`);
  lines.push("| DPF certification verification | Semi-annual | [Set date] |");
  lines.push("| New service onboarding review | Per event | Ongoing |");
  lines.push("| Regulatory change assessment | Quarterly | [Set date] |");
  lines.push("");

  // ── Footer ──────────────────────────────────────────────────────────────
  lines.push(`**Contact:** ${email}`);
  if (ctx?.dpoEmail) {
    lines.push(`**Data Protection Officer:** ${ctx.dpoEmail}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    "*This Cross-Border Transfer Map was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
      "Service location and DPF certification status should be verified with each provider's current documentation. " +
      "This document does not constitute legal advice.*"
  );
  lines.push("");

  return lines.join("\n");
}

// ── Helpers ───────────────────────────────────────────────────────────────

function nextYear(dateStr: string): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
}
