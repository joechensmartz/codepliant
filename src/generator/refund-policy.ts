import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a REFUND_POLICY.md when payment services are detected.
 * Covers refund terms, refund process, timelines, and exceptions.
 */
export function generateRefundPolicy(
  scan: ScanResult,
  ctx?: GeneratorContext
): string | null {
  const hasPayment = scan.services.some((s) => s.category === "payment");

  if (!hasPayment) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const jurisdiction = ctx?.jurisdiction || "[Your Jurisdiction]";
  const date = new Date().toISOString().split("T")[0];

  const paymentServices = scan.services.filter((s) => s.category === "payment");
  const paymentProviderNames = paymentServices.map((s) => s.name).join(", ");

  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  let doc = `# Refund Policy

**Effective Date:** ${date}
**Last Updated:** ${date}

**Project:** ${scan.projectName}

---

## ${nextSection()}. Overview

This Refund Policy explains the terms and conditions under which ${company} provides refunds for purchases made through our Services. We are committed to ensuring customer satisfaction while maintaining fair and transparent business practices.

Payments are processed through: ${paymentProviderNames}.

## ${nextSection()}. Eligibility for Refunds

### ${sectionNum}.1 Subscription Services

- **Monthly subscriptions:** You may request a full refund within 14 days of your initial purchase or renewal. After 14 days, refunds are issued on a pro-rata basis for the unused portion of the current billing period.
- **Annual subscriptions:** You may request a full refund within 30 days of your initial purchase. After 30 days, refunds are issued on a pro-rata basis for the unused portion of the current billing period, minus a 10% early termination fee.
- **Free trial conversions:** If you are charged after a free trial and did not intend to continue, you may request a full refund within 7 days of the charge.

### ${sectionNum}.2 One-Time Purchases

- Refund requests for one-time purchases must be submitted within 30 days of the purchase date.
- Digital goods that have been downloaded or accessed may be subject to a partial refund at our discretion.

### ${sectionNum}.3 Non-Refundable Items

The following are generally not eligible for refund:

- Setup fees or onboarding charges (unless the service was never provisioned)
- Custom development or consulting services that have been delivered
- Domain registrations or third-party license purchases made on your behalf
- Accounts terminated for violations of our Terms of Service or Acceptable Use Policy

## ${nextSection()}. Refund Process

### ${sectionNum}.1 How to Request a Refund

To request a refund, please contact us through one of the following methods:

1. **Email:** Send a refund request to ${email} with the subject line "Refund Request"
2. **Account Dashboard:** Navigate to Settings > Billing > Request Refund (if available)

### ${sectionNum}.2 Required Information

Please include the following in your refund request:

- Your account email address
- Order or transaction ID
- Date of purchase
- Reason for the refund request
- Any relevant supporting documentation

### ${sectionNum}.3 Review Process

| Step | Description | Timeline |
|------|-------------|----------|
| 1. Acknowledgment | We confirm receipt of your request | Within 1 business day |
| 2. Review | We evaluate your request against our refund criteria | 3-5 business days |
| 3. Decision | We notify you of the outcome | Within 5 business days of submission |
| 4. Processing | Approved refunds are processed | 5-10 business days after approval |

## ${nextSection()}. Refund Timeline

Once a refund is approved, the timeline for receiving your refund depends on the original payment method:

| Payment Method | Refund Timeline |
|---------------|-----------------|
| Credit/Debit Card | 5-10 business days |
| Bank Transfer | 5-15 business days |
| PayPal / Digital Wallet | 3-5 business days |
| Cryptocurrency | Not eligible for monetary refund; account credit may be issued |

Refunds are issued to the original payment method used for the purchase. We cannot process refunds to a different payment method.

## ${nextSection()}. Partial Refunds

In certain circumstances, we may issue a partial refund:

- If you have used a significant portion of the service before requesting a refund
- If the refund request is made after the full refund eligibility window but within a reasonable timeframe
- If only a portion of the service was unsatisfactory

Partial refund amounts are calculated based on the unused portion of the service, minus any applicable fees.

## ${nextSection()}. Chargebacks and Disputes

If you initiate a chargeback or payment dispute with your bank or payment provider before contacting us:

- Your account may be suspended pending resolution of the dispute
- We reserve the right to contest the chargeback with evidence of service delivery
- If the chargeback is resolved in our favor, you may be responsible for any associated fees

We encourage you to contact us directly at ${email} before initiating a chargeback, as we can often resolve issues more quickly.

## ${nextSection()}. Cancellation vs. Refund

- **Cancellation** stops future billing. Your access continues until the end of the current billing period.
- **Refund** returns money for charges already made.

Cancelling your subscription does not automatically entitle you to a refund for the current billing period. If you wish to request a refund in addition to cancelling, please follow the refund process described above.

## ${nextSection()}. Consumer Protection Rights

This Refund Policy does not affect your statutory rights under applicable consumer protection laws in ${jurisdiction}. If local law provides you with a longer refund period or additional protections, those rights take precedence over this policy.

For customers in the European Union:
- You have a 14-day right of withdrawal for online purchases under the Consumer Rights Directive
- This right may not apply to digital content once download or streaming has begun with your prior consent

## ${nextSection()}. Exceptions and Special Circumstances

We may make exceptions to this policy in cases of:

- Service outages or degraded performance caused by ${company}
- Billing errors or unauthorized charges
- Documented cases where the service did not perform as advertised
- Extenuating personal circumstances (evaluated on a case-by-case basis)

## ${nextSection()}. Changes to This Policy

We may update this Refund Policy from time to time. Changes will be posted on our website at ${website}. The updated policy applies to purchases made after the effective date of the change. Existing purchases remain subject to the policy in effect at the time of purchase.

## ${nextSection()}. Contact

If you have questions about this Refund Policy or need to request a refund, contact us at:

- **Email:** ${email}

---

*This Refund Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis of ${scan.projectName}. It should be reviewed by legal counsel before use.*`;

  return doc;
}
