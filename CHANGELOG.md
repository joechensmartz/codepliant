# Changelog

All notable changes to Codepliant are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-17

### Added
- `codepliant wizard` interactive setup command
- `codepliant sbom` CycloneDX 1.5 SBOM generation
- Terraform/IaC scanner (AWS, GCP, Azure resources)
- Django settings.py scanner (INSTALLED_APPS, MIDDLEWARE, DATABASES)
- Flutter/Dart ecosystem support (pubspec.yaml)
- Swift/iOS ecosystem support (Package.swift, Podfile)
- Impressum generator (German Section 5 DDG)
- Document categorization (legal/, ai/, security/, privacy/, vendor/, audit/, governance/)

### Changed
- Moved puppeteer to optionalDependencies (saves 300MB on install)
- Reduced npm package size from 906KB to 831KB

### Fixed
- GitHub Actions scanner detection patterns
- Service family deduplication edge cases

## [1.0.0] - 2026-03-16

### Added
- Initial release with 120+ document types
- 10+ ecosystem support
- 200+ service signatures
- MCP server integration
