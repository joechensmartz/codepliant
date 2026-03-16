import type { ScanResult, DetectedService } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generate COMPLIANCE_FAQ.md — auto-generated FAQ based on detected services.
 * 20+ questions with answers populated from scan results and context.
 */

/** Data flow descriptions per service category. */
const DATA_FLOW_DESCRIPTIONS: Record<string, string> = {
  ai: "Your input is sent to the AI provider's API for processing. The provider may temporarily store prompts and responses to deliver the service. We do not permit the provider to use your data for model training unless you explicitly opt in.",
  payment: "Payment details are transmitted directly to our payment processor via their secure SDK. We do not store full card numbers on our servers — only tokenized references and transaction metadata.",
  analytics: "Anonymous usage data (page views, click events, session duration) is collected to understand how our product is used. This data is aggregated and cannot be used to identify individual users.",
  auth: "Authentication credentials are processed through our identity provider. Passwords are hashed and never stored in plain text. Session tokens are encrypted and expire automatically.",
  email: "Email addresses are shared with our email service provider solely to deliver transactional and, if opted in, marketing communications. We do not sell email lists.",
  monitoring: "Error reports and performance metrics may include technical identifiers (IP addresses, device info). This data is used exclusively for debugging and service reliability.",
  storage: "Files you upload are stored in our cloud storage provider's infrastructure. Files are encrypted at rest and in transit. Access is restricted to authorized personnel.",
  database: "User data is stored in managed database services with encryption at rest. Access is controlled via role-based permissions and all queries are logged.",
  advertising: "Advertising identifiers and interaction data are shared with ad platforms to measure campaign effectiveness. You can opt out of personalized advertising at any time.",
  social: "If you use social login or sharing features, limited profile information is exchanged with the social platform. We only request the minimum permissions needed.",
  other: "Data is processed by third-party services as necessary to deliver our product. Each service operates under a data processing agreement.",
};

/** Retention period descriptions per category. */
const RETENTION_ANSWERS: Record<string, string> = {
  ai: "AI interaction data (prompts and responses) is retained for up to 90 days, then automatically purged.",
  payment: "Transaction records are retained for 7 years as required by tax and financial regulations.",
  analytics: "Analytics data is retained for up to 26 months, then automatically deleted or anonymized.",
  auth: "Account data is retained until you delete your account. Session data expires automatically.",
  email: "Email communication records are retained for up to 3 years.",
  monitoring: "Error logs and performance data are retained for up to 90 days.",
  storage: "Uploaded files are retained until you delete them or close your account.",
  database: "User data is retained until you delete your account or request erasure.",
  advertising: "Advertising data is retained for up to 26 months.",
  social: "Social integration data is retained for up to 26 months.",
  other: "Data is retained as long as necessary for the service, typically no more than 1 year.",
};

/** Known service data descriptions for "What data does X receive?" */
const SERVICE_DATA_DETAILS: Record<string, { receives: string; doesNot: string }> = {
  openai: {
    receives: "Text prompts, conversation context, and any content you submit for AI processing. OpenAI may also receive metadata such as request timestamps and API version.",
    doesNot: "OpenAI does not receive your account password, payment details, or data from other parts of the application unrelated to AI features.",
  },
  anthropic: {
    receives: "Text prompts and conversation context submitted through AI features. Request metadata including timestamps.",
    doesNot: "Anthropic does not receive your personal account details, payment information, or browsing history.",
  },
  stripe: {
    receives: "Payment card details (via their SDK), billing address, email, transaction amounts, and currency. Stripe also receives device fingerprint data for fraud prevention.",
    doesNot: "Stripe does not receive your password, usage analytics, or content you create in the application.",
  },
  "google-analytics": {
    receives: "Page URLs visited, session duration, device type, browser, approximate location (city-level from IP), and interaction events you trigger.",
    doesNot: "Google Analytics does not receive your name, email, payment details, or file contents.",
  },
  firebase: {
    receives: "Authentication tokens, device identifiers, crash reports, and performance metrics. If using Firestore/RTDB, your application data.",
    doesNot: "Firebase does not receive payment card numbers or data from other third-party services.",
  },
  aws: {
    receives: "Whatever data your application stores or processes on AWS infrastructure — this may include user data, files, and database records.",
    doesNot: "AWS infrastructure services process data on your behalf and do not access content for their own purposes.",
  },
  sentry: {
    receives: "Error stack traces, device information, OS version, browser details, and IP addresses. May include breadcrumb data showing user actions before an error.",
    doesNot: "Sentry does not receive payment details, passwords, or the full content of user-generated data.",
  },
  mixpanel: {
    receives: "Event names, properties, device information, and user identifiers you configure. May include IP addresses for geolocation.",
    doesNot: "Mixpanel does not receive payment details or file contents unless explicitly sent as event properties.",
  },
  twilio: {
    receives: "Phone numbers, SMS/email content, and delivery metadata.",
    doesNot: "Twilio does not receive your users' passwords, payment details, or application content unrelated to messaging.",
  },
  sendgrid: {
    receives: "Email addresses, email content (subject, body), and delivery tracking data.",
    doesNot: "SendGrid does not receive payment details, user passwords, or non-email application data.",
  },
  auth0: {
    receives: "User credentials (hashed), profile information, login timestamps, IP addresses, and device information.",
    doesNot: "Auth0 does not receive payment details, file uploads, or application-specific content.",
  },
  clerk: {
    receives: "User credentials, profile data, session tokens, and authentication events.",
    doesNot: "Clerk does not receive payment information, file contents, or application usage data.",
  },
  supabase: {
    receives: "Authentication data, database queries, and stored files depending on which Supabase features you use.",
    doesNot: "Supabase does not share your data with third parties for advertising purposes.",
  },
};

