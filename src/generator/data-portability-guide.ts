import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Per-service data export instructions and API endpoints.
 */
interface ServiceExportInfo {
  provider: string;
  exportUrl: string;
  apiEndpoint: string | null;
  exportFormats: string[];
  instructions: string[];
  timeEstimate: string;
}

const SERVICE_EXPORT_DATABASE: Record<string, ServiceExportInfo> = {
  "Google Analytics": {
    provider: "Google LLC",
    exportUrl: "https://analytics.google.com/ > Admin > Data Export",
    apiEndpoint: "https://analyticsdata.googleapis.com/v1beta/{property}:runReport",
    exportFormats: ["CSV", "JSON", "Google Sheets"],
    instructions: [
      "Navigate to Google Analytics Admin panel",
      "Select the property for your application",
      "Go to Admin > Data Export to download reports",
      "Use the Google Analytics Data API for programmatic export",
    ],
    timeEstimate: "Available immediately via API; bulk exports within 24 hours",
  },
  "@google-analytics/data": {
    provider: "Google LLC",
    exportUrl: "https://analytics.google.com/ > Admin > Data Export",
    apiEndpoint: "https://analyticsdata.googleapis.com/v1beta/{property}:runReport",
    exportFormats: ["CSV", "JSON", "Google Sheets"],
    instructions: [
      "Navigate to Google Analytics Admin panel",
      "Use the GA4 Data API for programmatic export of user-level data",
    ],
    timeEstimate: "Available immediately via API",
  },
  posthog: {
    provider: "PostHog Inc",
    exportUrl: "https://app.posthog.com/project/settings > Data Management",
    apiEndpoint: "https://app.posthog.com/api/projects/{project_id}/events",
    exportFormats: ["JSON", "CSV"],
    instructions: [
      "Log in to PostHog dashboard",
      "Navigate to Data Management > Exports",
      "Create a data export for the desired date range",
      "Use the PostHog API /api/projects/{id}/events for programmatic access",
    ],
    timeEstimate: "API responses immediate; bulk exports within 1 hour",
  },
  mixpanel: {
    provider: "Mixpanel Inc",
    exportUrl: "https://mixpanel.com/report > Data Export",
    apiEndpoint: "https://data.mixpanel.com/api/2.0/export",
    exportFormats: ["JSON", "CSV"],
    instructions: [
      "Log in to Mixpanel and navigate to your project",
      "Go to Data Management > Export Data",
      "Select date range and export format",
      "Use the Mixpanel Data Export API for raw event data",
    ],
    timeEstimate: "API responses immediate; full exports within 24 hours",
  },
  "@amplitude/analytics-browser": {
    provider: "Amplitude Inc",
    exportUrl: "https://analytics.amplitude.com/settings > Data Export",
    apiEndpoint: "https://amplitude.com/api/2/export",
    exportFormats: ["JSON", "CSV", "gzip"],
    instructions: [
      "Log in to Amplitude and navigate to Settings",
      "Go to Organization Settings > Data Export",
      "Use the Export API to retrieve raw event data",
    ],
    timeEstimate: "Export API returns data within 1 hour",
  },
  "@stripe/stripe-js": {
    provider: "Stripe Inc",
    exportUrl: "https://dashboard.stripe.com/settings/data",
    apiEndpoint: "https://api.stripe.com/v1/customers/{id}",
    exportFormats: ["JSON", "CSV"],
    instructions: [
      "Log in to Stripe Dashboard",
      "Navigate to Settings > Data & Privacy",
      "Use the customer data export feature",
      "Programmatically retrieve customer data via Stripe API",
    ],
    timeEstimate: "API responses immediate; full account export within 48 hours",
  },
  stripe: {
    provider: "Stripe Inc",
    exportUrl: "https://dashboard.stripe.com/settings/data",
    apiEndpoint: "https://api.stripe.com/v1/customers/{id}",
    exportFormats: ["JSON", "CSV"],
    instructions: [
      "Log in to Stripe Dashboard",
      "Navigate to Settings > Data & Privacy",
      "Use the Stripe API to export customer and payment data",
    ],
    timeEstimate: "API responses immediate; full export within 48 hours",
  },
  firebase: {
    provider: "Google LLC (Firebase)",
    exportUrl: "https://console.firebase.google.com > Project Settings > Data Export",
    apiEndpoint: "https://firestore.googleapis.com/v1/projects/{project}/databases/{db}/documents",
    exportFormats: ["JSON", "BigQuery"],
    instructions: [
      "Open Firebase Console for your project",
      "Navigate to Project Settings > Privacy & Security",
      "Use Firebase Admin SDK to export user data",
      "For Firestore data, use the export to BigQuery feature or the REST API",
    ],
    timeEstimate: "API immediate; full export depends on data volume (up to 72 hours)",
  },
  "@supabase/supabase-js": {
    provider: "Supabase Inc",
    exportUrl: "https://app.supabase.com/project/{ref}/settings",
    apiEndpoint: "https://{ref}.supabase.co/rest/v1/{table}?select=*",
    exportFormats: ["JSON", "CSV", "SQL"],
    instructions: [
      "Log in to Supabase Dashboard",
      "Navigate to your project settings",
      "Use the Table Editor to export specific tables as CSV",
      "Use the Supabase REST API (PostgREST) for programmatic data export",
    ],
    timeEstimate: "API responses immediate",
  },
  "@clerk/nextjs": {
    provider: "Clerk Inc",
    exportUrl: "https://dashboard.clerk.com > Users > Export",
    apiEndpoint: "https://api.clerk.com/v1/users/{user_id}",
    exportFormats: ["JSON"],
    instructions: [
      "Log in to Clerk Dashboard",
      "Navigate to Users section",
      "Use the Clerk Backend API to retrieve user data",
      "Export user metadata via GET /v1/users/{user_id}",
    ],
    timeEstimate: "API responses immediate",
  },
  "next-auth": {
    provider: "First-party (NextAuth.js)",
    exportUrl: "N/A (data stored in your database)",
    apiEndpoint: "N/A (query your database directly)",
    exportFormats: ["JSON", "CSV", "database-native"],
    instructions: [
      "NextAuth.js stores session data in your own database",
      "Query the accounts, sessions, and users tables directly",
      "Build a DSAR export endpoint in your application to serve user data",
    ],
    timeEstimate: "Depends on your implementation",
  },
  "@auth/core": {
    provider: "First-party (Auth.js)",
    exportUrl: "N/A (data stored in your database)",
    apiEndpoint: "N/A (query your database directly)",
    exportFormats: ["JSON", "CSV", "database-native"],
    instructions: [
      "Auth.js stores session data in your own database",
      "Query the users and sessions tables directly",
      "Implement a data export API endpoint for DSAR compliance",
    ],
    timeEstimate: "Depends on your implementation",
  },
  "@sendgrid/mail": {
    provider: "Twilio SendGrid",
    exportUrl: "https://app.sendgrid.com/settings/data_export",
    apiEndpoint: "https://api.sendgrid.com/v3/messages",
    exportFormats: ["JSON", "CSV"],
    instructions: [
      "Log in to SendGrid Dashboard",
      "Navigate to Settings > Data Export",
      "Use the SendGrid API to retrieve email activity data",
    ],
    timeEstimate: "API responses immediate; bulk export within 24 hours",
  },
  "@segment/analytics-next": {
    provider: "Twilio Segment",
    exportUrl: "https://app.segment.com > Privacy Portal",
    apiEndpoint: "https://profiles.segment.com/v1/spaces/{id}/collections/users/profiles/{user_id}/traits",
    exportFormats: ["JSON"],
    instructions: [
      "Log in to Segment workspace",
      "Navigate to Privacy Portal for GDPR data subject requests",
      "Use the Profile API to retrieve user trait data",
      "Submit a data export request through the Privacy Portal",
    ],
    timeEstimate: "Privacy Portal requests processed within 7 days",
  },
};

