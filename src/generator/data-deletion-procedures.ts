import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Known data deletion information for popular third-party services.
 * Maps service name (lowercase) to deletion instructions.
 */
interface ServiceDeletionInfo {
  apiEndpoint?: string;
  adminPanelSteps?: string[];
  retentionExceptions?: string[];
  documentationUrl?: string;
  notes?: string;
}

const SERVICE_DELETION_INFO: Record<string, ServiceDeletionInfo> = {
  stripe: {
    apiEndpoint: "`DELETE /v1/customers/:id` — deletes customer and associated payment data",
    adminPanelSteps: [
      "Navigate to Customers in the Stripe Dashboard",
      "Select the customer record",
      'Click "Delete customer" from the overflow menu',
    ],
    retentionExceptions: [
      "Transaction records retained for 7 years (financial regulation)",
      "Dispute/chargeback records retained until resolution + 90 days",
    ],
    documentationUrl: "https://stripe.com/docs/api/customers/delete",
  },
  openai: {
    apiEndpoint: "`DELETE /v1/files/:id` — deletes uploaded files; conversation data managed via organization settings",
    adminPanelSteps: [
      "Navigate to Settings > Data Controls in the OpenAI Dashboard",
      "Submit a data deletion request via the privacy portal",
    ],
    retentionExceptions: [
      "API usage logs retained for 30 days for abuse monitoring",
      "Fine-tuned model weights may require separate deletion request",
    ],
    documentationUrl: "https://platform.openai.com/docs/guides/production-best-practices",
  },
  anthropic: {
    apiEndpoint: "No direct deletion API — submit request via privacy portal",
    adminPanelSteps: [
      "Contact privacy@anthropic.com with the data subject's identifier",
      "Specify the data categories to be deleted",
    ],
    retentionExceptions: [
      "API logs retained for 30 days for safety monitoring (default)",
    ],
    documentationUrl: "https://www.anthropic.com/privacy",
  },
  supabase: {
    apiEndpoint: "`DELETE` from `auth.users` table via Supabase client or SQL; storage objects via `storage.from('bucket').remove()`",
    adminPanelSteps: [
      "Navigate to Authentication > Users in the Supabase Dashboard",
      "Select the user and click Delete User",
      "Check Storage buckets for user-uploaded files",
      "Run SQL to purge from custom tables: `DELETE FROM profiles WHERE user_id = ?`",
    ],
    retentionExceptions: [
      "Database backups may contain deleted data for up to 7 days (Pro plan)",
      "Edge function logs retained for 7 days",
    ],
    documentationUrl: "https://supabase.com/docs/guides/auth/managing-user-data",
  },
  firebase: {
    apiEndpoint: "`admin.auth().deleteUser(uid)` — deletes Firebase Auth record; Firestore/RTDB require manual cleanup",
    adminPanelSteps: [
      "Navigate to Authentication in Firebase Console",
      "Find and delete the user record",
      "Manually delete user data from Firestore/Realtime Database collections",
      "Delete files from Firebase Storage: `bucket.file(path).delete()`",
    ],
    retentionExceptions: [
      "Analytics data is aggregated and cannot be individually deleted",
      "Crashlytics reports retained for 90 days",
    ],
    documentationUrl: "https://firebase.google.com/docs/auth/admin/manage-users#delete_a_user",
  },
  sentry: {
    apiEndpoint: "`DELETE /api/0/projects/{org}/{project}/users/{user_hash}/` — deletes user data from error events",
    adminPanelSteps: [
      "Navigate to Settings > Security & Privacy",
      "Use Data Scrubber settings for automated PII removal",
      "Submit a GDPR deletion request via Settings > Legal",
    ],
    retentionExceptions: [
      "Event data subject to configured retention period (default 90 days)",
      "Aggregated metrics may persist after individual deletion",
    ],
    documentationUrl: "https://docs.sentry.io/product/accounts/data-forwarding/",
  },
  posthog: {
    apiEndpoint: "`DELETE /api/person/:id/` — deletes person and associated events",
    adminPanelSteps: [
      "Navigate to People in PostHog",
      "Find the person by distinct_id or email",
      'Click "Delete person" to remove all associated data',
    ],
    retentionExceptions: [
      "Events may take up to 24 hours to be fully purged from ClickHouse",
    ],
    documentationUrl: "https://posthog.com/docs/privacy/data-deletion",
  },
  mixpanel: {
    apiEndpoint: "`POST /api/app/data-deletions/v3.0/` with `distinct_ids` — GDPR deletion API",
    adminPanelSteps: [
      "Navigate to Settings > Data Management",
      "Use the GDPR Deletion tool to submit deletion requests",
    ],
    retentionExceptions: [
      "Deletion processing takes up to 30 days",
      "Aggregated report data may persist",
    ],
    documentationUrl: "https://developer.mixpanel.com/docs/privacy-security#gdpr-api",
  },
  "google analytics": {
    apiEndpoint: "User Deletion API: `POST /userDeletion/userDeletionRequests:upsert`",
    adminPanelSteps: [
      "Navigate to Admin > Data Deletion Requests",
      "Submit deletion request with User ID or Client ID",
    ],
    retentionExceptions: [
      "Aggregated/anonymised data is not deleted",
      "Processing may take up to 63 days",
    ],
    documentationUrl: "https://developers.google.com/analytics/devguides/config/userdeletion/v3",
  },
  amplitude: {
    apiEndpoint: "`POST /api/2/deletions/users` with `user_ids` array",
    adminPanelSteps: [
      "Navigate to Settings > Privacy Portal",
      "Submit GDPR deletion request with user identifiers",
    ],
    retentionExceptions: [
      "Deletion requests processed within 30 days",
    ],
    documentationUrl: "https://www.docs.developers.amplitude.com/analytics/apis/user-privacy-api/",
  },
  sendgrid: {
    apiEndpoint: "`DELETE /v3/marketing/contacts` with `ids` or `delete_all_contacts`",
    adminPanelSteps: [
      "Navigate to Marketing > Contacts",
      "Search and delete individual contacts",
      "Export contact list before deletion for records",
    ],
    retentionExceptions: [
      "Email activity logs retained for up to 7 days",
      "Suppression lists retained for compliance (bounces, unsubscribes)",
    ],
    documentationUrl: "https://docs.sendgrid.com/api-reference/contacts/delete-contacts",
  },
  resend: {
    apiEndpoint: "Contact support@resend.com for bulk data deletion",
    adminPanelSteps: [
      "Navigate to the Resend Dashboard",
      "Delete individual email logs manually",
    ],
    retentionExceptions: [
      "Email delivery logs retained for 28 days",
    ],
    documentationUrl: "https://resend.com/docs",
  },
  twilio: {
    apiEndpoint: "`DELETE /2010-04-01/Accounts/{AccountSid}/Messages/{Sid}` — deletes message record and body",
    adminPanelSteps: [
      "Navigate to the Twilio Console > Messaging > Logs",
      "Use bulk deletion tools or API for message records",
    ],
    retentionExceptions: [
      "Call metadata may be retained for billing purposes (13 months)",
      "Recordings require separate deletion",
    ],
    documentationUrl: "https://www.twilio.com/docs/usage/api/message-resource#delete-a-message-resource",
  },
  clerk: {
    apiEndpoint: "`DELETE /v1/users/:id` — deletes user and associated sessions",
    adminPanelSteps: [
      "Navigate to Users in the Clerk Dashboard",
      "Select the user and click Delete",
    ],
    retentionExceptions: [
      "Audit logs retained for 90 days",
    ],
    documentationUrl: "https://clerk.com/docs/reference/backend-api/tag/Users#operation/DeleteUser",
  },
  auth0: {
    apiEndpoint: "`DELETE /api/v2/users/:id` — deletes user profile and metadata",
    adminPanelSteps: [
      "Navigate to User Management > Users",
      "Select the user and click Delete",
      "Check logs for associated login history",
    ],
    retentionExceptions: [
      "Log events retained per tenant log retention settings",
    ],
    documentationUrl: "https://auth0.com/docs/manage-users/user-accounts/delete-users",
  },
  datadog: {
    apiEndpoint: "Submit GDPR deletion request via Datadog Support",
    adminPanelSteps: [
      "Contact Datadog Support with the data subject's identifier",
      "Specify log sources containing personal data",
    ],
    retentionExceptions: [
      "Metrics are aggregated and non-attributable after ingestion",
      "Log retention depends on plan (default 15 days)",
    ],
    documentationUrl: "https://docs.datadoghq.com/data_security/logs/",
  },
  hubspot: {
    apiEndpoint: "`DELETE /crm/v3/objects/contacts/:id` — permanently deletes contact",
    adminPanelSteps: [
      "Navigate to Contacts",
      "Select contact > Actions > Delete",
      "Purge from recycling bin within 90 days",
    ],
    retentionExceptions: [
      "Deleted contacts remain in recycling bin for 90 days",
      "Email engagement data may be retained in aggregated reports",
    ],
    documentationUrl: "https://developers.hubspot.com/docs/api/crm/contacts",
  },
  intercom: {
    apiEndpoint: "`DELETE /contacts/:id` — permanently deletes contact and conversations",
    adminPanelSteps: [
      "Navigate to People",
      "Search for the user",
      'Click "Delete" and confirm permanent deletion',
    ],
    retentionExceptions: [
      "Deleted data may persist in backups for up to 30 days",
    ],
    documentationUrl: "https://developers.intercom.com/docs/references/rest-api/api.intercom.io/Contacts/DeleteContact",
  },
};

