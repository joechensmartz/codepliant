import * as fs from "fs";
import * as path from "path";
import type { ScanResult, ComplianceNeed } from "../scanner/index.js";
import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Grade = "A" | "B" | "C" | "D" | "F";

export interface ScoreComponent {
  name: string;
  score: number;
  maxPoints: number;
  details: string[];
}

export interface ComplianceScore {
  /** Total score 0-100 */
  total: number;
  /** Letter grade */
  grade: Grade;
  /** Individual component breakdowns */
  components: ScoreComponent[];
  /** ISO timestamp of when the score was computed */
  computedAt: string;
  /** Per-regulation scores */
  regulationScores?: RegulationScore[];
  /** Trend comparison with previous scan */
  trend?: ScoreTrend;
  /** Actionable recommendations sorted by impact */
  recommendations?: Recommendation[];
}

export interface RegulationScore {
  regulation: string;
  score: number;
  maxPoints: number;
  grade: Grade;
  details: string[];
}

export interface ScoreTrend {
  previousScore: number | null;
  previousGrade: Grade | null;
  previousComputedAt: string | null;
  delta: number;
  direction: "improved" | "declined" | "unchanged" | "no-baseline";
}

export type RecommendationImpact = "critical" | "high" | "medium" | "low";

export interface Recommendation {
  title: string;
  description: string;
  impact: RecommendationImpact;
  /** Estimated score improvement if addressed */
  estimatedPointsGain: number;
  /** Which regulation(s) this addresses */
  regulations: string[];
}

export interface ScoreInput {
  scanResult: ScanResult;
  docs: GeneratedDocument[];
  config?: CodepliantConfig;
  outputDir: string;
  /** Override "now" for deterministic testing */
  now?: Date;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Required document names that feed into completeness scoring. */
const REQUIRED_DOCS: Record<string, string[]> = {
  "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
  "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
  "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
  "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
  "Data Processing Agreement": [
    "DATA_PROCESSING_AGREEMENT.md",
    "DATA_PROCESSING_AGREEMENT.html",
  ],
  "Security Policy": ["SECURITY.md"],
  "Incident Response Plan": ["INCIDENT_RESPONSE_PLAN.md"],
};

const PLACEHOLDER_PATTERNS = [
  /^\[.*\]$/,
  /^your[- ]/i,
  /example\.com$/i,
  /^TODO/i,
  /^CHANGEME/i,
  /^PLACEHOLDER/i,
];

function isPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((p) => p.test(value));
}

/** 30 days in milliseconds */
const FRESHNESS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Component scorers
// ---------------------------------------------------------------------------

/**
 * Document Completeness (40 points).
 * Ratio of generated/existing required docs to total required docs
 * (based on compliance needs from the scan).
 */
function scoreDocumentCompleteness(input: ScoreInput): ScoreComponent {
  const maxPoints = 40;
  const { scanResult, docs, outputDir } = input;

  const generatedNames = new Set(docs.map((d) => d.name));

  // Determine which documents are required for this project
  const neededDocs = scanResult.complianceNeeds.map((n) => n.document);
  // Deduplicate
  const uniqueNeeded = [...new Set(neededDocs)];

  if (uniqueNeeded.length === 0) {
    return {
      name: "Document Completeness",
      score: maxPoints,
      maxPoints,
      details: ["No compliance documents required"],
    };
  }

  let found = 0;
  const details: string[] = [];

  for (const docName of uniqueNeeded) {
    const filenames = REQUIRED_DOCS[docName];
    const inGenerated = generatedNames.has(docName);
    const onDisk =
      filenames?.some((f) => fs.existsSync(path.join(outputDir, f))) ?? false;

    if (inGenerated || onDisk) {
      found++;
    } else {
      details.push(`Missing: ${docName}`);
    }
  }

  const ratio = found / uniqueNeeded.length;
  const score = Math.round(ratio * maxPoints);

  if (details.length === 0) {
    details.push(`All ${uniqueNeeded.length} required documents present`);
  }

  return { name: "Document Completeness", score, maxPoints, details };
}

