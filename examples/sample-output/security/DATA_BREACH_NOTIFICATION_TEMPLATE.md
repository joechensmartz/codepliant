# Data Breach Notification Templates

> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Organization:** Acme Inc

This document provides pre-filled notification templates for reporting personal data breaches to supervisory authorities, affected individuals, and regulatory bodies. Templates are organized by jurisdiction and should be customized for each specific incident.

> **Instructions:** Replace all bracketed fields (e.g., `[DATE]`, `[DESCRIPTION]`) with incident-specific details before sending. Fields marked with `[REQUIRED]` must be completed for the notification to be legally compliant.

## Table of Contents

1. [EU/EEA — Supervisory Authority Notification (GDPR Art. 33)](#1-eueea--supervisory-authority-notification-gdpr-art-33)
2. [EU/EEA — Individual Notification (GDPR Art. 34)](#2-eueea--individual-notification-gdpr-art-34)
3. [UK — ICO Breach Notification (UK GDPR)](#3-uk--ico-breach-notification-uk-gdpr)
4. [Incident Log Template](#4-incident-log-template)

## 1. EU/EEA — Supervisory Authority Notification (GDPR Art. 33)

**Deadline:** Within 72 hours of becoming aware of the breach.

```
PERSONAL DATA BREACH NOTIFICATION TO SUPERVISORY AUTHORITY
==========================================================
(Pursuant to Article 33 of Regulation (EU) 2016/679 — GDPR)

SECTION 1: REPORTING ORGANIZATION
----------------------------------
Organization Name:        Acme Inc
Data Protection Officer:  Jane Mueller
DPO Email:                dpo@acme-saas.com
Organization Website:     https://acme-saas.com
Contact Email:            legal@acme.com
Registration Number:      [COMPANY REGISTRATION NUMBER]

SECTION 2: BREACH DETAILS
-------------------------
Date breach discovered:   [DATE] [REQUIRED]
Date breach occurred:     [DATE OR "UNKNOWN"]
Date of this report:      [DATE] [REQUIRED]

If reporting after 72 hours, reason for delay:
[EXPLANATION] [REQUIRED IF LATE]

SECTION 3: NATURE OF THE BREACH
-------------------------------
Type of breach (select all that apply):
  [ ] Confidentiality breach (unauthorized disclosure or access)
  [ ] Integrity breach (unauthorized alteration of data)
  [ ] Availability breach (loss of access or destruction of data)

Description of the breach:
[DESCRIPTION] [REQUIRED]

SECTION 4: DATA AND DATA SUBJECTS AFFECTED
-------------------------------------------
Categories of data subjects affected:
  [ ] Customers/Users
  [ ] Employees
  [ ] Partners/Vendors
  [ ] Other: [SPECIFY]

Approximate number of data subjects: [NUMBER] [REQUIRED]
Approximate number of records:       [NUMBER] [REQUIRED]

Categories of personal data affected:
  [x] Personal Identity Data
  [x] Financial Data
  [x] Usage & Behavioral Data
  [x] AI Interaction Data
  [x] Communication Data
  [x] Technical & Diagnostic Data
  [x] Stored User Data
  [x] Contact Information
  [x] Authentication Data
  [ ] Names and contact details
  [ ] Email addresses
  [ ] Financial/payment data
  [ ] Authentication credentials
  [ ] Health data (special category)
  [ ] Location data
  [ ] Other: [DATA AFFECTED]

SECTION 5: LIKELY CONSEQUENCES
------------------------------
[DESCRIPTION OF LIKELY CONSEQUENCES FOR DATA SUBJECTS] [REQUIRED]

SECTION 6: MEASURES TAKEN
-------------------------
Measures taken to address the breach:
[MEASURES TAKEN] [REQUIRED]

Measures taken to mitigate adverse effects on data subjects:
[MEASURES TAKEN]

SECTION 7: CROSS-BORDER CONSIDERATIONS
---------------------------------------
Does this breach affect data subjects in other EU/EEA member states?
  [ ] Yes — List member states: [COUNTRIES]
  [ ] No
  [ ] Unknown at this time

Has this breach been reported to other supervisory authorities?
  [ ] Yes — Specify: [AUTHORITIES]
  [ ] No
```

## 2. EU/EEA — Individual Notification (GDPR Art. 34)

**Required when:** The breach is likely to result in a high risk to the rights and freedoms of natural persons.

**Deadline:** Without undue delay.

```
Subject: Security Incident Notification — Acme Inc

Dear [RECIPIENT NAME],

We are writing to inform you about a personal data breach at Acme Inc that may affect your personal data. We take this matter very seriously and are providing this notice in accordance with Article 34 of the General Data Protection Regulation (GDPR).

WHAT HAPPENED
-------------
On [DATE], we discovered that [DESCRIPTION].

WHAT DATA WAS AFFECTED
----------------------
The following types of your personal data may have been affected:
[DATA AFFECTED]

WHAT WE ARE DOING
------------------
[MEASURES TAKEN]

WHAT YOU CAN DO
----------------
We recommend you take the following steps:
- Change your password for your account and any other accounts where
  you use the same password
- Enable two-factor authentication if not already active
- Monitor your accounts for any suspicious activity
- Be cautious of phishing emails that reference this incident

CONTACT US
----------
Our Data Protection Officer, Jane Mueller, is available to answer
your questions:
  Email: dpo@acme-saas.com
  Web:   https://acme-saas.com

You also have the right to lodge a complaint with your local
data protection supervisory authority.

We sincerely apologize for this incident.

Sincerely,
Acme Inc
```

## 3. UK — ICO Breach Notification (UK GDPR)

**Deadline:** Within 72 hours of becoming aware. Report to the Information Commissioner's Office (ICO).

**Reporting portal:** https://ico.org.uk/make-a-complaint/data-protection-complaints/data-protection-complaints/

```
PERSONAL DATA BREACH REPORT — UK INFORMATION COMMISSIONER'S OFFICE
===================================================================

Organization:             Acme Inc
DPO / Contact Person:     Jane Mueller (dpo@acme-saas.com)
UK Registration Number:   [ICO REGISTRATION NUMBER]

Date breach discovered:   [DATE] [REQUIRED]
Date breach occurred:     [DATE OR "UNKNOWN"]

Nature of the breach:
[DESCRIPTION] [REQUIRED]

Data subjects affected:   [NUMBER] [REQUIRED]
Records affected:         [NUMBER] [REQUIRED]

Categories of personal data:
[DATA AFFECTED] [REQUIRED]

Likely consequences:
[DESCRIPTION]

Measures taken or proposed:
[MEASURES TAKEN] [REQUIRED]

Has this breach been reported to any other authority?
[YES/NO — IF YES, SPECIFY]
```

## 4. Incident Log Template

Use this template to maintain an internal log of all data breach incidents, as required by GDPR Article 33(5).

| Field | Details |
|-------|---------|
| **Incident ID** | [UNIQUE ID] |
| **Date discovered** | [DATE] |
| **Date occurred** | [DATE] |
| **Reported by** | [NAME / ROLE] |
| **Description** | [DESCRIPTION] |
| **Data types affected** | [DATA AFFECTED] |
| **Number of records** | [NUMBER] |
| **Number of data subjects** | [NUMBER] |
| **Severity** | [ ] Critical [ ] High [ ] Medium [ ] Low |
| **Authority notified** | [ ] Yes — [DATE] [ ] No — [REASON] |
| **Individuals notified** | [ ] Yes — [DATE] [ ] No — [REASON] |
| **Measures taken** | [MEASURES TAKEN] |
| **Root cause** | [DESCRIPTION] |
| **Status** | [ ] Open [ ] Contained [ ] Resolved [ ] Closed |

## Related Documents

- Incident Response Plan (`INCIDENT_RESPONSE_PLAN.md`)
- Security Policy (`SECURITY.md`)

---

*These notification templates were generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on an automated scan of the **nextjs-saas-example** codebase. They must be reviewed and approved by your legal team before use. Notification requirements vary by jurisdiction — consult local counsel to ensure compliance with applicable breach notification laws.*
