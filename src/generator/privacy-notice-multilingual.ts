import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext, GeneratedDocument } from "./index.js";
import { t } from "../i18n/index.js";

/**
 * Generates simplified privacy notice stubs in German, French, and Spanish.
 *
 * Uses the existing i18n system for key terms and produces:
 *   - PRIVACY_NOTICE_DE.md (German / Deutsch)
 *   - PRIVACY_NOTICE_FR.md (French / Fran\u00e7ais)
 *   - PRIVACY_NOTICE_ES.md (Spanish / Espa\u00f1ol)
 *
 * These are short, plain-language notices designed for multilingual audiences.
 * They link back to the full English privacy policy for complete legal details.
 */

interface LangConfig {
  code: string;
  name: string;
  nativeName: string;
  filename: string;
  // Translated strings for the template
  title: string;
  lastUpdated: string;
  intro: string;
  whatWeCollect: string;
  whyWeCollect: string;
  whoWeShareWith: string;
  yourRights: string;
  contact: string;
  learnMore: string;
  disclaimer: string;
  neverSell: string;
  rightsList: string[];
  dataCollectFallback: string;
  purposeBase: string;
  sharingLaw: string;
}

const LANG_CONFIGS: LangConfig[] = [
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    filename: "PRIVACY_NOTICE_DE.md",
    title: "Datenschutzhinweis",
    lastUpdated: "Zuletzt aktualisiert",
    intro:
      "Dies ist eine vereinfachte Datenschutzerkl\u00e4rung. Die vollst\u00e4ndige rechtliche Datenschutzerkl\u00e4rung finden Sie in der [Privacy Policy](./PRIVACY_POLICY.md) (Englisch).",
    whatWeCollect: "Was wir erfassen",
    whyWeCollect: "Warum wir Daten erfassen",
    whoWeShareWith: "Mit wem wir Daten teilen",
    yourRights: "Ihre Rechte",
    contact: "Kontakt",
    learnMore: "Weitere Informationen",
    disclaimer:
      "Dieser Datenschutzhinweis wurde automatisch von Codepliant auf Basis einer Quellcodeanalyse erstellt. Er sollte von einem qualifizierten Rechtsberater \u00fcberpr\u00fcft werden.",
    neverSell: "Wir verkaufen Ihre personenbezogenen Daten **niemals**.",
    rightsList: [
      "Auskunft \u00fcber Ihre gespeicherten Daten verlangen",
      "Eine Kopie Ihrer Daten herunterladen",
      "L\u00f6schung Ihrer Daten beantragen",
      "Der nicht-wesentlichen Datenverarbeitung widersprechen",
      "Ihre Daten berichtigen lassen",
    ],
    dataCollectFallback: "Grundlegende Konto- und Nutzungsinformationen",
    purposeBase: "Bereitstellung und Betrieb unseres Dienstes",
    sharingLaw: "Strafverfolgungsbeh\u00f6rden nur bei gesetzlicher Verpflichtung",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Fran\u00e7ais",
    filename: "PRIVACY_NOTICE_FR.md",
    title: "Avis de confidentialit\u00e9",
    lastUpdated: "Derni\u00e8re mise \u00e0 jour",
    intro:
      "Ceci est un avis de confidentialit\u00e9 simplifi\u00e9. Pour la politique de confidentialit\u00e9 compl\u00e8te, consultez la [Privacy Policy](./PRIVACY_POLICY.md) (en anglais).",
    whatWeCollect: "Ce que nous collectons",
    whyWeCollect: "Pourquoi nous collectons vos donn\u00e9es",
    whoWeShareWith: "Avec qui nous partageons vos donn\u00e9es",
    yourRights: "Vos droits",
    contact: "Contact",
    learnMore: "En savoir plus",
    disclaimer:
      "Cet avis de confidentialit\u00e9 a \u00e9t\u00e9 g\u00e9n\u00e9r\u00e9 automatiquement par Codepliant \u00e0 partir d\u2019une analyse du code source. Il doit \u00eatre v\u00e9rifi\u00e9 par un conseiller juridique qualifi\u00e9.",
    neverSell: "Nous ne vendons **jamais** vos donn\u00e9es personnelles.",
    rightsList: [
      "Demander l\u2019acc\u00e8s \u00e0 vos donn\u00e9es",
      "T\u00e9l\u00e9charger une copie de vos donn\u00e9es",
      "Demander la suppression de vos donn\u00e9es",
      "Vous opposer au traitement non essentiel",
      "Faire rectifier vos donn\u00e9es",
    ],
    dataCollectFallback: "Informations de base sur le compte et l\u2019utilisation",
    purposeBase: "Fournir et exploiter notre service",
    sharingLaw: "Les autorit\u00e9s judiciaires, uniquement si la loi l\u2019exige",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Espa\u00f1ol",
    filename: "PRIVACY_NOTICE_ES.md",
    title: "Aviso de privacidad",
    lastUpdated: "\u00daltima actualizaci\u00f3n",
    intro:
      "Este es un aviso de privacidad simplificado. Para la pol\u00edtica de privacidad completa, consulte la [Privacy Policy](./PRIVACY_POLICY.md) (en ingl\u00e9s).",
    whatWeCollect: "Qu\u00e9 datos recopilamos",
    whyWeCollect: "Por qu\u00e9 recopilamos datos",
    whoWeShareWith: "Con qui\u00e9n compartimos sus datos",
    yourRights: "Sus derechos",
    contact: "Contacto",
    learnMore: "M\u00e1s informaci\u00f3n",
    disclaimer:
      "Este aviso de privacidad fue generado autom\u00e1ticamente por Codepliant a partir del an\u00e1lisis del c\u00f3digo fuente. Debe ser revisado por un asesor legal cualificado.",
    neverSell: "**Nunca** vendemos sus datos personales.",
    rightsList: [
      "Solicitar acceso a sus datos",
      "Descargar una copia de sus datos",
      "Solicitar la eliminaci\u00f3n de sus datos",
      "Oponerse al tratamiento no esencial",
      "Rectificar sus datos personales",
    ],
    dataCollectFallback: "Informaci\u00f3n b\u00e1sica de cuenta y uso",
    purposeBase: "Proporcionar y operar nuestro servicio",
    sharingLaw: "Autoridades judiciales, solo cuando la ley lo requiera",
  },
];