/**
 * Document Freshness (20 points).
 * Checks whether generated documents on disk were created/modified within the
 * last 30 days.
 */
function scoreDocumentFreshness(input: ScoreInput): ScoreComponent {
  const maxPoints = 20;
  const { outputDir, docs } = input;
  const now = input.now ?? new Date();

  if (docs.length === 0) {
    return {
      name: "Document Freshness",
      score: maxPoints,
      maxPoints,
      details: ["No documents to check"],
    };
  }

  let freshCount = 0;
  let checkedCount = 0;
  const details: string[] = [];

  for (const doc of docs) {
    // Check both categorized subdirectory and flat layout for backwards compatibility
    const category = doc.category;
    const categorizedPath = category ? path.join(outputDir, category, doc.filename) : null;
    const flatPath = path.join(outputDir, doc.filename);
    const filePath = (categorizedPath && fs.existsSync(categorizedPath)) ? categorizedPath : flatPath;
    if (!fs.existsSync(filePath)) continue;

    checkedCount++;
    try {
      const stat = fs.statSync(filePath);
      const ageMs = now.getTime() - stat.mtimeMs;
      if (ageMs <= FRESHNESS_WINDOW_MS) {
        freshCount++;
      } else {
        const ageDays = Math.round(ageMs / (24 * 60 * 60 * 1000));
        details.push(`Stale: ${doc.filename} (${ageDays} days old)`);
      }
    } catch {
      // If stat fails, skip
    }
  }

  if (checkedCount === 0) {
    // No docs on disk yet -- they were just generated, count as fresh
    return {
      name: "Document Freshness",
      score: maxPoints,
      maxPoints,
      details: ["Documents freshly generated"],
    };
  }

  const ratio = freshCount / checkedCount;
  const score = Math.round(ratio * maxPoints);

  if (details.length === 0) {
    details.push(`All ${checkedCount} documents generated within 30 days`);
  }

  return { name: "Document Freshness", score, maxPoints, details };
}

/**
 * Detection Coverage (15 points).
 * Ratio of detected services to total known services in the project.
 * A project with zero services gets full marks (nothing to detect).
 */
function scoreDetectionCoverage(input: ScoreInput): ScoreComponent {
  const maxPoints = 15;
  const { scanResult } = input;

  const totalServices = scanResult.services.length;

  if (totalServices === 0) {
    return {
      name: "Detection Coverage",
      score: maxPoints,
      maxPoints,
      details: ["No third-party services in project"],
    };
  }

  // Services with isDataProcessor !== false are meaningful detections
  const dataProcessors = scanResult.services.filter(
    (s) => s.isDataProcessor !== false
  );

  if (dataProcessors.length === 0) {
    return {
      name: "Detection Coverage",
      score: maxPoints,
      maxPoints,
      details: [
        `${totalServices} utility service(s) detected, no data processors`,
      ],
    };
  }

  // Score based on how many detected services have compliance docs addressing them.
  // Every data-processor service should be covered by at least one compliance doc.
  const coveredCategories = new Set<string>();
  const needDocs = new Set(scanResult.complianceNeeds.map((n) => n.document));

  // Map: if we have a Privacy Policy need and it exists, auth/analytics/ai/etc. categories are covered
  if (needDocs.has("Privacy Policy")) coveredCategories.add("all");
  if (needDocs.has("AI Disclosure")) coveredCategories.add("ai");
  if (needDocs.has("Cookie Policy")) {
    coveredCategories.add("analytics");
    coveredCategories.add("advertising");
  }

  // If compliance needs cover the project's service categories, full marks
  const uncoveredServices = dataProcessors.filter((s) => {
    if (coveredCategories.has("all")) return false;
    return !coveredCategories.has(s.category);
  });

  const coveredRatio =
    (dataProcessors.length - uncoveredServices.length) / dataProcessors.length;
  const score = Math.round(coveredRatio * maxPoints);

  const details: string[] = [
    `${dataProcessors.length} data processor(s) detected out of ${totalServices} total service(s)`,
  ];

  if (uncoveredServices.length > 0) {
    details.push(
      `${uncoveredServices.length} service(s) not covered by compliance docs`
    );
  }

  return { name: "Detection Coverage", score, maxPoints, details };
}

