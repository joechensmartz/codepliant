import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Configuration fields specific to an Impressum.
 * Fields not available on GeneratorContext are pulled from config extras
 * or left as placeholders.
 */
export interface ImpressumConfig {
  companyName: string;
  contactEmail: string;
  address?: string;
  phone?: string;
  managingDirector?: string;
  tradeRegister?: string;
  vatId?: string;
  website?: string;
}

const GERMAN_JURISDICTIONS = ["GDPR", "DE", "EU"];

/**
 * Returns true when the context indicates EU or German jurisdiction,
 * which is the trigger for generating an Impressum under Section 5 DDG
 * (formerly TMG).
 */
function isGermanJurisdiction(ctx: GeneratorContext): boolean {
  const j = ctx.jurisdiction?.toUpperCase() || "";
  const jList = ctx.jurisdictions?.map((x) => x.toUpperCase()) || [];
  const loc = ctx.companyLocation?.toUpperCase() || "";

  return (
    GERMAN_JURISDICTIONS.some((g) => j.includes(g)) ||
    jList.some((jj) => GERMAN_JURISDICTIONS.some((g) => jj.includes(g))) ||
    loc.includes("GERMANY") ||
    loc.includes("DEUTSCHLAND") ||
    loc.includes("DE")
  );
}

/**
 * Generates a German Impressum (legal disclosure) as required by
 * Section 5 DDG (Digitale-Dienste-Gesetz, formerly Section 5 TMG).
 *
 * Returns null when no EU/German jurisdiction is detected.
 */
export function generateImpressum(
  _scan: ScanResult,
  ctx: GeneratorContext,
  extras?: Partial<ImpressumConfig>,
): string | null {
  if (!isGermanJurisdiction(ctx)) {
    return null;
  }

  const company = extras?.companyName || ctx.companyName || "[Firmenname]";
  const email = extras?.contactEmail || ctx.contactEmail || "[kontakt@example.com]";
  const address = extras?.address || "[Straße Nr., PLZ Ort, Deutschland]";
  const phone = extras?.phone || "[+49 XXX XXXXXXX]";
  const managingDirector = extras?.managingDirector || "[Geschäftsführer/in]";
  const tradeRegister = extras?.tradeRegister || "[HRB XXXXX, Amtsgericht Ort]";
  const vatId = extras?.vatId || "[DE XXXXXXXXX]";
  const website = extras?.website || ctx.website || "[https://www.example.com]";

  const date = new Date().toISOString().split("T")[0];

  return `# Impressum

**Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)**

Letzte Aktualisierung: ${date}

---

## 1. Angaben zum Diensteanbieter

${company}
${address}

Handelsregister: ${tradeRegister}

USt-IdNr. gemäß § 27a UStG: ${vatId}

---

## 2. Vertreten durch

Geschäftsführer/in: ${managingDirector}

---

## 3. Kontakt

E-Mail: ${email}
Telefon: ${phone}
Website: ${website}

---

## 4. Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV

${managingDirector}
${address}

---

## 5. EU-Streitbeilegung

Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
[https://ec.europa.eu/consumers/odr/](https://ec.europa.eu/consumers/odr/)

Unsere E-Mail-Adresse finden Sie oben im Impressum.

Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.

---

## 6. Haftungsausschluss

### Haftung für Inhalte

Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
Tätigkeit hinweisen.

### Haftung für Links

Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
Seiten verantwortlich.

---

*Dieses Impressum wurde automatisch generiert und ersetzt keine Rechtsberatung. Bitte lassen Sie es von einem Rechtsanwalt prüfen.*
`;
}
