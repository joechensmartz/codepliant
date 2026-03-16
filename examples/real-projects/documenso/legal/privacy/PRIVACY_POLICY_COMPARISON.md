# Privacy Policy Comparison

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** @documenso/root

**Organization:** [Your Company Name]

---

## Purpose

This document compares your generated privacy policy against industry standards and best practices. It identifies gaps, provides recommendations, and benchmarks against privacy policies from leading technology companies.

For questions about this comparison, contact [your-email@example.com].

---

## Coverage Score

**18 / 23 items covered (78%)**

################____ 78%

Good coverage. A few areas could be strengthened to match industry leaders.

---

## Checklist Comparison

| # | Section | Covered | Regulation | Industry Standard |
|---|---------|---------|-----------|-------------------|
| 1 | Data Controller Identity | **No** | GDPR Art. 13(1)(a) | Stripe, Vercel, Linear |
| 2 | DPO Contact Information | **No** | GDPR Art. 13(1)(b) | Stripe, Vercel, Linear |
| 3 | Types of Data Collected | Yes | GDPR Art. 13(1)(d) | Stripe, Vercel, Linear |
| 4 | Purpose of Processing | Yes | GDPR Art. 13(1)(c) | Stripe, Vercel, Linear |
| 5 | Legal Basis for Processing | Yes | GDPR Art. 13(1)(c) | Stripe, Vercel, Linear |
| 6 | Data Retention Periods | **No** | GDPR Art. 13(2)(a) | Stripe, Vercel, Linear |
| 7 | User Rights (Access, Rectification, Erasure, Portability) | Yes | GDPR Art. 13(2)(b-d) | Stripe, Vercel, Linear |
| 8 | Third-Party Data Sharing | Yes | GDPR Art. 13(1)(e-f) | Stripe, Vercel, Linear |
| 9 | International Data Transfers | Yes | GDPR Art. 13(1)(f) | Stripe, Vercel, Linear |
| 10 | Cookie Policy / Tracking Technologies | Yes | ePrivacy Directive Art. 5(3) | Stripe, Vercel, Linear |
| 11 | AI / Automated Decision-Making Disclosure | Yes | GDPR Art. 22, EU AI Act | Notion, Linear, Vercel |
| 12 | Children's Privacy (COPPA) | Yes | COPPA, GDPR Art. 8 | Stripe, Notion, GitHub |
| 13 | Security Measures | Yes | GDPR Art. 32 | Stripe, Vercel, Linear |
| 14 | Consent Collection / Withdrawal | Yes | GDPR Art. 7 | Stripe, Vercel, Linear |
| 15 | Right to Lodge a Complaint | Yes | GDPR Art. 13(2)(d) | Stripe, Vercel, Linear |
| 16 | Policy Update Notification | Yes | Best practice | Stripe, Vercel, Linear |
| 17 | Contact Information for Privacy Inquiries | **No** | GDPR Art. 13(1)(a) | Stripe, Vercel, Linear |
| 18 | CCPA-Specific Disclosures | Yes | CCPA/CPRA | Stripe, Vercel, Notion |
| 19 | Do Not Sell My Personal Information | Yes | CCPA Sec. 1798.120 | Stripe, Notion, GitHub |
| 20 | Data Breach Notification Procedures | Yes | GDPR Art. 34 | Stripe, Vercel |
| 21 | Sub-Processor List | Yes | GDPR Art. 28(2) | Stripe, Vercel, Linear |
| 22 | Data Portability | Yes | GDPR Art. 20 | Stripe, Linear, Notion |
| 23 | EU Representative | **No** | GDPR Art. 27 | Stripe, Notion |

---

## Gap Analysis

The following sections are missing or incomplete in your current privacy policy configuration:

### Data Controller Identity

- **Description:** Company name, address, and contact details of the data controller
- **Regulation:** GDPR Art. 13(1)(a)
- **Industry examples:** Stripe, Vercel, Linear, Notion
- **Recommendation:** Add this section to your privacy policy. Run `codepliant init` to set your company name and address.

### DPO Contact Information

- **Description:** Contact details for the Data Protection Officer
- **Regulation:** GDPR Art. 13(1)(b)
- **Industry examples:** Stripe, Vercel, Linear
- **Recommendation:** Add this section to your privacy policy. Add `"dpoName"` and `"dpoEmail"` to your `.codepliantrc.json`.