/**
 * Configuration Quality (10 points).
 * Checks that company info is real (not placeholder), DPO is set, and
 * jurisdictions are configured.
 */
function scoreConfigurationQuality(input: ScoreInput): ScoreComponent {
  const maxPoints = 10;
  const config = input.config;
  const details: string[] = [];
  let earned = 0;

  // Company name: 3 points
  if (
    config?.companyName &&
    config.companyName.trim().length > 0 &&
    !isPlaceholder(config.companyName)
  ) {
    earned += 3;
  } else {
    details.push("Company name is missing or placeholder");
  }

  // Contact email: 2 points
  if (
    config?.contactEmail &&
    config.contactEmail.trim().length > 0 &&
    !isPlaceholder(config.contactEmail)
  ) {
    earned += 2;
  } else {
    details.push("Contact email is missing or placeholder");
  }

  // DPO set: 3 points
  if (config?.dpoName && config?.dpoEmail) {
    earned += 3;
  } else {
    details.push("Data Protection Officer (DPO) not configured");
  }

  // Jurisdictions configured: 2 points
  if (config?.jurisdictions && config.jurisdictions.length > 0) {
    earned += 2;
  } else {
    details.push("No jurisdictions configured");
  }

  if (details.length === 0) {
    details.push("Configuration fully populated");
  }

  return {
    name: "Configuration Quality",
    score: earned,
    maxPoints,
    details,
  };
}

/**
 * Regulatory Coverage (15 points).
 * All applicable regulations (based on services + jurisdictions) are
 * addressed by generated documents.
 */
function scoreRegulatoryCoverage(input: ScoreInput): ScoreComponent {
  const maxPoints = 15;
  const { scanResult, docs } = input;

  const generatedNames = new Set(docs.map((d) => d.name));
  const hasAI = scanResult.services.some((s) => s.category === "ai");
  const hasAnalytics = scanResult.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasPayment = scanResult.services.some(
    (s) => s.category === "payment"
  );
  const hasServices = scanResult.services.length > 0;

  interface RegCheck {
    regulation: string;
    applies: boolean;
    requiredDocs: string[];
  }

  const checks: RegCheck[] = [
    {
      regulation: "GDPR",
      applies: hasServices,
      requiredDocs: ["Privacy Policy", "Data Processing Agreement"],
    },
    {
      regulation: "CCPA/CPRA",
      applies: hasServices,
      requiredDocs: ["Privacy Policy"],
    },
    {
      regulation: "EU AI Act",
      applies: hasAI,
      requiredDocs: ["AI Disclosure"],
    },
    {
      regulation: "ePrivacy Directive",
      applies: hasAnalytics,
      requiredDocs: ["Cookie Policy"],
    },
    {
      regulation: "PCI DSS",
      applies: hasPayment,
      requiredDocs: ["Security Policy"],
    },
  ];

  const applicableChecks = checks.filter((c) => c.applies);

  if (applicableChecks.length === 0) {
    return {
      name: "Regulatory Coverage",
      score: maxPoints,
      maxPoints,
      details: ["No specific regulations applicable"],
    };
  }

  let addressed = 0;
  const details: string[] = [];

  for (const check of applicableChecks) {
    const allPresent = check.requiredDocs.every((d) => generatedNames.has(d));
    if (allPresent) {
      addressed++;
    } else {
      const missing = check.requiredDocs.filter(
        (d) => !generatedNames.has(d)
      );
      details.push(`${check.regulation}: missing ${missing.join(", ")}`);
    }
  }

  const ratio = addressed / applicableChecks.length;
  const score = Math.round(ratio * maxPoints);

  if (details.length === 0) {
    details.push(
      `All ${applicableChecks.length} applicable regulation(s) addressed`
    );
  }

  return { name: "Regulatory Coverage", score, maxPoints, details };
}

