# Privacy Impact Screening

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


---

> **Organization:** [Your Company Name]  
> **Assessor:** [Data Protection Officer Name] ([your-email@example.com])  
> **Date:** 2026-03-16  
> **Services Scanned:** 23

> **Disclaimer:** This screening questionnaire is auto-generated from code analysis and provides initial guidance only. A qualified Data Protection Officer or privacy professional should review and finalize this assessment. Consult legal counsel before making DPIA determinations.

## Screening Result

**FULL DPIA RECOMMENDED**

This screening identified **6 trigger(s)** out of 10 criteria. Under GDPR Article 35 and WP29 guidelines, processing that meets two or more criteria from the screening list generally requires a full Data Protection Impact Assessment.

## Screening Questions

| # | Question | Answer | Auto-Filled | DPIA Trigger |
| --- | --- | --- | --- | --- |
| Q1 | Does the processing involve systematic monitoring of individuals (e.g., tracking, profiling, CCTV)? | **Yes** | Yes | Yes |
| Q2 | Does the processing involve automated decision-making with legal or significant effects on individuals? | **No** | Yes | — |
| Q3 | Does the processing involve special category data (health, biometric, racial/ethnic origin, political opinions, religious beliefs, genetic data)? | **Unknown** | No | — |
| Q4 | Is the processing carried out on a large scale (high volume of data subjects or large geographic area)? | **Yes** | Yes | Yes |
| Q5 | Does the processing involve data of vulnerable individuals (children, elderly, patients, employees)? | **Unknown** | No | — |
| Q6 | Does the processing use innovative or new technological solutions? | **Unknown** | No | — |
| Q7 | Does the processing involve transferring personal data outside the EEA/UK? | **Yes** | Yes | Yes |
| Q8 | Does the processing involve combining or matching data from multiple sources? | **Yes** | Yes | Yes |
| Q9 | Could the processing prevent individuals from exercising a right, using a service, or entering a contract? | **Yes** | Yes | Yes |
| Q10 | Does the processing involve tracking individuals' location or movement? | **Yes** | Yes | Yes |

## Detailed Rationale

### Q1: Does the processing involve systematic monitoring of individuals (e.g., tracking, profiling, CCTV)?

**Answer:** Yes (auto-filled from scan)

Detected analytics/advertising and monitoring services that may involve systematic monitoring.

### Q2: Does the processing involve automated decision-making with legal or significant effects on individuals?

**Answer:** No (auto-filled from scan)

No AI/ML services detected.

### Q3: Does the processing involve special category data (health, biometric, racial/ethnic origin, political opinions, religious beliefs, genetic data)?

**Answer:** Unknown (manual review needed)

No special category data explicitly detected. Manual review recommended.

### Q4: Is the processing carried out on a large scale (high volume of data subjects or large geographic area)?

**Answer:** Yes (auto-filled from scan)

23 services detected, suggesting potentially large-scale processing.

### Q5: Does the processing involve data of vulnerable individuals (children, elderly, patients, employees)?

**Answer:** Unknown (manual review needed)

This requires manual assessment. Check if your user base includes children (COPPA/GDPR Art. 8) or other vulnerable groups.

### Q6: Does the processing use innovative or new technological solutions?

**Answer:** Unknown (manual review needed)

No clearly innovative technology detected, but manual review recommended.

### Q7: Does the processing involve transferring personal data outside the EEA/UK?

**Answer:** Yes (auto-filled from scan)

Multiple third-party services detected; many SaaS providers process data in the US or other non-EEA countries.

### Q8: Does the processing involve combining or matching data from multiple sources?

**Answer:** Yes (auto-filled from scan)

23 services with database storage detected, suggesting data from multiple sources may be combined.

### Q9: Could the processing prevent individuals from exercising a right, using a service, or entering a contract?

**Answer:** Yes (auto-filled from scan)

Payment or authentication services detected that may gate access to services.

### Q10: Does the processing involve tracking individuals' location or movement?

**Answer:** Yes (auto-filled from scan)

Location or geolocation data types detected.

## Next Steps

1. **Conduct a full DPIA** — Use the PIA (Privacy Impact Assessment) template in `legal/PIA.md`
2. **Document the assessment** — Record findings in the Privacy Impact Register (`legal/PRIVACY_IMPACT_REGISTER.md`)
3. **Consult the DPO** — Review findings with your Data Protection Officer
4. **Implement mitigations** — Address identified risks before proceeding with processing
5. **Supervisory authority consultation** — If high risks remain after mitigation, consult your data protection authority (GDPR Art. 36)

## Data Types Detected

The following data types were identified across all detected services:

- application data
- billing address
- cache data
- cached data
- calendar data
- call recordings
- company data
- contact information
- conversations
- custom events
- deal information
- device information
- device tokens
- email
- email addresses
- email content
- email data
- engagement history
- error data
- feature flag usage
- google profile data
- ip address
- location data
- name
- names
- notification content
- oauth tokens
- page views
- payment information
- performance profiles
- phone numbers
- profile information
- profile picture
- push subscription endpoints
- referrer data
- session data
- session recordings
- sms message content
- stack traces
- third-party tag data
- transaction history
- user behavior
- user context
- user data as defined in schema
- user data via google apis
- user profiles
- user records
- voice call metadata

## Services Assessed

| Service | Category | Data Collected |
| --- | --- | --- |
| @hubspot/api-client | other | contact information, email addresses, names, phone numbers, company data, deal information, engagement history |
| @sendgrid/mail | email | email addresses, email content |
| @sentry/nextjs | monitoring | error data, stack traces, user context, device information, IP address, performance profiles |
| @upstash/redis | database | cached data, session data |
| Google Analytics | analytics | page views, user behavior, device information, IP address, location data |
| Google Tag Manager | analytics | page views, user behavior, custom events, device information, third-party tag data |
| google-auth-library | auth | OAuth tokens, Google profile data, email |
| googleapis | other | user data via Google APIs, calendar data, email data, profile information |
| intercom | other | user profiles, email, name, conversations, user behavior, company data |
| ioredis | database | cached data, session data |
| next-auth | auth | email, name, profile picture, OAuth tokens, session data |
| nodemailer | email | email addresses, email content |
| passport | auth | email, name, OAuth tokens, session data |
| Plausible Analytics | analytics | page views, referrer data, device information |
| PostgreSQL | database | application data, user records |
| PostgreSQL (env) | database | application data, user records |
| posthog | analytics | user behavior, session recordings, feature flag usage, device information |
| prisma | database | user data as defined in schema |
| Redis | database | session data, cache data |
| Redis (env) | database | session data, cache data |
| stripe | payment | payment information, billing address, email, transaction history |
| twilio | other | phone numbers, SMS message content, voice call metadata, call recordings |
| web-push | other | push subscription endpoints, device tokens, notification content |

---

*Generated by Codepliant on 2026-03-16. This screening is based on GDPR Article 35, WP29 Guidelines on DPIAs (wp248rev.01), and ICO guidance. It should be reviewed by a qualified privacy professional.*
