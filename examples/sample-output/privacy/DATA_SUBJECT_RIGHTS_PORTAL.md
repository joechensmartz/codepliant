# Data Subject Rights Portal — Specification

> **Self-service privacy portal for Acme Inc**
> Enables data subjects to exercise their privacy rights under GDPR, CCPA, and other regulations.
> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18

*Generated on 2026-03-18 | 8 services detected | 21 data categories*

---

## 1. Overview

This document specifies a self-service Data Subject Rights Portal that allows users to:

1. **View their data** — See all personal data collected and processed
2. **Download their data** — Export a machine-readable copy (GDPR Art. 20)
3. **Delete their account** — Request complete erasure (GDPR Art. 17)
4. **Manage consent** — Granularly control data processing preferences

The portal satisfies:
- **GDPR** Articles 12-23 (Data Subject Rights)
- **Best practice** for transparent data handling

---

## 2. Portal Features

### 2.1 My Data Dashboard

Users see a summary of all personal data held by Acme Inc:

| Data Category | Source | Retention | Actions |
|---------------|--------|-----------|---------|
| error data, stack traces, user context | @sentry/node | Per retention policy | View, Export, Delete |
| email, password hash, session data | @supabase/supabase-js | Per retention policy | View, Export, Delete |
| user prompts, conversation history, generated content | openai | Per retention policy | View, Export, Delete |
| user behavior, session recordings, feature flag usage | posthog | Per retention policy | View, Export, Delete |
| user data as defined in schema | prisma | Per retention policy | View, Export, Delete |
| email addresses, email content | resend | Per retention policy | View, Export, Delete |
| payment information, billing address, email | stripe | Per retention policy | View, Export, Delete |
| payment information, billing address, email | stripe-ios | Per retention policy | View, Export, Delete |

### 2.2 View Data

The "View My Data" page displays:

- **Profile information** — Name, email, account details
- **Activity history** — Login history, actions taken
- **Third-party data** — Data shared with sub-processors
- **Analytics data** — Browsing behavior, page views, session duration
- **AI interaction data** — Prompts, responses, usage patterns
- **Payment data** — Transaction history (card details are masked)

Each data item shows:
- When it was collected
- Why it was collected (lawful basis)
- Who has access to it
- When it will be deleted

### 2.3 Download Data (Data Portability)

**GDPR Art. 20** requires data to be provided in a structured, commonly used, machine-readable format.

**Export formats available:**

| Format | Use Case | Contents |
|--------|----------|----------|
| JSON | Developer / migration | Complete structured data |
| CSV | Spreadsheet analysis | Tabular data per category |
| PDF | Human-readable archive | Formatted summary report |

**Export process:**
1. User clicks "Download My Data"
2. System queues an export job (may take up to 48 hours for large datasets)
3. User receives email notification when export is ready
4. Download link expires after 7 days
5. Export is encrypted with a one-time password sent separately

### 2.4 Delete Account (Right to Erasure)

**GDPR Art. 17** grants the right to erasure ("right to be forgotten").

**Deletion workflow:**

```
User requests deletion
        │
        ▼
  ┌─────────────┐
  │ Confirm via  │
  │ email / 2FA  │
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐     ┌──────────────────┐
  │  14-day      │────▶│ User can cancel   │
  │  grace period│     │ during this time  │
  └──────┬──────┘     └──────────────────┘
         │
         ▼
  ┌─────────────┐
  │ Soft delete  │  Account deactivated, data marked for deletion
  └──────┬──────┘
         │
         ▼ (30 days)
  ┌─────────────┐
  │ Hard delete  │  Data permanently erased from all systems
  └──────┬──────┘
         │
         ▼
  ┌─────────────────────────────────────────┐
  │ Notify sub-processors to delete as well │
  └─────────────────────────────────────────┘
```

**Exceptions to deletion** (data that must be retained):
- Legal obligations (tax records, invoices)
- Fraud prevention data
- Legitimate interest overrides (documented and justified)
- Payment transaction records (required by financial regulations)

### 2.5 Manage Consent

Users can granularly control consent for each processing purpose:

| Processing Purpose | Default | User Control | Legal Basis |
|--------------------|---------|--------------|-------------|
| Essential service operation | On (locked) | Cannot disable | Contract |
| Analytics & performance | Off | Toggle | Consent |
| Marketing & advertising | Off | Toggle | Consent |
| AI model training | Off | Toggle | Consent |
| AI-powered features | On | Toggle | Legitimate interest |
| Email communications | Off | Toggle | Consent |
| Third-party data sharing | Off | Toggle | Consent |

**Consent changes take effect:**
- Immediately for new data collection
- Within 24 hours for ongoing processing
- Sub-processors notified within 48 hours

---

## 3. API Endpoints Specification

Base URL: `https://acme-saas.com/api/v1/privacy`

### 3.1 Authentication

All endpoints require authentication via Bearer token or session cookie.

```
Authorization: Bearer <user_access_token>
```

### 3.2 View Data

```http
GET /api/v1/privacy/my-data
```

**Response:**
```json
{
  "subject_id": "usr_123",
  "data_categories": [
    {
      "category": "profile",
      "items": [
        { "field": "email", "value": "user@example.com", "collected_at": "2025-01-15", "source": "registration", "lawful_basis": "contract" }
      ]
    },
    {
      "category": "activity",
      "items": [
        { "field": "last_login", "value": "2025-06-01T10:30:00Z", "collected_at": "2025-06-01", "source": "system", "lawful_basis": "legitimate_interest" }
      ]
    }
  ],
  "third_party_sharing": [
    { "processor": "@sentry/node", "data_shared": ["error data","stack traces"], "purpose": "service_operation" },
    { "processor": "@supabase/supabase-js", "data_shared": ["email","password hash"], "purpose": "service_operation" },
    { "processor": "openai", "data_shared": ["user prompts","conversation history"], "purpose": "service_operation" }
  ]
}
```

### 3.3 Download Data (Export)

```http
POST /api/v1/privacy/export
Content-Type: application/json

{
  "format": "json",        // "json" | "csv" | "pdf"
  "categories": ["all"],   // or specific: ["profile", "activity", "payments"]
  "date_range": {
    "from": "2024-01-01",
    "to": "2025-12-31"
  }
}
```

**Response:**
```json
{
  "export_id": "exp_abc123",
  "status": "queued",
  "estimated_completion": "2025-06-01T12:00:00Z",
  "notification_email": "user@example.com"
}
```

```http
GET /api/v1/privacy/export/:export_id
```

**Response (when ready):**
```json
{
  "export_id": "exp_abc123",
  "status": "ready",
  "download_url": "/api/v1/privacy/export/exp_abc123/download",
  "expires_at": "2025-06-08T12:00:00Z",
  "size_bytes": 245760,
  "checksum": "sha256:abc123..."
}
```

### 3.4 Delete Account

```http
POST /api/v1/privacy/delete-account
Content-Type: application/json

{
  "confirmation": "DELETE_MY_ACCOUNT",
  "reason": "no_longer_needed",       // optional
  "feedback": "Switching to another service"  // optional
}
```

**Response:**
```json
{
  "deletion_id": "del_xyz789",
  "status": "pending_confirmation",
  "confirmation_email_sent": true,
  "grace_period_ends": "2025-06-15T00:00:00Z",
  "hard_delete_date": "2025-07-15T00:00:00Z"
}
```

```http
POST /api/v1/privacy/delete-account/:deletion_id/confirm
```

```http
POST /api/v1/privacy/delete-account/:deletion_id/cancel
```

### 3.5 Manage Consent

```http
GET /api/v1/privacy/consent
```

**Response:**
```json
{
  "subject_id": "usr_123",
  "consents": [
    { "purpose": "essential", "granted": true, "locked": true, "updated_at": "2025-01-01" },
    { "purpose": "analytics", "granted": false, "locked": false, "updated_at": "2025-03-15" },
    { "purpose": "marketing", "granted": false, "locked": false, "updated_at": "2025-03-15" },
    { "purpose": "ai_features", "granted": true, "locked": false, "updated_at": "2025-02-01" },
    { "purpose": "third_party_sharing", "granted": false, "locked": false, "updated_at": "2025-01-01" }
  ]
}
```

```http
PATCH /api/v1/privacy/consent
Content-Type: application/json

{
  "consents": [
    { "purpose": "analytics", "granted": true },
    { "purpose": "marketing", "granted": false }
  ]
}
```