// ---------------------------------------------------------------------------
// Per-regulation scoring
// ---------------------------------------------------------------------------

interface RegCheckDef {
  regulation: string;
  applies: (input: ScoreInput) => boolean;
  requiredDocs: string[];
  configChecks: ((input: ScoreInput) => { points: number; max: number; detail: string })[];
}

const REGULATION_DEFS: RegCheckDef[] = [
  {
    regulation: "GDPR",
    applies: (input) => input.scanResult.services.length > 0,
    requiredDocs: ["Privacy Policy", "Data Processing Agreement", "Data Flow Map", "DSAR Handling Guide"],
    configChecks: [
      (input) => {
        const hasDpo = !!(input.config?.dpoName && input.config?.dpoEmail);
        return { points: hasDpo ? 10 : 0, max: 10, detail: hasDpo ? "DPO configured" : "DPO not configured (GDPR Art. 37)" };
      },
      (input) => {
        const hasEUJurisdiction = input.config?.jurisdictions?.some(
          (j) => j.toUpperCase().includes("GDPR") || j.toUpperCase().includes("EU") || j.toUpperCase().includes("EEA")
        );
        return { points: hasEUJurisdiction ? 10 : 0, max: 10, detail: hasEUJurisdiction ? "EU jurisdiction configured" : "EU jurisdiction not declared" };
      },
    ],
  },
  {
    regulation: "CCPA/CPRA",
    applies: (input) => input.scanResult.services.length > 0,
    requiredDocs: ["Privacy Policy"],
    configChecks: [
      (input) => {
        const hasCCPA = input.config?.jurisdictions?.some(
          (j) => j.toUpperCase().includes("CCPA") || j.toUpperCase().includes("CPRA") || j.toUpperCase().includes("CALIFORNIA")
        );
        return { points: hasCCPA ? 15 : 0, max: 15, detail: hasCCPA ? "California jurisdiction configured" : "CCPA jurisdiction not declared" };
      },
      (input) => {
        const hasTollFree = !!input.config?.tollFreeNumber;
        return { points: hasTollFree ? 10 : 0, max: 10, detail: hasTollFree ? "Toll-free number provided" : "No toll-free number (CCPA § 1798.130 recommended)" };
      },
    ],
  },
  {
    regulation: "EU AI Act",
    applies: (input) => input.scanResult.services.some((s) => s.category === "ai"),
    requiredDocs: ["AI Disclosure", "AI Act Compliance Checklist"],
    configChecks: [
      (input) => {
        const hasRiskLevel = !!input.config?.aiRiskLevel;
        return { points: hasRiskLevel ? 15 : 0, max: 15, detail: hasRiskLevel ? `AI risk level set: ${input.config!.aiRiskLevel}` : "AI risk level not classified" };
      },
    ],
  },
  {
    regulation: "ePrivacy Directive",
    applies: (input) =>
      input.scanResult.services.some(
        (s) => s.category === "analytics" || s.category === "advertising"
      ),
    requiredDocs: ["Cookie Policy", "Cookie Inventory"],
    configChecks: [],
  },
  {
    regulation: "PCI DSS",
    applies: (input) => input.scanResult.services.some((s) => s.category === "payment"),
    requiredDocs: ["Security Policy"],
    configChecks: [
      (input) => {
        const hasSecurityEmail = !!input.config?.securityEmail;
        return { points: hasSecurityEmail ? 10 : 0, max: 10, detail: hasSecurityEmail ? "Security contact configured" : "No security contact email" };
      },
    ],
  },
];

