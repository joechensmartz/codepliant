# Data Flow Diagram

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @chatwoot/chatwoot

**Company:** [Your Company Name]

## Related Documents

- Data Flow Map (`DATA_FLOW_MAP.md`)
- Privacy Policy (`PRIVACY_POLICY.md`)

---

> This document provides a visual representation of how personal data flows through the application. The diagram below is rendered using [Mermaid](https://mermaid.js.org/) and can be viewed directly on GitHub, GitLab, or any Mermaid-compatible renderer.

## Visual Data Flow

```mermaid
graph LR
  User[User] -->|user behavior, device information, session data| Amplitude[Amplitude]
  User[User] -->|uploaded files, file metadata| AWS_S3[AWS S3]
  User[User] -->|phone numbers, voice call metadata, call recordings| _twilio_voice_sdk[@twilio/voice-sdk]
  User[User] -->|real-time user data, connection metadata, channel subscriptions| ActionCable[ActionCable]
  User[User] -->|session cookies, session data, CSRF tokens| ActionController__Cookies[ActionController::Cookies]
  User[User] -->|email addresses, email content| ActionMailer[ActionMailer]
  User[User] -->|uploaded files, file metadata, storage service credentials| Active_Storage[Active Storage]
  User[User] -->|user data as defined in schema, timestamps, associations| ActiveRecord[ActiveRecord]
  User[User] -->|uploaded files, file metadata, storage references| ActiveStorage[ActiveStorage]
  User[User] -->|uploaded files, file metadata| aws_sdk_s3[aws-sdk-s3]
  User[User] -->|email, password hash, session data| devise[devise]
  User[User] -->|uploaded files, file metadata| google_cloud_storage[google-cloud-storage]
  User[User] -->|cached data, session data| ioredis[ioredis]
  User[User] -->|email content| MailHog[MailHog]
  User[User] -->|page views, conversion events, user behavior| Meta_Pixel[Meta Pixel]
  User[User] -->|email addresses, email content| nodemailer[nodemailer]
  User[User] -->|email, name, OAuth tokens| omniauth[omniauth]
  User[User] -->|user data as defined in schema| pg[pg]
  User[User] -->|application data, user records| PostgreSQL__env_[PostgreSQL (env)]
  User[User] -->|user roles, authorization policies, access control data| pundit[pundit]
  User[User] -->|IP addresses, request metadata| rack_attack[rack-attack]
  User[User] -->|email addresses, email content| rails_actionmailer[rails-actionmailer]
  User[User] -->|user data as defined in schema| rails_activerecord[rails-activerecord]
  User[User] -->|session cookies, CSRF tokens| rails_sessions[rails-sessions]
  User[User] -->|cached data, session data| redis[redis]
  User[User] -->|session data, cache data| Redis[Redis]
  User[User] -->|session data, cache data| Redis__env_[Redis (env)]
  User[User] -->|user prompts, conversation history, generated content| ruby_openai[ruby-openai]
  User[User] -->|error data, stack traces, user context| sentry_ruby[sentry-ruby]
  User[User] -->|job data, user data processed in background jobs| sidekiq[sidekiq]
  User[User] -->|payment information, billing address, email| Stripe[Stripe]
  User[User] -->|phone numbers, SMS message content, voice call metadata| twilio_ruby[twilio-ruby]
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
| User registration/login | email, password hash, session data, authentication tokens | via devise |
| Email subscription/contact forms | email content | via MailHog |
| Email subscription/contact forms | email addresses, email content | via nodemailer |
| User registration/login | email, name, OAuth tokens, profile data | via omniauth |
| User registration/login | user roles, authorization policies, access control data | via pundit |
| Email subscription/contact forms | email addresses, email content | via rails-actionmailer |
| User registration/login | session cookies, CSRF tokens | via rails-sessions |
| AI-powered feature usage | user prompts, conversation history, generated content | via ruby-openai |
| Payment checkout | payment information, billing address, email, transaction history | via stripe |

### Third-Party Data Sharing

| Recipient | Category | Data Shared |
|-----------|----------|-------------|
| @amplitude/analytics-browser | Analytics | user behavior, device information, session data |
| @twilio/voice-sdk | Third-Party Service | phone numbers, voice call metadata, call recordings, device information |
| ActionCable | Third-Party Service | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | Third-Party Service | session cookies, session data, CSRF tokens |
| ActionMailer | Email Service | email addresses, email content |
| MailHog | Email Service | email content |
| Meta Pixel | Advertising | page views, conversion events, user behavior, device information |
| nodemailer | Email Service | email addresses, email content |
| rack-attack | Third-Party Service | IP addresses, request metadata |
| rails-actionmailer | Email Service | email addresses, email content |
| ruby-openai | AI Service | user prompts, conversation history, generated content |
| sentry-ruby | Error Monitoring | error data, stack traces, user context, device information |
| sidekiq | Third-Party Service | job data, user data processed in background jobs |
| stripe | Payment Processing | payment information, billing address, email, transaction history |
| twilio-ruby | Third-Party Service | phone numbers, SMS message content, voice call metadata |

## Service Inventory

| Service | Category | Data Processed |
|---------|----------|---------------|
| Amplitude | analytics | user behavior, device information, session data |
| AWS S3 | storage | uploaded files, file metadata |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content |
| ActiveStorage | storage | uploaded files, file metadata, storage references |
| aws-sdk-s3 | storage | uploaded files, file metadata |
| google-cloud-storage | storage | uploaded files, file metadata |
| @twilio/voice-sdk | other | phone numbers, voice call metadata, call recordings, device information |
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens |
| rack-attack | other | IP addresses, request metadata |
| sidekiq | other | job data, user data processed in background jobs |
| twilio-ruby | other | phone numbers, SMS message content, voice call metadata |
| ActionMailer | email | email addresses, email content |
| MailHog | email | email content |
| nodemailer | email | email addresses, email content |
| rails-actionmailer | email | email addresses, email content |
| ActiveRecord | database | user data as defined in schema, timestamps, associations |
| ioredis | database | cached data, session data |
| pg | database | user data as defined in schema |
| PostgreSQL (env) | database | application data, user records |
| rails-activerecord | database | user data as defined in schema |
| redis | database | cached data, session data |
| Redis | database | session data, cache data |
| Redis (env) | database | session data, cache data |
| devise | auth | email, password hash, session data, authentication tokens |
| omniauth | auth | email, name, OAuth tokens, profile data |
| pundit | auth | user roles, authorization policies, access control data |
| rails-sessions | auth | session cookies, CSRF tokens |
| Meta Pixel | advertising | page views, conversion events, user behavior, device information |
| ruby-openai | ai | user prompts, conversation history, generated content |
| sentry-ruby | monitoring | error data, stack traces, user context, device information |
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