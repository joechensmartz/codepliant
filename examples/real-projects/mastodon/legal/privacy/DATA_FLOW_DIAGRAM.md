# Data Flow Diagram

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @mastodon/mastodon

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
  User[User] -->|email, password hash, session data| devise[devise]
  User[User] -->|cached data, session data| ioredis[ioredis]
  User[User] -->|email, name, OAuth tokens| omniauth[omniauth]
  User[User] -->|user data as defined in schema| pg[pg]
  User[User] -->|application data, user records| PostgreSQL[PostgreSQL]
  User[User] -->|application data, user records| PostgreSQL__env_[PostgreSQL (env)]
  User[User] -->|user roles, authorization policies, access control data| pundit[pundit]
  User[User] -->|IP addresses, request metadata| rack_attack[rack-attack]
  User[User] -->|email addresses, email content| rails_actionmailer[rails-actionmailer]
  User[User] -->|user data as defined in schema| rails_activerecord[rails-activerecord]
  User[User] -->|session cookies, CSRF tokens| rails_sessions[rails-sessions]
  User[User] -->|cached data, session data| redis[redis]
  User[User] -->|session data, cache data| Redis[Redis]
  User[User] -->|job data, user data processed in background jobs| sidekiq[sidekiq]
  User[User] -->|real-time user data, connection metadata, IP address| ws__WebSocket_[ws (WebSocket)]
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
| User registration/login | email, name, OAuth tokens, profile data | via omniauth |
| User registration/login | user roles, authorization policies, access control data | via pundit |
| Email subscription/contact forms | email addresses, email content | via rails-actionmailer |
| User registration/login | session cookies, CSRF tokens | via rails-sessions |

### Third-Party Data Sharing

| Recipient | Category | Data Shared |
|-----------|----------|-------------|
| ActionCable | Third-Party Service | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | Third-Party Service | session cookies, session data, CSRF tokens |
| ActionMailer | Email Service | email addresses, email content |
| rack-attack | Third-Party Service | IP addresses, request metadata |
| rails-actionmailer | Email Service | email addresses, email content |
| sidekiq | Third-Party Service | job data, user data processed in background jobs |
| ws (WebSocket) | Third-Party Service | real-time user data, connection metadata, IP address, WebSocket messages |

## Service Inventory

| Service | Category | Data Processed |
|---------|----------|---------------|
| ActionCable | other | real-time user data, connection metadata, channel subscriptions, WebSocket messages |
| ActionController::Cookies | other | session cookies, session data, CSRF tokens |
| rack-attack | other | IP addresses, request metadata |
| sidekiq | other | job data, user data processed in background jobs |
| ws (WebSocket) | other | real-time user data, connection metadata, IP address, WebSocket messages |
| ActionMailer | email | email addresses, email content |
| rails-actionmailer | email | email addresses, email content |
| Active Storage | storage | uploaded files, file metadata, storage service credentials, potential PII in uploaded content |
| ActiveStorage | storage | uploaded files, file metadata, storage references |
| aws-sdk-s3 | storage | uploaded files, file metadata |
| ActiveRecord | database | user data as defined in schema, timestamps, associations |
| ioredis | database | cached data, session data |
| pg | database | user data as defined in schema |
| PostgreSQL | database | application data, user records |
| PostgreSQL (env) | database | application data, user records |
| rails-activerecord | database | user data as defined in schema |
| redis | database | cached data, session data |
| Redis | database | session data, cache data |
| devise | auth | email, password hash, session data, authentication tokens |
| omniauth | auth | email, name, OAuth tokens, profile data |
| pundit | auth | user roles, authorization policies, access control data |
| rails-sessions | auth | session cookies, CSRF tokens |

---

## How to Use This Diagram

1. **GitHub/GitLab:** The Mermaid diagram renders automatically in markdown preview
2. **VS Code:** Install the "Markdown Preview Mermaid Support" extension
3. **Export:** Use [Mermaid Live Editor](https://mermaid.live/) to export as SVG or PNG
4. **CI/CD:** Use `@mermaid-js/mermaid-cli` to generate images in your pipeline

For questions about this data flow diagram, contact [your-email@example.com].

---

*This data flow diagram was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all data flows for accuracy. This document does not constitute legal advice.*