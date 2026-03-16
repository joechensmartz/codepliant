# Responsible Disclosure Policy

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Effective Date:** 2026-03-16
**Last Updated:** 2026-03-16

**Organization:** [Your Company Name]
**Project:** root

---

## 1. Introduction

[Your Company Name] takes the security of our systems and user data seriously. We value the security research community and encourage responsible disclosure of any vulnerabilities found in our products and services.

This policy describes how to report security vulnerabilities to us, what you can expect from us, and what we expect from you.

## 2. Scope

### 2.1 In Scope

The following assets and services are within the scope of this program:

| Asset | Type | Priority |
|-------|------|----------|
| [https://yoursite.com] | Web Application | Critical |
| [https://yoursite.com]/api/* | API Endpoints | Critical |
| Payment processing (stripe) | Payment Infrastructure | Critical |
| Data storage (@aws-sdk/client-s3, ioredis, Multer) | Data Infrastructure | High |

### 2.2 Out of Scope

The following are **not** in scope:

- Third-party services not operated by [Your Company Name]
- Social engineering attacks (phishing, vishing, etc.)
- Physical security attacks
- Denial of service (DoS/DDoS) attacks
- Automated vulnerability scanning that generates excessive traffic
- Issues in third-party dependencies with no demonstrated exploit path
- Clickjacking on pages with no sensitive actions
- Missing security headers without demonstrated impact

## 3. How to Report

### 3.1 Reporting Channel

Send vulnerability reports to: **security@example.com]**

### 3.2 Required Information

Please include the following in your report:

1. **Description** — Clear description of the vulnerability
2. **Steps to reproduce** — Detailed steps to reproduce the issue
3. **Impact assessment** — Your assessment of the potential impact
4. **Affected component** — URL, API endpoint, or system affected
5. **Proof of concept** — Screenshots, logs, or code demonstrating the issue
6. **Your contact information** — Email or secure communication channel

### 3.3 Encryption

For sensitive reports, we encourage encrypting your communication. Please request our PGP public key by emailing security@example.com] with the subject line "PGP Key Request".

## 4. Vulnerability Categories

We classify vulnerabilities by severity using the CVSS v3.1 framework:

| Severity | CVSS Score | Examples |
|----------|-----------|----------|
| **Critical** | 9.0 - 10.0 | Remote code execution, authentication bypass, SQL injection with data exfiltration |
| **High** | 7.0 - 8.9 | Privilege escalation, stored XSS with session hijacking, IDOR exposing PII |
| **Medium** | 4.0 - 6.9 | CSRF on sensitive actions, reflected XSS, information disclosure |
| **Low** | 0.1 - 3.9 | Verbose error messages, missing rate limiting on non-critical endpoints |

### 4.1 Priority Areas

Based on our technology stack, we are particularly interested in:

- **Payment Security** — transaction manipulation, price tampering, payment data exposure (stripe)
- **Data Storage** — injection, unauthorized data access, data leakage (@aws-sdk/client-s3, ioredis, Multer)

## 5. Safe Harbor

[Your Company Name] supports responsible security research. If you conduct security research in compliance with this policy, we will:

- **Not pursue legal action** against you for your research activities
- **Not report** your activities to law enforcement, provided you act in good faith
- **Work with you** to understand and resolve the issue quickly
- **Recognize your contribution** (with your permission) in our security acknowledgments

### 5.1 Researcher Obligations

To qualify for safe harbor, you must:

- Act in good faith and avoid privacy violations, data destruction, or service disruption
- Only interact with accounts you own or have explicit permission to test
- Not access, modify, or delete data belonging to other users
- Stop testing and report immediately if you encounter user data
- Not publicly disclose the vulnerability before we have addressed it
- Provide us a reasonable time to fix the issue before any disclosure

## 6. Response Timeline

We commit to the following response timeline:

| Stage | Timeline |
|-------|----------|
| **Acknowledgment** | Within 24 hours of report receipt |
| **Initial Assessment** | Within 3 business days |
| **Status Update** | Every 5 business days during investigation |
| **Resolution Target** | Critical: 7 days, High: 14 days, Medium: 30 days, Low: 90 days |
| **Disclosure** | Coordinated disclosure after fix is deployed |

If we need more time to address an issue, we will notify you and provide an updated timeline.

## 7. Recognition & Hall of Fame

With your permission, we will publicly acknowledge your contribution in our security Hall of Fame. Please indicate in your report whether you would like to be credited (and how you'd like to be identified).

## 8. Contact

- **Security reports:** security@example.com]
- **General inquiries:** [your-email@example.com]

---

*This policy is based on the [disclose.io](https://disclose.io) framework. Generated by Codepliant from project analysis. Review with your security team before publishing.*