**Response:**
```json
{
  "updated": 2,
  "effective_immediately": ["analytics"],
  "effective_within_24h": ["marketing"],
  "consent_record_id": "cr_def456"
}
```

### 3.6 Request History

```http
GET /api/v1/privacy/requests
```

**Response:**
```json
{
  "requests": [
    { "id": "req_001", "type": "export", "status": "completed", "created_at": "2025-05-01", "completed_at": "2025-05-01" },
    { "id": "req_002", "type": "consent_change", "status": "completed", "created_at": "2025-05-15", "completed_at": "2025-05-15" }
  ]
}
```

---

## 4. UI Wireframe Description

### 4.1 Portal Layout

```
┌─────────────────────────────────────────────────────────┐
│  Acme Inc — Privacy Center                            │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│  📋 My Data │   [Active Tab Content Area]               │
│             │                                           │
│  📥 Export  │   Shows data tables, export options,      │
│             │   consent toggles, or deletion flow       │
│  🗑️ Delete  │   depending on selected tab.              │
│             │                                           │
│  ⚙️ Consent │                                           │
│             │                                           │
│  📜 History │                                           │
│             │                                           │
│  ❓ Help    │                                           │
│             │                                           │
├─────────────┴───────────────────────────────────────────┤
│  Contact DPO: dpo@acme-saas.com                               │
└─────────────────────────────────────────────────────────┘
```

### 4.2 My Data Tab

```
┌─────────────────────────────────────────────────────────┐
│  My Data                                     [Refresh]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Profile Information                          [Expand]  │
│  ├─ Email: u***@example.com                             │
│  ├─ Name: J*** D***                                     │
│  └─ Account created: 2025-01-15                         │
│                                                         │
│  Activity Data                                [Expand]  │
│  ├─ Last login: 2 hours ago                             │
│  ├─ Total sessions: 142                                 │
│  └─ Data points: 1,247                                  │
│                                                         │
│  Third-Party Services (8 connected)       │
│  ├─ @sentry/node: error data, stack traces
│  ├─ @supabase/supabase-js: email, password hash
│  ├─ openai: user prompts, conversation history
│  ├─ posthog: user behavior, session recordings
│  ├─ prisma: user data as defined in schema
│  └─ ... and 3 more
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Export Tab

```
┌─────────────────────────────────────────────────────────┐
│  Export My Data                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Format:    (●) JSON    ( ) CSV    ( ) PDF              │
│                                                         │
│  Categories:                                            │
│  [✓] All data                                           │
│  [✓] Profile information                                │
│  [✓] Activity history                                   │
│  [✓] Third-party sharing records                        │
│  [ ] Only data from last 12 months                      │
│                                                         │
│  Date range: [2024-01-01] to [2025-12-31]               │
│                                                         │
│  ┌─────────────────────────────────────────┐            │
│  │  ⚠️ Export may take up to 48 hours.     │            │
│  │  You'll receive an email when ready.    │            │
│  └─────────────────────────────────────────┘            │
│                                                         │
│                        [Request Export]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.4 Delete Account Tab

```
┌─────────────────────────────────────────────────────────┐
│  Delete My Account                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────┐            │
│  │  ⚠️ This action is irreversible after   │            │
│  │  the 14-day grace period.               │            │
│  └─────────────────────────────────────────┘            │
│                                                         │
│  What happens when you delete your account:             │
│                                                         │
│  • 14-day grace period (you can cancel)                 │
│  • All personal data queued for deletion                │
│  • Sub-processors notified to delete your data          │
│  • Some data retained for legal obligations             │
│                                                         │
│  Reason (optional):                                     │
│  [No longer using the service          ▾]               │
│                                                         │
│  Type "DELETE" to confirm: [____________]               │
│                                                         │
│                [Cancel]   [Delete My Account]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.5 Consent Management Tab

```
┌─────────────────────────────────────────────────────────┐
│  Manage Consent Preferences                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Essential Services              [ON]  (required)       │
│  Core functionality, authentication, security           │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Analytics & Performance         [OFF] (toggle)         │
│  Usage statistics, performance monitoring               │
│                                                         │
│  Marketing Communications        [OFF] (toggle)         │
│  Promotional emails, newsletters                        │
│                                                         │
│  Third-Party Data Sharing        [OFF] (toggle)         │
│  Sharing data with partner services                     │
│                                                         │
│  AI-Powered Features             [ON]  (toggle)         │
│  AI recommendations, content generation                 │
│                                                         │
│  AI Model Training               [OFF] (toggle)         │
│  Using your data to improve AI models                   │
│                                                         │
│                                                         │
│  Last updated: 2026-03-18                                  │
│                                                         │
│                        [Save Preferences]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Implementation Checklist

