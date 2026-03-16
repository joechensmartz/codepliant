# Lawful Basis Assessment

> **[Your Company Name]** — GDPR Article 6 Lawful Basis Assessment
>
> Generated on 2026-03-16 by [Codepliant](https://github.com/joechensmartz/codepliant)
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## 1. Controller Information

| Field | Details |
|-------|---------|
| **Data Controller** | [Your Company Name] |
| **Contact Email** | [your-email@example.com] |
| **Data Protection Officer** | [Data Protection Officer Name] |
| **DPO Email** | [your-email@example.com] |
| **Assessment Date** | 2026-03-16 |

## 2. Lawful Basis Summary

| Processing Activity | Lawful Basis | GDPR Article | Requires LIA |
|---------------------|-------------|-------------|-------------|
| File Storage | Contract performance | Art. 6(1)(b) | No |
| other | Legitimate interest | Art. 6(1)(f) | Yes |
| User Authentication | Contract performance | Art. 6(1)(b) | No |
| Data Storage | Contract performance | Art. 6(1)(b) | No |
| Payment Processing | Contract performance / Legal obligation | Art. 6(1)(b) / Art. 6(1)(c) | No |

## 3. Detailed Assessments

### 3.1. File Storage

**Services:** boto3

**Data processed:** uploaded files, file metadata

**Lawful basis:** Contract performance (Art. 6(1)(b))

**Reasoning:**

File storage processing is necessary to provide the storage service that the user has contracted for. The user explicitly uploads files with the expectation that they will be stored and retrievable. This is a core part of the service agreement.

### 3.2. other

**Services:** Django Channels

**Data processed:** real-time user data, connection metadata, channel group data, WebSocket messages

**Lawful basis:** Legitimate interest (Art. 6(1)(f))

**Reasoning:**

Processing serves the legitimate interest of providing and improving the service.

> A Legitimate Interest Assessment (LIA) is recommended for this processing activity. See Section 4 below.

### 3.3. User Authentication

**Services:** django-admin, django-sessions

**Data processed:** admin panel access, staff user accounts, session cookies, CSRF tokens

**Lawful basis:** Contract performance (Art. 6(1)(b))

**Reasoning:**

User authentication is necessary for the performance of the contract between the data controller and the data subject. Without processing login credentials and session data, the service cannot identify the user or provide access to their account. This processing is directly linked to the service the user has agreed to use.

### 3.4. Data Storage

**Services:** redis

**Data processed:** cached data, session data

**Lawful basis:** Contract performance (Art. 6(1)(b))

**Reasoning:**

Database storage of user data is necessary to operate the service the user has agreed to use. Without persistent data storage, the service cannot function. Data stored is directly provided by or generated for the user as part of normal service operation.

### 3.5. Payment Processing

**Services:** stripe

**Data processed:** payment information, billing address, email, transaction history

**Lawful basis:** Contract performance / Legal obligation (Art. 6(1)(b) / Art. 6(1)(c))

**Reasoning:**

Payment processing is necessary to fulfill the contractual obligation of delivering paid services or goods. Additionally, retention of transaction records is required under tax and accounting regulations (legal obligation). Payment card data is tokenized and processed by PCI DSS-compliant processors, minimizing the controller's exposure.

## 4. Legitimate Interest Assessments (LIA)

Under GDPR Art. 6(1)(f), processing based on legitimate interest requires a three-part test. The following assessments should be completed for each processing activity relying on this basis.

### 4.1. LIA: other

#### Part 1: Purpose Test — Identify the legitimate interest

| Question | Answer |
|----------|--------|
| What is the purpose of the processing? | Supporting service operations and improvement |
| Is there a genuine need for this processing? | [Yes/No — provide justification] |
| Who benefits from the processing? | Both the controller and data subjects |
| Would the processing be considered unethical or unlawful in any way? | No — the processing is standard industry practice |

#### Part 2: Necessity Test — Is the processing necessary?

| Question | Answer |
|----------|--------|
| Is this the least intrusive way to achieve the purpose? | [Assess whether less intrusive alternatives exist] |
| Could the same result be achieved without processing personal data? | [Assess whether anonymization is feasible] |
| Is the data collected proportionate to the purpose? | [Confirm data minimization] |

#### Part 3: Balancing Test — Do data subject rights override?

| Factor | Assessment |
|--------|------------|
| Nature of the data | Standard personal data — not special category |
| Reasonable expectations of the data subject | [Assess data subject expectations] |
| Likely impact on the data subject | [Assess — low/medium/high] |
| Status of the data subject (e.g., children, vulnerable) | Not specifically targeting vulnerable individuals |
| Safeguards in place | [List safeguards — encryption, access controls, retention limits] |
| Opt-out mechanism available | [Describe opt-out mechanism] |

#### LIA Conclusion

- [ ] The legitimate interest is valid and clearly identified
- [ ] The processing is necessary and proportionate
- [ ] The data subject's rights do not override the legitimate interest
- [ ] Adequate safeguards are in place
- [ ] An opt-out mechanism is available

**Decision:** [Approved / Rejected / Needs further review]
**Reviewed by:** [Name and role]
**Review date:** [Date]

## 5. Review Schedule

This assessment must be reviewed:

- **Annually** — Full review of all lawful basis determinations
- **On change** — When new processing activities are introduced
- **On regulatory update** — When relevant guidance changes
- **On complaint** — Following any data subject complaint about processing

## Review Notes

### What a lawyer should check

- Validate each lawful basis selection against the specific processing context
- Complete all LIA templates with specific factual assessments
- Verify consent mechanisms meet GDPR requirements
- Confirm Art. 6(1)(b) claims are truly necessary for contract performance
- Review whether any processing requires a DPIA under Art. 35

### Auto-generated vs. needs human input

| Section | Status | Confidence |
|---------|--------|------------|
| Processing activities list | Auto-detected from code | High |
| Lawful basis selection | Auto-assigned defaults | Low — requires legal validation |
| Detailed reasoning | Template reasoning | Medium — needs context-specific review |
| LIA templates | Structure only — needs completion | Low |
| Consent requirements | Checklist only | Medium |

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Data Subject Categories (`DATA_SUBJECT_CATEGORIES.md`)
- Record of Processing Activities (`RECORD_OF_PROCESSING_ACTIVITIES.md`)
- Privacy Impact Assessment (`PRIVACY_IMPACT_ASSESSMENT.md`)
- Consent Management Guide (`CONSENT_MANAGEMENT_GUIDE.md`)

---

*This Lawful Basis Assessment was auto-generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis. Lawful basis determinations are preliminary and must be reviewed by qualified legal counsel. All LIA templates must be completed with specific factual assessments before relying on legitimate interest.*
