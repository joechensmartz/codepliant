> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Company:** Acme Inc

## Related Documents

- Security Policy (`SECURITY.md`)
- Information Security Policy (`INFORMATION_SECURITY_POLICY.md`)
- Audit Log Policy (`AUDIT_LOG_POLICY.md`)

---

## 1. Purpose

This policy establishes access control requirements for the **nextjs-saas-example** application, including role-based access control (RBAC), authentication standards, password policies, session management, and multi-factor authentication (MFA) requirements. It supports compliance with GDPR Article 32 (security of processing), SOC 2 CC6.1–CC6.3, and ISO 27001 Annex A.9.

## 2. Scope

This policy applies to all users, administrators, and service accounts that access the application, its data, and its infrastructure.

## 3. Detected Authentication Services

The following authentication services were detected in the codebase:

| Service | Data Collected |
|---------|---------------|
| @supabase/supabase-js | email, password hash, session data, user metadata |

---

## 4. Role-Based Access Control (RBAC)

### 4.1 Role Definitions

| Role | Description | Access Level |
|------|-------------|-------------|
| Super Admin | Full system access including user management and configuration | Full |
| Admin | Application administration, user management, content moderation | High |
| Manager | Team management, reporting, limited configuration | Medium-High |
| User | Standard application features, own data management | Standard |
| Viewer | Read-only access to permitted resources | Read-Only |
| API Service | Machine-to-machine access via API keys or service tokens | Scoped |

### 4.2 Principle of Least Privilege

1. All accounts must be assigned the **minimum permissions** required for their function
2. Administrative privileges must be granted only when explicitly required and approved
3. Service accounts must have **scoped permissions** limited to their specific function
4. Elevated privileges must be **time-bounded** and reviewed regularly

### 4.3 Access Provisioning

1. Access requests must be submitted through a documented approval process
2. New accounts default to the **lowest privilege level** (Viewer or User)
3. Privilege escalation requires manager approval and documented justification
4. Access must be **revoked immediately** upon role change or employment termination

### 4.4 Access Review Schedule

| Review Type | Frequency | Responsible Party |
|------------|-----------|-------------------|
| User access audit | Quarterly | Security team |
| Admin privilege review | Monthly | Engineering lead |
| Service account audit | Quarterly | DevOps team |
| Inactive account cleanup | Monthly | IT operations |
| Third-party access review | Quarterly | Security team |

---

## 5. Password Policy

### 5.1 Password Requirements

| Requirement | Standard |
|------------|----------|
| Minimum length | 12 characters |
| Complexity | At least 3 of: uppercase, lowercase, numbers, special characters |
| Maximum age | 90 days (recommended: no forced rotation if strong + MFA) |
| History | Cannot reuse last 12 passwords |
| Lockout threshold | 5 failed attempts |
| Lockout duration | 15 minutes (progressive increase) |

### 5.2 Password Storage

1. Passwords must be **hashed** using bcrypt, scrypt, or Argon2id (never MD5 or SHA-1)
2. A unique **salt** must be generated per password
3. Work factor must be set to at least **10 rounds** (bcrypt) or equivalent
4. Raw passwords must **never** be logged, stored in plaintext, or transmitted in URLs

### 5.3 Password Reset

1. Password reset links must expire within **1 hour**
2. Reset tokens must be cryptographically random (minimum 128 bits)
3. Previous sessions must be **invalidated** upon password change
4. Users must be notified via email when their password is changed

---

## 6. Session Management

### 6.1 Session Configuration

| Parameter | Requirement |
|-----------|------------|
| Session timeout (idle) | 30 minutes |
| Absolute session lifetime | 24 hours |
| Session token length | Minimum 128 bits of entropy |
| Token storage | HttpOnly, Secure, SameSite cookies |
| Token transmission | HTTPS only (TLS 1.2+) |

### 6.2 Session Security

1. Session tokens must be **regenerated** after authentication (prevent session fixation)
2. All sessions must be **invalidated** on logout
3. Users must be able to view and **terminate active sessions**
4. Concurrent session limits should be enforced for sensitive operations
5. Session data must be stored **server-side** (not in client-accessible cookies)

---

## 7. Multi-Factor Authentication (MFA)

### 7.1 MFA Requirements

| User Type | MFA Requirement |
|-----------|----------------|
| Super Admin / Admin | **Required** — must be enforced |
| Users with access to PII | **Required** |
| Standard users | **Strongly recommended** |
| API / Service accounts | API key + IP allowlisting |
| Users with payment data access | **Required** — PCI DSS compliance |
| Users managing AI configurations | **Required** — prevent unauthorized model changes |

### 7.2 Supported MFA Methods

| Method | Security Level | Recommendation |
|--------|---------------|----------------|
| TOTP (authenticator app) | High | **Recommended** — Google Authenticator, Authy, 1Password |
| WebAuthn / Passkeys | Very High | **Preferred** — hardware security keys, biometrics |
| SMS OTP | Medium | **Acceptable** — vulnerable to SIM swap; use as fallback only |
| Email OTP | Medium | **Acceptable** — use as fallback only |
| Push notification | High | **Recommended** — when supported by auth provider |

### 7.3 MFA Implementation Recommendation

No MFA implementation was detected in the codebase. **It is strongly recommended** to implement MFA, especially for:

1. Administrative accounts
2. Accounts with access to personal data
3. Accounts with access to financial data
4. Any account with elevated privileges

Consider integrating TOTP-based MFA (e.g., via @supabase/supabase-js) as a first step.

---

## 8. API & Service Account Access

### 8.1 API Key Management

1. API keys must be generated with **sufficient entropy** (minimum 256 bits)
2. Keys must be **scoped** to specific operations and resources
3. Keys must have an **expiration date** (maximum 1 year)
4. Unused keys must be **revoked** after 90 days of inactivity
5. API keys must **never** be committed to version control

### 8.2 Service Account Standards

1. Service accounts must have a **named owner** (individual or team)
2. Service account credentials must be rotated at least **quarterly**
3. Service accounts must be excluded from interactive login
4. Service account activity must be **logged and monitored**

---

## 9. Access Monitoring & Alerting

### 9.1 Events to Monitor

| Event | Alert Priority |
|-------|---------------|
| Failed login attempts (5+ within 15 min) | High |
| Successful login from new device/location | Medium |
| Admin privilege escalation | Critical |
| Password change or reset | Medium |
| MFA enrollment or removal | High |
| API key creation or rotation | Medium |
| Service account activity outside normal hours | High |
| Bulk data access or export | Critical |

### 9.2 Response Procedures

1. High/Critical alerts must be investigated within **1 hour**
2. Suspicious accounts must be **temporarily suspended** pending investigation
3. Compromised credentials must be **immediately revoked**
4. Security incidents must follow the incident response plan (see INCIDENT_RESPONSE_PLAN.md)

---

## 10. Policy Review

This access control policy should be reviewed:

- **Quarterly** as part of the security review cycle
- **When adding** new authentication services or access patterns
- **After a security incident** involving unauthorized access
- **When regulatory requirements** change

For questions about this policy, contact legal@acme.com.

---

*This Access Control Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*