# Compliance Glossary

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** saleor

**Organization:** [Your Company Name]

---

> This glossary defines compliance and data protection terms used throughout the compliance documentation generated for **saleor**. Terms are sourced from GDPR, CCPA/CPRA, EU AI Act, SOC 2, ISO 27001, PCI DSS, HIPAA, and general data protection standards.

*51 terms defined based on 6 detected services.*

---

## Abbreviations Quick Reference

| Abbreviation | Full Term | Source |
|-------------|-----------|--------|
| **BCRs** | Binding Corporate Rules | GDPR Art. 47 |
| **BAA** | Business Associate Agreement | HIPAA §164.502(e), §164.504(e) |
| **CCPA** | California Consumer Privacy Act | CCPA §1798.100-199 |
| **CPRA** | California Privacy Rights Act | CPRA (Proposition 24) |
| **CDE** | Cardholder Data Environment | PCI DSS v4.0 |
| **DPA** | Data Processing Agreement | GDPR Art. 28 |
| **DPIA** | Data Protection Impact Assessment | GDPR Art. 35 |
| **DPO** | Data Protection Officer | GDPR Art. 37-39 |
| **DSAR** | Data Subject Access Request | GDPR Art. 15-22 |
| **DNS** | Do Not Sell or Share | CCPA §1798.120, CPRA |
| **HIPAA** | Health Insurance Portability and Accountability Act | HIPAA (45 CFR Parts 160, 164) |
| **IRP** | Incident Response Plan | NIST SP 800-61 / GDPR Art. 33 |
| **ISMS** | Information Security Management System | ISO/IEC 27001:2022 |
| **LI** | Legitimate Interest | GDPR Art. 6(1)(f) |
| **MFA** | Multi-Factor Authentication | NIST SP 800-63B |
| **PCI DSS** | Payment Card Industry Data Security Standard | PCI SSC, PCI DSS v4.0 |
| **PD** | Personal Data | GDPR Art. 4(1) |
| **PoLP** | Principle of Least Privilege | NIST SP 800-53 / ISO 27001 A.9.4 |
| **PbD** | Privacy by Design | GDPR Art. 25 |
| **PIA** | Privacy Impact Assessment | GDPR Art. 35 / ISO 29134 |
| **PHI** | Protected Health Information | HIPAA §160.103 |
| **ROPA** | Record of Processing Activities | GDPR Art. 30 |
| **RTBF** | Right to Erasure | GDPR Art. 17 |
| **RTP** | Risk Treatment Plan | ISO/IEC 27001:2022 §6.1.3 |
| **RBAC** | Role-Based Access Control | NIST SP 800-162 / ISO 27001 A.9 |
| **SCCs** | Standard Contractual Clauses | GDPR Art. 46(2)(c) |
| **SoA** | Statement of Applicability | ISO/IEC 27001:2022 §6.1.3 |
| **SA / DPA** | Supervisory Authority | GDPR Art. 51 |
| **TSC** | Trust Services Criteria | AICPA TSP Section 100 |
| **VRA** | Vendor Risk Assessment | ISO 27001 Annex A.15 / NIST CSF |
| **ZTA** | Zero Trust Architecture | NIST SP 800-207 |

---

## Full Glossary


### B


**Binding Corporate Rules (BCRs)**
> Internal policies adopted by multinational companies to allow intra-group transfers of personal data outside the EU/EEA, approved by a supervisory authority.
> *Source: GDPR Art. 47*


**Breach Notification**
> The obligation to report personal data breaches to the supervisory authority within 72 hours of becoming aware, and to affected data subjects without undue delay when the breach poses a high risk.
> *Source: GDPR Art. 33-34*


**Business Associate Agreement (BAA)**
> A contract between a HIPAA-covered entity and a business associate that establishes the permitted uses and disclosures of protected health information.
> *Source: HIPAA §164.502(e), §164.504(e)*


### C


**California Consumer Privacy Act (CCPA)**
> A California state law granting consumers the right to know what personal information is collected, to delete it, to opt out of its sale, and to non-discrimination for exercising these rights.
> *Source: CCPA §1798.100-199*


**California Privacy Rights Act (CPRA)**
> An amendment to CCPA that strengthens consumer privacy rights, creates the California Privacy Protection Agency (CPPA), and introduces the concept of 'sensitive personal information.'
> *Source: CPRA (Proposition 24)*


**Cardholder Data Environment (CDE)**
> The network segment where payment card data is stored, processed, or transmitted, plus any connected systems that could affect its security.
> *Source: PCI DSS v4.0*


**Consent**
> A freely given, specific, informed, and unambiguous indication of the data subject's wishes by which they agree to the processing of their personal data.
> *Source: GDPR Art. 4(11), Art. 7*


### D


**Data Breach**
> A security incident leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to personal data.
> *Source: GDPR Art. 4(12)*


**Data Controller**
> The entity that determines the purposes and means of processing personal data. The controller bears primary responsibility for compliance.
> *Source: GDPR Art. 4(7)*


**Data Minimisation**
> The principle that personal data collected must be adequate, relevant, and limited to what is necessary for the purposes of processing.
> *Source: GDPR Art. 5(1)(c)*


