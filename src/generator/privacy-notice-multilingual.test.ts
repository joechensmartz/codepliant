import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { ScanResult, DetectedService } from "../scanner/types.js";
import { generatePrivacyNoticeMultilingual } from "./privacy-notice-multilingual.js";
import type { GeneratorContext } from "./index.js";

function makeService(
  name: string,
  category: DetectedService["category"],
  dataCollected: string[] = ["test data"],
  isDataProcessor?: boolean,
): DetectedService {
  return {
    name,
    category,
    evidence: [{ type: "dependency", file: "package.json", detail: `${name} detected` }],
    dataCollected,
    ...(isDataProcessor !== undefined ? { isDataProcessor } : {}),
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

// ── Empty / null returns ──────────────────────────────────────────────

describe("generatePrivacyNoticeMultilingual", () => {
  it("returns empty array when no services are present", () => {
    const scan = makeScan({ services: [] });
    const result = generatePrivacyNoticeMultilingual(scan);
    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 0);
  });

  // ── Basic generation ────────────────────────────────────────────────

  it("generates exactly 3 documents when services are present", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    assert.strictEqual(result.length, 3);
  });

  it("generates German document (PRIVACY_NOTICE_DE.md)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md");
    assert.ok(de !== undefined);
    assert.ok(de.name.includes("Deutsch"));
    assert.ok(de.content.includes("Datenschutz"));
  });

  it("generates French document (PRIVACY_NOTICE_FR.md)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md");
    assert.ok(fr !== undefined);
    assert.ok(fr.name.includes("Français"));
    assert.ok(fr.content.includes("confidentialité"));
  });

  it("generates Spanish document (PRIVACY_NOTICE_ES.md)", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md");
    assert.ok(es !== undefined);
    assert.ok(es.name.includes("Español"));
    assert.ok(es.content.includes("privacidad"));
  });

  // ── Context values ──────────────────────────────────────────────────

  it("uses context company name in all languages", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme Corp", contactEmail: "info@acme.com" };
    const result = generatePrivacyNoticeMultilingual(scan, ctx);
    for (const doc of result) {
      assert.ok(doc.content.includes("Acme Corp"), `${doc.filename} should include company name`);
    }
  });

  it("uses placeholder company name when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    for (const doc of result) {
      assert.ok(doc.content.includes("[Your Company Name]"), `${doc.filename} should include placeholder`);
    }
  });

  it("uses context contact email in all languages", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const ctx: GeneratorContext = { companyName: "Acme", contactEmail: "privacy@acme.com" };
    const result = generatePrivacyNoticeMultilingual(scan, ctx);
    for (const doc of result) {
      assert.ok(doc.content.includes("privacy@acme.com"), `${doc.filename} should include email`);
    }
  });

  it("uses placeholder email when no context", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    for (const doc of result) {
      assert.ok(doc.content.includes("[your-email@example.com]"), `${doc.filename} should include placeholder email`);
    }
  });

  it("includes date in YYYY-MM-DD format", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    for (const doc of result) {
      assert.ok(/\d{4}-\d{2}-\d{2}/.test(doc.content), `${doc.filename} should include date`);
    }
  });

  // ── Category-specific collection bullets ────────────────────────────

  it("includes auth category bullets when auth services detected", () => {
    const scan = makeScan({
      services: [makeService("firebase-auth", "auth", ["email addresses"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("E-Mail-Adresse und Kontoinformationen"));
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("Adresse e-mail et informations de compte"));
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Correo electrónico e información de cuenta"));
  });

  it("includes payment category bullets when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Zahlungsinformationen"));
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("Informations de paiement"));
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Datos de pago"));
  });

  it("includes analytics category bullets when analytics services detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Nutzungsdaten"));
  });

  it("includes AI category bullets when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("KI-Funktionen"));
  });

  it("includes monitoring category bullets when monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring", ["error reports"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Technische Informationen"));
  });

  it("uses fallback collection bullet when no matching categories", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Grundlegende Konto- und Nutzungsinformationen"));
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("Informations de base sur le compte"));
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Información básica de cuenta y uso"));
  });

  // ── Purpose bullets ─────────────────────────────────────────────────

  it("always includes base purpose bullet", () => {
    const scan = makeScan({
      services: [makeService("prisma", "database", ["user records"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Bereitstellung und Betrieb unseres Dienstes"));
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("Fournir et exploiter notre service"));
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Proporcionar y operar nuestro servicio"));
  });

  it("includes payment purpose when payment services detected", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Zahlungen verarbeiten"));
  });

  it("includes analytics purpose when analytics services detected", () => {
    const scan = makeScan({
      services: [makeService("posthog", "analytics", ["page views"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("Comprendre les habitudes"));
  });

  it("includes AI purpose when AI services detected", () => {
    const scan = makeScan({
      services: [makeService("openai", "ai", ["user prompts"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Proporcionar funciones de IA"));
  });

  it("includes monitoring purpose when monitoring services detected", () => {
    const scan = makeScan({
      services: [makeService("sentry", "monitoring", ["error reports"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Technische Probleme finden und beheben"));
  });

  // ── Sharing section ─────────────────────────────────────────────────

  it("includes service provider names in sharing section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
      ],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Dienstleister"));
    assert.ok(de.content.includes("stripe"));
  });

  it("includes law enforcement sharing bullet in each language", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Strafverfolgungsbehörden"));
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("autorités judiciaires"));
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Autoridades judiciales"));
  });

  it("includes never-sell statement in each language", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("niemals"));
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("jamais"));
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Nunca"));
  });

  // ── Rights section ──────────────────────────────────────────────────

  it("includes user rights in German", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Ihre Rechte"));
    assert.ok(de.content.includes("Auskunft über Ihre gespeicherten Daten"));
    assert.ok(de.content.includes("Löschung Ihrer Daten"));
  });

  it("includes user rights in French", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("Vos droits"));
    assert.ok(fr.content.includes("Demander l\u2019acc\u00e8s \u00e0 vos donn\u00e9es"));
  });

  it("includes user rights in Spanish", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Sus derechos"));
    assert.ok(es.content.includes("Solicitar acceso a sus datos"));
  });

  // ── Learn more / links ──────────────────────────────────────────────

  it("includes links to Privacy Policy, Terms, and Security in each language", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    for (const doc of result) {
      assert.ok(doc.content.includes("PRIVACY_POLICY.md"), `${doc.filename} should link to privacy policy`);
      assert.ok(doc.content.includes("TERMS_OF_SERVICE.md"), `${doc.filename} should link to terms`);
      assert.ok(doc.content.includes("SECURITY.md"), `${doc.filename} should link to security`);
    }
  });

  // ── Disclaimer ──────────────────────────────────────────────────────

  it("includes disclaimer in German", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Haftungsausschluss"));
    assert.ok(de.content.includes("Codepliant"));
  });

  it("includes disclaimer in French", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const fr = result.find((d) => d.filename === "PRIVACY_NOTICE_FR.md")!;
    assert.ok(fr.content.includes("Avertissement"));
    assert.ok(fr.content.includes("Codepliant"));
  });

  it("includes disclaimer in Spanish", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const es = result.find((d) => d.filename === "PRIVACY_NOTICE_ES.md")!;
    assert.ok(es.content.includes("Aviso"));
    assert.ok(es.content.includes("Codepliant"));
  });

  // ── Multiple categories ─────────────────────────────────────────────

  it("includes multiple category bullets when multiple service types detected", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"]),
        makeService("posthog", "analytics", ["page views"]),
        makeService("openai", "ai", ["user prompts"]),
        makeService("sentry", "monitoring", ["error reports"]),
      ],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("Zahlungsinformationen"));
    assert.ok(de.content.includes("Nutzungsdaten"));
    assert.ok(de.content.includes("KI-Funktionen"));
    assert.ok(de.content.includes("Technische Informationen"));
  });

  // ── Sharing with >5 processors ─────────────────────────────────────

  it("truncates processor list to 5 and shows count for extras", () => {
    const scan = makeScan({
      services: [
        makeService("svc1", "payment", ["data"]),
        makeService("svc2", "analytics", ["data"]),
        makeService("svc3", "ai", ["data"]),
        makeService("svc4", "monitoring", ["data"]),
        makeService("svc5", "auth", ["data"]),
        makeService("svc6", "email", ["data"]),
        makeService("svc7", "database", ["data"]),
      ],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("+2"));
  });

  // ── Processors with isDataProcessor=false ───────────────────────────

  it("excludes services with isDataProcessor=false from sharing section", () => {
    const scan = makeScan({
      services: [
        makeService("stripe", "payment", ["payment info"], true),
        makeService("internal-db", "database", ["user records"], false),
      ],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    const de = result.find((d) => d.filename === "PRIVACY_NOTICE_DE.md")!;
    assert.ok(de.content.includes("stripe"));
    // internal-db should not appear in the service provider list
    assert.ok(!de.content.includes("internal-db"));
  });

  // ── Intro references full English policy ────────────────────────────

  it("includes reference to full English privacy policy in intro", () => {
    const scan = makeScan({
      services: [makeService("stripe", "payment", ["payment info"])],
    });
    const result = generatePrivacyNoticeMultilingual(scan);
    for (const doc of result) {
      assert.ok(doc.content.includes("PRIVACY_POLICY.md"), `${doc.filename} should reference English policy`);
    }
  });
});
