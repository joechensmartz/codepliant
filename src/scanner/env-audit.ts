import * as fs from "fs";
import * as path from "path";
import { walkDirectory, ALL_EXTENSIONS, type WalkedFile } from "./file-walker.js";
import { generateSecretsAuditSection } from "./secrets-scanner.js";

// ── Types ──────────────────────────────────────────────────────────────────

export type EnvVarCategory =
  | "secret"
  | "database"
  | "service-config"
  | "public"
  | "other";

export interface EnvVarEntry {
  name: string;
  category: EnvVarCategory;
  /** Which files define or reference this variable */
  foundIn: string[];
  /** Whether the var has an actual value (not empty / placeholder) */
  hasValue: boolean;
}

export type RiskSeverity = "high" | "medium" | "low";

export interface SecurityRisk {
  severity: RiskSeverity;
  message: string;
}

export interface EnvAuditResult {
  vars: EnvVarEntry[];
  risks: SecurityRisk[];
}

// ── Classification helpers ─────────────────────────────────────────────────

const SECRET_PATTERNS = /KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL|AUTH_TOKEN/i;
const DATABASE_PATTERNS = /DATABASE|MONGO|REDIS|POSTGRES|MYSQL|SUPABASE_URL|PRISMA/i;
const SERVICE_CONFIG_PATTERNS = /URL|HOST|PORT|ENDPOINT|DOMAIN|ORIGIN/i;
const PUBLIC_PREFIXES = ["NEXT_PUBLIC_", "VITE_", "REACT_APP_", "NUXT_PUBLIC_", "EXPO_PUBLIC_"];

export function categorizeEnvVar(name: string): EnvVarCategory {
  // Public prefix takes highest priority
  if (PUBLIC_PREFIXES.some((p) => name.startsWith(p))) {
    return "public";
  }
  if (SECRET_PATTERNS.test(name)) {
    return "secret";
  }
  if (DATABASE_PATTERNS.test(name)) {
    return "database";
  }
  if (SERVICE_CONFIG_PATTERNS.test(name)) {
    return "service-config";
  }
  return "other";
}

// ── Env file parsing ───────────────────────────────────────────────────────

const ENV_FILE_GLOBS = [
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.staging",
  ".env.test",
  ".env.example",
];

interface ParsedEnvVar {
  name: string;
  value: string;
  file: string;
}

function parseEnvFile(filePath: string, relName: string): ParsedEnvVar[] {
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    return [];
  }

  const results: ParsedEnvVar[] = [];
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const name = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (name) {
      results.push({ name, value, file: relName });
    }
  }
  return results;
}

// ── Code scanning for process.env / import.meta.env usage ──────────────────