**Data Processing Agreement (DPA)**
> A legally binding contract between a data controller and data processor that governs the processing of personal data, including security measures, sub-processing, and data subject rights.
> *Source: GDPR Art. 28*


**Data Processor**
> An entity that processes personal data on behalf of the controller. Processors must act only on the controller's documented instructions.
> *Source: GDPR Art. 4(8)*


**Data Protection Impact Assessment (DPIA)**
> A systematic assessment of the necessity, proportionality, and risks of data processing operations, required before processing likely to result in high risk to individuals.
> *Source: GDPR Art. 35*


**Data Protection Officer (DPO)**
> An independent expert appointed to oversee data protection strategy and compliance. Required for public authorities and organizations conducting large-scale systematic monitoring.
> *Source: GDPR Art. 37-39*


**Data Retention Policy**
> A policy defining how long different categories of data are stored, the criteria for retention periods, and the procedures for secure deletion or anonymisation when retention periods expire.
> *Source: GDPR Art. 5(1)(e), Art. 13(2)(a)*


**Data Subject Access Request (DSAR)**
> A request made by an individual to obtain confirmation of whether their personal data is being processed, access to that data, and supplementary information about the processing.
> *Source: GDPR Art. 15-22*


**Do Not Sell or Share (DNS)**
> A consumer's right under CCPA/CPRA to direct a business not to sell or share their personal information with third parties.
> *Source: CCPA §1798.120, CPRA*


### E


**Encryption at Rest**
> Cryptographic protection applied to data while it is stored (on disk, in databases, backups), preventing unauthorized access even if storage media is compromised.
> *Source: NIST SP 800-111 / GDPR Art. 32*


**Encryption in Transit**
> Cryptographic protection applied to data while it is being transmitted over networks (TLS/HTTPS), preventing interception or tampering.
> *Source: NIST SP 800-52 / GDPR Art. 32*


### H


**Health Insurance Portability and Accountability Act (HIPAA)**
> A US federal law establishing standards for protecting sensitive patient health information from disclosure without patient consent or knowledge.
> *Source: HIPAA (45 CFR Parts 160, 164)*


### I


**Incident Response Plan (IRP)**
> A documented set of procedures for detecting, containing, analyzing, remediating, and reporting security incidents, including data breaches.
> *Source: NIST SP 800-61 / GDPR Art. 33*


**Information Security Management System (ISMS)**
> A systematic framework of policies, procedures, and controls to manage information security risks and protect the confidentiality, integrity, and availability of information assets.
> *Source: ISO/IEC 27001:2022*


### L


**Lawful Basis**
> One of six legal grounds under GDPR that must be established before processing personal data: consent, contract, legal obligation, vital interests, public task, or legitimate interests.
> *Source: GDPR Art. 6*


**Legitimate Interest (LI)**
> A lawful basis for processing where the controller's or a third party's interests are balanced against the data subject's rights and freedoms.
> *Source: GDPR Art. 6(1)(f)*


### M


**Multi-Factor Authentication (MFA)**
> An authentication method requiring two or more independent verification factors: something you know (password), something you have (device), or something you are (biometric).
> *Source: NIST SP 800-63B*


### P


**Payment Card Industry Data Security Standard (PCI DSS)**
> A set of security standards for organizations that handle credit card information, requiring secure network architecture, cardholder data protection, vulnerability management, access control, and monitoring.
> *Source: PCI SSC, PCI DSS v4.0*


**Personal Data (PD)**
> Any information relating to an identified or identifiable natural person ('data subject'), including names, emails, IP addresses, location data, and online identifiers.
> *Source: GDPR Art. 4(1)*


**Principle of Least Privilege (PoLP)**
> The security principle that users and systems should be granted only the minimum level of access necessary to perform their required functions.
> *Source: NIST SP 800-53 / ISO 27001 A.9.4*


**Privacy by Default**
> The requirement that, by default, only personal data necessary for each specific purpose is processed, including limiting collection, processing extent, storage period, and accessibility.
> *Source: GDPR Art. 25(2)*


**Privacy by Design (PbD)**
> The principle that data protection should be integrated into system design and business practices from the outset, rather than added retrospectively.
> *Source: GDPR Art. 25*


**Privacy Impact Assessment (PIA)**
> A broader risk assessment examining how a project or system may affect the privacy of individuals. Often used interchangeably with DPIA but may be conducted earlier in the project lifecycle.
> *Source: GDPR Art. 35 / ISO 29134*


**Protected Health Information (PHI)**
> Any individually identifiable health information held or transmitted by a covered entity or business associate, in any form or medium.
> *Source: HIPAA §160.103*


**Pseudonymisation**
> Processing personal data so it can no longer be attributed to a specific data subject without additional information, provided that additional information is kept separately.
> *Source: GDPR Art. 4(5)*


**Purpose Limitation**
> The principle that personal data must be collected for specified, explicit, and legitimate purposes and not further processed in a manner incompatible with those purposes.
> *Source: GDPR Art. 5(1)(b)*


### R


