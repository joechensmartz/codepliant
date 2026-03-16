# Data Protection Officer Handbook

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]
**DPO:** [Data Protection Officer Name] ([dpo@example.com])
**Last updated:** 2026-03-16

This handbook outlines the responsibilities, reporting structure, and operational procedures for the Data Protection Officer (DPO) at **[Your Company Name]**, in accordance with GDPR Articles 37-39.

## 1. Role and Appointment (GDPR Art. 37)

### 1.1 When a DPO Is Required

A DPO must be designated when:

- The processing is carried out by a public authority or body
- Core activities require regular and systematic monitoring of data subjects at scale
- Core activities involve large-scale processing of special categories of data

**Assessment for [Your Company Name]:** A DPO is likely **mandatory** based on:

- 32 third-party data processors detected (systematic processing at scale)
- AI services detected (automated decision-making / profiling)

### 1.2 Appointment Requirements

The DPO must:

- Be appointed based on **professional qualities**, in particular expert knowledge of data protection law and practices
- Be either a staff member or engaged under a service contract
- Be provided with resources necessary to carry out their tasks
- Be given access to personal data and processing operations
- Not be dismissed or penalized for performing their DPO tasks

## 2. Position and Independence (GDPR Art. 38)

### 2.1 Reporting Structure

```
┌─────────────────────┐
│   Board / CEO       │
│   (Direct report)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│   DPO               │
│   [Data Protection  │
└─────────┬───────────┘
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
  Legal  IT  Business
  Team   Team  Units
```

### 2.2 Independence Requirements

- The DPO **reports directly** to the highest level of management
- The DPO shall **not receive instructions** regarding the exercise of their tasks
- The DPO shall **not be dismissed or penalized** for performing their duties
- The DPO may fulfill other tasks, provided they do not result in a **conflict of interest**

### 2.3 Conflict of Interest

The DPO must **not** simultaneously hold any of these roles:

| Role | Why It Conflicts |
| ---- | ---------------- |
| CEO / Managing Director | Determines purposes of processing |
| CFO | Determines financial data processing |
| Head of Marketing | Decides on marketing data usage |
| Head of HR | Decides on employee data processing |
| Head of IT | Implements technical processing decisions |

## 3. Tasks and Responsibilities (GDPR Art. 39)

### 3.1 Core Tasks

| Task | Description | Frequency |
| ---- | ----------- | --------- |
| **Inform and advise** | Advise the organization and employees on data protection obligations | Ongoing |
| **Monitor compliance** | Oversee compliance with GDPR and internal policies | Continuous |
| **Training** | Organize staff awareness and training programs | Quarterly |
| **DPIA oversight** | Advise on Data Protection Impact Assessments | Per project |
| **Supervisory authority** | Act as contact point for the supervisory authority | As needed |
| **Data subject requests** | Oversee DSAR handling process | As received |
| **Breach management** | Coordinate breach notification procedures | As needed |
| **Records maintenance** | Maintain records of processing activities (Art. 30) | Quarterly review |

### 3.2 Operational Checklist

#### Daily

- [ ] Review incoming DSAR requests
- [ ] Monitor security incident alerts for potential data breaches
- [ ] Check DPO email inbox for data subject inquiries

#### Weekly

- [ ] Review new vendor/service integrations for data protection implications
- [ ] Check DSAR response deadlines (30-day timer)
- [ ] Review any pending consent changes or policy updates

#### Monthly

- [ ] Update Record of Processing Activities if changes occurred
- [ ] Review sub-processor list for additions or changes
- [ ] Assess any new processing activities for DPIA necessity
- [ ] Report compliance status to management

#### Quarterly

- [ ] Conduct staff data protection awareness training
- [ ] Review and update privacy policies and notices
- [ ] Audit consent management mechanisms
- [ ] Review data retention and deletion practices
- [ ] Update risk register and mitigation measures

#### Annually

- [ ] Comprehensive compliance audit
- [ ] Review and update DPIAs for existing high-risk processing
- [ ] Update transfer impact assessments
- [ ] Submit annual report to board/management
- [ ] Review and renew DPA agreements with processors

## 4. Escalation Procedures

### 4.1 Escalation Matrix

| Situation | Escalation Level | Timeline | Action |
| --------- | ---------------- | -------- | ------ |
| Routine DSAR | DPO handles directly | 30 days max | Process and respond |
| Complex DSAR (multiple systems) | DPO + IT Lead | 30 days max | Coordinate data retrieval |
| Minor data incident (no breach) | DPO + IT Security | 24 hours assessment | Investigate and document |
| Confirmed data breach | DPO + CEO + Legal | 72 hours to authority | Notify authority, assess user notification |
| Regulatory inquiry | DPO + Legal Counsel | Immediate | Cooperate and respond |
| DPO advice rejected by management | DPO documents in writing | Record immediately | Formal written objection |

### 4.2 Data Breach Escalation

```
Incident Detected
       │
       ▼
┌──────────────────┐    No    ┌──────────────┐
│ Personal data    │────────▶│ IT Security  │
│ involved?        │         │ handles      │
└────────┬─────────┘         └──────────────┘
    Yes  │
         ▼
┌──────────────────┐
│ DPO notified     │
│ (within 1 hour)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐    Low   ┌──────────────┐
│ Risk to rights   │────────▶│ Document     │
│ and freedoms?    │         │ internally   │
└────────┬─────────┘         └──────────────┘
   High  │
         ▼
┌──────────────────┐
│ Notify authority │
│ within 72 hours  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Notify affected  │
│ individuals      │
└──────────────────┘
```

