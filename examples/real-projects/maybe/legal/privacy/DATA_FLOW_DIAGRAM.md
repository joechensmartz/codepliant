# Data Flow Diagram

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** maybe

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

> This document provides a visual representation of how personal data flows through the application. The diagram below is rendered using [Mermaid](https://mermaid.js.org/) and can be viewed directly on GitHub, GitLab, or any Mermaid-compatible renderer.

## Visual Data Flow

```mermaid
graph LR
  User[User] -->|real-time user data, connection metadata, channel subscriptions| ActionCable[ActionCable]
  User[User] -->|session cookies, session data, CSRF tokens| ActionController__Cookies[ActionController::Cookies]
  User[User] -->|email addresses, email content| ActionMailer[ActionMailer]
  User[User] -->|uploaded files, file metadata, storage service credentials| Active_Storage[Active Storage]
  User[User] -->|user data as defined in schema, timestamps, associations| ActiveRecord[ActiveRecord]
  User[User] -->|uploaded files, file metadata, storage references| ActiveStorage[ActiveStorage]
  User[User] -->|uploaded files, file metadata| aws_sdk_s3[aws-sdk-s3]
  User[User] -->|user profiles, email, name| intercom_ruby[intercom-ruby]
  User[User] -->|email addresses, email content| nodemailer[nodemailer]
  User[User] -->|user data as defined in schema| pg[pg]
  User[User] -->|bank account data, transaction history, account balances| Plaid[Plaid]
  User[User] -->|IP addresses, request metadata| rack_attack[rack-attack]
  User[User] -->|email addresses, email content| rails_actionmailer[rails-actionmailer]
  User[User] -->|user data as defined in schema| rails_activerecord[rails-activerecord]
  User[User] -->|session cookies, CSRF tokens| rails_sessions[rails-sessions]
  User[User] -->|cached data, session data| redis[redis]
  User[User] -->|user prompts, conversation history, generated content| ruby_openai[ruby-openai]
  User[User] -->|error data, stack traces, user context| sentry_ruby[sentry-ruby]
  User[User] -->|job data, user data processed in background jobs| sidekiq[sidekiq]
  User[User] -->|payment information, billing address, email| Stripe[Stripe]
  ruby_openai[ruby-openai] -->|logs| sentry_ruby[sentry-ruby]
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
| Email subscription/contact forms | email addresses, email content | via ActionMailer |
| Email subscription/contact forms | email addresses, email content | via nodemailer |
| Payment checkout | bank account data, transaction history, account balances, financial institution data | via plaid |
| Email subscription/contact forms | email addresses, email content | via rails-actionmailer |
| User registration/login | session cookies, CSRF tokens | via rails-sessions |
| AI-powered feature usage | user prompts, conversation history, generated content | via ruby-openai |
| Payment checkout | payment information, billing address, email, transaction history | via stripe |

### Third-Party Data Sharing

| Recipient | Category | Data Shared |
|-----------|----------|-------------|
| ActionCable | Third-Party Service | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | Third-Party Service | session cookies, session data, CSRF tokens |
| ActionMailer | Email Service | email addresses, email content |
| intercom-ruby | Third-Party Service | user profiles, email, name, conversations, user behavior |
| nodemailer | Email Service | email addresses, email content |
| plaid | Payment Processing | bank account data, transaction history, account balances, financial institution data |
| rack-attack | Third-Party Service | IP addresses, request metadata |
| rails-actionmailer | Email Service | email addresses, email content |
| ruby-openai | AI Service | user prompts, conversation history, generated content |
| sentry-ruby | Error Monitoring | error data, stack traces, user context, device information |
| sidekiq | Third-Party Service | job data, user data processed in background jobs |
| stripe | Payment Processing | payment information, billing address, email, transaction history |

## Service Inventory

| Service | Category | Data Processed |
|---------|----------|---------------|
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens |
| intercom-ruby | other | user profiles, email, name, conversations, user behavior |
| rack-attack | other | IP addresses, request metadata |
| sidekiq | other | job data, user data processed in background jobs |
| ActionMailer | email | email addresses, email content |
| nodemailer | email | email addresses, email content |
| rails-actionmailer | email | email addresses, email content |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content |
| ActiveStorage | storage | uploaded files, file metadata, storage references |
| aws-sdk-s3 | storage | uploaded files, file metadata |
| ActiveRecord | database | user data as defined in schema, timestamps, associations |
| pg | database | user data as defined in schema |
| rails-activerecord | database | user data as defined in schema |
| redis | database | cached data, session data |
| Plaid | payment | bank account data, transaction history, account balances, financial institution data |
| Stripe | payment | payment information, billing address, email, transaction history |
| rails-sessions | auth | session cookies, CSRF tokens |
| ruby-openai | ai | user prompts, conversation history, generated content |
| sentry-ruby | monitoring | error data, stack traces, user context, device information |

---

## How to Use This Diagram

1. **GitHub/GitLab:** The Mermaid diagram renders automatically in markdown preview
2. **VS Code:** Install the "Markdown Preview Mermaid Support" extension
3. **Export:** Use [Mermaid Live Editor](https://mermaid.live/) to export as SVG or PNG
4. **CI/CD:** Use `@mermaid-js/mermaid-cli` to generate images in your pipeline

For questions about this data flow diagram, contact [your-email@example.com].

---

*This data flow diagram was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all data flows for accuracy. This document does not constitute legal advice.*