### Data Retention Periods

- **Description:** How long each category of data is retained
- **Regulation:** GDPR Art. 13(2)(a)
- **Industry examples:** Stripe, Vercel, Linear, Notion
- **Recommendation:** Add this section to your privacy policy. Add `"dataRetentionDays"` to your `.codepliantrc.json`.

### Contact Information for Privacy Inquiries

- **Description:** Dedicated email/form for privacy-related questions
- **Regulation:** GDPR Art. 13(1)(a)
- **Industry examples:** Stripe, Vercel, Linear, Notion, GitHub
- **Recommendation:** Add this section to your privacy policy. Run `codepliant init` to set your contact email.

### EU Representative

- **Description:** Designated representative in the EU for non-EU companies
- **Regulation:** GDPR Art. 27
- **Industry examples:** Stripe, Notion
- **Recommendation:** Add this section to your privacy policy. Add `"euRepresentative"` to your `.codepliantrc.json` if your company is outside the EU.


---

## Industry Benchmarks

How leading companies handle their privacy policies:

### Stripe

**Privacy Policy:** [https://stripe.com/privacy](https://stripe.com/privacy)

**Strengths:**

- Comprehensive sub-processor list with change notification
- Clear data flow descriptions per product
- Jurisdiction-specific addenda (EU, UK, Japan, Brazil)
- Dedicated privacy center with visual data map

**Notable Features:**

- Interactive privacy center
- Per-product data processing details
- Published DPA template
- Regular sub-processor change notifications

### Vercel

**Privacy Policy:** [https://vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)

**Strengths:**

- Clear distinction between customer data and visitor data
- Specific analytics data collection disclosure
- Edge function data processing transparency

**Notable Features:**

- Developer-friendly privacy documentation
- Clear data residency information
- Published sub-processor list

### Linear

**Privacy Policy:** [https://linear.app/privacy](https://linear.app/privacy)

**Strengths:**

- Concise yet comprehensive privacy policy
- Clear AI feature data usage disclosure
- Specific data retention periods

**Notable Features:**

- AI feature transparency
- Clear data minimization practices
- SOC 2 Type II reference

### Notion

**Privacy Policy:** [https://www.notion.so/Privacy-Policy](https://www.notion.so/Privacy-Policy)

**Strengths:**

- Detailed AI training data opt-out
- Comprehensive third-party service disclosure
- Clear data portability instructions

**Notable Features:**

- AI training data transparency
- Workspace admin controls documentation
- Data export functionality highlighted

### GitHub

**Privacy Policy:** [https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

**Strengths:**

- Extremely detailed data collection inventory
- Repository data handling specifics
- Copilot AI data usage transparency

**Notable Features:**

- Per-feature data collection breakdown
- Open-source policy approach
- Detailed telemetry disclosure

---

## Recommendations

### Priority Actions

**High Priority (regulatory requirement):**

- [ ] Add **Data Controller Identity** (GDPR Art. 13(1)(a))
- [ ] Add **DPO Contact Information** (GDPR Art. 13(1)(b))
- [ ] Add **Data Retention Periods** (GDPR Art. 13(2)(a))
- [ ] Add **Contact Information for Privacy Inquiries** (GDPR Art. 13(1)(a))

**Medium Priority (recommended):**

- [ ] Add **EU Representative** (GDPR Art. 27)


---

## Improving Your Score

To improve your privacy policy coverage, update your `.codepliantrc.json` configuration:

```json
{
  "companyName": "Your Company Name",
  "contactEmail": "privacy@yourcompany.com",
  "dpoName": "Jane Doe",
  "dpoEmail": "dpo@yourcompany.com",
  "euRepresentative": "EU Rep Name, Address",
  "dataRetentionDays": 365,
  "jurisdiction": "GDPR",
  "jurisdictions": ["GDPR", "CCPA"]
}
```

Each configured field enables additional privacy policy sections that align with regulatory requirements.

---

## Review Schedule

This comparison should be reviewed:

- **Quarterly** to track improvement progress
- **When updating** your privacy policy
- **When adding** new third-party services
- **When entering** new geographic markets

---

*This privacy policy comparison was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. This is an internal assessment tool and does not constitute legal advice. Consult with a qualified privacy attorney for compliance guidance.*