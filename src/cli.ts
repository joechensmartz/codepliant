#!/usr/bin/env node

import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";
import { scan } from "./scanner/index.js";
import { generateDocuments, writeDocuments, getDocumentCategory } from "./generator/index.js";
import { loadConfig, saveConfig, configExists, validateConfig, VALID_JURISDICTIONS, type CodepliantConfig } from "./config.js";
import { writeDocumentsInFormat, getOutputFormat, getLastPdfResult, writeCompliancePage, writeComplianceReport, writeExecutiveSummary, type OutputFormat } from "./output/index.js";
import { generateCompliancePage } from "./output/compliance-page.js";
import { writeBadges } from "./output/badge.js";
import { diffDocuments, appendChangelog } from "./output/diff.js";
import { SERVICE_SIGNATURES } from "./scanner/types.js";
import { installHook, uninstallHook, getLefthookSnippet } from "./hook.js";
import { loadPlugins } from "./plugins/loader.js";
import type { CodepliantPlugin } from "./plugins/index.js";
import type { ScanResult, ScanTimings } from "./scanner/index.js";
import { generateEnvExample, writeEnvExample } from "./generator/env-example.js";
import { generateSbom, writeSbom } from "./generator/sbom.js";
import { generateQuickStartGuide } from "./generator/quick-start-guide.js";
import { initTemplates, getTemplatesDir } from "./templates/engine.js";
import { startServer } from "./api/server.js";
import { sendNotification, buildPayload } from "./notifications/index.js";
import { discoverProjects, type DiscoveredProject } from "./scanner/discover.js";
import { listAllSignatures, exportSignatures, importSignatures } from "./community/signatures-repo.js";
import { writeGithubWiki } from "./output/github-wiki.js";
import { writeGithubPages } from "./output/github-pages.js";
import { reviewDocuments, formatReviewResults, isReviewAvailable, type AIReviewConfig } from "./ai/review.js";
import { lintDocuments } from "./lint.js";
import { validateDocuments, deepValidateDocuments, type ValidateResult, type DeepValidateResult, type CheckStatus } from "./validate.js";

import { handleAuthLogin } from "./cloud/sso.js";
import { handleAuditTrail, logAuditEntry } from "./cloud/audit-trail.js";
import { handleTeamConfigInit } from "./cloud/team-config.js";
import { handleUpgrade, handleActivate, handleDeactivate, PLAN_DETAILS, validateLicenseKey, type PlanName } from "./cloud/stripe-checkout.js";
import { generateApiSpec, writeApiSpec } from "./cloud/compliance-api.js";
import { scheduleScans, unscheduleScans, getScheduleStatus, frequencyDescription, type ScheduleFrequency } from "./cloud/schedule.js";
import { getBillingStatus, getBillingUsage, openBillingPortal } from "./cloud/billing.js";
import { checkLicense, checkAndTrackFeature } from "./licensing/index.js";
import { computeComplianceScore as computeFullComplianceScore, formatScoreBreakdown, type ScoreInput, type ComplianceScore, type RegulationScore, type Recommendation } from "./scoring/index.js";
const VERSION = "1.1.0";

// --no-color support: disabled via flag, NO_COLOR env, or non-TTY stdout
let _noColor = false;

function initColor(args: string[]) {
  if (
    args.includes("--no-color") ||
    process.env.NO_COLOR !== undefined ||
    !process.stdout.isTTY
  ) {
    _noColor = true;
  }
}

function c(code: string): string {
  return _noColor ? "" : code;
}

// Color helpers — respect --no-color
const RESET = () => c("\x1b[0m");
const BOLD = () => c("\x1b[1m");
const GREEN = () => c("\x1b[32m");
const YELLOW = () => c("\x1b[33m");
const CYAN = () => c("\x1b[36m");
const DIM = () => c("\x1b[2m");
const RED = () => c("\x1b[31m");

function getEcosystemCount(): number {
  return Object.keys(SERVICE_SIGNATURES).length;
}

function printBanner() {
  const ecosystemCount = getEcosystemCount();
  console.log(`
${CYAN()}${BOLD()}  ╔═══════════════════════════════════════╗
  ║          CODEPLIANT v${VERSION}            ║
  ║   Compliance documents from your code  ║
  ║   ${ecosystemCount} services across 10+ ecosystems   ║
  ╚═══════════════════════════════════════╝${RESET()}
`);
}

function printUsage() {
  console.log(`${BOLD()}Usage:${RESET()}  codepliant <command> [options] [path]

${BOLD()}Scanning:${RESET()}
  ${CYAN()}scan${RESET()}            Scan project (no document generation)
  ${CYAN()}scan-all${RESET()}        Scan all projects under a directory
  ${CYAN()}check${RESET()}           Quick compliance pass/fail check
  ${CYAN()}ci${RESET()}              CI/CD: scan + check in one step (exit 0/1)
  ${CYAN()}count${RESET()}           Quick stats: services, documents, score
  ${CYAN()}stats${RESET()}           One-line compliance status (for shell prompts, CI badges)
  ${CYAN()}lint${RESET()}            Check existing docs for completeness
  ${CYAN()}validate${RESET()}        Validate all generated docs for completeness
  ${CYAN()}diff${RESET()}            Show changes since last generation
  ${CYAN()}dashboard${RESET()}       Show compliance status dashboard
  ${CYAN()}status${RESET()}          Alias for dashboard
  ${CYAN()}metrics${RESET()}         All compliance metrics in one view (for standup reporting)
  ${CYAN()}summary${RESET()}         One-paragraph plain English compliance summary
  ${CYAN()}quickstart${RESET()}      Show quick start guide based on scan results
  ${CYAN()}completeness${RESET()}    Show percentage of recommended docs that exist
  ${CYAN()}migrate${RESET()}         Show new document types available after upgrade
  ${CYAN()}tree${RESET()}            Show generated files as a tree with sizes and categories
  ${CYAN()}fix${RESET()}             Auto-fix common compliance issues
  ${CYAN()}todo${RESET()}            Show all actionable compliance items as a todo list
  ${CYAN()}benchmark${RESET()}       Compare your compliance score against industry average
  ${CYAN()}search${RESET()}          Search across all generated documents
  ${CYAN()}audit${RESET()}           Run comprehensive self-audit, generate AUDIT_REPORT.md

${BOLD()}Generation:${RESET()}
  ${CYAN()}go${RESET()}              Scan + generate documents
  ${CYAN()}generate${RESET()}        Alias for go
  ${CYAN()}update${RESET()}          Re-scan + regenerate, show diff
  ${CYAN()}generate-all${RESET()}    Generate docs for all projects under a directory
  ${CYAN()}report${RESET()}          Generate comprehensive compliance report
  ${CYAN()}env${RESET()}             Generate .env.example from scan
  ${CYAN()}page${RESET()}            Generate compliance page
  ${CYAN()}badge${RESET()}           Generate compliance badges
  ${CYAN()}format${RESET()}          Convert a single .md file to HTML
  ${CYAN()}pdf${RESET()}             Generate PDF for a single document (requires Puppeteer)
  ${CYAN()}export${RESET()}          Export structured JSON with scan results and document metadata
  ${CYAN()}export-zip${RESET()}      Export all compliance docs as a ZIP file
  ${CYAN()}compare${RESET()}         Compare compliance status of two projects
  ${CYAN()}sbom${RESET()}            Generate CycloneDX SBOM from dependency scan

${BOLD()}Notifications:${RESET()}
  ${CYAN()}notify${RESET()}          Send compliance status notification
  ${CYAN()}schedule${RESET()}        Schedule periodic scans (daily/weekly/monthly)

${BOLD()}Server:${RESET()}
  ${CYAN()}serve${RESET()}           Start HTTP API server
  ${CYAN()}publish${RESET()}         Generate API spec or GitHub Pages site

${BOLD()}Setup:${RESET()}
  ${CYAN()}init${RESET()}            Interactive setup wizard (use --from-env for CI/CD)
  ${CYAN()}wizard${RESET()}          Step-by-step compliance wizard
  ${CYAN()}hook${RESET()}            Install/uninstall pre-commit hook
  ${CYAN()}template${RESET()}        Manage custom document templates
  ${CYAN()}config show${RESET()}     Pretty-print current configuration
  ${CYAN()}check-config${RESET()}    Validate config against schema, show completeness

${BOLD()}Account:${RESET()}
  ${CYAN()}upgrade${RESET()}         Upgrade to Pro or Team plan
  ${CYAN()}activate${RESET()}        Activate a license key
  ${CYAN()}deactivate${RESET()}      Remove license key
  ${CYAN()}billing${RESET()}         View plan, usage stats, or open billing portal

${BOLD()}Community:${RESET()}
  ${CYAN()}signatures${RESET()}      List, export, or import service signatures

${BOLD()}AI (optional):${RESET()}
  ${CYAN()}review${RESET()}          AI-powered review of generated documents
  ${CYAN()}explain${RESET()}         Explain why a document was generated

${BOLD()}Service Management:${RESET()}
  ${CYAN()}why${RESET()}             Explain why a specific service was detected
  ${CYAN()}ignore${RESET()}          Add a service to the ignore list in config

${BOLD()}Diagnostics:${RESET()}
  ${CYAN()}doctor${RESET()}          Diagnose common issues and suggest fixes
  ${CYAN()}health${RESET()}          Quick health check of compliance setup
  ${CYAN()}preview${RESET()}         Preview a specific document in terminal (paged output)
  ${CYAN()}reset${RESET()}           Reset all codepliant state (scores, usage, todo)
  ${CYAN()}snapshot${RESET()}        Save compliance state as a timestamped snapshot
  ${CYAN()}archive${RESET()}         Archive current legal/ directory with timestamp
  ${CYAN()}clean${RESET()}           Remove all generated files in legal/
  ${CYAN()}certify${RESET()}         Generate a dated compliance certificate for sharing

${BOLD()}Info:${RESET()}
  ${CYAN()}version${RESET()}         Print version and exit
  ${CYAN()}version-check${RESET()}   Check if a newer version is available
  ${CYAN()}info${RESET()}            Show installation info, environment, available scanners
  ${CYAN()}list-docs${RESET()}       List all document types codepliant can generate
  ${CYAN()}changelog${RESET()}       Show version history of codepliant
  ${CYAN()}about${RESET()}          Show project info, mission, credits, and links
  ${CYAN()}celebrate${RESET()}      v500 milestone easter egg
  ${CYAN()}completions${RESET()}     Output shell completion script (bash, zsh, fish)
  ${CYAN()}help${RESET()}            Show this help message

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--json${RESET()}                Output scan results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--watch, -w${RESET()}           Watch mode (auto re-scan on changes)
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--detailed${RESET()}            Show detailed stats (for count/stats command)
  ${DIM()}--ecosystem <name>${RESET()}    Filter scan to specific ecosystem (js, python, go, ruby, etc.)
  ${DIM()}--no-color${RESET()}            Disable colored output
  ${DIM()}--port <number>${RESET()}        Port for serve command (default: 3939)
  ${DIM()}--version, -V${RESET()}         Print version and exit

Run ${CYAN()}codepliant <command> --help${RESET()} for command-specific help.
`);
}

// --- Per-command help (lazy to respect --no-color) ---

function getCommandHelp(): Record<string, string> {
  return {
  go: `${BOLD()}codepliant go${RESET()} [path] [options]

Scan the project and generate compliance documents.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--watch, -w${RESET()}           Watch for changes and regenerate automatically
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--dry-run${RESET()}             Preview what would be generated without writing files
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant go${RESET()}                      Scan current directory
  ${CYAN()}codepliant go ./my-app${RESET()}              Scan a specific directory
  ${CYAN()}codepliant go -o ./docs${RESET()}             Output to ./docs
  ${CYAN()}codepliant go --format html${RESET()}         Generate HTML documents
  ${CYAN()}codepliant go --watch${RESET()}               Watch mode
  ${CYAN()}codepliant go --dry-run${RESET()}             Preview without writing
`,

  report: `${BOLD()}codepliant report${RESET()} [path] [options]

Generate a comprehensive compliance report (COMPLIANCE_REPORT.md).
Combines executive summary, scan findings, data flow, regulatory matrix,
document inventory, recommendations, and action plan in a single document.
Designed for CTO/CISO review, investor due diligence, and audit trail.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--executive-summary${RESET()}   Also generate a one-page EXECUTIVE_SUMMARY.md (Pro)
  ${DIM()}--email${RESET()}               Also generate email-friendly HTML (inline CSS, copy-pasteable)
  ${DIM()}--slack${RESET()}               Also generate Slack-compatible markdown (ready to paste)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant report${RESET()}                    Generate report for current directory
  ${CYAN()}codepliant report ./my-app${RESET()}            Report for a specific project
  ${CYAN()}codepliant report -o ./audit${RESET()}          Output to ./audit
  ${CYAN()}codepliant report --email${RESET()}             Generate + email-friendly HTML version
`,

  scan: `${BOLD()}codepliant scan${RESET()} [path] [options]

Scan the project for third-party services and data collection patterns.
Does not generate any documents.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <file>${RESET()}   Save scan results to a file (default: stdout for --json, terminal for normal)
  ${DIM()}--json${RESET()}                Output results as JSON (useful for piping)
  ${DIM()}--ecosystem <name>${RESET()}    Filter to a specific ecosystem (js, python, go, ruby, etc.)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--watch, -w${RESET()}           Watch for file changes and re-scan continuously
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant scan${RESET()}                           Scan current directory
  ${CYAN()}codepliant scan ./my-app${RESET()}                   Scan a specific directory
  ${CYAN()}codepliant scan --ecosystem python${RESET()}          Only show Python ecosystem results
  ${CYAN()}codepliant scan --json${RESET()}                     JSON output for CI/scripts
  ${CYAN()}codepliant scan --json | jq '.services'${RESET()}
  ${CYAN()}codepliant scan --json -o scan.json${RESET()}         Save JSON results to a file
  ${CYAN()}codepliant scan -o results.txt${RESET()}              Save scan output to a text file
  ${CYAN()}codepliant scan --watch${RESET()}                     Watch mode: re-scan on file changes
`,

  tree: `${BOLD()}codepliant tree${RESET()} [path] [options]

Show all generated compliance files as a tree structure, organized by
category with file sizes.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to display (default: ./legal)
  ${DIM()}--json${RESET()}                Output tree as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant tree${RESET()}                     Show generated file tree
  ${CYAN()}codepliant tree --json${RESET()}               JSON output for tooling
  ${CYAN()}codepliant tree -o ./docs${RESET()}             Show tree for custom output dir
`,

  check: `${BOLD()}codepliant check${RESET()} [path] [options]

Quick pass/fail check whether required compliance documents exist.
Exits with code 0 (pass) or 1 (fail). Designed for CI pipelines.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Directory to check for documents (default: ./legal)
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant check${RESET()}                    Check current project
  ${CYAN()}codepliant check --json${RESET()}              JSON output for CI
  ${CYAN()}codepliant check -o ./docs${RESET()}           Check a custom output dir
`,

  ci: `${BOLD()}codepliant ci${RESET()} [path] [options]

One command for CI/CD pipelines: scan + generate + check in one step.
Returns exit code 0 if compliant, exit code 1 if not.
Shows minimal output by default.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Suppress all output except pass/fail
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant ci${RESET()}                        Scan + check current project
  ${CYAN()}codepliant ci ./my-app${RESET()}                Scan + check a specific project
  ${CYAN()}codepliant ci --json${RESET()}                  JSON output for CI scripts
  ${CYAN()}codepliant ci -q${RESET()}                      Silent mode (exit code only)
`,

  lint: `${BOLD()}codepliant lint${RESET()} [path] [options]

Check existing compliance documents for completeness.
Compares against what codepliant would generate, flags missing
sections, placeholder values, and outdated documents.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Directory to check for documents (default: ./legal)
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant lint${RESET()}                     Lint current project
  ${CYAN()}codepliant lint --json${RESET()}               JSON output for CI
  ${CYAN()}codepliant lint -o ./docs${RESET()}             Lint a custom output dir
`,

  validate: `${BOLD()}codepliant validate${RESET()} [path] [options]

Validate ALL generated documents for completeness.
Checks each section has content (not just headers).
Reports per-document section completion.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to validate (default: ./legal)
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant validate${RESET()}                  Validate current project docs
  ${CYAN()}codepliant validate --json${RESET()}            JSON output for CI
  ${CYAN()}codepliant validate -o ./docs${RESET()}         Validate a custom output dir
`,

  diff: `${BOLD()}codepliant diff${RESET()} [path] [options]

Show what would change if you regenerated documents now.
Compares current documents on disk with freshly generated versions.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to compare (default: ./legal)
  ${DIM()}--since <date>${RESET()}        Show changelog entries since a date (YYYY-MM-DD)
  ${DIM()}--pr${RESET()}                  Output as GitHub PR comment (Markdown)
  ${DIM()}--json${RESET()}                Output diff as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant diff${RESET()}                     Show pending changes
  ${CYAN()}codepliant diff --json${RESET()}               JSON output for scripts
  ${CYAN()}codepliant diff --pr${RESET()}                 GitHub PR comment format
  ${CYAN()}codepliant diff --since 2025-01-01${RESET()}   Show changes since a date
`,

  page: `${BOLD()}codepliant page${RESET()} [path] [options]

Generate a single-page HTML compliance page with tabs for each document.
Suitable for hosting on your website.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant page${RESET()}                     Generate compliance page
  ${CYAN()}codepliant page -o ./public${RESET()}          Output to public directory
`,

  badge: `${BOLD()}codepliant badge${RESET()} [path] [options]

Generate shields.io-style compliance badge SVGs.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant badge${RESET()}                    Generate badges
  ${CYAN()}codepliant badge -o ./public${RESET()}         Output to public directory
`,

  wizard: `${BOLD()}codepliant wizard${RESET()} [path] [options]

Interactive step-by-step compliance wizard. Scans your project,
lets you review detected services, select jurisdictions, enter
company info, review documents, and generate everything.

Confirmed/excluded services are saved to config for future runs.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant wizard${RESET()}                    Run the compliance wizard
  ${CYAN()}codepliant wizard ./my-app${RESET()}            Run for a specific project
`,

  init: `${BOLD()}codepliant init${RESET()}

Interactive setup wizard. Configures company info, compliance scope,
output preferences, and runs an initial scan + generate.

Creates a ${CYAN()}.codepliant.json${RESET()} config file in the project root.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant init${RESET()}                     Run setup wizard
`,

  hook: `${BOLD()}codepliant hook${RESET()} <install|uninstall>

Install or remove a pre-commit hook that runs compliance checks
before each commit. Supports husky, lefthook, and raw git hooks.

${BOLD()}Subcommands:${RESET()}
  ${CYAN()}install${RESET()}       Install the pre-commit hook
  ${CYAN()}uninstall${RESET()}     Remove the pre-commit hook

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant hook install${RESET()}              Install hook
  ${CYAN()}codepliant hook uninstall${RESET()}            Remove hook
`,

  env: `${BOLD()}codepliant env${RESET()} [path] [options]

Generate a .env.example file from detected services.
Lists expected environment variables with placeholder values, grouped by category.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: project root)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant env${RESET()}                      Generate .env.example for current project
  ${CYAN()}codepliant env ./my-app${RESET()}              Generate for a specific directory
  ${CYAN()}codepliant env -o ./config${RESET()}           Output to a custom directory
`,

  dashboard: `${BOLD()}codepliant dashboard${RESET()} [path] [options]

Show a compact, colored terminal dashboard with compliance status overview.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to check (default: ./legal)
  ${DIM()}--json${RESET()}                Output dashboard data as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant dashboard${RESET()}                 Show dashboard for current project
  ${CYAN()}codepliant dashboard ./my-app${RESET()}         Dashboard for a specific project
  ${CYAN()}codepliant dashboard --json${RESET()}           JSON output for scripts
`,

  "scan-all": `${BOLD()}codepliant scan-all${RESET()} [dir] [options]

Discover and scan all projects under a directory.
Finds subdirectories containing package.json, requirements.txt, go.mod,
Cargo.toml, and other manifest files, scans each one, and shows aggregate results.

${BOLD()}Options:${RESET()}
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant scan-all ./org${RESET()}              Scan all projects under ./org
  ${CYAN()}codepliant scan-all --json${RESET()}             JSON output for CI
`,

  "generate-all": `${BOLD()}codepliant generate-all${RESET()} [dir] [options]

Discover all projects under a directory and generate compliance documents for each.
Creates a separate output directory per project (e.g. ./legal/<project-name>/).

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Root output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant generate-all ./org${RESET()}          Generate docs for all projects under ./org
  ${CYAN()}codepliant generate-all -o ./compliance${RESET()}  Custom output directory
`,

  signatures: `${BOLD()}codepliant signatures${RESET()} <list|export|import> [options]

Manage service signatures (built-in + community).

${BOLD()}Subcommands:${RESET()}
  ${CYAN()}list${RESET()}        Show all built-in and community signatures
  ${CYAN()}export${RESET()}      Export custom signatures to JSON for sharing
  ${CYAN()}import${RESET()}      Import community signatures from a JSON file

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant signatures list${RESET()}                   List all signatures
  ${CYAN()}codepliant signatures export sigs.json${RESET()}       Export custom signatures
  ${CYAN()}codepliant signatures import community.json${RESET()}  Import shared signatures
`,

  export: `${BOLD()}codepliant export${RESET()} [path] [options]

Export a single JSON file with all scan results and document metadata.
Useful for CI/CD pipelines, dashboard integrations, and compliance reporting tools.

The JSON includes: project info, detected services, document metadata
(name, category, filename, line count), and compliance score.
Full document content is NOT included — only metadata.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <file>${RESET()}   Write JSON to a file (default: stdout)
  ${DIM()}--quiet, -q${RESET()}           Suppress banner and progress output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant export${RESET()}                            Print JSON to stdout
  ${CYAN()}codepliant export -o compliance.json${RESET()}          Write to file
  ${CYAN()}codepliant export ./my-app${RESET()}                    Export for a specific project
  ${CYAN()}codepliant export --quiet | jq '.score'${RESET()}       Pipe to jq in CI
`,

  "export-zip": `${BOLD()}codepliant export-zip${RESET()} [path] [options]

Export compliance documents in a specific format as a ZIP archive.

${BOLD()}Options:${RESET()}
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant export-zip --format wiki${RESET()}            Export as GitHub Wiki pages
  ${CYAN()}codepliant export-zip --format confluence${RESET()}      Export for Confluence
`,

  doctor: `${BOLD()}codepliant doctor${RESET()} [path]

Diagnose common issues with your Codepliant setup.
Checks for missing config, outdated docs, build errors, and more.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant doctor${RESET()}                     Run diagnostics on current project
  ${CYAN()}codepliant doctor ./my-app${RESET()}             Run diagnostics for a specific project
`,

  health: `${BOLD()}codepliant health${RESET()} [path] [options]

Comprehensive project health check. Scans the project, checks if compliance
docs exist and are up to date, and shows a summary of services detected,
docs generated, docs missing, and docs stale.

Exit 0 if healthy, exit 1 if any required docs are missing.

${BOLD()}Options:${RESET()}
  ${CYAN()}--json${RESET()}                                Machine-readable JSON output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant health${RESET()}                     Check current project
  ${CYAN()}codepliant health ./my-app${RESET()}             Check a specific project
  ${CYAN()}codepliant health --json${RESET()}               Output as JSON (for CI)
`,

  clean: `${BOLD()}codepliant clean${RESET()} [path] [options]

Remove all generated files in the legal/ output directory.
Prompts for confirmation unless --force is used.

${BOLD()}Options:${RESET()}
  ${DIM()}--force${RESET()}               Skip confirmation prompt
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant clean${RESET()}                      Remove generated docs (with confirmation)
  ${CYAN()}codepliant clean --force${RESET()}               Remove without confirmation
`,

  review: `${BOLD()}codepliant review${RESET()} [path] [options]

AI-powered review of generated compliance documents.
Uses Claude or OpenAI to check for legal accuracy, missing clauses, and unclear language.
Returns suggestions only — never auto-edits your documents.

Requires ${CYAN()}aiReviewApiKey${RESET()} in .codepliantrc.json.
Optionally set ${CYAN()}aiReviewModel${RESET()} (default: claude-sonnet-4-20250514).

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to review (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--json${RESET()}                Output review results as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant review${RESET()}                    Review docs for current project
  ${CYAN()}codepliant review ./my-app${RESET()}            Review docs for a specific project
  ${CYAN()}codepliant review --json${RESET()}              JSON output for CI
`,

  explain: `${BOLD()}codepliant explain${RESET()} <document> [path]

Explain why a specific document was generated.
Lists the evidence (services, code patterns, config settings) that triggered the document.

${BOLD()}Arguments:${RESET()}
  ${CYAN()}<document>${RESET()}   Document name or filename (e.g. "Privacy Policy", "PRIVACY_POLICY.md")

${BOLD()}Options:${RESET()}
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--json${RESET()}                Output explanation as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant explain "Privacy Policy"${RESET()}
  ${CYAN()}codepliant explain RISK_REGISTER.md${RESET()}
  ${CYAN()}codepliant explain "AI Disclosure" ./my-app${RESET()}
  ${CYAN()}codepliant explain --json "Cookie Policy"${RESET()}
`,
  why: `${BOLD()}codepliant why${RESET()} <service> [path]

Explain why a specific service was detected in your project.
Shows all evidence: dependencies, imports, environment variables, and code patterns.

${BOLD()}Arguments:${RESET()}
  ${CYAN()}<service>${RESET()}   Service name (e.g. "stripe", "openai", "sentry")

${BOLD()}Options:${RESET()}
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--json${RESET()}                Output evidence as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant why stripe${RESET()}
  ${CYAN()}codepliant why openai ./my-app${RESET()}
  ${CYAN()}codepliant why sentry --json${RESET()}
`,

  ignore: `${BOLD()}codepliant ignore${RESET()} <service> [path]

Add a service to the ignore list so it won't appear in future scans.
Useful for utility libraries that are not data processors (e.g. zod, lodash).

${BOLD()}Arguments:${RESET()}
  ${CYAN()}<service>${RESET()}   Service name to ignore (e.g. "zod", "lodash")

${BOLD()}Options:${RESET()}
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--json${RESET()}                Output result as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant ignore zod${RESET()}                 Ignore zod (not a data processor)
  ${CYAN()}codepliant ignore lodash ./my-app${RESET()}      Ignore lodash in specific project
  ${CYAN()}codepliant ignore --json zod${RESET()}           JSON output
`,

  compare: `${BOLD()}codepliant compare${RESET()} <path1> <path2> [options]

Compare compliance status of two projects side by side.

${BOLD()}Options:${RESET()}
  ${DIM()}--json${RESET()}                Output comparison as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant compare ./app1 ./app2${RESET()}      Compare two projects
  ${CYAN()}codepliant compare ./app1 ./app2 --json${RESET()}  JSON output
`,

  publish: `${BOLD()}codepliant publish${RESET()} [path] [options]

Generate a compliance API endpoint spec or static HTML site.

${BOLD()}Options:${RESET()}
  ${DIM()}--api${RESET()}                 Generate API endpoint spec (compliance-api.json)
  ${DIM()}--github-pages${RESET()}        Generate static HTML site in docs/ for GitHub Pages
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant publish --api${RESET()}                  Generate API spec
  ${CYAN()}codepliant publish --api -o ./public${RESET()}      Output to public directory
  ${CYAN()}codepliant publish --github-pages${RESET()}          Generate GitHub Pages site in docs/
`,

  schedule: `${BOLD()}codepliant schedule${RESET()} <install|uninstall|status> [options]

Schedule periodic compliance scans using OS-native scheduling
(launchd on macOS, cron on Linux).

${BOLD()}Subcommands:${RESET()}
  ${CYAN()}install${RESET()}       Install scheduled scan (default: weekly)
  ${CYAN()}uninstall${RESET()}     Remove scheduled scan
  ${CYAN()}status${RESET()}        Show current schedule status

${BOLD()}Options:${RESET()}
  ${DIM()}--frequency <freq>${RESET()}    daily, weekly (default), or monthly
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant schedule install${RESET()}                  Weekly scan
  ${CYAN()}codepliant schedule install --frequency daily${RESET()}  Daily scan
  ${CYAN()}codepliant schedule uninstall${RESET()}                Remove schedule
  ${CYAN()}codepliant schedule status${RESET()}                   Show schedule info
`,

  billing: `${BOLD()}codepliant billing${RESET()} <status|usage|portal>

View billing information and manage your subscription.

${BOLD()}Subcommands:${RESET()}
  ${CYAN()}status${RESET()}        Show current plan details
  ${CYAN()}usage${RESET()}         Show feature usage statistics
  ${CYAN()}portal${RESET()}        Open Stripe customer portal in browser

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant billing status${RESET()}                    View plan details
  ${CYAN()}codepliant billing usage${RESET()}                     View feature usage
  ${CYAN()}codepliant billing portal${RESET()}                    Open billing portal
`,

  update: `${BOLD()}codepliant update${RESET()} [path] [options]

Re-scan the project, regenerate compliance documents, and show what changed.

Combines scan + diff + go in a single command: detects changes in your codebase,
shows a diff of what documents will be updated, then writes the updated documents.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Output directory (default: ./legal)
  ${DIM()}--format <fmt>${RESET()}         Output format: markdown, html, pdf, json, notion, confluence, wiki, all
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--verbose, -v${RESET()}         Show per-scanner timing breakdown
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant update${RESET()}                      Re-scan and update documents
  ${CYAN()}codepliant update ./my-app${RESET()}              Update a specific project
  ${CYAN()}codepliant update --format html${RESET()}         Update in HTML format
`,

  status: `${BOLD()}codepliant status${RESET()} [path] [options]

Alias for ${CYAN()}codepliant dashboard${RESET()}. Show compliance status dashboard.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant status${RESET()}                    Show dashboard for current project
  ${CYAN()}codepliant status ./my-app${RESET()}            Dashboard for a specific project
  ${CYAN()}codepliant status --json${RESET()}              JSON output for scripts
`,

  generate: `${BOLD()}codepliant generate${RESET()} [path] [options]

Alias for ${CYAN()}codepliant go${RESET()}. Scan + generate compliance documents.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant generate${RESET()}                  Generate docs for current directory
  ${CYAN()}codepliant generate ./my-app${RESET()}          Generate for a specific project
  ${CYAN()}codepliant generate --format html${RESET()}     Generate as HTML
`,

  fix: `${BOLD()}codepliant fix${RESET()} <issue> [path]

Auto-fix common compliance issues.

${BOLD()}Issues:${RESET()}
  ${CYAN()}missing-dpo${RESET()}       Prompt for DPO info and save to config
  ${CYAN()}stale-docs${RESET()}        Regenerate all compliance documents
  ${CYAN()}missing-consent${RESET()}   Add cookie banner recommendation

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant fix missing-dpo${RESET()}           Set up DPO information
  ${CYAN()}codepliant fix stale-docs${RESET()}            Regenerate all documents
  ${CYAN()}codepliant fix missing-consent${RESET()}       Get cookie banner guidance
`,

  count: `${BOLD()}codepliant count${RESET()} [path] [options]

Quick stats: number of detected services, documents to generate, and compliance score.
Output is machine-friendly (key=value pairs) for use in scripts and CI.

${BOLD()}Options:${RESET()}
  ${DIM()}--json${RESET()}                Output as JSON
  ${DIM()}--detailed${RESET()}            Show per-scanner timing, per-generator output size, detection confidence
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant count${RESET()}                     Quick stats for current project
  ${CYAN()}codepliant count ./my-app${RESET()}             Stats for a specific project
  ${CYAN()}codepliant count --json${RESET()}               JSON output for CI
  ${CYAN()}codepliant count --detailed${RESET()}           Detailed breakdown of all metrics
`,

  stats: `${BOLD()}codepliant stats${RESET()} [path] [options]

One-line compliance status summary. Useful for shell prompts, CI badges, and status bars.

${BOLD()}Output format:${RESET()}
  codepliant v1.1.0 | 7 services | 123 docs | Score: A (98%) | Last scan: 2 days ago

${BOLD()}Options:${RESET()}
  ${DIM()}--json${RESET()}                Output as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant stats${RESET()}                     One-line status for current project
  ${CYAN()}codepliant stats ./my-app${RESET()}             Status for a specific project
  ${CYAN()}codepliant stats --json${RESET()}               JSON output for CI badges
`,

  notify: `${BOLD()}codepliant notify${RESET()} [path] [options]

Send compliance status notification via configured channels (Slack, email, webhook).
Configure notification settings in .codepliant.json.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory (default: ./legal)
  ${DIM()}--json${RESET()}                Output notification payload as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant notify${RESET()}                    Send notification for current project
  ${CYAN()}codepliant notify ./my-app${RESET()}            Notify for a specific project
  ${CYAN()}codepliant notify --json${RESET()}              Preview payload without sending
`,

  serve: `${BOLD()}codepliant serve${RESET()} [options]

Start the Codepliant HTTP API server for programmatic access.

${BOLD()}Options:${RESET()}
  ${DIM()}--port <number>${RESET()}        Port number (default: 3939)
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant serve${RESET()}                     Start server on port 3939
  ${CYAN()}codepliant serve --port 8080${RESET()}          Start on a custom port
`,

  upgrade: `${BOLD()}codepliant upgrade${RESET()} [plan]

Upgrade to a Pro or Team plan.

${BOLD()}Plans:${RESET()}
  ${CYAN()}pro${RESET()}          Pro plan — advanced features
  ${CYAN()}team${RESET()}         Team plan — multi-user, team config

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant upgrade pro${RESET()}                Upgrade to Pro
  ${CYAN()}codepliant upgrade team${RESET()}               Upgrade to Team
`,

  activate: `${BOLD()}codepliant activate${RESET()} <license-key>

Activate a license key for Pro or Team plan features.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant activate XXXX-XXXX-XXXX${RESET()}   Activate a license key
`,

  deactivate: `${BOLD()}codepliant deactivate${RESET()}

Remove the current license key and revert to free tier.

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant deactivate${RESET()}                Remove license key
`,

  template: `${BOLD()}codepliant template${RESET()} <init>

Manage custom document templates. Initialize a templates directory with
editable copies of all document templates.

${BOLD()}Subcommands:${RESET()}
  ${CYAN()}init${RESET()}        Create templates directory with defaults

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant template init${RESET()}              Initialize templates directory
`,

  summary: `${BOLD()}codepliant summary${RESET()} [path] [options]

Print a one-paragraph plain English summary of your project's compliance status.
Includes service count, key services, needed documents, and compliance score.

${BOLD()}Options:${RESET()}
  ${DIM()}--json${RESET()}                Output as JSON
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant summary${RESET()}                   Summary for current project
  ${CYAN()}codepliant summary ./my-app${RESET()}           Summary for a specific project
  ${CYAN()}codepliant summary --json${RESET()}             JSON output for scripts
`,

  search: `${BOLD()}codepliant search${RESET()} <keyword> [options]

Search across all generated compliance documents for a keyword.
Shows matching lines with file names and line numbers.

${BOLD()}Options:${RESET()}
  ${DIM()}--output, -o <dir>${RESET()}    Document directory to search (default: ./legal)
  ${DIM()}--json${RESET()}                Output results as JSON
  ${DIM()}--quiet, -q${RESET()}           Minimal output
  ${DIM()}--no-color${RESET()}            Disable colored output

${BOLD()}Examples:${RESET()}
  ${CYAN()}codepliant search email${RESET()}                Search for 'email' in all docs
  ${CYAN()}codepliant search "data retention"${RESET()}     Search for a phrase
  ${CYAN()}codepliant search GDPR --json${RESET()}          JSON output for scripting
  ${CYAN()}codepliant search cookie -o ./docs${RESET()}     Search in custom output dir
`,
  completions: `${BOLD()}codepliant completions${RESET()} [options]

Output a shell completion script to stdout.

${BOLD()}Options:${RESET()}
  ${DIM()}--shell <bash|zsh|fish>${RESET()}    Shell type (default: auto-detect from $SHELL)

${BOLD()}Usage:${RESET()}
  ${CYAN()}codepliant completions --shell zsh >> ~/.zshrc${RESET()}
  ${CYAN()}codepliant completions --shell bash >> ~/.bashrc${RESET()}
  ${CYAN()}codepliant completions --shell fish > ~/.config/fish/completions/codepliant.fish${RESET()}
  ${CYAN()}codepliant completions${RESET()}                              Auto-detect shell
`,
  };
}

function formatCategory(cat: string): string {
  const icons: Record<string, string> = {
    ai: "🤖",
    payment: "💳",
    analytics: "📊",
    auth: "🔐",
    email: "📧",
    database: "🗄️",
    storage: "📁",
    monitoring: "🔍",
    advertising: "📢",
    social: "👥",
    other: "📦",
  };
  const labels: Record<string, string> = {
    ai: "AI Service",
    payment: "Payment",
    analytics: "Analytics",
    auth: "Authentication",
    email: "Email",
    database: "Database",
    storage: "Storage",
    monitoring: "Monitoring",
    advertising: "Advertising",
    social: "Social",
    other: "Other",
  };
  return `${icons[cat] || "📦"} ${labels[cat] || cat}`;
}

// Graceful Ctrl+C handling for all modes
process.on("SIGINT", () => {
  console.log(`\n${DIM()}Interrupted.${RESET()}`);
  process.exit(130);
});

// --- Progress indicator helpers ---

function printStep(label: string) {
  process.stdout.write(`  ${DIM()}${label}...${RESET()}`);
}

function printStepDone() {
  process.stdout.write(` ${GREEN()}✓${RESET()}\n`);
}

function startSpinner(message: string): { stop: (success?: boolean) => void } {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const id = setInterval(() => {
    process.stdout.write(`\r  ${frames[i % frames.length]} ${message}`);
    i++;
  }, 80);
  return {
    stop(success?: boolean) {
      clearInterval(id);
      const icon = success ? `${GREEN()}✓${RESET()}` : `${RED()}✗${RESET()}`;
      process.stdout.write(`\r  ${icon} ${message}\n`);
    },
  };
}

// --- Formatting helpers ---

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function countLines(content: string): number {
  return content.split("\n").length;
}

function classifyDocCategory(docName: string): string {
  const lower = docName.toLowerCase();
  if (lower.includes("ai ") || lower.includes("ai-") || lower.includes("model card")) return "AI Compliance";
  if (lower.includes("privacy") || lower.includes("cookie") || lower.includes("consent") || lower.includes("dsar") || lower.includes("data subject") || lower.includes("data protection") || lower.includes("media consent")) return "Privacy";
  if (lower.includes("dpo") || lower.includes("data protection officer")) return "Privacy";
  if (lower.includes("security") || lower.includes("incident") || lower.includes("vulnerability") || lower.includes("access control") || lower.includes("encryption") || lower.includes("penetration") || lower.includes("disclosure") || lower.includes("backup") || lower.includes("disaster")) return "Security";
  if (lower.includes("terms") || lower.includes("acceptable use") || lower.includes("refund") || lower.includes("sla") || lower.includes("service level") || lower.includes("api terms") || lower.includes("supplier") || lower.includes("whistleblower")) return "Legal";
  if (lower.includes("soc") || lower.includes("iso") || lower.includes("compliance") || lower.includes("audit") || lower.includes("annual review") || lower.includes("risk")) return "Audit";
  if (lower.includes("data") || lower.includes("subprocessor") || lower.includes("vendor") || lower.includes("record of") || lower.includes("transfer") || lower.includes("regulatory") || lower.includes("transparency") || lower.includes("open source") || lower.includes("license")) return "Operations";
  return "Other";
}

// --- Actionable error messages ---

// Error codes — searchable in docs at https://github.com/joechensmartz/codepliant
// CP001: Permission denied
// CP002: Disk full
// CP003: Read-only filesystem
// CP004: Too many open files
// CP005: Circular symlink
// CP006: Path not found
// CP007: Not a directory
// CP008: Unknown command
// CP009: Invalid argument
// CP010: Config error
// CP011: Init error
// CP012: Server error
// CP013: Review error
// CP014: Compare error
// CP015: Missing argument
// CP016: Template error
// CP017: Notification error
// CP018: Fix error
// CP019: Hook error
// CP020: Scan error
// CP021: Export error
// CP022: Changelog error
// CP023: Validation error
// CP024: Schedule error
// CP025: Auth error
// CP026: Billing error
// CP027: General error

function formatError(err: unknown): string {
  if (!(err instanceof Error)) return String(err);

  const e = err as NodeJS.ErrnoException;

  if (e.code === "EACCES" || e.code === "EPERM") {
    const target = e.path ? `"${e.path}"` : "the target path";
    return `[CP001] Permission denied accessing ${target}.\n  Try: sudo chmod -R u+rw ${e.path || "<path>"}`;
  }

  if (e.code === "ENOSPC") {
    return "[CP002] Not enough disk space to write documents.\n  Free up space and try again.";
  }

  if (e.code === "EROFS") {
    return "[CP003] File system is read-only. Cannot write documents.";
  }

  if (e.code === "EMFILE" || e.code === "ENFILE") {
    return "[CP004] Too many open files. Try increasing the file descriptor limit:\n  ulimit -n 4096";
  }

  if (e.code === "ELOOP") {
    const target = e.path ? ` at "${e.path}"` : "";
    return `[CP005] Circular symlink detected${target}. Resolve the symlink loop and try again.`;
  }

  return e.message;
}

// --- Compliance score ---

function computeComplianceScore(result: ScanResult, outputDir: string): number {
  if (result.complianceNeeds.length === 0) return 100;

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  function docExists(docName: string): boolean {
    const filenames = docFileMap[docName] || [];
    return filenames.some(f => fs.existsSync(path.join(outputDir, f)));
  }

  let score = 0;
  let total = 0;

  for (const need of result.complianceNeeds) {
    if (!docFileMap[need.document]) continue;
    const weight = need.priority === "required" ? 15 : 5;
    total += weight;
    if (docExists(need.document)) score += weight;
  }

  if (total === 0) return 100;
  return Math.round((score / total) * 100);
}

function formatComplianceScore(score: number): string {
  let color = RED();
  if (score > 80) color = GREEN();
  else if (score > 60) color = YELLOW();
  return `${color}${BOLD()}${score}%${RESET()}`;
}

// --- Scan with progress indicators ---

function scanWithProgress(absProjectPath: string, quiet: boolean, verbose: boolean = false, plugins?: CodepliantPlugin[]): { result: ScanResult; durationMs: number; timings?: ScanTimings } {
  const startTime = Date.now();

  if (!quiet) {
    printStep("Scanning package.json");
  }

  const result = scan(absProjectPath, { verbose, plugins });

  if (!quiet) {
    printStepDone();
    printStep("Scanning source imports");
    printStepDone();
    printStep("Scanning .env files");
    printStepDone();

    if (result.monorepo) {
      console.log(`\n  ${CYAN()}${BOLD()}Detected monorepo with ${result.monorepo.workspaces.length} package(s)${RESET()} ${DIM()}(${result.monorepo.type})${RESET()}`);
      for (const ws of result.monorepo.workspaces) {
        console.log(`    ${DIM()}• ${ws.relativePath} (${ws.name})${RESET()}`);
      }
    }

    // Report scanner warnings
    if (result.warnings && result.warnings.length > 0) {
      console.log();
      for (const warning of result.warnings) {
        console.log(`  ${YELLOW()}Warning: ${warning}${RESET()}`);
      }
    }
  }

  const durationMs = Date.now() - startTime;
  const timings = (result as ScanResult & { timings?: ScanTimings }).timings;
  return { result, durationMs, timings };
}

function printTimings(timings: ScanTimings, totalMs: number): void {
  console.log(`\n  ${BOLD()}Scanner timing breakdown:${RESET()}\n`);
  for (const [name, ms] of Object.entries(timings)) {
    const bar = ms > 0 ? "█".repeat(Math.max(1, Math.round(ms / 2))) : "";
    console.log(`    ${DIM()}${name.padEnd(14)}${RESET()} ${String(ms).padStart(4)}ms ${DIM()}${bar}${RESET()}`);
  }
  console.log(`    ${"─".repeat(24)}`);
  console.log(`    ${BOLD()}${"Total".padEnd(14)}${RESET()} ${BOLD()}${String(totalMs).padStart(4)}ms${RESET()}`);
}

function printVersion() {
  console.log(`codepliant v${VERSION}`);
}

function printInfo() {
  const nodeVersion = process.version;
  const platform = process.platform;
  const arch = process.arch;
  const installPath = path.dirname(path.dirname(new URL(import.meta.url).pathname));
  const configPath = path.resolve(".codepliantrc.json");
  const outputPath = path.resolve("legal");
  const hasConfig = fs.existsSync(configPath);
  const hasOutput = fs.existsSync(outputPath);

  const scannerList = [
    "dependencies (package.json, requirements.txt, go.mod, Cargo.toml, Gemfile, pom.xml, build.gradle, composer.json, mix.exs)",
    "imports (source code import/require analysis)",
    "env (.env file scanner)",
    "ORM (Prisma, Drizzle, Mongoose, TypeORM, Sequelize, Django, SQLAlchemy, GraphQL)",
    "cloud (AWS, GCP, Azure provider detection)",
    "database (PostgreSQL, MySQL, MongoDB, Redis, etc.)",
    "CI/CD (GitHub Actions, GitLab CI, CircleCI, etc.)",
    "license (open source license compliance)",
    "vulnerability (known vulnerability patterns)",
    "data-flow (data flow mapping)",
    "data-classification (GDPR sensitivity classification)",
  ];

  console.log(`
${BOLD()}Codepliant Installation Info${RESET()}
${"─".repeat(40)}

${BOLD()}Version:${RESET()}        ${VERSION}
${BOLD()}Node.js:${RESET()}        ${nodeVersion}
${BOLD()}Platform:${RESET()}       ${platform} (${arch})
${BOLD()}Install path:${RESET()}   ${installPath}
${BOLD()}Config path:${RESET()}    ${configPath} ${hasConfig ? `${GREEN()}(found)${RESET()}` : `${DIM()}(not found)${RESET()}`}
${BOLD()}Output path:${RESET()}    ${outputPath} ${hasOutput ? `${GREEN()}(exists)${RESET()}` : `${DIM()}(not created yet)${RESET()}`}

${BOLD()}Available Scanners:${RESET()}
${scannerList.map((s) => `  ${CYAN()}•${RESET()} ${s}`).join("\n")}

${BOLD()}Ecosystems:${RESET()}     JS/TS, Python, Go, Ruby, Elixir, PHP, Rust, Java, .NET, Django
${BOLD()}ORM Scanners:${RESET()}   Prisma, Drizzle, Mongoose, TypeORM, Sequelize, Django, SQLAlchemy, GraphQL
${BOLD()}Output Formats:${RESET()} Markdown, HTML, PDF, JSON, Notion, Confluence, Wiki, DOCX
${BOLD()}Languages:${RESET()}      EN, DE, FR, ES
`);
}

const VALID_COMMANDS = [
  "scan", "scan-all", "generate-all", "go", "report", "check", "ci", "count",
  "stats", "summary", "quickstart", "completeness", "migrate", "lint", "validate",
  "diff", "hook", "page", "badge", "env", "dashboard", "metrics", "notify",
  "check-config", "config", "init", "wizard", "serve", "template", "signatures",
  "format", "pdf", "export", "export-zip", "doctor", "auth", "audit-trail", "team-config",
  "review", "explain", "why", "ignore", "compare", "publish", "schedule",
  "billing", "update", "health", "audit", "clean", "archive", "version-check",
  "list-docs", "tree", "changelog", "fix", "todo", "benchmark", "preview",
  "reset", "search", "certify", "snapshot", "about", "celebrate", "sbom",
  "help", "version", "info", "completions",
];

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function suggestCommand(input: string): string[] {
  const maxDistance = Math.max(2, Math.floor(input.length / 2));
  const scored = VALID_COMMANDS
    .map(cmd => ({ cmd, dist: levenshtein(input.toLowerCase(), cmd) }))
    .filter(({ dist }) => dist <= maxDistance && dist > 0)
    .sort((a, b) => a.dist - b.dist);
  if (scored.length === 0) return [];
  const bestDist = scored[0].dist;
  return scored.filter(s => s.dist === bestDist).map(s => s.cmd).slice(0, 3);
}

function generateCompletionScript(shell: string): string | null {
  const cmds = VALID_COMMANDS.slice().sort();
  const cmdList = cmds.join(" ");

  if (shell === "zsh") {
    return `#compdef codepliant
_codepliant() {
  local commands=(
${cmds.map(c => `    '${c}:${c} command'`).join("\n")}
  )
  _describe 'command' commands
}
compdef _codepliant codepliant
`;
  }

  if (shell === "bash") {
    return `# bash completion for codepliant
_codepliant() {
  local cur=\${COMP_WORDS[COMP_CWORD]}
  COMPREPLY=( $(compgen -W "${cmdList}" -- "$cur") )
}
complete -F _codepliant codepliant
`;
  }

  if (shell === "fish") {
    const lines = cmds.map(c => `complete -c codepliant -n '__fish_use_subcommand' -a '${c}' -d '${c} command'`);
    return `# fish completion for codepliant\n${lines.join("\n")}\n`;
  }

  return null;
}

function main() {
  const args = process.argv.slice(2);

  // Initialize color support before anything prints
  initColor(args);

  // Command aliases
  const COMMAND_ALIASES: Record<string, string> = {
    status: "dashboard",
    generate: "go",
  };

  const command = COMMAND_ALIASES[args[0]] || args[0];

  // --version / -V anywhere in args
  if (args.includes("--version") || args.includes("-V")) {
    printVersion();
    process.exit(0);
  }

  // `codepliant version` command
  if (command === "version") {
    printVersion();
    process.exit(0);
  }

  // `codepliant info` command — installation & environment info
  if (command === "info") {
    printInfo();
    process.exit(0);
  }

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printBanner();
    printUsage();
    process.exit(0);
  }

  // Per-command --help: `codepliant <command> --help` or `codepliant <command> -h`
  if (args.includes("--help") || args.includes("-h")) {
    const COMMAND_HELP = getCommandHelp();
    const helpText = COMMAND_HELP[command];
    if (helpText) {
      console.log(`\n${helpText}`);
      process.exit(0);
    }
  }

  // `codepliant completions` command — output shell completion script
  if (command === "completions") {
    const shellIdx = args.indexOf("--shell");
    let shell = shellIdx !== -1 && args[shellIdx + 1] ? args[shellIdx + 1] : "";
    if (!shell) {
      const envShell = process.env.SHELL || "";
      if (envShell.includes("zsh")) shell = "zsh";
      else if (envShell.includes("fish")) shell = "fish";
      else if (envShell.includes("bash")) shell = "bash";
      else shell = "bash";
    }
    const script = generateCompletionScript(shell);
    if (!script) {
      console.error(`${RED()}Unsupported shell: "${shell}". Use bash, zsh, or fish.${RESET()}`);
      process.exit(1);
    }
    process.stdout.write(script);
    process.exit(0);
  }

  // Parse options
  let projectPath = ".";
  let outputDir = "./legal";
  let jsonOutput = false;
  let quiet = false;
  let watchMode = false;
  let formatFlag: OutputFormat | undefined;
  let verbose = false;
  let port = 3939;
  let executiveSummaryFlag = false;
  let apiFlag = false;
  let frequencyFlag: ScheduleFrequency = "weekly";
  let forceFlag = false;
  let detailedFlag = false;
  let ecosystemFlag: string | undefined;
  let sinceFlag: string | undefined;
  let emailFlag = false;
  let slackFlag = false;
  let githubPagesFlag = false;
  let prFlag = false;
  let scanOutputFile: string | undefined;
  let fromEnvFlag = false;
  let dryRunFlag = false;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--output" || arg === "-o") {
      outputDir = args[++i] || "./legal";
    } else if (arg === "--json") {
      jsonOutput = true;
    } else if (arg === "--quiet" || arg === "-q") {
      quiet = true;
    } else if (arg === "--verbose" || arg === "-v") {
      verbose = true;
    } else if (arg === "--watch" || arg === "-w") {
      watchMode = true;
    } else if (arg === "--no-color") {
      // already handled by initColor
    } else if (arg === "--force") {
      forceFlag = true;
    } else if (arg === "--detailed") {
      detailedFlag = true;
    } else if (arg === "--executive-summary") {
      executiveSummaryFlag = true;
    } else if (arg === "--email") {
      emailFlag = true;
    } else if (arg === "--slack") {
      slackFlag = true;
    } else if (arg === "--api") {
      apiFlag = true;
    } else if (arg === "--github-pages") {
      githubPagesFlag = true;
    } else if (arg === "--pr") {
      prFlag = true;
    } else if (arg === "--from-env") {
      fromEnvFlag = true;
    } else if (arg === "--dry-run") {
      dryRunFlag = true;
    } else if (arg === "--frequency") {
      const freq = args[++i];
      if (freq === "daily" || freq === "weekly" || freq === "monthly") {
        frequencyFlag = freq;
      } else {
        console.error(`${RED()}[CP009] Error: Invalid frequency "${freq}". Use: daily, weekly, monthly${RESET()}`);
        process.exit(1);
      }
    } else if (arg === "--format") {
      const fmt = args[++i];
      if (fmt === "markdown" || fmt === "html" || fmt === "pdf" || fmt === "json" || fmt === "notion" || fmt === "confluence" || fmt === "wiki" || fmt === "docx" || fmt === "all") {
        formatFlag = fmt;
      } else {
        console.error(`${RED()}[CP009] Error: Invalid format "${fmt}". Use: markdown, html, pdf, json, notion, confluence, wiki, docx, all${RESET()}`);
        process.exit(1);
      }
    } else if (arg === "--ecosystem") {
      ecosystemFlag = args[++i];
    } else if (arg === "--since") {
      sinceFlag = args[++i];
    } else if (arg === "--done") {
      i++; // skip the value — consumed later by runTodo
    } else if (arg === "--port") {
      const p = parseInt(args[++i], 10);
      if (!isNaN(p) && p > 0 && p < 65536) {
        port = p;
      } else {
        console.error(`${RED()}[CP009] Error: Invalid port number. Use a value between 1 and 65535.${RESET()}`);
        process.exit(1);
      }
    } else if (!arg.startsWith("-") && !(command === "hook" && (arg === "install" || arg === "uninstall")) && !(command === "schedule" && (arg === "install" || arg === "uninstall" || arg === "status")) && !(command === "billing" && (arg === "status" || arg === "usage" || arg === "portal")) && !(command === "template" && arg === "init") && !(command === "team-config" && arg === "init") && !(command === "auth" && arg === "login") && !(command === "config" && arg === "show") && !(command === "fix" && (arg === "missing-dpo" || arg === "stale-docs" || arg === "missing-consent")) && !(command === "preview") && !(command === "search")) {
      projectPath = arg;
    }
  }

  const absProjectPath = path.resolve(projectPath);
  const absOutputDir = path.resolve(absProjectPath, outputDir);

  // For the scan command, --output/-o specifies a file to write results to
  if (command === "scan" && outputDir !== "./legal") {
    scanOutputFile = path.resolve(outputDir);
  }

  // Validate project path with actionable error messages
  if (command !== "help" && command !== "init" && command !== "wizard" && command !== "serve" && command !== "auth" && command !== "audit-trail" && command !== "explain" && command !== "upgrade" && command !== "activate" && command !== "deactivate" && command !== "onboard" && command !== "billing") {
    if (!fs.existsSync(absProjectPath)) {
      console.error(`${RED()}[CP006] Error: "${absProjectPath}" does not exist.${RESET()}`);
      console.error(`${DIM()}Check the path and try again.${RESET()}`);
      process.exit(1);
    }

    let stat: fs.Stats;
    try {
      stat = fs.statSync(absProjectPath);
    } catch (err) {
      console.error(`${RED()}[CP006] Error: ${formatError(err)}${RESET()}`);
      process.exit(1);
    }

    if (!stat.isDirectory()) {
      console.error(`${RED()}[CP007] Error: "${absProjectPath}" is not a directory.${RESET()}`);
      console.error(`${DIM()}Codepliant scans project directories, not individual files.${RESET()}`);
      process.exit(1);
    }
  }

  try {
    if (command === "scan") {
      if (!quiet && !jsonOutput) printBanner();

      const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose);

      // Apply --ecosystem filter if specified
      if (ecosystemFlag) {
        filterByEcosystem(result, ecosystemFlag);
        if (!quiet && !jsonOutput) {
          console.log(`  ${CYAN()}Filtered to ecosystem: ${ecosystemFlag}${RESET()}\n`);
        }
      }

      if (!quiet && !jsonOutput) {
        console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
      }

      if (verbose && timings && !quiet && !jsonOutput) {
        printTimings(timings, durationMs);
      }

      if (jsonOutput) {
        const jsonStr = JSON.stringify(result, null, 2);

        // --output <file>: write JSON to specified file
        if (scanOutputFile) {
          const outDir = path.dirname(scanOutputFile);
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
          }
          fs.writeFileSync(scanOutputFile, jsonStr + "\n", "utf-8");
          if (!quiet) {
            console.log(`  ${GREEN()}Scan results written to ${scanOutputFile}${RESET()}`);
          }
          process.exit(0);
        }

        // For large outputs (>1MB), write to file to avoid pipe truncation
        const JSON_SIZE_THRESHOLD = 1024 * 1024;
        if (jsonStr.length > JSON_SIZE_THRESHOLD) {
          const outFile = path.join(absProjectPath, ".codepliant-scan.json");
          fs.writeFileSync(outFile, jsonStr + "\n", "utf-8");
          console.log(JSON.stringify({ _outputFile: outFile, _size: jsonStr.length, _note: "Output exceeded 1MB; written to file to avoid pipe truncation." }));
        } else {
          process.stdout.write(jsonStr + "\n", () => {
            process.exit(0);
          });
          // Fallback exit if write callback doesn't fire (e.g. broken pipe)
          setTimeout(() => process.exit(0), 5000);
          return;
        }
        process.exit(0);
      }

      // --output <file> without --json: capture terminal output to file
      if (scanOutputFile) {
        // Temporarily redirect console.log to capture output
        const outputLines: string[] = [];
        const origLog = console.log;
        console.log = (...args: unknown[]) => {
          outputLines.push(args.map(String).join(" "));
        };
        printScanResults(result, quiet);
        console.log = origLog;

        const outDir = path.dirname(scanOutputFile);
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }
        // Strip ANSI codes for file output
        const ansiRegex = /\x1b\[[0-9;]*m/g;
        const cleanOutput = outputLines.join("\n").replace(ansiRegex, "");
        fs.writeFileSync(scanOutputFile, cleanOutput + "\n", "utf-8");
        if (!quiet) {
          origLog(`  ${GREEN()}Scan results written to ${scanOutputFile}${RESET()}`);
        }
        process.exit(0);
      }

      printScanResults(result, quiet);

      if (watchMode) {
        startScanWatchMode(absProjectPath, quiet, result);
        return;
      }

      process.exit(0);
    }

    if (command === "scan-all") {
      console.log("Multi-project scan coming soon. Use: codepliant scan <path>"); process.exit(0);
      return;
    }

    if (command === "generate-all") {
      const config = loadConfig(absProjectPath);
      const outputFormat = formatFlag || getOutputFormat(config);
      console.log("Multi-project generate coming soon. Use: codepliant go <path>"); process.exit(0);
      return;
    }

    if (command === "go") {
      if (!quiet && !jsonOutput) printBanner();

      const config = loadConfig(absProjectPath);
      const outputFormat = formatFlag || getOutputFormat(config);

      if (dryRunFlag) {
        // Dry-run: scan and generate in memory, but write nothing
        const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
        const { result, durationMs } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose, plugins);

        if (!quiet && !jsonOutput) {
          console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
          printScanResults(result, quiet);
        }

        const docs = generateDocuments(result, config, plugins);

        // Compute compliance score
        const scoreInput: ScoreInput = {
          scanResult: result,
          docs,
          config,
          outputDir: absOutputDir,
        };
        const fullScore = computeFullComplianceScore(scoreInput);

        // Collect per-doc stats
        const docCategoryMap = new Map<string, number>();
        const docCategorySizeMap = new Map<string, number>();
        interface DryRunEntry {
          name: string;
          filename: string;
          category: string;
          size: number;
        }
        const entries: DryRunEntry[] = [];

        for (const doc of docs) {
          const size = Buffer.byteLength(doc.content, "utf-8");
          const cat = classifyDocCategory(doc.name);
          docCategoryMap.set(cat, (docCategoryMap.get(cat) || 0) + 1);
          docCategorySizeMap.set(cat, (docCategorySizeMap.get(cat) || 0) + size);
          entries.push({ name: doc.name, filename: doc.filename, category: cat, size });
        }

        const totalSize = entries.reduce((sum, e) => sum + e.size, 0);

        if (jsonOutput) {
          console.log(JSON.stringify({
            dryRun: true,
            documents: entries.map(e => ({
              name: e.name,
              filename: e.filename,
              category: e.category,
              estimatedSize: e.size,
            })),
            totalDocuments: docs.length,
            totalEstimatedSize: totalSize,
            complianceScore: fullScore.total,
            complianceGrade: fullScore.grade,
          }, null, 2));
          process.exit(0);
        }

        console.log(`\n${CYAN()}${"─".repeat(50)}${RESET()}`);
        console.log(`${CYAN()}${BOLD()}Dry Run — Preview${RESET()}`);
        console.log(`${CYAN()}${"─".repeat(50)}${RESET()}\n`);

        console.log(`${YELLOW()}${BOLD()}No files will be written.${RESET()}\n`);

        // Group by category for display
        const grouped = new Map<string, DryRunEntry[]>();
        for (const entry of entries) {
          if (!grouped.has(entry.category)) grouped.set(entry.category, []);
          grouped.get(entry.category)!.push(entry);
        }

        for (const cat of [...grouped.keys()].sort()) {
          const catEntries = grouped.get(cat)!;
          console.log(`  ${DIM()}${cat}/${RESET()}`);
          for (let i = 0; i < catEntries.length; i++) {
            const e = catEntries[i];
            const isLast = i === catEntries.length - 1;
            const connector = isLast ? "└──" : "├──";
            console.log(`  ${DIM()}${connector}${RESET()} ${e.filename} ${DIM()}(${e.name}: ${formatFileSize(e.size)})${RESET()}`);
          }
        }

        console.log();
        console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
        console.log(`${CYAN()}${BOLD()}Summary${RESET()}`);
        console.log(`${CYAN()}${"─".repeat(50)}${RESET()}\n`);
        console.log(`  ${BOLD()}Total documents:${RESET()} ${docs.length}`);
        console.log(`  ${BOLD()}Total estimated size:${RESET()} ${formatFileSize(totalSize)}`);
        console.log();
        console.log(`  ${BOLD()}By category:${RESET()}`);
        for (const [cat, count] of [...docCategoryMap.entries()].sort((a, b) => b[1] - a[1])) {
          const catSize = docCategorySizeMap.get(cat) || 0;
          console.log(`    ${DIM()}${cat}:${RESET()} ${count} doc${count > 1 ? "s" : ""} ${DIM()}(${formatFileSize(catSize)})${RESET()}`);
        }
        console.log();
        console.log(`  ${BOLD()}Compliance score:${RESET()} ${fullScore.total}% (${fullScore.grade})`);
        console.log();
        console.log(`${DIM()}Run without --dry-run to write files to ${path.relative(absProjectPath, absOutputDir)}/${RESET()}\n`);

        process.exit(0);
      }

      const result = runScanAndGenerate(absProjectPath, absOutputDir, quiet, jsonOutput, outputFormat, verbose);

      if (watchMode) {
        startWatchMode(absProjectPath, absOutputDir, quiet, result, outputFormat);
        return;
      }

      process.exit(0);
    }

    if (command === "report") {
      runReport(absProjectPath, absOutputDir, quiet, verbose, executiveSummaryFlag, emailFlag, slackFlag);
      return;
    }

    if (command === "check") {
      runCheck(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "ci") {
      runCi(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "count") {
      runCount(absProjectPath, absOutputDir, jsonOutput, detailedFlag);
      return;
    }

    if (command === "stats") {
      runStats(absProjectPath, absOutputDir, jsonOutput);
      return;
    }

    if (command === "summary") {
      runSummary(absProjectPath, absOutputDir, jsonOutput);
      return;
    }

    if (command === "quickstart") {
      runQuickstart(absProjectPath, quiet);
      return;
    }

    if (command === "completeness") {
      runCompleteness(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "migrate") {
      runMigrate(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "lint") {
      runLint(absProjectPath, outputDir, quiet, jsonOutput);
      return;
    }

    if (command === "validate") {
      runValidate(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "diff") {
      runDiff(absProjectPath, absOutputDir, quiet, jsonOutput, formatFlag, sinceFlag, prFlag);
      return;
    }

    if (command === "hook") {
      runHook(absProjectPath, args);
      return;
    }

    if (command === "page") {
      runPage(absProjectPath, absOutputDir, quiet);
      return;
    }

    if (command === "badge") {
      runBadge(absProjectPath, absOutputDir, quiet);
      return;
    }

    if (command === "env") {
      runEnv(absProjectPath, absOutputDir, quiet, verbose);
      return;
    }

    if (command === "dashboard") {
      runDashboard(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "metrics") {
      runMetrics(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "notify") {
      runNotify(absProjectPath, absOutputDir, quiet, jsonOutput, verbose);
      return;
    }

    if (command === "check-config") {
      runCheckConfig(absProjectPath, quiet, jsonOutput);
      process.exit(0);
    }

    if (command === "config") {
      const subCmd = args[1];
      if (subCmd === "show") {
        runConfigShow(absProjectPath);
        process.exit(0);
      }
      console.error(`${RED()}[CP010] Unknown config subcommand: "${subCmd || ""}". Use: codepliant config show${RESET()}`);
      process.exit(1);
    }

    if (command === "init") {
      printBanner();
      if (fromEnvFlag) {
        runInitFromEnv(absProjectPath).then(() => process.exit(0)).catch((err) => {
          console.error(`${RED()}[CP011] Error during init --from-env: ${formatError(err)}${RESET()}`);
          process.exit(1);
        });
      } else {
        runInit(absProjectPath).then(() => process.exit(0)).catch((err) => {
          console.error(`${RED()}[CP011] Error during init: ${formatError(err)}${RESET()}`);
          process.exit(1);
        });
      }
      return;
    }

    if (command === "wizard") {
      printBanner();
      const wizardFormat = formatFlag || undefined;
      runWizard(absProjectPath, outputDir, wizardFormat).then(() => process.exit(0)).catch((err) => {
        console.error(`${RED()}[CP012] Error during wizard: ${formatError(err)}${RESET()}`);
        process.exit(1);
      });
      return;
    }

    if (command === "serve") {
      if (!quiet) printBanner();
      console.log(`${BOLD()}Starting Codepliant API server on port ${port}...${RESET()}\n`);
      startServer({ port }).then(() => {
        console.log(`${GREEN()}${BOLD()}Server listening${RESET()} on ${CYAN()}http://localhost:${port}${RESET()}\n`);
        console.log(`${DIM()}Endpoints:${RESET()}`);
        console.log(`  ${CYAN()}GET  /api/health${RESET()}          Health check`);
        console.log(`  ${CYAN()}GET  /api/scan?path=${RESET()}      Scan a project`);
        console.log(`  ${CYAN()}GET  /api/status?path=${RESET()}    Compliance status`);
        console.log(`  ${CYAN()}POST /api/generate${RESET()}        Generate documents\n`);
        console.log(`${DIM()}Press Ctrl+C to stop.${RESET()}\n`);
      }).catch((err) => {
        console.error(`${RED()}[CP012] Failed to start server: ${formatError(err)}${RESET()}`);
        process.exit(1);
      });
      return;
    }

    if (command === "template") {
      // TODO: implement runTemplate
      console.error(`${RED()}[CP016] The "template" command is not yet implemented.${RESET()}`);
      process.exit(1);
    }

    if (command === "signatures") {
      runSignatures(absProjectPath, args);
      return;
    }

    if (command === "format") {
      runFormat(args, quiet);
      return;
    }

    if (command === "pdf") {
      runPdfSingle(args, quiet).then(() => process.exit(0)).catch((err) => {
        console.error(`${RED()}${BOLD()}[CP074] PDF generation failed:${RESET()} ${formatError(err)}`);
        process.exit(1);
      });
      return;
    }

    if (command === "export") {
      runExportJson(absProjectPath, absOutputDir, outputDir, quiet, verbose);
      return;
    }

    if (command === "export-zip") {
      runExportZip(absProjectPath, absOutputDir, quiet, formatFlag, verbose);
      return;
    }

    if (command === "doctor") {
      runDoctor(absProjectPath, absOutputDir, quiet);
      return;
    }


    if (command === "auth") {
      const subCmd = args[1];
      if (subCmd === "login") {
        handleAuthLogin();
        process.exit(0);
      }
      console.error(`${RED()}[CP025] Unknown auth subcommand: "${subCmd || ""}". Use: codepliant auth login${RESET()}`);
      process.exit(1);
    }

    if (command === "audit-trail") {
      handleAuditTrail(jsonOutput);
      process.exit(0);
    }

    if (command === "team-config") {
      const subCmd = args[1];
      if (subCmd === "init") {
        handleTeamConfigInit(absProjectPath);
        process.exit(0);
      }
      console.error(`${RED()}[CP010] Unknown team-config subcommand: "${subCmd || ""}". Use: codepliant team-config init${RESET()}`);
      process.exit(1);
    }

    if (command === "review") {
      runReview(absProjectPath, absOutputDir, quiet, jsonOutput, verbose).then(() => {
        process.exit(0);
      }).catch((err) => {
        console.error(`${RED()}[CP013] Error during review: ${formatError(err)}${RESET()}`);
        process.exit(1);
      });
      return;
    }

    if (command === "explain") {
      runExplain(absProjectPath, args, quiet, jsonOutput);
      return;
    }

    if (command === "why") {
      runWhy(absProjectPath, args, quiet, jsonOutput);
      return;
    }

    if (command === "ignore") {
      runIgnore(absProjectPath, args, quiet, jsonOutput);
      return;
    }

    if (command === "compare") {
      // Parse two paths from args
      const comparePaths: string[] = [];
      for (let i = 1; i < args.length; i++) {
        const a = args[i];
        if (a.startsWith("-")) {
          if (a === "--output" || a === "-o" || a === "--format" || a === "--port") i++;
          continue;
        }
        comparePaths.push(a);
      }
      if (comparePaths.length < 2) {
        console.error(`${RED()}[CP014] Error: compare requires two project paths.${RESET()}`);
        console.error(`${DIM()}Usage: codepliant compare <path1> <path2>${RESET()}`);
        process.exit(1);
      }
      runCompare(path.resolve(comparePaths[0]), path.resolve(comparePaths[1]), quiet, jsonOutput);
      return;
    }

    if (command === "publish") {
      runPublish(absProjectPath, absOutputDir, quiet, verbose, apiFlag, githubPagesFlag);
      return;
    }

    if (command === "schedule") {
      const subCmd = args[1];
      runSchedule(absProjectPath, absOutputDir, subCmd, frequencyFlag, quiet);
      return;
    }

    if (command === "billing") {
      const subCmd = args[1];
      runBilling(absProjectPath, subCmd, quiet);
      return;
    }

    if (command === "update") {
      runUpdate(absProjectPath, absOutputDir, quiet, jsonOutput, formatFlag, verbose);
      return;
    }

    if (command === "health") {
      runHealth(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "audit") {
      runAudit(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "clean") {
      runClean(absOutputDir, quiet, forceFlag);
      return;
    }

    if (command === "archive") {
      runArchive(absProjectPath, absOutputDir, quiet);
      return;
    }

    if (command === "version-check") {
      runVersionCheck(quiet, jsonOutput);
      return;
    }

    if (command === "list-docs") {
      runListDocs(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "tree") {
      runTree(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "changelog") {
      runChangelog(quiet, jsonOutput);
      return;
    }

    if (command === "fix") {
      runFix(absProjectPath, absOutputDir, args, quiet, verbose);
      return;
    }

    if (command === "todo") {
      const doneArg = args.includes("--done") ? args[args.indexOf("--done") + 1] : undefined;
      runTodo(absProjectPath, absOutputDir, quiet, jsonOutput, doneArg);
      return;
    }

    if (command === "benchmark") {
      runBenchmark(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "preview") {
      runPreview(absProjectPath, absOutputDir, args, quiet);
      return;
    }

    if (command === "reset") {
      runReset(absProjectPath, absOutputDir, args, quiet, forceFlag);
      return;
    }

    if (command === "search") {
      runSearch(absOutputDir, args, quiet);
      return;
    }

    if (command === "certify") {
      runCertify(absProjectPath, absOutputDir, quiet, jsonOutput);
      return;
    }

    if (command === "snapshot") {
      runSnapshot(absProjectPath, absOutputDir, quiet, jsonOutput, args);
      return;
    }

    if (command === "about") {
      printAbout();
      return;
    }

    if (command === "celebrate") {
      printCelebrate();
      return;
    }

    if (command === "sbom") {
      runSbom(absProjectPath, outputDir, quiet, verbose);
      return;
    }

    console.error(`${RED()}[CP008] Unknown command: "${command}"${RESET()}`);
    const suggestions = suggestCommand(command);
    if (suggestions.length === 1) {
      console.error(`\n  Did you mean ${CYAN()}${suggestions[0]}${RESET()}?`);
    } else if (suggestions.length > 1) {
      console.error(`\n  Did you mean one of these?`);
      for (const s of suggestions) {
        console.error(`    ${CYAN()}${s}${RESET()}`);
      }
    }
    console.error(`\n${DIM()}Run ${CYAN()}codepliant help${RESET()}${DIM()} to see available commands.${RESET()}`);
    process.exit(1);
  } catch (err) {
    console.error(`\n${RED()}${BOLD()}[CP027] Error:${RESET()} ${formatError(err)}`);
    process.exit(1);
  }
}

function printScanResults(
  result: ReturnType<typeof scan>,
  quiet: boolean
) {
  if (result.services.length === 0) {
    console.log(
      `${YELLOW()}No services detected.${RESET()} This project may not collect user data.\n`
    );
    // Check whether a project manifest exists at all
    const manifestFiles = ["package.json", "requirements.txt", "go.mod", "Cargo.toml", "Gemfile", "pom.xml", "build.gradle"];
    const hasManifest = manifestFiles.some((f) => fs.existsSync(path.join(result.projectPath, f)));
    if (!hasManifest) {
      console.log(
        `${RED()}No project found.${RESET()} Run codepliant in your project root.\n`
      );
    }
    return;
  }

  if (!quiet) {
    console.log(
      `${BOLD()}Detected ${result.services.length} service(s):${RESET()}\n`
    );
  }

  for (const service of result.services) {
    console.log(
      `  ${GREEN()}✓${RESET()} ${BOLD()}${service.name}${RESET()} ${DIM()}(${formatCategory(service.category)})${RESET()}`
    );
    console.log(
      `    ${DIM()}Data: ${service.dataCollected.join(", ")}${RESET()}`
    );
    for (const ev of service.evidence) {
      console.log(`    ${DIM()}Found: [${ev.type}] ${ev.file} → ${ev.detail}${RESET()}`);
    }
    console.log();
  }

  if (!quiet && result.dataCategories.length > 0) {
    console.log(`${BOLD()}Data categories:${RESET()}\n`);
    for (const cat of result.dataCategories) {
      console.log(`  ${CYAN()}•${RESET()} ${cat.category}`);
      console.log(`    ${DIM()}${cat.description}${RESET()}\n`);
    }
  }
}

function printConfigWarnings(config: CodepliantConfig): void {
  const warnings = validateConfig(config);
  for (const w of warnings) {
    console.log(`  ${YELLOW()}Warning [${w.field}]:${RESET()} ${w.message}`);
    // Add fix suggestion based on field type
    if (w.field === "companyName") {
      console.log(`    ${DIM()}Fix: Set "companyName" in .codepliantrc.json or run 'codepliant init'${RESET()}`);
    } else if (w.field === "contactEmail") {
      console.log(`    ${DIM()}Fix: Set "contactEmail" to a valid email in .codepliantrc.json${RESET()}`);
    } else if (w.field === "jurisdictions") {
      console.log(`    ${DIM()}Fix: Use one or more of: ${VALID_JURISDICTIONS.join(", ")}${RESET()}`);
    } else if (w.field === "outputFormat") {
      console.log(`    ${DIM()}Fix: Set "outputFormat" to one of: markdown, html, pdf, json, notion, confluence, wiki, docx, all${RESET()}`);
    } else if (w.field === "language") {
      console.log(`    ${DIM()}Fix: Set "language" to one of: en, de, fr, es${RESET()}`);
    } else if (w.field === "dataRetentionDays") {
      console.log(`    ${DIM()}Fix: Set "dataRetentionDays" to a positive number (e.g., 365)${RESET()}`);
    } else if (w.field === "aiRiskLevel") {
      console.log(`    ${DIM()}Fix: Set "aiRiskLevel" to one of: minimal, limited, high${RESET()}`);
    }
  }
}

function runScanAndGenerate(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  outputFormat: OutputFormat = "markdown",
  verbose: boolean = false,
): ScanResult {
  // Load config and plugins
  const config = loadConfig(absProjectPath);

  if (!quiet && !jsonOutput) {
    printConfigWarnings(config);
  }

  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  if (plugins.length > 0 && !quiet && !jsonOutput) {
    console.log(`  ${DIM()}Loaded ${plugins.length} plugin(s): ${plugins.map(p => p.name).join(", ")}${RESET()}`);
  }

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose, plugins);

  if (!quiet && !jsonOutput) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet && !jsonOutput) {
    printTimings(timings, durationMs);
  }

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printScanResults(result, quiet);
  }

  // Generate documents
  if (!quiet) console.log(`\n${BOLD()}Generating documents...${RESET()}\n`);

  const genStart = Date.now();
  const docs = generateDocuments(result, config, plugins);

  // Track changes before writing
  const diff = diffDocuments(docs, absOutputDir, outputFormat);

  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, outputFormat, config, result);

  // Write changelog if anything changed
  const changelogPath = appendChangelog(absOutputDir, diff);
  if (changelogPath) {
    writtenFiles.push(changelogPath);
  }

  const genDurationMs = Date.now() - genStart;

  // Collect per-file stats and category counts
  let totalLinesGenerated = 0;
  let totalBytesGenerated = 0;
  const docCategoryMap = new Map<string, number>();
  const docCategorySizeMap = new Map<string, number>();
  // Build tree-view data grouped by category
  interface TreeFileEntry {
    filename: string;
    docName: string;
    size: number;
    lines: number;
  }
  const treeGroups = new Map<string, TreeFileEntry[]>();

  for (const file of writtenFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const size = Buffer.byteLength(content, "utf-8");
    const lines = countLines(content);
    totalLinesGenerated += lines;
    totalBytesGenerated += size;
    const filename = path.basename(file);
    const docName = docs.find(d => file.endsWith(d.filename))?.name || filename;

    // Categorize the document
    const cat = classifyDocCategory(docName);
    docCategoryMap.set(cat, (docCategoryMap.get(cat) || 0) + 1);
    docCategorySizeMap.set(cat, (docCategorySizeMap.get(cat) || 0) + size);

    const category = getDocumentCategory(filename) || "other";
    if (!treeGroups.has(category)) {
      treeGroups.set(category, []);
    }
    treeGroups.get(category)!.push({ filename, docName, size, lines });
  }

  // Render tree-view with box-drawing characters
  const sortedCategories = [...treeGroups.keys()].sort();
  for (const category of sortedCategories) {
    const entries = treeGroups.get(category)!;
    console.log(`  ${DIM()}${category}/${RESET()}`);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const isLast = i === entries.length - 1;
      const connector = isLast ? "└──" : "├──";
      console.log(`  ${DIM()}${connector}${RESET()} ${GREEN()}✓${RESET()} ${entry.filename} ${DIM()}(${entry.docName}: ${formatFileSize(entry.size)}, ${entry.lines} lines)${RESET()}`);
    }
  }

  // --- Generation Summary ---
  if (!quiet) {
    console.log();
    console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
    console.log(`${CYAN()}${BOLD()}Generation Summary${RESET()}`);
    console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
    console.log();
    console.log(`  ${BOLD()}Total documents:${RESET()} ${writtenFiles.length}`);
    console.log(`  ${BOLD()}Total size:${RESET()} ${formatFileSize(totalBytesGenerated)}`);
    console.log(`  ${BOLD()}Generation time:${RESET()} ${formatDuration(genDurationMs)}`);
    console.log();
    console.log(`  ${BOLD()}By category:${RESET()}`);
    for (const [cat, count] of [...docCategoryMap.entries()].sort((a, b) => b[1] - a[1])) {
      const catSize = docCategorySizeMap.get(cat) || 0;
      console.log(`    ${DIM()}${cat}:${RESET()} ${count} doc${count > 1 ? "s" : ""} ${DIM()}(${formatFileSize(catSize)})${RESET()}`);
    }
    console.log();
    console.log(`  ${BOLD()}Total lines generated:${RESET()} ${totalLinesGenerated.toLocaleString()}`);
    console.log();
    console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
    console.log(`${CYAN()}${BOLD()}Estimated Time & Cost Savings${RESET()}`);
    console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
    console.log();
    const genSeconds = (genDurationMs / 1000).toFixed(1);
    const estimatedHoursPerDoc = 0.5; // ~30 min per doc for manual drafting
    const estimatedManualHours = Math.round(writtenFiles.length * estimatedHoursPerDoc);
    const estimatedCostPerDoc = 1000;
    const estimatedCostSaved = writtenFiles.length * estimatedCostPerDoc;
    const costK = Math.round(estimatedCostSaved / 1000);
    console.log(`  ${GREEN()}${BOLD()}Generated ${writtenFiles.length}+ documents in ${genSeconds} seconds${RESET()}`);
    console.log(`  ${GREEN()}${BOLD()}Estimated manual equivalent: ${estimatedManualHours}+ hours${RESET()}`);
    console.log(`  ${GREEN()}${BOLD()}Estimated lawyer cost: $${costK.toLocaleString()},000+${RESET()}`);
    console.log();

    // --- Changes Summary (diff against previous generation) ---
    if (diff.hasChanges) {
      const added = diff.changes.filter(c => c.type === "added");
      const updated = diff.changes.filter(c => c.type === "updated");
      const removed = diff.changes.filter(c => c.type === "removed");
      const unchangedCount = docs.length - diff.changes.filter(c => c.type !== "removed").length;

      console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
      console.log(`${CYAN()}${BOLD()}Changes Since Last Generation${RESET()}`);
      console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
      console.log();

      if (added.length > 0) {
        console.log(`  ${GREEN()}${BOLD()}+ ${added.length} new${RESET()}`);
        for (const change of added) {
          console.log(`    ${GREEN()}+${RESET()} ${change.filename} ${DIM()}(${change.details[0] || change.document})${RESET()}`);
        }
      }
      if (updated.length > 0) {
        console.log(`  ${YELLOW()}${BOLD()}~ ${updated.length} updated${RESET()}`);
        for (const change of updated) {
          console.log(`    ${YELLOW()}~${RESET()} ${change.filename} ${DIM()}(${change.details[0] || change.document})${RESET()}`);
        }
      }
      if (removed.length > 0) {
        console.log(`  ${RED()}${BOLD()}- ${removed.length} removed${RESET()}`);
        for (const change of removed) {
          console.log(`    ${RED()}-${RESET()} ${change.filename} ${DIM()}(${change.details[0] || change.document})${RESET()}`);
        }
      }
      if (unchangedCount > 0) {
        console.log(`  ${DIM()}= ${unchangedCount} unchanged${RESET()}`);
      }
      console.log();
    } else {
      console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
      console.log(`  ${DIM()}All documents unchanged since last generation.${RESET()}`);
      console.log();
    }
  }

  console.log(
    `\n${GREEN()}${BOLD()}Done!${RESET()} ${writtenFiles.length} document(s) generated in ${path.relative(absProjectPath, absOutputDir)}/\n`
  );

  // PDF result info
  const pdfResult = getLastPdfResult();
  if (pdfResult && !pdfResult.isNativePdf) {
    console.log(`${YELLOW()}${BOLD()}PDF note:${RESET()} ${pdfResult.message}\n`);
  }

  // Compliance summary
  if (result.complianceNeeds.length > 0 && !quiet) {
    console.log(`${BOLD()}Compliance summary:${RESET()}\n`);
    for (const need of result.complianceNeeds) {
      const icon = need.priority === "required" ? `${RED()}●${RESET()}` : `${YELLOW()}○${RESET()}`;
      const label =
        need.priority === "required"
          ? `${RED()}REQUIRED${RESET()}`
          : `${YELLOW()}RECOMMENDED${RESET()}`;
      console.log(`  ${icon} ${need.document} [${label}]`);
      console.log(`    ${DIM()}${need.reason}${RESET()}\n`);
    }
  }

  // Compliance score
  if (!quiet && !jsonOutput) {
    const score = computeComplianceScore(result, absOutputDir);
    console.log(`${BOLD()}Compliance score:${RESET()} ${formatComplianceScore(score)}\n`);
  }

  console.log(
    `${DIM()}⚠ These documents are generated from code analysis. Review and customize them for your specific use case.${RESET()}\n`
  );

  // "What to do next" — 3 actionable items based on what was generated
  if (!quiet && !jsonOutput) {
    const generatedNames = new Set(docs.map(d => d.filename));
    const nextSteps: string[] = [];

    // Step 1: always recommend legal review of the most important docs
    if (generatedNames.has("PRIVACY_POLICY.md") || generatedNames.has("TERMS_OF_SERVICE.md")) {
      nextSteps.push(`Have legal counsel review ${CYAN()}PRIVACY_POLICY.md${RESET()} and ${CYAN()}TERMS_OF_SERVICE.md${RESET()} before publishing`);
    } else {
      nextSteps.push(`Review all generated documents in ${CYAN()}${path.relative(absProjectPath, absOutputDir)}/${RESET()} and customize for your use case`);
    }

    // Step 2: based on what was generated
    if (generatedNames.has("AI_DISCLOSURE.md")) {
      nextSteps.push(`Review ${CYAN()}AI_DISCLOSURE.md${RESET()} for EU AI Act Art. 50 compliance — deadline August 2, 2026`);
    } else if (generatedNames.has("COOKIE_POLICY.md")) {
      nextSteps.push(`Set up a cookie consent banner using ${CYAN()}COOKIE_POLICY.md${RESET()} and ${CYAN()}COOKIE_CONSENT_CONFIG.md${RESET()}`);
    } else if (generatedNames.has("DATA_PROCESSING_AGREEMENT.md")) {
      nextSteps.push(`Send ${CYAN()}DATA_PROCESSING_AGREEMENT.md${RESET()} to your sub-processors for countersigning`);
    } else {
      nextSteps.push(`Run ${CYAN()}codepliant check${RESET()} in your CI pipeline to enforce compliance on every commit`);
    }

    // Step 3: always recommend ongoing monitoring
    if (generatedNames.has("COMPLIANCE_DIGEST.md")) {
      nextSteps.push(`Share ${CYAN()}COMPLIANCE_DIGEST.md${RESET()} with your team via Slack or email for periodic compliance updates`);
    } else {
      nextSteps.push(`Run ${CYAN()}codepliant dashboard${RESET()} to monitor your compliance posture over time`);
    }

    console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
    console.log(`${CYAN()}${BOLD()}What to do next${RESET()}`);
    console.log(`${CYAN()}${"─".repeat(50)}${RESET()}\n`);
    for (let i = 0; i < nextSteps.length; i++) {
      console.log(`  ${BOLD()}${i + 1}.${RESET()} ${nextSteps[i]}`);
    }
    console.log();
  }

  return result;
}

const WATCH_IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "__pycache__",
  "venv",
]);

function startWatchMode(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  previousResult: ScanResult,
  outputFormat: OutputFormat = "markdown"
): void {
  console.log(
    `${CYAN()}${BOLD()}Watching for changes...${RESET()} ${DIM()}(Ctrl+C to stop)${RESET()}\n`
  );

  let lastResult = previousResult;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const watchers: fs.FSWatcher[] = [];

  function handleChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      try {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`\n${DIM()}[${timestamp}] Change detected, re-scanning...${RESET()}`);

        const newResult = scan(absProjectPath);

        // Compare services
        const oldNames = new Set(lastResult.services.map((s) => s.name));
        const newNames = new Set(newResult.services.map((s) => s.name));

        let changed = false;
        for (const s of newResult.services) {
          if (!oldNames.has(s.name)) {
            console.log(
              `  ${GREEN()}+ Detected new service: ${s.name} (${s.category})${RESET()}`
            );
            changed = true;
          }
        }
        for (const s of lastResult.services) {
          if (!newNames.has(s.name)) {
            console.log(
              `  ${RED()}- Service removed: ${s.name} (${s.category})${RESET()}`
            );
            changed = true;
          }
        }

        if (changed) {
          const config = loadConfig(absProjectPath);
          const docs = generateDocuments(newResult, config);
          const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, outputFormat, config, newResult);
          console.log(
            `  ${GREEN()}${BOLD()}Regenerated ${writtenFiles.length} document(s)${RESET()}`
          );
        } else {
          console.log(`  ${DIM()}No service changes detected.${RESET()}`);
        }

        lastResult = newResult;
      } catch (err) {
        console.error(`  ${RED()}[CP020] Error during re-scan: ${formatError(err)}${RESET()}`);
      }
    }, 500);
  }

  function watchDir(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (WATCH_IGNORE_DIRS.has(entry.name)) continue;
        const subdir = path.join(dir, entry.name);
        if (subdir === absOutputDir) continue;
        watchDir(subdir);
      }
    }

    try {
      const watcher = fs.watch(dir, { persistent: true }, (_event, filename) => {
        if (filename && WATCH_IGNORE_DIRS.has(filename)) return;
        handleChange();
      });
      watchers.push(watcher);
    } catch {
      // directory may not be watchable
    }
  }

  watchDir(absProjectPath);

  process.on("SIGINT", () => {
    console.log(`\n${DIM()}Stopping watch mode...${RESET()}`);
    if (debounceTimer) clearTimeout(debounceTimer);
    for (const w of watchers) {
      w.close();
    }
    process.exit(0);
  });
}

function startScanWatchMode(
  absProjectPath: string,
  quiet: boolean,
  previousResult: ScanResult,
): void {
  console.log(
    `\n${CYAN()}${BOLD()}Watching for changes...${RESET()} ${DIM()}(Ctrl+C to stop)${RESET()}\n`
  );

  let lastResult = previousResult;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const watchers: fs.FSWatcher[] = [];

  function handleChange() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      try {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`\n${DIM()}[${timestamp}] Change detected, re-scanning...${RESET()}`);

        const newResult = scan(absProjectPath);

        // Compare services and show diff
        const oldNames = new Set(lastResult.services.map((s) => s.name));
        const newNames = new Set(newResult.services.map((s) => s.name));

        let changed = false;
        for (const s of newResult.services) {
          if (!oldNames.has(s.name)) {
            console.log(
              `  ${GREEN()}+ New service: ${s.name} (${s.category})${RESET()}`
            );
            changed = true;
          }
        }
        for (const s of lastResult.services) {
          if (!newNames.has(s.name)) {
            console.log(
              `  ${RED()}- Removed service: ${s.name} (${s.category})${RESET()}`
            );
            changed = true;
          }
        }

        // Check for data collection changes on existing services
        for (const newSvc of newResult.services) {
          if (oldNames.has(newSvc.name)) {
            const oldSvc = lastResult.services.find((s) => s.name === newSvc.name);
            if (oldSvc) {
              const oldData = new Set(oldSvc.dataCollected || []);
              const newData = new Set(newSvc.dataCollected || []);
              for (const d of newData) {
                if (!oldData.has(d)) {
                  console.log(
                    `  ${YELLOW()}~ ${newSvc.name}: new data type "${d}"${RESET()}`
                  );
                  changed = true;
                }
              }
              for (const d of oldData) {
                if (!newData.has(d)) {
                  console.log(
                    `  ${YELLOW()}~ ${newSvc.name}: removed data type "${d}"${RESET()}`
                  );
                  changed = true;
                }
              }
            }
          }
        }

        if (changed) {
          console.log(
            `\n  ${BOLD()}Services: ${lastResult.services.length} → ${newResult.services.length}${RESET()}`
          );
        } else {
          console.log(`  ${DIM()}No service changes detected.${RESET()}`);
        }

        lastResult = newResult;
      } catch (err) {
        console.error(`  ${RED()}[CP020] Error during re-scan: ${formatError(err)}${RESET()}`);
      }
    }, 500);
  }

  function watchDir(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (WATCH_IGNORE_DIRS.has(entry.name)) continue;
        watchDir(path.join(dir, entry.name));
      }
    }

    try {
      const watcher = fs.watch(dir, { persistent: true }, (_event, filename) => {
        if (filename && WATCH_IGNORE_DIRS.has(filename)) return;
        handleChange();
      });
      watchers.push(watcher);
    } catch {
      // directory may not be watchable
    }
  }

  watchDir(absProjectPath);

  process.on("SIGINT", () => {
    console.log(`\n${DIM()}Stopping watch mode...${RESET()}`);
    if (debounceTimer) clearTimeout(debounceTimer);
    for (const w of watchers) {
      w.close();
    }
    process.exit(0);
  });
}

function ask(rl: readline.Interface, question: string, defaultVal?: string): Promise<string> {
  const prompt = defaultVal ? `${question} ${DIM()}(${defaultVal})${RESET()}: ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultVal || "");
    });
  });
}

async function askYesNo(rl: readline.Interface, question: string, defaultYes: boolean = false): Promise<boolean> {
  const hint = defaultYes ? "Y/n" : "y/N";
  const prompt = `${question} ${DIM()}(${hint})${RESET()}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      const val = answer.trim().toLowerCase();
      if (val === "") resolve(defaultYes);
      else resolve(val === "y" || val === "yes");
    });
  });
}

async function askMultiSelect(rl: readline.Interface, question: string, options: string[], defaults: string[] = []): Promise<string[]> {
  console.log(`\n${question}`);
  for (let i = 0; i < options.length; i++) {
    const selected = defaults.includes(options[i]);
    console.log(`  ${DIM()}${i + 1})${RESET()} ${options[i]}${selected ? ` ${GREEN()}(selected)${RESET()}` : ""}`);
  }
  const defaultHint = defaults.length > 0 ? defaults.map(d => String(options.indexOf(d) + 1)).join(",") : "none";
  const prompt = `${BOLD()}Enter numbers separated by commas${RESET()} ${DIM()}(${defaultHint})${RESET()}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      const val = answer.trim();
      if (val === "" && defaults.length > 0) {
        resolve(defaults);
        return;
      }
      if (val === "") {
        resolve([]);
        return;
      }
      const indices = val.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n >= 1 && n <= options.length);
      resolve(indices.map(i => options[i - 1]));
    });
  });
}

async function askSelect(rl: readline.Interface, question: string, options: string[], defaultVal: string): Promise<string> {
  console.log(`\n${question}`);
  for (let i = 0; i < options.length; i++) {
    const selected = options[i] === defaultVal;
    console.log(`  ${DIM()}${i + 1})${RESET()} ${options[i]}${selected ? ` ${GREEN()}(default)${RESET()}` : ""}`);
  }
  const defaultIdx = options.indexOf(defaultVal) + 1;
  const prompt = `${BOLD()}Choose${RESET()} ${DIM()}(${defaultIdx})${RESET()}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      const val = answer.trim();
      if (val === "") {
        resolve(defaultVal);
        return;
      }
      const idx = parseInt(val, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= options.length) {
        resolve(options[idx - 1]);
      } else {
        resolve(defaultVal);
      }
    });
  });
}

async function runInit(projectPath: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const existing = configExists(projectPath);
  if (existing) {
    console.log(`${YELLOW()}Config file already exists.${RESET()} Updating...\n`);
  } else {
    console.log(`Setting up Codepliant for this project.\n`);
  }

  const current = loadConfig(projectPath);

  // --- Step 1: Basic info ---
  console.log(`${CYAN()}${BOLD()}Step 1/4: Company Info${RESET()}\n`);

  const companyName = await ask(rl, `${BOLD()}Company name${RESET()}`, current.companyName);
  const contactEmail = await ask(rl, `${BOLD()}Contact email${RESET()}`, current.contactEmail);
  const website = await ask(rl, `${BOLD()}Website URL${RESET()}`, current.website || "");
  const jurisdiction = await ask(
    rl,
    `${BOLD()}Primary legal jurisdiction${RESET()}`,
    current.jurisdiction || "State of Delaware, United States"
  );

  // --- Step 2: Jurisdictions + DPO ---
  console.log(`\n${CYAN()}${BOLD()}Step 2/4: Compliance Scope${RESET()}`);

  const jurisdictionOptions = ["GDPR", "CCPA", "UK GDPR"];
  const currentJurisdictions = current.jurisdictions || [];
  const jurisdictions = await askMultiSelect(
    rl,
    `${BOLD()}What jurisdictions apply?${RESET()}`,
    jurisdictionOptions,
    currentJurisdictions
  );

  let dpoName = current.dpoName || "";
  let dpoEmail = current.dpoEmail || "";

  const hasDpo = await askYesNo(rl, `\n${BOLD()}Do you have a Data Protection Officer (DPO)?${RESET()}`, !!current.dpoName);
  if (hasDpo) {
    dpoName = await ask(rl, `${BOLD()}DPO name${RESET()}`, current.dpoName || "");
    dpoEmail = await ask(rl, `${BOLD()}DPO email${RESET()}`, current.dpoEmail || "");
  }

  // --- Step 3: Output preferences ---
  console.log(`\n${CYAN()}${BOLD()}Step 3/4: Output Preferences${RESET()}`);

  const formatOptions = ["markdown", "html", "all"];
  const currentFormat = current.outputFormat || "markdown";
  const outputFormat = await askSelect(
    rl,
    `${BOLD()}Preferred output format?${RESET()}`,
    formatOptions,
    currentFormat
  );

  const outputDir = await ask(rl, `\n${BOLD()}Output directory${RESET()}`, current.outputDir);

  rl.close();

  // --- Build and save config ---
  const config: CodepliantConfig = {
    companyName,
    contactEmail,
    outputDir,
    ...(website && { website }),
    ...(jurisdiction && { jurisdiction }),
    ...(jurisdictions.length > 0 && { jurisdictions }),
    ...(dpoName && { dpoName }),
    ...(dpoEmail && { dpoEmail }),
    ...(outputFormat !== "markdown" && { outputFormat: outputFormat as CodepliantConfig["outputFormat"] }),
  };

  const configPath = saveConfig(projectPath, config);
  const relativePath = path.relative(projectPath, configPath);
  console.log(`\n${GREEN()}${BOLD()}✓${RESET()} Config saved to ${relativePath}`);

  // --- Step 4: Auto-run scan + generate ---
  console.log(`\n${CYAN()}${BOLD()}Step 4/4: Initial Scan & Generate${RESET()}\n`);

  const absProjectPath = path.resolve(projectPath);
  const absOutputDir = path.resolve(absProjectPath, outputDir);
  const format = (outputFormat as OutputFormat) || "markdown";

  const { result, durationMs } = scanWithProgress(absProjectPath, false);
  console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);

  const reloadedConfig = loadConfig(absProjectPath);
  const docs = generateDocuments(result, reloadedConfig);
  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, format, reloadedConfig, result);

  for (const file of writtenFiles) {
    const relPath = path.relative(absProjectPath, file);
    console.log(`  ${GREEN()}✓${RESET()} ${relPath}`);
  }

  // --- Summary ---
  console.log(`\n${GREEN()}${BOLD()}Generated ${writtenFiles.length} document(s).${RESET()}\n`);

  console.log(`${BOLD()}Next steps:${RESET()}\n`);
  console.log(`  1. Review generated documents in ${CYAN()}${outputDir}/${RESET()}`);
  console.log(`  2. Customize them for your specific legal requirements`);
  console.log(`  3. Run ${CYAN()}codepliant go${RESET()} to regenerate after code changes`);
  if (jurisdictions.length > 0) {
    console.log(`  4. Ensure compliance with: ${jurisdictions.join(", ")}`);
  }

  // --- Suggest .gitignore ---
  const gitignorePath = path.join(absProjectPath, ".gitignore");
  const outputDirName = outputDir.replace(/^\.\//, "").replace(/\/$/, "");
  let needsGitignoreHint = false;

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    const lines = gitignoreContent.split("\n").map(l => l.trim());
    const hasEntry = lines.some(l => l === outputDirName || l === `${outputDirName}/` || l === `/${outputDirName}` || l === `/${outputDirName}/`);
    if (!hasEntry) {
      needsGitignoreHint = true;
    }
  } else {
    needsGitignoreHint = true;
  }

  if (needsGitignoreHint) {
    console.log(`\n${YELLOW()}${BOLD()}Tip:${RESET()} Consider adding ${CYAN()}${outputDirName}/${RESET()} to your .gitignore if generated legal docs should not be committed.`);
    console.log(`${DIM()}  echo "${outputDirName}/" >> .gitignore${RESET()}`);
  }

  console.log();
}

// --- `codepliant init --from-env` — auto-configure from environment variables ---

async function runInitFromEnv(projectPath: string) {
  console.log(`${CYAN()}${BOLD()}Initializing from environment variables...${RESET()}\n`);

  const envMap: Record<string, { configKey: keyof CodepliantConfig; transform?: (v: string) => unknown }> = {
    CODEPLIANT_COMPANY: { configKey: "companyName" },
    CODEPLIANT_EMAIL: { configKey: "contactEmail" },
    CODEPLIANT_WEBSITE: { configKey: "website" },
    CODEPLIANT_JURISDICTION: { configKey: "jurisdiction" },
    CODEPLIANT_DPO: { configKey: "dpoName" },
    CODEPLIANT_DPO_EMAIL: { configKey: "dpoEmail" },
    CODEPLIANT_EU_REP: { configKey: "euRepresentative" },
    CODEPLIANT_OUTPUT_DIR: { configKey: "outputDir" },
    CODEPLIANT_OUTPUT_FORMAT: { configKey: "outputFormat" },
    CODEPLIANT_LANGUAGE: { configKey: "language" },
    CODEPLIANT_SECURITY_EMAIL: { configKey: "securityEmail" },
    CODEPLIANT_TOLL_FREE: { configKey: "tollFreeNumber" },
    CODEPLIANT_BUG_BOUNTY_URL: { configKey: "bugBountyUrl" },
    CODEPLIANT_COMPANY_LOCATION: { configKey: "companyLocation" },
    CODEPLIANT_DATA_RETENTION_DAYS: {
      configKey: "dataRetentionDays",
      transform: (v: string) => {
        const n = parseInt(v, 10);
        return isNaN(n) ? undefined : n;
      },
    },
    CODEPLIANT_AI_RISK_LEVEL: { configKey: "aiRiskLevel" },
    CODEPLIANT_JURISDICTIONS: {
      configKey: "jurisdictions",
      transform: (v: string) => v.split(",").map((j) => j.trim()).filter(Boolean),
    },
  };

  const current = loadConfig(projectPath);
  const config: Record<string, unknown> = { ...current };
  let foundCount = 0;

  for (const [envVar, { configKey, transform }] of Object.entries(envMap)) {
    const value = process.env[envVar];
    if (value !== undefined && value.trim().length > 0) {
      const resolved = transform ? transform(value.trim()) : value.trim();
      if (resolved !== undefined) {
        config[configKey] = resolved;
        console.log(`  ${GREEN()}✓${RESET()} ${envVar} → ${configKey}: ${typeof resolved === "object" ? JSON.stringify(resolved) : resolved}`);
        foundCount++;
      }
    }
  }

  if (foundCount === 0) {
    console.log(`${YELLOW()}No CODEPLIANT_* environment variables found.${RESET()}\n`);
    console.log(`${BOLD()}Supported environment variables:${RESET()}\n`);
    console.log(`  ${CYAN()}CODEPLIANT_COMPANY${RESET()}           Company name`);
    console.log(`  ${CYAN()}CODEPLIANT_EMAIL${RESET()}             Contact email`);
    console.log(`  ${CYAN()}CODEPLIANT_WEBSITE${RESET()}           Website URL`);
    console.log(`  ${CYAN()}CODEPLIANT_JURISDICTION${RESET()}      Primary legal jurisdiction`);
    console.log(`  ${CYAN()}CODEPLIANT_DPO${RESET()}               DPO name`);
    console.log(`  ${CYAN()}CODEPLIANT_DPO_EMAIL${RESET()}         DPO email`);
    console.log(`  ${CYAN()}CODEPLIANT_EU_REP${RESET()}            EU representative`);
    console.log(`  ${CYAN()}CODEPLIANT_OUTPUT_DIR${RESET()}        Output directory`);
    console.log(`  ${CYAN()}CODEPLIANT_OUTPUT_FORMAT${RESET()}     Output format (markdown, html, pdf, json, all)`);
    console.log(`  ${CYAN()}CODEPLIANT_LANGUAGE${RESET()}          Language (en, de, fr, es)`);
    console.log(`  ${CYAN()}CODEPLIANT_SECURITY_EMAIL${RESET()}    Security team email`);
    console.log(`  ${CYAN()}CODEPLIANT_TOLL_FREE${RESET()}         Toll-free number`);
    console.log(`  ${CYAN()}CODEPLIANT_BUG_BOUNTY_URL${RESET()}    Bug bounty URL`);
    console.log(`  ${CYAN()}CODEPLIANT_COMPANY_LOCATION${RESET()}  Company location`);
    console.log(`  ${CYAN()}CODEPLIANT_DATA_RETENTION_DAYS${RESET()} Data retention period (days)`);
    console.log(`  ${CYAN()}CODEPLIANT_AI_RISK_LEVEL${RESET()}     AI risk level (minimal, limited, high)`);
    console.log(`  ${CYAN()}CODEPLIANT_JURISDICTIONS${RESET()}     Comma-separated: GDPR,CCPA,UK GDPR`);
    console.log(`\n${DIM()}Example (CI/CD):${RESET()}`);
    console.log(`  ${DIM()}CODEPLIANT_COMPANY="Acme Inc" CODEPLIANT_EMAIL="legal@acme.com" codepliant init --from-env${RESET()}\n`);
    process.exit(1);
  }

  // Save config
  const typedConfig = config as unknown as CodepliantConfig;
  const configPath = saveConfig(projectPath, typedConfig);
  const relativePath = path.relative(projectPath, configPath);
  console.log(`\n${GREEN()}${BOLD()}✓${RESET()} Config saved to ${relativePath} (${foundCount} value(s) from environment)\n`);

  // Auto-run scan + generate
  console.log(`${CYAN()}${BOLD()}Running scan & generate...${RESET()}\n`);

  const absProjectPath = path.resolve(projectPath);
  const outputDir = typedConfig.outputDir || "legal";
  const absOutputDir = path.resolve(absProjectPath, outputDir);
  const format = (typedConfig.outputFormat as OutputFormat) || "markdown";

  const { result, durationMs } = scanWithProgress(absProjectPath, false);
  console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);

  const reloadedConfig = loadConfig(absProjectPath);
  const docs = generateDocuments(result, reloadedConfig);
  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, format, reloadedConfig, result);

  for (const file of writtenFiles) {
    const relPath = path.relative(absProjectPath, file);
    console.log(`  ${GREEN()}✓${RESET()} ${relPath}`);
  }

  console.log(`\n${GREEN()}${BOLD()}Generated ${writtenFiles.length} document(s).${RESET()}\n`);
}

// --- `codepliant format` command ---

function runFormat(args: string[], quiet: boolean) {
  // Usage: codepliant format <file.md> --output html
  const filePath = args[1];
  if (!filePath) {
    console.error(`${RED()}[CP030] Missing file argument.${RESET()}`);
    console.error(`Usage: codepliant format <file.md> --output html`);
    process.exit(1);
  }

  const absFile = path.resolve(filePath);
  if (!fs.existsSync(absFile)) {
    console.error(`${RED()}[CP031] File not found: ${absFile}${RESET()}`);
    process.exit(1);
  }

  if (!absFile.endsWith(".md")) {
    console.error(`${RED()}[CP032] Only .md files are supported. Got: ${path.basename(absFile)}${RESET()}`);
    process.exit(1);
  }

  // Parse --output flag (default to html)
  let outputFormat = "html";
  const outputIdx = args.indexOf("--output");
  if (outputIdx !== -1 && args[outputIdx + 1]) {
    outputFormat = args[outputIdx + 1].toLowerCase();
  }
  const dashOIdx = args.indexOf("-o");
  if (dashOIdx !== -1 && args[dashOIdx + 1]) {
    outputFormat = args[dashOIdx + 1].toLowerCase();
  }

  if (outputFormat !== "html") {
    console.error(`${RED()}[CP033] Unsupported output format: "${outputFormat}". Currently only "html" is supported.${RESET()}`);
    process.exit(1);
  }

  const mdContent = fs.readFileSync(absFile, "utf-8");
  const baseName = path.basename(absFile, ".md");
  const docName = baseName.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Use the Apple-style HTML renderer (compliance page) for a single document
  const html = generateCompliancePage(
    [{ name: docName, filename: path.basename(absFile), content: mdContent }],
    {
      companyName: docName,
      lastUpdated: new Date().toISOString().split("T")[0],
    }
  );

  const outputPath = path.join(path.dirname(absFile), `${baseName}.html`);
  fs.writeFileSync(outputPath, html, "utf-8");

  if (!quiet) {
    const size = Buffer.byteLength(html, "utf-8");
    console.log(`  ${GREEN()}✓${RESET()} ${path.relative(process.cwd(), outputPath)} ${DIM()}(${formatFileSize(size)})${RESET()}`);
    console.log(`\n${GREEN()}${BOLD()}Done!${RESET()} Converted ${path.basename(absFile)} to HTML.\n`);
  }

  process.exit(0);
}

// --- `codepliant pdf` command ---

async function runPdfSingle(args: string[], quiet: boolean) {
  // Usage: codepliant pdf <file.md>
  const filePath = args[1];
  if (!filePath) {
    console.error(`${RED()}[CP070] Missing document argument.${RESET()}`);
    console.error(`Usage: codepliant pdf <file.md>`);
    console.error(`\nGenerate a PDF for a single compliance document using Puppeteer.`);
    process.exit(1);
  }

  const absFile = path.resolve(filePath);
  if (!fs.existsSync(absFile)) {
    console.error(`${RED()}[CP071] File not found: ${absFile}${RESET()}`);
    process.exit(1);
  }

  if (!absFile.endsWith(".md")) {
    console.error(`${RED()}[CP072] Only .md files are supported. Got: ${path.basename(absFile)}${RESET()}`);
    process.exit(1);
  }

  // Check if puppeteer is available
  let puppeteer: any;
  try {
    puppeteer = await import("puppeteer");
  } catch {
    // puppeteer not installed — show install instructions
    console.error(`${RED()}[CP073] Puppeteer is not installed.${RESET()}\n`);
    console.error(`Puppeteer is required for single-document PDF generation.`);
    console.error(`\n${BOLD()}To install:${RESET()}`);
    console.error(`  ${CYAN()}npm install puppeteer${RESET()}`);
    console.error(`  ${DIM()}# or${RESET()}`);
    console.error(`  ${CYAN()}npm install puppeteer-core${RESET()}  ${DIM()}(if you have Chrome/Chromium installed)${RESET()}`);
    console.error(`\n${DIM()}Puppeteer downloads a bundled Chromium (~170 MB) on first install.${RESET()}`);
    console.error(`${DIM()}Alternatively, use: codepliant go --format pdf  (uses wkhtmltopdf or print-ready HTML)${RESET()}`);
    process.exit(1);
  }

  const mdContent = fs.readFileSync(absFile, "utf-8");
  const baseName = path.basename(absFile, ".md");
  const docName = baseName.replace(/[_-]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

  // Convert markdown to styled HTML
  const html = generateCompliancePage(
    [{ name: docName, filename: path.basename(absFile), content: mdContent }],
    {
      companyName: docName,
      lastUpdated: new Date().toISOString().split("T")[0],
    }
  );

  const pdfPath = path.join(path.dirname(absFile), `${baseName}.pdf`);

  if (!quiet) {
    console.log(`  ${DIM()}Generating PDF for ${path.basename(absFile)}...${RESET()}`);
  }

  // Launch Puppeteer and generate PDF
  const browser = await puppeteer.default.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
      printBackground: true,
    });
  } finally {
    await browser.close();
  }

  if (!quiet) {
    const stats = fs.statSync(pdfPath);
    console.log(`  ${GREEN()}✓${RESET()} ${path.relative(process.cwd(), pdfPath)} ${DIM()}(${formatFileSize(stats.size)})${RESET()}`);
    console.log(`\n${GREEN()}${BOLD()}Done!${RESET()} PDF generated for ${path.basename(absFile)}.\n`);
  }
}

// --- `codepliant page` command ---

function runPage(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean
) {
  if (!quiet) printBanner();

  const { result, durationMs } = scanWithProgress(absProjectPath, quiet);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  const config = loadConfig(absProjectPath);
  const docs = generateDocuments(result, config);

  const pageFiles = writeCompliancePage(docs, absOutputDir, {
    companyName: config?.companyName,
    lastUpdated: new Date().toISOString().split("T")[0],
  });

  if (!quiet) {
    for (const file of pageFiles) {
      const relativePath = path.relative(absProjectPath, file);
      const content = fs.readFileSync(file, "utf-8");
      const size = Buffer.byteLength(content, "utf-8");
      console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${formatFileSize(size)})${RESET()}`);
    }
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} Compliance page generated.\n`
    );
  }

  process.exit(0);
}

// --- `codepliant badge` command ---

function runEnv(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  verbose: boolean
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet, verbose, plugins);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet) {
    printTimings(timings, durationMs);
  }

  // Generate .env.example in the project root (not the legal output dir)
  const envPath = writeEnvExample(result, absProjectPath);

  if (!envPath) {
    console.log(`${YELLOW()}No services with environment variables detected.${RESET()}\n`);
    process.exit(0);
  }

  if (!quiet) {
    const relativePath = path.relative(absProjectPath, envPath);
    const content = fs.readFileSync(envPath, "utf-8");
    const varCount = content.split("\n").filter((l: string) => l.match(/^[A-Z_]+=/) ).length;
    console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${varCount} variable(s))${RESET()}`);
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} .env.example generated at ${relativePath}\n`
    );
    console.log(
      `${DIM()}Copy to .env.local and fill in your actual values.${RESET()}\n`
    );
  }

  process.exit(0);
}

function runSbom(
  absProjectPath: string,
  outputDir: string,
  quiet: boolean,
  verbose: boolean
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet, verbose, plugins);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet) {
    printTimings(timings, durationMs);
  }

  const bom = generateSbom(result);

  // Determine output path: --output flag or default to sbom.json in project root
  const outputPath =
    outputDir !== "./legal"
      ? path.resolve(outputDir)
      : path.join(absProjectPath, "sbom.json");

  const writtenPath = writeSbom(bom, outputPath);

  if (!quiet) {
    const relativePath = path.relative(absProjectPath, writtenPath);
    console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${bom.components.length} component(s))${RESET()}`);
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} CycloneDX SBOM generated at ${relativePath}\n`
    );
    console.log(
      `${DIM()}Format: CycloneDX ${bom.specVersion} — compatible with OWASP Dependency-Track, Snyk, Grype, etc.${RESET()}\n`
    );
  }

  process.exit(0);
}

function runBadge(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean
) {
  if (!quiet) printBanner();

  const result = scan(absProjectPath);
  const badgeFiles = writeBadges(result, absOutputDir);

  if (!quiet) {
    for (const file of badgeFiles) {
      const relativePath = path.relative(absProjectPath, file);
      console.log(`  ${GREEN()}✓${RESET()} ${relativePath}`);
    }
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} ${badgeFiles.length} badge(s) generated in ${path.relative(absProjectPath, path.join(absOutputDir, "badges"))}/\n`
    );
  }

  process.exit(0);
}

// --- Email HTML converter (no external deps, inline CSS) ---

function convertReportToEmailHtml(markdown: string, title: string): string {
  // Convert markdown to email-safe HTML with all CSS inlined.
  // No external stylesheets, images, or scripts — copy-pasteable into any email client.

  function escapeHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  const lines = markdown.split("\n");
  const htmlLines: string[] = [];
  let inTable = false;
  let inList = false;
  let inBlockquote = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Blockquote
    if (line.startsWith("> ")) {
      if (!inBlockquote) {
        htmlLines.push('<div style="border-left:4px solid #3b82f6;padding:12px 16px;margin:16px 0;background:#eff6ff;color:#1e40af;font-size:14px;">');
        inBlockquote = true;
      }
      const content = line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      htmlLines.push(`<p style="margin:4px 0;">${content}</p>`);
      continue;
    } else if (inBlockquote) {
      htmlLines.push('</div>');
      inBlockquote = false;
    }

    // Close list if needed
    if (inList && !line.startsWith("- ") && !line.match(/^\d+\.\s/)) {
      htmlLines.push('</ul>');
      inList = false;
    }

    // Horizontal rule
    if (line === "---") {
      htmlLines.push('<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">');
      continue;
    }

    // Headers
    if (line.startsWith("# ")) {
      htmlLines.push(`<h1 style="font-size:24px;font-weight:700;color:#111827;margin:32px 0 16px;border-bottom:2px solid #3b82f6;padding-bottom:8px;">${escapeHtml(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      htmlLines.push(`<h2 style="font-size:20px;font-weight:600;color:#1f2937;margin:28px 0 12px;">${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      htmlLines.push(`<h3 style="font-size:16px;font-weight:600;color:#374151;margin:20px 0 8px;">${escapeHtml(line.slice(4))}</h3>`);
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const cells = line.split("|").filter(Boolean).map(c => c.trim());

      // Check if this is a separator row
      if (cells.every(c => /^[-:]+$/.test(c))) continue;

      if (!inTable) {
        htmlLines.push('<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">');
        // First row is header
        htmlLines.push('<tr>');
        for (const cell of cells) {
          const formatted = cell.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:13px;">$1</code>');
          htmlLines.push(`<th style="padding:10px 12px;text-align:left;border:1px solid #d1d5db;background:#f9fafb;font-weight:600;color:#374151;">${formatted}</th>`);
        }
        htmlLines.push('</tr>');
        inTable = true;
        continue;
      }

      htmlLines.push('<tr>');
      for (const cell of cells) {
        const formatted = cell.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:13px;">$1</code>');
        htmlLines.push(`<td style="padding:8px 12px;border:1px solid #d1d5db;color:#4b5563;">${formatted}</td>`);
      }
      htmlLines.push('</tr>');
      continue;
    } else if (inTable) {
      htmlLines.push('</table>');
      inTable = false;
    }

    // Unordered list
    if (line.startsWith("- ")) {
      if (!inList) {
        htmlLines.push('<ul style="padding-left:24px;margin:8px 0;">');
        inList = true;
      }
      const content = line.slice(2)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:13px;">$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#3b82f6;">$1</a>');
      // Handle checkbox
      const checkbox = content.startsWith("[ ] ")
        ? '<span style="color:#9ca3af;">&#9744;</span> ' + content.slice(4)
        : content.startsWith("[x] ")
          ? '<span style="color:#22c55e;">&#9745;</span> ' + content.slice(4)
          : content;
      htmlLines.push(`<li style="margin:4px 0;color:#4b5563;font-size:14px;">${checkbox}</li>`);
      continue;
    }

    // Ordered list
    const orderedMatch = line.match(/^(\d+)\.\s(.+)/);
    if (orderedMatch) {
      if (!inList) {
        htmlLines.push('<ul style="padding-left:24px;margin:8px 0;list-style-type:decimal;">');
        inList = true;
      }
      const content = orderedMatch[2]
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:13px;">$1</code>');
      htmlLines.push(`<li style="margin:4px 0;color:#4b5563;font-size:14px;">${content}</li>`);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      continue;
    }

    // Bold, code, links inline
    const formatted = escapeHtml(line)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:13px;">$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#3b82f6;">$1</a>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
    htmlLines.push(`<p style="margin:8px 0;color:#4b5563;font-size:14px;line-height:1.6;">${formatted}</p>`);
  }

  // Close any open elements
  if (inBlockquote) htmlLines.push('</div>');
  if (inTable) htmlLines.push('</table>');
  if (inList) htmlLines.push('</ul>');

  const body = htmlLines.join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escapeHtml(title)} — Compliance Report</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
<div style="max-width:680px;margin:0 auto;padding:32px 24px;background:#ffffff;">
${body}
</div>
</body>
</html>`;
}

/**
 * Convert a markdown compliance report to Slack-compatible markdown (mrkdwn).
 * Slack uses its own formatting syntax:
 *   - *bold* instead of **bold**
 *   - _italic_ instead of *italic*
 *   - No # headers — use *bold* text on its own line
 *   - Tables become aligned text blocks
 *   - Links: <url|text> instead of [text](url)
 *   - Code: `backticks` work, but ``` code blocks use different indentation
 *   - Blockquotes: > works in Slack
 *   - Checkboxes rendered as emoji
 */
function convertReportToSlackMarkdown(markdown: string, title: string): string {
  const lines = markdown.split("\n");
  const slackLines: string[] = [];

  slackLines.push(`*${title} — Compliance Report*`);
  slackLines.push("");

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableWidths: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Skip table separator rows
    if (line.match(/^\|[\s-:|]+\|$/)) {
      continue;
    }

    // Table rows
    if (line.startsWith("|")) {
      const cells = line.split("|").filter(Boolean).map((c) => c.trim());

      if (!inTable) {
        // First row is header
        inTable = true;
        tableHeaders = cells;
        tableWidths = cells.map((c) => Math.max(c.length, 10));
        // Output header as bold
        const headerLine = cells.map((c) => `*${c}*`).join("  |  ");
        slackLines.push(headerLine);
        slackLines.push("—".repeat(headerLine.length));
        continue;
      }

      // Data row
      const formatted = cells
        .map((c) =>
          c
            .replace(/\*\*(.+?)\*\*/g, "*$1*")
            .replace(/\[(.+?)\]\((.+?)\)/g, "<$2|$1>")
        )
        .join("  |  ");
      slackLines.push(formatted);
      continue;
    } else if (inTable) {
      inTable = false;
      tableHeaders = [];
      tableWidths = [];
      slackLines.push("");
    }

    // Headers — convert to bold text
    if (line.startsWith("# ")) {
      slackLines.push("");
      slackLines.push(`*${line.slice(2)}*`);
      slackLines.push("");
      continue;
    }
    if (line.startsWith("## ")) {
      slackLines.push("");
      slackLines.push(`*${line.slice(3)}*`);
      slackLines.push("");
      continue;
    }
    if (line.startsWith("### ")) {
      slackLines.push(`*${line.slice(4)}*`);
      continue;
    }

    // Horizontal rule
    if (line === "---") {
      slackLines.push("———");
      continue;
    }

    // Blockquote — Slack supports >
    if (line.startsWith("> ")) {
      const content = line
        .slice(2)
        .replace(/\*\*(.+?)\*\*/g, "*$1*")
        .replace(/\[(.+?)\]\((.+?)\)/g, "<$2|$1>");
      slackLines.push(`> ${content}`);
      continue;
    }

    // Checkboxes
    line = line.replace(/- \[ \] /g, ":white_square: ");
    line = line.replace(/- \[x\] /g, ":white_check_mark: ");

    // Convert markdown bold to Slack bold
    line = line.replace(/\*\*(.+?)\*\*/g, "*$1*");

    // Convert markdown links to Slack links
    line = line.replace(/\[(.+?)\]\((.+?)\)/g, "<$2|$1>");

    // Convert markdown italic (single *) to Slack italic (_)
    // Only match single asterisks that are not part of bold
    line = line.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "_$1_");

    slackLines.push(line);
  }

  return slackLines.join("\n");
}

// --- `codepliant report` command ---

function runReport(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  verbose: boolean,
  executiveSummary: boolean = false,
  email: boolean = false,
  slack: boolean = false,
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  if (!quiet) printConfigWarnings(config);

  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  if (plugins.length > 0 && !quiet) {
    console.log(`  ${DIM()}Loaded ${plugins.length} plugin(s): ${plugins.map(p => p.name).join(", ")}${RESET()}`);
  }

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet, verbose, plugins);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet) {
    printTimings(timings, durationMs);
  }

  // Generate documents so we can include the inventory in the report
  const docs = generateDocuments(result, config, plugins);

  if (!quiet) {
    console.log(`${BOLD()}Generating compliance report...${RESET()}\n`);
  }

  const reportPath = writeComplianceReport({
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  });

  const relativePath = path.relative(absProjectPath, reportPath);
  const content = fs.readFileSync(reportPath, "utf-8");
  const size = Buffer.byteLength(content, "utf-8");
  const lines = countLines(content);

  console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${formatFileSize(size)}, ${lines} lines)${RESET()}`);

  // Executive summary (Pro feature)
  if (executiveSummary) {
    const license = checkLicense(config.licenseKey);
    const hint = checkAndTrackFeature(license, "executive-summary");
    if (hint) {
      console.log(`\n  ${YELLOW()}${hint}${RESET()}`);
    }

    const summaryPath = writeExecutiveSummary({
      scanResult: result,
      docs,
      config,
      outputDir: absOutputDir,
    });
    const summaryRelative = path.relative(absProjectPath, summaryPath);
    const summaryContent = fs.readFileSync(summaryPath, "utf-8");
    const summarySize = Buffer.byteLength(summaryContent, "utf-8");
    const summaryLines = countLines(summaryContent);

    console.log(`  ${GREEN()}✓${RESET()} ${summaryRelative} ${DIM()}(${formatFileSize(summarySize)}, ${summaryLines} lines)${RESET()}`);
  }

  // Email-friendly HTML version
  if (email) {
    const emailHtml = convertReportToEmailHtml(content, config?.companyName || result.projectName);
    const emailFilename = "COMPLIANCE_REPORT_EMAIL.html";
    const emailPath = path.join(absOutputDir, emailFilename);
    fs.mkdirSync(absOutputDir, { recursive: true });
    fs.writeFileSync(emailPath, emailHtml, "utf-8");
    const emailRelative = path.relative(absProjectPath, emailPath);
    const emailSize = Buffer.byteLength(emailHtml, "utf-8");
    const emailLines = countLines(emailHtml);
    console.log(`  ${GREEN()}✓${RESET()} ${emailRelative} ${DIM()}(${formatFileSize(emailSize)}, ${emailLines} lines — email-ready HTML)${RESET()}`);
  }

  // Slack-compatible markdown version
  if (slack) {
    const slackContent = convertReportToSlackMarkdown(content, config?.companyName || result.projectName);
    const slackFilename = "COMPLIANCE_REPORT_SLACK.md";
    const slackPath = path.join(absOutputDir, slackFilename);
    fs.mkdirSync(absOutputDir, { recursive: true });
    fs.writeFileSync(slackPath, slackContent, "utf-8");
    const slackRelative = path.relative(absProjectPath, slackPath);
    const slackSize = Buffer.byteLength(slackContent, "utf-8");
    const slackLines = countLines(slackContent);
    console.log(`  ${GREEN()}✓${RESET()} ${slackRelative} ${DIM()}(${formatFileSize(slackSize)}, ${slackLines} lines — Slack-ready markdown)${RESET()}`);
  }

  console.log(
    `\n${GREEN()}${BOLD()}Done!${RESET()} Compliance report generated in ${path.relative(absProjectPath, absOutputDir)}/\n`
  );

  console.log(
    `${DIM()}⚠ This report is generated from code analysis. Review with legal counsel before relying on it for compliance decisions.${RESET()}\n`
  );

  process.exit(0);
}

// --- `codepliant check` command ---

function runCheck(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean
) {
  const result = scan(absProjectPath);

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  interface CheckResult {
    document: string;
    required: boolean;
    exists: boolean;
  }

  const checks: CheckResult[] = [];
  let allPass = true;

  for (const need of result.complianceNeeds) {
    const filenames = docFileMap[need.document];
    if (!filenames) continue;
    const exists = filenames.some(f => fs.existsSync(path.join(absOutputDir, f)));
    checks.push({
      document: need.document,
      required: need.priority === "required",
      exists,
    });
    if (need.priority === "required" && !exists) {
      allPass = false;
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify({ pass: allPass, checks }, null, 2));
    process.exit(allPass ? 0 : 1);
  }

  if (!quiet) {
    console.log(`\n${BOLD()}Compliance check:${RESET()}\n`);
  }

  for (const check of checks) {
    const status = check.exists
      ? `${GREEN()}✓ EXISTS${RESET()}`
      : check.required
        ? `${RED()}✗ MISSING${RESET()}`
        : `${YELLOW()}○ MISSING${RESET()}`;
    const priority = check.required ? `${RED()}required${RESET()}` : `${DIM()}recommended${RESET()}`;
    console.log(`  ${status}  ${check.document} (${priority})`);
  }

  console.log();

  if (allPass) {
    console.log(`${GREEN()}${BOLD()}PASS${RESET()} All required compliance documents exist.\n`);
  } else {
    const missing = checks.filter(c => c.required && !c.exists).map(c => c.document);
    console.log(`${RED()}${BOLD()}FAIL${RESET()} Missing required document(s): ${missing.join(", ")}`);
    console.log(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate them.${RESET()}\n`);
  }

  process.exit(allPass ? 0 : 1);
}

// --- `codepliant ci` command ---
// One command for CI/CD pipelines: scan + check in one step.
// Returns exit 0 if compliant, exit 1 if not.
// Minimal output by default; use --json for machine-readable output.

function runCi(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);

  // Generate documents to determine what should exist
  const docs = generateDocuments(result, config);

  // Write documents so check can find them
  const writtenFiles = writeDocuments(docs, absOutputDir);

  // Now run the compliance check
  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  interface CiCheckResult {
    document: string;
    required: boolean;
    exists: boolean;
  }

  const checks: CiCheckResult[] = [];
  let allPass = true;

  for (const need of result.complianceNeeds) {
    const filenames = docFileMap[need.document];
    if (!filenames) continue;
    const exists = filenames.some(f => fs.existsSync(path.join(absOutputDir, f)));
    checks.push({
      document: need.document,
      required: need.priority === "required",
      exists,
    });
    if (need.priority === "required" && !exists) {
      allPass = false;
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify({
      pass: allPass,
      services: result.services.length,
      documents: writtenFiles.length,
      checks,
    }, null, 2));
    process.exit(allPass ? 0 : 1);
  }

  // Minimal output by default
  if (!quiet) {
    console.log(`${BOLD()}codepliant ci${RESET()} — scan + check`);
    console.log(`  Services: ${result.services.length}`);
    console.log(`  Documents: ${writtenFiles.length} generated`);
  }

  if (allPass) {
    if (!quiet) {
      console.log(`${GREEN()}${BOLD()}PASS${RESET()} Compliant.`);
    }
  } else {
    const missing = checks.filter(c => c.required && !c.exists).map(c => c.document);
    if (!quiet) {
      console.log(`${RED()}${BOLD()}FAIL${RESET()} Missing: ${missing.join(", ")}`);
    } else {
      console.log(`FAIL`);
    }
  }

  process.exit(allPass ? 0 : 1);
}

// --- `codepliant count` command ---

function runCount(
  absProjectPath: string,
  absOutputDir: string,
  jsonOutput: boolean,
  detailed: boolean = false,
) {
  const config = loadConfig(absProjectPath);
  const scanStart = Date.now();
  const result = scan(absProjectPath, { verbose: detailed });
  const scanDuration = Date.now() - scanStart;
  const timings = (result as ScanResult & { timings?: ScanTimings }).timings;

  const genStart = Date.now();
  const docs = generateDocuments(result, config);
  const genDuration = Date.now() - genStart;

  // Compute compliance score
  const scoreInput: ScoreInput = {
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  };
  const fullScore = computeFullComplianceScore(scoreInput);

  if (!detailed) {
    if (jsonOutput) {
      console.log(JSON.stringify({
        services: result.services.length,
        documents: docs.length,
        score: fullScore.total,
        grade: fullScore.grade,
      }, null, 2));
      process.exit(0);
    }

    // One-line output for scripting
    console.log(`services=${result.services.length} documents=${docs.length} score=${fullScore.total} grade=${fullScore.grade}`);
    process.exit(0);
  }

  // --detailed output
  if (jsonOutput) {
    const detailedJson: Record<string, unknown> = {
      services: result.services.length,
      documents: docs.length,
      score: fullScore.total,
      grade: fullScore.grade,
      scanDurationMs: scanDuration,
      generationDurationMs: genDuration,
      scannerTimings: timings || {},
      generatorOutputs: docs.map((d) => ({
        name: d.name,
        filename: d.filename,
        sizeBytes: Buffer.byteLength(d.content, "utf-8"),
      })),
      serviceConfidence: result.services.map((s) => ({
        name: s.name,
        category: s.category,
        evidenceCount: s.evidence.length,
        evidenceTypes: [...new Set(s.evidence.map((e) => e.type))],
        confidence: s.evidence.length >= 3 ? "high" : s.evidence.length >= 2 ? "medium" : "low",
      })),
    };
    console.log(JSON.stringify(detailedJson, null, 2));
    process.exit(0);
  }

  printBanner();
  console.log(`${BOLD()}Detailed Statistics${RESET()}\n`);

  // Overview
  console.log(`  Services: ${result.services.length}   Documents: ${docs.length}   Score: ${fullScore.total}% (${fullScore.grade})`);
  console.log(`  Scan: ${scanDuration}ms   Generation: ${genDuration}ms   Total: ${scanDuration + genDuration}ms\n`);

  // Per-scanner timing breakdown
  if (timings) {
    console.log(`  ${BOLD()}Scanner Timing Breakdown:${RESET()}\n`);
    for (const [name, ms] of Object.entries(timings)) {
      const bar = ms > 0 ? "█".repeat(Math.max(1, Math.round(ms / 2))) : "";
      console.log(`    ${DIM()}${name.padEnd(14)}${RESET()} ${String(ms).padStart(4)}ms ${DIM()}${bar}${RESET()}`);
    }
    console.log(`    ${"─".repeat(28)}`);
    console.log(`    ${BOLD()}${"Total".padEnd(14)}${RESET()} ${BOLD()}${String(scanDuration).padStart(4)}ms${RESET()}\n`);
  }

  // Per-generator output size
  console.log(`  ${BOLD()}Generator Output Sizes:${RESET()}\n`);
  let totalSize = 0;
  for (const doc of docs) {
    const size = Buffer.byteLength(doc.content, "utf-8");
    totalSize += size;
    console.log(`    ${doc.filename.padEnd(44)} ${DIM()}${formatFileSize(size)}${RESET()}`);
  }
  console.log(`    ${"─".repeat(52)}`);
  console.log(`    ${"Total".padEnd(44)} ${BOLD()}${formatFileSize(totalSize)}${RESET()}\n`);

  // Detection confidence per service
  console.log(`  ${BOLD()}Detection Confidence:${RESET()}\n`);
  for (const service of result.services) {
    const evidenceCount = service.evidence.length;
    const confidence = evidenceCount >= 3 ? "high" : evidenceCount >= 2 ? "medium" : "low";
    const color = confidence === "high" ? GREEN() : confidence === "medium" ? YELLOW() : RED();
    const evidenceTypes = [...new Set(service.evidence.map((e) => e.type))].join(", ");
    console.log(`    ${service.name.padEnd(24)} ${color}${confidence.padEnd(7)}${RESET()} ${DIM()}(${evidenceCount} evidence: ${evidenceTypes})${RESET()}`);
  }
  console.log();

  process.exit(0);
}

// --- `codepliant stats` command ---

function countDocsOnDisk(outputDir: string): number {
  if (!fs.existsSync(outputDir)) return 0;
  let count = 0;
  const docExtensions = new Set([".md", ".html", ".pdf", ".txt"]);
  function walkDir(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && docExtensions.has(path.extname(entry.name).toLowerCase())) {
        count++;
      }
    }
  }
  walkDir(outputDir);
  return count;
}

function getLastDocModification(outputDir: string): Date | null {
  if (!fs.existsSync(outputDir)) return null;
  let latest: Date | null = null;
  const docExtensions = new Set([".md", ".html", ".pdf", ".txt"]);
  function walkDir(dir: string) {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.isFile() && docExtensions.has(path.extname(entry.name).toLowerCase())) {
        try {
          const stat = fs.statSync(fullPath);
          if (!latest || stat.mtime > latest) {
            latest = stat.mtime;
          }
        } catch {
          // skip
        }
      }
    }
  }
  walkDir(outputDir);
  return latest;
}

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  return "just now";
}

function runStats(
  absProjectPath: string,
  absOutputDir: string,
  jsonOutput: boolean,
) {
  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  // Compute compliance score
  const scoreInput: ScoreInput = {
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  };
  const fullScore = computeFullComplianceScore(scoreInput);

  // Count existing docs on disk
  const docsOnDisk = countDocsOnDisk(absOutputDir);

  // Last modification time
  const lastMod = getLastDocModification(absOutputDir);

  if (jsonOutput) {
    console.log(JSON.stringify({
      version: VERSION,
      services: result.services.length,
      docs: docsOnDisk,
      score: fullScore.total,
      grade: fullScore.grade,
      lastScan: lastMod ? lastMod.toISOString() : null,
      lastScanRelative: lastMod ? formatTimeAgo(lastMod) : null,
    }, null, 2));
    process.exit(0);
  }

  const lastScanStr = lastMod ? formatTimeAgo(lastMod) : "never";
  console.log(`codepliant v${VERSION} | ${result.services.length} services | ${docsOnDisk} docs | Score: ${fullScore.grade} (${fullScore.total}%) | Last scan: ${lastScanStr}`);
  process.exit(0);
}

// --- `codepliant summary` command ---

function runSummary(
  absProjectPath: string,
  absOutputDir: string,
  jsonOutput: boolean,
) {
  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  const scoreInput: ScoreInput = {
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  };
  const fullScore = computeFullComplianceScore(scoreInput);

  // Identify key/notable services to name explicitly
  const serviceNames = result.services.map((s) => s.name);
  const notable = serviceNames.filter((n) =>
    /openai|stripe|anthropic|google|sentry|posthog|mixpanel|amplitude|datadog|twilio|sendgrid|aws|firebase|supabase|clerk|auth0|vercel/i.test(n)
  );
  const namedServices = notable.length > 0
    ? notable.slice(0, 3).join(", ") + (notable.length > 3 ? `, and ${notable.length - 3} more` : "")
    : serviceNames.slice(0, 3).join(", ") + (serviceNames.length > 3 ? `, and ${serviceNames.length - 3} more` : "");

  // Identify needed document types
  const neededDocs = [...new Set(result.complianceNeeds.map((n) => n.document))];
  const neededList = neededDocs.length > 0
    ? neededDocs.slice(0, 4).map((d) => d.toLowerCase()).join(", ") + (neededDocs.length > 4 ? `, and ${neededDocs.length - 4} more` : "")
    : "no additional documents";

  // Build the summary paragraph
  const serviceCountText = result.services.length === 1
    ? "1 service"
    : `${result.services.length} services`;
  const docCountText = docs.length === 1
    ? "1 document"
    : `${docs.length} documents`;

  const summary = `Your project uses ${serviceCountText}${namedServices ? ` including ${namedServices}` : ""}. You need ${neededList}. Codepliant generates ${docCountText} for your project. Your compliance score is ${fullScore.total}% (${fullScore.grade}).`;

  if (jsonOutput) {
    console.log(JSON.stringify({
      summary,
      services: result.services.length,
      serviceNames,
      documents: docs.length,
      neededDocuments: neededDocs,
      score: fullScore.total,
      grade: fullScore.grade,
    }, null, 2));
    process.exit(0);
  }

  console.log(`\n${summary}\n`);
  process.exit(0);
}

// --- `codepliant quickstart` command ---

function runQuickstart(absProjectPath: string, quiet: boolean) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);

  const ctx = {
    companyName: config?.companyName || "[Your Company Name]",
    contactEmail: config?.contactEmail || "[your-email@example.com]",
    website: config?.website,
    jurisdiction: config?.jurisdiction,
    dpoName: config?.dpoName,
    dpoEmail: config?.dpoEmail,
    jurisdictions: config?.jurisdictions,
  };

  const guide = generateQuickStartGuide(result, ctx);

  // Print the guide content to terminal (strip the markdown header formatting for readability)
  console.log();
  console.log(`${CYAN()}${BOLD()}Quick Start Compliance Guide${RESET()}`);
  console.log(`${CYAN()}${"═".repeat(50)}${RESET()}`);
  console.log();

  // Print section by section with color highlights
  const lines = guide.split("\n");
  for (const line of lines) {
    if (line.startsWith("# ")) {
      // Skip the main title, we already printed it
      continue;
    } else if (line.startsWith("## ")) {
      console.log(`\n${BOLD()}${CYAN()}${line.replace("## ", "")}${RESET()}`);
      console.log(`${CYAN()}${"─".repeat(50)}${RESET()}`);
    } else if (line.startsWith("### ")) {
      console.log(`\n${BOLD()}${line.replace("### ", "")}${RESET()}`);
    } else if (line.startsWith("- [ ] ")) {
      console.log(`  ${YELLOW()}☐${RESET()} ${line.replace("- [ ] ", "")}`);
    } else if (line.startsWith("> ")) {
      console.log(`  ${DIM()}${line.replace("> ", "")}${RESET()}`);
    } else if (line.startsWith("---")) {
      console.log(`${DIM()}${"─".repeat(50)}${RESET()}`);
    } else {
      console.log(line);
    }
  }

  console.log();
  console.log(`${GREEN()}${BOLD()}Tip:${RESET()} Run ${CYAN()}codepliant go${RESET()} to generate all documents, then follow the steps above.`);
  console.log();

  process.exit(0);
}

// --- `codepliant lint` command ---

function runLint(
  absProjectPath: string,
  outputDir: string,
  quiet: boolean,
  jsonOutput: boolean
) {
  if (!quiet && !jsonOutput) {
    printBanner();
    console.log(`${BOLD()}Linting compliance documents...${RESET()}\n`);
  }

  const result = lintDocuments(absProjectPath, outputDir);

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.passed ? 0 : 1);
  }

  if (!quiet) {
    console.log(`  ${DIM()}Documents expected: ${result.documentsExpected}${RESET()}`);
    console.log(`  ${DIM()}Documents checked:  ${result.documentsChecked}${RESET()}\n`);
  }

  if (result.issues.length === 0) {
    console.log(`${GREEN()}${BOLD()}PASS${RESET()} All compliance documents are complete.\n`);
    process.exit(0);
  }

  const errors = result.issues.filter((i) => i.severity === "error");
  const warnings = result.issues.filter((i) => i.severity === "warning");

  for (const issue of errors) {
    console.log(`  ${RED()}ERROR${RESET()}   ${issue.document}: ${issue.message}`);
  }
  for (const issue of warnings) {
    console.log(`  ${YELLOW()}WARN${RESET()}    ${issue.document}: ${issue.message}`);
  }

  console.log();

  if (result.passed) {
    console.log(`${GREEN()}${BOLD()}PASS${RESET()} ${warnings.length} warning(s), no errors.\n`);
  } else {
    console.log(`${RED()}${BOLD()}FAIL${RESET()} ${errors.length} error(s), ${warnings.length} warning(s).`);
    console.log(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate missing documents.${RESET()}\n`);
  }

  process.exit(result.passed ? 0 : 1);
}

// --- `codepliant validate` command ---

function runValidate(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  if (!quiet && !jsonOutput) {
    printBanner();
    console.log(`${BOLD()}Validating generated compliance documents...${RESET()}\n`);
  }

  // Run a scan so we can check required documents and service-name presence
  let scanResult: ReturnType<typeof scan> | undefined;
  try {
    scanResult = scan(absProjectPath);
  } catch {
    // Scan failure is non-fatal — we just skip scan-dependent checks
    if (!quiet && !jsonOutput) {
      console.log(`${YELLOW()}Warning: Could not scan project — skipping service-based checks.${RESET()}\n`);
    }
  }

  const result = deepValidateDocuments(absOutputDir, scanResult);

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.pass ? 0 : 1);
  }

  if (result.documents.length === 0 && result.checks.length === 0) {
    console.log(`${YELLOW()}No documents found in ${absOutputDir}.${RESET()}`);
    console.log(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate documents first.${RESET()}\n`);
    process.exit(1);
  }

  // Print top-level checks (required-documents-exist, etc.)
  if (result.checks.length > 0) {
    for (const chk of result.checks) {
      const icon = statusIcon(chk.status);
      console.log(`  ${icon} ${chk.message}`);
      if (chk.details && !quiet) {
        for (const d of chk.details) {
          console.log(`    ${DIM()}- ${d}${RESET()}`);
        }
      }
    }
    console.log();
  }

  // Print per-document results
  if (!quiet) {
    console.log(`  ${DIM()}Documents validated: ${result.documents.length}${RESET()}\n`);
  }

  for (const doc of result.documents) {
    const icon = doc.pass ? `${GREEN()}✓${RESET()}` : `${RED()}✗${RESET()}`;
    console.log(`  ${icon} ${doc.name} ${DIM()}(${doc.filename})${RESET()}`);

    if (!quiet) {
      for (const chk of doc.checks) {
        if (chk.status === "pass" && quiet) continue;
        const ci = statusIcon(chk.status);
        console.log(`    ${ci} ${chk.message}`);
        if (chk.details && chk.status !== "pass") {
          for (const d of chk.details) {
            console.log(`      ${DIM()}- ${d}${RESET()}`);
          }
        }
      }
    }
  }

  console.log();

  // Summary line
  const { passed, failed, warned, totalChecks } = result.summary;
  if (result.pass) {
    console.log(`${GREEN()}${BOLD()}PASS${RESET()} ${passed}/${totalChecks} checks passed${warned > 0 ? `, ${warned} warning(s)` : ""}.\n`);
  } else {
    console.log(`${RED()}${BOLD()}FAIL${RESET()} ${failed} check(s) failed, ${passed} passed${warned > 0 ? `, ${warned} warning(s)` : ""} out of ${totalChecks}.\n`);
  }

  process.exit(result.pass ? 0 : 1);
}

function statusIcon(status: CheckStatus): string {
  switch (status) {
    case "pass":
      return `${GREEN()}✓${RESET()}`;
    case "fail":
      return `${RED()}✗${RESET()}`;
    case "warn":
      return `${YELLOW()}⚠${RESET()}`;
  }
}

// --- `codepliant diff` command ---

function runDiff(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  _formatFlag?: OutputFormat,
  sinceDate?: string,
  prOutput: boolean = false,
) {
  // --since mode: show changelog entries since a given date
  if (sinceDate) {
    // Check both categorized (guides/) and flat layout for backwards compatibility
    const categorizedChangelogPath = path.join(absOutputDir, "guides", "DOCUMENT_CHANGELOG.md");
    const flatChangelogPath = path.join(absOutputDir, "DOCUMENT_CHANGELOG.md");
    const changelogPath = fs.existsSync(categorizedChangelogPath) ? categorizedChangelogPath : flatChangelogPath;
    if (!fs.existsSync(changelogPath)) {
      console.error(`${RED()}[CP022] Error: No changelog found at "${changelogPath}".${RESET()}`);
      console.error(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} first to generate documents and create a changelog.${RESET()}`);
      process.exit(1);
    }

    const sinceTs = new Date(sinceDate).getTime();
    if (isNaN(sinceTs)) {
      console.error(`${RED()}[CP009] Error: Invalid date "${sinceDate}". Use YYYY-MM-DD format.${RESET()}`);
      process.exit(1);
    }

    const changelog = fs.readFileSync(changelogPath, "utf-8");
    // Parse changelog entries (## YYYY-MM-DD HH:MM:SS UTC)
    const entryPattern = /^## (\d{4}-\d{2}-\d{2}[\s\S]*?UTC)/gm;
    const entries: { date: string; ts: number; block: string }[] = [];
    const blocks = changelog.split(/(?=^## \d{4})/m);
    for (const block of blocks) {
      const dateMatch = block.match(/^## (\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        const ts = new Date(dateMatch[1]).getTime();
        entries.push({ date: dateMatch[1], ts, block: block.trim() });
      }
    }

    const filteredEntries = entries.filter((e) => e.ts >= sinceTs);

    if (jsonOutput) {
      console.log(JSON.stringify({
        since: sinceDate,
        entriesFound: filteredEntries.length,
        entries: filteredEntries.map((e) => ({ date: e.date, content: e.block })),
      }, null, 2));
      process.exit(filteredEntries.length > 0 ? 1 : 0);
    }

    if (!quiet) {
      console.log(`\n${BOLD()}Changes since ${sinceDate}:${RESET()}\n`);
    }

    if (filteredEntries.length === 0) {
      console.log(`${GREEN()}No changes recorded since ${sinceDate}.${RESET()}\n`);
      process.exit(0);
    }

    for (const entry of filteredEntries) {
      console.log(entry.block);
      console.log();
    }

    console.log(`${DIM()}${filteredEntries.length} changelog entry/entries since ${sinceDate}.${RESET()}\n`);
    process.exit(1);
  }

  if (!fs.existsSync(absOutputDir)) {
    console.error(`${RED()}[CP006] Error: Output directory "${absOutputDir}" does not exist.${RESET()}`);
    console.error(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} first to generate documents.${RESET()}`);
    process.exit(1);
  }

  const config = loadConfig(absProjectPath);
  const outputFormat = _formatFlag || getOutputFormat(config);

  // Scan and generate fresh docs in-memory (don't write)
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  // Compare with existing documents on disk
  const diff = diffDocuments(docs, absOutputDir, outputFormat);

  if (jsonOutput) {
    console.log(JSON.stringify({
      hasChanges: diff.hasChanges,
      timestamp: diff.timestamp,
      changes: diff.changes,
    }, null, 2));
    process.exit(diff.hasChanges ? 1 : 0);
  }

  // --pr: GitHub PR comment Markdown output
  if (prOutput) {
    const lines: string[] = [];
    lines.push("## Codepliant Compliance Diff");
    lines.push("");

    if (!diff.hasChanges) {
      lines.push("> **All compliance documents are up to date.** No changes detected.");
      lines.push("");
      lines.push(`*Generated at ${diff.timestamp}*`);
      console.log(lines.join("\n"));
      process.exit(0);
    }

    const added = diff.changes.filter(c => c.type === "added");
    const updated = diff.changes.filter(c => c.type === "updated");
    const removed = diff.changes.filter(c => c.type === "removed");

    // Summary line
    const parts: string[] = [];
    if (added.length > 0) parts.push(`**${added.length}** added`);
    if (updated.length > 0) parts.push(`**${updated.length}** updated`);
    if (removed.length > 0) parts.push(`**${removed.length}** removed`);
    lines.push(`> ${parts.join(" | ")} | **${docs.length}** total documents`);
    lines.push("");

    if (added.length > 0) {
      lines.push("### Added");
      lines.push("");
      for (const change of added) {
        lines.push(`- \`${change.filename}\` — ${change.document}`);
        for (const detail of change.details) {
          lines.push(`  - ${detail}`);
        }
      }
      lines.push("");
    }

    if (updated.length > 0) {
      lines.push("### Updated");
      lines.push("");
      for (const change of updated) {
        lines.push(`- \`${change.filename}\` — ${change.document}`);
        for (const detail of change.details) {
          lines.push(`  - ${detail}`);
        }
      }
      lines.push("");
    }

    if (removed.length > 0) {
      lines.push("### Removed");
      lines.push("");
      for (const change of removed) {
        lines.push(`- ~~\`${change.filename}\`~~ — ${change.document}`);
        for (const detail of change.details) {
          lines.push(`  - ${detail}`);
        }
      }
      lines.push("");
    }

    // Unchanged summary
    const unchangedCount = docs.length - diff.changes.filter(c => c.type !== "removed").length;
    if (unchangedCount > 0) {
      lines.push(`<details><summary>${unchangedCount} unchanged document(s)</summary>`);
      lines.push("");
      const changedFilenames = new Set(diff.changes.map(c => c.filename));
      for (const doc of docs) {
        if (!changedFilenames.has(doc.filename)) {
          lines.push(`- \`${doc.filename}\``);
        }
      }
      lines.push("");
      lines.push("</details>");
      lines.push("");
    }

    lines.push("---");
    lines.push(`*Codepliant compliance diff at ${diff.timestamp}. Run \`codepliant go\` to regenerate.*`);

    console.log(lines.join("\n"));
    process.exit(diff.hasChanges ? 1 : 0);
  }

  if (!quiet) {
    console.log(`\n${BOLD()}Document diff (current vs. regenerated):${RESET()}\n`);
  }

  if (!diff.hasChanges) {
    for (const doc of docs) {
      console.log(`  ${DIM()}= ${doc.filename} (no changes)${RESET()}`);
    }
    console.log();
    console.log(`${GREEN()}All documents are up to date.${RESET()}\n`);
    process.exit(0);
  }

  const changedFilenames = new Set(diff.changes.map(c => c.filename));
  for (const doc of docs) {
    if (!changedFilenames.has(doc.filename)) {
      console.log(`  ${DIM()}= ${doc.filename} (no changes)${RESET()}`);
    }
  }

  for (const change of diff.changes) {
    switch (change.type) {
      case "added":
        console.log(`  ${GREEN()}+ ${change.filename}${RESET()} ${DIM()}(new)${RESET()}`);
        break;
      case "updated":
        console.log(`  ${YELLOW()}~ ${change.filename}${RESET()}`);
        break;
      case "removed":
        console.log(`  ${RED()}- ${change.filename}${RESET()} ${DIM()}(would be removed)${RESET()}`);
        break;
    }
    for (const detail of change.details) {
      console.log(`    ${DIM()}- ${detail}${RESET()}`);
    }
  }

  console.log();
  console.log(`${YELLOW()}Documents are out of date.${RESET()} Run ${CYAN()}codepliant go${RESET()} to regenerate.\n`);
  process.exit(1);
}

// --- `codepliant update` command ---

function runUpdate(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  formatFlag?: OutputFormat,
  verbose: boolean = false,
) {
  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absProjectPath);
  const outputFormat = formatFlag || getOutputFormat(config);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  // Step 1: Show diff (before regeneration)
  const existingDocs = fs.existsSync(absOutputDir);

  if (!quiet) {
    console.log(`${BOLD()}Step 1: Scanning project...${RESET()}\n`);
  }

  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose, plugins);

  if (!quiet && !jsonOutput) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  if (verbose && timings && !quiet && !jsonOutput) {
    printTimings(timings, durationMs);
  }

  const docs = generateDocuments(result, config, plugins);

  // Step 2: Show diff if existing docs present
  if (existingDocs) {
    const diff = diffDocuments(docs, absOutputDir, outputFormat);

    if (!quiet) {
      console.log(`\n${BOLD()}Step 2: Changes detected:${RESET()}\n`);
    }

    if (!diff.hasChanges) {
      if (!quiet) {
        console.log(`  ${GREEN()}All documents are already up to date.${RESET()}\n`);
      }
      if (jsonOutput) {
        console.log(JSON.stringify({ hasChanges: false, documentsWritten: 0 }, null, 2));
      }
      process.exit(0);
    }

    const changedFilenames = new Set(diff.changes.map(ch => ch.filename));
    for (const doc of docs) {
      if (!changedFilenames.has(doc.filename)) {
        if (!quiet) console.log(`  ${DIM()}= ${doc.filename} (no changes)${RESET()}`);
      }
    }

    for (const change of diff.changes) {
      switch (change.type) {
        case "added":
          if (!quiet) console.log(`  ${GREEN()}+ ${change.filename}${RESET()} ${DIM()}(new)${RESET()}`);
          break;
        case "updated":
          if (!quiet) console.log(`  ${YELLOW()}~ ${change.filename}${RESET()}`);
          break;
        case "removed":
          if (!quiet) console.log(`  ${RED()}- ${change.filename}${RESET()} ${DIM()}(removed)${RESET()}`);
          break;
      }
      for (const detail of change.details) {
        if (!quiet) console.log(`    ${DIM()}- ${detail}${RESET()}`);
      }
    }
  } else {
    if (!quiet) {
      console.log(`\n${BOLD()}Step 2: No existing documents — generating fresh set${RESET()}\n`);
    }
  }

  // Step 3: Write updated documents
  if (!quiet) {
    console.log(`\n${BOLD()}Step 3: Writing updated documents...${RESET()}\n`);
  }

  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, outputFormat, config, result);

  // Append changelog
  const changelogPath = appendChangelog(absOutputDir, diffDocuments(docs, absOutputDir, outputFormat));
  if (changelogPath) {
    writtenFiles.push(changelogPath);
  }

  for (const file of writtenFiles) {
    const relativePath = path.relative(absProjectPath, file);
    if (!quiet) console.log(`  ${GREEN()}✓${RESET()} ${relativePath}`);
  }

  if (!quiet) {
    console.log();
    console.log(`${GREEN()}${BOLD()}Update complete.${RESET()} ${writtenFiles.length} document(s) written to ${path.relative(absProjectPath, absOutputDir)}/\n`);
  }

  if (jsonOutput) {
    console.log(JSON.stringify({
      hasChanges: true,
      documentsWritten: writtenFiles.length,
      files: writtenFiles.map(f => path.relative(absProjectPath, f)),
    }, null, 2));
  }

  process.exit(0);
}

// --- `codepliant notify` command ---

function runNotify(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  verbose: boolean,
) {
  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose, plugins);

  if (!quiet && !jsonOutput) {
    printScanResults(result, quiet);
  }

  const payload = buildPayload(result, absOutputDir);

  if (jsonOutput) {
    const notifResult = { webhookUrl: config.webhookUrl || null, payload };
    console.log(JSON.stringify(notifResult, null, 2));
  }

  if (!config.webhookUrl) {
    if (!quiet && !jsonOutput) {
      console.log(`${YELLOW()}No webhookUrl configured in .codepliantrc.json.${RESET()}`);
      console.log(`${DIM()}Add "webhookUrl": "https://hooks.slack.com/..." to enable notifications.${RESET()}\n`);
      console.log(`${BOLD()}Notification payload (not sent):${RESET()}\n`);
      console.log(JSON.stringify(payload, null, 2));
      console.log();
    }
    return;
  }

  if (!quiet && !jsonOutput) {
    console.log(`\n${BOLD()}Sending notification...${RESET()}`);
  }

  sendNotification(config.webhookUrl, result, absOutputDir).then((notifResult) => {
    if (notifResult.sent) {
      if (!quiet && !jsonOutput) {
        console.log(`${GREEN()}${BOLD()}Notification sent!${RESET()}\n`);
      }
    } else {
      if (!quiet && !jsonOutput) {
        console.log(`${RED()}Failed to send notification: ${notifResult.error}${RESET()}\n`);
      }
      process.exit(1);
    }
  }).catch((err) => {
    console.error(`${RED()}[CP017] Notification error: ${formatError(err)}${RESET()}`);
    process.exit(1);
  });
}

// --- `codepliant fix` command ---

function runFix(
  absProjectPath: string,
  absOutputDir: string,
  args: string[],
  quiet: boolean,
  verbose: boolean
) {
  const issue = args[1];

  if (!issue) {
    console.error(`\n${RED()}${BOLD()}[CP018] Error:${RESET()} Please specify an issue to fix.\n`);
    console.log(`${BOLD()}Available fixes:${RESET()}`);
    console.log(`  ${CYAN()}codepliant fix missing-dpo${RESET()}       Set up DPO information`);
    console.log(`  ${CYAN()}codepliant fix stale-docs${RESET()}        Regenerate all documents`);
    console.log(`  ${CYAN()}codepliant fix missing-consent${RESET()}   Cookie banner recommendation\n`);
    process.exit(1);
  }

  if (issue === "missing-dpo") {
    const config = loadConfig(absProjectPath);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const ask = (question: string): Promise<string> =>
      new Promise((resolve) => rl.question(question, resolve));

    (async () => {
      console.log(`\n${BOLD()}${CYAN()}DPO Configuration${RESET()}\n`);

      const dpoName = await ask(`  ${BOLD()}DPO Name${RESET()} [${config.dpoName || "none"}]: `);
      const dpoEmail = await ask(`  ${BOLD()}DPO Email${RESET()} [${config.dpoEmail || "none"}]: `);
      const euRep = await ask(`  ${BOLD()}EU Representative${RESET()} [${config.euRepresentative || "none"}]: `);

      rl.close();

      if (dpoName.trim()) config.dpoName = dpoName.trim();
      if (dpoEmail.trim()) config.dpoEmail = dpoEmail.trim();
      if (euRep.trim()) config.euRepresentative = euRep.trim();

      const configPath = saveConfig(absProjectPath, config);

      console.log(`\n${GREEN()}${BOLD()}Done!${RESET()} DPO info saved to ${DIM()}${path.relative(absProjectPath, configPath)}${RESET()}`);
      if (config.dpoName) console.log(`  ${DIM()}DPO Name:${RESET()} ${config.dpoName}`);
      if (config.dpoEmail) console.log(`  ${DIM()}DPO Email:${RESET()} ${config.dpoEmail}`);
      if (config.euRepresentative) console.log(`  ${DIM()}EU Representative:${RESET()} ${config.euRepresentative}`);
      console.log(`\n${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to regenerate documents with DPO info.${RESET()}\n`);
      process.exit(0);
    })();
    return;
  }

  if (issue === "stale-docs") {
    if (!quiet) printBanner();
    console.log(`${BOLD()}Regenerating all compliance documents...${RESET()}\n`);

    const config = loadConfig(absProjectPath);
    const { result, durationMs } = scanWithProgress(absProjectPath, quiet, verbose);
    const docs = generateDocuments(result, config);

    if (!fs.existsSync(absOutputDir)) {
      fs.mkdirSync(absOutputDir, { recursive: true });
    }

    writeDocuments(docs, absOutputDir);

    console.log(`\n${GREEN()}${BOLD()}Done!${RESET()} Regenerated ${BOLD()}${docs.length}${RESET()} documents in ${DIM()}${path.relative(absProjectPath, absOutputDir)}/${RESET()}`);
    console.log(`${DIM()}Scan took ${durationMs}ms${RESET()}\n`);
    process.exit(0);
  }

  if (issue === "missing-consent") {
    console.log(`\n${BOLD()}${CYAN()}Cookie Consent Recommendation${RESET()}\n`);

    const config = loadConfig(absProjectPath);
    const result = scan(absProjectPath);
    // Detect services that may set cookies or collect behavioural data
    const cookieRelated = result.services.filter(
      (s) => s.category === "analytics" || s.category === "advertising" ||
        s.dataCollected.some((d) => /cookie|session|behavioural/i.test(d))
    );

    const allRelevant = [...new Set(cookieRelated)];

    if (allRelevant.length === 0) {
      console.log(`  ${GREEN()}No cookie-setting services detected.${RESET()}`);
      console.log(`  ${DIM()}Cookie consent banner may not be required for this project.${RESET()}\n`);
      process.exit(0);
    }

    console.log(`  ${YELLOW()}${BOLD()}${allRelevant.length} service(s)${RESET()} detected that may require cookie consent:\n`);
    for (const svc of allRelevant) {
      console.log(`    ${YELLOW()}●${RESET()} ${svc.name} (${svc.category})`);
    }

    console.log(`\n  ${BOLD()}Recommended actions:${RESET()}\n`);
    console.log(`    1. ${CYAN()}Install a cookie consent manager${RESET()} (e.g., Cookiebot, OneTrust, cookie-consent)`);
    console.log(`    2. ${CYAN()}Block non-essential cookies${RESET()} until the user provides consent`);
    console.log(`    3. ${CYAN()}Categorise cookies${RESET()} as: Necessary, Analytics, Marketing, Preferences`);
    console.log(`    4. ${CYAN()}Add banner to your app${RESET()} that allows granular opt-in/opt-out`);
    console.log(`    5. ${CYAN()}Log consent records${RESET()} with timestamp, version, and choices\n`);

    console.log(`  ${BOLD()}GDPR/ePrivacy Directive requirements:${RESET()}\n`);
    console.log(`    - Prior consent required for non-essential cookies (Directive 2002/58/EC)`);
    console.log(`    - Consent must be freely given, specific, informed, and unambiguous`);
    console.log(`    - Pre-ticked boxes do not constitute valid consent`);
    console.log(`    - Users must be able to withdraw consent as easily as they gave it\n`);

    console.log(`  ${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate a Cookie Policy and Cookie Consent Config.${RESET()}\n`);
    process.exit(0);
  }

  console.error(`${RED()}[CP018] Unknown fix issue: "${issue}"${RESET()}`);
  console.error(`${DIM()}Available: missing-dpo, stale-docs, missing-consent${RESET()}`);
  process.exit(1);
}

// --- `codepliant dashboard` command ---

function runDashboard(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean
) {
  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);
  const diff = diffDocuments(docs, absOutputDir);
  const score = computeComplianceScore(result, absOutputDir);

  const docFileMap: Record<string, string[]> = {
    "Privacy Policy": ["PRIVACY_POLICY.md", "PRIVACY_POLICY.html"],
    "Terms of Service": ["TERMS_OF_SERVICE.md", "TERMS_OF_SERVICE.html"],
    "AI Disclosure": ["AI_DISCLOSURE.md", "AI_DISCLOSURE.html"],
    "Cookie Policy": ["COOKIE_POLICY.md", "COOKIE_POLICY.html"],
    "Data Processing Agreement": ["DATA_PROCESSING_AGREEMENT.md", "DATA_PROCESSING_AGREEMENT.html"],
  };

  interface DocStatus {
    name: string;
    status: "up-to-date" | "stale" | "missing";
    priority: "required" | "recommended" | "none";
  }

  const docStatuses: DocStatus[] = [];
  const staleFilenames = new Set(diff.changes.filter(c => c.type === "updated").map(c => c.document));
  const neededDocs = new Map(result.complianceNeeds.map(n => [n.document, n.priority]));

  // Build status for each known document type
  for (const [docName, filenames] of Object.entries(docFileMap)) {
    const exists = filenames.some(f => fs.existsSync(path.join(absOutputDir, f)));
    const isStale = staleFilenames.has(docName);
    const priority = neededDocs.get(docName) || "none";

    // Only show documents that are needed or already exist
    if (priority === "none" && !exists) continue;

    let status: DocStatus["status"];
    if (!exists) {
      status = "missing";
    } else if (isStale) {
      status = "stale";
    } else {
      status = "up-to-date";
    }

    docStatuses.push({ name: docName, status, priority });
  }

  const totalDocs = docStatuses.filter(d => d.status !== "missing").length;
  const staleDocs = docStatuses.filter(d => d.status === "stale").length;
  const missingDocs = docStatuses.filter(d => d.status === "missing").length;

  // Determine jurisdictions from config
  const jurisdictions = config.jurisdictions && config.jurisdictions.length > 0
    ? config.jurisdictions.join(", ")
    : config.jurisdiction || "Not configured";

  // Determine last scan time from output dir modification
  let lastScanLabel = "never";
  if (fs.existsSync(absOutputDir)) {
    try {
      const entries = fs.readdirSync(absOutputDir);
      let latestMtime = 0;
      for (const entry of entries) {
        const stat = fs.statSync(path.join(absOutputDir, entry));
        if (stat.mtimeMs > latestMtime) latestMtime = stat.mtimeMs;
      }
      if (latestMtime > 0) {
        const agoMs = Date.now() - latestMtime;
        if (agoMs < 60_000) lastScanLabel = "just now";
        else if (agoMs < 3_600_000) lastScanLabel = `${Math.round(agoMs / 60_000)} minute(s) ago`;
        else if (agoMs < 86_400_000) lastScanLabel = `${Math.round(agoMs / 3_600_000)} hour(s) ago`;
        else lastScanLabel = `${Math.round(agoMs / 86_400_000)} day(s) ago`;
      }
    } catch {
      // ignore errors reading output dir
    }
  }

  // Build action items
  const actionItems: string[] = [];
  for (const doc of docStatuses) {
    if (doc.status === "missing" && doc.priority === "required") {
      actionItems.push(`Generate missing ${doc.name} (required)`);
    }
  }
  for (const doc of docStatuses) {
    if (doc.status === "stale") {
      actionItems.push(`Update stale ${doc.name}`);
    }
  }
  for (const doc of docStatuses) {
    if (doc.status === "missing" && doc.priority === "recommended") {
      actionItems.push(`Generate missing ${doc.name} (recommended)`);
    }
  }

  // JSON output
  if (jsonOutput) {
    console.log(JSON.stringify({
      project: result.projectName,
      score,
      services: result.services.length,
      documents: { total: totalDocs, stale: staleDocs, missing: missingDocs },
      jurisdictions: config.jurisdictions || [],
      docStatuses,
      actionItems: actionItems.slice(0, 5),
      lastScan: lastScanLabel,
    }, null, 2));
    process.exit(0);
  }

  // Build the dashboard
  const BOX_WIDTH = 50;
  const innerWidth = BOX_WIDTH - 4; // 2 for "│ " and 2 for " │"

  function pad(text: string, width: number): string {
    // Strip ANSI codes for length calculation
    const stripped = text.replace(/\x1b\[[0-9;]*m/g, "");
    const padding = Math.max(0, width - stripped.length);
    return text + " ".repeat(padding);
  }

  function line(content: string): string {
    return `${CYAN()}│${RESET()}  ${pad(content, innerWidth)}${CYAN()}│${RESET()}`;
  }

  function emptyLine(): string {
    return `${CYAN()}│${RESET()}${" ".repeat(BOX_WIDTH - 2)}${CYAN()}│${RESET()}`;
  }

  // Progress bar
  const filledBlocks = Math.round(score / 10);
  const emptyBlocks = 10 - filledBlocks;
  let barColor = RED();
  if (score > 80) barColor = GREEN();
  else if (score > 60) barColor = YELLOW();
  const progressBar = `${barColor}${"█".repeat(filledBlocks)}${DIM()}${"░".repeat(emptyBlocks)}${RESET()}`;

  // Score history sparkline
  const scoresFile = path.join(absProjectPath, ".codepliant-scores.json");
  let sparkline = "";
  let trendLabel = "";
  try {
    if (fs.existsSync(scoresFile)) {
      const raw = fs.readFileSync(scoresFile, "utf-8");
      const history: { date: string; score: number }[] = JSON.parse(raw);
      if (history.length > 0) {
        // Take last 8 entries + current
        const recentScores = [...history.slice(-7).map((h) => h.score), score];
        const sparkChars = "▁▂▃▄▅▆▇█";
        const minS = Math.min(...recentScores);
        const maxS = Math.max(...recentScores);
        const range = maxS - minS || 1;
        const spark = recentScores
          .map((s) => sparkChars[Math.min(7, Math.floor(((s - minS) / range) * 7))])
          .join("");
        sparkline = ` ${DIM()}${spark}${RESET()}`;

        // Determine trend
        const prev = history[history.length - 1]?.score ?? score;
        if (score > prev) trendLabel = ` ${GREEN()}(improving)${RESET()}`;
        else if (score < prev) trendLabel = ` ${RED()}(declining)${RESET()}`;
        else trendLabel = ` ${DIM()}(stable)${RESET()}`;
      }
    }
  } catch {
    // ignore errors reading score history
  }

  // Save current score to history
  try {
    let history: { date: string; score: number }[] = [];
    if (fs.existsSync(scoresFile)) {
      try {
        history = JSON.parse(fs.readFileSync(scoresFile, "utf-8"));
      } catch { /* start fresh */ }
    }
    const today = new Date().toISOString().split("T")[0];
    // Only add one entry per day
    if (history.length === 0 || history[history.length - 1].date !== today) {
      history.push({ date: today, score });
      // Keep last 30 entries
      if (history.length > 30) history = history.slice(-30);
      fs.writeFileSync(scoresFile, JSON.stringify(history, null, 2) + "\n", "utf-8");
    }
  } catch {
    // ignore errors writing score history
  }

  const topBorder = `${CYAN()}┌─ CODEPLIANT DASHBOARD ${"─".repeat(BOX_WIDTH - 25)}┐${RESET()}`;
  const bottomBorder = `${CYAN()}└${"─".repeat(BOX_WIDTH - 2)}┘${RESET()}`;

  const lines: string[] = [];
  lines.push(topBorder);
  lines.push(emptyLine());

  // Project name
  lines.push(line(`${BOLD()}Project:${RESET()} ${result.projectName}`));

  // Score with sparkline
  lines.push(line(`${BOLD()}Score:${RESET()}   ${progressBar} ${barColor}${BOLD()}${score}%${RESET()}${sparkline}${trendLabel}`));

  lines.push(emptyLine());

  // Services
  lines.push(line(`${BOLD()}Services:${RESET()} ${result.services.length} detected`));

  // Documents summary
  const docsLabel = staleDocs > 0
    ? `${totalDocs} generated ${YELLOW()}(${staleDocs} stale)${RESET()}`
    : `${totalDocs} generated`;
  lines.push(line(`${BOLD()}Documents:${RESET()} ${docsLabel}`));

  // Jurisdictions
  lines.push(line(`${BOLD()}Jurisdictions:${RESET()} ${jurisdictions}`));

  lines.push(emptyLine());

  // Document statuses
  for (const doc of docStatuses) {
    let statusIcon: string;
    let statusLabel: string;
    if (doc.status === "up-to-date") {
      statusIcon = `${GREEN()}●${RESET()}`;
      statusLabel = `${GREEN()}✓ up to date${RESET()}`;
    } else if (doc.status === "stale") {
      statusIcon = `${YELLOW()}●${RESET()}`;
      statusLabel = `${YELLOW()}⚠ needs update${RESET()}`;
    } else {
      statusIcon = `${RED()}●${RESET()}`;
      statusLabel = `${RED()}✗ missing${RESET()}`;
    }
    const docNamePadded = pad(doc.name, 22);
    lines.push(line(`${statusIcon} ${docNamePadded} ${statusLabel}`));
  }

  lines.push(emptyLine());

  // Action items (top 3)
  if (actionItems.length > 0) {
    lines.push(line(`${BOLD()}Action items:${RESET()}`));
    for (const item of actionItems.slice(0, 3)) {
      lines.push(line(`  ${YELLOW()}→${RESET()} ${item}`));
    }
    if (actionItems.length > 3) {
      lines.push(line(`  ${DIM()}...and ${actionItems.length - 3} more${RESET()}`));
    }
    lines.push(emptyLine());
  }

  // Last scan
  lines.push(line(`${DIM()}Last scan: ${lastScanLabel}${RESET()}`));

  lines.push(bottomBorder);

  if (!quiet) {
    console.log();
    for (const l of lines) {
      console.log(`  ${l}`);
    }
    console.log();
  }

  process.exit(0);
}

// --- `codepliant metrics` command ---

function runMetrics(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);
  const diff = diffDocuments(docs, absOutputDir);

  // Compute full compliance score
  const scoreInput: ScoreInput = {
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  };
  const fullScore = computeFullComplianceScore(scoreInput);

  // Count existing docs on disk
  let existingDocCount = 0;
  try {
    if (fs.existsSync(absOutputDir)) {
      const entries = fs.readdirSync(absOutputDir);
      existingDocCount = entries.filter((e) => e.endsWith(".md") || e.endsWith(".html") || e.endsWith(".json")).length;
    }
  } catch { /* ignore */ }

  // Document freshness: how old is the newest file in output dir
  let freshnessLabel = "N/A";
  let freshnessMs = 0;
  if (fs.existsSync(absOutputDir)) {
    try {
      const entries = fs.readdirSync(absOutputDir);
      let latestMtime = 0;
      for (const entry of entries) {
        const stat = fs.statSync(path.join(absOutputDir, entry));
        if (stat.mtimeMs > latestMtime) latestMtime = stat.mtimeMs;
      }
      if (latestMtime > 0) {
        freshnessMs = Date.now() - latestMtime;
        if (freshnessMs < 60_000) freshnessLabel = "just now";
        else if (freshnessMs < 3_600_000) freshnessLabel = `${Math.round(freshnessMs / 60_000)}m ago`;
        else if (freshnessMs < 86_400_000) freshnessLabel = `${Math.round(freshnessMs / 3_600_000)}h ago`;
        else freshnessLabel = `${Math.round(freshnessMs / 86_400_000)}d ago`;
      }
    } catch { /* ignore */ }
  }

  // Stale count
  const staleCount = diff.changes.filter((c) => c.type === "updated").length;

  // Score trend from history
  let trend: "improving" | "declining" | "stable" | "unknown" = "unknown";
  let previousScore = 0;
  const scoresFile = path.join(absProjectPath, ".codepliant-scores.json");
  try {
    if (fs.existsSync(scoresFile)) {
      const raw = fs.readFileSync(scoresFile, "utf-8");
      const history: { date: string; score: number }[] = JSON.parse(raw);
      if (history.length > 0) {
        previousScore = history[history.length - 1].score;
        if (fullScore.total > previousScore) trend = "improving";
        else if (fullScore.total < previousScore) trend = "declining";
        else trend = "stable";
      }
    }
  } catch { /* ignore */ }

  // Categories breakdown
  const categoryMap = new Map<string, number>();
  for (const service of result.services) {
    categoryMap.set(service.category, (categoryMap.get(service.category) || 0) + 1);
  }
  const categories = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

  // JSON output
  if (jsonOutput) {
    console.log(JSON.stringify({
      project: result.projectName,
      score: fullScore.total,
      grade: fullScore.grade,
      previousScore,
      trend,
      serviceCount: result.services.length,
      serviceCategories: Object.fromEntries(categories),
      documentCount: docs.length,
      existingDocCount,
      staleDocCount: staleCount,
      freshness: freshnessLabel,
      freshnessMs,
      regulations: fullScore.regulationScores?.map((r: RegulationScore) => ({
        regulation: r.regulation,
        score: r.score,
        maxPoints: r.maxPoints,
      })) || [],
      recommendations: fullScore.recommendations?.slice(0, 5).map((r: Recommendation) => r.title) || [],
    }, null, 2));
    process.exit(0);
  }

  // Pretty terminal output — designed for weekly standup
  if (!quiet) printBanner();

  const BOX_WIDTH = 60;
  const innerWidth = BOX_WIDTH - 4;

  function pad(text: string, width: number): string {
    const stripped = text.replace(/\x1b\[[0-9;]*m/g, "");
    const padding = Math.max(0, width - stripped.length);
    return text + " ".repeat(padding);
  }

  function mline(content: string): string {
    return `${CYAN()}│${RESET()}  ${pad(content, innerWidth)}${CYAN()}│${RESET()}`;
  }

  function memptyLine(): string {
    return `${CYAN()}│${RESET()}${" ".repeat(BOX_WIDTH - 2)}${CYAN()}│${RESET()}`;
  }

  const topBorder = `${CYAN()}┌─ COMPLIANCE METRICS ${"─".repeat(BOX_WIDTH - 23)}┐${RESET()}`;
  const sectionBorder = `${CYAN()}├${"─".repeat(BOX_WIDTH - 2)}┤${RESET()}`;
  const bottomBorder = `${CYAN()}└${"─".repeat(BOX_WIDTH - 2)}┘${RESET()}`;

  // Score bar
  const filledBlocks = Math.round(fullScore.total / 5);
  const emptyBlocks = 20 - filledBlocks;
  let barColor = RED();
  if (fullScore.total > 80) barColor = GREEN();
  else if (fullScore.total > 60) barColor = YELLOW();
  const progressBar = `${barColor}${"█".repeat(filledBlocks)}${DIM()}${"░".repeat(emptyBlocks)}${RESET()}`;

  // Trend indicator
  let trendIcon = `${DIM()}?${RESET()}`;
  if (trend === "improving") trendIcon = `${GREEN()}▲${RESET()}`;
  else if (trend === "declining") trendIcon = `${RED()}▼${RESET()}`;
  else if (trend === "stable") trendIcon = `${DIM()}━${RESET()}`;

  const lines: string[] = [];
  lines.push(topBorder);
  lines.push(memptyLine());
  lines.push(mline(`${BOLD()}Project:${RESET()} ${result.projectName}`));
  lines.push(mline(`${BOLD()}Date:${RESET()}    ${new Date().toISOString().split("T")[0]}`));
  lines.push(memptyLine());

  // ── Score Section ──
  lines.push(sectionBorder);
  lines.push(mline(`${BOLD()}COMPLIANCE SCORE${RESET()}`));
  lines.push(memptyLine());
  lines.push(mline(`${progressBar} ${barColor}${BOLD()}${fullScore.total}%${RESET()} (${fullScore.grade}) ${trendIcon}`));
  if (trend !== "unknown") {
    const delta = fullScore.total - previousScore;
    const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
    lines.push(mline(`${DIM()}Previous: ${previousScore}%  Change: ${deltaStr}  Trend: ${trend}${RESET()}`));
  }
  lines.push(memptyLine());

  // ── Documents Section ──
  lines.push(sectionBorder);
  lines.push(mline(`${BOLD()}DOCUMENTS${RESET()}`));
  lines.push(memptyLine());
  lines.push(mline(`Generated:  ${BOLD()}${docs.length}${RESET()} types available`));
  lines.push(mline(`On disk:    ${BOLD()}${existingDocCount}${RESET()} files`));
  if (staleCount > 0) {
    lines.push(mline(`Stale:      ${YELLOW()}${BOLD()}${staleCount}${RESET()}${YELLOW()} need regeneration${RESET()}`));
  } else {
    lines.push(mline(`Stale:      ${GREEN()}0${RESET()} ${DIM()}(all current)${RESET()}`));
  }
  lines.push(mline(`Freshness:  ${freshnessLabel}`));
  lines.push(memptyLine());

  // ── Services Section ──
  lines.push(sectionBorder);
  lines.push(mline(`${BOLD()}SERVICES${RESET()}`));
  lines.push(memptyLine());
  lines.push(mline(`Total:      ${BOLD()}${result.services.length}${RESET()} detected`));
  for (const [cat, count] of categories) {
    lines.push(mline(`  ${cat.padEnd(14)} ${count}`));
  }
  lines.push(memptyLine());

  // ── Regulation Scores Section (if available) ──
  if (fullScore.regulationScores && fullScore.regulationScores.length > 0) {
    lines.push(sectionBorder);
    lines.push(mline(`${BOLD()}REGULATION SCORES${RESET()}`));
    lines.push(memptyLine());
    for (const reg of fullScore.regulationScores) {
      const regPct = reg.maxPoints > 0 ? Math.round((reg.score / reg.maxPoints) * 100) : 0;
      let regColor = RED();
      if (regPct > 80) regColor = GREEN();
      else if (regPct > 60) regColor = YELLOW();
      lines.push(mline(`  ${reg.regulation.padEnd(20)} ${regColor}${regPct}%${RESET()} (${reg.score}/${reg.maxPoints})`));
    }
    lines.push(memptyLine());
  }

  // ── Recommendations (top 3) ──
  if (fullScore.recommendations && fullScore.recommendations.length > 0) {
    lines.push(sectionBorder);
    lines.push(mline(`${BOLD()}TOP RECOMMENDATIONS${RESET()}`));
    lines.push(memptyLine());
    for (const rec of fullScore.recommendations.slice(0, 3)) {
      lines.push(mline(`${YELLOW()}→${RESET()} ${rec.title.slice(0, innerWidth - 4)}`));
    }
    if (fullScore.recommendations.length > 3) {
      lines.push(mline(`${DIM()}...and ${fullScore.recommendations.length - 3} more${RESET()}`));
    }
    lines.push(memptyLine());
  }

  lines.push(bottomBorder);

  console.log();
  for (const l of lines) {
    console.log(`  ${l}`);
  }
  console.log();

  process.exit(0);
}

// --- `codepliant hook` command ---

function runHook(projectPath: string, args: string[]) {
  const subcommand = args[1];

  if (subcommand === "install") {
    const result = installHook(projectPath);

    if (result.installed) {
      console.log(`\n${GREEN()}${BOLD()}✓${RESET()} ${result.message}\n`);

      if (result.hookType !== "lefthook") {
        console.log(`${DIM()}Using lefthook? Add this to your config:${RESET()}\n`);
        console.log(`${DIM()}${getLefthookSnippet()}${RESET()}`);
      }
    } else {
      console.error(`\n${RED()}${BOLD()}✗${RESET()} ${result.message}\n`);
      process.exit(1);
    }
    return;
  }

  if (subcommand === "uninstall") {
    const result = uninstallHook(projectPath);

    if (result.uninstalled) {
      console.log(`\n${GREEN()}${BOLD()}✓${RESET()} ${result.message}\n`);
    } else {
      console.log(`\n${YELLOW()}${result.message}${RESET()}\n`);
    }
    return;
  }

  console.error(`${RED()}[CP019] Unknown hook subcommand: "${subcommand || ""}"${RESET()}`);
  console.error(`${DIM()}Usage: codepliant hook install | codepliant hook uninstall${RESET()}`);
  process.exit(1);
}

// --- `codepliant template` command ---

function runTemplate(projectPath: string, args: string[]) {
  const subcommand = args[1];

  if (subcommand === "init") {
    const created = initTemplates(projectPath);

    if (created.length > 0) {
      console.log(`\n${GREEN()}${BOLD()}✓${RESET()} Created ${created.length} template(s) in ${path.relative(projectPath, getTemplatesDir(projectPath))}/\n`);
      for (const file of created) {
        console.log(`  ${DIM()}${path.relative(projectPath, file)}${RESET()}`);
      }
      console.log(`\n${DIM()}Edit these templates to customize your compliance documents.${RESET()}`);
      console.log(`${DIM()}Available variables: {{company}}, {{email}}, {{services}}, {{dataCategories}}, {{jurisdiction}}, {{date}}, {{dpo}}${RESET()}`);
      console.log(`${DIM()}Conditionals: {{#if hasAI}}...{{/if}}${RESET()}\n`);
    } else {
      console.log(`\n${YELLOW()}Templates directory already exists with all default templates.${RESET()}\n`);
    }
    return;
  }

  console.error(`${RED()}[CP016] Unknown template subcommand: "${subcommand || ""}"${RESET()}`);
  console.error(`${DIM()}Usage: codepliant template init${RESET()}`);
  process.exit(1);
}

// --- `codepliant scan-all` command ---

interface MultiProjectScanResult {
  project: DiscoveredProject;
  scanResult: ScanResult;
  durationMs: number;
}

function runScanAll(
  absRootPath: string,
  quiet: boolean,
  jsonOutput: boolean,
  verbose: boolean,
) {
  if (!quiet && !jsonOutput) printBanner();

  if (!quiet && !jsonOutput) {
    console.log(`${BOLD()}Discovering projects under ${absRootPath}...${RESET()}\n`);
  }

  const projects = discoverProjects(absRootPath);

  if (projects.length === 0) {
    if (jsonOutput) {
      console.log(JSON.stringify({ projects: [], aggregateScore: 100 }, null, 2));
    } else {
      console.log(`${YELLOW()}No projects found under ${absRootPath}.${RESET()}`);
      console.log(`${DIM()}Make sure subdirectories contain package.json, requirements.txt, go.mod, etc.${RESET()}\n`);
    }
    process.exit(0);
  }

  if (!quiet && !jsonOutput) {
    console.log(`  ${CYAN()}Found ${projects.length} project(s):${RESET()}\n`);
    for (const p of projects) {
      console.log(`    ${DIM()}${p.relativePath}${RESET()} ${DIM()}(${p.manifests.join(", ")})${RESET()}`);
    }
    console.log();
  }

  const results: MultiProjectScanResult[] = [];
  const totalStart = Date.now();

  for (const project of projects) {
    if (!quiet && !jsonOutput) {
      console.log(`${BOLD()}Scanning ${project.name}${RESET()} ${DIM()}(${project.relativePath})${RESET()}`);
    }

    const startTime = Date.now();
    try {
      const scanResult = scan(project.path, { verbose });
      const durationMs = Date.now() - startTime;
      results.push({ project, scanResult, durationMs });

      if (!quiet && !jsonOutput) {
        const serviceCount = scanResult.services.length;
        const needCount = scanResult.complianceNeeds.length;
        console.log(`  ${GREEN()}✓${RESET()} ${serviceCount} service(s), ${needCount} compliance need(s) ${DIM()}(${formatDuration(durationMs)})${RESET()}\n`);
      }
    } catch (err) {
      if (!quiet && !jsonOutput) {
        console.log(`  ${RED()}✗ Error: ${formatError(err)}${RESET()}\n`);
      }
    }
  }

  const totalDuration = Date.now() - totalStart;

  // Compute aggregate compliance score
  const aggregateScore = computeAggregateScore(results);

  if (jsonOutput) {
    const output = {
      rootPath: absRootPath,
      projectCount: results.length,
      projects: results.map(r => ({
        name: r.project.name,
        path: r.project.relativePath,
        manifests: r.project.manifests,
        services: r.scanResult.services.length,
        complianceNeeds: r.scanResult.complianceNeeds.length,
        durationMs: r.durationMs,
      })),
      aggregate: {
        totalServices: results.reduce((sum, r) => sum + r.scanResult.services.length, 0),
        totalComplianceNeeds: results.reduce((sum, r) => sum + r.scanResult.complianceNeeds.length, 0),
        complianceScore: aggregateScore,
      },
      totalDurationMs: totalDuration,
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  }

  // Print aggregate summary
  if (!quiet) {
    console.log(`${"─".repeat(50)}`);
    console.log(`\n${BOLD()}Aggregate results across ${results.length} project(s):${RESET()}\n`);

    const totalServices = results.reduce((sum, r) => sum + r.scanResult.services.length, 0);
    const totalNeeds = results.reduce((sum, r) => sum + r.scanResult.complianceNeeds.length, 0);

    // Collect unique services across all projects
    const uniqueServices = new Map<string, Set<string>>();
    for (const r of results) {
      for (const svc of r.scanResult.services) {
        if (!uniqueServices.has(svc.name)) {
          uniqueServices.set(svc.name, new Set());
        }
        uniqueServices.get(svc.name)!.add(r.project.name);
      }
    }

    console.log(`  ${BOLD()}Total services detected:${RESET()} ${totalServices} (${uniqueServices.size} unique)`);
    console.log(`  ${BOLD()}Total compliance needs:${RESET()}  ${totalNeeds}`);
    console.log(`  ${BOLD()}Aggregate compliance score:${RESET()} ${formatComplianceScore(aggregateScore)}`);
    console.log(`  ${DIM()}Scanned in ${formatDuration(totalDuration)}${RESET()}\n`);

    // Per-project summary table
    console.log(`${BOLD()}Per-project summary:${RESET()}\n`);
    for (const r of results) {
      const svcCount = String(r.scanResult.services.length).padStart(3);
      const needCount = String(r.scanResult.complianceNeeds.length).padStart(3);
      console.log(`  ${r.project.name.padEnd(30)} ${DIM()}services:${RESET()} ${svcCount}  ${DIM()}needs:${RESET()} ${needCount}`);
    }
    console.log();
  }

  process.exit(0);
}

// --- `codepliant generate-all` command ---

function runGenerateAll(
  absRootPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  outputFormat: OutputFormat = "markdown",
  verbose: boolean = false,
) {
  if (!quiet && !jsonOutput) printBanner();

  if (!quiet && !jsonOutput) {
    console.log(`${BOLD()}Discovering projects under ${absRootPath}...${RESET()}\n`);
  }

  const projects = discoverProjects(absRootPath);

  if (projects.length === 0) {
    if (jsonOutput) {
      console.log(JSON.stringify({ projects: [], aggregateScore: 100 }, null, 2));
    } else {
      console.log(`${YELLOW()}No projects found under ${absRootPath}.${RESET()}`);
      console.log(`${DIM()}Make sure subdirectories contain package.json, requirements.txt, go.mod, etc.${RESET()}\n`);
    }
    process.exit(0);
  }

  if (!quiet && !jsonOutput) {
    console.log(`  ${CYAN()}Found ${projects.length} project(s):${RESET()}\n`);
    for (const p of projects) {
      console.log(`    ${DIM()}${p.relativePath}${RESET()} ${DIM()}(${p.manifests.join(", ")})${RESET()}`);
    }
    console.log();
  }

  interface GenerateAllResult {
    project: DiscoveredProject;
    scanResult: ScanResult;
    docsGenerated: number;
    outputDir: string;
    durationMs: number;
  }

  const results: GenerateAllResult[] = [];
  const totalStart = Date.now();

  for (const project of projects) {
    if (!quiet && !jsonOutput) {
      console.log(`${BOLD()}Processing ${project.name}${RESET()} ${DIM()}(${project.relativePath})${RESET()}`);
    }

    const startTime = Date.now();
    try {
      const scanResult = scan(project.path, { verbose });
      const config = loadConfig(project.path);
      const plugins = config.plugins ? loadPlugins(project.path, config.plugins) : [];
      const docs = generateDocuments(scanResult, config, plugins);

      // Write to a per-project subdirectory under the output dir
      const safeName = project.name.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
      const projectOutputDir = path.join(absOutputDir, safeName);
      const writtenFiles = writeDocumentsInFormat(docs, projectOutputDir, outputFormat, config, scanResult);

      const durationMs = Date.now() - startTime;
      results.push({ project, scanResult, docsGenerated: writtenFiles.length, outputDir: projectOutputDir, durationMs });

      if (!quiet && !jsonOutput) {
        console.log(`  ${GREEN()}✓${RESET()} ${writtenFiles.length} document(s) generated in ${path.relative(absRootPath, projectOutputDir)}/ ${DIM()}(${formatDuration(durationMs)})${RESET()}\n`);
      }
    } catch (err) {
      if (!quiet && !jsonOutput) {
        console.log(`  ${RED()}✗ Error: ${formatError(err)}${RESET()}\n`);
      }
    }
  }

  const totalDuration = Date.now() - totalStart;

  const scanResults: MultiProjectScanResult[] = results.map(r => ({
    project: r.project,
    scanResult: r.scanResult,
    durationMs: r.durationMs,
  }));
  const aggregateScore = computeAggregateScore(scanResults);

  if (jsonOutput) {
    const output = {
      rootPath: absRootPath,
      projectCount: results.length,
      projects: results.map(r => ({
        name: r.project.name,
        path: r.project.relativePath,
        manifests: r.project.manifests,
        services: r.scanResult.services.length,
        complianceNeeds: r.scanResult.complianceNeeds.length,
        docsGenerated: r.docsGenerated,
        outputDir: r.outputDir,
        durationMs: r.durationMs,
      })),
      aggregate: {
        totalServices: results.reduce((sum, r) => sum + r.scanResult.services.length, 0),
        totalComplianceNeeds: results.reduce((sum, r) => sum + r.scanResult.complianceNeeds.length, 0),
        totalDocsGenerated: results.reduce((sum, r) => sum + r.docsGenerated, 0),
        complianceScore: aggregateScore,
      },
      totalDurationMs: totalDuration,
    };
    console.log(JSON.stringify(output, null, 2));
    process.exit(0);
  }

  if (!quiet) {
    console.log(`${"─".repeat(50)}`);
    console.log(`\n${BOLD()}Generation complete for ${results.length} project(s):${RESET()}\n`);

    const totalDocs = results.reduce((sum, r) => sum + r.docsGenerated, 0);
    const totalServices = results.reduce((sum, r) => sum + r.scanResult.services.length, 0);

    console.log(`  ${BOLD()}Total documents generated:${RESET()}  ${totalDocs}`);
    console.log(`  ${BOLD()}Total services detected:${RESET()}    ${totalServices}`);
    console.log(`  ${BOLD()}Aggregate compliance score:${RESET()} ${formatComplianceScore(aggregateScore)}`);
    console.log(`  ${DIM()}Completed in ${formatDuration(totalDuration)}${RESET()}\n`);

    console.log(`${BOLD()}Per-project summary:${RESET()}\n`);
    for (const r of results) {
      const docCount = String(r.docsGenerated).padStart(3);
      const svcCount = String(r.scanResult.services.length).padStart(3);
      console.log(`  ${r.project.name.padEnd(30)} ${DIM()}docs:${RESET()} ${docCount}  ${DIM()}services:${RESET()} ${svcCount}  ${DIM()}${path.relative(absRootPath, r.outputDir)}/${RESET()}`);
    }
    console.log();

    console.log(
      `${DIM()}⚠ These documents are generated from code analysis. Review and customize them for your specific use case.${RESET()}\n`
    );
  }

  process.exit(0);
}

// --- Aggregate compliance score ---

function computeAggregateScore(results: MultiProjectScanResult[]): number {
  if (results.length === 0) return 100;

  let totalWeight = 0;
  let totalScore = 0;

  for (const r of results) {
    const needs = r.scanResult.complianceNeeds;
    if (needs.length === 0) {
      totalWeight += 1;
      totalScore += 100;
      continue;
    }

    totalWeight += 1;

    // A project gets a base score of 100, minus deductions per unmet need.
    // Each required need = -15 pts, each recommended = -5 pts, floor at 0.
    let projectScore = 100;
    for (const need of needs) {
      projectScore -= need.priority === "required" ? 15 : 5;
    }
    totalScore += Math.max(0, projectScore);
  }

  if (totalWeight === 0) return 100;
  return Math.round(totalScore / totalWeight);
}


// --- Progress bar helper ---

function printProgressBar(step: number, totalSteps: number, label: string): void {
  const barWidth = 30;
  const filled = Math.round((step / totalSteps) * barWidth);
  const empty = barWidth - filled;
  const bar = `${GREEN()}${"█".repeat(filled)}${DIM()}${"░".repeat(empty)}${RESET()}`;
  console.log(`\n  ${bar} ${DIM()}Step ${step}/${totalSteps}${RESET()}`);
  console.log(`  ${CYAN()}${BOLD()}${label}${RESET()}\n`);
}

// --- `codepliant wizard` command ---

async function runWizard(
  projectPath: string,
  outputDir: string,
  formatFlag?: OutputFormat,
) {
  const absProjectPath = path.resolve(projectPath);
  const totalSteps = 6;

  // Step 1: Scan project
  printProgressBar(1, totalSteps, "Scanning project");

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result, durationMs } = scanWithProgress(absProjectPath, false, false, plugins);

  console.log(`  ${DIM()}Scanned in ${formatDuration(durationMs)} — found ${result.services.length} service(s)${RESET()}`);

  if (result.services.length === 0) {
    console.log(`\n${YELLOW()}No services detected.${RESET()} The wizard works best when your project has dependencies.\n`);
  }

  // Step 2: Review detected services
  printProgressBar(2, totalSteps, "Review detected services");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Load previously confirmed/excluded from config
  const previouslyConfirmed = new Set(config.confirmedServices || []);
  const previouslyExcluded = new Set(config.excludeServices || []);

  const confirmedServices: string[] = [];
  const excludedServices: string[] = [];

  if (result.services.length > 0) {
    console.log(`  The following services were detected in your codebase.\n`);
    console.log(`  For each service, confirm whether it should be included in compliance documents.\n`);

    for (const service of result.services) {
      const prevStatus = previouslyExcluded.has(service.name)
        ? ` ${DIM()}(previously excluded)${RESET()}`
        : previouslyConfirmed.has(service.name)
          ? ` ${DIM()}(previously confirmed)${RESET()}`
          : "";

      console.log(`  ${BOLD()}${service.name}${RESET()} ${DIM()}(${formatCategory(service.category)})${RESET()}${prevStatus}`);
      console.log(`    ${DIM()}Data: ${service.dataCollected.join(", ")}${RESET()}`);
      for (const ev of service.evidence.slice(0, 2)) {
        console.log(`    ${DIM()}Found: [${ev.type}] ${ev.file} → ${ev.detail}${RESET()}`);
      }
      if (service.evidence.length > 2) {
        console.log(`    ${DIM()}...and ${service.evidence.length - 2} more evidence(s)${RESET()}`);
      }

      // Default to previous choice, or include by default
      const defaultKeep = !previouslyExcluded.has(service.name);
      const keep = await askYesNo(rl, `    ${BOLD()}Include this service?${RESET()}`, defaultKeep);

      if (keep) {
        confirmedServices.push(service.name);
      } else {
        excludedServices.push(service.name);
        console.log(`    ${YELLOW()}Excluded${RESET()}`);
      }
      console.log();
    }
  } else {
    console.log(`  ${DIM()}No services to review.${RESET()}\n`);
  }

  // Step 3: Select jurisdictions
  printProgressBar(3, totalSteps, "Select jurisdictions");

  const jurisdictionOptions = [...VALID_JURISDICTIONS];
  const currentJurisdictions = config.jurisdictions || [];
  const selectedJurisdictions = await askMultiSelect(
    rl,
    `  ${BOLD()}Which jurisdictions apply to your project?${RESET()}`,
    jurisdictionOptions,
    currentJurisdictions,
  );

  if (selectedJurisdictions.length > 0) {
    console.log(`\n  ${GREEN()}Selected:${RESET()} ${selectedJurisdictions.join(", ")}`);
  } else {
    console.log(`\n  ${DIM()}No jurisdictions selected. Documents will use generic language.${RESET()}`);
  }

  // Step 4: Company info
  printProgressBar(4, totalSteps, "Company information");

  let companyName = config.companyName;
  let contactEmail = config.contactEmail;
  let website = config.website || "";

  const needsCompanyInfo =
    !companyName ||
    companyName === "[Your Company Name]" ||
    !contactEmail ||
    contactEmail === "[your-email@example.com]";

  if (needsCompanyInfo) {
    console.log(`  Company info is not configured yet.\n`);
    companyName = await ask(rl, `  ${BOLD()}Company name${RESET()}`, companyName);
    contactEmail = await ask(rl, `  ${BOLD()}Contact email${RESET()}`, contactEmail);
    website = await ask(rl, `  ${BOLD()}Website URL${RESET()}`, website);
  } else {
    console.log(`  ${GREEN()}✓${RESET()} Company: ${BOLD()}${companyName}${RESET()}`);
    console.log(`  ${GREEN()}✓${RESET()} Email: ${BOLD()}${contactEmail}${RESET()}`);
    if (website) console.log(`  ${GREEN()}✓${RESET()} Website: ${BOLD()}${website}${RESET()}`);

    const changeInfo = await askYesNo(rl, `\n  ${BOLD()}Change company info?${RESET()}`, false);
    if (changeInfo) {
      companyName = await ask(rl, `  ${BOLD()}Company name${RESET()}`, companyName);
      contactEmail = await ask(rl, `  ${BOLD()}Contact email${RESET()}`, contactEmail);
      website = await ask(rl, `  ${BOLD()}Website URL${RESET()}`, website);
    }
  }

  // Step 5: Review documents to generate
  printProgressBar(5, totalSteps, "Review documents to generate");

  // Build a temporary config + scan result with exclusions applied
  const wizardConfig: CodepliantConfig = {
    ...config,
    companyName,
    contactEmail,
    ...(website && { website }),
    ...(selectedJurisdictions.length > 0 && { jurisdictions: selectedJurisdictions }),
    excludeServices: excludedServices,
    confirmedServices,
  };

  // Filter out excluded services from scan result for document preview
  const filteredResult: ScanResult = {
    ...result,
    services: result.services.filter((s) => !excludedServices.includes(s.name)),
  };

  const docs = generateDocuments(filteredResult, wizardConfig, plugins);

  console.log(`  The following ${docs.length} document(s) will be generated:\n`);

  for (const doc of docs) {
    const lines = doc.content.split("\n").length;
    console.log(`  ${GREEN()}●${RESET()} ${BOLD()}${doc.name}${RESET()} ${DIM()}(${doc.filename}, ~${lines} lines)${RESET()}`);
  }

  console.log();
  const proceed = await askYesNo(rl, `  ${BOLD()}Proceed with generation?${RESET()}`, true);

  if (!proceed) {
    rl.close();
    console.log(`\n${YELLOW()}Wizard cancelled.${RESET()} No files were written.\n`);
    return;
  }

  rl.close();

  // Step 6: Generate + summary
  printProgressBar(6, totalSteps, "Generating documents");

  // Save updated config
  const savedPath = saveConfig(absProjectPath, wizardConfig);
  console.log(`  ${GREEN()}✓${RESET()} Config saved to ${path.relative(absProjectPath, savedPath)}`);

  // Write documents
  const absOutputDir = path.resolve(absProjectPath, outputDir);
  const outputFormat = formatFlag || getOutputFormat(wizardConfig);
  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, outputFormat, wizardConfig, filteredResult);

  // Write changelog
  const diff = diffDocuments(docs, absOutputDir);
  const changelogPath = appendChangelog(absOutputDir, diff);
  if (changelogPath) {
    writtenFiles.push(changelogPath);
  }

  console.log();
  for (const file of writtenFiles) {
    const relativePath = path.relative(absProjectPath, file);
    const content = fs.readFileSync(file, "utf-8");
    const size = Buffer.byteLength(content, "utf-8");
    const fileLines = countLines(content);
    const docName = docs.find((d) => file.endsWith(d.filename))?.name || path.basename(file);
    console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${docName}: ${formatFileSize(size)}, ${fileLines} lines)${RESET()}`);
  }

  // Summary
  const score = computeComplianceScore(filteredResult, absOutputDir);

  console.log(`
${GREEN()}${BOLD()}${"═".repeat(50)}${RESET()}
${GREEN()}${BOLD()}  Wizard complete!${RESET()}
${GREEN()}${BOLD()}${"═".repeat(50)}${RESET()}

  ${BOLD()}Documents generated:${RESET()}  ${writtenFiles.length}
  ${BOLD()}Output directory:${RESET()}     ${path.relative(absProjectPath, absOutputDir)}/
  ${BOLD()}Services included:${RESET()}    ${confirmedServices.length} of ${result.services.length}
  ${BOLD()}Services excluded:${RESET()}    ${excludedServices.length}
  ${BOLD()}Jurisdictions:${RESET()}        ${selectedJurisdictions.length > 0 ? selectedJurisdictions.join(", ") : "None selected"}
  ${BOLD()}Compliance score:${RESET()}     ${formatComplianceScore(score)}

${BOLD()}Next steps:${RESET()}

  1. Review generated documents in ${CYAN()}${path.relative(absProjectPath, absOutputDir)}/${RESET()}
  2. Customize them for your specific legal requirements
  3. Run ${CYAN()}codepliant go${RESET()} to regenerate after code changes
  4. Run ${CYAN()}codepliant wizard${RESET()} again to update service selections

${DIM()}Confirmed/excluded services are saved in .codepliantrc.json for future runs.${RESET()}
${DIM()}⚠ These documents are generated from code analysis. Review and customize them for your specific use case.${RESET()}
`);
}

async function runReview(absProjectPath: string, absOutputDir: string, quiet: boolean, jsonOutput: boolean, verbose: boolean) {
  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];

  const reviewConfig: AIReviewConfig = {
    aiReviewApiKey: (config as unknown as Record<string, unknown>).aiReviewApiKey as string | undefined,
    aiReviewModel: (config as unknown as Record<string, unknown>).aiReviewModel as string | undefined,
  };

  if (!isReviewAvailable(reviewConfig)) {
    if (jsonOutput) {
      console.log(JSON.stringify({ reviewed: false, error: "No aiReviewApiKey configured." }, null, 2));
    } else {
      console.log(`${YELLOW()}AI review requires an API key.${RESET()}`);
      console.log(`${DIM()}Add "aiReviewApiKey": "sk-..." to your .codepliantrc.json to enable.${RESET()}`);
      console.log(`${DIM()}Optionally set "aiReviewModel" (default: claude-sonnet-4-20250514).${RESET()}\n`);
      console.log(`${DIM()}Without AI review, codepliant still generates all documents normally.${RESET()}\n`);
    }
    process.exit(0);
  }

  const { result: scanResult, durationMs } = scanWithProgress(absProjectPath, quiet || jsonOutput, verbose, plugins);

  if (!quiet && !jsonOutput) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }

  const docs = generateDocuments(scanResult, config, plugins);

  if (!quiet && !jsonOutput) {
    console.log(`${BOLD()}Reviewing ${docs.length} document(s) with AI...${RESET()}\n`);
  }

  const reviewResults = await reviewDocuments(docs, reviewConfig);

  if (jsonOutput) {
    console.log(JSON.stringify(reviewResults, null, 2));
    return;
  }

  const totalSuggestions = reviewResults.reduce((sum, r) => sum + r.suggestions.length, 0);

  for (const r of reviewResults) {
    if (!r.reviewed) {
      console.log(`  ${YELLOW()}!${RESET()} ${r.documentName}: ${r.error || "Not reviewed"}`);
      continue;
    }

    if (r.suggestions.length === 0) {
      console.log(`  ${GREEN()}✓${RESET()} ${r.documentName}: No issues found`);
      continue;
    }

    console.log(`  ${YELLOW()}!${RESET()} ${BOLD()}${r.documentName}${RESET()}: ${r.suggestions.length} suggestion(s)`);

    for (const s of r.suggestions) {
      const severityColor = s.severity === "high" ? RED() : s.severity === "medium" ? YELLOW() : DIM();
      const severityLabel = s.severity.toUpperCase();
      console.log(`    ${severityColor}[${severityLabel}]${RESET()} ${s.section} ${DIM()}(${s.issue})${RESET()}`);
      console.log(`      ${s.suggestion}`);
    }
    console.log();
  }

  if (totalSuggestions === 0) {
    console.log(`\n${GREEN()}${BOLD()}All documents passed AI review.${RESET()}\n`);
  } else {
    console.log(`\n${YELLOW()}${BOLD()}${totalSuggestions} suggestion(s) across ${reviewResults.filter(r => r.suggestions.length > 0).length} document(s).${RESET()}`);
    console.log(`${DIM()}These are suggestions — review them and apply as needed.${RESET()}\n`);
  }
}

// --- `codepliant explain` command ---

interface DocumentExplanation {
  document: string;
  filename: string;
  reasons: string[];
  evidence: Array<{ type: string; detail: string }>;
}

function runExplain(absProjectPath: string, args: string[], quiet: boolean, jsonOutput: boolean) {
  const nonFlags: string[] = [];

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--json" || arg === "--quiet" || arg === "-q" || arg === "--no-color") continue;
    if (arg === "--output" || arg === "-o") { i++; continue; }
    if (arg.startsWith("-")) continue;
    nonFlags.push(arg);
  }

  if (nonFlags.length === 0) {
    console.error(`${RED()}[CP015] Error: Missing document argument.${RESET()}`);
    console.error(`${DIM()}Usage: codepliant explain <document> [path]${RESET()}`);
    console.error(`${DIM()}Example: codepliant explain "Privacy Policy"${RESET()}`);
    process.exit(1);
  }

  const docQuery = nonFlags[0];
  const projPath = nonFlags.length > 1 ? nonFlags[1] : absProjectPath;
  const absPath = path.resolve(projPath);

  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absPath);
  const plugins = config.plugins ? loadPlugins(absPath, config.plugins) : [];
  const scanResult = scan(absPath, { plugins });
  const docs = generateDocuments(scanResult, config, plugins);

  // Find the matching document
  const queryLower = docQuery.toLowerCase().replace(/[_\-.]/g, " ");
  const matchedDoc = docs.find((d) => {
    const nameLower = d.name.toLowerCase();
    const filenameLower = d.filename.toLowerCase().replace(/[_\-.]/g, " ");
    return nameLower === queryLower || filenameLower === queryLower || filenameLower.replace(/\.md$/, "") === queryLower || d.filename.toLowerCase() === docQuery.toLowerCase();
  });

  if (!matchedDoc) {
    if (jsonOutput) {
      console.log(JSON.stringify({ found: false, query: docQuery, availableDocuments: docs.map(d => d.name) }, null, 2));
    } else {
      console.error(`${RED()}[CP015] Document not found: "${docQuery}"${RESET()}\n`);
      console.log(`${BOLD()}Available documents for this project:${RESET()}\n`);
      for (const d of docs) {
        console.log(`  ${CYAN()}*${RESET()} ${d.name} ${DIM()}(${d.filename})${RESET()}`);
      }
      console.log();
    }
    process.exit(1);
  }

  const explanation = buildDocExplanation(matchedDoc, scanResult, config);

  if (jsonOutput) {
    console.log(JSON.stringify({ found: true, ...explanation }, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}Why was "${matchedDoc.name}" generated?${RESET()}\n`);
  console.log(`  ${DIM()}Document:${RESET()} ${matchedDoc.name}`);
  console.log(`  ${DIM()}Filename:${RESET()} ${matchedDoc.filename}\n`);

  if (explanation.reasons.length > 0) {
    console.log(`${BOLD()}Reasons:${RESET()}\n`);
    for (const reason of explanation.reasons) {
      console.log(`  ${GREEN()}*${RESET()} ${reason}`);
    }
    console.log();
  }

  if (explanation.evidence.length > 0) {
    console.log(`${BOLD()}Evidence:${RESET()}\n`);
    for (const ev of explanation.evidence) {
      console.log(`  ${CYAN()}[${ev.type}]${RESET()} ${ev.detail}`);
    }
    console.log();
  }

  console.log(`${DIM()}This document was auto-generated based on code analysis. Review and customize for your needs.${RESET()}\n`);
  process.exit(0);
}

function runWhy(absProjectPath: string, args: string[], quiet: boolean, jsonOutput: boolean) {
  const nonFlags: string[] = [];

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--json" || arg === "--quiet" || arg === "-q" || arg === "--no-color") continue;
    if (arg === "--output" || arg === "-o") { i++; continue; }
    if (arg.startsWith("-")) continue;
    nonFlags.push(arg);
  }

  if (nonFlags.length === 0) {
    console.error(`${RED()}[CP015] Error: Missing service name.${RESET()}`);
    console.error(`${DIM()}Usage: codepliant why <service> [path]${RESET()}`);
    console.error(`${DIM()}Example: codepliant why stripe${RESET()}`);
    process.exit(1);
  }

  const serviceQuery = nonFlags[0].toLowerCase();
  const projPath = nonFlags.length > 1 ? nonFlags[1] : absProjectPath;
  const absPath = path.resolve(projPath);

  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absPath);
  const plugins = config.plugins ? loadPlugins(absPath, config.plugins) : [];
  const scanResult = scan(absPath, { plugins });

  // Find matching service(s) — fuzzy match on name or provider name
  const matched = scanResult.services.filter((s) => {
    const nameLower = s.name.toLowerCase();
    return nameLower === serviceQuery ||
      nameLower.includes(serviceQuery) ||
      serviceQuery.includes(nameLower.replace(/^@.*\//, ""));
  });

  if (matched.length === 0) {
    if (jsonOutput) {
      console.log(JSON.stringify({
        found: false,
        query: serviceQuery,
        detectedServices: scanResult.services.map((s) => s.name),
      }, null, 2));
    } else {
      console.error(`${RED()}[CP015] Service not found: "${serviceQuery}"${RESET()}\n`);
      console.log(`${BOLD()}Detected services in this project:${RESET()}\n`);
      for (const s of scanResult.services) {
        console.log(`  ${CYAN()}*${RESET()} ${s.name} ${DIM()}(${s.category})${RESET()}`);
      }
      console.log();
    }
    process.exit(1);
  }

  if (jsonOutput) {
    const results = matched.map((s) => ({
      service: s.name,
      category: s.category,
      isDataProcessor: s.isDataProcessor !== false,
      dataCollected: s.dataCollected,
      evidence: s.evidence,
    }));
    console.log(JSON.stringify({ found: true, services: results }, null, 2));
    process.exit(0);
  }

  for (const service of matched) {
    console.log(`${BOLD()}Why was "${service.name}" detected?${RESET()}\n`);
    console.log(`  ${DIM()}Service:${RESET()}  ${service.name}`);
    console.log(`  ${DIM()}Category:${RESET()} ${service.category}`);
    console.log(`  ${DIM()}Is data processor:${RESET()} ${service.isDataProcessor !== false ? "yes" : "no (utility/dev tool)"}`);

    if (service.dataCollected.length > 0) {
      console.log(`  ${DIM()}Data collected:${RESET()} ${service.dataCollected.join(", ")}`);
    }

    console.log();
    console.log(`${BOLD()}Evidence:${RESET()}\n`);

    if (service.evidence.length === 0) {
      console.log(`  ${DIM()}(no detailed evidence recorded)${RESET()}`);
    } else {
      for (const ev of service.evidence) {
        const typeLabel = ev.type === "dependency" ? "dependency" :
          ev.type === "import" ? "import" :
          ev.type === "env_var" ? "env var" :
          ev.type === "code_pattern" ? "code pattern" : ev.type;
        console.log(`  ${CYAN()}[${typeLabel}]${RESET()} ${ev.detail}${ev.file ? ` ${DIM()}(${ev.file})${RESET()}` : ""}`);
      }
    }
    console.log();
  }

  console.log(`${DIM()}To exclude this service from future scans: codepliant ignore ${matched[0].name}${RESET()}\n`);
  process.exit(0);
}

function runIgnore(absProjectPath: string, args: string[], quiet: boolean, jsonOutput: boolean) {
  const nonFlags: string[] = [];

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--json" || arg === "--quiet" || arg === "-q" || arg === "--no-color") continue;
    if (arg === "--output" || arg === "-o") { i++; continue; }
    if (arg.startsWith("-")) continue;
    nonFlags.push(arg);
  }

  if (nonFlags.length === 0) {
    console.error(`${RED()}[CP015] Error: Missing service name.${RESET()}`);
    console.error(`${DIM()}Usage: codepliant ignore <service> [path]${RESET()}`);
    console.error(`${DIM()}Example: codepliant ignore zod${RESET()}`);
    process.exit(1);
  }

  const serviceName = nonFlags[0];
  const projPath = nonFlags.length > 1 ? nonFlags[1] : absProjectPath;
  const absPath = path.resolve(projPath);

  const config = loadConfig(absPath);

  // Add to excludeServices
  const currentExcluded = config.excludeServices || [];
  if (currentExcluded.includes(serviceName)) {
    if (jsonOutput) {
      console.log(JSON.stringify({ ignored: true, service: serviceName, alreadyIgnored: true }, null, 2));
    } else {
      console.log(`${YELLOW()}Already ignored: ${serviceName}${RESET()}`);
    }
    process.exit(0);
  }

  config.excludeServices = [...currentExcluded, serviceName];
  const configPath = saveConfig(absPath, config);

  if (jsonOutput) {
    console.log(JSON.stringify({
      ignored: true,
      service: serviceName,
      alreadyIgnored: false,
      excludeServices: config.excludeServices,
      configPath,
    }, null, 2));
  } else {
    console.log(`${GREEN()}Ignored: ${serviceName} (not a data processor)${RESET()}`);
    console.log(`${DIM()}Added to excludeServices in ${path.basename(configPath)}${RESET()}`);
    console.log(`${DIM()}This service won't appear in future scans.${RESET()}`);
  }

  process.exit(0);
}

function buildDocExplanation(
  doc: { name: string; filename: string },
  scanResult: ScanResult,
  config: CodepliantConfig,
): DocumentExplanation {
  const reasons: string[] = [];
  const evidence: Array<{ type: string; detail: string }> = [];

  const services = scanResult.services;
  const hasAI = services.some((s) => s.category === "ai");
  const hasPayment = services.some((s) => s.category === "payment");
  const hasAnalytics = services.some((s) => s.category === "analytics" || s.category === "advertising");
  const hasAuth = services.some((s) => s.category === "auth");
  const hasEmail = services.some((s) => s.category === "email");
  const hasMonitoring = services.some((s) => s.category === "monitoring");

  const docName = doc.name;

  // Always-generated documents
  if (docName === "Terms of Service" || docName === "Security Policy" || docName === "Incident Response Plan" || docName === "Acceptable Use Policy") {
    reasons.push(`"${docName}" is generated for every project as a standard compliance document.`);
  }

  if (docName === "Privacy Policy") {
    reasons.push(`${services.length} third-party service(s) were detected that collect or process user data.`);
    for (const s of services.filter((sv) => sv.isDataProcessor !== false)) {
      evidence.push({ type: "service", detail: `${s.name} (${s.category}) collects: ${s.dataCollected.join(", ")}` });
      for (const ev of s.evidence) {
        evidence.push({ type: ev.type, detail: `${ev.file} -> ${ev.detail}` });
      }
    }
  }

  if (docName === "Data Flow Map") {
    reasons.push(`${services.length} service(s) detected; data flow map shows how data moves between them.`);
    for (const s of services) {
      evidence.push({ type: "service", detail: `${s.name} (${s.category})` });
    }
  }

  if (docName === "AI Disclosure" || docName === "AI Act Compliance Checklist" || docName === "AI Model Card" || docName === "Acceptable AI Use Policy") {
    if (hasAI) {
      reasons.push("AI/ML services were detected in the project.");
      for (const s of services.filter((sv) => sv.category === "ai")) {
        evidence.push({ type: "service", detail: `${s.name} found in dependencies` });
        for (const ev of s.evidence) {
          evidence.push({ type: ev.type, detail: `${ev.file} -> ${ev.detail}` });
        }
      }
    }
  }

  if (docName === "Cookie Policy" || docName === "Consent Management Guide") {
    if (hasAnalytics) {
      reasons.push("Analytics or advertising services detected that typically use cookies or user behavior collection.");
      for (const s of services.filter((sv) => sv.category === "analytics" || sv.category === "advertising")) {
        evidence.push({ type: "service", detail: `${s.name} (${s.category})` });
      }
    }
    if (hasAuth) {
      reasons.push("Authentication services detected that may set session cookies.");
    }
  }

  if (docName === "Data Processing Agreement") {
    reasons.push("Third-party services that process data on your behalf require a DPA.");
    for (const s of services.filter((sv) => sv.isDataProcessor !== false)) {
      evidence.push({ type: "service", detail: `${s.name} (${s.category})` });
    }
  }

  if (docName === "Sub-Processor List") {
    reasons.push(`${services.length} third-party services detected (threshold: 3+).`);
  }

  if (docName === "Data Retention Policy") {
    reasons.push(`${services.length} services detected (threshold: 3+).`);
    if (config.dataRetentionDays) {
      evidence.push({ type: "config", detail: `dataRetentionDays set to ${config.dataRetentionDays}` });
    }
  }

  if (docName === "DSAR Handling Guide") {
    reasons.push("Services that collect personal data require DSAR handling procedures.");
  }

  if (docName === "Risk Register") {
    reasons.push("Compliance risks were identified based on detected services and configuration.");
    if (hasAI) reasons.push("AI services present; AI-specific risks identified.");
    if (hasPayment) reasons.push("Payment services present; PCI DSS risks identified.");
    if (hasAnalytics) reasons.push("Analytics/advertising services present; consent risks identified.");
    if (services.length >= 3) reasons.push(`${services.length} third-party vendors; vendor management risks identified.`);
  }

  if (docName === "Third-Party Risk Assessment") {
    reasons.push(`${services.length} third-party services detected (threshold: 3+).`);
  }

  if (docName === "Privacy Impact Assessment") {
    if (hasAI) reasons.push("AI services detected; DPIA may be required under GDPR Article 35.");
    if (hasAnalytics) reasons.push("Analytics services detected; large-scale profiling may require DPIA.");
  }

  if (docName === "SOC 2 Readiness Checklist") {
    reasons.push(`${services.length} services detected (threshold: 5+).`);
  }

  if (docName === "Refund Policy") {
    if (hasPayment) {
      reasons.push("Payment services were detected.");
      for (const s of services.filter((sv) => sv.category === "payment")) {
        evidence.push({ type: "service", detail: `${s.name} found in dependencies` });
      }
    }
  }

  if (docName === "Service Level Agreement") {
    if (hasMonitoring) reasons.push("Monitoring services detected; SLA is recommended.");
  }

  if (docName === "Employee Privacy Notice") {
    evidence.push({ type: "config", detail: "generateEmployeeNotice is enabled in .codepliantrc.json" });
    reasons.push("Employee privacy notice was explicitly enabled in config.");
  }

  if (docName === "Compliance Notes" || docName === "Compliance Timeline" || docName === "Regulatory Updates") {
    reasons.push("Generated based on detected services and configured jurisdictions.");
    if (config.jurisdictions && config.jurisdictions.length > 0) {
      evidence.push({ type: "config", detail: `Jurisdictions: ${config.jurisdictions.join(", ")}` });
    }
  }

  if (docName === "Vendor Contacts Directory") {
    reasons.push("Multiple third-party services detected; vendor contact information compiled.");
  }

  if (docName === "Transparency Report") {
    reasons.push("Generated for all projects with detected services as a public accountability template.");
  }

  // Fallback
  if (reasons.length === 0) {
    reasons.push("This document was generated as part of the standard compliance suite.");
  }

  return { document: doc.name, filename: doc.filename, reasons, evidence };
}

function runCompare(path1: string, path2: string, quiet: boolean, jsonOutput: boolean) {
  for (const p of [path1, path2]) {
    if (!fs.existsSync(p)) {
      console.error(`${RED()}[CP006] Error: "${p}" does not exist.${RESET()}`);
      process.exit(1);
    }
    if (!fs.statSync(p).isDirectory()) {
      console.error(`${RED()}[CP007] Error: "${p}" is not a directory.${RESET()}`);
      process.exit(1);
    }
  }

  if (!quiet && !jsonOutput) printBanner();
  if (!quiet && !jsonOutput) {
    console.log(`${BOLD()}Comparing two projects:${RESET()}\n`);
    console.log(`  ${CYAN()}A:${RESET()} ${path1}`);
    console.log(`  ${CYAN()}B:${RESET()} ${path2}\n`);
  }

  const resultA = scan(path1);
  const resultB = scan(path2);
  const configA = loadConfig(path1);
  const configB = loadConfig(path2);
  const docsA = generateDocuments(resultA, configA);
  const docsB = generateDocuments(resultB, configB);
  const outputDirA = path.resolve(path1, configA.outputDir || "./legal");
  const outputDirB = path.resolve(path2, configB.outputDir || "./legal");
  const scoreA = computeComplianceScore(resultA, outputDirA);
  const scoreB = computeComplianceScore(resultB, outputDirB);

  const serviceNamesA = new Set(resultA.services.map((s) => s.name));
  const serviceNamesB = new Set(resultB.services.map((s) => s.name));
  const onlyInA = resultA.services.filter((s) => !serviceNamesB.has(s.name));
  const onlyInB = resultB.services.filter((s) => !serviceNamesA.has(s.name));
  const shared = resultA.services.filter((s) => serviceNamesB.has(s.name));

  const docFilenamesA = new Set(docsA.map((d) => d.filename));
  const docFilenamesB = new Set(docsB.map((d) => d.filename));
  const docsOnlyInA = docsA.filter((d) => !docFilenamesB.has(d.filename));
  const docsOnlyInB = docsB.filter((d) => !docFilenamesA.has(d.filename));
  const sharedDocs = docsA.filter((d) => docFilenamesB.has(d.filename));

  const needsA = new Set(resultA.complianceNeeds.map((n) => n.document));
  const needsB = new Set(resultB.complianceNeeds.map((n) => n.document));

  if (jsonOutput) {
    console.log(JSON.stringify({
      projectA: { name: resultA.projectName, path: path1, services: resultA.services.length, documents: docsA.length, score: scoreA, complianceNeeds: resultA.complianceNeeds.length },
      projectB: { name: resultB.projectName, path: path2, services: resultB.services.length, documents: docsB.length, score: scoreB, complianceNeeds: resultB.complianceNeeds.length },
      comparison: {
        servicesOnlyInA: onlyInA.map((s) => s.name),
        servicesOnlyInB: onlyInB.map((s) => s.name),
        sharedServices: shared.map((s) => s.name),
        docsOnlyInA: docsOnlyInA.map((d) => d.filename),
        docsOnlyInB: docsOnlyInB.map((d) => d.filename),
        sharedDocs: sharedDocs.map((d) => d.filename),
      },
    }, null, 2));
    process.exit(0);
  }

  const COL = 30;
  console.log(`${"\u2500".repeat(64)}`);
  console.log(`${BOLD()}${"Metric".padEnd(COL)}${resultA.projectName.padEnd(18)}${resultB.projectName}${RESET()}`);
  console.log(`${"\u2500".repeat(64)}`);
  console.log(`${"Services Detected".padEnd(COL)}${String(resultA.services.length).padEnd(18)}${resultB.services.length}`);
  console.log(`${"Documents Generated".padEnd(COL)}${String(docsA.length).padEnd(18)}${docsB.length}`);
  console.log(`${"Compliance Needs".padEnd(COL)}${String(resultA.complianceNeeds.length).padEnd(18)}${resultB.complianceNeeds.length}`);
  console.log(`${"Compliance Score".padEnd(COL)}${String(scoreA + "%").padEnd(18)}${scoreB}%`);

  console.log(`\n${"\u2500".repeat(64)}`);

  if (shared.length > 0) {
    console.log(`\n${BOLD()}Shared services (${shared.length}):${RESET()}`);
    for (const s of shared) {
      console.log(`  ${GREEN()}\u25cf${RESET()} ${s.name} ${DIM()}(${s.category})${RESET()}`);
    }
  }
  if (onlyInA.length > 0) {
    console.log(`\n${BOLD()}Only in ${resultA.projectName}:${RESET()}`);
    for (const s of onlyInA) {
      console.log(`  ${CYAN()}A${RESET()} ${s.name} ${DIM()}(${s.category})${RESET()}`);
    }
  }
  if (onlyInB.length > 0) {
    console.log(`\n${BOLD()}Only in ${resultB.projectName}:${RESET()}`);
    for (const s of onlyInB) {
      console.log(`  ${CYAN()}B${RESET()} ${s.name} ${DIM()}(${s.category})${RESET()}`);
    }
  }
  if (docsOnlyInA.length > 0) {
    console.log(`\n${BOLD()}Documents only in ${resultA.projectName}:${RESET()}`);
    for (const d of docsOnlyInA) {
      console.log(`  ${CYAN()}A${RESET()} ${d.name} ${DIM()}(${d.filename})${RESET()}`);
    }
  }
  if (docsOnlyInB.length > 0) {
    console.log(`\n${BOLD()}Documents only in ${resultB.projectName}:${RESET()}`);
    for (const d of docsOnlyInB) {
      console.log(`  ${CYAN()}B${RESET()} ${d.name} ${DIM()}(${d.filename})${RESET()}`);
    }
  }

  const needsOnlyA = resultA.complianceNeeds.filter((n) => !needsB.has(n.document));
  const needsOnlyB = resultB.complianceNeeds.filter((n) => !needsA.has(n.document));
  if (needsOnlyA.length > 0 || needsOnlyB.length > 0) {
    console.log(`\n${BOLD()}Compliance needs differences:${RESET()}`);
    for (const n of needsOnlyA) {
      console.log(`  ${CYAN()}A only${RESET()} ${n.document} ${DIM()}(${n.priority})${RESET()}`);
    }
    for (const n of needsOnlyB) {
      console.log(`  ${CYAN()}B only${RESET()} ${n.document} ${DIM()}(${n.priority})${RESET()}`);
    }
  }

  console.log(`\n${"\u2500".repeat(64)}\n`);
  if (scoreA > scoreB) {
    console.log(`${GREEN()}${resultA.projectName}${RESET()} has a higher compliance score (${scoreA}% vs ${scoreB}%).`);
  } else if (scoreB > scoreA) {
    console.log(`${GREEN()}${resultB.projectName}${RESET()} has a higher compliance score (${scoreB}% vs ${scoreA}%).`);
  } else {
    console.log(`Both projects have the same compliance score (${scoreA}%).`);
  }
  console.log(`\n${DIM()}Scores are based on code analysis. Review with legal counsel for full compliance assessment.${RESET()}\n`);
  process.exit(0);
}


function runSignatures(absProjectPath: string, args: string[]) {
  const subcommand = args[1];
  if (!subcommand || subcommand === "list") {
    printBanner();
    const { builtIn, community } = listAllSignatures(absProjectPath);
    console.log(`${BOLD()}Built-in signatures (${builtIn.length}):${RESET()}\n`);
    for (const sig of builtIn) {
      console.log(`  ${GREEN()}●${RESET()} ${BOLD()}${sig.name}${RESET()} ${DIM()}(${sig.category})${RESET()}`);
      console.log(`    ${DIM()}Data: ${sig.dataCollected.join(", ")}${RESET()}`);
    }
    if (community.length > 0) {
      console.log(`\n${BOLD()}Community signatures (${community.length}):${RESET()}\n`);
      for (const sig of community) {
        console.log(`  ${CYAN()}●${RESET()} ${BOLD()}${sig.name}${RESET()} ${DIM()}(${sig.category})${RESET()}`);
        console.log(`    ${DIM()}Data: ${sig.dataCollected.join(", ")}${RESET()}`);
        if (sig.author) console.log(`    ${DIM()}Author: ${sig.author}${RESET()}`);
      }
    } else {
      console.log(`\n${DIM()}No community signatures found. Import some with: codepliant signatures import <file>${RESET()}`);
    }
    console.log();
    process.exit(0);
  }
  if (subcommand === "export") {
    const outputFile = args[2] || "codepliant-signatures.json";
    const filePath = exportSignatures(absProjectPath, outputFile);
    console.log(`${GREEN()}${BOLD()}Signatures exported to ${filePath}${RESET()}\n`);
    process.exit(0);
  }
  if (subcommand === "import") {
    const importFile = args[2];
    if (!importFile) {
      console.error(`${RED()}[CP015] Error: Please specify a file to import.${RESET()}`);
      console.error(`${DIM()}Usage: codepliant signatures import <file.json>${RESET()}`);
      process.exit(1);
    }
    try {
      const importResult = importSignatures(absProjectPath, importFile);
      console.log(`${GREEN()}${BOLD()}Import complete!${RESET()}`);
      console.log(`  Imported: ${importResult.imported} signature(s)`);
      console.log(`  Skipped: ${importResult.skipped} (duplicates or invalid)`);
      console.log(`  Total custom signatures: ${importResult.total}`);
      console.log();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`${RED()}[CP021] Error: ${message}${RESET()}`);
      process.exit(1);
    }
    process.exit(0);
  }
  console.error(`${RED()}[CP008] Unknown signatures subcommand: "${subcommand}"${RESET()}`);
  console.error(`${DIM()}Use: codepliant signatures list|export|import${RESET()}`);
  process.exit(1);
}

function runExportJson(absProjectPath: string, absOutputDir: string, rawOutputFlag: string, quiet: boolean, verbose: boolean = false) {
  // When --output is provided (rawOutputFlag !== "./legal"), treat it as a file path
  const outputToFile = rawOutputFlag !== "./legal" ? path.resolve(rawOutputFlag) : undefined;

  if (!quiet && !outputToFile) {
    // When outputting to stdout, suppress all non-JSON output
    quiet = true;
  }

  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result, durationMs, timings } = scanWithProgress(absProjectPath, true, verbose, plugins);

  if (verbose && timings && !quiet) {
    printTimings(timings, durationMs);
  }

  const docs = generateDocuments(result, config, plugins);
  const complianceScore = computeComplianceScore(result, absOutputDir);

  const grade = complianceScore >= 90 ? "A" : complianceScore >= 80 ? "B" : complianceScore >= 70 ? "C" : complianceScore >= 60 ? "D" : "F";

  const exportData = {
    exportedAt: new Date().toISOString(),
    version: VERSION,
    project: {
      name: result.projectName,
      path: result.projectPath,
    },
    services: result.services.map((s) => ({
      name: s.name,
      category: s.category,
      dataCollected: s.dataCollected,
    })),
    documents: docs.map((d) => ({
      name: d.name,
      category: getDocumentCategory(d.filename) || "general",
      filename: d.filename,
      lineCount: d.content.split("\n").length,
    })),
    complianceNeeds: result.complianceNeeds,
    dataCategories: result.dataCategories,
    score: {
      value: complianceScore,
      grade,
      servicesDetected: result.services.length,
      documentsGenerated: docs.length,
      requiredDocs: result.complianceNeeds.filter((n) => n.priority === "required").length,
      recommendedDocs: result.complianceNeeds.filter((n) => n.priority === "recommended").length,
    },
    scanDurationMs: durationMs,
  };

  const jsonStr = JSON.stringify(exportData, null, 2);

  if (outputToFile) {
    const dir = path.dirname(outputToFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputToFile, jsonStr, "utf-8");
    if (!quiet) {
      const relPath = path.relative(absProjectPath, outputToFile);
      console.log(`\n  ${GREEN()}✓${RESET()} Exported compliance data to ${relPath}`);
      console.log(`    ${DIM()}${result.services.length} services, ${docs.length} documents, score: ${complianceScore}% (${grade})${RESET()}\n`);
    }
  } else {
    console.log(jsonStr);
  }

  process.exit(0);
}

function runExportZip(absProjectPath: string, absOutputDir: string, quiet: boolean, formatFlag: OutputFormat | undefined, verbose: boolean = false) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result, durationMs, timings } = scanWithProgress(absProjectPath, quiet, verbose, plugins);

  if (!quiet) {
    console.log(`\n  ${DIM()}Scanned in ${formatDuration(durationMs)}${RESET()}\n`);
  }
  if (verbose && timings && !quiet) {
    printTimings(timings, durationMs);
  }

  const docs = generateDocuments(result, config, plugins);

  if (!quiet) {
    console.log(`${BOLD()}Creating ZIP archive...${RESET()}\n`);
  }

  const zipEntries: { name: string; data: Buffer }[] = [];
  for (const doc of docs) {
    zipEntries.push({ name: doc.filename, data: Buffer.from(doc.content, "utf-8") });
  }

  const metadata = {
    exportedAt: new Date().toISOString(),
    version: VERSION,
    project: result.projectName,
    projectPath: result.projectPath,
    servicesDetected: result.services.length,
    documentsGenerated: docs.length,
    documentList: docs.map((d) => ({ name: d.name, filename: d.filename })),
    services: result.services.map((s) => ({
      name: s.name,
      category: s.category,
      dataCollected: s.dataCollected,
    })),
    complianceNeeds: result.complianceNeeds,
    dataCategories: result.dataCategories,
  };
  zipEntries.push({
    name: "codepliant-metadata.json",
    data: Buffer.from(JSON.stringify(metadata, null, 2), "utf-8"),
  });

  // Include full scan result JSON
  zipEntries.push({
    name: "scan-result.json",
    data: Buffer.from(JSON.stringify(result, null, 2), "utf-8"),
  });

  // Include .codepliantrc.json if it exists
  const rcPath = path.join(absProjectPath, ".codepliantrc.json");
  if (fs.existsSync(rcPath)) {
    zipEntries.push({
      name: ".codepliantrc.json",
      data: fs.readFileSync(rcPath),
    });
  }

  // Include compliance score summary
  const complianceScore = computeComplianceScore(result, absOutputDir);
  const scoreSummary = {
    score: complianceScore,
    grade: complianceScore >= 90 ? "A" : complianceScore >= 80 ? "B" : complianceScore >= 70 ? "C" : complianceScore >= 60 ? "D" : "F",
    servicesDetected: result.services.length,
    documentsGenerated: docs.length,
    complianceNeeds: result.complianceNeeds.length,
    requiredDocs: result.complianceNeeds.filter(n => n.priority === "required").length,
    recommendedDocs: result.complianceNeeds.filter(n => n.priority === "recommended").length,
    generatedAt: new Date().toISOString(),
    version: VERSION,
  };
  zipEntries.push({
    name: "compliance-score.json",
    data: Buffer.from(JSON.stringify(scoreSummary, null, 2), "utf-8"),
  });

  const zipBuffer = buildZipArchive(zipEntries);

  if (!fs.existsSync(absOutputDir)) {
    fs.mkdirSync(absOutputDir, { recursive: true });
  }

  const safeName = result.projectName.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
  const zipFilename = `codepliant-${safeName}.zip`;
  const zipPath = path.join(absOutputDir, zipFilename);
  fs.writeFileSync(zipPath, zipBuffer);

  const zipSize = zipBuffer.length;
  const relativePath = path.relative(absProjectPath, zipPath);

  if (!quiet) {
    console.log(`  ${GREEN()}\u2713${RESET()} ${relativePath} ${DIM()}(${formatFileSize(zipSize)}, ${docs.length} documents + metadata)${RESET()}`);
    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} Compliance archive exported to ${relativePath}\n`
    );
    console.log(`${DIM()}Contents:${RESET()}`);
    for (const doc of docs) {
      console.log(`  ${DIM()}\u2022 ${doc.filename} (${doc.name})${RESET()}`);
    }
    console.log(`  ${DIM()}\u2022 codepliant-metadata.json (scan results + metadata)${RESET()}`);
    console.log(`  ${DIM()}\u2022 scan-result.json (full scan result)${RESET()}`);
    if (fs.existsSync(rcPath)) {
      console.log(`  ${DIM()}\u2022 .codepliantrc.json (project configuration)${RESET()}`);
    }
    console.log(`  ${DIM()}\u2022 compliance-score.json (score: ${scoreSummary.score}%, grade: ${scoreSummary.grade})${RESET()}\n`);
  }

  process.exit(0);
}

function buildZipArchive(entries: { name: string; data: Buffer }[]): Buffer {
  const parts: Buffer[] = [];
  const centralDir: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = Buffer.from(entry.name, "utf-8");
    const dataLen = entry.data.length;
    const crc = zipCrc32(entry.data);

    const local = Buffer.alloc(30 + nameBytes.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(0, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(dataLen, 18);
    local.writeUInt32LE(dataLen, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    nameBytes.copy(local, 30);
    parts.push(local, entry.data);

    const central = Buffer.alloc(46 + nameBytes.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(0, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(dataLen, 20);
    central.writeUInt32LE(dataLen, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    nameBytes.copy(central, 46);
    centralDir.push(central);
    offset += local.length + dataLen;
  }

  const centralDirBuf = Buffer.concat(centralDir);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...parts, centralDirBuf, eocd]);
}

function zipCrc32(buf: Buffer): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}


function runConfigShow(absProjectPath: string) {
  printBanner();
  const exists = configExists(absProjectPath);
  if (!exists) {
    console.log(`${YELLOW()}No .codepliantrc.json found in ${absProjectPath}${RESET()}`);
    console.log(`${DIM()}Run 'codepliant init' to create one.${RESET()}\n`);
    return;
  }

  const config = loadConfig(absProjectPath);
  const warnings = validateConfig(config);
  const warningFields = new Set(warnings.map((w) => w.field));

  console.log(`${BOLD()}Configuration:${RESET()} ${path.join(absProjectPath, ".codepliantrc.json")}\n`);

  // Recommended fields
  const recommendedFields: Array<{ key: keyof CodepliantConfig; label: string }> = [
    { key: "companyName", label: "Company Name" },
    { key: "contactEmail", label: "Contact Email" },
    { key: "website", label: "Website" },
    { key: "jurisdiction", label: "Jurisdiction" },
    { key: "jurisdictions", label: "Jurisdictions" },
    { key: "dpoName", label: "DPO Name" },
    { key: "dpoEmail", label: "DPO Email" },
    { key: "securityEmail", label: "Security Email" },
    { key: "outputDir", label: "Output Directory" },
    { key: "outputFormat", label: "Output Format" },
    { key: "language", label: "Language" },
    { key: "dataRetentionDays", label: "Data Retention Days" },
    { key: "aiRiskLevel", label: "AI Risk Level" },
    { key: "companyLocation", label: "Company Location" },
    { key: "euRepresentative", label: "EU Representative" },
    { key: "bugBountyUrl", label: "Bug Bounty URL" },
    { key: "plugins", label: "Plugins" },
    { key: "licenseKey", label: "License Key" },
  ];

  for (const field of recommendedFields) {
    const value = config[field.key];
    const hasWarning = warningFields.has(field.key);

    if (value === undefined || value === null) {
      console.log(`  ${DIM()}${field.label.padEnd(22)}${RESET()} ${YELLOW()}(not set)${RESET()}`);
    } else if (hasWarning) {
      const displayValue = field.key === "licenseKey" ? maskValue(String(value)) : formatConfigValue(value);
      console.log(`  ${field.label.padEnd(22)} ${YELLOW()}${displayValue}${RESET()} ${YELLOW()}⚠${RESET()}`);
    } else {
      const displayValue = field.key === "licenseKey" ? maskValue(String(value)) : formatConfigValue(value);
      console.log(`  ${field.label.padEnd(22)} ${GREEN()}${displayValue}${RESET()}`);
    }
  }

  // Show warnings
  if (warnings.length > 0) {
    console.log();
    console.log(`${YELLOW()}${BOLD()}Warnings:${RESET()}`);
    for (const w of warnings) {
      console.log(`  ${YELLOW()}⚠${RESET()} ${w.field}: ${w.message}`);
    }
  }

  // Missing recommended fields
  const missingRecommended = recommendedFields
    .filter((f) => {
      const v = config[f.key];
      return v === undefined || v === null;
    })
    .filter((f) => ["website", "jurisdictions", "dpoName", "dpoEmail", "securityEmail", "companyLocation"].includes(f.key));

  if (missingRecommended.length > 0) {
    console.log();
    console.log(`${CYAN()}${BOLD()}Recommended fields to set:${RESET()}`);
    for (const f of missingRecommended) {
      console.log(`  ${CYAN()}+${RESET()} ${f.label} ${DIM()}(${f.key})${RESET()}`);
    }
    console.log(`\n${DIM()}Run 'codepliant init' or edit .codepliantrc.json directly.${RESET()}`);
  }

  console.log();
}

function runCheckConfig(absProjectPath: string, quiet: boolean, jsonOutput: boolean) {
  if (!quiet) printBanner();

  const exists = configExists(absProjectPath);

  if (!exists) {
    if (jsonOutput) {
      console.log(JSON.stringify({ valid: false, completeness: 0, missing: ["config file"], warnings: [], suggestions: ["Run 'codepliant init' to create a configuration file."] }));
      return;
    }
    console.log(`${RED()}${BOLD()}No .codepliantrc.json found.${RESET()}`);
    console.log(`\n${DIM()}Run 'codepliant init' to create a configuration file.${RESET()}\n`);
    return;
  }

  const config = loadConfig(absProjectPath);
  const warnings = validateConfig(config);

  // Define all fields with their importance for completeness scoring
  const allFields: Array<{ key: keyof CodepliantConfig; label: string; weight: number; suggestion: string }> = [
    { key: "companyName", label: "Company Name", weight: 15, suggestion: "Set your company name for personalized documents" },
    { key: "contactEmail", label: "Contact Email", weight: 15, suggestion: "Set a valid contact email for privacy inquiries" },
    { key: "website", label: "Website", weight: 5, suggestion: "Set your website URL for document references" },
    { key: "jurisdictions", label: "Jurisdictions", weight: 10, suggestion: "Define applicable jurisdictions (e.g. [\"gdpr\", \"ccpa\"])" },
    { key: "dpoName", label: "DPO Name", weight: 8, suggestion: "Appoint and name your Data Protection Officer" },
    { key: "dpoEmail", label: "DPO Email", weight: 8, suggestion: "Set the DPO's contact email" },
    { key: "securityEmail", label: "Security Email", weight: 5, suggestion: "Set a security contact for vulnerability reports" },
    { key: "companyLocation", label: "Company Location", weight: 4, suggestion: "Set your company location for jurisdiction mapping" },
    { key: "dataRetentionDays", label: "Data Retention Days", weight: 5, suggestion: "Define your data retention period in days" },
    { key: "aiRiskLevel", label: "AI Risk Level", weight: 5, suggestion: "Classify AI risk level: minimal, limited, or high" },
    { key: "outputDir", label: "Output Directory", weight: 3, suggestion: "Set custom output directory (default: legal)" },
    { key: "language", label: "Language", weight: 3, suggestion: "Set document language (en, de, fr, es)" },
    { key: "tollFreeNumber", label: "Toll-Free Number", weight: 4, suggestion: "CCPA requires a toll-free number for consumer requests" },
    { key: "euRepresentative", label: "EU Representative", weight: 4, suggestion: "GDPR Art. 27 requires an EU representative for non-EU companies" },
    { key: "bugBountyUrl", label: "Bug Bounty URL", weight: 3, suggestion: "Link to your vulnerability disclosure program" },
    { key: "aiUsageDescription", label: "AI Usage Description", weight: 3, suggestion: "Describe how AI is used in your product for disclosures" },
  ];

  // Check which fields are set and not placeholders
  const PLACEHOLDER_RE = [/^\[.*\]$/, /^your[- ]/i, /example\.com$/i, /^TODO/i, /^CHANGEME/i, /^PLACEHOLDER/i];
  function isFieldSet(key: keyof CodepliantConfig): boolean {
    const v = config[key];
    if (v === undefined || v === null) return false;
    if (typeof v === "string") {
      if (v.trim().length === 0) return false;
      if (PLACEHOLDER_RE.some((re) => re.test(v))) return false;
    }
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }

  let totalWeight = 0;
  let earnedWeight = 0;
  const missing: string[] = [];
  const suggestions: string[] = [];

  for (const field of allFields) {
    totalWeight += field.weight;
    if (isFieldSet(field.key)) {
      earnedWeight += field.weight;
    } else {
      missing.push(field.label);
      suggestions.push(field.suggestion);
    }
  }

  const completeness = Math.round((earnedWeight / totalWeight) * 100);

  if (jsonOutput) {
    console.log(JSON.stringify({
      valid: warnings.length === 0,
      completeness,
      missing,
      warnings: warnings.map((w) => ({ field: w.field, message: w.message })),
      suggestions,
    }, null, 2));
    return;
  }

  // Visual output
  console.log(`${BOLD()}Config Validation Results${RESET()}\n`);
  console.log(`${BOLD()}File:${RESET()} ${path.join(absProjectPath, ".codepliantrc.json")}\n`);

  // Completeness bar
  const barLength = 20;
  const filled = Math.round((completeness / 100) * barLength);
  const empty = barLength - filled;
  const barColor = completeness >= 80 ? GREEN() : completeness >= 50 ? YELLOW() : RED();
  console.log(`${BOLD()}Completeness:${RESET()} ${barColor}${"█".repeat(filled)}${"░".repeat(empty)}${RESET()} ${BOLD()}${completeness}%${RESET()}`);
  console.log(``);

  // Field status
  console.log(`${BOLD()}Field Status:${RESET()}`);
  const warningFields = new Set(warnings.map((w) => w.field));
  for (const field of allFields) {
    const set = isFieldSet(field.key);
    const hasWarning = warningFields.has(field.key);
    if (set && !hasWarning) {
      console.log(`  ${GREEN()}✓${RESET()} ${field.label}`);
    } else if (set && hasWarning) {
      console.log(`  ${YELLOW()}⚠${RESET()} ${field.label} ${YELLOW()}(warning)${RESET()}`);
    } else {
      console.log(`  ${DIM()}○${RESET()} ${field.label} ${DIM()}(not set)${RESET()}`);
    }
  }
  console.log(``);

  // Warnings
  if (warnings.length > 0) {
    console.log(`${YELLOW()}${BOLD()}Warnings (${warnings.length}):${RESET()}`);
    for (const w of warnings) {
      console.log(`  ${YELLOW()}⚠${RESET()} ${w.field}: ${w.message}`);
    }
    console.log(``);
  }

  // Missing fields with suggestions
  if (missing.length > 0) {
    console.log(`${CYAN()}${BOLD()}Missing Fields (${missing.length}):${RESET()}`);
    for (let i = 0; i < missing.length; i++) {
      console.log(`  ${CYAN()}+${RESET()} ${missing[i]}: ${DIM()}${suggestions[i]}${RESET()}`);
    }
    console.log(``);
  }

  // Summary message
  if (completeness >= 90) {
    console.log(`${GREEN()}${BOLD()}Your config is ${completeness}% complete. Excellent!${RESET()}`);
  } else if (completeness >= 70) {
    console.log(`${GREEN()}Your config is ${completeness}% complete.${RESET()} ${DIM()}Missing: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` (+${missing.length - 3} more)` : ""}${RESET()}`);
  } else if (completeness >= 50) {
    console.log(`${YELLOW()}Your config is ${completeness}% complete.${RESET()} ${DIM()}Missing: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` (+${missing.length - 3} more)` : ""}${RESET()}`);
  } else {
    console.log(`${RED()}Your config is ${completeness}% complete.${RESET()} ${DIM()}Missing: ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? ` (+${missing.length - 3} more)` : ""}${RESET()}`);
  }
  console.log(`\n${DIM()}Run 'codepliant init' or edit .codepliantrc.json to improve completeness.${RESET()}\n`);
}

function maskValue(value: string): string {
  if (value.length <= 8) return "****";
  return value.substring(0, 4) + "****" + value.substring(value.length - 4);
}

function formatConfigValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value);
}

function runDoctor(absProjectPath: string, absOutputDir: string, quiet: boolean) {
  if (!quiet) printBanner();
  console.log(`${BOLD()}Running diagnostics...${RESET()}\n`);
  interface DiagCheck { name: string; status: "pass" | "warn" | "fail"; message: string; fix?: string; }
  const checks: DiagCheck[] = [];
  const hasConfig = configExists(absProjectPath);
  if (hasConfig) {
    checks.push({ name: "Configuration", status: "pass", message: "Config file found (.codepliantrc.json)" });
  } else {
    checks.push({ name: "Configuration", status: "warn", message: "No config file found", fix: "Run 'codepliant init' to create a configuration file" });
  }
  if (hasConfig) {
    const config = loadConfig(absProjectPath);
    const warnings = validateConfig(config);
    if (warnings.length === 0) {
      checks.push({ name: "Config validation", status: "pass", message: "All config fields are valid" });
    } else {
      checks.push({ name: "Config validation", status: "warn", message: `${warnings.length} warning(s): ${warnings.map(w => w.message).join("; ")}`, fix: "Run 'codepliant init' to update your configuration" });
    }
  }
  if (fs.existsSync(absOutputDir)) {
    const mdFiles = fs.readdirSync(absOutputDir).filter(f => f.endsWith(".md"));
    if (mdFiles.length > 0) {
      checks.push({ name: "Generated documents", status: "pass", message: `${mdFiles.length} document(s) found in output directory` });
    } else {
      checks.push({ name: "Generated documents", status: "warn", message: "Output directory exists but contains no .md files", fix: "Run 'codepliant go' to generate documents" });
    }
  } else {
    checks.push({ name: "Generated documents", status: "fail", message: "Output directory does not exist", fix: "Run 'codepliant go' to scan and generate documents" });
  }
  if (fs.existsSync(absOutputDir)) {
    try {
      const config = loadConfig(absProjectPath);
      const scanResult = scan(absProjectPath);
      const docs = generateDocuments(scanResult, config);
      const docDiff = diffDocuments(docs, absOutputDir);
      if (docDiff.hasChanges) {
        checks.push({ name: "Documents freshness", status: "warn", message: `${docDiff.changes.length} document(s) are out of date`, fix: "Run 'codepliant go' to regenerate documents" });
      } else {
        checks.push({ name: "Documents freshness", status: "pass", message: "All documents are up to date" });
      }
    } catch {
      checks.push({ name: "Documents freshness", status: "warn", message: "Could not compare documents (scan may have failed)" });
    }
  }
  const manifestFiles = ["package.json", "requirements.txt", "go.mod", "Cargo.toml", "Gemfile", "pom.xml", "build.gradle"];
  const foundManifests = manifestFiles.filter(f => fs.existsSync(path.join(absProjectPath, f)));
  if (foundManifests.length > 0) {
    checks.push({ name: "Package manifest", status: "pass", message: `Found: ${foundManifests.join(", ")}` });
  } else {
    checks.push({ name: "Package manifest", status: "warn", message: "No package manifest found", fix: "Ensure you are running codepliant in the project root directory" });
  }
  const nodeVersion = process.versions.node;
  const nodeMajor = parseInt(nodeVersion.split(".")[0], 10);
  if (nodeMajor >= 18) {
    checks.push({ name: "Node.js version", status: "pass", message: `Node.js v${nodeVersion} (>= 18 required)` });
  } else {
    checks.push({ name: "Node.js version", status: "fail", message: `Node.js v${nodeVersion} is below minimum v18`, fix: "Upgrade to Node.js 18 or later" });
  }
  checks.push({ name: "Codepliant version", status: "pass", message: `v${VERSION} (run 'npm outdated -g codepliant' to check for updates)` });
  const codepliantDir = path.join(absProjectPath, ".codepliant");
  if (fs.existsSync(codepliantDir)) {
    const customSigsPath = path.join(codepliantDir, "custom-signatures.json");
    if (fs.existsSync(customSigsPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(customSigsPath, "utf-8"));
        const count = Array.isArray(raw.signatures) ? raw.signatures.length : 0;
        checks.push({ name: "Custom signatures", status: "pass", message: `${count} custom signature(s) loaded` });
      } catch {
        checks.push({ name: "Custom signatures", status: "warn", message: "custom-signatures.json is malformed", fix: "Fix or delete .codepliant/custom-signatures.json" });
      }
    }
  }
  const passCount = checks.filter(c => c.status === "pass").length;
  const warnCount = checks.filter(c => c.status === "warn").length;
  const failCount = checks.filter(c => c.status === "fail").length;
  for (const check of checks) {
    let icon: string; let statusColor: string;
    switch (check.status) {
      case "pass": icon = `${GREEN()}✓${RESET()}`; statusColor = GREEN(); break;
      case "warn": icon = `${YELLOW()}⚠${RESET()}`; statusColor = YELLOW(); break;
      case "fail": icon = `${RED()}✗${RESET()}`; statusColor = RED(); break;
    }
    console.log(`  ${icon} ${BOLD()}${check.name}${RESET()}: ${statusColor}${check.message}${RESET()}`);
    if (check.fix) console.log(`    ${DIM()}Fix: ${check.fix}${RESET()}`);
  }
  console.log();
  console.log(`${BOLD()}Summary:${RESET()} ${GREEN()}${passCount} passed${RESET()}, ${YELLOW()}${warnCount} warning(s)${RESET()}, ${RED()}${failCount} error(s)${RESET()}`);
  if (failCount > 0) {
    console.log(`\n${RED()}Some checks failed. Please address the issues above.${RESET()}\n`);
    process.exit(1);
  } else if (warnCount > 0) {
    console.log(`\n${YELLOW()}Some warnings found. Consider addressing them for optimal setup.${RESET()}\n`);
    process.exit(0);
  } else {
    console.log(`\n${GREEN()}${BOLD()}All checks passed! Your Codepliant setup looks good.${RESET()}\n`);
    process.exit(0);
  }
}

// --- `codepliant onboard` command ---

async function runOnboard(projectPath: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const absProjectPath = path.resolve(projectPath);

  console.log(`  ${CYAN()}${BOLD()}Welcome to Codepliant!${RESET()}`);
  console.log(`  ${DIM()}Let's set up compliance for your project in just a few steps.${RESET()}\n`);

  // --- Step 1: What kind of project? ---
  console.log(`  ${GREEN()}${BOLD()}Step 1/5:${RESET()} ${BOLD()}What kind of project is this?${RESET()}\n`);

  const projectTypes = ["SaaS", "API", "Mobile App", "Library/Package"];
  const projectType = await askSelect(rl, `  ${BOLD()}Project type${RESET()}`, projectTypes, "SaaS");
  console.log(`  ${GREEN()}✓${RESET()} ${projectType}\n`);

  // --- Step 2: Where are you based? ---
  console.log(`  ${GREEN()}${BOLD()}Step 2/5:${RESET()} ${BOLD()}Where are you based?${RESET()}\n`);

  const locationOptions = [
    "United States",
    "European Union",
    "United Kingdom",
    "Canada",
    "Australia",
    "Other",
  ];
  const location = await askSelect(rl, `  ${BOLD()}Primary location${RESET()}`, locationOptions, "United States");
  console.log(`  ${GREEN()}✓${RESET()} ${location}\n`);

  // Auto-select jurisdictions based on location
  const autoJurisdictions: string[] = [];
  if (location === "European Union") {
    autoJurisdictions.push("GDPR");
  } else if (location === "United Kingdom") {
    autoJurisdictions.push("UK GDPR");
    autoJurisdictions.push("GDPR"); // Most UK companies also need GDPR
  } else if (location === "United States") {
    autoJurisdictions.push("CCPA");
  } else if (location === "Canada" || location === "Australia" || location === "Other") {
    // Suggest GDPR if they serve EU customers
    const servesEU = await askYesNo(rl, `  ${BOLD()}Do you serve customers in the EU?${RESET()}`, false);
    if (servesEU) autoJurisdictions.push("GDPR");
    const servesUS = await askYesNo(rl, `  ${BOLD()}Do you serve customers in California/US?${RESET()}`, false);
    if (servesUS) autoJurisdictions.push("CCPA");
    const servesUK = await askYesNo(rl, `  ${BOLD()}Do you serve customers in the UK?${RESET()}`, false);
    if (servesUK) autoJurisdictions.push("UK GDPR");
  }

  // Also check if US-based companies serve EU
  if (location === "United States") {
    const servesEU = await askYesNo(rl, `\n  ${BOLD()}Do you serve customers in the EU?${RESET()}`, false);
    if (servesEU) autoJurisdictions.push("GDPR");
  }

  if (autoJurisdictions.length > 0) {
    console.log(`  ${GREEN()}Auto-selected jurisdictions:${RESET()} ${autoJurisdictions.join(", ")}`);
  }

  // Let them adjust
  const allJurisdictions = ["GDPR", "CCPA", "UK GDPR"];
  const selectedJurisdictions = await askMultiSelect(
    rl,
    `\n  ${BOLD()}Confirm jurisdictions${RESET()} (edit if needed)`,
    allJurisdictions,
    autoJurisdictions,
  );

  // --- Step 3: Do you use AI? ---
  console.log(`\n  ${GREEN()}${BOLD()}Step 3/5:${RESET()} ${BOLD()}Do you use AI in your product?${RESET()}\n`);

  const usesAI = await askYesNo(rl, `  ${BOLD()}Does your project use AI or machine learning?${RESET()}`, false);
  let aiRiskLevel: "minimal" | "limited" | "high" | undefined;

  if (usesAI) {
    console.log(`\n  ${DIM()}The EU AI Act requires AI risk classification:${RESET()}`);
    console.log(`    ${DIM()}minimal${RESET()}  - No significant risk (e.g., spam filters, recommendation engines)`);
    console.log(`    ${DIM()}limited${RESET()}  - Transparency obligations (e.g., chatbots, content generation)`);
    console.log(`    ${DIM()}high${RESET()}     - Strict requirements (e.g., biometric ID, credit scoring, HR tools)\n`);

    const riskOptions = ["minimal", "limited", "high"];
    aiRiskLevel = await askSelect(rl, `  ${BOLD()}AI risk level${RESET()}`, riskOptions, "limited") as "minimal" | "limited" | "high";
    console.log(`  ${GREEN()}✓${RESET()} AI risk level: ${aiRiskLevel}`);
  }

  // --- Step 4: Company info (quick) ---
  console.log(`\n  ${GREEN()}${BOLD()}Step 4/5:${RESET()} ${BOLD()}Company details${RESET()}\n`);

  // Try auto-detect from package.json
  let detectedName: string | undefined;
  let detectedEmail: string | undefined;
  const pkgPath = path.join(absProjectPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      if (pkg.author) {
        if (typeof pkg.author === "string") {
          const nameMatch = pkg.author.match(/^([^<(]+)/);
          if (nameMatch) detectedName = nameMatch[1].trim();
          const emailMatch = pkg.author.match(/<([^>]+)>/);
          if (emailMatch) detectedEmail = emailMatch[1].trim();
        } else if (typeof pkg.author === "object") {
          detectedName = pkg.author.name;
          detectedEmail = pkg.author.email;
        }
      }
    } catch { /* ignore */ }
  }

  const companyName = await ask(rl, `  ${BOLD()}Company name${RESET()}`, detectedName || "");
  const contactEmail = await ask(rl, `  ${BOLD()}Contact email${RESET()}`, detectedEmail || "");

  rl.close();

  // --- Build and save config ---
  const config: CodepliantConfig = {
    companyName: companyName || "[Your Company Name]",
    contactEmail: contactEmail || "[your-email@example.com]",
    outputDir: "legal",
    ...(selectedJurisdictions.length > 0 && { jurisdictions: selectedJurisdictions }),
    ...(location && { companyLocation: location }),
    ...(usesAI && aiRiskLevel && { aiRiskLevel }),
  };

  const configPath = saveConfig(absProjectPath, config);
  console.log(`\n  ${GREEN()}✓${RESET()} Config saved to ${path.relative(absProjectPath, configPath)}`);

  // --- Step 5: First scan ---
  console.log(`\n  ${GREEN()}${BOLD()}Step 5/5:${RESET()} ${BOLD()}Running first scan${RESET()}\n`);

  const absOutputDir = path.resolve(absProjectPath, "legal");
  const scanStart = Date.now();
  const spinner = startSpinner("Scanning your project");

  const result = scan(absProjectPath);
  const scanMs = Date.now() - scanStart;
  spinner.stop(true);

  console.log(`    ${DIM()}Found ${result.services.length} service(s) in ${formatDuration(scanMs)}${RESET()}`);

  // Generate documents
  const genSpinner = startSpinner("Generating compliance documents");
  const reloadedConfig = loadConfig(absProjectPath);
  const docs = generateDocuments(result, reloadedConfig);
  const writtenFiles = writeDocumentsInFormat(docs, absOutputDir, "markdown", reloadedConfig, result);
  genSpinner.stop(true);

  console.log(`    ${DIM()}Generated ${writtenFiles.length} document(s)${RESET()}\n`);

  for (const file of writtenFiles) {
    const relPath = path.relative(absProjectPath, file);
    console.log(`    ${GREEN()}✓${RESET()} ${relPath}`);
  }

  // --- Summary ---
  console.log(`
  ${CYAN()}${"═".repeat(50)}${RESET()}
  ${CYAN()}${BOLD()}  Onboarding complete!${RESET()}
  ${CYAN()}${"═".repeat(50)}${RESET()}

  ${BOLD()}Project type:${RESET()}     ${projectType}
  ${BOLD()}Location:${RESET()}         ${location}
  ${BOLD()}Jurisdictions:${RESET()}    ${selectedJurisdictions.length > 0 ? selectedJurisdictions.join(", ") : "None"}
  ${BOLD()}AI enabled:${RESET()}       ${usesAI ? `Yes (risk: ${aiRiskLevel})` : "No"}
  ${BOLD()}Documents:${RESET()}        ${writtenFiles.length} generated
  ${BOLD()}Output:${RESET()}           legal/

  ${BOLD()}What to do next:${RESET()}

    1. Review generated documents in ${CYAN()}legal/${RESET()}
    2. Run ${CYAN()}codepliant dashboard${RESET()} for a compliance overview
    3. Run ${CYAN()}codepliant go${RESET()} after making code changes
    4. Run ${CYAN()}codepliant doctor${RESET()} to check for issues

  ${DIM()}Documents are generated from code analysis. Have them reviewed by legal counsel.${RESET()}
`);
}

// --- `codepliant publish` command ---

function runPublish(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  verbose: boolean,
  apiFlag: boolean,
  githubPagesFlag: boolean = false,
) {
  if (!apiFlag && !githubPagesFlag) {
    console.error(`${RED()}[CP015] Error: --api or --github-pages flag is required.${RESET()}`);
    console.error(`${DIM()}Usage: codepliant publish --api [path]${RESET()}`);
    console.error(`${DIM()}       codepliant publish --github-pages [path]${RESET()}`);
    process.exit(1);
  }

  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const license = checkLicense(config.licenseKey);
  const hint = checkAndTrackFeature(license, "compliance-api");
  if (hint && !quiet) {
    console.log(`  ${YELLOW()}${hint}${RESET()}\n`);
  }

  const plugins = config.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const { result } = scanWithProgress(absProjectPath, quiet, verbose, plugins);
  const docs = generateDocuments(result, config, plugins);

  if (githubPagesFlag) {
    // Generate static HTML site for GitHub Pages
    const docsDir = path.join(absProjectPath, "docs");

    if (!quiet) {
      console.log(`\n${BOLD()}Generating GitHub Pages site...${RESET()}\n`);
    }

    const writtenFiles = writeGithubPages({
      docs,
      outputDir: docsDir,
      companyName: config.companyName,
    });

    for (const filePath of writtenFiles) {
      const relativePath = path.relative(absProjectPath, filePath);
      const content = fs.readFileSync(filePath, "utf-8");
      const size = Buffer.byteLength(content, "utf-8");
      console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${formatFileSize(size)})${RESET()}`);
    }

    console.log(
      `\n${GREEN()}${BOLD()}Done!${RESET()} ${writtenFiles.length} files written to ${CYAN()}docs/${RESET()}\n`
    );
    console.log(`${DIM()}To deploy:${RESET()}`);
    console.log(`  1. Commit the ${CYAN()}docs/${RESET()} directory`);
    console.log(`  2. Go to GitHub > Settings > Pages`);
    console.log(`  3. Set source to "${CYAN()}Deploy from a branch${RESET()}" > ${CYAN()}main${RESET()} > ${CYAN()}/docs${RESET()}`);
    console.log(`  4. Your compliance docs will be live at ${CYAN()}https://<user>.github.io/<repo>/${RESET()}\n`);

    process.exit(0);
  }

  const score = computeFullComplianceScore({
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  });

  if (!quiet) {
    console.log(`\n${BOLD()}Generating compliance API spec...${RESET()}\n`);
  }

  const specPath = writeApiSpec({
    scanResult: result,
    docs,
    score,
    outputDir: absOutputDir,
  });

  const relativePath = path.relative(absProjectPath, specPath);
  const content = fs.readFileSync(specPath, "utf-8");
  const size = Buffer.byteLength(content, "utf-8");

  console.log(`  ${GREEN()}✓${RESET()} ${relativePath} ${DIM()}(${formatFileSize(size)})${RESET()}`);
  console.log(
    `\n${GREEN()}${BOLD()}Done!${RESET()} API spec generated. Integrate with dashboards, Slack bots, CI/CD.\n`
  );

  process.exit(0);
}

// --- `codepliant schedule` command ---

function runSchedule(
  absProjectPath: string,
  absOutputDir: string,
  subCommand: string | undefined,
  frequency: ScheduleFrequency,
  quiet: boolean,
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const license = checkLicense(config.licenseKey);
  const hint = checkAndTrackFeature(license, "scheduled-scans");
  if (hint && !quiet) {
    console.log(`  ${YELLOW()}${hint}${RESET()}\n`);
  }

  if (subCommand === "uninstall") {
    const result = unscheduleScans();
    if (result.success) {
      console.log(`  ${GREEN()}✓${RESET()} ${result.message}`);
    } else {
      console.log(`  ${YELLOW()}${result.message}${RESET()}`);
    }
    process.exit(0);
  }

  if (subCommand === "status") {
    const status = getScheduleStatus();
    if (status.scheduled) {
      console.log(`  ${GREEN()}✓${RESET()} Scheduled scan active`);
      console.log(`    ${DIM()}Frequency:${RESET()} ${status.frequency}`);
      console.log(`    ${DIM()}Method:${RESET()} ${status.method}`);
      if (status.configPath) {
        console.log(`    ${DIM()}Config:${RESET()} ${status.configPath}`);
      }
    } else {
      console.log(`  ${DIM()}No scheduled scan configured.${RESET()}`);
      console.log(`  ${DIM()}Run ${CYAN()}codepliant schedule install${RESET()}${DIM()} to set one up.${RESET()}`);
    }
    process.exit(0);
  }

  if (subCommand === "install" || !subCommand) {
    const result = scheduleScans({
      projectPath: absProjectPath,
      outputDir: absOutputDir,
      frequency,
      webhookUrl: config.webhookUrl,
    });

    if (result.success) {
      console.log(`  ${GREEN()}✓${RESET()} ${result.message}`);
      console.log(`    ${DIM()}Runs ${frequencyDescription(frequency)}${RESET()}`);
      if (config.webhookUrl) {
        console.log(`    ${DIM()}Webhook notifications enabled${RESET()}`);
      }
    } else {
      console.error(`  ${RED()}${result.message}${RESET()}`);
      process.exit(1);
    }
    process.exit(0);
  }

  console.error(`${RED()}[CP024] Unknown schedule subcommand: "${subCommand || ""}". Use: install, uninstall, status${RESET()}`);
  process.exit(1);
}

// --- `codepliant billing` command ---

function runBilling(
  absProjectPath: string,
  subCommand: string | undefined,
  quiet: boolean,
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);

  if (subCommand === "status" || !subCommand) {
    const status = getBillingStatus(config.licenseKey);

    console.log(`\n  ${BOLD()}Plan: ${CYAN()}${status.planName}${RESET()} ${DIM()}${status.price}${RESET()}\n`);

    if (status.licenseKeyPrefix) {
      console.log(`  ${DIM()}License: ${status.licenseKeyPrefix}${RESET()}`);
    }

    console.log(`  ${BOLD()}Features:${RESET()}`);
    for (const feature of status.features) {
      console.log(`    ${GREEN()}✓${RESET()} ${feature}`);
    }
    console.log();

    if (status.tier === "free") {
      console.log(`  ${DIM()}Upgrade: ${CYAN()}codepliant upgrade${RESET()}\n`);
    }

    process.exit(0);
  }

  if (subCommand === "usage") {
    const usage = getBillingUsage(config.licenseKey);

    console.log(`\n  ${BOLD()}Feature Usage Statistics${RESET()} ${DIM()}(${usage.tier} tier)${RESET()}\n`);

    if (usage.features.length === 0) {
      console.log(`  ${DIM()}No paid feature usage recorded yet.${RESET()}\n`);
    } else {
      console.log(`  ${BOLD()}Feature${RESET()}                    ${BOLD()}Uses${RESET()}    ${BOLD()}Tier${RESET()}`);
      console.log(`  ${"─".repeat(50)}`);

      for (const stat of usage.features) {
        const name = stat.feature.padEnd(28);
        const count = String(stat.count).padStart(4);
        console.log(`  ${name}${count}    ${DIM()}${stat.requiredTier}${RESET()}`);
      }

      console.log(`\n  ${DIM()}Total attempts: ${usage.totalAttempts}${RESET()}\n`);
    }

    process.exit(0);
  }

  if (subCommand === "portal") {
    const result = openBillingPortal();
    console.log(`\n  ${BOLD()}Opening billing portal...${RESET()}`);
    console.log(`  ${DIM()}URL: ${result.url}${RESET()}\n`);
    process.exit(0);
  }

  console.error(`${RED()}[CP026] Unknown billing subcommand: "${subCommand || ""}". Use: status, usage, portal${RESET()}`);
  process.exit(1);
}

// --- `codepliant health` command ---

function runHealth(absProjectPath: string, absOutputDir: string, quiet: boolean, jsonOutput: boolean) {
  if (!quiet && !jsonOutput) printBanner();

  // ── 1. Scan the project ────────────────────────────────────────
  let scanResult: ReturnType<typeof scan> | null = null;
  try {
    scanResult = scan(absProjectPath);
  } catch {
    // scan may fail if no package.json etc — that's a finding, not a crash
  }

  const servicesDetected = scanResult ? scanResult.services.map((s) => s.name) : [];

  // ── 2. Load config ─────────────────────────────────────────────
  const hasConfig = configExists(absProjectPath);
  let config: ReturnType<typeof loadConfig> | undefined;
  let configWarnings: ReturnType<typeof validateConfig> = [];
  if (hasConfig) {
    config = loadConfig(absProjectPath);
    configWarnings = validateConfig(config);
  }

  // ── 3. Generate expected docs & diff against existing ──────────
  let expectedDocs: ReturnType<typeof generateDocuments> = [];
  if (scanResult) {
    try {
      expectedDocs = generateDocuments(scanResult, config);
    } catch {
      // generation can fail — treat all docs as missing
    }
  }

  const existingFiles: string[] = [];
  if (fs.existsSync(absOutputDir)) {
    const entries = fs.readdirSync(absOutputDir).filter((f: string) => f.endsWith(".md") || f.endsWith(".json"));
    existingFiles.push(...entries);
  }

  // Determine which docs are generated (exist on disk), missing, or stale
  const docsGenerated: string[] = [];
  const docsMissing: string[] = [];
  const docsStale: string[] = [];

  if (expectedDocs.length > 0 && fs.existsSync(absOutputDir)) {
    let docDiff: ReturnType<typeof diffDocuments> | null = null;
    try {
      docDiff = diffDocuments(expectedDocs, absOutputDir);
    } catch {
      // diff failed
    }

    for (const doc of expectedDocs) {
      const onDisk = existingFiles.includes(doc.filename);
      if (!onDisk) {
        docsMissing.push(doc.name);
      } else if (docDiff && docDiff.changes.some((c) => c.filename === doc.filename && c.type === "updated")) {
        docsStale.push(doc.name);
        docsGenerated.push(doc.name);
      } else {
        docsGenerated.push(doc.name);
      }
    }
  } else if (expectedDocs.length > 0) {
    // no output dir at all — everything is missing
    for (const doc of expectedDocs) {
      docsMissing.push(doc.name);
    }
  }

  // ── 4. CI check ────────────────────────────────────────────────
  const ciFiles = [".github/workflows", ".gitlab-ci.yml", "Jenkinsfile", ".circleci/config.yml", "bitbucket-pipelines.yml", ".travis.yml"];
  const foundCI = ciFiles.some((f) => fs.existsSync(path.join(absProjectPath, f)));

  // ── 5. Determine overall health ────────────────────────────────
  const hasIssues = !hasConfig || configWarnings.length > 0 || docsMissing.length > 0 || docsStale.length > 0;

  // ── 6. JSON output mode ────────────────────────────────────────
  if (jsonOutput) {
    const report = {
      healthy: !hasIssues,
      project: absProjectPath,
      config: {
        found: hasConfig,
        warnings: configWarnings,
      },
      services: servicesDetected,
      docs: {
        generated: docsGenerated,
        missing: docsMissing,
        stale: docsStale,
        total: expectedDocs.length,
      },
      ci: foundCI,
    };
    console.log(JSON.stringify(report, null, 2));
    process.exit(hasIssues ? 1 : 0);
    return;
  }

  // ── 7. Human-readable output ───────────────────────────────────
  console.log(`${BOLD()}Compliance health check${RESET()}\n`);

  // Config
  if (hasConfig && configWarnings.length === 0) {
    console.log(`  ${GREEN()}✓${RESET()} Config`);
  } else if (hasConfig) {
    console.log(`  ${YELLOW()}✗${RESET()} Config  ${DIM()}(${configWarnings.length} warning(s))${RESET()}`);
  } else {
    console.log(`  ${RED()}✗${RESET()} Config  ${DIM()}(no .codepliantrc.json found)${RESET()}`);
  }

  // Docs presence
  if (docsGenerated.length > 0 && docsMissing.length === 0) {
    console.log(`  ${GREEN()}✓${RESET()} Docs    ${DIM()}(${docsGenerated.length} generated)${RESET()}`);
  } else if (docsGenerated.length > 0) {
    console.log(`  ${YELLOW()}✗${RESET()} Docs    ${DIM()}(${docsGenerated.length} generated, ${docsMissing.length} missing)${RESET()}`);
  } else if (docsMissing.length > 0) {
    console.log(`  ${RED()}✗${RESET()} Docs    ${DIM()}(${docsMissing.length} missing)${RESET()}`);
  } else {
    console.log(`  ${RED()}✗${RESET()} Docs    ${DIM()}(no docs expected — scan may have failed)${RESET()}`);
  }

  // Freshness
  if (docsStale.length === 0 && docsGenerated.length > 0) {
    console.log(`  ${GREEN()}✓${RESET()} Fresh`);
  } else if (docsStale.length > 0) {
    console.log(`  ${YELLOW()}✗${RESET()} Fresh   ${DIM()}(${docsStale.length} doc(s) out of date)${RESET()}`);
  } else {
    console.log(`  ${RED()}✗${RESET()} Fresh   ${DIM()}(no docs to check)${RESET()}`);
  }

  // CI
  if (foundCI) {
    console.log(`  ${GREEN()}✓${RESET()} CI`);
  } else {
    console.log(`  ${YELLOW()}✗${RESET()} CI      ${DIM()}(no CI config detected)${RESET()}`);
  }

  // ── Summary table ──────────────────────────────────────────────
  console.log();
  console.log(`${BOLD()}Summary${RESET()}`);
  console.log(`  Services detected : ${servicesDetected.length > 0 ? servicesDetected.join(", ") : DIM() + "none" + RESET()}`);
  console.log(`  Docs generated    : ${docsGenerated.length}`);
  console.log(`  Docs missing      : ${docsMissing.length > 0 ? RED() + docsMissing.length + RESET() : "0"}`);
  console.log(`  Docs stale        : ${docsStale.length > 0 ? YELLOW() + docsStale.length + RESET() : "0"}`);

  if (docsMissing.length > 0) {
    console.log();
    console.log(`${DIM()}Missing docs:${RESET()}`);
    for (const name of docsMissing) {
      console.log(`  ${RED()}•${RESET()} ${name}`);
    }
  }

  if (docsStale.length > 0) {
    console.log();
    console.log(`${DIM()}Stale docs:${RESET()}`);
    for (const name of docsStale) {
      console.log(`  ${YELLOW()}•${RESET()} ${name}`);
    }
  }

  console.log();

  if (!hasIssues) {
    console.log(`${GREEN()}${BOLD()}Healthy — compliance setup looks good.${RESET()}\n`);
    process.exit(0);
  } else {
    console.log(`${YELLOW()}Issues found. Run ${CYAN()}codepliant doctor${RESET()}${YELLOW()} for details.${RESET()}\n`);
    process.exit(1);
  }
}

// --- `codepliant audit` command ---

function runAudit(absProjectPath: string, absOutputDir: string, quiet: boolean, jsonOutput: boolean) {
  if (!quiet) printBanner();
  console.log(`${BOLD()}Running comprehensive compliance audit...${RESET()}\n`);

  interface AuditFinding {
    category: "config" | "docs" | "freshness" | "score" | "coverage";
    severity: "pass" | "warning" | "critical";
    title: string;
    detail: string;
    recommendation?: string;
  }

  const findings: AuditFinding[] = [];
  const auditDate = new Date().toISOString().split("T")[0];
  const auditTimestamp = new Date().toISOString();

  // ── 1. Config Completeness ─────────────────────────────────────
  const hasConfig = configExists(absProjectPath);
  if (hasConfig) {
    const config = loadConfig(absProjectPath);
    const warnings = validateConfig(config);
    if (warnings.length === 0) {
      findings.push({ category: "config", severity: "pass", title: "Configuration complete", detail: "All config fields are valid and present." });
    } else {
      findings.push({
        category: "config",
        severity: "warning",
        title: `Configuration has ${warnings.length} warning(s)`,
        detail: warnings.map(w => w.message).join("; "),
        recommendation: "Run 'codepliant init' to update your configuration.",
      });
    }
    // Check important fields
    if (!config.companyName || config.companyName === "[Your Company Name]") {
      findings.push({ category: "config", severity: "warning", title: "Company name not set", detail: "companyName is missing or still a placeholder.", recommendation: "Set companyName in .codepliantrc.json." });
    }
    if (!config.contactEmail || config.contactEmail.includes("example.com")) {
      findings.push({ category: "config", severity: "warning", title: "Contact email not set", detail: "contactEmail is missing or uses a placeholder.", recommendation: "Set contactEmail in .codepliantrc.json." });
    }
    if (!config.jurisdiction) {
      findings.push({ category: "config", severity: "warning", title: "Jurisdiction not set", detail: "No jurisdiction configured. Compliance documents may not target the correct regulations.", recommendation: "Set jurisdiction (e.g. 'gdpr', 'ccpa') in .codepliantrc.json." });
    }
  } else {
    findings.push({
      category: "config",
      severity: "critical",
      title: "No configuration file",
      detail: "No .codepliantrc.json found. Documents will use placeholder values.",
      recommendation: "Run 'codepliant init' to create a configuration file.",
    });
  }

  // ── 2. Document Completeness ───────────────────────────────────
  let scanResult: ScanResult | null = null;
  let generatedDocs: ReturnType<typeof generateDocuments> | null = null;
  try {
    const config = hasConfig ? loadConfig(absProjectPath) : undefined;
    scanResult = scan(absProjectPath);
    generatedDocs = generateDocuments(scanResult, config);
  } catch (err: unknown) {
    findings.push({ category: "docs", severity: "critical", title: "Scan failed", detail: err instanceof Error ? err.message : String(err), recommendation: "Ensure you are running codepliant from a valid project root." });
  }

  if (generatedDocs && scanResult) {
    const expectedFilenames = new Set(generatedDocs.map(d => d.filename));

    if (fs.existsSync(absOutputDir)) {
      const existingFiles = new Set(fs.readdirSync(absOutputDir).filter(f => f.endsWith(".md") || f.endsWith(".json")));
      const missing = [...expectedFilenames].filter(f => !existingFiles.has(f));
      const extra = [...existingFiles].filter(f => !expectedFilenames.has(f));

      if (missing.length === 0) {
        findings.push({ category: "docs", severity: "pass", title: "All expected documents present", detail: `${expectedFilenames.size} document(s) expected, all found.` });
      } else {
        findings.push({
          category: "docs",
          severity: missing.length > 5 ? "critical" : "warning",
          title: `${missing.length} document(s) missing`,
          detail: `Missing: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? ` and ${missing.length - 10} more` : ""}`,
          recommendation: "Run 'codepliant go' to generate all documents.",
        });
      }

      if (extra.length > 0) {
        findings.push({ category: "docs", severity: "pass", title: `${extra.length} additional document(s) found`, detail: `Extra files not in current generation set: ${extra.slice(0, 5).join(", ")}${extra.length > 5 ? "..." : ""}` });
      }

      // Coverage percentage
      const coveragePct = expectedFilenames.size > 0 ? Math.round(((expectedFilenames.size - missing.length) / expectedFilenames.size) * 100) : 0;
      findings.push({
        category: "coverage",
        severity: coveragePct >= 90 ? "pass" : coveragePct >= 60 ? "warning" : "critical",
        title: `Document coverage: ${coveragePct}%`,
        detail: `${expectedFilenames.size - missing.length} / ${expectedFilenames.size} recommended documents exist.`,
        recommendation: coveragePct < 100 ? "Run 'codepliant go' to reach 100% coverage." : undefined,
      });
    } else {
      findings.push({
        category: "docs",
        severity: "critical",
        title: "No output directory",
        detail: `Output directory (${path.basename(absOutputDir)}/) does not exist.`,
        recommendation: "Run 'codepliant go' to scan and generate documents.",
      });
    }

    // ── 3. Document Freshness ──────────────────────────────────────
    if (fs.existsSync(absOutputDir)) {
      try {
        const docDiff = diffDocuments(generatedDocs, absOutputDir);
        if (docDiff.hasChanges) {
          const staleCount = docDiff.changes.length;
          findings.push({
            category: "freshness",
            severity: staleCount > 10 ? "critical" : "warning",
            title: `${staleCount} document(s) are stale`,
            detail: `These documents differ from what would be generated now: ${docDiff.changes.slice(0, 5).map(c => c.filename).join(", ")}${staleCount > 5 ? "..." : ""}`,
            recommendation: "Run 'codepliant go' or 'codepliant update' to refresh documents.",
          });
        } else {
          findings.push({ category: "freshness", severity: "pass", title: "All documents are fresh", detail: "Generated documents match what the current scan would produce." });
        }
      } catch {
        findings.push({ category: "freshness", severity: "warning", title: "Freshness check failed", detail: "Could not compare existing documents with expected output." });
      }

      // Check file ages
      try {
        const mdFiles = fs.readdirSync(absOutputDir).filter(f => f.endsWith(".md"));
        const now = Date.now();
        const oldFiles = mdFiles.filter(f => {
          const stat = fs.statSync(path.join(absOutputDir, f));
          return (now - stat.mtimeMs) > 90 * 24 * 60 * 60 * 1000; // > 90 days old
        });
        if (oldFiles.length > 0) {
          findings.push({
            category: "freshness",
            severity: "warning",
            title: `${oldFiles.length} document(s) older than 90 days`,
            detail: `Files not modified in 90+ days: ${oldFiles.slice(0, 5).join(", ")}${oldFiles.length > 5 ? "..." : ""}`,
            recommendation: "Regenerate documents to keep them current.",
          });
        } else if (mdFiles.length > 0) {
          findings.push({ category: "freshness", severity: "pass", title: "All documents modified within 90 days", detail: "No stale files detected." });
        }
      } catch { /* ignore stat errors */ }
    }

    // ── 4. Score Trend ─────────────────────────────────────────────
    const currentScore = computeComplianceScore(scanResult, absOutputDir);
    findings.push({
      category: "score",
      severity: currentScore >= 80 ? "pass" : currentScore >= 50 ? "warning" : "critical",
      title: `Compliance score: ${currentScore}/100`,
      detail: currentScore >= 80 ? "Good compliance posture." : currentScore >= 50 ? "Moderate compliance — some documents may be missing." : "Low compliance — significant gaps detected.",
      recommendation: currentScore < 80 ? "Generate missing documents and ensure config is complete." : undefined,
    });

    // Check score history file
    const scoreHistoryPath = path.join(absProjectPath, ".codepliant", "score-history.json");
    if (fs.existsSync(scoreHistoryPath)) {
      try {
        const history = JSON.parse(fs.readFileSync(scoreHistoryPath, "utf-8"));
        if (Array.isArray(history) && history.length >= 2) {
          const prev = history[history.length - 2];
          const delta = currentScore - (prev.score || 0);
          findings.push({
            category: "score",
            severity: delta >= 0 ? "pass" : "warning",
            title: `Score trend: ${delta >= 0 ? "+" : ""}${delta} since last scan`,
            detail: `Previous score: ${prev.score}/100 on ${prev.date || "unknown date"}.`,
            recommendation: delta < 0 ? "Investigate why compliance score has declined." : undefined,
          });
        }
      } catch { /* ignore parse errors */ }
    }
  }

  // ── Compute overall grade ────────────────────────────────────────
  const criticalCount = findings.filter(f => f.severity === "critical").length;
  const warningCount = findings.filter(f => f.severity === "warning").length;
  const passCount = findings.filter(f => f.severity === "pass").length;

  let overallGrade = "A";
  if (criticalCount > 0) overallGrade = "F";
  else if (warningCount > 5) overallGrade = "C";
  else if (warningCount > 2) overallGrade = "B";
  else if (warningCount > 0) overallGrade = "B+";

  // ── Print to console ─────────────────────────────────────────────
  for (const f of findings) {
    let icon: string;
    switch (f.severity) {
      case "pass": icon = `${GREEN()}✓${RESET()}`; break;
      case "warning": icon = `${YELLOW()}⚠${RESET()}`; break;
      case "critical": icon = `${RED()}✗${RESET()}`; break;
    }
    console.log(`  ${icon} ${f.title}`);
    if (f.severity !== "pass") {
      console.log(`    ${DIM()}${f.detail}${RESET()}`);
      if (f.recommendation) console.log(`    ${CYAN()}→ ${f.recommendation}${RESET()}`);
    }
  }

  console.log();
  console.log(`${BOLD()}Audit Summary:${RESET()} ${GREEN()}${passCount} pass${RESET()} / ${YELLOW()}${warningCount} warning${RESET()} / ${RED()}${criticalCount} critical${RESET()}`);
  console.log(`${BOLD()}Overall Grade:${RESET()} ${overallGrade}\n`);

  // ── Generate AUDIT_REPORT.md ─────────────────────────────────────
  const reportLines: string[] = [
    `# Compliance Audit Report`,
    ``,
    `**Project:** ${scanResult?.projectName || path.basename(absProjectPath)}`,
    `**Audit Date:** ${auditDate}`,
    `**Audit Timestamp:** ${auditTimestamp}`,
    `**Overall Grade:** ${overallGrade}`,
    `**Findings:** ${passCount} pass, ${warningCount} warning(s), ${criticalCount} critical`,
    ``,
    `---`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Overall Grade | **${overallGrade}** |`,
    `| Pass | ${passCount} |`,
    `| Warnings | ${warningCount} |`,
    `| Critical | ${criticalCount} |`,
    `| Services Detected | ${scanResult?.services.length || 0} |`,
    `| Documents Expected | ${generatedDocs?.length || 0} |`,
    ``,
    `---`,
    ``,
  ];

  // Group findings by category
  const categories: Array<{ key: string; label: string }> = [
    { key: "config", label: "Configuration Completeness" },
    { key: "docs", label: "Document Completeness" },
    { key: "coverage", label: "Coverage" },
    { key: "freshness", label: "Document Freshness" },
    { key: "score", label: "Compliance Score" },
  ];

  for (const cat of categories) {
    const catFindings = findings.filter(f => f.category === cat.key);
    if (catFindings.length === 0) continue;

    reportLines.push(`## ${cat.label}`);
    reportLines.push(``);

    for (const f of catFindings) {
      const icon = f.severity === "pass" ? "PASS" : f.severity === "warning" ? "WARNING" : "CRITICAL";
      reportLines.push(`### ${icon}: ${f.title}`);
      reportLines.push(``);
      reportLines.push(f.detail);
      if (f.recommendation) {
        reportLines.push(``);
        reportLines.push(`**Recommendation:** ${f.recommendation}`);
      }
      reportLines.push(``);
    }

    reportLines.push(`---`);
    reportLines.push(``);
  }

  // Action items summary
  const actionItems = findings.filter(f => f.recommendation);
  if (actionItems.length > 0) {
    reportLines.push(`## Action Items`);
    reportLines.push(``);
    for (const [i, f] of actionItems.entries()) {
      const priority = f.severity === "critical" ? "HIGH" : "MEDIUM";
      reportLines.push(`${i + 1}. **[${priority}]** ${f.recommendation}`);
    }
    reportLines.push(``);
    reportLines.push(`---`);
    reportLines.push(``);
  }

  reportLines.push(`*This audit report was generated by [Codepliant](https://github.com/joechensmartz/codepliant) on ${auditDate}. It is an automated self-assessment and should be supplemented by human review.*`);

  // Write the report
  if (!fs.existsSync(absOutputDir)) {
    fs.mkdirSync(absOutputDir, { recursive: true });
  }
  const reportPath = path.join(absOutputDir, "AUDIT_REPORT.md");
  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf-8");

  console.log(`${GREEN()}Audit report written to ${reportPath}${RESET()}\n`);

  if (jsonOutput) {
    console.log(JSON.stringify({ grade: overallGrade, pass: passCount, warnings: warningCount, critical: criticalCount, findings }, null, 2));
  }
}

// --- `codepliant completeness` command ---

/**
 * All document types that codepliant can generate — the "recommended set".
 * This list drives the completeness command.
 */
const ALL_RECOMMENDED_DOCS = [
  "PRIVACY_POLICY.md",
  "TERMS_OF_SERVICE.md",
  "SECURITY.md",
  "INCIDENT_RESPONSE_PLAN.md",
  "AI_DISCLOSURE.md",
  "AI_ACT_CHECKLIST.md",
  "AI_MODEL_CARD.md",
  "COOKIE_POLICY.md",
  "CONSENT_MANAGEMENT_GUIDE.md",
  "DATA_PROCESSING_AGREEMENT.md",
  "SUBPROCESSOR_LIST.md",
  "DATA_RETENTION_POLICY.md",
  "DSAR_HANDLING_GUIDE.md",
  "VENDOR_CONTACTS.md",
  "DATA_FLOW_MAP.md",
  "COMPLIANCE_NOTES.md",
  "COMPLIANCE_TIMELINE.md",
  "SOC2_READINESS_CHECKLIST.md",
  "ISO_27001_CHECKLIST.md",
  "THIRD_PARTY_RISK_ASSESSMENT.md",
  "PRIVACY_IMPACT_ASSESSMENT.md",
  "ENV_AUDIT.md",
  "DATA_CLASSIFICATION.md",
  "VULNERABILITY_SCAN.md",
  "EMPLOYEE_PRIVACY_NOTICE.md",
  "REGULATORY_UPDATES.md",
  "TRANSPARENCY_REPORT.md",
  "ACCEPTABLE_USE_POLICY.md",
  "REFUND_POLICY.md",
  "SERVICE_LEVEL_AGREEMENT.md",
  "DATA_FLOW_DIAGRAM.md",
  "AUDIT_LOG_POLICY.md",
  "ACCEPTABLE_AI_USE_POLICY.md",
  "RISK_REGISTER.md",
  "LICENSE_COMPLIANCE.md",
  "WHISTLEBLOWER_POLICY.md",
  "RECORD_OF_PROCESSING_ACTIVITIES.md",
  "TRANSFER_IMPACT_ASSESSMENT.md",
  "DATA_DICTIONARY.md",
  "ACCESS_CONTROL_POLICY.md",
  "CHANGE_MANAGEMENT_POLICY.md",
  "DATA_BREACH_NOTIFICATION_TEMPLATE.md",
  "VENDOR_SECURITY_QUESTIONNAIRE.md",
  "API_PRIVACY_DOCUMENTATION.md",
  "SUPPLIER_CODE_OF_CONDUCT.md",
  "PRIVACY_BY_DESIGN_CHECKLIST.md",
  "PENTEST_SCOPE.md",
  "COOKIE_INVENTORY.md",
  "AI_GOVERNANCE_FRAMEWORK.md",
  "BUSINESS_CONTINUITY_PLAN.md",
  "ENCRYPTION_POLICY.md",
  "BACKUP_POLICY.md",
  "DISASTER_RECOVERY_PLAN.md",
  "INFORMATION_SECURITY_POLICY.md",
  "DATA_SUBJECT_CATEGORIES.md",
  "LAWFUL_BASIS_ASSESSMENT.md",
  "ANNUAL_REVIEW_CHECKLIST.md",
  "SUBPROCESSOR_CHANGE_NOTIFICATION.md",
  "DATA_PROTECTION_POLICY.md",
  "MEDIA_CONSENT_FORM.md",
  "COMPLIANCE_CERTIFICATE.md",
  "RESPONSIBLE_DISCLOSURE_POLICY.md",
  "API_TERMS_OF_USE.md",
  "OPEN_SOURCE_NOTICE.md",
  "THIRD_PARTY_COOKIE_NOTICE.md",
  "DATA_PORTABILITY_GUIDE.md",
  "AI_TRAINING_DATA_NOTICE.md",
  "EMPLOYEE_HANDBOOK_PRIVACY_SECTION.md",
  "VENDOR_ONBOARDING_CHECKLIST.md",
  "EXECUTIVE_DASHBOARD.md",
  "PRIVACY_NOTICE_SHORT.md",
  "COOKIE_CONSENT_CONFIG.json",
  "QUICK_START_COMPLIANCE_GUIDE.md",
  "COMPLIANCE_ROADMAP.md",
  "PRIVACY_DASHBOARD_CONFIG.json",
  "DPO_HANDBOOK.md",
  "INCIDENT_COMMUNICATION_TEMPLATES.md",
  "TRAINING_RECORD.md",
  "CONSENT_RECORD_TEMPLATE.md",
  "DATA_DELETION_PROCEDURES.md",
  "SECURITY_AWARENESS_PROGRAM.md",
  "PRIVACY_RISK_MATRIX.md",
  "DATA_MAPPING_REGISTER.md",
  "AI_ETHICS_STATEMENT.md",
  "DATA_BREACH_DRILL_TEMPLATE.md",
  "COMPLIANCE_MATURITY_MODEL.md",
  "REGULATORY_CORRESPONDENCE_LOG.md",
  "PRIVACY_POLICY_CHANGELOG.md",
  "COMPLIANCE_GAP_ANALYSIS.md",
  "KEY_PERSON_RISK_ASSESSMENT.md",
];

const DOC_PRIORITY: Record<string, "critical" | "high" | "medium" | "low"> = {
  "PRIVACY_POLICY.md": "critical",
  "TERMS_OF_SERVICE.md": "critical",
  "SECURITY.md": "critical",
  "INCIDENT_RESPONSE_PLAN.md": "critical",
  "DATA_PROCESSING_AGREEMENT.md": "critical",
  "DATA_RETENTION_POLICY.md": "high",
  "DSAR_HANDLING_GUIDE.md": "high",
  "COOKIE_POLICY.md": "high",
  "ACCESS_CONTROL_POLICY.md": "high",
  "RECORD_OF_PROCESSING_ACTIVITIES.md": "high",
  "DATA_DELETION_PROCEDURES.md": "high",
  "DATA_BREACH_NOTIFICATION_TEMPLATE.md": "high",
  "ENCRYPTION_POLICY.md": "high",
  "INFORMATION_SECURITY_POLICY.md": "high",
  "BACKUP_POLICY.md": "medium",
  "DISASTER_RECOVERY_PLAN.md": "medium",
  "BUSINESS_CONTINUITY_PLAN.md": "medium",
  "CHANGE_MANAGEMENT_POLICY.md": "medium",
  "RISK_REGISTER.md": "medium",
  "COMPLIANCE_ROADMAP.md": "medium",
  "SECURITY_AWARENESS_PROGRAM.md": "medium",
  "TRAINING_RECORD.md": "medium",
  "AI_ETHICS_STATEMENT.md": "medium",
  "DATA_BREACH_DRILL_TEMPLATE.md": "medium",
  "REGULATORY_CORRESPONDENCE_LOG.md": "medium",
  "PRIVACY_POLICY_CHANGELOG.md": "medium",
  "COMPLIANCE_SUMMARY_EMAIL.md": "high",
  "COMPLIANCE_GAP_ANALYSIS.md": "high",
  "KEY_PERSON_RISK_ASSESSMENT.md": "medium",
  "COMPLIANCE_BUDGET_TEMPLATE.md": "medium",
  "INCIDENT_SEVERITY_MATRIX.md": "high",
};

function runCompleteness(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  if (!quiet) printBanner();

  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  // What codepliant would generate for this project
  const generatedFilenames = new Set(docs.map((d) => d.filename));

  // What already exists on disk
  const existingFilenames = new Set<string>();
  if (fs.existsSync(absOutputDir)) {
    for (const f of fs.readdirSync(absOutputDir)) {
      existingFilenames.add(f);
    }
  }

  // Recommended = what codepliant generates for this project (context-aware)
  const recommended = [...generatedFilenames];
  const existing = recommended.filter((f) => existingFilenames.has(f));
  const missing = recommended.filter((f) => !existingFilenames.has(f));

  const pct = recommended.length > 0
    ? Math.round((existing.length / recommended.length) * 100)
    : 0;

  if (jsonOutput) {
    console.log(JSON.stringify({
      recommended: recommended.length,
      existing: existing.length,
      missing: missing.length,
      percentage: pct,
      missingDocs: missing.map((f) => ({
        filename: f,
        priority: DOC_PRIORITY[f] || "low",
      })),
    }, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}Document Completeness${RESET()}\n`);
  console.log(`  You have ${GREEN()}${BOLD()}${existing.length}/${recommended.length}${RESET()} recommended documents (${BOLD()}${pct}%${RESET()})\n`);

  // Progress bar
  const barWidth = 40;
  const filled = Math.round((pct / 100) * barWidth);
  const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);
  const barColor = pct >= 80 ? GREEN() : pct >= 50 ? YELLOW() : RED();
  console.log(`  ${barColor}${bar}${RESET()} ${pct}%\n`);

  if (missing.length > 0) {
    console.log(`${BOLD()}Missing documents:${RESET()}\n`);

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const sorted = missing.sort((a, b) => {
      const pa = priorityOrder[DOC_PRIORITY[a] || "low"];
      const pb = priorityOrder[DOC_PRIORITY[b] || "low"];
      return pa - pb;
    });

    for (const f of sorted) {
      const priority = DOC_PRIORITY[f] || "low";
      let icon: string;
      let color: string;
      switch (priority) {
        case "critical": icon = "🔴"; color = RED(); break;
        case "high": icon = "🟠"; color = YELLOW(); break;
        case "medium": icon = "🟡"; color = DIM(); break;
        default: icon = "⚪"; color = DIM(); break;
      }
      console.log(`  ${icon} ${color}${f}${RESET()} ${DIM()}(${priority})${RESET()}`);
    }

    console.log(`\n${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate all missing documents.${RESET()}`);
  } else {
    console.log(`${GREEN()}${BOLD()}All recommended documents are present!${RESET()}`);
  }

  console.log();
  process.exit(0);
}

// --- `codepliant migrate` command ---

/**
 * Documents added in each version range. Used by the migrate command
 * to show what's new when upgrading.
 */
const VERSION_HISTORY: Array<{
  version: string;
  docs: Array<{ filename: string; name: string; description: string }>;
}> = [
  {
    version: "350.0.0",
    docs: [
      { filename: "COMPLIANCE_BUDGET_TEMPLATE.md", name: "Compliance Budget Template", description: "Estimated annual costs for compliance program — tools, legal, training, audit, insurance — scaled by detected services and jurisdictions" },
      { filename: "INCIDENT_SEVERITY_MATRIX.md", name: "Incident Severity Matrix", description: "P0-P4 severity levels with response times, escalation paths, communication requirements, and per-service impact assessment" },
    ],
  },
  {
    version: "330.0.0",
    docs: [
      { filename: "COMPLIANCE_GAP_ANALYSIS.md", name: "Compliance Gap Analysis", description: "Current state vs target state per regulation with gap table and remediation roadmap" },
      { filename: "KEY_PERSON_RISK_ASSESSMENT.md", name: "Key Person Risk Assessment", description: "Single points of failure for compliance knowledge — DPO, security lead, incident responder — with cross-training recommendations" },
    ],
  },
  {
    version: "300.0.0",
    docs: [
      { filename: "COMPLIANCE_SUMMARY_EMAIL.md", name: "Compliance Summary Email", description: "Email-ready compliance status summary for stakeholders, board members, and executives" },
    ],
  },
  {
    version: "280.0.0",
    docs: [
      { filename: "REGULATORY_CORRESPONDENCE_LOG.md", name: "Regulatory Correspondence Log", description: "Track communications with regulatory authorities — date, authority, topic, outcome, follow-up" },
      { filename: "PRIVACY_POLICY_CHANGELOG.md", name: "Privacy Policy Changelog", description: "Track all privacy policy changes over time, GDPR material change notifications" },
    ],
  },
  {
    version: "270.0.0",
    docs: [
      { filename: "AI_ETHICS_STATEMENT.md", name: "AI Ethics Statement", description: "UNESCO-aligned AI ethics principles, fairness, transparency, human oversight" },
      { filename: "DATA_BREACH_DRILL_TEMPLATE.md", name: "Data Breach Response Drill", description: "Tabletop exercise template with scenarios, roles, timeline, evaluation criteria" },
    ],
  },
  {
    version: "241.0.0",
    docs: [
      { filename: "DATA_DELETION_PROCEDURES.md", name: "Data Deletion Procedures", description: "Per-service GDPR Art. 17 right to erasure instructions" },
      { filename: "SECURITY_AWARENESS_PROGRAM.md", name: "Security Awareness Program", description: "Employee security training program with phishing, password hygiene, incident reporting" },
    ],
  },
  {
    version: "200.0.0",
    docs: [
      { filename: "DPO_HANDBOOK.md", name: "DPO Handbook", description: "Guide for appointed Data Protection Officers" },
      { filename: "INCIDENT_COMMUNICATION_TEMPLATES.md", name: "Incident Communication Templates", description: "Pre-written templates for incident lifecycle" },
      { filename: "TRAINING_RECORD.md", name: "Training Record", description: "GDPR Art. 39(1)(b) staff training record" },
      { filename: "CONSENT_RECORD_TEMPLATE.md", name: "Consent Record Template", description: "GDPR Art. 7 consent evidence logging" },
    ],
  },
  {
    version: "180.0.0",
    docs: [
      { filename: "EXECUTIVE_DASHBOARD.md", name: "Executive Dashboard", description: "One-page C-suite compliance overview" },
      { filename: "PRIVACY_NOTICE_SHORT.md", name: "Privacy Notice (Short)", description: "One-page simplified privacy notice" },
      { filename: "COOKIE_CONSENT_CONFIG.json", name: "Cookie Consent Configuration", description: "Machine-readable CMP config" },
      { filename: "QUICK_START_COMPLIANCE_GUIDE.md", name: "Quick Start Guide", description: "Personalized compliance quick start" },
      { filename: "COMPLIANCE_ROADMAP.md", name: "Compliance Roadmap", description: "Phased implementation plan" },
      { filename: "PRIVACY_DASHBOARD_CONFIG.json", name: "Privacy Dashboard Config", description: "Machine-readable 'My Data' page config" },
    ],
  },
];

function runMigrate(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  if (!quiet) printBanner();

  // Check what's on disk
  const existingFilenames = new Set<string>();
  if (fs.existsSync(absOutputDir)) {
    for (const f of fs.readdirSync(absOutputDir)) {
      existingFilenames.add(f);
    }
  }

  // Find document types that exist in our catalog but not on disk
  const newDocs: Array<{
    version: string;
    filename: string;
    name: string;
    description: string;
  }> = [];

  for (const entry of VERSION_HISTORY) {
    for (const doc of entry.docs) {
      if (!existingFilenames.has(doc.filename)) {
        newDocs.push({ version: entry.version, ...doc });
      }
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify({
      currentVersion: VERSION,
      newDocumentTypes: newDocs.length,
      docs: newDocs,
    }, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}Codepliant Migration Guide${RESET()}`);
  console.log(`${DIM()}Current version: v${VERSION}${RESET()}\n`);

  if (newDocs.length === 0) {
    console.log(`${GREEN()}${BOLD()}You're up to date!${RESET()} All available document types have been generated.\n`);
    console.log(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to regenerate and pick up any content improvements.${RESET()}\n`);
    process.exit(0);
  }

  console.log(`${BOLD()}${newDocs.length} new document type(s) available:${RESET()}\n`);

  let lastVersion = "";
  for (const doc of newDocs) {
    if (doc.version !== lastVersion) {
      console.log(`  ${CYAN()}${BOLD()}v${doc.version}${RESET()}`);
      lastVersion = doc.version;
    }
    console.log(`    ${GREEN()}+${RESET()} ${BOLD()}${doc.name}${RESET()} ${DIM()}(${doc.filename})${RESET()}`);
    console.log(`      ${DIM()}${doc.description}${RESET()}`);
  }

  console.log(`\n${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate all new document types.${RESET()}`);
  console.log(`${DIM()}Run ${CYAN()}codepliant update${RESET()}${DIM()} to regenerate and see what changed.${RESET()}\n`);
  process.exit(0);
}

// --- `codepliant version-check` command ---

function runVersionCheck(quiet: boolean, jsonOutput: boolean) {
  if (!quiet && !jsonOutput) printBanner();

  const currentVersion = VERSION;

  // Attempt to check npm registry (offline-safe: if fetch fails, just show current version)
  let latestVersion: string | null = null;
  let updateAvailable = false;

  try {
    const { execSync } = require("child_process");
    const result = execSync("npm view codepliant version 2>/dev/null", {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
    if (result && /^\d+\.\d+\.\d+/.test(result)) {
      latestVersion = result;
      // Simple version comparison (works for semver with numeric-only parts)
      const currentParts = currentVersion.split(".").map(Number);
      const latestParts = latestVersion!.split(".").map(Number);
      for (let i = 0; i < 3; i++) {
        if ((latestParts[i] || 0) > (currentParts[i] || 0)) {
          updateAvailable = true;
          break;
        } else if ((latestParts[i] || 0) < (currentParts[i] || 0)) {
          break;
        }
      }
    }
  } catch {
    // Offline or npm not available — that's fine
  }

  if (jsonOutput) {
    console.log(JSON.stringify({
      currentVersion,
      latestVersion: latestVersion || "unknown",
      updateAvailable,
    }, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}Version Check${RESET()}\n`);
  console.log(`  ${BOLD()}Current version:${RESET()} v${currentVersion}`);

  if (latestVersion) {
    console.log(`  ${BOLD()}Latest version:${RESET()}  v${latestVersion}`);
    if (updateAvailable) {
      console.log(`\n  ${YELLOW()}${BOLD()}Update available!${RESET()} Run ${CYAN()}npm install -g codepliant${RESET()} to upgrade.`);
    } else {
      console.log(`\n  ${GREEN()}${BOLD()}You're up to date!${RESET()}`);
    }
  } else {
    console.log(`  ${DIM()}Latest version:  Unable to check (offline or npm not available)${RESET()}`);
    console.log(`\n  ${DIM()}Run ${CYAN()}npm outdated -g codepliant${RESET()}${DIM()} when online to check for updates.${RESET()}`);
  }

  console.log();
  process.exit(0);
}

// --- `codepliant certify` command ---

function runCertify(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);

  if (result.services.length === 0) {
    console.error(`${RED()}[CP030] No services detected — nothing to certify.${RESET()}`);
    process.exit(1);
  }

  const plugins = config?.plugins ? loadPlugins(absProjectPath, config.plugins) : [];
  const docs = generateDocuments(result, config || undefined, plugins);

  // Compute score
  const scoreInput: ScoreInput = {
    scanResult: result,
    docs,
    config: config || undefined,
    outputDir: absOutputDir,
  };
  const fullScore = computeFullComplianceScore(scoreInput);
  const score = { total: fullScore.total, grade: fullScore.grade };

  const company = config?.companyName || "[Your Company Name]";
  const date = new Date().toISOString().split("T")[0];
  const certId = `CODEPLIANT-${date.replace(/-/g, "")}-${result.projectName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 12)}`;

  // Deduplicate services
  const seenServices = new Set<string>();
  const uniqueServices: Array<{ name: string; category: string }> = [];
  for (const svc of result.services) {
    if (!seenServices.has(svc.name)) {
      seenServices.add(svc.name);
      uniqueServices.push({ name: svc.name, category: svc.category });
    }
  }

  if (jsonOutput) {
    console.log(JSON.stringify({
      certificateId: certId,
      date,
      company,
      project: result.projectName,
      score: score.total,
      grade: score.grade,
      documentsGenerated: docs.length,
      servicesCovered: uniqueServices.length,
      services: uniqueServices.map((s) => ({ name: s.name, category: s.category })),
    }, null, 2));
    process.exit(0);
  }

  // Write the certificate file
  if (!fs.existsSync(absOutputDir)) {
    fs.mkdirSync(absOutputDir, { recursive: true });
  }

  // Find the certificate doc from generated docs
  const certDoc = docs.find((d) => d.filename === "COMPLIANCE_CERTIFICATE.md");
  if (certDoc) {
    const certPath = path.join(absOutputDir, "COMPLIANCE_CERTIFICATE.md");
    fs.writeFileSync(certPath, certDoc.content, "utf-8");
  }

  // Display the certificate summary
  console.log(`${BOLD()}Compliance Certificate${RESET()}\n`);
  console.log(`  ${DIM()}Certificate ID:${RESET()}  ${CYAN()}${certId}${RESET()}`);
  console.log(`  ${DIM()}Date:${RESET()}            ${date}`);
  console.log(`  ${DIM()}Company:${RESET()}         ${company}`);
  console.log(`  ${DIM()}Project:${RESET()}         ${result.projectName}`);
  console.log();
  console.log(`  ${BOLD()}Score:${RESET()}           ${score.total >= 80 ? GREEN() : score.total >= 60 ? YELLOW() : RED()}${score.total}/100 (${score.grade})${RESET()}`);
  console.log(`  ${BOLD()}Documents:${RESET()}       ${docs.length}`);
  console.log(`  ${BOLD()}Services:${RESET()}        ${uniqueServices.length}`);
  console.log();

  // Service list
  console.log(`  ${BOLD()}Services Covered:${RESET()}`);
  for (const svc of uniqueServices) {
    console.log(`    ${GREEN()}✓${RESET()} ${svc.name} ${DIM()}(${svc.category})${RESET()}`);
  }
  console.log();

  if (certDoc) {
    const certPath = path.join(absOutputDir, "COMPLIANCE_CERTIFICATE.md");
    console.log(`  ${GREEN()}✓${RESET()} Certificate written to ${CYAN()}${certPath}${RESET()}`);
  }
  console.log(`\n  ${DIM()}Share this certificate with partners, auditors, or customers.${RESET()}`);
  console.log(`  ${DIM()}This is a self-attestation — not a legal certification.${RESET()}\n`);

  process.exit(0);
}

// --- `codepliant changelog` command ---

const CODEPLIANT_CHANGELOG: Array<{
  version: string;
  date: string;
  highlights: string[];
}> = [
  {
    version: "400.0.0",
    date: "2026-03-16",
    highlights: [
      "MILESTONE v400: 330 versions built overnight",
      "Executive Briefing generator — one-page C-suite briefing with compliance gauge",
      "codepliant certify command — generate dated compliance certificate for partners",
      "105+ document types, 787 tests, 55+ CLI commands",
    ],
  },
  {
    version: "300.0.0",
    date: "2026-03-16",
    highlights: [
      "FINAL MILESTONE: v300",
      "Compliance Summary Email generator for stakeholder/board distribution",
      "changelog command — view codepliant version history",
      "90+ document types, 50+ CLI commands, 1200+ repos tested",
    ],
  },
  {
    version: "290.0.0",
    date: "2026-03-16",
    highlights: [
      "Privacy Program Charter generator",
      "Third-Party Due Diligence Template generator",
      "Compliance Maturity Model with 5-level auto-assessment",
    ],
  },
  {
    version: "280.0.0",
    date: "2026-03-16",
    highlights: [
      "Regulatory Correspondence Log generator",
      "Privacy Policy Changelog generator",
    ],
  },
  {
    version: "270.0.0",
    date: "2026-03-16",
    highlights: [
      "AI Ethics Statement (UNESCO-aligned)",
      "Data Breach Response Drill template",
      "version-check command",
      "list-docs command",
    ],
  },
  {
    version: "250.0.0",
    date: "2026-03-16",
    highlights: [
      "Data Deletion Procedures generator",
      "Security Awareness Program generator",
      "Privacy Risk Matrix generator",
      "Data Mapping Register generator",
    ],
  },
  {
    version: "200.0.0",
    date: "2026-03-16",
    highlights: [
      "DPO Handbook generator",
      "Incident Communication Templates",
      "Training Record generator",
      "Consent Record Template",
    ],
  },
  {
    version: "180.0.0",
    date: "2026-03-16",
    highlights: [
      "Executive Dashboard generator",
      "Privacy Notice (Short) for in-app display",
      "Cookie Consent Config (JSON) for CMP integration",
      "Compliance Roadmap generator",
      "Environment scanner",
      "validate command",
    ],
  },
  {
    version: "150.0.0",
    date: "2026-03-16",
    highlights: [
      "MCP server for Claude Code / Cursor integration",
      "GitHub Actions integration",
      "Plugin system for custom generators",
      "Custom template engine",
    ],
  },
  {
    version: "100.0.0",
    date: "2026-03-16",
    highlights: [
      "50+ document types",
      "10+ ecosystem support (JS, Python, Go, Ruby, Elixir, PHP, Rust, Java, .NET, Django)",
      "Cloud provider scanning (AWS, GCP, Azure)",
      "CI/CD scanning (GitHub Actions, GitLab CI, CircleCI)",
    ],
  },
  {
    version: "70.0.0",
    date: "2026-03-16",
    highlights: [
      "Initial overnight build started",
      "Core scanners: dependencies, imports, env, schema",
      "Core generators: Privacy Policy, Terms of Service, AI Disclosure, Cookie Policy, DPA",
      "Scoring engine with per-regulation breakdown",
    ],
  },
];

function runChangelog(quiet: boolean, jsonOutput: boolean) {
  if (!quiet && !jsonOutput) printBanner();

  if (jsonOutput) {
    console.log(JSON.stringify({
      currentVersion: VERSION,
      entries: CODEPLIANT_CHANGELOG,
    }, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}Codepliant Changelog${RESET()} ${DIM()}(last 10 versions)${RESET()}\n`);

  for (const entry of CODEPLIANT_CHANGELOG) {
    const isCurrent = entry.version === VERSION;
    const marker = isCurrent ? ` ${GREEN()}${BOLD()}(current)${RESET()}` : "";
    console.log(`  ${CYAN()}${BOLD()}v${entry.version}${RESET()}${marker} ${DIM()}— ${entry.date}${RESET()}`);
    for (const h of entry.highlights) {
      console.log(`    ${GREEN()}+${RESET()} ${h}`);
    }
    console.log();
  }

  console.log(`${DIM()}Showing last 10 major versions. Full changelog: https://github.com/joechensmartz/codepliant/blob/main/CHANGELOG.md${RESET()}\n`);
  process.exit(0);
}

// --- `codepliant list-docs` command ---

function runListDocs(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  // What codepliant would generate for this project
  const generatedFilenames = new Map<string, string>();
  for (const doc of docs) {
    generatedFilenames.set(doc.filename, doc.name);
  }

  // What already exists on disk
  const existingFilenames = new Set<string>();
  if (fs.existsSync(absOutputDir)) {
    for (const f of fs.readdirSync(absOutputDir)) {
      existingFilenames.add(f);
    }
  }

  // Complete catalog of ALL document types codepliant can generate
  const ALL_DOCUMENT_TYPES: Array<{ filename: string; name: string; conditional: string }> = [
    { filename: "PRIVACY_POLICY.md", name: "Privacy Policy", conditional: "When services detected" },
    { filename: "TERMS_OF_SERVICE.md", name: "Terms of Service", conditional: "Always" },
    { filename: "SECURITY.md", name: "Security Policy", conditional: "Always" },
    { filename: "INCIDENT_RESPONSE_PLAN.md", name: "Incident Response Plan", conditional: "Always" },
    { filename: "AI_DISCLOSURE.md", name: "AI Disclosure", conditional: "When AI services detected" },
    { filename: "AI_ACT_CHECKLIST.md", name: "AI Act Compliance Checklist", conditional: "When AI services detected" },
    { filename: "AI_MODEL_CARD.md", name: "AI Model Card", conditional: "When AI services detected" },
    { filename: "AI_GOVERNANCE_FRAMEWORK.md", name: "AI Governance Framework", conditional: "When AI services detected" },
    { filename: "AI_ETHICS_STATEMENT.md", name: "AI Ethics Statement", conditional: "When AI services detected" },
    { filename: "ACCEPTABLE_AI_USE_POLICY.md", name: "Acceptable AI Use Policy", conditional: "When AI services detected" },
    { filename: "AI_TRAINING_DATA_NOTICE.md", name: "AI Training Data Notice", conditional: "When AI services detected" },
    { filename: "COOKIE_POLICY.md", name: "Cookie Policy", conditional: "When analytics/auth detected" },
    { filename: "COOKIE_INVENTORY.md", name: "Cookie Inventory", conditional: "When analytics detected" },
    { filename: "COOKIE_CONSENT_CONFIG.json", name: "Cookie Consent Configuration", conditional: "When analytics detected" },
    { filename: "THIRD_PARTY_COOKIE_NOTICE.md", name: "Third-Party Cookie Notice", conditional: "When third-party analytics detected" },
    { filename: "CONSENT_MANAGEMENT_GUIDE.md", name: "Consent Management Guide", conditional: "When analytics/advertising detected" },
    { filename: "DATA_PROCESSING_AGREEMENT.md", name: "Data Processing Agreement", conditional: "When third-party processors detected" },
    { filename: "SUBPROCESSOR_LIST.md", name: "Sub-Processor List", conditional: "When 3+ third-party services detected" },
    { filename: "SUBPROCESSOR_CHANGE_NOTIFICATION.md", name: "Sub-Processor Change Notification", conditional: "When third-party services detected" },
    { filename: "DATA_RETENTION_POLICY.md", name: "Data Retention Policy", conditional: "When 3+ services detected" },
    { filename: "DSAR_HANDLING_GUIDE.md", name: "DSAR Handling Guide", conditional: "When services detected" },
    { filename: "DATA_FLOW_MAP.md", name: "Data Flow Map", conditional: "When services detected" },
    { filename: "DATA_FLOW_DIAGRAM.md", name: "Data Flow Diagram", conditional: "When services detected" },
    { filename: "DATA_CLASSIFICATION.md", name: "Data Classification Report", conditional: "When data detected" },
    { filename: "DATA_DICTIONARY.md", name: "Data Dictionary", conditional: "When data detected" },
    { filename: "DATA_SUBJECT_CATEGORIES.md", name: "Data Subject Categories", conditional: "When services detected" },
    { filename: "DATA_MAPPING_REGISTER.md", name: "Data Mapping Register", conditional: "When services detected" },
    { filename: "DATA_PROTECTION_POLICY.md", name: "Data Protection Policy", conditional: "When services detected" },
    { filename: "DATA_PORTABILITY_GUIDE.md", name: "Data Portability Guide", conditional: "When services detected" },
    { filename: "DATA_DELETION_PROCEDURES.md", name: "Data Deletion Procedures", conditional: "When services detected" },
    { filename: "DATA_BREACH_NOTIFICATION_TEMPLATE.md", name: "Data Breach Notification Templates", conditional: "When services detected" },
    { filename: "DATA_BREACH_DRILL_TEMPLATE.md", name: "Data Breach Response Drill Template", conditional: "When services detected" },
    { filename: "COMPLIANCE_NOTES.md", name: "Compliance Notes", conditional: "When services detected" },
    { filename: "COMPLIANCE_TIMELINE.md", name: "Compliance Timeline", conditional: "When services detected" },
    { filename: "COMPLIANCE_ROADMAP.md", name: "Compliance Roadmap", conditional: "Always" },
    { filename: "COMPLIANCE_MATURITY_MODEL.md", name: "Compliance Maturity Model", conditional: "When services detected" },
    { filename: "COMPLIANCE_CERTIFICATE.md", name: "Compliance Certificate", conditional: "After all docs generated" },
    { filename: "SOC2_READINESS_CHECKLIST.md", name: "SOC 2 Readiness Checklist", conditional: "When 5+ services detected" },
    { filename: "ISO_27001_CHECKLIST.md", name: "ISO 27001 Compliance Checklist", conditional: "When 5+ services detected" },
    { filename: "THIRD_PARTY_RISK_ASSESSMENT.md", name: "Third-Party Risk Assessment", conditional: "When 3+ third-party services detected" },
    { filename: "PRIVACY_IMPACT_ASSESSMENT.md", name: "Privacy Impact Assessment", conditional: "When AI or analytics detected" },
    { filename: "PRIVACY_BY_DESIGN_CHECKLIST.md", name: "Privacy by Design Checklist", conditional: "When services detected" },
    { filename: "PRIVACY_RISK_MATRIX.md", name: "Privacy Risk Matrix", conditional: "When services detected" },
    { filename: "PRIVACY_NOTICE_SHORT.md", name: "Privacy Notice (Short)", conditional: "When services detected" },
    { filename: "PRIVACY_DASHBOARD_CONFIG.json", name: "Privacy Dashboard Configuration", conditional: "When services detected" },
    { filename: "ENV_AUDIT.md", name: "Environment Variable Audit", conditional: "When .env files detected" },
    { filename: "VULNERABILITY_SCAN.md", name: "Dependency Vulnerability Scan", conditional: "When package manager detected" },
    { filename: "LICENSE_COMPLIANCE.md", name: "License Compliance Report", conditional: "When dependencies detected" },
    { filename: "VENDOR_CONTACTS.md", name: "Vendor Contacts Directory", conditional: "When services detected" },
    { filename: "VENDOR_SECURITY_QUESTIONNAIRE.md", name: "Vendor Security Questionnaire", conditional: "When services detected" },
    { filename: "VENDOR_ONBOARDING_CHECKLIST.md", name: "Vendor Onboarding Checklist", conditional: "When services detected" },
    { filename: "ACCEPTABLE_USE_POLICY.md", name: "Acceptable Use Policy", conditional: "Always" },
    { filename: "REFUND_POLICY.md", name: "Refund Policy", conditional: "When payment services detected" },
    { filename: "SERVICE_LEVEL_AGREEMENT.md", name: "Service Level Agreement", conditional: "When monitoring detected" },
    { filename: "AUDIT_LOG_POLICY.md", name: "Audit Log Policy", conditional: "When services detected" },
    { filename: "RISK_REGISTER.md", name: "Risk Register", conditional: "When services detected" },
    { filename: "TRANSPARENCY_REPORT.md", name: "Transparency Report", conditional: "When services detected" },
    { filename: "RECORD_OF_PROCESSING_ACTIVITIES.md", name: "Record of Processing Activities", conditional: "When services detected" },
    { filename: "TRANSFER_IMPACT_ASSESSMENT.md", name: "Transfer Impact Assessment", conditional: "When EU-to-US transfers detected" },
    { filename: "LAWFUL_BASIS_ASSESSMENT.md", name: "Lawful Basis Assessment", conditional: "When services detected" },
    { filename: "ANNUAL_REVIEW_CHECKLIST.md", name: "Annual Review Checklist", conditional: "When services detected" },
    { filename: "ACCESS_CONTROL_POLICY.md", name: "Access Control Policy", conditional: "When auth detected" },
    { filename: "CHANGE_MANAGEMENT_POLICY.md", name: "Change Management Policy", conditional: "Always" },
    { filename: "WHISTLEBLOWER_POLICY.md", name: "Whistleblower Policy", conditional: "EU jurisdictions" },
    { filename: "EMPLOYEE_PRIVACY_NOTICE.md", name: "Employee Privacy Notice", conditional: "When config enabled" },
    { filename: "EMPLOYEE_HANDBOOK_PRIVACY_SECTION.md", name: "Employee Handbook Privacy Section", conditional: "When services detected" },
    { filename: "REGULATORY_UPDATES.md", name: "Regulatory Updates", conditional: "When services detected" },
    { filename: "ENCRYPTION_POLICY.md", name: "Encryption Policy", conditional: "When databases/cloud detected" },
    { filename: "BACKUP_POLICY.md", name: "Backup Policy", conditional: "When databases detected" },
    { filename: "DISASTER_RECOVERY_PLAN.md", name: "Disaster Recovery Plan", conditional: "When cloud/CI detected" },
    { filename: "BUSINESS_CONTINUITY_PLAN.md", name: "Business Continuity Plan", conditional: "When cloud detected" },
    { filename: "INFORMATION_SECURITY_POLICY.md", name: "Information Security Policy", conditional: "When CI/CD detected" },
    { filename: "SECURITY_AWARENESS_PROGRAM.md", name: "Security Awareness Program", conditional: "When services detected" },
    { filename: "RESPONSIBLE_DISCLOSURE_POLICY.md", name: "Responsible Disclosure Policy", conditional: "When services detected" },
    { filename: "API_PRIVACY_DOCUMENTATION.md", name: "API Privacy Documentation", conditional: "When API framework detected" },
    { filename: "API_TERMS_OF_USE.md", name: "API Terms of Use", conditional: "When API framework detected" },
    { filename: "SUPPLIER_CODE_OF_CONDUCT.md", name: "Supplier Code of Conduct", conditional: "When services detected" },
    { filename: "PENTEST_SCOPE.md", name: "Penetration Test Scope", conditional: "When services detected" },
    { filename: "OPEN_SOURCE_NOTICE.md", name: "Open Source Notice", conditional: "When dependencies detected" },
    { filename: "MEDIA_CONSENT_FORM.md", name: "Media Consent Form", conditional: "When storage detected" },
    { filename: "CONSENT_RECORD_TEMPLATE.md", name: "Consent Record Template", conditional: "When services detected" },
    { filename: "TRAINING_RECORD.md", name: "Training Record", conditional: "When services detected" },
    { filename: "INCIDENT_COMMUNICATION_TEMPLATES.md", name: "Incident Communication Templates", conditional: "When services detected" },
    { filename: "DPO_HANDBOOK.md", name: "DPO Handbook", conditional: "When DPO configured" },
    { filename: "EXECUTIVE_DASHBOARD.md", name: "Executive Dashboard", conditional: "When services detected" },
    { filename: "QUICK_START_COMPLIANCE_GUIDE.md", name: "Quick Start Compliance Guide", conditional: "Always" },
    { filename: "REGULATORY_CORRESPONDENCE_LOG.md", name: "Regulatory Correspondence Log", conditional: "When services detected" },
    { filename: "PRIVACY_POLICY_CHANGELOG.md", name: "Privacy Policy Changelog", conditional: "When services detected" },
  ];

  if (jsonOutput) {
    const docList = ALL_DOCUMENT_TYPES.map((dt) => ({
      filename: dt.filename,
      name: dt.name,
      condition: dt.conditional,
      appliesTo: generatedFilenames.has(dt.filename),
      exists: existingFilenames.has(dt.filename),
    }));
    console.log(JSON.stringify({
      totalDocumentTypes: ALL_DOCUMENT_TYPES.length,
      applicableToProject: generatedFilenames.size,
      existingOnDisk: [...generatedFilenames.keys()].filter((f) => existingFilenames.has(f)).length,
      documents: docList,
    }, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}All Document Types${RESET()} (${ALL_DOCUMENT_TYPES.length} total)\n`);

  const applicableCount = generatedFilenames.size;
  const existingCount = [...generatedFilenames.keys()].filter((f) => existingFilenames.has(f)).length;
  console.log(`  ${BOLD()}Applicable to this project:${RESET()} ${applicableCount}`);
  console.log(`  ${BOLD()}Already generated:${RESET()} ${existingCount}`);
  console.log();

  for (const dt of ALL_DOCUMENT_TYPES) {
    const applies = generatedFilenames.has(dt.filename);
    const exists = existingFilenames.has(dt.filename);

    let icon: string;
    let statusText: string;
    if (exists) {
      icon = `${GREEN()}✓${RESET()}`;
      statusText = `${GREEN()}generated${RESET()}`;
    } else if (applies) {
      icon = `${YELLOW()}○${RESET()}`;
      statusText = `${YELLOW()}applicable${RESET()}`;
    } else {
      icon = `${DIM()}·${RESET()}`;
      statusText = `${DIM()}n/a${RESET()}`;
    }

    console.log(`  ${icon} ${BOLD()}${dt.name}${RESET()} ${DIM()}(${dt.filename})${RESET()}`);
    console.log(`    ${statusText} — ${DIM()}${dt.conditional}${RESET()}`);
  }

  console.log(`\n${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} to generate all applicable documents.${RESET()}\n`);
  process.exit(0);
}

// --- `codepliant clean` command ---

// --- `codepliant archive` command ---

function runArchive(absProjectPath: string, absOutputDir: string, quiet: boolean) {
  if (!quiet) printBanner();

  if (!fs.existsSync(absOutputDir)) {
    console.error(`${RED()}[CP006] Error: Output directory "${absOutputDir}" does not exist.${RESET()}`);
    console.error(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} first to generate documents.${RESET()}`);
    process.exit(1);
  }

  const files = fs.readdirSync(absOutputDir);
  const generatedFiles = files.filter((f: string) => f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".html"));

  if (generatedFiles.length === 0) {
    console.log(`${YELLOW()}No generated files found in ${absOutputDir}.${RESET()}`);
    process.exit(0);
  }

  const dateStamp = new Date().toISOString().split("T")[0];
  const archiveDirName = `legal-archive-${dateStamp}`;
  const archiveDir = path.resolve(absProjectPath, archiveDirName);

  // If archive dir already exists for today, append a counter
  let finalArchiveDir = archiveDir;
  let counter = 1;
  while (fs.existsSync(finalArchiveDir)) {
    finalArchiveDir = `${archiveDir}-${counter}`;
    counter++;
  }

  fs.mkdirSync(finalArchiveDir, { recursive: true });

  let copied = 0;
  for (const file of generatedFiles) {
    const src = path.join(absOutputDir, file);
    const dest = path.join(finalArchiveDir, file);
    fs.copyFileSync(src, dest);
    copied++;
  }

  const relativePath = path.relative(absProjectPath, finalArchiveDir);

  if (!quiet) {
    console.log(`${GREEN()}${BOLD()}Archived!${RESET()} ${copied} file(s) copied to ${relativePath}/\n`);
    console.log(`${DIM()}Contents:${RESET()}`);
    for (const file of generatedFiles) {
      console.log(`  ${DIM()}• ${file}${RESET()}`);
    }
    console.log();
    console.log(`${DIM()}You can now safely run ${CYAN()}codepliant go${RESET()}${DIM()} to regenerate fresh documents.${RESET()}\n`);
  }

  process.exit(0);
}

function runClean(absOutputDir: string, quiet: boolean, force: boolean) {
  if (!fs.existsSync(absOutputDir)) {
    console.log(`${YELLOW()}Nothing to clean — output directory does not exist.${RESET()}`);
    process.exit(0);
  }

  const files = fs.readdirSync(absOutputDir);
  const generatedFiles = files.filter((f: string) => f.endsWith(".md") || f.endsWith(".json"));

  if (generatedFiles.length === 0) {
    console.log(`${YELLOW()}No generated files found in ${absOutputDir}.${RESET()}`);
    process.exit(0);
  }

  const doClean = () => {
    for (const file of generatedFiles) {
      fs.unlinkSync(path.join(absOutputDir, file));
    }
    // Remove directory if empty
    const remaining = fs.readdirSync(absOutputDir);
    if (remaining.length === 0) {
      fs.rmdirSync(absOutputDir);
    }
    if (!quiet) {
      console.log(`${GREEN()}✓${RESET()} Removed ${generatedFiles.length} file(s) from ${path.basename(absOutputDir)}/.`);
    }
    process.exit(0);
  };

  if (force) {
    doClean();
    return;
  }

  // Confirmation prompt
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(
    `${YELLOW()}Remove ${generatedFiles.length} generated file(s) from ${path.basename(absOutputDir)}/?${RESET()} [y/N] `,
    (answer: string) => {
      rl.close();
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        doClean();
      } else {
        console.log(`${DIM()}Cancelled.${RESET()}`);
        process.exit(0);
      }
    },
  );
}

// --- `codepliant tree` command ---

function runTree(absProjectPath: string, absOutputDir: string, quiet: boolean, jsonOutput: boolean) {
  if (!quiet && !jsonOutput) printBanner();

  if (!fs.existsSync(absOutputDir)) {
    console.log(`${YELLOW()}No generated files found. Run ${CYAN()}codepliant go${RESET()}${YELLOW()} first.${RESET()}`);
    process.exit(0);
  }

  const files = fs.readdirSync(absOutputDir).filter(
    (f: string) => f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".svg") || f.endsWith(".html"),
  );

  if (files.length === 0) {
    console.log(`${YELLOW()}No generated files found in ${path.basename(absOutputDir)}/.${RESET()}`);
    process.exit(0);
  }

  // Categorize files
  const categories: Record<string, { files: { name: string; size: number }[] }> = {
    "Privacy & Data Protection": { files: [] },
    "Security": { files: [] },
    "AI & Ethics": { files: [] },
    "Legal & Terms": { files: [] },
    "Compliance Frameworks": { files: [] },
    "Operations & Governance": { files: [] },
    "Vendor & Third-Party": { files: [] },
    "Reporting & Dashboards": { files: [] },
    "Configuration": { files: [] },
  };

  const privacyKeywords = ["PRIVACY", "DATA_PROTECTION", "DATA_SUBJECT", "DATA_MAPPING", "DATA_DICTIONARY", "DATA_CLASSIFICATION", "DATA_FLOW", "DATA_RETENTION", "DATA_DELETION", "DATA_PORTABILITY", "DATA_BREACH", "DSAR", "CONSENT", "COOKIE", "RECORD_OF_PROCESSING", "LAWFUL_BASIS", "TRANSFER_IMPACT", "MEDIA_CONSENT", "PRIVACY_RISK", "PRIVACY_DASHBOARD", "PRIVACY_NOTICE", "PRIVACY_POLICY_CHANGELOG"];
  const securityKeywords = ["SECURITY", "INCIDENT", "ACCESS_CONTROL", "ENCRYPTION", "BACKUP", "DISASTER_RECOVERY", "PENETRATION", "VULNERABILITY", "RESPONSIBLE_DISCLOSURE", "AUDIT_LOG", "BUSINESS_CONTINUITY", "INFORMATION_SECURITY"];
  const aiKeywords = ["AI_", "AI_ACT", "AI_MODEL", "AI_GOVERNANCE", "AI_ETHICS", "AI_TRAINING"];
  const legalKeywords = ["TERMS_OF_SERVICE", "ACCEPTABLE_USE", "REFUND", "SLA", "SERVICE_LEVEL", "API_TERMS", "OPEN_SOURCE_NOTICE", "LICENSE_COMPLIANCE", "WHISTLEBLOWER", "DPA", "DATA_PROCESSING_AGREEMENT"];
  const frameworkKeywords = ["SOC2", "ISO_27001", "COMPLIANCE_CERTIFICATE", "COMPLIANCE_MATURITY", "COMPLIANCE_TIMELINE", "COMPLIANCE_NOTES", "COMPLIANCE_ROADMAP", "ANNUAL_REVIEW", "CHANGE_MANAGEMENT"];
  const operationsKeywords = ["DPO_HANDBOOK", "TRAINING_RECORD", "SECURITY_AWARENESS", "EMPLOYEE", "QUICK_START", "REGULATORY", "ENV_AUDIT"];
  const vendorKeywords = ["VENDOR", "SUBPROCESSOR", "SUPPLIER", "THIRD_PARTY_RISK", "THIRD_PARTY_COOKIE"];
  const reportingKeywords = ["TRANSPARENCY_REPORT", "EXECUTIVE_DASHBOARD", "RISK_REGISTER", "COMPLIANCE_REPORT", "EXECUTIVE_SUMMARY"];

  function categorize(filename: string): string {
    const upper = filename.toUpperCase();
    if (upper.endsWith(".json") || upper.endsWith(".svg")) return "Configuration";
    if (aiKeywords.some((k) => upper.includes(k))) return "AI & Ethics";
    if (vendorKeywords.some((k) => upper.includes(k))) return "Vendor & Third-Party";
    if (reportingKeywords.some((k) => upper.includes(k))) return "Reporting & Dashboards";
    if (privacyKeywords.some((k) => upper.includes(k))) return "Privacy & Data Protection";
    if (securityKeywords.some((k) => upper.includes(k))) return "Security";
    if (legalKeywords.some((k) => upper.includes(k))) return "Legal & Terms";
    if (frameworkKeywords.some((k) => upper.includes(k))) return "Compliance Frameworks";
    if (operationsKeywords.some((k) => upper.includes(k))) return "Operations & Governance";
    return "Operations & Governance";
  }

  let totalSize = 0;
  for (const file of files) {
    const filePath = path.join(absOutputDir, file);
    const stat = fs.statSync(filePath);
    const category = categorize(file);
    categories[category].files.push({ name: file, size: stat.size });
    totalSize += stat.size;
  }

  if (jsonOutput) {
    const result: Record<string, unknown> = {
      outputDir: absOutputDir,
      totalFiles: files.length,
      totalSize,
      totalSizeFormatted: formatFileSize(totalSize),
      categories: Object.fromEntries(
        Object.entries(categories)
          .filter(([, v]) => v.files.length > 0)
          .map(([k, v]) => [k, v.files.map((f) => ({ filename: f.name, size: f.size, sizeFormatted: formatFileSize(f.size) }))]),
      ),
    };
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}Compliance Document Tree${RESET()} ${DIM()}(${files.length} files, ${formatFileSize(totalSize)})${RESET()}`);
  console.log(`${DIM()}${absOutputDir}/${RESET()}\n`);

  const nonEmptyCategories = Object.entries(categories).filter(([, v]) => v.files.length > 0);
  for (let ci = 0; ci < nonEmptyCategories.length; ci++) {
    const [catName, catData] = nonEmptyCategories[ci];
    const isLastCat = ci === nonEmptyCategories.length - 1;
    const catPrefix = isLastCat ? "└── " : "├── ";
    const childPrefix = isLastCat ? "    " : "│   ";

    const catSize = catData.files.reduce((sum, f) => sum + f.size, 0);
    console.log(`${catPrefix}${BOLD()}${CYAN()}${catName}${RESET()} ${DIM()}(${catData.files.length} files, ${formatFileSize(catSize)})${RESET()}`);

    const sorted = catData.files.sort((a, b) => a.name.localeCompare(b.name));
    for (let fi = 0; fi < sorted.length; fi++) {
      const f = sorted[fi];
      const isLastFile = fi === sorted.length - 1;
      const filePrefix = isLastFile ? "└── " : "├── ";
      console.log(`${childPrefix}${filePrefix}${f.name} ${DIM()}(${formatFileSize(f.size)})${RESET()}`);
    }
  }

  console.log(`\n${DIM()}Run ${CYAN()}codepliant list-docs${RESET()}${DIM()} to see all available document types.${RESET()}\n`);
  process.exit(0);
}

// --- `codepliant scan --ecosystem <name>` filter ---

const ECOSYSTEM_EXTENSIONS: Record<string, string[]> = {
  js: [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs"],
  javascript: [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs"],
  typescript: [".js", ".ts", ".jsx", ".tsx", ".mjs", ".cjs"],
  python: [".py"],
  go: [".go"],
  golang: [".go"],
  ruby: [".rb"],
  elixir: [".ex", ".exs"],
  php: [".php"],
  rust: [".rs"],
  java: [".java", ".kt", ".scala"],
  dotnet: [".cs", ".fs", ".vb"],
  csharp: [".cs", ".fs", ".vb"],
};

function filterByEcosystem(result: ScanResult, ecosystem: string): void {
  const ecoKey = ecosystem.toLowerCase();
  const extensions = ECOSYSTEM_EXTENSIONS[ecoKey];
  if (!extensions) {
    const valid = [...new Set(Object.keys(ECOSYSTEM_EXTENSIONS))].sort().join(", ");
    console.error(`${RED()}Unknown ecosystem: "${ecosystem}"${RESET()}`);
    console.error(`${DIM()}Valid ecosystems: ${valid}${RESET()}`);
    process.exit(1);
  }

  // Manifest files that indicate a specific ecosystem
  const manifests: Record<string, string[]> = {
    js: ["package.json", "node_modules"],
    javascript: ["package.json", "node_modules"],
    typescript: ["package.json", "node_modules"],
    python: ["requirements", "pyproject", "setup.py", "pipfile"],
    go: ["go.mod", "go.sum"],
    golang: ["go.mod", "go.sum"],
    ruby: ["gemfile"],
    elixir: ["mix.exs"],
    php: ["composer.json"],
    rust: ["cargo.toml"],
    java: ["pom.xml", "build.gradle"],
    dotnet: [".csproj", ".fsproj", "nuget"],
    csharp: [".csproj", ".fsproj", "nuget"],
  };
  const ecoManifests = manifests[ecoKey] || [];

  // Filter services: keep only those with evidence from this ecosystem
  result.services = result.services.filter((s) => {
    return s.evidence.some((ev) => {
      const lower = ev.file.toLowerCase();
      if (extensions.some((ext) => lower.endsWith(ext))) return true;
      if (ecoManifests.some((m) => lower.includes(m))) return true;
      if (ev.type === "env_var") return true;
      return false;
    });
  });
}

// --- `codepliant todo` command ---

interface TodoItem {
  id: number;
  text: string;
  priority: "critical" | "high" | "medium" | "low";
  source: string;
  done: boolean;
}

const TODO_FILE = ".codepliant-todo.json";

function loadTodoState(projectPath: string): Record<string, boolean> {
  const filePath = path.join(projectPath, TODO_FILE);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch { /* ignore */ }
  return {};
}

function saveTodoState(projectPath: string, state: Record<string, boolean>): void {
  const filePath = path.join(projectPath, TODO_FILE);
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
}

function runTodo(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  doneItem?: string,
) {
  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  const state = loadTodoState(absProjectPath);

  // Build todo items from multiple sources
  const items: TodoItem[] = [];
  let id = 1;

  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };

  // 1. Missing documents
  const generatedFilenames = new Set(docs.map((d) => d.filename));
  const existingFilenames = new Set<string>();
  if (fs.existsSync(absOutputDir)) {
    for (const f of fs.readdirSync(absOutputDir)) {
      existingFilenames.add(f);
    }
  }

  for (const doc of docs) {
    if (!existingFilenames.has(doc.filename)) {
      const prio = DOC_PRIORITY[doc.filename] || "low";
      items.push({
        id: id++,
        text: `Generate ${doc.name} (${doc.filename})`,
        priority: prio,
        source: "missing-doc",
        done: state[`gen-${doc.filename}`] || false,
      });
    }
  }

  // 2. Placeholder values in config
  if (!config.companyName || config.companyName === "[Your Company Name]") {
    items.push({
      id: id++,
      text: "Set company name in codepliant config (codepliant init)",
      priority: "critical",
      source: "config",
      done: state["config-companyName"] || false,
    });
  }
  if (!config.contactEmail || config.contactEmail === "[your-email@example.com]") {
    items.push({
      id: id++,
      text: "Set contact email in codepliant config (codepliant init)",
      priority: "critical",
      source: "config",
      done: state["config-contactEmail"] || false,
    });
  }
  if (!config.dpoName && !config.dpoEmail) {
    items.push({
      id: id++,
      text: "Assign a Data Protection Officer (codepliant fix missing-dpo)",
      priority: "high",
      source: "config",
      done: state["config-dpo"] || false,
    });
  }

  // 3. Stale documents
  const FRESHNESS_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();
  for (const filename of existingFilenames) {
    const filePath = path.join(absOutputDir, filename);
    try {
      const stat = fs.statSync(filePath);
      if (now - stat.mtimeMs > FRESHNESS_WINDOW_MS) {
        items.push({
          id: id++,
          text: `Update stale document: ${filename} (${Math.round((now - stat.mtimeMs) / (24 * 60 * 60 * 1000))} days old)`,
          priority: "medium",
          source: "stale",
          done: state[`stale-${filename}`] || false,
        });
      }
    } catch { /* ignore */ }
  }

  // 4. Compliance needs from scan
  const complianceNeeds = result.complianceNeeds || [];
  for (const need of complianceNeeds) {
    if (need.priority === "required") {
      const alreadyInList = items.some((i) => i.text.includes(need.document));
      if (!alreadyInList) {
        items.push({
          id: id++,
          text: `Address compliance requirement: ${need.document} — ${need.reason}`,
          priority: "high",
          source: "compliance-need",
          done: state[`need-${need.document}`] || false,
        });
      }
    }
  }

  // 5. Security recommendations
  const hasAuth = result.services.some((s) => s.category === "auth");
  const hasAI = result.services.some((s) => s.category === "ai");
  if (hasAuth) {
    items.push({
      id: id++,
      text: "Review and test incident response plan with tabletop exercise",
      priority: "high",
      source: "security",
      done: state["security-tabletop"] || false,
    });
  }
  if (hasAI) {
    items.push({
      id: id++,
      text: "Classify AI systems by risk level (EU AI Act)",
      priority: "high",
      source: "ai",
      done: state["ai-classify"] || false,
    });
  }

  // Handle --done
  if (doneItem !== undefined) {
    const itemNum = parseInt(doneItem, 10);
    // Sort first so IDs match display
    items.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Re-assign IDs after sort
    items.forEach((item, idx) => { item.id = idx + 1; });

    const target = items.find((i) => i.id === itemNum);
    if (!target) {
      console.error(`${RED()}Error: No todo item #${itemNum}. Run ${CYAN()}codepliant todo${RESET()}${RED()} to see the list.${RESET()}`);
      process.exit(1);
    }

    // Build a stable key for this item
    const stableKey = target.source === "missing-doc"
      ? `gen-${target.text.match(/\(([^)]+)\)/)?.[1] || target.text}`
      : target.source === "config"
        ? `config-${target.text.includes("company") ? "companyName" : target.text.includes("email") ? "contactEmail" : "dpo"}`
        : target.source === "stale"
          ? `stale-${target.text.match(/: (.+?) \(/)?.[1] || target.text}`
          : target.source === "compliance-need"
            ? `need-${target.text.match(/: (.+?) —/)?.[1] || target.text}`
            : target.source === "security"
              ? "security-tabletop"
              : target.source === "ai"
                ? "ai-classify"
                : `item-${target.text}`;

    state[stableKey] = true;
    saveTodoState(absProjectPath, state);

    console.log(`${GREEN()}${BOLD()}Done!${RESET()} Marked as completed: ${target.text}`);
    console.log(`${DIM()}Run ${CYAN()}codepliant todo${RESET()}${DIM()} to see remaining items.${RESET()}\n`);
    process.exit(0);
  }

  // Sort: undone first, then by priority
  items.sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Re-assign IDs after sort
  items.forEach((item, idx) => { item.id = idx + 1; });

  if (jsonOutput) {
    console.log(JSON.stringify(items, null, 2));
    process.exit(0);
  }

  const pending = items.filter((i) => !i.done);
  const completed = items.filter((i) => i.done);

  console.log(`${BOLD()}Compliance Todo List${RESET()}  ${DIM()}(${pending.length} pending, ${completed.length} done)${RESET()}\n`);

  if (pending.length === 0 && completed.length === 0) {
    console.log(`${GREEN()}${BOLD()}No compliance items found. Your project looks good!${RESET()}\n`);
    process.exit(0);
  }

  for (const item of items) {
    const check = item.done ? `${GREEN()}[x]${RESET()}` : `[ ]`;
    let icon: string;
    let color: string;
    switch (item.priority) {
      case "critical": icon = "🔴"; color = RED(); break;
      case "high": icon = "🟠"; color = YELLOW(); break;
      case "medium": icon = "🟡"; color = DIM(); break;
      default: icon = "⚪"; color = DIM(); break;
    }
    const strikethrough = item.done ? DIM() : "";
    const reset = item.done ? RESET() : "";
    console.log(`  ${check} ${BOLD()}#${item.id}${RESET()} ${icon} ${strikethrough}${item.text}${reset} ${DIM()}(${item.priority})${RESET()}`);
  }

  console.log(`\n${DIM()}Mark items done: ${CYAN()}codepliant todo --done <number>${RESET()}`);
  console.log(`${DIM()}Todo state saved in ${TODO_FILE}${RESET()}\n`);

  process.exit(0);
}

// --- `codepliant benchmark` command ---

interface IndustryBenchmark {
  category: string;
  averageScore: number;
  averageGrade: string;
  topQuartile: number;
  sampleSize: number;
}

const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  saas: {
    category: "SaaS",
    averageScore: 72,
    averageGrade: "C",
    topQuartile: 88,
    sampleSize: 450,
  },
  fintech: {
    category: "Fintech",
    averageScore: 78,
    averageGrade: "C+",
    topQuartile: 92,
    sampleSize: 180,
  },
  healthtech: {
    category: "Healthtech",
    averageScore: 81,
    averageGrade: "B-",
    topQuartile: 94,
    sampleSize: 120,
  },
  ecommerce: {
    category: "E-commerce",
    averageScore: 68,
    averageGrade: "D+",
    topQuartile: 85,
    sampleSize: 320,
  },
  ai_ml: {
    category: "AI/ML",
    averageScore: 65,
    averageGrade: "D",
    topQuartile: 82,
    sampleSize: 210,
  },
  devtools: {
    category: "Developer Tools",
    averageScore: 70,
    averageGrade: "C-",
    topQuartile: 86,
    sampleSize: 280,
  },
  general: {
    category: "General (all industries)",
    averageScore: 71,
    averageGrade: "C",
    topQuartile: 87,
    sampleSize: 1560,
  },
};

function detectIndustry(scanResult: ScanResult): string {
  const hasAI = scanResult.services.some((s) => s.category === "ai");
  const hasPayment = scanResult.services.some((s) => s.category === "payment");
  const hasHealth = scanResult.services.some((s) =>
    s.name.toLowerCase().includes("health") || s.name.toLowerCase().includes("hipaa")
  );

  if (hasHealth) return "healthtech";
  if (hasPayment && hasAI) return "fintech";
  if (hasPayment) return "ecommerce";
  if (hasAI) return "ai_ml";
  return "saas";
}

function gradeFromScore(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D+";
  if (score >= 45) return "D";
  return "F";
}

function runBenchmark(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
) {
  if (!quiet && !jsonOutput) printBanner();

  const config = loadConfig(absProjectPath);
  const result = scan(absProjectPath);
  const docs = generateDocuments(result, config);

  // Compute score
  const scoreInput: ScoreInput = {
    scanResult: result,
    docs,
    config,
    outputDir: absOutputDir,
  };
  const score = computeFullComplianceScore(scoreInput);

  const detectedIndustry = detectIndustry(result);
  const benchmark = INDUSTRY_BENCHMARKS[detectedIndustry];
  const generalBenchmark = INDUSTRY_BENCHMARKS["general"];

  const yourScore = score.total;
  const yourGrade = gradeFromScore(yourScore);
  const delta = yourScore - benchmark.averageScore;
  const generalDelta = yourScore - generalBenchmark.averageScore;

  if (jsonOutput) {
    console.log(JSON.stringify({
      yourScore,
      yourGrade,
      industry: benchmark.category,
      industryAverage: benchmark.averageScore,
      industryAverageGrade: benchmark.averageGrade,
      industryTopQuartile: benchmark.topQuartile,
      delta,
      percentile: yourScore >= benchmark.topQuartile ? "top-25" : yourScore >= benchmark.averageScore ? "above-average" : "below-average",
      generalAverage: generalBenchmark.averageScore,
      generalDelta,
    }, null, 2));
    process.exit(0);
  }

  console.log(`${BOLD()}Compliance Benchmark${RESET()}\n`);

  // Your score
  const scoreColor = yourScore >= 80 ? GREEN() : yourScore >= 60 ? YELLOW() : RED();
  console.log(`  ${BOLD()}Your Score:${RESET()} ${scoreColor}${BOLD()}${yourScore}% (${yourGrade})${RESET()}`);
  console.log("");

  // Industry comparison
  console.log(`  ${BOLD()}Industry:${RESET()} ${benchmark.category}`);
  console.log(`  ${BOLD()}Industry Average:${RESET()} ${benchmark.averageScore}% (${benchmark.averageGrade})`);
  console.log(`  ${BOLD()}Top Quartile:${RESET()} ${benchmark.topQuartile}%`);
  console.log(`  ${DIM()}Based on ${benchmark.sampleSize} analyzed repositories${RESET()}`);
  console.log("");

  // Delta visualization
  const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
  const deltaColor = delta >= 0 ? GREEN() : RED();
  const deltaIcon = delta >= 0 ? "▲" : "▼";
  console.log(`  ${BOLD()}vs Industry Average:${RESET()} ${deltaColor}${BOLD()}${deltaIcon} ${deltaStr} points${RESET()}`);

  if (yourScore >= benchmark.topQuartile) {
    console.log(`  ${GREEN()}${BOLD()}You are in the top 25% of ${benchmark.category} companies!${RESET()}`);
  } else if (yourScore >= benchmark.averageScore) {
    console.log(`  ${YELLOW()}You are above the industry average. ${benchmark.topQuartile - yourScore} points to reach top 25%.${RESET()}`);
  } else {
    console.log(`  ${RED()}You are below the industry average. Run ${CYAN()}codepliant todo${RESET()}${RED()} to see how to improve.${RESET()}`);
  }
  console.log("");

  // Score bar comparison
  const barWidth = 50;
  function renderBar(score: number, label: string, color: string): void {
    const filled = Math.round((score / 100) * barWidth);
    const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);
    console.log(`  ${color}${bar}${RESET()} ${score}%  ${label}`);
  }

  renderBar(yourScore, `${BOLD()}You${RESET()}`, scoreColor);
  renderBar(benchmark.averageScore, `${benchmark.category} avg`, DIM());
  renderBar(benchmark.topQuartile, `${benchmark.category} top 25%`, CYAN());
  console.log("");

  // General industry comparison
  const generalDeltaStr = generalDelta >= 0 ? `+${generalDelta}` : `${generalDelta}`;
  const generalDeltaColor = generalDelta >= 0 ? GREEN() : RED();
  console.log(`  ${DIM()}vs All Industries: ${generalDeltaColor}${generalDeltaStr} points${RESET()} ${DIM()}(average: ${generalBenchmark.averageScore}%)${RESET()}`);
  console.log("");

  // Recommendations
  if (yourScore < benchmark.topQuartile) {
    console.log(`${BOLD()}How to improve:${RESET()}`);
    if (score.recommendations && score.recommendations.length > 0) {
      const topRecs = score.recommendations.slice(0, 3);
      for (const rec of topRecs) {
        const impactIcon = rec.impact === "critical" ? "🔴" : rec.impact === "high" ? "🟠" : "🟡";
        console.log(`  ${impactIcon} ${rec.title} ${DIM()}(+${rec.estimatedPointsGain} points)${RESET()}`);
      }
    } else {
      console.log(`  Run ${CYAN()}codepliant todo${RESET()} to see actionable improvement items.`);
    }
    console.log("");
  }

  console.log(`${DIM()}Benchmarks based on aggregated analysis of ${generalBenchmark.sampleSize}+ repositories across industries.${RESET()}\n`);
  process.exit(0);
}

// --- `codepliant preview <document>` command ---

function runPreview(
  absProjectPath: string,
  absOutputDir: string,
  args: string[],
  quiet: boolean,
) {
  if (!quiet) printBanner();

  // Find the document argument (first non-flag arg after "preview")
  const previewIdx = args.indexOf("preview");
  let docArg: string | undefined;
  for (let i = previewIdx + 1; i < args.length; i++) {
    if (!args[i].startsWith("-")) {
      docArg = args[i];
      break;
    }
  }

  if (!docArg) {
    // List available documents
    if (!fs.existsSync(absOutputDir)) {
      console.log(`${YELLOW()}No generated documents found. Run ${CYAN()}codepliant go${RESET()}${YELLOW()} first.${RESET()}`);
      process.exit(1);
    }
    const files = fs.readdirSync(absOutputDir).filter((f: string) => f.endsWith(".md"));
    if (files.length === 0) {
      console.log(`${YELLOW()}No markdown documents found in ${absOutputDir}.${RESET()}`);
      process.exit(1);
    }
    console.log(`${BOLD()}Available documents:${RESET()}\n`);
    for (const file of files) {
      console.log(`  ${CYAN()}${file.replace(".md", "").toLowerCase().replace(/_/g, "-")}${RESET()}  ${DIM()}(${file})${RESET()}`);
    }
    console.log(`\n${DIM()}Usage: codepliant preview <document-name>${RESET()}`);
    process.exit(0);
  }

  // Resolve document name — match by filename, slug, or partial
  if (!fs.existsSync(absOutputDir)) {
    console.error(`${RED()}No generated documents found. Run ${CYAN()}codepliant go${RESET()}${RED()} first.${RESET()}`);
    process.exit(1);
  }

  const files = fs.readdirSync(absOutputDir).filter((f: string) => f.endsWith(".md"));
  const normalizedArg = docArg.toUpperCase().replace(/-/g, "_");

  let matchedFile: string | undefined;

  // Exact filename match
  matchedFile = files.find((f: string) => f === docArg || f === `${docArg}.md`);

  // Slug match: privacy-policy -> PRIVACY_POLICY.md
  if (!matchedFile) {
    matchedFile = files.find((f: string) => f.replace(".md", "") === normalizedArg);
  }

  // Partial match
  if (!matchedFile) {
    matchedFile = files.find((f: string) => f.toUpperCase().includes(normalizedArg));
  }

  if (!matchedFile) {
    console.error(`${RED()}Document "${docArg}" not found.${RESET()}`);
    console.log(`${DIM()}Run ${CYAN()}codepliant preview${RESET()}${DIM()} to see available documents.${RESET()}`);
    process.exit(1);
  }

  const filePath = path.join(absOutputDir, matchedFile);
  const content = fs.readFileSync(filePath, "utf-8");

  // Syntax-highlighted markdown rendering
  const highlighted = highlightMarkdown(content);

  // Paged output
  const termHeight = process.stdout.rows || 40;
  const lines = highlighted.split("\n");

  if (lines.length <= termHeight - 2) {
    // Fits on screen — no paging needed
    console.log(highlighted);
    process.exit(0);
  }

  // Page through output
  let offset = 0;
  const pageSize = termHeight - 3;

  const showPage = () => {
    const pageLines = lines.slice(offset, offset + pageSize);
    console.log(pageLines.join("\n"));
    const remaining = lines.length - offset - pageSize;
    if (remaining > 0) {
      process.stdout.write(`${DIM()}--- ${remaining} more lines (press Enter for next page, q to quit) ---${RESET()}`);
    }
  };

  showPage();

  if (offset + pageSize >= lines.length) {
    process.exit(0);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.on("line", (input: string) => {
    if (input.trim().toLowerCase() === "q") {
      rl.close();
      process.exit(0);
    }
    offset += pageSize;
    if (offset >= lines.length) {
      rl.close();
      process.exit(0);
    }
    showPage();
    if (offset + pageSize >= lines.length) {
      rl.close();
      process.exit(0);
    }
  });
}

/** Simple markdown syntax highlighting for terminal output. */
function highlightMarkdown(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    if (line.startsWith("# ")) {
      result.push(`${BOLD()}${CYAN()}${line}${RESET()}`);
    } else if (line.startsWith("## ")) {
      result.push(`${BOLD()}${GREEN()}${line}${RESET()}`);
    } else if (line.startsWith("### ")) {
      result.push(`${BOLD()}${YELLOW()}${line}${RESET()}`);
    } else if (line.startsWith("- [ ] ")) {
      result.push(`  ${RED()}☐${RESET()} ${line.slice(6)}`);
    } else if (line.startsWith("- [x] ") || line.startsWith("- [X] ")) {
      result.push(`  ${GREEN()}☑${RESET()} ${line.slice(6)}`);
    } else if (line.startsWith("> ")) {
      result.push(`${DIM()}${line}${RESET()}`);
    } else if (line.startsWith("---")) {
      result.push(`${DIM()}${"─".repeat(60)}${RESET()}`);
    } else if (line.startsWith("| ")) {
      // Table row — highlight headers
      result.push(`${DIM()}${line}${RESET()}`);
    } else if (line.startsWith("```")) {
      result.push(`${DIM()}${line}${RESET()}`);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      result.push(`  ${CYAN()}•${RESET()} ${line.slice(2)}`);
    } else if (/^\d+\.\s/.test(line)) {
      result.push(`  ${CYAN()}${line}${RESET()}`);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      result.push(`${BOLD()}${line.replace(/\*\*/g, "")}${RESET()}`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

// --- `codepliant reset` command ---

function runReset(
  absProjectPath: string,
  absOutputDir: string,
  args: string[],
  quiet: boolean,
  force: boolean,
) {
  if (!quiet) printBanner();

  const allFlag = args.includes("--all");

  // State files to remove
  const stateFiles = [
    path.join(absProjectPath, ".codepliant-scores.json"),
    path.join(absProjectPath, ".codepliant-todo.json"),
  ];

  // Check what exists
  const existingState = stateFiles.filter((f) => fs.existsSync(f));
  const docsExist = fs.existsSync(absOutputDir) && fs.readdirSync(absOutputDir).some((f: string) => f.endsWith(".md") || f.endsWith(".json"));

  if (existingState.length === 0 && (!allFlag || !docsExist)) {
    console.log(`${YELLOW()}Nothing to reset — no codepliant state files found.${RESET()}`);
    process.exit(0);
  }

  const doReset = () => {
    let removed = 0;

    // Remove state files
    for (const file of existingState) {
      fs.unlinkSync(file);
      removed++;
      if (!quiet) {
        console.log(`  ${GREEN()}✓${RESET()} Removed ${path.basename(file)}`);
      }
    }

    // With --all: also remove generated docs
    if (allFlag && fs.existsSync(absOutputDir)) {
      const files = fs.readdirSync(absOutputDir).filter((f: string) => f.endsWith(".md") || f.endsWith(".json"));
      for (const file of files) {
        fs.unlinkSync(path.join(absOutputDir, file));
        removed++;
      }
      // Remove directory if empty
      const remaining = fs.readdirSync(absOutputDir);
      if (remaining.length === 0) {
        fs.rmdirSync(absOutputDir);
      }
      if (!quiet) {
        console.log(`  ${GREEN()}✓${RESET()} Removed ${files.length} generated document(s) from ${path.basename(absOutputDir)}/`);
      }
    }

    if (!quiet) {
      console.log(`\n${GREEN()}${BOLD()}Reset complete.${RESET()} Removed ${removed} file(s).`);
      if (!allFlag) {
        console.log(`${DIM()}Config (.codepliantrc.json) and generated documents were kept.${RESET()}`);
        console.log(`${DIM()}Use ${CYAN()}codepliant reset --all${RESET()}${DIM()} to also remove generated documents.${RESET()}`);
      }
    }
    process.exit(0);
  };

  if (force) {
    doReset();
    return;
  }

  // Confirmation prompt
  const what = allFlag
    ? `all codepliant state and ${fs.existsSync(absOutputDir) ? fs.readdirSync(absOutputDir).filter((f: string) => f.endsWith(".md") || f.endsWith(".json")).length : 0} generated document(s)`
    : `${existingState.length} codepliant state file(s)`;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(
    `${YELLOW()}Reset ${what}?${RESET()} [y/N] `,
    (answer: string) => {
      rl.close();
      if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
        doReset();
      } else {
        console.log(`${DIM()}Cancelled.${RESET()}`);
        process.exit(0);
      }
    },
  );
}

function runSearch(absOutputDir: string, args: string[], quiet: boolean) {
  // Extract keyword from args (first non-flag arg after "search")
  let keyword = "";
  let contextLines = 1;
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--context" || arg === "-C") {
      const n = parseInt(args[++i], 10);
      if (!isNaN(n) && n >= 0) contextLines = n;
    } else if (arg === "--json") {
      // handled elsewhere
    } else if (arg === "--quiet" || arg === "-q") {
      // handled elsewhere
    } else if (arg === "--no-color") {
      // handled elsewhere
    } else if (arg === "--output" || arg === "-o") {
      i++; // skip value
    } else if (!arg.startsWith("-")) {
      keyword = arg;
    }
  }

  if (!keyword) {
    console.error(`${RED()}Usage: codepliant search <keyword>${RESET()}`);
    console.error(`${DIM()}Example: codepliant search email${RESET()}`);
    process.exit(1);
  }

  if (!fs.existsSync(absOutputDir)) {
    console.error(
      `${RED()}No documents found at "${absOutputDir}".${RESET()}`
    );
    console.error(
      `${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} first to generate documents.${RESET()}`
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(absOutputDir)
    .filter(
      (f: string) => f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".txt")
    );

  if (files.length === 0) {
    console.error(
      `${RED()}No documents found in "${absOutputDir}".${RESET()}`
    );
    process.exit(1);
  }

  const keywordLower = keyword.toLowerCase();
  let totalMatches = 0;
  let docMatches = 0;
  const results: Array<{
    file: string;
    matches: Array<{ lineNum: number; line: string; context: string[] }>;
  }> = [];

  for (const file of files) {
    const filePath = path.join(absOutputDir, file);
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    const fileMatches: Array<{
      lineNum: number;
      line: string;
      context: string[];
    }> = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(keywordLower)) {
        const ctxStart = Math.max(0, i - contextLines);
        const ctxEnd = Math.min(lines.length - 1, i + contextLines);
        const context: string[] = [];
        for (let j = ctxStart; j <= ctxEnd; j++) {
          if (j !== i) context.push(lines[j]);
        }
        fileMatches.push({
          lineNum: i + 1,
          line: lines[i],
          context,
        });
        totalMatches++;
      }
    }

    if (fileMatches.length > 0) {
      docMatches++;
      results.push({ file, matches: fileMatches });
    }
  }

  const jsonOutput = args.includes("--json");

  if (jsonOutput) {
    console.log(
      JSON.stringify(
        {
          keyword,
          totalMatches,
          documentsMatched: docMatches,
          documentsSearched: files.length,
          results: results.map((r) => ({
            file: r.file,
            matchCount: r.matches.length,
            matches: r.matches.map((m) => ({
              line: m.lineNum,
              text: m.line.trim(),
            })),
          })),
        },
        null,
        2
      )
    );
    return;
  }

  if (!quiet) {
    console.log("");
  }

  if (totalMatches === 0) {
    console.log(
      `${YELLOW()}No matches for '${keyword}' in ${files.length} documents.${RESET()}`
    );
    return;
  }

  console.log(
    `${GREEN()}${BOLD()}Found '${keyword}' in ${docMatches} document${docMatches !== 1 ? "s" : ""} (${totalMatches} match${totalMatches !== 1 ? "es" : ""})${RESET()}`
  );
  console.log("");

  for (const result of results) {
    console.log(
      `${CYAN()}${BOLD()}${result.file}${RESET()} ${DIM()}(${result.matches.length} match${result.matches.length !== 1 ? "es" : ""})${RESET()}`
    );

    const maxShow = 5;
    const shown = result.matches.slice(0, maxShow);
    for (const match of shown) {
      // Highlight the keyword in the line
      const highlighted = match.line.replace(
        new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
        `${YELLOW()}${BOLD()}$1${RESET()}`
      );
      console.log(
        `  ${DIM()}L${match.lineNum}:${RESET()} ${highlighted.trim()}`
      );
    }

    if (result.matches.length > maxShow) {
      console.log(
        `  ${DIM()}... and ${result.matches.length - maxShow} more match${result.matches.length - maxShow !== 1 ? "es" : ""}${RESET()}`
      );
    }

    console.log("");
  }
}

function printAbout() {
  console.log(`
${CYAN()}${BOLD()}  ╔═══════════════════════════════════════╗
  ║             CODEPLIANT                ║
  ║   Compliance documents from code.     ║
  ╚═══════════════════════════════════════╝${RESET()}

${BOLD()}Mission:${RESET()}
  Codepliant scans your actual source code and generates every
  compliance document your project needs — Privacy Policy, Terms of
  Service, AI Disclosure, DPA, and 120+ more — in under a second.
  No questionnaires. No network calls. No AI. Purely deterministic.

${BOLD()}Version:${RESET()}     ${VERSION}
${BOLD()}License:${RESET()}     MIT — free forever
${BOLD()}Runtime:${RESET()}     Zero network calls, everything runs locally

${BOLD()}Links:${RESET()}
  ${CYAN()}GitHub:${RESET()}    https://github.com/joechensmartz/codepliant
  ${CYAN()}Website:${RESET()}   https://github.com/joechensmartz/codepliant#readme
  ${CYAN()}Issues:${RESET()}    https://github.com/joechensmartz/codepliant/issues
  ${CYAN()}NPM:${RESET()}       https://www.npmjs.com/package/codepliant

${BOLD()}Stats:${RESET()}
  120+ document types | 30+ scanners | 55+ CLI commands
  10+ ecosystems | 13+ output formats | 4 languages

${BOLD()}Credits:${RESET()}
  Built with \u2764\uFE0F by the open-source community.
  ${DIM()}Contributions welcome — see CONTRIBUTING.md${RESET()}

${BOLD()}Quick Start:${RESET()}
  ${CYAN()}npx codepliant go${RESET()}          Generate all compliance docs
  ${CYAN()}npx codepliant scan${RESET()}        Scan without generating
  ${CYAN()}npx codepliant help${RESET()}        See all commands
`);
}

function printCelebrate() {
  console.log(`
${YELLOW()}${BOLD()}
    *   *   *   *   *   *   *   *   *   *
  *       *       *       *       *       *
    *   *   *   *   *   *   *   *   *   *

          ${CYAN()}  ██╗   ██╗███████╗ ██████╗  ██████╗
          ${CYAN()}  ██║   ██║██╔════╝██╔═████╗██╔═████╗
          ${CYAN()}  ██║   ██║███████╗██║██╔██║██║██╔██║
          ${CYAN()}  ╚██╗ ██╔╝╚════██║████╔╝██║████╔╝██║
          ${CYAN()}   ╚████╔╝ ███████║╚██████╔╝╚██████╔╝
          ${CYAN()}    ╚═══╝  ╚══════╝ ╚═════╝  ╚═════╝

${YELLOW()}    *   *   *   *   *   *   *   *   *   *
  *       *       *       *       *       *
    *   *   *   *   *   *   *   *   *   *${RESET()}

${BOLD()}  v500 milestone!${RESET()}
  ${GREEN()}120+ document types.${RESET()} Built overnight.

  ${DIM()}430 versions. 792 tests. 1200+ repos scanned.
  55+ CLI commands. 30+ scanners. 13+ output formats.
  Zero network calls. Under one second.${RESET()}

  ${CYAN()}One session. One CLI. Complete compliance.${RESET()}
`);
}

// --- `codepliant snapshot` command ---

function runSnapshot(
  absProjectPath: string,
  absOutputDir: string,
  quiet: boolean,
  jsonOutput: boolean,
  args: string[],
) {
  if (!quiet) printBanner();

  const snapshotsDir = path.join(absProjectPath, ".codepliant", "snapshots");

  // Sub-commands: list, compare <id>
  const subCommand = args[1]; // args[0] is "snapshot"

  if (subCommand === "list") {
    if (!fs.existsSync(snapshotsDir)) {
      if (jsonOutput) {
        console.log(JSON.stringify({ snapshots: [] }));
      } else {
        console.log(`${YELLOW()}No snapshots found.${RESET()} Run ${CYAN()}codepliant snapshot${RESET()} to create one.`);
      }
      process.exit(0);
    }

    const entries = fs.readdirSync(snapshotsDir)
      .filter((e: string) => fs.statSync(path.join(snapshotsDir, e)).isDirectory())
      .sort()
      .reverse();

    if (entries.length === 0) {
      if (jsonOutput) {
        console.log(JSON.stringify({ snapshots: [] }));
      } else {
        console.log(`${YELLOW()}No snapshots found.${RESET()} Run ${CYAN()}codepliant snapshot${RESET()} to create one.`);
      }
      process.exit(0);
    }

    if (jsonOutput) {
      const snapshots = entries.map((e: string) => {
        const metaPath = path.join(snapshotsDir, e, "snapshot.json");
        let meta: Record<string, unknown> = {};
        if (fs.existsSync(metaPath)) {
          try { meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")); } catch { /* ignore */ }
        }
        return { id: e, ...meta };
      });
      console.log(JSON.stringify({ snapshots }, null, 2));
      process.exit(0);
    }

    console.log(`${BOLD()}Compliance Snapshots${RESET()}\n`);
    console.log(`${DIM()}Location: ${snapshotsDir}${RESET()}\n`);

    for (const entry of entries) {
      const metaPath = path.join(snapshotsDir, entry, "snapshot.json");
      let docCount = 0;
      let services = 0;
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          docCount = meta.documentCount || 0;
          services = meta.serviceCount || 0;
        } catch { /* ignore */ }
      }
      console.log(`  ${CYAN()}${entry}${RESET()} — ${docCount} docs, ${services} services`);
    }
    console.log(`\n${DIM()}Use ${CYAN()}codepliant snapshot compare <id>${RESET()}${DIM()} to compare with current state.${RESET()}\n`);
    process.exit(0);
  }

  if (subCommand === "compare") {
    const snapshotId = args[2];
    if (!snapshotId) {
      console.error(`${RED()}Usage: codepliant snapshot compare <snapshot-id>${RESET()}`);
      console.error(`${DIM()}Run ${CYAN()}codepliant snapshot list${RESET()}${DIM()} to see available snapshots.${RESET()}`);
      process.exit(1);
    }

    const snapshotDir = path.join(snapshotsDir, snapshotId);
    if (!fs.existsSync(snapshotDir)) {
      console.error(`${RED()}Snapshot "${snapshotId}" not found.${RESET()}`);
      console.error(`${DIM()}Run ${CYAN()}codepliant snapshot list${RESET()}${DIM()} to see available snapshots.${RESET()}`);
      process.exit(1);
    }

    if (!fs.existsSync(absOutputDir)) {
      console.error(`${RED()}Output directory "${absOutputDir}" does not exist.${RESET()}`);
      console.error(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} first to generate documents.${RESET()}`);
      process.exit(1);
    }

    const snapshotFiles = fs.readdirSync(snapshotDir).filter((f: string) => f.endsWith(".md") || f.endsWith(".json"));
    const currentFiles = fs.readdirSync(absOutputDir).filter((f: string) => f.endsWith(".md") || f.endsWith(".json"));

    const snapshotSet = new Set(snapshotFiles);
    const currentSet = new Set(currentFiles);

    const added = currentFiles.filter((f: string) => !snapshotSet.has(f));
    const removed = snapshotFiles.filter((f: string) => !currentSet.has(f));
    const common = currentFiles.filter((f: string) => snapshotSet.has(f));

    let changed = 0;
    let unchanged = 0;
    const changedFiles: string[] = [];

    for (const file of common) {
      const snapshotContent = fs.readFileSync(path.join(snapshotDir, file), "utf-8");
      const currentContent = fs.readFileSync(path.join(absOutputDir, file), "utf-8");
      if (snapshotContent !== currentContent) {
        changed++;
        changedFiles.push(file);
      } else {
        unchanged++;
      }
    }

    if (jsonOutput) {
      console.log(JSON.stringify({
        snapshotId,
        comparison: {
          added,
          removed,
          changed: changedFiles,
          unchanged,
          totalSnapshot: snapshotFiles.length,
          totalCurrent: currentFiles.length,
        },
      }, null, 2));
      process.exit(0);
    }

    console.log(`${BOLD()}Snapshot Comparison${RESET()}\n`);
    console.log(`${DIM()}Comparing:${RESET()} ${CYAN()}${snapshotId}${RESET()} vs ${CYAN()}current${RESET()}\n`);

    console.log(`  ${GREEN()}+ Added:${RESET()}     ${added.length} document(s)`);
    for (const f of added) {
      console.log(`    ${GREEN()}+ ${f}${RESET()}`);
    }
    console.log(`  ${RED()}- Removed:${RESET()}   ${removed.length} document(s)`);
    for (const f of removed) {
      console.log(`    ${RED()}- ${f}${RESET()}`);
    }
    console.log(`  ${YELLOW()}~ Changed:${RESET()}   ${changed} document(s)`);
    for (const f of changedFiles) {
      console.log(`    ${YELLOW()}~ ${f}${RESET()}`);
    }
    console.log(`  ${DIM()}= Unchanged:${RESET()} ${unchanged} document(s)`);
    console.log();
    console.log(
      `${DIM()}Summary: ${snapshotFiles.length} docs in snapshot, ${currentFiles.length} docs now ` +
      `(+${added.length} -${removed.length} ~${changed})${RESET()}\n`
    );
    process.exit(0);
  }

  // Default: create a new snapshot
  if (!fs.existsSync(absOutputDir)) {
    console.error(`${RED()}[CP006] Error: Output directory "${absOutputDir}" does not exist.${RESET()}`);
    console.error(`${DIM()}Run ${CYAN()}codepliant go${RESET()}${DIM()} first to generate documents.${RESET()}`);
    process.exit(1);
  }

  const files = fs.readdirSync(absOutputDir);
  const generatedFiles = files.filter((f: string) => f.endsWith(".md") || f.endsWith(".json") || f.endsWith(".html"));

  if (generatedFiles.length === 0) {
    console.log(`${YELLOW()}No generated files found in ${absOutputDir}.${RESET()}`);
    process.exit(0);
  }

  // Create snapshot directory with timestamp
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-").replace("T", "_").slice(0, 19);
  const snapshotName = `snapshot-${timestamp}`;
  const snapshotDir = path.join(snapshotsDir, snapshotName);

  fs.mkdirSync(snapshotDir, { recursive: true });

  // Copy all generated files
  let copied = 0;
  for (const file of generatedFiles) {
    const src = path.join(absOutputDir, file);
    const dest = path.join(snapshotDir, file);
    fs.copyFileSync(src, dest);
    copied++;
  }

  // Write metadata
  const meta = {
    id: snapshotName,
    createdAt: now.toISOString(),
    documentCount: copied,
    serviceCount: 0,
    files: generatedFiles,
  };

  // Try to get service count from a scan
  try {
    const result = scan(absProjectPath);
    meta.serviceCount = result.services.length;
  } catch { /* ignore — service count will be 0 */ }

  fs.writeFileSync(path.join(snapshotDir, "snapshot.json"), JSON.stringify(meta, null, 2), "utf-8");

  if (jsonOutput) {
    console.log(JSON.stringify(meta, null, 2));
    process.exit(0);
  }

  if (!quiet) {
    const relativePath = path.relative(absProjectPath, snapshotDir);
    console.log(`${GREEN()}${BOLD()}Snapshot saved!${RESET()} ${copied} file(s) captured.\n`);
    console.log(`  ${CYAN()}ID:${RESET()}       ${snapshotName}`);
    console.log(`  ${CYAN()}Location:${RESET()} ${relativePath}/`);
    console.log(`  ${CYAN()}Files:${RESET()}    ${copied}`);
    console.log();
    console.log(`${DIM()}Commands:${RESET()}`);
    console.log(`  ${CYAN()}codepliant snapshot list${RESET()}              — View all snapshots`);
    console.log(`  ${CYAN()}codepliant snapshot compare ${snapshotName}${RESET()} — Compare with current\n`);
  }

  process.exit(0);
}

main();
