import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildReviewNotes,
  buildRelatedDocuments,
  getRelatedDocuments,
  getReviewNotes,
  DOCUMENT_RELATIONSHIPS,
  REVIEW_NOTES,
} from "./review-notes.js";
import type { ReviewSection, DocumentRelationship } from "./review-notes.js";

describe("buildReviewNotes", () => {
  it("returns a string containing the Review Notes heading", () => {
    const review: ReviewSection = {
      lawyerChecks: ["Check clause A"],
      autoVsHuman: [{ section: "Intro", status: "Auto", confidence: "high" }],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("## Review Notes"));
  });

  it("includes What a lawyer should check heading", () => {
    const review: ReviewSection = {
      lawyerChecks: ["Verify data practices"],
      autoVsHuman: [],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("### What a lawyer should check"));
  });

  it("lists all lawyer checks as bullet points", () => {
    const review: ReviewSection = {
      lawyerChecks: ["Check A", "Check B", "Check C"],
      autoVsHuman: [],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("- Check A"));
    assert.ok(result.includes("- Check B"));
    assert.ok(result.includes("- Check C"));
  });

  it("includes Auto-generated vs human input heading", () => {
    const review: ReviewSection = {
      lawyerChecks: [],
      autoVsHuman: [{ section: "Test", status: "Auto", confidence: "high" }],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("### Auto-generated vs. needs human input"));
  });

  it("renders a markdown table with section, status, and confidence", () => {
    const review: ReviewSection = {
      lawyerChecks: [],
      autoVsHuman: [
        { section: "Services list", status: "Auto-detected from code", confidence: "high" },
      ],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("| Section | Status | Confidence |"));
    assert.ok(result.includes("|---------|--------|------------|"));
    assert.ok(result.includes("| Services list | Auto-detected from code | High |"));
  });

  it("capitalizes confidence values", () => {
    const review: ReviewSection = {
      lawyerChecks: [],
      autoVsHuman: [
        { section: "A", status: "status", confidence: "low" },
        { section: "B", status: "status", confidence: "medium" },
        { section: "C", status: "status", confidence: "high" },
      ],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("| Low |"));
    assert.ok(result.includes("| Medium |"));
    assert.ok(result.includes("| High |"));
  });

  it("renders N/A confidence without capitalization change", () => {
    const review: ReviewSection = {
      lawyerChecks: [],
      autoVsHuman: [
        { section: "Team assignments", status: "Placeholder", confidence: "N/A" },
      ],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("| N/A |"));
  });

  it("handles empty lawyer checks gracefully", () => {
    const review: ReviewSection = {
      lawyerChecks: [],
      autoVsHuman: [{ section: "X", status: "Y", confidence: "high" }],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("## Review Notes"));
    // No bullet points for lawyer checks
    assert.ok(!result.includes("- "));
  });

  it("handles empty autoVsHuman array gracefully", () => {
    const review: ReviewSection = {
      lawyerChecks: ["Check A"],
      autoVsHuman: [],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("## Review Notes"));
    assert.ok(result.includes("- Check A"));
    // Table header should still exist
    assert.ok(result.includes("| Section | Status | Confidence |"));
  });

  it("renders multiple autoVsHuman rows", () => {
    const review: ReviewSection = {
      lawyerChecks: [],
      autoVsHuman: [
        { section: "First", status: "Auto", confidence: "high" },
        { section: "Second", status: "Manual", confidence: "low" },
        { section: "Third", status: "Template", confidence: "medium" },
      ],
    };
    const result = buildReviewNotes(review);
    assert.ok(result.includes("| First |"));
    assert.ok(result.includes("| Second |"));
    assert.ok(result.includes("| Third |"));
  });
});

