# Changelog

All notable changes to Codepliant are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-17

### Added

#### New Commands
- `codepliant wizard` — interactive setup command for first-time users
- `codepliant sbom` — CycloneDX 1.5 Software Bill of Materials generation
- `codepliant health` — comprehensive project health check with `--json` flag for CI
- `codepliant diff` — compare current documents on disk with freshly generated versions
- `codepliant completions` — shell completion scripts for bash, zsh, and fish
- `codepliant version-check` — check if a newer version is available on npm
- `codepliant list-docs` — list all document types codepliant can generate
- `codepliant changelog` — view version history from the CLI
- `codepliant about` — show project info, mission, credits, and links
- `codepliant lint` — lint compliance documents for issues
- `codepliant validate` — validate document structure and content
- `codepliant certify` — generate a dated compliance certificate for partners
- `codepliant benchmark` — performance benchmarking
- `codepliant celebrate` — v500 milestone easter egg

#### New Scanners
- Terraform/IaC scanner — AWS, GCP, Azure resource detection
- Django settings.py scanner — INSTALLED_APPS, MIDDLEWARE, DATABASES parsing
- Flutter/Dart ecosystem support — pubspec.yaml dependency scanning
- Swift/iOS ecosystem support — Package.swift (SPM) and Podfile (CocoaPods) parsing
- Kotlin/Android ecosystem support — build.gradle, build.gradle.kts, gradle/libs.versions.toml parsing with 20 Android service signatures

#### New Generators
- Impressum generator (German Section 5 DDG, required in Germany/Austria/Switzerland)
- EULA (End User License Agreement) generator with conditional AI and payment sections
- Disclaimer generator with conditional AI and payment disclaimer sections
- Compliance Budget Template
- Compliance Gap Analysis
- Compliance Summary Email
- Regulatory Correspondence Log
- AI Ethics Statement (UNESCO-aligned)
- Data Breach Response Drill template
- Data Deletion Procedures (GDPR Art. 17)
- DPO Handbook
- Executive Dashboard (one-page C-suite compliance overview)
- Executive Briefing
- Penetration Test Scope
- Media Consent form
- Responsible Disclosure policy
- Data Portability Guide
- Training Record (GDPR Art. 39(1)(b))
- Privacy Notice (Short) — condensed privacy notice
- Privacy Notice (App) — in-app privacy notice
- Privacy Notice (Children) — COPPA-compliant children's privacy notice

#### CLI UX Improvements
- Fuzzy command matching — typos like `scna` suggest `scan`, `goo` suggests `go`
- Tree-view document listing in `codepliant go` output with box-drawing characters and category grouping
- Document categorization into directories (legal/, ai/, security/, privacy/, vendor/, audit/, governance/)
- GitHub Action (`action.yml`) for CI/CD compliance scanning

#### Internationalization
- i18n framework with locale support for English, German, French, and Spanish

#### Testing
- 2,759 tests passing (up from 798 at v1.0.0)
- 45 of 132 generator modules now have dedicated test suites
- Scanner test coverage for auth, cloud, CORS, Kotlin, Swift, and more

### Changed
- Moved puppeteer to optionalDependencies (saves ~300MB Chromium download on install)
- Reduced npm package size from 906KB to 831KB
- MCP server registered as `codepliant-mcp` binary entry point

### Fixed
- GitHub Actions scanner detection patterns
- Service family deduplication edge cases
- Duplicate provider entries in cross-border transfer maps

## [1.0.0] - 2026-03-16

### Added
- Initial release with 120+ document types
- 10+ ecosystem support (Node.js, Python, Ruby, Go, Rust, PHP, Java, .NET, Elixir, R)
- 200+ service signatures
- MCP server integration
- PDF, HTML, Markdown, and JSON output formats
- `codepliant go` one-command scan-and-generate
- `codepliant scan` with `--json` output
- Compliance scoring system
- Plugin architecture
- Notification system for compliance drift
- Licensing detection from dependency manifests
