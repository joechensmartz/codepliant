# Data Flow Diagram

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** twenty

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

> This document provides a visual representation of how personal data flows through the application. The diagram below is rendered using [Mermaid](https://mermaid.js.org/) and can be viewed directly on GitHub, GitLab, or any Mermaid-compatible renderer.

## Visual Data Flow

```mermaid
graph LR
  User[User] -->|user prompts, conversation history, generated content| _ai_sdk_anthropic[@ai-sdk/anthropic]
  User[User] -->|user prompts, conversation history, generated content| _ai_sdk_google[@ai-sdk/google]
  User[User] -->|user prompts, conversation history, generated content| _ai_sdk_openai[@ai-sdk/openai]
  User[User] -->|uploaded files, file metadata| AWS_S3[AWS S3]
  User[User] -->|error data, stack traces, user context| Sentry[Sentry]
  User[User] -->|user prompts, conversation history, generated content| _vercel_ai[@vercel/ai]
  User[User] -->|user data as defined in schema| Drizzle[Drizzle]
  User[User] -->|user data via Google APIs, calendar data, email data| googleapis[googleapis]
  User[User] -->|cached data, session data| ioredis[ioredis]
  User[User] -->|email addresses, email content| nodemailer[nodemailer]
  User[User] -->|user prompts, conversation history, generated content| OpenAI[OpenAI]
  User[User] -->|email, name, OAuth tokens| passport[passport]
  User[User] -->|email, name, Google profile data| passport_google_oauth20[passport-google-oauth20]
  User[User] -->|email, name, Microsoft profile data| passport_microsoft[passport-microsoft]
  User[User] -->|cached data, session data| redis[redis]
  User[User] -->|payment information, billing address, email| Stripe[Stripe]
  _ai_sdk_anthropic[@ai-sdk/anthropic] -->|logs| Sentry[Sentry]
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
| AI-powered feature usage | user prompts, conversation history, generated content | via @ai-sdk/anthropic |
| AI-powered feature usage | user prompts, conversation history, generated content | via @ai-sdk/google |
| AI-powered feature usage | user prompts, conversation history, generated content | via @ai-sdk/openai |
| AI-powered feature usage | user prompts, conversation history, generated content | via @vercel/ai |
| Email subscription/contact forms | email addresses, email content | via nodemailer |
| AI-powered feature usage | user prompts, conversation history, generated content | via openai |
| User registration/login | email, name, OAuth tokens, session data | via passport |
| User registration/login | email, name, Google profile data, OAuth tokens | via passport-google-oauth20 |
| User registration/login | email, name, Microsoft profile data, OAuth tokens | via passport-microsoft |
| Payment checkout | payment information, billing address, email, transaction history | via stripe |

### Third-Party Data Sharing

| Recipient | Category | Data Shared |
|-----------|----------|-------------|
| @ai-sdk/anthropic | AI Service | user prompts, conversation history, generated content |
| @ai-sdk/google | AI Service | user prompts, conversation history, generated content |
| @ai-sdk/openai | AI Service | user prompts, conversation history, generated content |
| @sentry/node | Error Monitoring | error data, stack traces, user context, device information, IP address, performance profiles |
| @vercel/ai | AI Service | user prompts, conversation history, generated content |
| googleapis | Third-Party Service | user data via Google APIs, calendar data, email data, profile information |
| nodemailer | Email Service | email addresses, email content |
| openai | AI Service | user prompts, conversation history, generated content |
| stripe | Payment Processing | payment information, billing address, email, transaction history |

## Service Inventory

| Service | Category | Data Processed |
|---------|----------|---------------|
| @ai-sdk/anthropic | ai | user prompts, conversation history, generated content |
| @ai-sdk/google | ai | user prompts, conversation history, generated content |
| @ai-sdk/openai | ai | user prompts, conversation history, generated content |
| @vercel/ai | ai | user prompts, conversation history, generated content |
| OpenAI | ai | user prompts, conversation history, generated content |
| AWS S3 | storage | uploaded files, file metadata |
| Sentry | monitoring | error data, stack traces, user context, device information, IP address, performance profiles |
| Drizzle | database | user data as defined in schema |
| ioredis | database | cached data, session data |
| redis | database | cached data, session data |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information |
| nodemailer | email | email addresses, email content |
| passport | auth | email, name, OAuth tokens, session data |
| passport-google-oauth20 | auth | email, name, Google profile data, OAuth tokens |
| passport-microsoft | auth | email, name, Microsoft profile data, OAuth tokens |
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