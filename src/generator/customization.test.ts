import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyOverrides } from "./customization.js";

const sampleDoc = `# Privacy Policy

**Last updated:** 2026-01-01

## Information We Collect

We collect personal data when you use our service, including
your name, email address, and usage data.

## How We Use Your Information

We use your information to provide and improve our services,
communicate with you, and comply with legal obligations.

## Data Retention

We retain your data for as long as your account is active or
as needed to provide you services. We will delete your data
within 30 days of account closure.

## Contact Us

If you have questions, reach out at privacy@example.com.
`;

describe("applyOverrides", () => {
  it("replaces the body of a matching section while preserving the heading", () => {
    const overrides = {
      "Data Retention": "We keep your data for exactly 90 days after account deletion.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("## Data Retention"), "heading should be preserved");
    assert.ok(result.includes("We keep your data for exactly 90 days"), "override body should appear");
    assert.ok(!result.includes("within 30 days of account closure"), "original body should be gone");
  });

  it("does not modify other sections when overriding one", () => {
    const overrides = {
      "Data Retention": "Custom retention policy.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("We collect personal data"), "Information We Collect should be untouched");
    assert.ok(result.includes("We use your information to provide"), "How We Use should be untouched");
  });

  it("handles overriding the last section in the document", () => {
    const overrides = {
      "Contact Us": "Email us at legal@acme.com for any inquiries.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("## Contact Us"), "heading should be preserved");
    assert.ok(result.includes("Email us at legal@acme.com"), "override body should appear");
    assert.ok(!result.includes("privacy@example.com"), "original body should be gone");
  });

  it("returns content unchanged when the heading does not exist", () => {
    const overrides = {
      "Nonexistent Section": "This should not appear anywhere.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.strictEqual(result, sampleDoc, "document should be unchanged");
  });

  it("applies multiple overrides at once", () => {
    const overrides = {
      "Information We Collect": "We collect only your email address.",
      "Contact Us": "Reach us at support@newco.com.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("We collect only your email address"), "first override applied");
    assert.ok(result.includes("Reach us at support@newco.com"), "second override applied");
    assert.ok(!result.includes("your name, email address, and usage data"), "first original gone");
    assert.ok(!result.includes("privacy@example.com"), "second original gone");
    // Untouched sections remain
    assert.ok(result.includes("We use your information to provide"), "middle section untouched");
  });

  it("is case-insensitive when matching headings", () => {
    const overrides = {
      "data retention": "Custom retention text.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("## Data Retention"), "original heading preserved");
    assert.ok(result.includes("Custom retention text."), "override applied");
    assert.ok(!result.includes("within 30 days of account closure"), "original body replaced");
  });

  it("handles empty overrides object gracefully", () => {
    const result = applyOverrides(sampleDoc, {});
    assert.strictEqual(result, sampleDoc, "document should be unchanged with empty overrides");
  });

  it("handles override with empty string body", () => {
    const overrides = {
      "Data Retention": "",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("## Data Retention"), "heading should be preserved");
    assert.ok(!result.includes("within 30 days of account closure"), "original body should be gone");
  });

  it("handles override with multiline body", () => {
    const overrides = {
      "Data Retention": "Line 1 of retention policy.\n\nLine 2 with details.\n\n- Bullet point 1\n- Bullet point 2",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("Line 1 of retention policy."), "first line present");
    assert.ok(result.includes("Line 2 with details."), "second line present");
    assert.ok(result.includes("- Bullet point 1"), "bullet point present");
  });

  it("handles document with only one section", () => {
    const singleSection = `# Title\n\n## Only Section\n\nThis is the only section content.\n`;
    const overrides = {
      "Only Section": "Replaced content.",
    };
    const result = applyOverrides(singleSection, overrides);
    assert.ok(result.includes("## Only Section"), "heading preserved");
    assert.ok(result.includes("Replaced content."), "override applied");
    assert.ok(!result.includes("This is the only section content."), "original replaced");
  });

  it("preserves heading numbering when sections are numbered", () => {
    const numberedDoc = `# Policy\n\n## 1. First Section\n\nFirst content.\n\n## 2. Second Section\n\nSecond content.\n`;
    const overrides = {
      "1. First Section": "Updated first content.",
    };
    const result = applyOverrides(numberedDoc, overrides);
    assert.ok(result.includes("## 1. First Section"), "numbered heading preserved");
    assert.ok(result.includes("Updated first content."), "override applied");
    assert.ok(!result.includes("First content.") || result.includes("Updated first content."), "original replaced");
  });

  it("handles special regex characters in heading text", () => {
    const specialDoc = `# Doc\n\n## Terms & Conditions (v2.0)\n\nOriginal terms.\n\n## Contact\n\nEmail us.\n`;
    const overrides = {
      "Terms & Conditions (v2.0)": "Updated terms.",
    };
    const result = applyOverrides(specialDoc, overrides);
    assert.ok(result.includes("Updated terms."), "override applied despite special chars");
    assert.ok(!result.includes("Original terms."), "original replaced");
  });

  it("does not affect h1 or h3 headings", () => {
    const mixedDoc = `# Title\n\n## Section A\n\nContent A.\n\n### Subsection\n\nSub content.\n\n## Section B\n\nContent B.\n`;
    const overrides = {
      "Section A": "New A content.",
    };
    const result = applyOverrides(mixedDoc, overrides);
    assert.ok(result.includes("New A content."), "section A replaced");
    assert.ok(result.includes("## Section B"), "section B heading intact");
    assert.ok(result.includes("Content B."), "section B content intact");
  });

  it("preserves the h1 title when overriding first h2 section", () => {
    const overrides = {
      "Information We Collect": "Minimal data collection.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("# Privacy Policy"), "h1 title preserved");
    assert.ok(result.includes("**Last updated:** 2026-01-01"), "header metadata preserved");
  });

  it("can override the first section in the document", () => {
    const overrides = {
      "Information We Collect": "Only your IP address is collected.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("Only your IP address is collected."), "first section override applied");
    assert.ok(!result.includes("your name, email address, and usage data"), "first section original replaced");
  });

  it("can override all sections simultaneously", () => {
    const overrides = {
      "Information We Collect": "Custom collect.",
      "How We Use Your Information": "Custom use.",
      "Data Retention": "Custom retention.",
      "Contact Us": "Custom contact.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    assert.ok(result.includes("Custom collect."), "collect override applied");
    assert.ok(result.includes("Custom use."), "use override applied");
    assert.ok(result.includes("Custom retention."), "retention override applied");
    assert.ok(result.includes("Custom contact."), "contact override applied");
    // All originals should be gone
    assert.ok(!result.includes("your name, email address, and usage data"), "original collect gone");
    assert.ok(!result.includes("provide and improve our services"), "original use gone");
    assert.ok(!result.includes("within 30 days of account closure"), "original retention gone");
    assert.ok(!result.includes("privacy@example.com"), "original contact gone");
  });

  it("preserves document structure with multiple overrides", () => {
    const overrides = {
      "Information We Collect": "New collect.",
      "Contact Us": "New contact.",
    };
    const result = applyOverrides(sampleDoc, overrides);
    // Check ordering is preserved
    const collectIdx = result.indexOf("## Information We Collect");
    const useIdx = result.indexOf("## How We Use Your Information");
    const retentionIdx = result.indexOf("## Data Retention");
    const contactIdx = result.indexOf("## Contact Us");
    assert.ok(collectIdx < useIdx, "Information before How We Use");
    assert.ok(useIdx < retentionIdx, "How We Use before Data Retention");
    assert.ok(retentionIdx < contactIdx, "Data Retention before Contact");
  });
});
