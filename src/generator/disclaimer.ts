import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a DISCLAIMER.md for websites.
 * Always generated — every website benefits from a disclaimer.
 * Includes conditional sections for AI services and payment services.
 */
export function generateDisclaimer(
  scan: ScanResult,
  ctx?: GeneratorContext
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const jurisdiction = ctx?.jurisdiction || "[Your Jurisdiction]";
  const date = new Date().toISOString().split("T")[0];

  const hasAI = scan.services.some((s) => s.category === "ai");
  const hasPayment = scan.services.some((s) => s.category === "payment");

  let sectionNum = 0;
  function nextSection(): number {
    return ++sectionNum;
  }

  let doc = `# Disclaimer

**Effective Date:** ${date}
**Last Updated:** ${date}

**Project:** ${scan.projectName}

---

## ${nextSection()}. General Information Disclaimer

The information provided by ${company} ("we," "us," or "our") on ${website} (the "Website") and through ${scan.projectName} is for general informational purposes only. All information on the Website is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Website.

Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Website or reliance on any information provided on the Website. Your use of the Website and your reliance on any information on the Website is solely at your own risk.

## ${nextSection()}. Professional Advice Disclaimer

The Website and its content are not intended to be a substitute for professional advice. Always seek the guidance of a qualified professional with any questions you may have regarding your specific situation. Never disregard professional advice or delay in seeking it because of something you have read on the Website.

Specifically, but without limitation:

- **Legal advice:** The content on this Website does not constitute legal advice and should not be relied upon as such. You should consult a qualified attorney for advice regarding your specific legal matters.
- **Financial advice:** Nothing on this Website constitutes financial, investment, tax, or accounting advice. Consult a qualified financial professional before making any financial decisions.
- **Medical advice:** The Website does not provide medical advice. Consult a qualified healthcare provider for medical guidance.
- **Technical advice:** While we strive to provide accurate technical information, it should not replace professional technical consultation for critical systems.

## ${nextSection()}. No Warranties

THE WEBSITE AND ITS CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

- IMPLIED WARRANTIES OF MERCHANTABILITY
- FITNESS FOR A PARTICULAR PURPOSE
- NON-INFRINGEMENT
- ACCURACY OR COMPLETENESS OF CONTENT
- AVAILABILITY OR UNINTERRUPTED ACCESS

${company} does not warrant that the Website will be secure, free of viruses or other harmful components, or that defects will be corrected. You assume the entire risk as to the quality and performance of the Website.

## ${nextSection()}. External Links Disclaimer

The Website may contain links to external websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.

We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Website. We will not be a party to or in any way be responsible for monitoring any transaction between you and any third-party providers of products or services.

## ${nextSection()}. Errors and Omissions Disclaimer

While we have made every effort to ensure that the information contained on this Website is correct, ${company} is not responsible for any errors or omissions, or for the results obtained from the use of this information.

All information on the Website is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information. ${company} reserves the right to make additions, deletions, or modifications to the contents of the Website at any time without prior notice.

${company} does not assume any responsibility for errors, omissions, or contrary interpretation of the subject matter herein. Any perceived slights of specific persons, peoples, or organizations are unintentional.

## ${nextSection()}. Fair Use Disclaimer

This Website may contain copyrighted material, the use of which has not always been specifically authorized by the copyright owner. We believe this constitutes "fair use" of any such copyrighted material as provided for in Section 107 of the United States Copyright Law.

If you wish to use copyrighted material from this Website for purposes of your own that go beyond fair use, you must obtain permission from the copyright owner.`;

  if (hasAI) {
    doc += `

## ${nextSection()}. Artificial Intelligence Disclaimer

This Website and/or its associated services utilize artificial intelligence ("AI") and machine learning technologies. You acknowledge and agree that:

- AI-generated content, recommendations, or outputs may not always be accurate, complete, current, or free from errors
- AI systems may produce different results for similar or identical inputs and are not guaranteed to be deterministic
- You should independently verify any AI-generated information before making decisions or taking actions based on it
- ${company} does not guarantee the accuracy, reliability, or suitability of any AI-generated output for your particular purpose
- AI models and algorithms may be updated, modified, or replaced at any time, which may affect the nature and quality of outputs
- You are solely responsible for your use of and reliance on AI-generated content
- AI-generated content should not be considered a substitute for professional judgment, advice, or expertise

${company} expressly disclaims all liability for any damages, losses, or adverse consequences arising from your use of or reliance on AI-generated content provided through the Website or associated services.`;
  }

  if (hasPayment) {
    doc += `

## ${nextSection()}. Payment and Financial Transactions Disclaimer

To the extent the Website facilitates payment processing or financial transactions:

- All payment processing is handled by third-party payment processors, and ${company} does not store or directly process your payment card information
- ${company} is not responsible for any errors, delays, or failures in payment processing caused by third-party payment providers
- Prices, fees, and charges displayed on the Website are subject to change without prior notice
- You are responsible for verifying the accuracy of all transaction details before confirming any payment
- ${company} is not liable for any unauthorized transactions resulting from your failure to maintain the security of your account credentials
- Refunds, chargebacks, and disputes are subject to the terms of our Refund Policy and the policies of the applicable payment processor
- All financial information displayed on the Website is for informational purposes only and should not be relied upon for financial planning or decision-making`;
  }

  doc += `

## ${nextSection()}. Changes to This Disclaimer

${company} reserves the right to modify this Disclaimer at any time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the Website after any changes to this Disclaimer constitutes your acceptance of the revised terms.

We encourage you to review this Disclaimer periodically to stay informed of any updates.

## ${nextSection()}. Contact Information

If you have any questions or concerns about this Disclaimer, please contact us at:

- **Email:** ${email}
- **Website:** ${website}

---

*This Disclaimer was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis of ${scan.projectName}. It should be reviewed by legal counsel before use.*`;

  return doc;
}