// Category-specific collection bullet translations
const CATEGORY_BULLETS: Record<string, Record<string, string>> = {
  auth: {
    de: "E-Mail-Adresse und Kontoinformationen bei Registrierung oder Anmeldung",
    fr: "Adresse e-mail et informations de compte lors de l\u2019inscription ou de la connexion",
    es: "Correo electr\u00f3nico e informaci\u00f3n de cuenta al registrarse o iniciar sesi\u00f3n",
  },
  payment: {
    de: "Zahlungsinformationen f\u00fcr Eink\u00e4ufe (sicher verarbeitet)",
    fr: "Informations de paiement pour les achats (trait\u00e9es de mani\u00e8re s\u00e9curis\u00e9e)",
    es: "Datos de pago para compras (procesados de forma segura)",
  },
  analytics: {
    de: "Nutzungsdaten (besuchte Seiten, verwendete Funktionen)",
    fr: "Donn\u00e9es d\u2019utilisation (pages visit\u00e9es, fonctionnalit\u00e9s utilis\u00e9es)",
    es: "Datos de uso (p\u00e1ginas visitadas, funciones utilizadas)",
  },
  ai: {
    de: "Inhalte, die Sie KI-Funktionen bereitstellen (Texte, Dateien)",
    fr: "Contenu fourni aux fonctions IA (textes, fichiers)",
    es: "Contenido proporcionado a funciones de IA (textos, archivos)",
  },
  monitoring: {
    de: "Technische Informationen wie Ger\u00e4tetyp und Fehlerberichte",
    fr: "Informations techniques comme le type d\u2019appareil et les rapports d\u2019erreur",
    es: "Informaci\u00f3n t\u00e9cnica como tipo de dispositivo e informes de errores",
  },
  email: {
    de: "E-Mail-Adresse f\u00fcr Kontobenachrichtigungen",
    fr: "Adresse e-mail pour les notifications de compte",
    es: "Correo electr\u00f3nico para notificaciones de cuenta",
  },
};

