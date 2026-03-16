import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates an ACCEPTABLE_USE_POLICY.md — a standard Acceptable Use Policy
 * for SaaS applications covering prohibited uses, enforcement, and abuse reporting.
 */
export function generateAcceptableUsePolicy(
  scan: ScanResult,
  ctx?: GeneratorContext
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasStorage = scan.services.some((s) => s.category === "storage");

  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  let doc = `# Acceptable Use Policy

**Effective Date:** ${date}
**Last Updated:** ${date}

**Project:** ${scan.projectName}

---

## ${nextSection()}. Introduction

This Acceptable Use Policy ("AUP") governs your use of the products, services, and websites (collectively, the "Services") provided by ${company}. By accessing or using our Services, you agree to comply with this AUP. If you violate this policy, we may suspend or terminate your access to the Services.

This AUP is incorporated by reference into our Terms of Service. Capitalized terms not defined here have the meanings given in the Terms of Service.

## ${nextSection()}. Prohibited Uses

You may not use the Services to:

### ${sectionNum}.1 Illegal or Harmful Activities

- Violate any applicable local, state, national, or international law or regulation
- Promote or facilitate illegal activities, including fraud, money laundering, or terrorist financing
- Distribute, promote, or facilitate child sexual abuse material (CSAM)
- Engage in human trafficking or exploitation
- Sell or distribute controlled substances without proper authorization

### ${sectionNum}.2 Abusive or Disruptive Behavior

- Harass, bully, intimidate, or threaten other users
- Impersonate any person or entity, or falsely represent your affiliation with any person or entity
- Interfere with or disrupt the integrity or performance of the Services or related systems
- Attempt to gain unauthorized access to the Services, other accounts, or computer systems
- Deploy malware, viruses, worms, Trojan horses, or other harmful code
- Conduct denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks

### ${sectionNum}.3 Spam and Unsolicited Communications

- Send unsolicited bulk messages, spam, or phishing emails through the Services
- Use the Services to harvest email addresses or other personal information
- Create fake accounts or use automated tools to create multiple accounts

### ${sectionNum}.4 Intellectual Property Violations

- Infringe upon the intellectual property rights of others, including copyrights, trademarks, patents, or trade secrets
- Upload, share, or distribute content that you do not have the right to use
- Remove or alter copyright notices, watermarks, or other proprietary markings

### ${sectionNum}.5 Content Restrictions

- Upload or transmit content that is defamatory, obscene, or pornographic (unless the Service explicitly permits such content)
- Distribute content that promotes violence, discrimination, or hatred against individuals or groups
- Post false or misleading information intended to deceive others`;

  if (hasAI) {
    doc += `

### ${sectionNum}.6 AI-Specific Restrictions

- Use AI features to generate content that impersonates real individuals without their consent
- Attempt to extract, reverse-engineer, or replicate the underlying AI models
- Use AI features to generate spam, malware, phishing content, or disinformation at scale
- Submit personal data of third parties to AI features without proper consent or legal basis
- Use AI features to make automated decisions that have legal or similarly significant effects on individuals without appropriate human oversight`;
  }

  if (hasStorage) {
    doc += `

### ${sectionNum}.${hasAI ? "7" : "6"} Storage Restrictions

- Use storage services to host or distribute pirated content, warez, or illegal media
- Upload malicious files designed to exploit vulnerabilities in the Services or other users' systems
- Exceed storage quotas through abuse, circumvention of limits, or other unauthorized means
- Use storage services as a content delivery network for unrelated third-party services without authorization`;
  }

  if (hasPayment) {
    doc += `

### ${sectionNum}.${hasAI && hasStorage ? "8" : hasAI || hasStorage ? "7" : "6"} Payment and Financial Restrictions

- Use the Services for fraudulent transactions or money laundering
- Process payments for illegal goods or services
- Attempt to reverse or dispute legitimate charges fraudulently (friendly fraud)
- Use stolen financial credentials to make purchases or payments`;
  }

  doc += `

## ${nextSection()}. Resource Usage

You agree to use the Services responsibly and not to:

- Consume excessive computational resources in a manner that degrades service quality for other users
- Use automated tools (bots, scrapers, crawlers) to access the Services at a rate that exceeds normal human usage, unless explicitly permitted by our API documentation
- Circumvent rate limits, quotas, or other usage restrictions
- Resell or redistribute access to the Services without our written permission

## ${nextSection()}. Account Responsibilities

- You are responsible for all activity that occurs under your account
- You must keep your account credentials secure and not share them with unauthorized parties
- You must promptly notify us of any unauthorized access to your account
- You must provide accurate and up-to-date information when creating and maintaining your account

## ${nextSection()}. Monitoring and Enforcement

${company} reserves the right to:

- **Monitor** usage of the Services to ensure compliance with this AUP
- **Investigate** suspected violations of this AUP
- **Remove or disable** content that violates this AUP
- **Suspend or terminate** accounts that violate this AUP, with or without notice
- **Report** illegal activities to appropriate law enforcement authorities

### ${sectionNum}.1 Enforcement Actions

Violations of this AUP may result in one or more of the following actions, at our sole discretion:

| Severity | Examples | Potential Actions |
|----------|----------|-------------------|
| Minor | Accidental policy violation, first offense | Warning, content removal |
| Moderate | Repeated violations, spam, resource abuse | Temporary suspension (24-72 hours) |
| Severe | Harassment, malware distribution, fraud | Account suspension, data preservation for legal proceedings |
| Critical | CSAM, terrorism, imminent physical danger | Immediate termination, law enforcement notification |

### ${sectionNum}.2 Appeals

If your account is suspended or content is removed, you may appeal by contacting us at ${email}. Appeals will be reviewed within 5 business days. We will provide a written explanation of our decision.

## ${nextSection()}. Reporting Abuse

If you believe someone is violating this AUP, please report it to us:

- **Email:** ${email}
- **Subject line:** "AUP Violation Report"

When reporting a violation, please include:

1. Your contact information
2. Description of the violation
3. URLs or other identifying information for the offending content or account
4. Any supporting evidence (screenshots, logs, etc.)

We take all reports seriously and will investigate promptly. We will not retaliate against anyone who reports a violation in good faith.

## ${nextSection()}. Changes to This Policy

We may update this AUP from time to time. We will notify you of material changes by:

- Posting the updated policy on our website at ${website}
- Sending an email notification to the address associated with your account

Continued use of the Services after changes take effect constitutes acceptance of the updated AUP.

## ${nextSection()}. Contact

If you have questions about this Acceptable Use Policy, contact us at:

- **Email:** ${email}

---

*This Acceptable Use Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis of ${scan.projectName}. It should be reviewed by legal counsel before use.*`;

  return doc;
}
