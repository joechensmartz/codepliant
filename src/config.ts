import * as fs from "fs";
import * as path from "path";

export interface CodepliantConfig {
  companyName: string;
  contactEmail: string;
  website?: string;
  jurisdiction?: string;
  outputDir: string;
  excludeServices?: string[];
  confirmedServices?: string[];
  dpoName?: string;
  dpoEmail?: string;
  euRepresentative?: string;
  dataRetentionDays?: number;
  aiRiskLevel?: "minimal" | "limited" | "high";
  aiUsageDescription?: string;
  jurisdictions?: string[];
  companyLocation?: string;
  outputFormat?: "markdown" | "html" | "pdf" | "json" | "notion" | "confluence" | "wiki" | "docx" | "all";
  tollFreeNumber?: string;
  securityEmail?: string;
  bugBountyUrl?: string;
  sectionOverrides?: Record<string, string>;
  language?: string;
  plugins?: string[];
  generateEmployeeNotice?: boolean;
  webhookUrl?: string;
  licenseKey?: string;
}

export interface ConfigWarning {
  field: string;
  message: string;
}

const CONFIG_FILENAME = ".codepliantrc.json";
export const CONFIG_SCHEMA_FILENAME = "config-schema.json";

const DEFAULT_CONFIG: CodepliantConfig = {
  companyName: "[Your Company Name]",
  contactEmail: "[your-email@example.com]",
  outputDir: "legal",
};

const PLACEHOLDER_PATTERNS = [
  /^\[.*\]$/,          // [Your Company Name]
  /^your[- ]/i,        // your-email@example.com
  /example\.com$/i,    // anything@example.com
  /^TODO/i,
  /^CHANGEME/i,
  /^PLACEHOLDER/i,
];

export const VALID_JURISDICTIONS = ["GDPR", "CCPA", "UK GDPR"] as const;
export const VALID_OUTPUT_FORMATS = ["markdown", "html", "pdf", "json", "notion", "confluence", "wiki", "docx", "all"] as const;
export const VALID_LANGUAGES = ["en", "de", "fr", "es"] as const;
export const VALID_AI_RISK_LEVELS = ["minimal", "limited", "high"] as const;

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value));
}

