// Codepliant - Compliance documents from your code
// Public API for programmatic usage

export { scan } from "./scanner/index.js";
export type {
  ScanResult,
  DetectedService,
  ComplianceNeed,
  DataCategory,
} from "./scanner/index.js";

export { generateDocuments, writeDocuments } from "./generator/index.js";
export type { GeneratedDocument, GeneratorContext } from "./generator/index.js";

export { loadConfig, saveConfig, configExists, validateConfig } from "./config.js";
export type { CodepliantConfig, ConfigWarning } from "./config.js";

export { writeMarkdown, writeHtml, writeDocumentsInFormat, getOutputFormat, generateComplianceReport, writeComplianceReport, generateExecutiveSummary, writeExecutiveSummary } from "./output/index.js";
export type { OutputFormat, ComplianceReportOptions } from "./output/index.js";

export { generateBadge, writeBadges } from "./output/badge.js";
export type { BadgeResult } from "./output/badge.js";

export { generateEnvExample, writeEnvExample } from "./generator/env-example.js";

export { installHook, uninstallHook, getLefthookSnippet } from "./hook.js";
export type { HookInstallResult, HookUninstallResult } from "./hook.js";

export { renderTemplate, buildVariables, initTemplates, hasCustomTemplate, renderCustomTemplate, getTemplatesDir } from "./templates/engine.js";
export type { TemplateVariables } from "./templates/engine.js";

export { loadPlugins } from "./plugins/loader.js";
export type {
  CodepliantPlugin,
  CustomScanner,
  CustomGenerator,
  ServiceSignature,
} from "./plugins/index.js";

export {
  computeComplianceScore,
  gradeFromScore,
  formatScoreBreakdown,
  formatScoreMarkdown,
  scoreColor,
  scoreStatus,
} from "./scoring/index.js";
export type {
  ComplianceScore,
  ScoreComponent,
  ScoreInput,
  Grade,
} from "./scoring/index.js";

export { sendNotification, buildPayload, formatSlackMessage, postWebhook } from "./notifications/index.js";
export type { NotificationPayload, NotificationResult } from "./notifications/index.js";

export { scanLicenses, generateLicenseCompliance } from "./scanner/license-scanner.js";
export type { LicenseScanResult, LicenseInfo } from "./scanner/license-scanner.js";

export { generateWhistleblowerPolicy, requiresWhistleblowerPolicy } from "./generator/whistleblower.js";

export { generateDocx, writeDocx } from "./output/docx.js";

export { lintDocuments } from "./lint.js";
export type { LintResult, LintIssue } from "./lint.js";

export { reviewDocument, reviewDocuments, isReviewAvailable, formatReviewResults } from "./ai/review.js";
export type { ReviewSuggestion, ReviewResult, AIReviewConfig } from "./ai/review.js";

export { verifyServices, applyVerifications, isSuggestAvailable, formatVerifications } from "./ai/suggest.js";
export type { ServiceVerification, SuggestResult, AISuggestConfig } from "./ai/suggest.js";

export { generateRiskRegister } from "./generator/risk-register.js";

export { writeGithubWiki } from "./output/github-wiki.js";

export { generateTransparencyReport } from "./generator/transparency-report.js";

export { generateApiSpec, writeApiSpec } from "./cloud/compliance-api.js";
export type { GenerateApiSpecOptions } from "./cloud/compliance-api.js";

export { scheduleScans, unscheduleScans, getScheduleStatus, frequencyDescription } from "./cloud/schedule.js";
export type { ScheduleOptions, ScheduleResult, UnscheduleResult, ScheduleStatus, ScheduleFrequency } from "./cloud/schedule.js";

export { getBillingStatus, getBillingUsage, openBillingPortal } from "./cloud/billing.js";
export type { BillingStatus, BillingUsage, FeatureUsageStat, BillingPortalResult } from "./cloud/billing.js";

export {
  checkLicense,
  getLicenseInfo,
  hasFeatureAccess,
  getUpgradeHint,
  checkAndTrackFeature,
  trackFeatureUsage,
  loadUsage,
  resetUsage,
} from "./licensing/index.js";
export type { LicenseTier, LicenseInfo as LicensingLicenseInfo, LicensedFeature } from "./licensing/index.js";

export { generatePrivacyNoticeShort } from "./generator/privacy-notice-short.js";

export { generateCookieConsentConfig } from "./generator/cookie-consent-config.js";

export { scanGraphQLEndpoints } from "./scanner/graphql-endpoint-scanner.js";
export type { GraphQLEndpointResult, GraphQLEndpoint } from "./scanner/graphql-endpoint-scanner.js";

export {
  listAllSignatures,
  loadCustomSignatures,
  saveCustomSignatures,
  exportSignatures,
  importSignatures,
} from "./community/signatures-repo.js";
export type { CommunitySignature, SignatureRepo } from "./community/signatures-repo.js";

export { generateComplianceGapAnalysis } from "./generator/compliance-gap-analysis.js";
export { generateKeyPersonRiskAssessment } from "./generator/key-person-risk.js";

export { generateEULA } from "./generator/eula.js";
