import type { ScanResult, DetectedService, ServiceCategory } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";
import { buildDataFlowMap } from "../scanner/data-flow.js";

/** Map service categories to Mermaid node IDs and display labels. */
const CATEGORY_NODE: Record<string, { id: string; label: string }> = {
  auth: { id: "Auth", label: "Auth" },
  ai: { id: "AI", label: "AI" },
  payment: { id: "Pay", label: "Payment" },
  analytics: { id: "Analytics", label: "Analytics" },
  monitoring: { id: "Monitor", label: "Monitoring" },
  email: { id: "Email", label: "Email" },
  database: { id: "DB", label: "Database" },
  storage: { id: "Storage", label: "Storage" },
  advertising: { id: "Ads", label: "Advertising" },
  social: { id: "Social", label: "Social" },
  other: { id: "Other", label: "Third-Party" },
};

/** Map package names to short provider labels for Mermaid nodes. */
const PROVIDER_SHORT: Record<string, string> = {
  openai: "OpenAI",
  "@anthropic-ai/sdk": "Anthropic",
  "@google/generative-ai": "Gemini",
  stripe: "Stripe",
  "@paypal/checkout-server-sdk": "PayPal",
  "@lemonsqueezy/lemonsqueezy.js": "Lemon Squeezy",
  "@supabase/supabase-js": "Supabase",
  "@clerk/nextjs": "Clerk",
  "next-auth": "NextAuth",
  "@auth/core": "Auth.js",
  posthog: "PostHog",
  mixpanel: "Mixpanel",
  "@amplitude/analytics-browser": "Amplitude",
  "@vercel/analytics": "Vercel Analytics",
  "@google-analytics/data": "Google Analytics",
  "@sentry/node": "Sentry",
  "@sentry/nextjs": "Sentry",
  "@sentry/react": "Sentry",
  "@sendgrid/mail": "SendGrid",
  resend: "Resend",
  postmark: "Postmark",
  firebase: "Firebase",
  "firebase-admin": "Firebase",
  "@aws-sdk/client-s3": "AWS S3",
  cloudinary: "Cloudinary",
  "dd-trace": "Datadog",
  twilio: "Twilio",
  intercom: "Intercom",
  "@intercom/messenger-js-sdk": "Intercom",
  "@hubspot/api-client": "HubSpot",
  plaid: "Plaid",
  "@upstash/redis": "Upstash",
  mongoose: "MongoDB",
  prisma: "Prisma",
  drizzle: "Drizzle",
};

/**
 * Build a Mermaid `graph LR` diagram string from scan results.
 *
 * Nodes:
 * - User (left) sends data to service nodes (right)
 * - Service nodes may forward data to other service nodes (e.g. AI → Monitor)
 *
 * Edges are annotated with the data categories flowing between nodes.
 */