**Record of Processing Activities (ROPA)**
> A documented register of all processing activities carried out by the controller or processor, including purposes, data categories, recipients, retention periods, and security measures.
> *Source: GDPR Art. 30*


**Right to Data Portability**
> The right of data subjects to receive their personal data in a structured, commonly used, and machine-readable format, and to transmit it to another controller.
> *Source: GDPR Art. 20*


**Right to Erasure (RTBF)**
> The right of data subjects to have their personal data deleted when it is no longer necessary, consent is withdrawn, or processing is unlawful. Also known as the 'right to be forgotten.'
> *Source: GDPR Art. 17*


**Risk Treatment Plan (RTP)**
> A document defining the actions, resources, responsibilities, and timelines for addressing identified information security risks.
> *Source: ISO/IEC 27001:2022 §6.1.3*


**Role-Based Access Control (RBAC)**
> An access control method where permissions are assigned to roles rather than individual users, ensuring users only have access necessary for their job function.
> *Source: NIST SP 800-162 / ISO 27001 A.9*


### S


**Sale of Personal Information**
> Under CCPA/CPRA, selling, renting, releasing, disclosing, or otherwise communicating a consumer's personal information to a third party for monetary or other valuable consideration.
> *Source: CCPA §1798.140(ad)*


**SOC 2 Type I**
> A report on the design and implementation of an organization's controls relevant to security, availability, processing integrity, confidentiality, or privacy at a specific point in time.
> *Source: AICPA TSP Section 100*


**SOC 2 Type II**
> A report on the design, implementation, and operating effectiveness of controls over a specified period of time (typically 6-12 months).
> *Source: AICPA TSP Section 100*


**Standard Contractual Clauses (SCCs)**
> Pre-approved contractual terms adopted by the European Commission to ensure adequate safeguards for personal data transferred outside the EU/EEA.
> *Source: GDPR Art. 46(2)(c)*


**Statement of Applicability (SoA)**
> A document that identifies which ISO 27001 Annex A controls are applicable to the organization and justifies any exclusions.
> *Source: ISO/IEC 27001:2022 §6.1.3*


**Storage Limitation**
> The principle that personal data must be kept for no longer than necessary for the purposes of processing.
> *Source: GDPR Art. 5(1)(e)*


**Sub-Processor**
> A third-party entity engaged by a data processor to carry out specific processing activities on behalf of the data controller. The processor must obtain authorization before engaging sub-processors.
> *Source: GDPR Art. 28(2)*


**Supervisory Authority (SA / DPA)**
> An independent public authority established by an EU member state to monitor the application of data protection law (e.g., CNIL in France, ICO in the UK).
> *Source: GDPR Art. 51*


### T


**Tokenisation**
> The process of substituting sensitive data (such as credit card numbers) with a non-sensitive equivalent (token) that has no exploitable value.
> *Source: PCI DSS / NIST*


**Trust Services Criteria (TSC)**
> Five categories — Security, Availability, Processing Integrity, Confidentiality, and Privacy — used to evaluate an organization's controls in a SOC 2 audit.
> *Source: AICPA TSP Section 100*


### V


**Vendor Risk Assessment (VRA)**
> A systematic evaluation of the security, privacy, and compliance risks posed by third-party vendors and service providers before and during engagement.
> *Source: ISO 27001 Annex A.15 / NIST CSF*


### Z


**Zero Trust Architecture (ZTA)**
> A security model based on the principle 'never trust, always verify' where no user, device, or network is inherently trusted, and continuous verification is required.
> *Source: NIST SP 800-207*


---

## Applicable Regulatory Frameworks

The following regulatory frameworks may apply to **saleor** based on the detected services and data processing activities:

- **GDPR** — General Data Protection Regulation (EU/EEA) — Applies to processing of personal data of EU residents
- **CCPA/CPRA** — California Consumer Privacy Act / California Privacy Rights Act — Applies to businesses handling California residents' data
- **PCI DSS** — Payment Card Industry Data Security Standard — Required for all entities that store, process, or transmit cardholder data
- **SOC 2** — Service Organization Control 2 — Trust-based audit framework for service providers storing customer data in the cloud
- **ISO 27001** — International standard for information security management systems (ISMS)
- **HIPAA** — Health Insurance Portability and Accountability Act — Required for entities handling protected health information (PHI)

---

## How to Use This Glossary

1. **During document review** — Reference this glossary when reviewing any generated compliance document to ensure consistent understanding of terms
2. **Onboarding** — Share with new team members joining the compliance or engineering team
3. **Stakeholder communication** — Use as a reference when explaining compliance obligations to non-technical stakeholders
4. **Audit preparation** — Provide to auditors alongside your compliance documentation to demonstrate organizational awareness

---

## Maintaining This Glossary

- **Review frequency:** Annually, or whenever new regulations come into effect
- **Ownership:** Data Protection Officer / Compliance Team
- **Update process:** Re-run Codepliant to regenerate from current codebase; new terms are added automatically when new service categories are detected

---

*This glossary was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Definitions are based on official regulatory texts and industry standards. Consult qualified legal counsel for authoritative interpretations.*