const ENV_USAGE_PATTERNS = [
  /process\.env\.([A-Z_][A-Z0-9_]*)/g,
  /import\.meta\.env\.([A-Z_][A-Z0-9_]*)/g,
  /os\.environ(?:\.get)?\s*\(\s*['"]([A-Z_][A-Z0-9_]*)['"]/g,
  /ENV\s*\[\s*['"]([A-Z_][A-Z0-9_]*)['"]\s*\]/g,
  /os\.Getenv\s*\(\s*"([A-Z_][A-Z0-9_]*)"\s*\)/g,
];

function scanCodeForEnvUsage(
  projectPath: string,
  files: WalkedFile[]
): Map<string, string[]> {
  const usageMap = new Map<string, string[]>();

  for (const file of files) {
    let content: string;
    try {
      content = fs.readFileSync(file.fullPath, "utf-8");
    } catch {
      continue;
    }

    const relFile = file.relativePath;

    for (const pattern of ENV_USAGE_PATTERNS) {
      // Reset lastIndex since these are global regexes
      const regex = new RegExp(pattern.source, pattern.flags);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content)) !== null) {
        const varName = match[1];
        const existing = usageMap.get(varName);
        if (existing) {
          if (!existing.includes(relFile)) {
            existing.push(relFile);
          }
        } else {
          usageMap.set(varName, [relFile]);
        }
      }
    }
  }

  return usageMap;
}

// ── Risk detection ─────────────────────────────────────────────────────────

function detectRisks(
  vars: EnvVarEntry[],
  envFileNames: string[],
  parsed: ParsedEnvVar[],
  projectPath: string
): SecurityRisk[] {
  const risks: SecurityRisk[] = [];

  // 1. Secrets in .env (should be in .env.local)
  const secretsInDotEnv = parsed.filter(
    (p) =>
      p.file === ".env" &&
      categorizeEnvVar(p.name) === "secret" &&
      p.value !== "" &&
      !p.value.startsWith("<") &&
      !p.value.startsWith("your-")
  );
  if (secretsInDotEnv.length > 0) {
    risks.push({
      severity: "high",
      message: `Secret values found in .env (should be in .env.local or .env.*.local): ${secretsInDotEnv.map((s) => s.name).join(", ")}`,
    });
  }

  // 2. Public env vars containing secret-looking values
  const suspiciousPublic = parsed.filter((p) => {
    if (!PUBLIC_PREFIXES.some((pfx) => p.name.startsWith(pfx))) return false;
    return SECRET_PATTERNS.test(p.name);
  });
  if (suspiciousPublic.length > 0) {
    risks.push({
      severity: "high",
      message: `Public env vars with secret-looking names (exposed to client): ${suspiciousPublic.map((s) => s.name).join(", ")}`,
    });
  }

  // 3. Missing .env.example (only flag if there are env vars to document)
  if (!envFileNames.includes(".env.example") && vars.length > 0) {
    risks.push({
      severity: "medium",
      message:
        "No .env.example file found. Create one to document required environment variables for new contributors.",
    });
  }

  // 4. .env not in .gitignore
  const gitignorePath = path.join(projectPath, ".gitignore");
  if (envFileNames.includes(".env")) {
    let envIgnored = false;
    if (fs.existsSync(gitignorePath)) {
      try {
        const gitignore = fs.readFileSync(gitignorePath, "utf-8");
        const lines = gitignore.split("\n").map((l) => l.trim());
        envIgnored = lines.some(
          (l) => l === ".env" || l === ".env*" || l === ".env.*" || l === "*.env"
        );
      } catch {
        // ignore
      }
    }
    if (!envIgnored) {
      risks.push({
        severity: "high",
        message:
          ".env file exists but is not listed in .gitignore. Secrets may be committed to version control.",
      });
    }
  }

  return risks;
}

// ── Main audit function ────────────────────────────────────────────────────

export function auditEnvVars(projectPath: string): EnvAuditResult {
  const absPath = path.resolve(projectPath);

  // 1. Parse all env files
  const allParsed: ParsedEnvVar[] = [];
  const foundEnvFiles: string[] = [];
  for (const envFile of ENV_FILE_GLOBS) {
    const fullPath = path.join(absPath, envFile);
    if (fs.existsSync(fullPath)) {
      foundEnvFiles.push(envFile);
      allParsed.push(...parseEnvFile(fullPath, envFile));
    }
  }

  // 2. Scan code files for env var usage
  const codeFiles = walkDirectory(absPath, { extensions: ALL_EXTENSIONS, skipTests: false });
  const codeUsage = scanCodeForEnvUsage(absPath, codeFiles);

  // 3. Merge into a unified list
  const varMap = new Map<string, EnvVarEntry>();

  for (const p of allParsed) {
    const existing = varMap.get(p.name);
    if (existing) {
      if (!existing.foundIn.includes(p.file)) {
        existing.foundIn.push(p.file);
      }
      if (p.value !== "") existing.hasValue = true;
    } else {
      varMap.set(p.name, {
        name: p.name,
        category: categorizeEnvVar(p.name),
        foundIn: [p.file],
        hasValue: p.value !== "",
      });
    }
  }

  for (const [varName, files] of codeUsage) {
    const existing = varMap.get(varName);
    if (existing) {
      for (const f of files) {
        if (!existing.foundIn.includes(f)) {
          existing.foundIn.push(f);
        }
      }
    } else {
      varMap.set(varName, {
        name: varName,
        category: categorizeEnvVar(varName),
        foundIn: files,
        hasValue: false,
      });
    }
  }

  const vars = Array.from(varMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // 4. Detect security risks
  const risks = detectRisks(vars, foundEnvFiles, allParsed, absPath);

  return { vars, risks };
}

// ── Document generation ────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<EnvVarCategory, string> = {
  secret: "API Key / Secret",
  database: "Database",
  "service-config": "Service Config",
  public: "Public / Client-side",
  other: "Other",
};

const SEVERITY_ICONS: Record<RiskSeverity, string> = {
  high: "CRITICAL",
  medium: "WARNING",
  low: "INFO",
};

export function generateEnvAudit(projectPath: string): string {
  const { vars, risks } = auditEnvVars(projectPath);

  if (vars.length === 0 && risks.length === 0) {
    return "";
  }

  const lines: string[] = [];

  lines.push("# Environment Variable Audit");
  lines.push("");
  lines.push(
    `> Generated on ${new Date().toISOString().split("T")[0]} — ${vars.length} variable(s) detected.`
  );
  lines.push("");

  // ── Security recommendations ──────────────────────────────────────────
  if (risks.length > 0) {
    lines.push("## Security Recommendations");
    lines.push("");
    for (const risk of risks) {
      lines.push(`- **[${SEVERITY_ICONS[risk.severity]}]** ${risk.message}`);
    }
    lines.push("");
  }

  // ── Variable table ────────────────────────────────────────────────────
  lines.push("## Environment Variables");
  lines.push("");

  // Group by category
  const grouped = new Map<EnvVarCategory, EnvVarEntry[]>();
  for (const v of vars) {
    const list = grouped.get(v.category) || [];
    list.push(v);
    grouped.set(v.category, list);
  }

  const categoryOrder: EnvVarCategory[] = [
    "secret",
    "database",
    "service-config",
    "public",
    "other",
  ];

  for (const cat of categoryOrder) {
    const entries = grouped.get(cat);
    if (!entries || entries.length === 0) continue;

    lines.push(`### ${CATEGORY_LABELS[cat]}`);
    lines.push("");
    lines.push("| Variable | Found In | Has Value |");
    lines.push("|----------|----------|-----------|");
    for (const entry of entries) {
      const foundIn = entry.foundIn.join(", ");
      const hasValue = entry.hasValue ? "Yes" : "No";
      lines.push(`| \`${entry.name}\` | ${foundIn} | ${hasValue} |`);
    }
    lines.push("");
  }

  // ── Missing documentation warnings ────────────────────────────────────
  const undocumented = vars.filter(
    (v) => !v.foundIn.includes(".env.example")
  );
  if (undocumented.length > 0) {
    lines.push("## Missing Documentation");
    lines.push("");
    lines.push(
      "The following variables are used but not listed in `.env.example`:"
    );
    lines.push("");
    for (const v of undocumented) {
      lines.push(`- \`${v.name}\``);
    }
    lines.push("");
  }

  // ── Hardcoded secrets scan ──────────────────────────────────────────────
  const secretsSection = generateSecretsAuditSection(projectPath);
  if (secretsSection) {
    lines.push(secretsSection);
  }

  lines.push("---");
  lines.push("");
  lines.push(
    "*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*"
  );
  lines.push("");

  return lines.join("\n");
}
