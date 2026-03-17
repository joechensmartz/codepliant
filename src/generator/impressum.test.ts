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
  it("returns null when jurisdiction is not EU/German", () => {
    const scan = makeScan({ services: [makeService("stripe", "payment")] });
    const ctx = makeCtx({ jurisdiction: "CCPA", jurisdictions: undefined });
    const result = generateImpressum(scan, ctx);
    assert.strictEqual(result, null);
  });

  it("returns null when jurisdiction is undefined and no German indicators", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: undefined, companyLocation: undefined });
    const result = generateImpressum(scan, ctx);
    assert.strictEqual(result, null);
  });

  it("generates Impressum when jurisdiction is GDPR", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: "GDPR" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
    assert.ok(result.includes("§ 5 DDG"));
    assert.ok(result.includes("Test GmbH"));
  });

  it("generates Impressum when jurisdictions array contains EU", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: undefined, jurisdictions: ["CCPA", "EU"] });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
  });

  it("generates Impressum when companyLocation includes Germany", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: undefined, companyLocation: "Berlin, Germany" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Impressum"));
  });

  it("generates Impressum when companyLocation includes Deutschland", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: undefined, companyLocation: "München, Deutschland" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
  });

  it("includes required sections: company info, contact, responsible person, dispute resolution", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: "GDPR" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Angaben zum Diensteanbieter"));
    assert.ok(result.includes("Kontakt"));
    assert.ok(result.includes("Vertreten durch"));
    assert.ok(result.includes("Verantwortlich für den Inhalt"));
    assert.ok(result.includes("Streitbeilegung"));
    assert.ok(result.includes("ec.europa.eu/consumers/odr"));
  });

  it("uses extras fields when provided", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: "GDPR" });
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
    const result = generateImpressum(scan, ctx, extras);
    assert.ok(result !== null);
    assert.ok(result.includes("Acme GmbH"));
    assert.ok(result.includes("legal@acme.de"));
    assert.ok(result.includes("Hauptstraße 1"));
    assert.ok(result.includes("+49 30 12345678"));
    assert.ok(result.includes("Max Mustermann"));
    assert.ok(result.includes("HRB 12345"));
    assert.ok(result.includes("DE123456789"));
    assert.ok(result.includes("https://acme.de"));
  });

  it("uses placeholders when extras are not provided", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: "GDPR" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("[Straße Nr., PLZ Ort, Deutschland]"));
    assert.ok(result.includes("[+49 XXX XXXXXXX]"));
    assert.ok(result.includes("[Geschäftsführer/in]"));
    assert.ok(result.includes("[HRB XXXXX, Amtsgericht Ort]"));
    assert.ok(result.includes("[DE XXXXXXXXX]"));
  });

  it("includes Haftungsausschluss (liability disclaimer) section", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: "GDPR" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Haftungsausschluss"));
    assert.ok(result.includes("Haftung für Inhalte"));
    assert.ok(result.includes("Haftung für Links"));
  });

  it("includes legal review disclaimer", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: "GDPR" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("ersetzt keine Rechtsberatung"));
  });

  it("falls back to context companyName and contactEmail when extras are absent", () => {
    const scan = makeScan();
    const ctx = makeCtx({ jurisdiction: "GDPR", companyName: "Kontext GmbH", contactEmail: "kontext@test.de" });
    const result = generateImpressum(scan, ctx);
    assert.ok(result !== null);
    assert.ok(result.includes("Kontext GmbH"));
    assert.ok(result.includes("kontext@test.de"));
  });
});