### Phase 1: Core Portal (Week 1-2)

- [ ] Set up authentication for privacy portal
- [ ] Implement `GET /api/v1/privacy/my-data` endpoint
- [ ] Build "My Data" dashboard UI
- [ ] Add data aggregation from all 8 connected services
- [ ] Implement rate limiting (max 10 requests/minute per user)

### Phase 2: Data Export (Week 3)

- [ ] Implement export queue system
- [ ] Add JSON export format
- [ ] Add CSV export format
- [ ] Add PDF export format
- [ ] Implement encrypted download links
- [ ] Add email notifications for export completion
- [ ] Set 7-day expiry on download links

### Phase 3: Account Deletion (Week 4)

- [ ] Implement deletion request flow
- [ ] Add email confirmation step
- [ ] Build 14-day grace period with cancellation
- [ ] Implement soft delete (deactivation)
- [ ] Implement hard delete (30 days after soft delete)
- [ ] Add sub-processor deletion notifications
- [ ] Document exceptions to deletion (legal holds)

### Phase 4: Consent Management (Week 5)

- [ ] Build consent preference storage
- [ ] Implement granular consent toggles
- [ ] Add consent change propagation to sub-processors
- [ ] Implement consent audit log
- [ ] Add consent receipt generation (GDPR Art. 7)

### Phase 5: Audit & Compliance (Week 6)

- [ ] Add comprehensive audit logging for all portal actions
- [ ] Implement request history tracking
- [ ] Build admin dashboard for DPO oversight
- [ ] Load test all endpoints
- [ ] Security audit (pen test portal endpoints)
- [ ] Document SLA for request fulfillment (GDPR: 30 days max)

---

## 6. Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | Multi-factor required for destructive actions |
| Encryption | TLS 1.3 in transit, AES-256 at rest |
| Rate limiting | 10 req/min per user, 100 req/hour |
| Audit logging | All actions logged with IP, timestamp, user agent |
| Data masking | PII partially masked in "View" mode by default |
| Export encryption | One-time password sent via separate channel |
| Session management | Auto-logout after 15 min inactivity on portal |

---

## 7. Compliance Mapping

| Right | GDPR Article | CCPA Section | Portal Feature |
|-------|-------------|-------------|----------------|
| Right to Access | Art. 15 | §1798.100 | My Data tab |
| Right to Portability | Art. 20 | §1798.100 | Export tab (JSON/CSV) |
| Right to Erasure | Art. 17 | §1798.105 | Delete Account tab |
| Right to Rectification | Art. 16 | — | My Data > Edit |
| Right to Restrict Processing | Art. 18 | — | Consent toggles |
| Right to Object | Art. 21 | §1798.120 | Consent toggles |
| Right to Withdraw Consent | Art. 7(3) | — | Consent toggles |
| Right to Non-Discrimination | — | §1798.125 | Service remains same |

---

## 8. Response Time SLAs

| Request Type | GDPR Deadline | Target SLA | Escalation |
|--------------|---------------|------------|------------|
| View data | 30 days | < 24 hours | Auto |
| Export data | 30 days | < 48 hours | DPO at day 20 |
| Delete account | 30 days | 14 days + 30 days | DPO at day 20 |
| Consent change | Immediate | < 24 hours | Auto |
| Rectification | 30 days | < 48 hours | DPO at day 20 |

---

*This specification was auto-generated by Codepliant based on 8 detected services in your codebase. Implement this portal to give your users full control over their personal data.*

*Contact: legal@acme.com | DPO: dpo@acme-saas.com*

---

> **Disclaimer:** This specification is a starting point. Have your legal and engineering teams review before implementation. Codepliant generates specifications based on code analysis — legal review is always recommended.
