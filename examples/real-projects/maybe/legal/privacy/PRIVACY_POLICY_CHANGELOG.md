# Privacy Policy Changelog

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Organization:** [Your Company Name]
**Website:** [https://your-website.com]
**Last updated:** 2026-03-16
**Maintained by:** [Data Protection Officer Name] ([dpo@example.com])

---

This document tracks all changes to our Privacy Policy. We maintain this changelog to comply with GDPR transparency obligations (Art. 12-14) and CCPA/CPRA requirements. Users are notified of material changes as described in Section 3.

> **GDPR Requirement:** Data subjects must be informed of any changes to how their personal data is processed. Material changes require active notification.

## 1. Version History

| Version | Date | Change Type | Summary | Material? | Notification Sent |
|---------|------|-------------|---------|-----------|-------------------|
| 1.0 | 2026-03-16 | Initial release | Initial privacy policy generated from code scan | Yes | N/A (initial publication) |
| [1.1] | [DATE] | [TYPE] | [SUMMARY] | [YES/NO] | [YES/NO — DATE] |
| [1.2] | [DATE] | [TYPE] | [SUMMARY] | [YES/NO] | [YES/NO — DATE] |

## 2. Change Type Definitions

| Change Type | Description | Material? | Notification Required? |
|-------------|-------------|-----------|----------------------|
| **New data collection** | Adding new categories of personal data | Yes | Yes — email + banner |
| **New third-party service** | Adding a new data processor/sub-processor | Yes | Yes — email + banner |
| **New purpose** | Processing data for a new purpose | Yes | Yes — email + banner |
| **Jurisdiction change** | Expanding to new geographic regions | Yes | Yes — email + banner |
| **Retention change** | Modifying data retention periods | Yes | Yes — email + banner |
| **Rights change** | Modifying data subject rights processes | Yes | Yes — email + banner |
| **Legal basis change** | Changing lawful basis for processing | Yes | Yes — email + consent re-collection |
| **Service removal** | Removing a third-party service | No | No (may notify for transparency) |
| **Clarification** | Rewording for clarity, no substantive change | No | No |
| **Formatting** | Layout, typo fixes, link updates | No | No |
| **Contact update** | Updated DPO/contact information | No | No (update in policy) |

## 3. Notification Procedures

### 3.1 Material Changes

When a material change is made to the Privacy Policy:

1. **Pre-publication review:** Legal Counsel and DPO review the changes
2. **Effective date:** Set the effective date at least 30 days in the future
3. **Email notification:** Send notification email to all registered users
4. **In-app banner:** Display a prominent banner linking to the updated policy
5. **Changelog update:** Add entry to Section 1 of this document
6. **Consent re-collection:** If legal basis changed, collect fresh consent before the effective date
7. **Archive:** Store the previous version in the policy archive (Section 5)

### 3.2 Non-Material Changes

1. Update the Privacy Policy with the new effective date
2. Add entry to Section 1 of this document
3. No user notification required

## 4. Current Privacy Policy Baseline

As of 2026-03-16, the privacy policy covers the following (auto-detected from codebase scan):

### 4.1 Third-Party Services

- ActionCable
- ActionController::Cookies
- ActionMailer
- Active Storage
- ActiveRecord
- ActiveStorage
- aws-sdk-s3
- intercom-ruby
- nodemailer
- pg
- plaid
- rack-attack
- rails-actionmailer
- rails-activerecord
- rails-sessions
- redis
- ruby-openai
- sentry-ruby
- sidekiq
- stripe

### 4.2 Data Categories Collected

- CSRF tokens
- IP addresses
- WebSocket messages
- account balances
- associations
- bank account data
- billing address
- cached data
- channel subscriptions
- connection metadata
- conversation history
- conversations
- device information
- email
- email addresses
- email content
- error data
- file metadata
- financial institution data
- generated content
- job data
- name
- payment information
- potential PII in uploaded content
- real-time user data
- request metadata
- session cookies
- session data
- stack traces
- storage references
- storage service credentials
- timestamps
- transaction history
- uploaded files
- user behavior
- user context
- user data as defined in schema
- user data processed in background jobs
- user profiles
- user prompts

### 4.3 Processing Features

- AI/ML processing
- Payment processing
- Authentication and user accounts
- Email communications
- File/data storage
- Error monitoring and logging

## 5. Policy Version Archive

Maintain a copy of each version of the Privacy Policy for audit purposes.

| Version | Effective Date | Superseded Date | Archive Location |
|---------|---------------|-----------------|------------------|
| 1.0 | 2026-03-16 | Current | PRIVACY_POLICY.md |
| [0.x] | [DATE] | [DATE] | [ARCHIVE PATH OR URL] |

> **Best practice:** Store archived versions in version control (git) or a dedicated compliance document management system. Each version should be immutable once superseded.

## 6. Review Schedule

| Review Type | Frequency | Next Review | Owner |
|-------------|-----------|-------------|-------|
| Scheduled review | Quarterly | [DATE] | DPO |
| Post-deployment review | After each release with data changes | Ongoing | Engineering + DPO |
| Annual comprehensive review | Annually | [DATE] | Legal + DPO |
| Regulatory trigger review | When regulations change | As needed | Legal |

> **Tip:** Run `codepliant diff` after each deployment to detect changes that may require a privacy policy update. Integrate into CI/CD for automated detection.

## 7. Contact

For questions about privacy policy changes:

- **Data Protection Officer:** [Data Protection Officer Name] ([dpo@example.com])
- **General inquiries:** [your-email@example.com]

---

*This Privacy Policy Changelog was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **maybe** codebase. The baseline in Section 4 is auto-populated from detected services and data types. This template should be maintained by your DPO and reviewed by legal counsel.*