function getUniqueCategories(services: DetectedService[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of services) {
    if (!seen.has(s.category)) {
      seen.add(s.category);
      result.push(s.category);
    }
  }
  return result;
}

function formatCategory(cat: string): string {
  const labels: Record<string, string> = {
    ai: "AI Services",
    payment: "Payment Processing",
    analytics: "Analytics",
    auth: "Authentication",
    email: "Email Services",
    database: "Database",
    storage: "File Storage",
    monitoring: "Error Monitoring",
    advertising: "Advertising",
    social: "Social Integration",
    other: "Other Services",
  };
  return labels[cat] || cat;
}

export function generateComplianceFAQ(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[your-website.com]";
  const date = new Date().toISOString().split("T")[0];
  const categories = getUniqueCategories(scan.services);
  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAnalytics = scan.services.some((s) => s.category === "analytics");
  const hasAdvertising = scan.services.some((s) => s.category === "advertising");
  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasStorage = scan.services.some((s) => s.category === "storage");
  const hasMonitoring = scan.services.some((s) => s.category === "monitoring");
  const serviceNames = scan.services.map((s) => s.name);
  const allDataCollected = [...new Set(scan.services.flatMap((s) => s.dataCollected))];
  const jurisdictions = ctx?.jurisdictions || [];
  const hasGDPR = jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr") || true;
  const hasCCPA = jurisdictions.some((j) => j === "ccpa");

  const sections: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────

  sections.push(`# Compliance FAQ

**Last updated:** ${date}

**${company}** — Frequently Asked Questions about Data Privacy & Compliance

> This FAQ is auto-generated from our actual codebase analysis. Every answer below is based on the services and data flows detected in our application.

*${scan.services.length} services detected across ${categories.length} categories.*

---`);

  // ── Section 1: Data Collection ──────────────────────────────────────

  sections.push(`## Data Collection

### Q1: What personal data do you collect?

Based on our code analysis, we collect the following types of data:

${allDataCollected.map((d) => `- ${d}`).join("\n")}

This data is collected through ${scan.services.length} integrated service(s): ${serviceNames.join(", ")}.

### Q2: Why do you collect this data?

We collect data only when necessary to:

- **Provide our service** — core functionality requires certain data to operate
- **Ensure security** — protecting your account and our infrastructure${hasAnalytics ? "\n- **Improve our product** — understanding usage patterns helps us build better features" : ""}${hasPayment ? "\n- **Process payments** — completing transactions you initiate" : ""}${hasAI ? "\n- **Power AI features** — delivering AI-assisted functionality you request" : ""}
- **Comply with law** — meeting legal obligations (tax records, fraud prevention)

### Q3: Do you collect data from children?

No. Our service is not directed at children under 16 (or 13 in the US). We do not knowingly collect personal data from children. If we learn that we have collected data from a child, we will delete it promptly. Contact ${email} if you believe a child has provided us data.`);

  // ── Section 2: Per-Service Questions ────────────────────────────────

  const serviceQuestions: string[] = [];
  let questionNum = 4;

  for (const service of scan.services) {
    const key = service.name.toLowerCase().replace(/\s+/g, "-");
    const details = SERVICE_DATA_DETAILS[key];
    if (details) {
      serviceQuestions.push(`### Q${questionNum}: What data does ${service.name} receive?

**What ${service.name} receives:** ${details.receives}

**What ${service.name} does NOT receive:** ${details.doesNot}

**Data collected via ${service.name}:** ${service.dataCollected.join(", ")}`);
      questionNum++;
    }
  }

  if (serviceQuestions.length > 0) {
    sections.push(`## Service-Specific Questions

${serviceQuestions.join("\n\n")}`);
  }

  // ── Section 3: Data Sharing & Selling ───────────────────────────────

  const sellAnswer = hasAdvertising
    ? `We share limited data with advertising partners to measure campaign effectiveness. **However, we do not "sell" your personal data in the traditional sense.** Under CCPA, certain data sharing with ad partners may be classified as a "sale" — you can opt out at any time by contacting ${email} or using the opt-out controls in your account settings.`
    : `**No. We do not sell your personal data.** We do not share your data with third parties for their own marketing purposes. Data is only shared with our service providers (sub-processors) who process data on our behalf under strict contractual obligations.`;

  sections.push(`## Data Sharing & Third Parties

### Q${questionNum}: Do you sell my data?

${sellAnswer}

### Q${questionNum + 1}: Who do you share my data with?

We share data only with the service providers necessary to operate our product:

${scan.services.map((s) => `| ${s.name} | ${formatCategory(s.category)} | ${s.dataCollected.slice(0, 3).join(", ")} |`).join("\n")}

Each provider operates under a Data Processing Agreement (DPA) that limits how they can use your data. See our full Sub-Processor List for details.

### Q${questionNum + 2}: Do third parties have access to my raw data?

Third-party services receive only the minimum data necessary for their function. They are contractually prohibited from using your data for purposes other than providing their service to us.`);
  questionNum += 3;

  // ── Section 4: Data Retention ───────────────────────────────────────

  let retentionSection = `## Data Retention

### Q${questionNum}: How long do you keep my data?

Retention periods vary by data category:

| Category | Retention Period |
|----------|-----------------|`;

  for (const cat of categories) {
    const answer = RETENTION_ANSWERS[cat] || RETENTION_ANSWERS["other"];
    retentionSection += `\n| ${formatCategory(cat)} | ${answer} |`;
  }

  if (ctx?.dataRetentionDays) {
    retentionSection += `\n\n**Default retention period:** ${ctx.dataRetentionDays} days for data not covered by a specific category.`;
  }
  questionNum++;

  retentionSection += `

### Q${questionNum}: Can I request my data be deleted sooner?

Yes. You can request deletion of your personal data at any time by emailing ${email} with the subject "Data Deletion Request." We will process your request within 30 days.${hasPayment ? " Note: transaction records required by tax law (typically 7 years) cannot be deleted early." : ""}`;
  questionNum++;

  sections.push(retentionSection);

  // ── Section 5: Data Security ────────────────────────────────────────

  sections.push(`## Data Security

### Q${questionNum}: How do you protect my data?

We implement industry-standard security measures including:

- **Encryption in transit:** All data is transmitted over HTTPS/TLS 1.2+
- **Encryption at rest:** Stored data is encrypted using AES-256 or equivalent${hasAuth ? "\n- **Authentication security:** Passwords are hashed using bcrypt/argon2; MFA is supported" : ""}${hasMonitoring ? "\n- **Monitoring:** Real-time error and security event monitoring" : ""}
- **Access control:** Role-based access with principle of least privilege
- **Regular audits:** Periodic security reviews and vulnerability assessments

### Q${questionNum + 1}: What happens if there is a data breach?

We maintain a documented Incident Response Plan. In the event of a data breach:

1. We will investigate and contain the breach within 24 hours
2. We will notify affected users without undue delay${hasGDPR ? " (within 72 hours as required by GDPR)" : ""}
3. We will notify the relevant supervisory authority where required
4. We will provide details on what data was affected and remediation steps

### Q${questionNum + 2}: Do you use encryption?

Yes. All data is encrypted both in transit (TLS 1.2+) and at rest (AES-256). API keys and credentials are stored in environment variables, never in source code.`);
  questionNum += 3;

  // ── Section 6: Your Rights ──────────────────────────────────────────

  let rightsSection = `## Your Rights

### Q${questionNum}: What rights do I have over my data?

You have the following rights:`;

  if (hasGDPR) {
    rightsSection += `

**Under GDPR (EU/EEA/UK):**
- **Access** — Request a copy of all data we hold about you
- **Rectification** — Request correction of inaccurate data
- **Erasure** — Request deletion of your data ("right to be forgotten")
- **Portability** — Receive your data in a machine-readable format
- **Restriction** — Request we limit processing of your data
- **Object** — Object to processing based on legitimate interest
- **Withdraw consent** — Withdraw consent at any time where processing is consent-based`;
  }

  if (hasCCPA) {
    rightsSection += `

**Under CCPA/CPRA (California):**
- **Know** — Know what personal information we collect and how it's used
- **Delete** — Request deletion of your personal information
- **Opt-out** — Opt out of the "sale" or "sharing" of personal information
- **Non-discrimination** — Equal service regardless of exercising your rights
- **Correct** — Request correction of inaccurate personal information`;
  }

  rightsSection += `

### Q${questionNum + 1}: How do I exercise my data rights?

Contact us at ${email} with your request. Please include:

1. Your name and email associated with your account
2. The specific right you wish to exercise
3. Any details to help us locate your data

We will respond within 30 days.`;
  questionNum += 2;

  sections.push(rightsSection);

  // ── Section 7: AI-specific ──────────────────────────────────────────

  if (hasAI) {
    const aiServices = scan.services.filter((s) => s.category === "ai");
    const aiNames = aiServices.map((s) => s.name).join(", ");

    sections.push(`## AI & Automated Processing

### Q${questionNum}: Do you use AI/machine learning?

Yes. We use the following AI services: **${aiNames}**.

${ctx?.aiUsageDescription || "AI features are used to enhance the product experience, provide intelligent suggestions, and automate tasks."}

### Q${questionNum + 1}: Is my data used to train AI models?

By default, **no**. We configure our AI providers to not use your data for model training. Your prompts and interactions are processed to deliver the AI feature you requested, then retained according to our data retention schedule (typically 90 days).

### Q${questionNum + 2}: Can I opt out of AI features?

Where AI features are optional, you can choose not to use them. For AI features that are core to the service, you can contact ${email} to discuss alternatives. We are transparent about which features use AI — see our AI Disclosure document for full details.

### Q${questionNum + 3}: What decisions are made by AI?

${ctx?.aiRiskLevel === "high" ? "Some AI features may influence significant decisions. We provide human oversight for any high-stakes automated decisions and you have the right to request human review." : "AI features are used to assist and augment your experience, not to make autonomous decisions that significantly affect you. A human is always in the loop for consequential decisions."}`);
    questionNum += 4;
  }

  // ── Section 8: Cookies & Tracking ───────────────────────────────────

  if (hasAnalytics || hasAdvertising) {
    sections.push(`## Cookies & Tracking

### Q${questionNum}: Do you use cookies?

Yes. We use cookies for:

${hasAuth ? "- **Essential cookies** — Required for authentication and security\n" : ""}- **Functional cookies** — Remembering your preferences
${hasAnalytics ? "- **Analytics cookies** — Understanding how our product is used (aggregated, anonymized)\n" : ""}${hasAdvertising ? "- **Advertising cookies** — Measuring ad campaign effectiveness\n" : ""}
See our Cookie Policy for the complete cookie inventory.

### Q${questionNum + 1}: How do I control cookies?

- **Cookie banner:** Accept or reject non-essential cookies when you first visit
- **Browser settings:** Block or delete cookies through your browser preferences
- **Account settings:** Manage tracking preferences in your account (where available)

### Q${questionNum + 2}: Do you use fingerprinting or tracking pixels?

${hasAdvertising ? "We may use tracking pixels for advertising measurement. We do not use browser fingerprinting for tracking purposes." : "We do not use browser fingerprinting. We may use standard analytics tools that set cookies with your consent."}`);
    questionNum += 3;
  }

  // ── Section 9: International Transfers ──────────────────────────────

  sections.push(`## International Data Transfers

### Q${questionNum}: Where is my data stored?

Data may be processed in the following regions based on our service providers:

${scan.services.map((s) => `- **${s.name}** — Processes data as described in their privacy policy`).join("\n")}

Many of our providers operate infrastructure in the US and EU. We ensure appropriate safeguards are in place for any international transfers.

### Q${questionNum + 1}: How do you protect international data transfers?

We rely on the following mechanisms to protect data transferred outside the EU/EEA:

- **Standard Contractual Clauses (SCCs)** — Approved by the European Commission
- **Data Processing Agreements** — Binding contractual obligations on each provider
- **Adequacy decisions** — Where available (e.g., EU-US Data Privacy Framework)
- **Supplementary measures** — Additional technical and organizational safeguards where needed`);
  questionNum += 2;

  // ── Section 10: Account & Payment ───────────────────────────────────

  if (hasPayment) {
    sections.push(`## Payments & Billing

### Q${questionNum}: Do you store my credit card number?

**No.** Payment processing is handled entirely by our payment processor. We never see, transmit, or store your full credit card number. We only retain a tokenized reference and basic transaction metadata (amount, date, status).

### Q${questionNum + 1}: Is my payment information secure?

Yes. Our payment processor is PCI DSS Level 1 certified — the highest level of payment security certification. All payment data is encrypted end-to-end.

### Q${questionNum + 2}: What happens to my payment data if I cancel?

Transaction records are retained for 7 years as required by tax and financial regulations. Your payment method details are removed from our systems when you cancel or request deletion.`);
    questionNum += 3;
  }

  // ── Section 11: General ─────────────────────────────────────────────

  sections.push(`## General

### Q${questionNum}: How will I know if this policy changes?

We will notify you of material changes through:

- Email notification to the address associated with your account
- A prominent notice on our website at ${website}
- Updated "Last updated" date on our Privacy Policy

### Q${questionNum + 1}: Who is responsible for data protection?

${ctx?.dpoName ? `Our Data Protection Officer is **${ctx.dpoName}**${ctx?.dpoEmail ? ` (${ctx.dpoEmail})` : ""}.` : `${company} is the data controller. For data protection inquiries, contact ${email}.`}

### Q${questionNum + 2}: How can I file a complaint?

If you believe your data protection rights have been violated:

1. **Contact us first** at ${email} — we take every complaint seriously
2. **Supervisory authority** — You have the right to lodge a complaint with your local data protection authority${hasGDPR ? " (e.g., your national DPA in the EU/EEA)" : ""}

### Q${questionNum + 3}: Do you comply with GDPR/CCPA?

${hasGDPR && hasCCPA ? `Yes. We comply with both the GDPR (EU General Data Protection Regulation) and the CCPA/CPRA (California Consumer Privacy Act). We apply the highest standard of data protection to all users regardless of location.` : hasGDPR ? `Yes. We comply with the GDPR (EU General Data Protection Regulation) and apply its standards to all users regardless of location.` : hasCCPA ? `Yes. We comply with the CCPA/CPRA (California Consumer Privacy Act) and apply strong data protection standards to all users.` : `We apply industry-standard data protection practices and comply with applicable data privacy regulations.`}

### Q${questionNum + 4}: Where can I find your full Privacy Policy?

Our complete Privacy Policy is available at ${website}/privacy. It provides detailed information about all data processing activities, legal bases, and your rights.`);
  questionNum += 5;

  // ── Section 12: Technical ───────────────────────────────────────────

  if (hasStorage || hasAuth) {
    sections.push(`## Technical Questions

### Q${questionNum}: Can I export all my data?

Yes. You can request a full export of your personal data in a machine-readable format (JSON/CSV) by contacting ${email}. ${hasGDPR ? "This is your right to data portability under GDPR Article 20." : "We aim to fulfill export requests within 30 days."}

### Q${questionNum + 1}: What happens to my data when I delete my account?

When you delete your account:

1. Your profile and account data is permanently deleted within 30 days
2. Content you created is removed from primary systems within 30 days
3. Backup copies are purged within 90 days
4. Anonymized/aggregated data that cannot identify you may be retained
${hasPayment ? "5. Transaction records required by law are retained for the mandated period\n" : ""}`);
    questionNum += 2;
  }

  // ── Footer ──────────────────────────────────────────────────────────

  sections.push(`---

## Contact

For any privacy-related questions not covered in this FAQ, contact us at:

- **Email:** ${email}${ctx?.dpoEmail ? `\n- **Data Protection Officer:** ${ctx.dpoEmail}` : ""}
- **Website:** ${website}

---

*This FAQ was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis of ${scan.services.length} detected services. It should be reviewed by a qualified legal professional before publication.*`);

  return sections.join("\n\n");
}