/**
 * Generates DATA_DELETION_PROCEDURES.md — per-service data deletion instructions
 * for handling GDPR Art. 17 right to erasure requests.
 *
 * Generated when services are detected that process personal data.
 */
export function generateDataDeletionProcedures(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) return null;

  const company = ctx?.companyName || "[Your Company Name]";
  const contactEmail = ctx?.contactEmail || "[your-email@example.com]";
  const dpoName = ctx?.dpoName || "[Data Protection Officer Name]";
  const dpoEmail = ctx?.dpoEmail || contactEmail;
  const date = new Date().toISOString().split("T")[0];

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push("# Data Deletion Procedures");
  lines.push("");
  lines.push(`> **${company}** — GDPR Art. 17 Right to Erasure Implementation Guide`);
  lines.push(">");
  lines.push(`> **Effective Date:** ${date}`);
  lines.push(">");
  lines.push("> Generated by [Codepliant](https://github.com/joechensmartz/codepliant)");
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── 1. Purpose ──────────────────────────────────────────────────────────
  lines.push("## 1. Purpose");
  lines.push("");
  lines.push(
    `This document provides step-by-step data deletion procedures for every third-party service used by ${company}. When a data subject exercises their right to erasure under GDPR Article 17, CCPA/CPRA, or other applicable privacy laws, staff must follow these procedures to ensure complete deletion across all systems.`,
  );
  lines.push("");

  // ── 2. Legal Basis ──────────────────────────────────────────────────────
  lines.push("## 2. Legal Basis");
  lines.push("");
  lines.push("Under GDPR Article 17, data subjects have the right to obtain erasure of their personal data when:");
  lines.push("");
  lines.push("- The data is no longer necessary for its original purpose");
  lines.push("- The data subject withdraws consent (where consent was the lawful basis)");
  lines.push("- The data subject objects to processing and there are no overriding legitimate grounds");
  lines.push("- The data has been unlawfully processed");
  lines.push("- Erasure is required for compliance with a legal obligation");
  lines.push("");
  lines.push("**Response deadline:** 1 month from receipt of request (extendable by 2 months for complex requests).");
  lines.push("");

  // ── 3. Pre-Deletion Checklist ───────────────────────────────────────────
  lines.push("## 3. Pre-Deletion Checklist");
  lines.push("");
  lines.push("Before executing deletion across services:");
  lines.push("");
  lines.push("- [ ] Verify the data subject's identity");
  lines.push("- [ ] Confirm the request is valid (not subject to Art. 17(3) exceptions)");
  lines.push("- [ ] Document the request in the DSAR register");
  lines.push("- [ ] Identify all systems containing the data subject's personal data");
  lines.push("- [ ] Check for legal hold or regulatory retention obligations");
  lines.push("- [ ] Export data if the subject also requested portability (Art. 20)");
  lines.push(`- [ ] Notify the DPO (${dpoEmail}) before proceeding`);
  lines.push("");

  // ── 4. Per-Service Deletion Procedures ──────────────────────────────────
  lines.push("## 4. Per-Service Deletion Procedures");
  lines.push("");

  // Categorize services
  const categories = new Map<string, typeof scan.services>();
  for (const service of scan.services) {
    const cat = service.category;
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(service);
  }

  const categoryLabels: Record<string, string> = {
    ai: "AI Services",
    analytics: "Analytics & Tracking",
    auth: "Authentication & Identity",
    payment: "Payment Processing",
    monitoring: "Monitoring & Error Tracking",
    email: "Email & Communication",
    storage: "Storage & Database",
    cms: "Content Management",
    hosting: "Infrastructure & Hosting",
    advertising: "Advertising",
    crm: "CRM & Customer Support",
    other: "Other Services",
  };

  let sectionNum = 1;
  for (const [category, services] of categories) {
    const label = categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1);
    lines.push(`### 4.${sectionNum}. ${label}`);
    lines.push("");

    for (const service of services) {
      const serviceLower = service.name.toLowerCase();
      const info = SERVICE_DELETION_INFO[serviceLower];

      lines.push(`#### ${service.name}`);
      lines.push("");
      lines.push(`**Data collected:** ${service.dataCollected.join(", ")}`);
      lines.push("");

      if (info) {
        // Known service with detailed deletion info
        if (info.apiEndpoint) {
          lines.push("**API Deletion:**");
          lines.push("");
          lines.push(`${info.apiEndpoint}`);
          lines.push("");
        }

        if (info.adminPanelSteps && info.adminPanelSteps.length > 0) {
          lines.push("**Admin Panel Steps:**");
          lines.push("");
          for (let i = 0; i < info.adminPanelSteps.length; i++) {
            lines.push(`${i + 1}. ${info.adminPanelSteps[i]}`);
          }
          lines.push("");
        }

        if (info.retentionExceptions && info.retentionExceptions.length > 0) {
          lines.push("**Retention Exceptions:**");
          lines.push("");
          for (const exception of info.retentionExceptions) {
            lines.push(`- ⚠ ${exception}`);
          }
          lines.push("");
        }

        if (info.documentationUrl) {
          lines.push(`**Documentation:** ${info.documentationUrl}`);
          lines.push("");
        }
      } else {
        // Unknown service — provide generic deletion guidance
        lines.push("**Deletion Steps:**");
        lines.push("");
        lines.push(`1. Log in to the ${service.name} admin dashboard`);
        lines.push("2. Locate the user/data record using the data subject's identifier");
        lines.push("3. Delete all personal data associated with the identifier");
        lines.push("4. Verify deletion by searching for the identifier again");
        lines.push(`5. Check the ${service.name} documentation for API-based deletion options`);
        lines.push("");
        lines.push("**Retention Exceptions:**");
        lines.push("");
        lines.push(`- Check ${service.name}'s DPA for mandatory retention periods`);
        lines.push(`- Review ${service.name}'s privacy policy for data retention disclosures`);
        lines.push("");
      }
    }
    sectionNum++;
  }

  // ── 5. Internal Database Deletion ───────────────────────────────────────
  lines.push("## 5. Internal Database Deletion");
  lines.push("");
  lines.push("In addition to third-party services, delete the data subject's records from internal databases:");
  lines.push("");
  lines.push("```sql");
  lines.push("-- Example deletion queries (adapt to your schema)");
  lines.push("BEGIN TRANSACTION;");
  lines.push("");
  lines.push("-- Delete user profile");
  lines.push("DELETE FROM users WHERE email = :subject_email;");
  lines.push("");
  lines.push("-- Delete associated records");
  lines.push("DELETE FROM user_sessions WHERE user_id = :subject_id;");
  lines.push("DELETE FROM user_preferences WHERE user_id = :subject_id;");
  lines.push("DELETE FROM audit_logs WHERE user_id = :subject_id");
  lines.push("  AND retention_required = false;");
  lines.push("");
  lines.push("-- Anonymise records that must be retained");
  lines.push("UPDATE orders SET customer_email = 'deleted@anonymised.local',");
  lines.push("  customer_name = 'DELETED'");
  lines.push("  WHERE customer_id = :subject_id;");
  lines.push("");
  lines.push("COMMIT;");
  lines.push("```");
  lines.push("");

  // ── 6. Verification & Documentation ─────────────────────────────────────
  lines.push("## 6. Verification & Documentation");
  lines.push("");
  lines.push("After executing deletion across all systems:");
  lines.push("");
  lines.push("| Step | Action | Completed |");
  lines.push("|------|--------|-----------|");
  lines.push("| 1 | Search for data subject in all services listed above | [ ] |");
  lines.push("| 2 | Confirm zero results across all systems | [ ] |");
  lines.push("| 3 | Document retention exceptions with legal justification | [ ] |");
  lines.push("| 4 | Update the DSAR register with completion date | [ ] |");
  lines.push("| 5 | Send confirmation to the data subject | [ ] |");
  lines.push(`| 6 | Notify the DPO (${dpoEmail}) | [ ] |`);
  lines.push("");

  // ── 7. Art. 17(3) Exceptions ────────────────────────────────────────────
  lines.push("## 7. Exceptions to Erasure (Art. 17(3))");
  lines.push("");
  lines.push("The right to erasure does **not** apply when processing is necessary for:");
  lines.push("");
  lines.push("| Exception | Example | Typical Retention |");
  lines.push("|-----------|---------|-------------------|");
  lines.push("| Freedom of expression and information | Published user reviews | Case-by-case |");
  lines.push("| Legal obligation compliance | Tax records, financial regulations | 7-10 years |");
  lines.push("| Public health reasons (Art. 9(2)(h)(i)) | Health data for public interest | Duration of need |");
  lines.push("| Archiving in public interest | Research data, statistical purposes | Duration of study |");
  lines.push("| Legal claims | Litigation hold, dispute evidence | Until resolution + limitation |");
  lines.push("");
  lines.push("When an exception applies, document the specific legal basis and notify the data subject of the partial refusal with reasoning.");
  lines.push("");

  // ── 8. Backup & Replication Handling ────────────────────────────────────
  lines.push("## 8. Backup & Replication Handling");
  lines.push("");
  lines.push("Personal data may exist in backups and replicas:");
  lines.push("");
  lines.push("- **Database backups:** Data will be overwritten as backup rotation cycles complete (typically 7-30 days)");
  lines.push("- **Log aggregation:** Ensure log retention policies align with deletion obligations");
  lines.push("- **CDN caches:** Purge cached content containing personal data");
  lines.push("- **Search indices:** Trigger re-indexing to remove deleted records");
  lines.push("- **Data warehouses:** Run deletion jobs against analytical data stores");
  lines.push("");
  lines.push("Document the expected timeline for complete data purge from all backup systems in the DSAR response.");
  lines.push("");

  // ── 9. Escalation ──────────────────────────────────────────────────────
  lines.push("## 9. Escalation");
  lines.push("");
  lines.push("| Scenario | Escalate To | Timeline |");
  lines.push("|----------|-------------|----------|");
  lines.push(`| Unable to delete from a service | ${dpoName} (${dpoEmail}) | Within 48 hours |`);
  lines.push(`| Retention exception applies | ${dpoName} (${dpoEmail}) | Before responding |`);
  lines.push("| Request involves special category data | DPO + Legal Counsel | Immediately |");
  lines.push("| Third-party service unresponsive | DPO + Vendor Management | Within 72 hours |");
  lines.push(`| Deadline at risk (>25 days elapsed) | ${dpoName} (${dpoEmail}) | Immediately |`);
  lines.push("");

  // ── Footer ─────────────────────────────────────────────────────────────
  lines.push("---");
  lines.push("");
  lines.push(
    "*This document was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. " +
    "Adapt the deletion procedures to your actual database schema and service configurations. Review with your DPO and legal counsel before use.*",
  );
  lines.push("");

  return lines.join("\n");
}