describe("buildRelatedDocuments", () => {
  it("returns a string containing the Related Documents heading", () => {
    const docs: DocumentRelationship[] = [
      { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
    ];
    const result = buildRelatedDocuments(docs);
    assert.ok(result.includes("## Related Documents"));
  });

  it("lists documents with name and filename", () => {
    const docs: DocumentRelationship[] = [
      { name: "Privacy Policy", filename: "PRIVACY_POLICY.md" },
      { name: "Cookie Policy", filename: "COOKIE_POLICY.md" },
    ];
    const result = buildRelatedDocuments(docs);
    assert.ok(result.includes("- Privacy Policy (`PRIVACY_POLICY.md`)"));
    assert.ok(result.includes("- Cookie Policy (`COOKIE_POLICY.md`)"));
  });

  it("handles empty documents array", () => {
    const result = buildRelatedDocuments([]);
    assert.ok(result.includes("## Related Documents"));
    // Should have heading but no list items
    assert.ok(!result.includes("- "));
  });

  it("renders filename in backticks", () => {
    const docs: DocumentRelationship[] = [
      { name: "Test Doc", filename: "TEST.md" },
    ];
    const result = buildRelatedDocuments(docs);
    assert.ok(result.includes("`TEST.md`"));
  });
});

describe("getRelatedDocuments", () => {
  it("returns related documents for PRIVACY_POLICY.md", () => {
    const docs = getRelatedDocuments("PRIVACY_POLICY.md");
    assert.ok(Array.isArray(docs));
    assert.ok(docs.length > 0);
    const filenames = docs.map((d) => d.filename);
    assert.ok(filenames.includes("COOKIE_POLICY.md"));
    assert.ok(filenames.includes("DATA_PROCESSING_AGREEMENT.md"));
  });

  it("returns related documents for TERMS_OF_SERVICE.md", () => {
    const docs = getRelatedDocuments("TERMS_OF_SERVICE.md");
    assert.ok(docs.length > 0);
    const filenames = docs.map((d) => d.filename);
    assert.ok(filenames.includes("PRIVACY_POLICY.md"));
  });

  it("returns related documents for SECURITY.md", () => {
    const docs = getRelatedDocuments("SECURITY.md");
    assert.ok(docs.length > 0);
    const filenames = docs.map((d) => d.filename);
    assert.ok(filenames.includes("INCIDENT_RESPONSE_PLAN.md"));
  });

  it("returns related documents for AI_DISCLOSURE.md", () => {
    const docs = getRelatedDocuments("AI_DISCLOSURE.md");
    assert.ok(docs.length > 0);
    const filenames = docs.map((d) => d.filename);
    assert.ok(filenames.includes("AI_MODEL_CARD.md"));
  });

  it("returns empty array for unknown filename", () => {
    const docs = getRelatedDocuments("NONEXISTENT.md");
    assert.ok(Array.isArray(docs));
    assert.strictEqual(docs.length, 0);
  });

  it("returns related documents for DATA_PROCESSING_AGREEMENT.md", () => {
    const docs = getRelatedDocuments("DATA_PROCESSING_AGREEMENT.md");
    assert.ok(docs.length > 0);
    const filenames = docs.map((d) => d.filename);
    assert.ok(filenames.includes("SUBPROCESSOR_LIST.md"));
  });

  it("returns related documents for INCIDENT_RESPONSE_PLAN.md", () => {
    const docs = getRelatedDocuments("INCIDENT_RESPONSE_PLAN.md");
    assert.ok(docs.length > 0);
    const filenames = docs.map((d) => d.filename);
    assert.ok(filenames.includes("SECURITY.md"));
    assert.ok(filenames.includes("BUSINESS_CONTINUITY_PLAN.md"));
  });
});

describe("getReviewNotes", () => {
  it("returns review notes for PRIVACY_POLICY.md", () => {
    const notes = getReviewNotes("PRIVACY_POLICY.md");
    assert.ok(notes !== null);
    assert.ok(notes!.lawyerChecks.length > 0);
    assert.ok(notes!.autoVsHuman.length > 0);
  });

  it("returns review notes for TERMS_OF_SERVICE.md", () => {
    const notes = getReviewNotes("TERMS_OF_SERVICE.md");
    assert.ok(notes !== null);
    assert.ok(notes!.lawyerChecks.length > 0);
  });

  it("returns review notes for SECURITY.md", () => {
    const notes = getReviewNotes("SECURITY.md");
    assert.ok(notes !== null);
    assert.ok(notes!.lawyerChecks.some((c) => c.includes("responsible disclosure")));
  });

  it("returns review notes for INCIDENT_RESPONSE_PLAN.md", () => {
    const notes = getReviewNotes("INCIDENT_RESPONSE_PLAN.md");
    assert.ok(notes !== null);
    assert.ok(notes!.lawyerChecks.some((c) => c.includes("72-hour")));
  });

  it("returns review notes for DATA_PROCESSING_AGREEMENT.md", () => {
    const notes = getReviewNotes("DATA_PROCESSING_AGREEMENT.md");
    assert.ok(notes !== null);
    assert.ok(notes!.lawyerChecks.some((c) => c.includes("Article 28")));
  });

  it("returns review notes for RECORD_OF_PROCESSING_ACTIVITIES.md", () => {
    const notes = getReviewNotes("RECORD_OF_PROCESSING_ACTIVITIES.md");
    assert.ok(notes !== null);
    assert.ok(notes!.lawyerChecks.length > 0);
  });

  it("returns null for unknown filename", () => {
    const notes = getReviewNotes("NONEXISTENT.md");
    assert.strictEqual(notes, null);
  });

  it("privacy policy review notes include data collection check", () => {
    const notes = getReviewNotes("PRIVACY_POLICY.md")!;
    assert.ok(notes.lawyerChecks.some((c) => c.includes("data collection")));
  });

  it("privacy policy autoVsHuman includes high confidence for services list", () => {
    const notes = getReviewNotes("PRIVACY_POLICY.md")!;
    const servicesRow = notes.autoVsHuman.find((r) => r.section.includes("Third-party"));
    assert.ok(servicesRow);
    assert.strictEqual(servicesRow!.confidence, "high");
  });

  it("privacy policy autoVsHuman includes low confidence for retention periods", () => {
    const notes = getReviewNotes("PRIVACY_POLICY.md")!;
    const retentionRow = notes.autoVsHuman.find((r) => r.section.includes("Retention"));
    assert.ok(retentionRow);
    assert.strictEqual(retentionRow!.confidence, "low");
  });
});

describe("DOCUMENT_RELATIONSHIPS", () => {
  it("contains at least 30 document entries", () => {
    const keys = Object.keys(DOCUMENT_RELATIONSHIPS);
    assert.ok(keys.length >= 30, `Expected at least 30 entries, got ${keys.length}`);
  });

  it("all entries have at least one related document", () => {
    for (const [key, docs] of Object.entries(DOCUMENT_RELATIONSHIPS)) {
      assert.ok(docs.length > 0, `${key} has no related documents`);
    }
  });

  it("all related documents have name and filename properties", () => {
    for (const [key, docs] of Object.entries(DOCUMENT_RELATIONSHIPS)) {
      for (const doc of docs) {
        assert.ok(typeof doc.name === "string", `${key}: missing name`);
        assert.ok(typeof doc.filename === "string", `${key}: missing filename`);
        assert.ok(doc.filename.endsWith(".md") || doc.filename.endsWith(".json"),
          `${key}: filename ${doc.filename} does not end with .md or .json`);
      }
    }
  });
});

describe("REVIEW_NOTES", () => {
  it("contains entries for core documents", () => {
    assert.ok("PRIVACY_POLICY.md" in REVIEW_NOTES);
    assert.ok("TERMS_OF_SERVICE.md" in REVIEW_NOTES);
    assert.ok("SECURITY.md" in REVIEW_NOTES);
  });

  it("all entries have lawyerChecks and autoVsHuman arrays", () => {
    for (const [key, section] of Object.entries(REVIEW_NOTES)) {
      assert.ok(Array.isArray(section.lawyerChecks), `${key}: missing lawyerChecks`);
      assert.ok(Array.isArray(section.autoVsHuman), `${key}: missing autoVsHuman`);
    }
  });

  it("all autoVsHuman entries have valid confidence values", () => {
    const validConfidence = new Set(["high", "medium", "low", "N/A"]);
    for (const [key, section] of Object.entries(REVIEW_NOTES)) {
      for (const item of section.autoVsHuman) {
        assert.ok(validConfidence.has(item.confidence),
          `${key}: invalid confidence "${item.confidence}" for section "${item.section}"`);
      }
    }
  });
});