// Purpose bullets per category per language
const PURPOSE_BULLETS: Record<string, Record<string, string>> = {
  payment: {
    de: "Zahlungen verarbeiten",
    fr: "Traiter les paiements",
    es: "Procesar pagos",
  },
  analytics: {
    de: "Nutzungsmuster verstehen und das Produkt verbessern",
    fr: "Comprendre les habitudes d\u2019utilisation et am\u00e9liorer le produit",
    es: "Comprender patrones de uso y mejorar el producto",
  },
  ai: {
    de: "KI-Funktionen bereitstellen, die Sie nutzen",
    fr: "Fournir les fonctionnalit\u00e9s IA que vous utilisez",
    es: "Proporcionar funciones de IA que usted utiliza",
  },
  monitoring: {
    de: "Technische Probleme finden und beheben",
    fr: "D\u00e9tecter et r\u00e9soudre les probl\u00e8mes techniques",
    es: "Detectar y resolver problemas t\u00e9cnicos",
  },
};

export function generatePrivacyNoticeMultilingual(
  scan: ScanResult,
  ctx?: GeneratorContext,
): GeneratedDocument[] {
  if (scan.services.length === 0) return [];

  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Detect active categories
  const activeCategories = new Set<string>(scan.services.map((s) => s.category));

  const docs: GeneratedDocument[] = [];

  for (const lang of LANG_CONFIGS) {
    // Build collection bullets
    const collectBullets: string[] = [];
    for (const cat of ["auth", "payment", "analytics", "ai", "monitoring", "email"]) {
      if (activeCategories.has(cat) && CATEGORY_BULLETS[cat]?.[lang.code]) {
        collectBullets.push(CATEGORY_BULLETS[cat][lang.code]);
      }
    }
    if (collectBullets.length === 0) {
      collectBullets.push(lang.dataCollectFallback);
    }

    // Build purpose bullets
    const purposeBullets: string[] = [lang.purposeBase];
    for (const cat of ["payment", "analytics", "ai", "monitoring"]) {
      if (activeCategories.has(cat) && PURPOSE_BULLETS[cat]?.[lang.code]) {
        purposeBullets.push(PURPOSE_BULLETS[cat][lang.code]);
      }
    }

    // Build sharing bullets
    const sharingBullets: string[] = [];
    const processors = scan.services.filter((s) => s.isDataProcessor !== false);
    if (processors.length > 0) {
      const names = processors.map((s) => s.name).slice(0, 5).join(", ");
      const more = processors.length > 5 ? ` +${processors.length - 5}` : "";
      const serviceProviderLabel: Record<string, string> = {
        de: "Dienstleister",
        fr: "Prestataires de services",
        es: "Proveedores de servicios",
      };
      sharingBullets.push(`${serviceProviderLabel[lang.code]}: ${names}${more}`);
    }
    sharingBullets.push(lang.sharingLaw);

    // Try i18n translation for document title (fallback to hardcoded)
    const translatedTitle = t("privacy_notice_title", lang.code);
    const title = translatedTitle !== "privacy_notice_title" ? translatedTitle : lang.title;

    const content = `# ${title} — ${company}

**${lang.lastUpdated}:** ${date}

> ${lang.intro}

---

## ${lang.whatWeCollect}

- ${collectBullets.join("\n- ")}

## ${lang.whyWeCollect}

- ${purposeBullets.join("\n- ")}

## ${lang.whoWeShareWith}

- ${sharingBullets.join("\n- ")}

${lang.neverSell}

## ${lang.yourRights}

- ${lang.rightsList.join("\n- ")}

## ${lang.contact}

**${email}**

## ${lang.learnMore}

- [Privacy Policy](./PRIVACY_POLICY.md) — ${lang.code === "de" ? "Vollst\u00e4ndige Datenschutzerkl\u00e4rung (Englisch)" : lang.code === "fr" ? "Politique de confidentialit\u00e9 compl\u00e8te (en anglais)" : "Pol\u00edtica de privacidad completa (en ingl\u00e9s)"}
- [Terms of Service](./TERMS_OF_SERVICE.md)
- [Security Policy](./SECURITY.md)

---

> **${lang.code === "de" ? "Haftungsausschluss" : lang.code === "fr" ? "Avertissement" : "Aviso"}:** ${lang.disclaimer}
`;

    docs.push({
      name: `Privacy Notice (${lang.nativeName})`,
      filename: lang.filename,
      content,
    });
  }

  return docs;
}