function computeRegulationScores(input: ScoreInput): RegulationScore[] {
  const generatedNames = new Set(input.docs.map((d) => d.name));
  const scores: RegulationScore[] = [];

  for (const def of REGULATION_DEFS) {
    if (!def.applies(input)) continue;

    let totalPoints = 0;
    let maxPoints = 0;
    const details: string[] = [];

    // Document presence: each doc is worth equal share of 50 points
    const docPoints = def.requiredDocs.length > 0 ? Math.round(50 / def.requiredDocs.length) : 50;
    for (const docName of def.requiredDocs) {
      maxPoints += docPoints;
      if (generatedNames.has(docName)) {
        totalPoints += docPoints;
      } else {
        details.push(`Missing document: ${docName}`);
      }
    }

    // Config checks: remaining 50 points (or all 100 if no docs required)
    const configMaxBase = def.configChecks.length > 0
      ? def.configChecks.reduce((sum, check) => sum + check(input).max, 0)
      : 0;

    for (const check of def.configChecks) {
      const result = check(input);
      // Normalize config check points to fit within 50-point budget
      const normalizedMax = configMaxBase > 0 ? Math.round((result.max / configMaxBase) * 50) : 0;
      const normalizedPoints = configMaxBase > 0 ? Math.round((result.points / configMaxBase) * 50) : 0;
      maxPoints += normalizedMax;
      totalPoints += normalizedPoints;
      details.push(result.detail);
    }

    // If no config checks, add 50 to max and award based on doc coverage
    if (def.configChecks.length === 0) {
      maxPoints += 50;
      const docRatio = def.requiredDocs.length > 0
        ? def.requiredDocs.filter((d) => generatedNames.has(d)).length / def.requiredDocs.length
        : 1;
      totalPoints += Math.round(docRatio * 50);
    }

    // Normalize to 0-100
    const normalized = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 100;

    if (details.length === 0) {
      details.push("Fully addressed");
    }

    scores.push({
      regulation: def.regulation,
      score: normalized,
      maxPoints: 100,
      grade: gradeFromScore(normalized),
      details,
    });
  }

  return scores;
}

// ---------------------------------------------------------------------------
// Trend tracking
// ---------------------------------------------------------------------------

const SCORE_HISTORY_FILE = ".codepliant-scores.json";

interface ScoreHistoryEntry {
  total: number;
  grade: Grade;
  computedAt: string;
}

