import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generateImpressum } from "./impressum.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
  };
}

function makeScan(overrides: Partial<ScanResult> = {}): ScanResult {
  return {
    projectName: "test-project",
    projectPath: "/tmp/test",
    scannedAt: "2026-01-01",
    services: [],
    dataCategories: [],
    complianceNeeds: [],
    ...overrides,
  };
}

function makeCtx(overrides: Partial<GeneratorContext> = {}): GeneratorContext {
  return {
    companyName: "Test GmbH",
    contactEmail: "info@test.de",
    jurisdiction: "GDPR",
    ...overrides,
  };
}

describe("generateImpressum", () => {
  // ── Null guards: non-German jurisdictions ───────────────────────────
  it("returns null when jurisdiction is CCPA", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdiction: "CCPA", jurisdictions: undefined });
    assert.strictEqual(generateImpressum(scan, ctx), null);
  });

  it("returns null when jurisdiction is undefined and no German indicators", () => {
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: undefined, companyLocation: undefined });
    assert.strictEqual(generateImpressum(makeScan(), ctx), null);
  });

  it("returns null when jurisdiction is an unrelated string", () => {
    const ctx = makeCtx({ jurisdiction: "HIPAA", jurisdictions: undefined, companyLocation: undefined });
    assert.strictEqual(generateImpressum(makeScan(), ctx), null);
  });

  it("returns null when jurisdictions array contains only non-EU values", () => {
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: ["CCPA", "HIPAA"] });
    assert.strictEqual(generateImpressum(makeScan(), ctx), null);
  });

  it("returns null when companyLocation is a non-German country", () => {
    const ctx = makeCtx({ jurisdiction: undefined, companyLocation: "London, UK" });
    assert.strictEqual(generateImpressum(makeScan(), ctx), null);
  });

  // ── Jurisdiction triggers ──────────────────────────────────────────
  it("generates Impressum when jurisdiction is GDPR", () => {
    const result = generateImpressum(makeScan(), makeCtx({ jurisdiction: "GDPR" }));
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
    assert.ok(result.includes("§ 5 DDG"));
  });

  it("generates Impressum when jurisdiction is DE", () => {
    const result = generateImpressum(makeScan(), makeCtx({ jurisdiction: "DE" }));
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
  });

  it("generates Impressum when jurisdiction is EU", () => {
    const result = generateImpressum(makeScan(), makeCtx({ jurisdiction: "EU" }));
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
  });

  it("generates Impressum when jurisdictions array contains EU", () => {
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: ["CCPA", "EU"] });
    const result = generateImpressum(makeScan(), ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
  });

  it("generates Impressum when jurisdictions array contains GDPR", () => {
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: ["GDPR"] });
    const result = generateImpressum(makeScan(), ctx);
    assert.ok(result !== null);
  });

  it("generates Impressum when jurisdictions array contains DE", () => {
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: ["DE"] });
    const result = generateImpressum(makeScan(), ctx);
    assert.ok(result !== null);
  });

  it("generates Impressum when companyLocation includes Germany", () => {
    const ctx = makeCtx({ jurisdiction: undefined, companyLocation: "Berlin, Germany" });
    const result = generateImpressum(makeScan(), ctx);
    assert.ok(result !== null);
  });

  it("generates Impressum when companyLocation includes Deutschland", () => {
    const ctx = makeCtx({ jurisdiction: undefined, companyLocation: "München, Deutschland" });
    const result = generateImpressum(makeScan(), ctx);
    assert.ok(result !== null);
  });

  it("is case-insensitive for jurisdiction matching", () => {
    const ctx = makeCtx({ jurisdiction: "gdpr" });
    const result = generateImpressum(makeScan(), ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
  });

  it("is case-insensitive for companyLocation matching", () => {
    const ctx = makeCtx({ jurisdiction: undefined, companyLocation: "berlin, germany" });
    const result = generateImpressum(makeScan(), ctx);
    assert.ok(result !== null);
  });

  // ── Required legal sections ────────────────────────────────────────
  it("includes Section 1: Angaben zum Diensteanbieter", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("## 1. Angaben zum Diensteanbieter"));
    assert.ok(result.includes("Handelsregister"));
    assert.ok(result.includes("USt-IdNr."));
  });

  it("includes Section 2: Vertreten durch", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("## 2. Vertreten durch"));
    assert.ok(result.includes("Geschäftsführer/in"));
  });

  it("includes Section 3: Kontakt", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("## 3. Kontakt"));
    assert.ok(result.includes("E-Mail:"));
    assert.ok(result.includes("Telefon:"));
    assert.ok(result.includes("Website:"));
  });

  it("includes Section 4: Verantwortlich für den Inhalt nach MStV", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("## 4. Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV"));
  });

  it("includes Section 5: EU-Streitbeilegung with ODR link", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("## 5. EU-Streitbeilegung"));
    assert.ok(result.includes("https://ec.europa.eu/consumers/odr/"));
    assert.ok(result.includes("Online-Streitbeilegung"));
  });

  it("includes Section 6: Haftungsausschluss with subsections", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("## 6. Haftungsausschluss"));
    assert.ok(result.includes("### Haftung für Inhalte"));
    assert.ok(result.includes("### Haftung für Links"));
  });

  it("references DDG in liability section", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("§ 7 Abs. 1 DDG"));
    assert.ok(result.includes("§§ 8 bis 10 DDG"));
  });

  // ── Extras fields ──────────────────────────────────────────────────
  it("uses all extras fields when provided", () => {
    const extras = {
      companyName: "Acme GmbH",
      contactEmail: "legal@acme.de",
      address: "Hauptstraße 1, 10115 Berlin, Deutschland",
      phone: "+49 30 12345678",
      managingDirector: "Max Mustermann",
      tradeRegister: "HRB 12345, Amtsgericht Berlin",
      vatId: "DE123456789",
      website: "https://acme.de",
    };
    const result = generateImpressum(makeScan(), makeCtx(), extras)!;
    assert.ok(result.includes("Acme GmbH"));
    assert.ok(result.includes("legal@acme.de"));
    assert.ok(result.includes("Hauptstraße 1, 10115 Berlin, Deutschland"));
    assert.ok(result.includes("+49 30 12345678"));
    assert.ok(result.includes("Max Mustermann"));
    assert.ok(result.includes("HRB 12345, Amtsgericht Berlin"));
    assert.ok(result.includes("DE123456789"));
    assert.ok(result.includes("https://acme.de"));
  });

  it("extras companyName takes priority over context companyName", () => {
    const ctx = makeCtx({ companyName: "Context GmbH" });
    const extras = { companyName: "Extras GmbH", contactEmail: "e@e.de" };
    const result = generateImpressum(makeScan(), ctx, extras)!;
    assert.ok(result.includes("Extras GmbH"));
    assert.ok(!result.includes("Context GmbH"));
  });

  it("extras contactEmail takes priority over context contactEmail", () => {
    const ctx = makeCtx({ contactEmail: "ctx@test.de" });
    const extras = { companyName: "X", contactEmail: "extras@test.de" };
    const result = generateImpressum(makeScan(), ctx, extras)!;
    assert.ok(result.includes("extras@test.de"));
  });

  // ── Placeholder defaults ───────────────────────────────────────────
  it("uses German placeholders when extras are not provided", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("[Straße Nr., PLZ Ort, Deutschland]"));
    assert.ok(result.includes("[+49 XXX XXXXXXX]"));
    assert.ok(result.includes("[Geschäftsführer/in]"));
    assert.ok(result.includes("[HRB XXXXX, Amtsgericht Ort]"));
    assert.ok(result.includes("[DE XXXXXXXXX]"));
  });

  it("uses placeholder website when neither extras nor context provide it", () => {
    const ctx = makeCtx({ website: undefined });
    const result = generateImpressum(makeScan(), ctx)!;
    assert.ok(result.includes("[https://www.example.com]"));
  });

  it("uses context website when extras website is absent", () => {
    const ctx = makeCtx({ website: "https://ctx-site.de" });
    const result = generateImpressum(makeScan(), ctx)!;
    assert.ok(result.includes("https://ctx-site.de"));
  });

  it("uses placeholder Firmenname when no company name in either context or extras", () => {
    const ctx = makeCtx({ companyName: "" });
    const result = generateImpressum(makeScan(), ctx)!;
    assert.ok(result.includes("[Firmenname]"));
  });

  // ── Context fallbacks ──────────────────────────────────────────────
  it("falls back to context companyName and contactEmail when extras absent", () => {
    const ctx = makeCtx({ companyName: "Kontext GmbH", contactEmail: "kontext@test.de" });
    const result = generateImpressum(makeScan(), ctx)!;
    assert.ok(result.includes("Kontext GmbH"));
    assert.ok(result.includes("kontext@test.de"));
  });

  // ── Date ───────────────────────────────────────────────────────────
  it("includes current date", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    const today = new Date().toISOString().split("T")[0];
    assert.ok(result.includes(today));
  });

  it("labels date as Letzte Aktualisierung", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("Letzte Aktualisierung:"));
  });

  // ── Legal references ───────────────────────────────────────────────
  it("references § 5 DDG (Digitale-Dienste-Gesetz)", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("§ 5 DDG"));
    assert.ok(result.includes("Digitale-Dienste-Gesetz"));
  });

  it("references § 27a UStG for VAT ID", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("§ 27a UStG"));
  });

  it("references § 18 Abs. 2 MStV for content responsibility", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("§ 18 Abs. 2 MStV"));
  });

  // ── Legal review disclaimer ────────────────────────────────────────
  it("includes legal review disclaimer", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("ersetzt keine Rechtsberatung"));
    assert.ok(result.includes("Rechtsanwalt"));
  });

  it("mentions automatic generation in disclaimer", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("automatisch generiert"));
  });

  // ── Streitbeilegung details ────────────────────────────────────────
  it("states company is not obligated to participate in arbitration", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("nicht bereit oder verpflichtet"));
    assert.ok(result.includes("Verbraucherschlichtungsstelle"));
  });

  // ── Managing director appears in two sections ──────────────────────
  it("shows managing director in both Vertreten durch and Verantwortlich sections", () => {
    const extras = { companyName: "X", contactEmail: "x@x.de", managingDirector: "Dr. Schmidt" };
    const result = generateImpressum(makeScan(), makeCtx(), extras)!;
    const matches = result.split("Dr. Schmidt");
    // Should appear at least twice: once in Section 2, once in Section 4
    assert.ok(matches.length >= 3, "Managing director should appear at least twice in the document");
  });

  // ── Address appears in two sections ────────────────────────────────
  it("shows address in both company info and content responsibility sections", () => {
    const extras = { companyName: "X", contactEmail: "x@x.de", address: "Marktplatz 5, 70173 Stuttgart" };
    const result = generateImpressum(makeScan(), makeCtx(), extras)!;
    const matches = result.split("Marktplatz 5, 70173 Stuttgart");
    assert.ok(matches.length >= 3, "Address should appear at least twice in the document");
  });

  // ── Partial extras ─────────────────────────────────────────────────
  it("handles partial extras with only some fields provided", () => {
    const extras = { companyName: "Partial GmbH", contactEmail: "partial@test.de" };
    const result = generateImpressum(makeScan(), makeCtx(), extras)!;
    assert.ok(result.includes("Partial GmbH"));
    assert.ok(result.includes("partial@test.de"));
    // Other fields should fall back to placeholders
    assert.ok(result.includes("[Geschäftsführer/in]"));
    assert.ok(result.includes("[HRB XXXXX, Amtsgericht Ort]"));
  });

  // ── Haftung für Links content ──────────────────────────────────────
  it("disclaims responsibility for external links", () => {
    const result = generateImpressum(makeScan(), makeCtx())!;
    assert.ok(result.includes("Links zu externen Websites Dritter"));
    assert.ok(result.includes("keine Gewähr"));
  });
});
