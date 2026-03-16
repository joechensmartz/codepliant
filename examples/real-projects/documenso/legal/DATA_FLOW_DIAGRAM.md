# Data Flow Diagram

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @documenso/root

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

> This document provides a visual representation of how personal data flows through the application. The diagram below is rendered using [Mermaid](https://mermaid.js.org/) and can be viewed directly on GitHub, GitLab, or any Mermaid-compatible renderer.

## Visual Data Flow

```mermaid
graph LR
  User[User] -->|user prompts, conversation history, generated content| _ai_sdk_google_vertex[@ai-sdk/google-vertex]
  User[User] -->|email addresses, email content, uploaded files| _aws_sdk_client_ses[@aws-sdk/client-ses]
  User[User] -->|encryption keys, key metadata| _google_cloud_kms[@google-cloud/kms]
  User[User] -->|biometric authentication data, device attestation, credential IDs| _simplewebauthn_server[@simplewebauthn/server]
  User[User] -->|user prompts, conversation history, generated content| _vercel_ai[@vercel/ai]
  User[User] -->|user data via Google APIs, calendar data, email data| googleapis[googleapis]
  User[User] -->|email, name, profile picture| NextAuth[NextAuth]
  User[User] -->|email addresses, email content| nodemailer[nodemailer]
  User[User] -->|email, name, Microsoft profile data| passport_microsoft[passport-microsoft]
  User[User] -->|user behavior, session recordings, feature flag usage| PostHog[PostHog]
  User[User] -->|user data as defined in schema| Prisma[Prisma]
  User[User] -->|email addresses, email content| Resend[Resend]
  User[User] -->|payment information, billing address, email| Stripe[Stripe]
```

## Legend

| Symbol | Meaning |
|--------|---------|
| **User** | End user of the application |
| **Arrow labels** | Types of personal data transmitted |
| **Service nodes** | Third-party or internal services processing data |

## Data Flow Details

### Collection Points

| Source | Data Collected | Mechanism |
|--------|---------------|-----------|
| AI-powered feature usage | user prompts, conversation history, generated content | via @ai-sdk/google-vertex |
| Email subscription/contact forms | email addresses, email content, uploaded files, file metadata | via @aws-sdk/client-ses |
| User registration/login | biometric authentication data, device attestation, credential IDs | via @simplewebauthn/server |
| AI-powered feature usage | user prompts, conversation history, generated content | via @vercel/ai |
| User registration/login | email, name, profile picture, OAuth tokens, session data | via next-auth |
| Email subscription/contact forms | email addresses, email content | via nodemailer |
| User registration/login | email, name, Microsoft profile data, OAuth tokens | via passport-microsoft |
| Email subscription/contact forms | email addresses, email content | via resend |
| Payment checkout | payment information, billing address, email, transaction history | via stripe |

### Third-Party Data Sharing

| Recipient | Category | Data Shared |
|-----------|----------|-------------|
| @ai-sdk/google-vertex | AI Service | user prompts, conversation history, generated content |
| @aws-sdk/client-ses | Email Service | email addresses, email content, uploaded files, file metadata |
| @google-cloud/kms | Third-Party Service | encryption keys, key metadata |
| @vercel/ai | AI Service | user prompts, conversation history, generated content |
| googleapis | Third-Party Service | user data via Google APIs, calendar data, email data, profile information |
| nodemailer | Email Service | email addresses, email content |
| posthog | Analytics | user behavior, session recordings, feature flag usage, device information |
| resend | Email Service | email addresses, email content |
| stripe | Payment Processing | payment information, billing address, email, transaction history |

## Service Inventory

| Service | Category | Data Processed |
|---------|----------|---------------|
| @ai-sdk/google-vertex | ai | user prompts, conversation history, generated content |
| @vercel/ai | ai | user prompts, conversation history, generated content |
| @aws-sdk/client-ses | email | email addresses, email content, uploaded files, file metadata |
| nodemailer | email | email addresses, email content |
| Resend | email | email addresses, email content |
| @google-cloud/kms | other | encryption keys, key metadata |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information |
| @simplewebauthn/server | auth | biometric authentication data, device attestation, credential IDs |
| NextAuth | auth | email, name, profile picture, OAuth tokens, session data |
| passport-microsoft | auth | email, name, Microsoft profile data, OAuth tokens |
| PostHog | analytics | user behavior, session recordings, feature flag usage, device information |
| Prisma | database | user data as defined in schema |
| Stripe | payment | payment information, billing address, email, transaction history |

---

## How to Use This Diagram

1. **GitHub/GitLab:** The Mermaid diagram renders automatically in markdown preview
2. **VS Code:** Install the "Markdown Preview Mermaid Support" extension
3. **Export:** Use [Mermaid Live Editor](https://mermaid.live/) to export as SVG or PNG
4. **CI/CD:** Use `@mermaid-js/mermaid-cli` to generate images in your pipeline

For questions about this data flow diagram, contact [your-email@example.com].

---

*This data flow diagram was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all data flows for accuracy. This document does not constitute legal advice.*