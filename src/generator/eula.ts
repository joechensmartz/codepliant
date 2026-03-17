import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates an END_USER_LICENSE_AGREEMENT.md for software products.
 * Always generated — a EULA is relevant for any software product.
 * Includes conditional sections for AI and payment services.
 */
export function generateEULA(
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

  let doc = `# End User License Agreement (EULA)

**Effective Date:** ${date}
**Last Updated:** ${date}

**Project:** ${scan.projectName}

---

## ${nextSection()}. Agreement to Terms

This End User License Agreement ("Agreement") is a legal agreement between you ("User" or "you") and ${company} ("Company," "we," "us," or "our") governing your use of ${scan.projectName} and any related software, documentation, updates, and services (collectively, the "Software").

By installing, copying, or otherwise using the Software, you agree to be bound by the terms of this Agreement. If you do not agree to these terms, do not install or use the Software.

## ${nextSection()}. License Grant

Subject to your compliance with this Agreement, ${company} grants you a limited, non-exclusive, non-transferable, revocable license to:

- Install and use the Software on devices you own or control
- Use the Software for your personal or internal business purposes
- Make a reasonable number of backup copies of the Software

This license does not include any right to sublicense, sell, resell, or distribute the Software to third parties.

## ${nextSection()}. Restrictions

You agree not to, and shall not permit any third party to:

- Copy, modify, or create derivative works based on the Software, except as expressly permitted
- Reverse engineer, disassemble, decompile, or attempt to derive the source code of the Software, except as permitted by applicable law
- Remove, alter, or obscure any proprietary notices, labels, or marks on the Software
- Use the Software for any unlawful purpose or in violation of any applicable laws or regulations
- Rent, lease, lend, sell, or sublicense the Software
- Use the Software to develop a competing product or service
- Circumvent any technical limitations or access controls in the Software
- Use the Software in a manner that could damage, disable, overburden, or impair our servers or networks

## ${nextSection()}. Intellectual Property Rights

The Software and all copies thereof are proprietary to ${company} and title thereto remains in ${company}. All rights in the Software not specifically granted in this Agreement are reserved to ${company}.

The Software is protected by copyright laws, international copyright treaties, and other intellectual property laws and treaties. You acknowledge that the Software contains valuable trade secrets and proprietary information belonging to ${company}.

All trademarks, service marks, trade names, and logos associated with the Software are the property of ${company} or their respective owners.

## ${nextSection()}. Warranty Disclaimer

THE SOFTWARE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

${company} DOES NOT WARRANT THAT:

- The Software will meet your specific requirements
- The Software will be uninterrupted, timely, secure, or error-free
- The results obtained from the use of the Software will be accurate or reliable
- Any errors in the Software will be corrected

Any material downloaded or otherwise obtained through the use of the Software is accessed at your own discretion and risk, and you will be solely responsible for any damage to your device or loss of data that results from the download of any such material.

## ${nextSection()}. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ${company}, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR:

- Any indirect, incidental, special, consequential, or punitive damages
- Any loss of profits, data, business, or goodwill
- Cost of procurement of substitute goods or services
- Any damages arising out of or related to your use or inability to use the Software

WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, EVEN IF ${company} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

IN NO EVENT SHALL ${company}'S TOTAL CUMULATIVE LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID FOR THE SOFTWARE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR ONE HUNDRED DOLLARS (USD $100), WHICHEVER IS GREATER.

## ${nextSection()}. Termination

This Agreement is effective until terminated. Your rights under this Agreement will terminate automatically without notice if you fail to comply with any of its terms.

Upon termination, you must:

- Cease all use of the Software
- Destroy all copies of the Software in your possession or control
- Remove the Software from all devices on which it is installed

${company} may also terminate this Agreement at any time by providing written notice. Termination does not relieve you of any obligations incurred prior to termination.

The following sections survive termination: Intellectual Property Rights, Warranty Disclaimer, Limitation of Liability, and Governing Law.`;

  if (hasAI) {
    doc += `

## ${nextSection()}. Artificial Intelligence Disclaimer

The Software incorporates artificial intelligence and/or machine learning components. You acknowledge and agree that:

- AI-generated outputs may not always be accurate, complete, or appropriate for your intended use
- You are solely responsible for reviewing, validating, and verifying any AI-generated content before relying on it
- AI components may produce different results for similar inputs and outputs are not guaranteed to be deterministic
- ${company} does not guarantee the accuracy, reliability, or fitness for purpose of any AI-generated output
- You must not use AI features to generate content that is illegal, harmful, misleading, or that violates the rights of others
- AI models may be updated periodically, which could affect the nature of outputs
- You must comply with all applicable laws and regulations regarding the use of AI-generated content in your jurisdiction`;
  }

  if (hasPayment) {
    doc += `

## ${nextSection()}. Payment Terms

To the extent the Software includes paid features, subscriptions, or in-app purchases:

- All fees are stated in the currency indicated at the time of purchase and are non-refundable except as required by applicable law or as expressly stated in our Refund Policy
- You agree to pay all fees and applicable taxes associated with your use of paid features
- ${company} reserves the right to change pricing with reasonable notice; continued use after a price change constitutes acceptance
- If payment fails, ${company} may suspend or terminate your access to paid features
- You are responsible for all charges incurred under your account, including unauthorized purchases made by third parties using your credentials
- Free trial periods, if offered, will automatically convert to paid subscriptions unless cancelled before the trial period ends`;
  }

  doc += `

## ${nextSection()}. Export Compliance

You agree to comply with all applicable export and re-export control laws and regulations, including without limitation the Export Administration Regulations maintained by the United States Department of Commerce, trade and economic sanctions maintained by the Treasury Department's Office of Foreign Assets Control ("OFAC"), and the International Traffic in Arms Regulations maintained by the Department of State.

You represent and warrant that:

- You are not located in a country subject to a U.S. Government embargo or designated as a "terrorist-supporting" country
- You are not listed on any U.S. Government list of prohibited or restricted parties
- You will not use the Software for any purposes prohibited by applicable export laws, including nuclear, chemical, or biological weapons proliferation

## ${nextSection()}. Governing Law

This Agreement shall be governed by and construed in accordance with the laws of ${jurisdiction}, without regard to its conflict of law provisions.

Any legal action or proceeding arising under this Agreement shall be brought exclusively in the courts located in ${jurisdiction}, and the parties consent to the personal jurisdiction and venue of such courts.

If any provision of this Agreement is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that this Agreement shall otherwise remain in full force and effect.

## ${nextSection()}. Modifications to This Agreement

${company} reserves the right to modify this Agreement at any time. We will notify you of material changes by posting the updated Agreement on our website at ${website} or through the Software.

Your continued use of the Software after such modifications constitutes your acceptance of the revised Agreement. If you do not agree with the modified terms, you must stop using the Software.

## ${nextSection()}. Contact Information

If you have questions about this Agreement, please contact us at:

- **Email:** ${email}

---

*This End User License Agreement was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on code analysis of ${scan.projectName}. It should be reviewed by legal counsel before use.*`;

  return doc;
}
