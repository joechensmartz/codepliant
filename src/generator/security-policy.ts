import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates a SECURITY.md file following the GitHub standard for responsible
 * disclosure policies.  Content adapts based on detected services (auth,
 * payment, AI) and optional config fields (securityEmail, bugBountyUrl).
 */
export function generateSecurityPolicy(
  scan: ScanResult,
  ctx?: GeneratorContext
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const securityEmail =
    ctx?.securityEmail || ctx?.contactEmail || "[security@example.com]";
  const website = ctx?.website || "[https://yoursite.com]";
  const date = new Date().toISOString().split("T")[0];

  const hasAuth = scan.services.some((s) => s.category === "auth");
  const hasPayment = scan.services.some((s) => s.category === "payment");
  const hasAI = scan.services.some((s) => s.category === "ai");

  const sections: string[] = [];

  // --- Header ---
  sections.push(`# Security Policy`);
  sections.push("");
  sections.push(`**Last updated:** ${date}`);
  sections.push("");
  sections.push(
    `${company} takes the security of our software and services seriously. ` +
      `If you believe you have found a security vulnerability, we encourage you to report it responsibly.`
  );

  // --- Supported Versions ---
  sections.push("");
  sections.push("## Supported Versions");
  sections.push("");
  sections.push(
    "We release patches for security vulnerabilities in the following versions:"
  );
  sections.push("");
  sections.push("| Version | Supported          |");
  sections.push("| ------- | ------------------ |");
  sections.push("| latest  | :white_check_mark: |");
  sections.push("| < latest | :x:               |");
  sections.push("");
  sections.push(
    "If you are using an older version, please upgrade to the latest release to receive security updates."
  );

  // --- Reporting Vulnerabilities ---
  sections.push("");
  sections.push("## Reporting a Vulnerability");
  sections.push("");
  sections.push(
    "**Please do NOT report security vulnerabilities through public GitHub issues.**"
  );
  sections.push("");
  sections.push("Instead, please report them via email:");
  sections.push("");
  sections.push(`- **Email:** [${securityEmail}](mailto:${securityEmail})`);
  sections.push("");
  sections.push("Please include the following information in your report:");
  sections.push("");
  sections.push("- Description of the vulnerability");
  sections.push("- Steps to reproduce the issue");
  sections.push("- Potential impact of the vulnerability");
  sections.push("- Any suggested fixes (optional)");

  // --- Scope ---
  sections.push("");
  sections.push("## Scope");
  sections.push("");
  sections.push("### In Scope");
  sections.push("");
  sections.push(`- ${company} application code and APIs`);
  sections.push("- Authentication and session management");
  sections.push("- Data storage and transmission");
  sections.push(`- Infrastructure serving ${website}`);
  sections.push("");
  sections.push("### Out of Scope");
  sections.push("");
  sections.push("- Third-party services and applications");
  sections.push("- Social engineering attacks");
  sections.push("- Denial of service (DoS/DDoS) attacks");
  sections.push("- Issues in dependencies that are already publicly disclosed");

  // --- Auth Security ---
  if (hasAuth) {
    sections.push("");
    sections.push("## Authentication Security");
    sections.push("");
    sections.push(
      "This project uses authentication services. " +
        "Security issues related to the following are especially important to us:"
    );
    sections.push("");
    sections.push("- Session management and token handling");
    sections.push("- Authentication bypass vulnerabilities");
    sections.push("- Credential storage and transmission");
    sections.push("- OAuth flow and callback security");
  }

  // --- PCI Considerations ---
  if (hasPayment) {
    sections.push("");
    sections.push("## Payment & PCI Considerations");
    sections.push("");
    sections.push(
      "This project integrates with payment processing services. " +
        "We follow PCI DSS guidelines for handling payment data:"
    );
    sections.push("");
    sections.push(
      "- Payment card data is never stored on our servers; it is handled by our PCI-compliant payment processor"
    );
    sections.push(
      "- Vulnerabilities related to payment flows, billing data exposure, or payment bypass are treated as **critical**"
    );
    sections.push(
      "- If you discover a payment-related vulnerability, please include `[PCI]` in your report subject line"
    );
  }

  // --- AI Safety ---
  if (hasAI) {
    sections.push("");
    sections.push("## AI Safety & Security");
    sections.push("");
    sections.push(
      "This project integrates with AI/ML services. " +
        "In addition to traditional security concerns, we are interested in reports related to:"
    );
    sections.push("");
    sections.push("- Prompt injection vulnerabilities");
    sections.push("- Data leakage through AI model interactions");
    sections.push("- Unauthorized access to AI-generated content");
    sections.push("- Model manipulation or adversarial inputs");
    sections.push("- AI output used to bypass security controls");
  }

  // --- Response Timeline ---
  sections.push("");
  sections.push("## Response Timeline");
  sections.push("");
  sections.push(
    "We are committed to responding to security reports promptly:"
  );
  sections.push("");
  sections.push(
    "| Action                            | Timeline           |"
  );
  sections.push(
    "| --------------------------------- | ------------------ |"
  );
  sections.push(
    "| Acknowledgment of report          | Within 48 hours    |"
  );
  sections.push(
    "| Initial assessment                | Within 5 business days |"
  );
  sections.push(
    "| Resolution target (critical)      | Within 30 days     |"
  );
  sections.push(
    "| Resolution target (non-critical)  | Within 90 days     |"
  );
  sections.push(
    "| Public disclosure (coordinated)   | After fix is deployed |"
  );

  // --- Bug Bounty ---
  if (ctx?.bugBountyUrl) {
    sections.push("");
    sections.push("## Bug Bounty Program");
    sections.push("");
    sections.push(
      `We maintain a bug bounty program to reward security researchers for responsible disclosure.`
    );
    sections.push("");
    sections.push(
      `For details on eligible vulnerabilities, reward amounts, and program rules, visit our bug bounty page:`
    );
    sections.push("");
    sections.push(`- **Bug Bounty Program:** [${ctx.bugBountyUrl}](${ctx.bugBountyUrl})`);
  }

  // --- Disclaimer ---
  sections.push("");
  sections.push("## Disclosure Policy");
  sections.push("");
  sections.push(
    "We follow a coordinated disclosure process. We ask that you:"
  );
  sections.push("");
  sections.push(
    "- Allow us reasonable time to investigate and address the vulnerability before public disclosure"
  );
  sections.push(
    "- Make a good faith effort to avoid privacy violations, data destruction, and service disruption"
  );
  sections.push(
    "- Do not access or modify data belonging to other users"
  );

  // --- Contact ---
  sections.push("");
  sections.push("## Contact");
  sections.push("");
  sections.push(
    `For security-related inquiries, contact us at [${securityEmail}](mailto:${securityEmail}).`
  );

  // --- Legal disclaimer ---
  sections.push("");
  sections.push("---");
  sections.push("");
  sections.push(
    `*This security policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) ` +
      `based on an automated scan of the **${scan.projectName}** codebase. ` +
      `It should be reviewed and customized by your security team before publishing.*`
  );
  sections.push("");

  return sections.join("\n");
}