function looksLikeEmail(value: string): boolean {
  // Simple check: has @ with text on both sides and a dot after @
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Validate a config and return warnings (not errors).
 * The tool should still work with defaults when validation fails.
 */
export function validateConfig(config: CodepliantConfig): ConfigWarning[] {
  const warnings: ConfigWarning[] = [];

  // companyName: not empty or placeholder
  if (!config.companyName || config.companyName.trim().length === 0) {
    warnings.push({
      field: "companyName",
      message: "companyName is empty. Run 'codepliant init' to set it.",
    });
  } else if (isPlaceholder(config.companyName)) {
    warnings.push({
      field: "companyName",
      message: "companyName is still a placeholder. Run 'codepliant init' to set it.",
    });
  }

  // contactEmail: looks like a valid email, not placeholder
  if (!config.contactEmail || config.contactEmail.trim().length === 0) {
    warnings.push({
      field: "contactEmail",
      message: "contactEmail is empty. Run 'codepliant init' to set it.",
    });
  } else if (isPlaceholder(config.contactEmail)) {
    warnings.push({
      field: "contactEmail",
      message: "contactEmail is still a placeholder. Run 'codepliant init' to set it.",
    });
  } else if (!looksLikeEmail(config.contactEmail)) {
    warnings.push({
      field: "contactEmail",
      message: `contactEmail "${config.contactEmail}" doesn't look like a valid email address.`,
    });
  }

  // jurisdictions: only valid values
  if (config.jurisdictions && config.jurisdictions.length > 0) {
    const validSet = new Set<string>(VALID_JURISDICTIONS);
    const invalid = config.jurisdictions.filter((j) => !validSet.has(j));
    if (invalid.length > 0) {
      warnings.push({
        field: "jurisdictions",
        message: `Unknown jurisdiction(s): ${invalid.join(", ")}. Valid values: ${VALID_JURISDICTIONS.join(", ")}.`,
      });
    }
  }

  // outputFormat: valid option
  if (config.outputFormat !== undefined) {
    const validSet = new Set<string>(VALID_OUTPUT_FORMATS);
    if (!validSet.has(config.outputFormat)) {
      warnings.push({
        field: "outputFormat",
        message: `Invalid outputFormat "${config.outputFormat}". Valid values: ${VALID_OUTPUT_FORMATS.join(", ")}.`,
      });
    }
  }

  // language: supported
  if (config.language !== undefined) {
    const validSet = new Set<string>(VALID_LANGUAGES);
    if (!validSet.has(config.language)) {
      warnings.push({
        field: "language",
        message: `Unsupported language "${config.language}". Supported: ${VALID_LANGUAGES.join(", ")}.`,
      });
    }
  }

  // dataRetentionDays: positive number
  if (config.dataRetentionDays !== undefined) {
    if (typeof config.dataRetentionDays !== "number" || !Number.isFinite(config.dataRetentionDays)) {
      warnings.push({
        field: "dataRetentionDays",
        message: "dataRetentionDays must be a positive number.",
      });
    } else if (config.dataRetentionDays <= 0) {
      warnings.push({
        field: "dataRetentionDays",
        message: `dataRetentionDays must be a positive number, got ${config.dataRetentionDays}.`,
      });
    }
  }

  // aiRiskLevel: valid enum
  if (config.aiRiskLevel !== undefined) {
    const validSet = new Set<string>(VALID_AI_RISK_LEVELS);
    if (!validSet.has(config.aiRiskLevel)) {
      warnings.push({
        field: "aiRiskLevel",
        message: `Invalid aiRiskLevel "${config.aiRiskLevel}". Valid values: ${VALID_AI_RISK_LEVELS.join(", ")}.`,
      });
    }
  }

  return warnings;
}

export function loadConfig(projectPath: string): CodepliantConfig {
  const configPath = path.join(projectPath, CONFIG_FILENAME);

  if (!fs.existsSync(configPath)) {
    return { ...DEFAULT_CONFIG };
  }

  let content: string;
  try {
    content = fs.readFileSync(configPath, "utf-8");
  } catch {
    return { ...DEFAULT_CONFIG };
  }

  // Handle empty config file
  if (content.trim().length === 0) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const raw = JSON.parse(content);
    return { ...DEFAULT_CONFIG, ...raw };
  } catch (err) {
    // Provide actionable error message with line number and context
    if (err instanceof SyntaxError) {
      const posMatch = err.message.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const lines = content.substring(0, pos).split("\n");
        const line = lines.length;
        const col = (lines[lines.length - 1]?.length || 0) + 1;
        const snippet = content.split("\n")[line - 1]?.trim() || "";
        console.error(`Warning: Config file ${CONFIG_FILENAME} has invalid JSON at line ${line}, column ${col}.`);
        if (snippet) console.error(`  Near: ${snippet}`);
        console.error(`  Fix: Check for missing commas, quotes, or brackets at that location. Using defaults.`);
      } else {
        console.error(`Warning: Config file ${CONFIG_FILENAME} has invalid JSON. Check syntax and try again. Using defaults.`);
      }
    }
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(
  projectPath: string,
  config: CodepliantConfig
): string {
  const configPath = path.join(projectPath, CONFIG_FILENAME);
  // Add $schema reference for IDE autocompletion
  const withSchema = {
    $schema: "./config-schema.json",
    ...config,
  };
  fs.writeFileSync(configPath, JSON.stringify(withSchema, null, 2) + "\n", "utf-8");
  return configPath;
}

export function configExists(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, CONFIG_FILENAME));
}