/**
 * Generates DATA_PORTABILITY_GUIDE.md — a guide for exercising the GDPR
 * Article 20 right to data portability, with per-service export instructions
 * and API endpoints.
 *
 * Only generated when data-processing services are detected.
 */
export function generateDataPortabilityGuide(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const dpoEmail = ctx?.dpoEmail;
  const date = new Date().toISOString().split("T")[0];

  // Match services to export instructions
  const matchedServices: { serviceName: string; info: ServiceExportInfo }[] = [];
  const seenProviders = new Set<string>();

  for (const service of scan.services) {
    const info = SERVICE_EXPORT_DATABASE[service.name];
    if (info && !seenProviders.has(info.provider)) {
      seenProviders.add(info.provider);
      matchedServices.push({ serviceName: service.name, info });
    }
  }

  if (matchedServices.length === 0) {
    return null;
  }

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────
  sections.push("# Data Portability Guide");
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(`**Project:** ${scan.projectName}`);
  sections.push(`**Organization:** ${company}`);
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push("This guide documents how to exercise the **right to data portability** under GDPR Article 20. Data portability allows data subjects to receive their personal data in a structured, commonly used, and machine-readable format, and to transmit that data to another controller without hindrance.");
  sections.push("");

  // ── Legal Basis ─────────────────────────────────────────────────────
  sections.push("## Legal Basis");
  sections.push("");
  sections.push("**GDPR Article 20 — Right to Data Portability:**");
  sections.push("");
  sections.push("> 1. The data subject shall have the right to receive the personal data concerning him or her, which he or she has provided to a controller, in a structured, commonly used and machine-readable format and have the right to transmit those data to another controller without hindrance from the controller to which the personal data have been provided.");
  sections.push(">");
  sections.push("> 2. In exercising his or her right to data portability, the data subject shall have the right to have the personal data transmitted directly from one controller to another, where technically feasible.");
  sections.push("");
  sections.push("### When Data Portability Applies");
  sections.push("");
  sections.push("The right to data portability applies when:");
  sections.push("");
  sections.push("- Processing is based on **consent** (Art. 6(1)(a)) or **contract** (Art. 6(1)(b))");
  sections.push("- Processing is carried out by **automated means**");
  sections.push("- The data was **provided by the data subject** (directly or through observation)");
  sections.push("");
  sections.push("It does **not** apply to:");
  sections.push("");
  sections.push("- Data processed under legitimate interest or legal obligation");
  sections.push("- Inferred or derived data (e.g., analytics scores, risk assessments)");
  sections.push("- Data that would adversely affect the rights of others");
  sections.push("");

  // ── How to Request ──────────────────────────────────────────────────
  sections.push("## How to Request Your Data");
  sections.push("");
  sections.push("To request a copy of your personal data in a portable format:");
  sections.push("");
  sections.push(`1. **Email:** Send a request to ${email}${dpoEmail ? ` or the DPO at ${dpoEmail}` : ""}`);
  sections.push("2. **Subject line:** \"Data Portability Request\"");
  sections.push("3. **Include:** Your name, account identifier (email or user ID), and the specific data you want exported");
  sections.push("4. **Response time:** We will respond within **30 days** of receiving your request (GDPR Art. 12(3))");
  sections.push("5. **Format:** Data will be provided in JSON or CSV format unless you request otherwise");
  sections.push("");
  sections.push("If you prefer, you may request that we transmit your data directly to another controller. We will do so where technically feasible.");
  sections.push("");

  // ── Per-Service Export Instructions ─────────────────────────────────
  sections.push("## Per-Service Export Instructions");
  sections.push("");
  sections.push("The following services process personal data in this application. Each section provides specific export instructions and API endpoints for retrieving your data.");
  sections.push("");

  for (const { serviceName, info } of matchedServices) {
    sections.push(`### ${info.provider}`);
    sections.push("");
    sections.push(`**Service:** ${serviceName}`);
    sections.push(`**Export Formats:** ${info.exportFormats.join(", ")}`);
    sections.push(`**Export URL:** ${info.exportUrl}`);
    if (info.apiEndpoint) {
      sections.push(`**API Endpoint:** \`${info.apiEndpoint}\``);
    }
    sections.push(`**Estimated Time:** ${info.timeEstimate}`);
    sections.push("");
    sections.push("**Steps:**");
    sections.push("");
    for (let i = 0; i < info.instructions.length; i++) {
      sections.push(`${i + 1}. ${info.instructions[i]}`);
    }
    sections.push("");
  }

  // ── Data Export Formats ─────────────────────────────────────────────
  sections.push("## Supported Export Formats");
  sections.push("");
  sections.push("Per GDPR Article 20, data must be provided in a **structured, commonly used, and machine-readable format**. We support:");
  sections.push("");
  sections.push("| Format | Description | Machine-Readable | Interoperable |");
  sections.push("|--------|-------------|------------------|---------------|");
  sections.push("| JSON | JavaScript Object Notation | Yes | Yes |");
  sections.push("| CSV | Comma-Separated Values | Yes | Yes |");
  sections.push("| XML | Extensible Markup Language | Yes | Yes |");
  sections.push("");
  sections.push("All exports include metadata headers (export date, data subject ID, scope) to facilitate import into other systems.");
  sections.push("");

  // ── Implementation Checklist ────────────────────────────────────────
  sections.push("## Implementation Checklist");
  sections.push("");
  sections.push("The following checklist ensures your data portability implementation meets GDPR requirements:");
  sections.push("");
  sections.push("- [ ] Data export API endpoint is implemented and accessible");
  sections.push("- [ ] Export includes all personal data provided by the data subject");
  sections.push("- [ ] Export format is structured, commonly used, and machine-readable");
  sections.push("- [ ] Direct transmission to another controller is supported where feasible");
  sections.push("- [ ] Portability requests are tracked and responded to within 30 days");
  sections.push("- [ ] Authentication verifies the identity of the requesting data subject");
  sections.push("- [ ] Export excludes third-party personal data (to protect others' rights)");
  sections.push("- [ ] Sub-processor data is included or referenced with retrieval instructions");
  sections.push("");

  // ── Contact ─────────────────────────────────────────────────────────
  sections.push("## Contact");
  sections.push("");
  sections.push(`For data portability requests or questions about your right to data portability, contact:`);
  sections.push("");
  sections.push(`- **Email:** ${email}`);
  if (dpoEmail) {
    sections.push(`- **Data Protection Officer:** ${dpoEmail}`);
  }
  sections.push("");
  sections.push("You also have the right to lodge a complaint with your local data protection supervisory authority if you believe your data portability rights have not been respected.");
  sections.push("");

  // ── Disclaimer ──────────────────────────────────────────────────────
  sections.push("---");
  sections.push("");
  sections.push(
    `*This data portability guide was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
    `based on an automated scan of the **${scan.projectName}** codebase. ` +
    `It should be reviewed by your legal and engineering teams to ensure completeness and accuracy. ` +
    `Export instructions may change as third-party services update their APIs and dashboards.*`
  );

  return sections.join("\n");
}