function loadPreviousScore(outputDir: string): ScoreHistoryEntry | null {
  const historyPath = path.join(outputDir, SCORE_HISTORY_FILE);
  if (!fs.existsSync(historyPath)) return null;

  try {
    const content = fs.readFileSync(historyPath, "utf-8");
    const entries: ScoreHistoryEntry[] = JSON.parse(content);
    if (Array.isArray(entries) && entries.length > 0) {
      return entries[entries.length - 1];
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveScoreHistory(outputDir: string, entry: ScoreHistoryEntry): void {
  const historyPath = path.join(outputDir, SCORE_HISTORY_FILE);
  let entries: ScoreHistoryEntry[] = [];

  if (fs.existsSync(historyPath)) {
    try {
      entries = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
      if (!Array.isArray(entries)) entries = [];
    } catch {
      entries = [];
    }
  }

  // Keep last 50 entries
  entries.push(entry);
  if (entries.length > 50) entries = entries.slice(-50);

  try {
    fs.writeFileSync(historyPath, JSON.stringify(entries, null, 2), "utf-8");
  } catch {
    // Silently fail — score history is optional
  }
}

function computeTrend(currentTotal: number, outputDir: string): ScoreTrend {
  const previous = loadPreviousScore(outputDir);

  if (!previous) {
    return {
      previousScore: null,
      previousGrade: null,
      previousComputedAt: null,
      delta: 0,
      direction: "no-baseline",
    };
  }

  const delta = currentTotal - previous.total;
  let direction: ScoreTrend["direction"];
  if (delta > 0) direction = "improved";
  else if (delta < 0) direction = "declined";
  else direction = "unchanged";

  return {
    previousScore: previous.total,
    previousGrade: previous.grade,
    previousComputedAt: previous.computedAt,
    delta,
    direction,
  };
}

// ---------------------------------------------------------------------------
// Recommendations engine
// ---------------------------------------------------------------------------

function generateRecommendations(input: ScoreInput, score: ComplianceScore): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const generatedNames = new Set(input.docs.map((d) => d.name));
  const config = input.config;
  const { scanResult } = input;

  const hasAI = scanResult.services.some((s) => s.category === "ai");
  const hasAnalytics = scanResult.services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasPayment = scanResult.services.some((s) => s.category === "payment");
  const hasServices = scanResult.services.length > 0;

  // Config-based recommendations
  if (!config?.companyName || isPlaceholder(config.companyName)) {
    recommendations.push({
      title: "Set company name in configuration",
      description: "Replace the placeholder company name with your actual organization name. This populates all generated compliance documents.",
      impact: "high",
      estimatedPointsGain: 3,
      regulations: ["GDPR", "CCPA/CPRA"],
    });
  }

  if (!config?.contactEmail || isPlaceholder(config.contactEmail)) {
    recommendations.push({
      title: "Set contact email in configuration",
      description: "Provide a real contact email for privacy and compliance inquiries. Required by GDPR Article 13.",
      impact: "high",
      estimatedPointsGain: 2,
      regulations: ["GDPR", "CCPA/CPRA"],
    });
  }

  if (!config?.dpoName || !config?.dpoEmail) {
    recommendations.push({
      title: "Configure Data Protection Officer (DPO)",
      description: "Designate a DPO and provide their contact information. Required by GDPR Article 37 for organizations that process personal data at scale.",
      impact: "high",
      estimatedPointsGain: 3,
      regulations: ["GDPR"],
    });
  }

  if (!config?.jurisdictions || config.jurisdictions.length === 0) {
    recommendations.push({
      title: "Declare applicable jurisdictions",
      description: "Configure which privacy regulations apply to your project (e.g., GDPR, CCPA). This enables jurisdiction-specific document generation.",
      impact: "medium",
      estimatedPointsGain: 2,
      regulations: ["GDPR", "CCPA/CPRA"],
    });
  }

  // Missing document recommendations
  if (hasServices && !generatedNames.has("Privacy Policy")) {
    recommendations.push({
      title: "Generate Privacy Policy",
      description: "A privacy policy is legally required when collecting user data. Run codepliant to generate one based on detected services.",
      impact: "critical",
      estimatedPointsGain: 15,
      regulations: ["GDPR", "CCPA/CPRA"],
    });
  }

  if (hasServices && !generatedNames.has("Data Processing Agreement")) {
    recommendations.push({
      title: "Generate Data Processing Agreement",
      description: "GDPR Article 28 requires a DPA with each third-party processor. Generate one to document your processor relationships.",
      impact: "high",
      estimatedPointsGain: 8,
      regulations: ["GDPR"],
    });
  }

  if (hasAI && !generatedNames.has("AI Disclosure")) {
    recommendations.push({
      title: "Generate AI Disclosure document",
      description: "The EU AI Act requires transparency about AI usage. Generate an AI Disclosure to document AI services, data processing, and risk classification.",
      impact: "critical",
      estimatedPointsGain: 10,
      regulations: ["EU AI Act"],
    });
  }

  if (hasAI && !config?.aiRiskLevel) {
    recommendations.push({
      title: "Classify AI risk level",
      description: "Set aiRiskLevel in your configuration (minimal, limited, or high). The EU AI Act imposes different requirements based on risk classification.",
      impact: "high",
      estimatedPointsGain: 5,
      regulations: ["EU AI Act"],
    });
  }

  if (hasAnalytics && !generatedNames.has("Cookie Policy")) {
    recommendations.push({
      title: "Generate Cookie Policy",
      description: "Analytics and advertising cookies require a Cookie Policy under the ePrivacy Directive. Generate one to document cookie usage and consent mechanisms.",
      impact: "critical",
      estimatedPointsGain: 10,
      regulations: ["ePrivacy Directive", "GDPR"],
    });
  }

  if (hasPayment && !config?.securityEmail) {
    recommendations.push({
      title: "Set security contact email",
      description: "PCI DSS requires a security contact for vulnerability disclosure. Set securityEmail in your configuration.",
      impact: "medium",
      estimatedPointsGain: 3,
      regulations: ["PCI DSS"],
    });
  }

  // Component-based recommendations
  const freshnessComp = score.components.find((c) => c.name === "Document Freshness");
  if (freshnessComp && freshnessComp.score < freshnessComp.maxPoints) {
    recommendations.push({
      title: "Re-generate stale compliance documents",
      description: "Some compliance documents are older than 30 days. Run codepliant again to refresh them with the latest scan results.",
      impact: "medium",
      estimatedPointsGain: freshnessComp.maxPoints - freshnessComp.score,
      regulations: ["GDPR", "CCPA/CPRA"],
    });
  }

  // Sort by impact (critical > high > medium > low), then by estimatedPointsGain descending
  const impactOrder: Record<RecommendationImpact, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recommendations.sort((a, b) => {
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;
    return b.estimatedPointsGain - a.estimatedPointsGain;
  });

  return recommendations;
}

// ---------------------------------------------------------------------------
// Grade computation
// ---------------------------------------------------------------------------

export function gradeFromScore(total: number): Grade {
  if (total >= 90) return "A";
  if (total >= 80) return "B";
  if (total >= 70) return "C";
  if (total >= 60) return "D";
  return "F";
}

// ---------------------------------------------------------------------------
// Main scoring function
// ---------------------------------------------------------------------------

/**
 * Compute a comprehensive compliance score from scan results, generated
 * documents, and project configuration.
 *
 * The score is composed of 5 weighted components totaling 100 points:
 * - Document Completeness (40 pts)
 * - Document Freshness (20 pts)
 * - Detection Coverage (15 pts)
 * - Configuration Quality (10 pts)
 * - Regulatory Coverage (15 pts)
 */
export function computeComplianceScore(input: ScoreInput): ComplianceScore {
  const components: ScoreComponent[] = [
    scoreDocumentCompleteness(input),
    scoreDocumentFreshness(input),
    scoreDetectionCoverage(input),
    scoreConfigurationQuality(input),
    scoreRegulatoryCoverage(input),
  ];

  const total = components.reduce((sum, c) => sum + c.score, 0);
  const grade = gradeFromScore(total);
  const computedAt = (input.now ?? new Date()).toISOString();

  // Per-regulation scores
  const regulationScores = computeRegulationScores(input);

  // Trend tracking
  const trend = computeTrend(total, input.outputDir);

  const baseScore: ComplianceScore = {
    total,
    grade,
    components,
    computedAt,
    regulationScores,
    trend,
  };

  // Generate recommendations
  baseScore.recommendations = generateRecommendations(input, baseScore);

  // Save score history for future trend tracking
  saveScoreHistory(input.outputDir, { total, grade, computedAt });

  return baseScore;
}

// ---------------------------------------------------------------------------
// Formatting helpers for CLI / dashboard / badge
// ---------------------------------------------------------------------------

/**
 * Render a plain-text score breakdown suitable for CLI output.
 */
export function formatScoreBreakdown(score: ComplianceScore): string {
  const lines: string[] = [];
  lines.push(`Compliance Score: ${score.total}/100 (${score.grade})`);

  // Trend
  if (score.trend && score.trend.direction !== "no-baseline") {
    const arrow = score.trend.direction === "improved" ? "+" : score.trend.direction === "declined" ? "" : "";
    lines.push(`  Trend: ${arrow}${score.trend.delta} points (${score.trend.direction} from ${score.trend.previousScore})`);
  }

  lines.push("");

  for (const comp of score.components) {
    lines.push(`  ${comp.name}: ${comp.score}/${comp.maxPoints}`);
    for (const detail of comp.details) {
      lines.push(`    - ${detail}`);
    }
  }

  // Per-regulation scores
  if (score.regulationScores && score.regulationScores.length > 0) {
    lines.push("");
    lines.push("  Per-Regulation Scores:");
    for (const reg of score.regulationScores) {
      lines.push(`    ${reg.regulation}: ${reg.score}/100 (${reg.grade})`);
    }
  }

  // Recommendations
  if (score.recommendations && score.recommendations.length > 0) {
    lines.push("");
    lines.push("  Recommendations (sorted by impact):");
    for (const rec of score.recommendations) {
      lines.push(`    [${rec.impact.toUpperCase()}] ${rec.title} (+${rec.estimatedPointsGain} pts)`);
    }
  }

  return lines.join("\n");
}

/**
 * Render score as a Markdown section suitable for the compliance report.
 */
export function formatScoreMarkdown(score: ComplianceScore): string {
  let md = `## Compliance Score\n\n`;
  md += `**${score.total}/100** (Grade: **${score.grade}**)\n\n`;

  // Trend
  if (score.trend && score.trend.direction !== "no-baseline") {
    const arrow = score.trend.direction === "improved" ? "+" : "";
    md += `**Trend:** ${arrow}${score.trend.delta} points (${score.trend.direction} from ${score.trend.previousScore})\n\n`;
  }

  md += `| Component | Score | Max | Details |\n`;
  md += `|-----------|-------|-----|----------|\n`;

  for (const comp of score.components) {
    const details = comp.details.join("; ");
    md += `| ${comp.name} | ${comp.score} | ${comp.maxPoints} | ${details} |\n`;
  }

  md += "\n";

  // Per-regulation scores
  if (score.regulationScores && score.regulationScores.length > 0) {
    md += `### Per-Regulation Scores\n\n`;
    md += `| Regulation | Score | Grade | Details |\n`;
    md += `|------------|-------|-------|----------|\n`;
    for (const reg of score.regulationScores) {
      const details = reg.details.join("; ");
      md += `| ${reg.regulation} | ${reg.score}/100 | ${reg.grade} | ${details} |\n`;
    }
    md += "\n";
  }

  // Recommendations
  if (score.recommendations && score.recommendations.length > 0) {
    md += `### Recommendations\n\n`;
    for (const rec of score.recommendations) {
      md += `- **[${rec.impact.toUpperCase()}]** ${rec.title} *(+${rec.estimatedPointsGain} pts)* — ${rec.description}\n`;
    }
    md += "\n";
  }

  return md;
}

/**
 * Return a badge-friendly color hex string based on the score.
 */
export function scoreColor(total: number): string {
  if (total >= 90) return "#4c1"; // green
  if (total >= 80) return "#97ca00"; // light green
  if (total >= 70) return "#dfb317"; // yellow
  if (total >= 60) return "#fe7d37"; // orange
  return "#e05d44"; // red
}

/**
 * Return a short status label for a score.
 */
export function scoreStatus(
  total: number
): { text: string; color: string } {
  const grade = gradeFromScore(total);
  const color = scoreColor(total);
  const textMap: Record<Grade, string> = {
    A: "excellent",
    B: "good",
    C: "fair",
    D: "needs work",
    F: "non-compliant",
  };
  return { text: textMap[grade], color };
}