## 5. DSAR Handling Process

### 5.1 Response Timeline

| Step | Deadline | Responsible |
| ---- | -------- | ----------- |
| Request received | Day 0 | DPO |
| Identity verification | Day 1-3 | DPO |
| Scope assessment | Day 3-5 | DPO |
| Data collection from systems | Day 5-20 | DPO + IT |
| Review and redaction | Day 20-25 | DPO + Legal |
| Response to data subject | Day 25-30 (max) | DPO |

### 5.2 Systems to Query (32 detected)

- **@amplitude/analytics-browser** (analytics): user behavior, device information, session data
- **@aws-sdk/client-s3** (storage): uploaded files, file metadata
- **@twilio/voice-sdk** (other): phone numbers, voice call metadata, call recordings
- **ActionCable** (other): real-time user data, connection metadata, channel subscriptions
- **ActionController::Cookies** (other): session cookies, session data, CSRF tokens
- **ActionMailer** (email): email addresses, email content
- **Active Storage** (storage): uploaded files, file metadata, storage service credentials
- **ActiveRecord** (database): user data as defined in schema, timestamps, associations
- **ActiveStorage** (storage): uploaded files, file metadata, storage references
- **aws-sdk-s3** (storage): uploaded files, file metadata
- **devise** (auth): email, password hash, session data
- **google-cloud-storage** (storage): uploaded files, file metadata
- **ioredis** (database): cached data, session data
- **MailHog** (email): email content
- **Meta Pixel** (advertising): page views, conversion events, user behavior
- **nodemailer** (email): email addresses, email content
- **omniauth** (auth): email, name, OAuth tokens
- **pg** (database): user data as defined in schema
- **PostgreSQL (env)** (database): application data, user records
- **pundit** (auth): user roles, authorization policies, access control data
- **rack-attack** (other): IP addresses, request metadata
- **rails-actionmailer** (email): email addresses, email content
- **rails-activerecord** (database): user data as defined in schema
- **rails-sessions** (auth): session cookies, CSRF tokens
- **redis** (database): cached data, session data
- **Redis** (database): session data, cache data
- **Redis (env)** (database): session data, cache data
- **ruby-openai** (ai): user prompts, conversation history, generated content
- **sentry-ruby** (monitoring): error data, stack traces, user context
- **sidekiq** (other): job data, user data processed in background jobs
- **stripe** (payment): payment information, billing address, email
- **twilio-ruby** (other): phone numbers, SMS message content, voice call metadata

## 6. AI-Specific DPO Responsibilities

AI services have been detected in this project. The DPO has additional responsibilities under the EU AI Act and GDPR:

- **Automated decision-making (Art. 22):** Ensure data subjects are informed and can request human review
- **DPIA for AI:** Conduct or advise on DPIAs for AI processing that is likely high-risk
- **AI transparency:** Verify AI disclosure documents are accurate and up-to-date
- **Training data governance:** Oversee data used for AI training, ensure lawful basis
- **Bias monitoring:** Review AI outputs for discriminatory patterns or bias
- **Vendor AI agreements:** Review AI provider DPAs for adequate safeguards

## 7. Payment Data Responsibilities

Payment services have been detected. Additional DPO responsibilities include:

- **PCI DSS coordination:** Ensure payment data handling meets PCI DSS requirements
- **Financial data retention:** Verify retention periods comply with tax and accounting laws (typically 7 years)
- **Payment processor oversight:** Review DPAs with payment processors (Stripe, PayPal, etc.)
- **Cardholder data scope:** Minimize the scope of cardholder data your systems touch

## 8. Key Contacts and Resources

### Internal Contacts

| Role | Name | Email |
| ---- | ---- | ----- |
| Data Protection Officer | [Data Protection Officer Name] | [dpo@example.com] |
| General Contact | [Name] | [your-email@example.com] |
| Legal Counsel | [Name] | [email] |
| IT Security Lead | [Name] | [email] |
| HR Lead | [Name] | [email] |

### Supervisory Authorities

| Authority | Jurisdiction | Website |
| --------- | ------------ | ------- |
| [Your lead authority] | [Country] | [URL] |
| ICO | United Kingdom | https://ico.org.uk |
| CNIL | France | https://www.cnil.fr |
| BfDI | Germany | https://www.bfdi.bund.de |
| DPC | Ireland | https://www.dataprotection.ie |

### Key Regulations

- **GDPR** — General Data Protection Regulation (EU) 2016/679
- **ePrivacy Directive** — Directive 2002/58/EC (cookies, electronic communications)
- **EU AI Act** — Regulation (EU) 2024/1689
- **PCI DSS** — Payment Card Industry Data Security Standard

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- DSAR Handling Guide (`DSAR_HANDLING_GUIDE.md`)
- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- Data Protection Policy (`DATA_PROTECTION_POLICY.md`)
- Annual Review Checklist (`ANNUAL_REVIEW_CHECKLIST.md`)

---

*This DPO Handbook was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **@chatwoot/chatwoot** codebase. It should be reviewed and customized by your legal team and appointed DPO before adoption.*
