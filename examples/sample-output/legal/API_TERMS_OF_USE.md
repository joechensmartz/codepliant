# API Terms of Use

**Effective Date:** 2026-03-18
**Last Updated:** 2026-03-18

**Organization:** Acme Inc
**Project:** nextjs-saas-example

---

## 1. Acceptance of Terms

By accessing or using the Acme Inc API ("API"), you agree to be bound by these API Terms of Use ("Terms"). If you are using the API on behalf of an organization, you represent that you have authority to bind that organization to these Terms.

These Terms supplement and are in addition to our [Terms of Service](./TERMS_OF_SERVICE.md) and [Privacy Policy](./PRIVACY_POLICY.md). In case of conflict, these API-specific terms prevail for API usage.

## 2. API Access & Authentication

### 2.1 API Keys

- You must register for an API key to access the API
- API keys are confidential and must not be shared or published
- You are responsible for all activity under your API key
- Acme Inc may revoke keys that are compromised or misused

### 2.2 Authentication Methods

The API supports the following authentication methods:

- **@supabase/supabase-js** — integrated authentication provider
- **Bearer Token** — include `Authorization: Bearer <token>` in request headers
- **API Key** — include `X-API-Key: <key>` in request headers

## 3. Rate Limits

To ensure fair usage and system stability, the following rate limits apply:

| Tier | Requests/minute | Requests/hour | Requests/day | Burst |
|------|----------------|--------------|-------------|-------|
| Free | 60 | 1,000 | 10,000 | 10/sec |
| Standard | 300 | 10,000 | 100,000 | 50/sec |
| Enterprise | Custom | Custom | Custom | Custom |

### 3.1 Rate Limit Headers

All API responses include the following headers:

```
X-RateLimit-Limit: <max requests per window>
X-RateLimit-Remaining: <remaining requests in window>
X-RateLimit-Reset: <UTC epoch timestamp when window resets>
Retry-After: <seconds to wait (only on 429 responses)>
```

### 3.2 Exceeding Limits

When you exceed rate limits, the API returns HTTP 429 (Too Many Requests). Implement exponential backoff in your integration. Persistent abuse may result in temporary or permanent API access revocation.

## 4. Usage Restrictions

You agree NOT to:

- Use the API for any unlawful purpose or in violation of applicable laws
- Reverse-engineer, decompile, or disassemble the API
- Attempt to circumvent rate limits, authentication, or security measures
- Use the API to build a competing product or service
- Redistribute API data to third parties without authorization
- Use automated tools to scrape or bulk-download data beyond API-provided means
- Transmit malware, viruses, or harmful code through the API
- Impersonate other users or misrepresent your identity

### 4.1 AI-Specific Restrictions

The API integrates AI services (openai). Additional restrictions apply:

- Do not use AI-generated outputs to create misleading or deceptive content
- AI outputs must not be presented as human-generated without disclosure
- You must comply with the AI providers' acceptable use policies
- Acme Inc does not guarantee the accuracy of AI-generated content

## 5. Data Handling

### 5.1 Data You Send

You are responsible for ensuring you have the right to transmit any data sent through the API. Do not transmit personal data unless the API endpoint is specifically designed to process it.

### 5.2 Data You Receive

API responses may contain data subject to our Privacy Policy. You must handle received data in accordance with applicable data protection laws, including GDPR, CCPA, and other relevant regulations.

### 5.3 Payment Data

Payment-related API endpoints process sensitive financial data through stripe, stripe-ios. You must comply with PCI DSS requirements and never store raw card data on your servers.

## 6. Service Level Agreement

### 6.1 Availability

| Metric | Target |
|--------|--------|
| Monthly Uptime | 99.9% |
| API Response Time (p95) | < 500ms |
| API Response Time (p99) | < 2,000ms |
| Planned Maintenance Window | Sundays 02:00-06:00 UTC |

### 6.2 Incident Response

| Severity | Response Time | Resolution Target |
|----------|--------------|-------------------|
| P0 — Total outage | 15 minutes | 4 hours |
| P1 — Major degradation | 30 minutes | 8 hours |
| P2 — Minor degradation | 2 hours | 24 hours |
| P3 — Non-critical issue | 8 hours | 72 hours |

### 6.3 Monitoring

API health and performance are monitored via @sentry/node. Status updates are provided at our status page during incidents.

### 6.4 Exclusions

SLA does not apply during:

- Scheduled maintenance windows
- Force majeure events
- Issues caused by your integration or network
- Abuse or violation of these Terms

## 7. API Versioning & Deprecation

- The API is versioned (e.g., `/v1/`, `/v2/`)
- We provide **12 months** notice before deprecating an API version
- Breaking changes are only introduced in new major versions
- Deprecated endpoints return a `Sunset` header with the retirement date
- Migration guides are provided for major version upgrades

## 8. Intellectual Property

The API, its documentation, and all associated intellectual property are owned by Acme Inc. These Terms grant you a limited, non-exclusive, non-transferable, revocable license to use the API in accordance with these Terms.

You retain ownership of applications you build using the API. Acme Inc does not claim any rights to your application code.

## 9. Limitation of Liability

THE API IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. ACME INC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE API.

In no event shall Acme Inc's total liability exceed the fees paid by you for API access in the twelve (12) months preceding the claim.

## 10. Termination

Either party may terminate API access at any time. Acme Inc may immediately suspend or revoke your API access if you violate these Terms. Upon termination:

- You must cease all API usage
- You must delete any cached API data (unless retention is legally required)
- Provisions regarding liability, IP, and dispute resolution survive termination

## 11. Changes to These Terms

We may update these Terms from time to time. Material changes will be communicated with at least 30 days notice via email or API response headers. Continued use of the API after changes take effect constitutes acceptance.

## 12. Contact

For questions about these API Terms of Use:

- **Email:** legal@acme.com
- **Website:** https://acme-saas.com

---

*Generated by Codepliant from project analysis. This document should be reviewed by legal counsel before publishing.*