export function buildMermaidDiagram(scan: ScanResult): string {
  const lines: string[] = ["graph LR"];

  // Deduplicate by provider label to avoid duplicate nodes
  const seen = new Set<string>();

  interface Edge {
    from: string;
    to: string;
    toId: string;
    label: string;
  }

  const edges: Edge[] = [];

  for (const service of scan.services) {
    const providerLabel = PROVIDER_SHORT[service.name] || service.name;
    if (seen.has(providerLabel)) continue;
    seen.add(providerLabel);

    const node = CATEGORY_NODE[service.category] || CATEGORY_NODE["other"];
    const nodeId = sanitizeId(providerLabel);
    const dataLabel = service.dataCollected.slice(0, 3).join(", ");

    edges.push({
      from: "User",
      to: providerLabel,
      toId: nodeId,
      label: dataLabel || service.category,
    });
  }

  // Detect forwarding patterns: AI → monitoring, payment → email, etc.
  const categories = new Set(scan.services.map((s) => s.category));
  const monitoringServices = scan.services.filter((s) => s.category === "monitoring");
  const aiServices = scan.services.filter((s) => s.category === "ai");

  if (aiServices.length > 0 && monitoringServices.length > 0) {
    const aiLabel = PROVIDER_SHORT[aiServices[0].name] || aiServices[0].name;
    const monLabel = PROVIDER_SHORT[monitoringServices[0].name] || monitoringServices[0].name;
    if (aiLabel !== monLabel) {
      edges.push({
        from: aiLabel,
        to: monLabel,
        toId: sanitizeId(monLabel),
        label: "logs",
      });
    }
  }

  // Build edge lines
  for (const edge of edges) {
    const escapedLabel = edge.label.replace(/"/g, "'");
    lines.push(`  ${sanitizeId(edge.from)}[${edge.from}] -->|${escapedLabel}| ${edge.toId}[${edge.to}]`);
  }

  return lines.join("\n");
}

/** Sanitize a string for use as a Mermaid node ID. */
function sanitizeId(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}

/**
 * Generate a DATA_FLOW_DIAGRAM.md with an embedded Mermaid diagram
 * showing how data flows between the user and detected services.
 *
 * Returns null when no services are detected.
 */
export function generateDataFlowDiagram(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const diagram = buildMermaidDiagram(scan);
  const flow = buildDataFlowMap(scan);

  const sections: string[] = [];

  // ── Title ────────────────────────────────────────────────────────────
  sections.push(`# Data Flow Diagram

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Company:** ${company}

---

> This document provides a visual representation of how personal data flows through the application. The diagram below is rendered using [Mermaid](https://mermaid.js.org/) and can be viewed directly on GitHub, GitLab, or any Mermaid-compatible renderer.

## Visual Data Flow

\`\`\`mermaid
${diagram}
\`\`\``);

  // ── Legend ────────────────────────────────────────────────────────────
  sections.push(`
## Legend

| Symbol | Meaning |
|--------|---------|
| **User** | End user of the application |
| **Arrow labels** | Types of personal data transmitted |
| **Service nodes** | Third-party or internal services processing data |`);

  // ── Data Flow Details ────────────────────────────────────────────────
  sections.push(`
## Data Flow Details

### Collection Points
`);

  if (flow.collection.length > 0) {
    sections.push("| Source | Data Collected | Mechanism |");
    sections.push("|--------|---------------|-----------|");
    for (const entry of flow.collection) {
      sections.push(`| ${entry.source} | ${entry.dataItems.join(", ")} | ${entry.via} |`);
    }
  } else {
    sections.push("No direct data collection points detected.");
  }

  sections.push(`
### Third-Party Data Sharing
`);

  if (flow.sharing.length > 0) {
    sections.push("| Recipient | Category | Data Shared |");
    sections.push("|-----------|----------|-------------|");
    for (const entry of flow.sharing) {
      sections.push(`| ${entry.source} | ${entry.via} | ${entry.dataItems.join(", ")} |`);
    }
  } else {
    sections.push("No third-party data sharing detected.");
  }

  // ── Service Inventory ────────────────────────────────────────────────
  const servicesByCategory = new Map<string, DetectedService[]>();
  for (const service of scan.services) {
    const existing = servicesByCategory.get(service.category) || [];
    existing.push(service);
    servicesByCategory.set(service.category, existing);
  }

  sections.push(`
## Service Inventory

| Service | Category | Data Processed |
|---------|----------|---------------|`);

  for (const [category, services] of servicesByCategory) {
    for (const service of services) {
      const providerLabel = PROVIDER_SHORT[service.name] || service.name;
      sections.push(`| ${providerLabel} | ${category} | ${service.dataCollected.join(", ")} |`);
    }
  }

  // ── Footer ───────────────────────────────────────────────────────────
  sections.push(`
---

## How to Use This Diagram

1. **GitHub/GitLab:** The Mermaid diagram renders automatically in markdown preview
2. **VS Code:** Install the "Markdown Preview Mermaid Support" extension
3. **Export:** Use [Mermaid Live Editor](https://mermaid.live/) to export as SVG or PNG
4. **CI/CD:** Use \`@mermaid-js/mermaid-cli\` to generate images in your pipeline

For questions about this data flow diagram, contact ${email}.

---

*This data flow diagram was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all data flows for accuracy. This document does not constitute legal advice.*`);

  return sections.join("\n");
}
