import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/types.js";
import type { GeneratorContext } from "./index.js";

/**
 * Detected CI/CD platform information.
 */
export interface CiCdDetection {
  platform: string;
  configFile: string;
  features: string[];
}

// ── CI/CD detection patterns ─────────────────────────────────────────

interface CiCdPattern {
  platform: string;
  files: string[];
  features: string[];
}

const CI_CD_PATTERNS: CiCdPattern[] = [
  {
    platform: "GitHub Actions",
    files: [".github/workflows"],
    features: ["Automated workflows", "PR checks", "Deployment pipelines", "Branch protection integration"],
  },
  {
    platform: "GitLab CI",
    files: [".gitlab-ci.yml"],
    features: ["Pipeline stages", "Merge request checks", "Environment deployments", "Auto DevOps"],
  },
  {
    platform: "CircleCI",
    files: [".circleci/config.yml"],
    features: ["Workflow orchestration", "Parallel testing", "Docker layer caching", "Approval jobs"],
  },
  {
    platform: "Jenkins",
    files: ["Jenkinsfile"],
    features: ["Pipeline stages", "Build agents", "Deployment gates", "Artifact management"],
  },
  {
    platform: "Travis CI",
    files: [".travis.yml"],
    features: ["Build matrix", "Deployment providers", "Branch filtering"],
  },
  {
    platform: "Azure Pipelines",
    files: ["azure-pipelines.yml"],
    features: ["Multi-stage pipelines", "Approval gates", "Environment deployments"],
  },
  {
    platform: "Vercel",
    files: ["vercel.json"],
    features: ["Preview deployments", "Production deployments", "Environment variables", "Edge functions"],
  },
  {
    platform: "Netlify",
    files: ["netlify.toml"],
    features: ["Build plugins", "Deploy previews", "Branch deploys", "Split testing"],
  },
  {
    platform: "Docker",
    files: ["Dockerfile", "docker-compose.yml", "docker-compose.yaml"],
    features: ["Container builds", "Multi-stage builds", "Service orchestration"],
  },
  {
    platform: "Kubernetes",
    files: ["k8s", "kubernetes", "kustomization.yaml", "helm"],
    features: ["Rolling deployments", "Rollback support", "Health checks", "Horizontal scaling"],
  },
  {
    platform: "Terraform",
    files: ["main.tf", "terraform"],
    features: ["Infrastructure as Code", "Plan/Apply workflow", "State management", "Drift detection"],
  },
];

// ── Version control detection ────────────────────────────────────────

interface VcsDetection {
  platform: string;
  features: string[];
}

function detectVcs(projectPath: string): VcsDetection | null {
  if (fs.existsSync(path.join(projectPath, ".git"))) {
    // Check for branch protection indicators
    const features = ["Version control", "Commit history", "Branch management"];
    if (fs.existsSync(path.join(projectPath, ".github"))) {
      features.push("GitHub integration", "Pull request workflow");
    }
    if (fs.existsSync(path.join(projectPath, ".gitlab-ci.yml"))) {
      features.push("GitLab integration", "Merge request workflow");
    }
    return { platform: "Git", features };
  }
  return null;
}

/**
 * Detect CI/CD platforms configured in the project.
 */
export function detectCiCd(projectPath: string): CiCdDetection[] {
  const detected: CiCdDetection[] = [];

  for (const pattern of CI_CD_PATTERNS) {
    for (const file of pattern.files) {
      const fullPath = path.join(projectPath, file);
      if (fs.existsSync(fullPath)) {
        detected.push({
          platform: pattern.platform,
          configFile: file,
          features: [...pattern.features],
        });
        break; // One match per platform
      }
    }
  }

  return detected;
}

/**
 * Generates CHANGE_MANAGEMENT_POLICY.md based on detected CI/CD patterns.
 *
 * Always generated — every project benefits from a change management policy.
 * Content is tailored based on detected CI/CD platforms.
 */
export function generateChangeManagementPolicy(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string {
  const company = ctx?.companyName || "[Your Company Name]";
  const email = ctx?.contactEmail || "[your-email@example.com]";
  const date = new Date().toISOString().split("T")[0];

  const cicdDetections = detectCiCd(scan.projectPath);
  const vcs = detectVcs(scan.projectPath);
  const hasCiCd = cicdDetections.length > 0;
  const hasPayment = scan.services.some(s => s.category === "payment");
  const hasAuth = scan.services.some(s => s.category === "auth");
  const hasAI = scan.services.some(s => s.category === "ai");

  const sections: string[] = [];

  // ── Title ──────────────────────────────────────────────────────────
  sections.push(`# Change Management Policy

**Last updated:** ${date}

**Project:** ${scan.projectName}

**Company:** ${company}

---

## 1. Purpose

This policy establishes the change management process for the **${scan.projectName}** application. It defines requirements for code review, testing, deployment approval, rollback procedures, and change documentation. It supports compliance with SOC 2 CC8.1 (Change Management), ISO 27001 Annex A.12.1.2, and GDPR Article 32 (security of processing).

## 2. Scope

This policy applies to all changes to:
- Application source code
- Infrastructure configuration
- Database schemas and migrations
- Third-party service integrations
- Environment variables and secrets
- CI/CD pipeline configurations`);

  // ── Detected CI/CD ─────────────────────────────────────────────────
  if (hasCiCd || vcs) {
    sections.push(`
---

## 3. Detected CI/CD Infrastructure

The following CI/CD platforms and tools were detected in the project:

| Platform | Config File | Capabilities |
|----------|-------------|-------------|`);

    if (vcs) {
      sections.push(`| ${vcs.platform} | .git | ${vcs.features.join(", ")} |`);
    }
    for (const d of cicdDetections) {
      sections.push(`| ${d.platform} | ${d.configFile} | ${d.features.join(", ")} |`);
    }
  } else {
    sections.push(`
---

## 3. CI/CD Infrastructure

No CI/CD configuration was detected in the project. **It is strongly recommended** to implement a CI/CD pipeline for:

1. Automated testing before deployment
2. Consistent deployment procedures
3. Audit trail for all changes
4. Rollback capabilities`);
  }

  // ── Change Categories ──────────────────────────────────────────────
  sections.push(`
---

## 4. Change Categories

| Category | Description | Approval Required | Examples |
|----------|-------------|-------------------|----------|
| Standard | Routine changes following established procedures | Peer review | Bug fixes, minor UI changes, dependency updates |
| Normal | Changes requiring additional review and testing | Lead + peer review | New features, API changes, schema migrations |
| Emergency | Critical fixes for production incidents | Post-deployment review | Security patches, data breach mitigation, service outages |
| Major | Significant architectural or infrastructure changes | CTO/VP Engineering + team lead | Database migrations, service rewrites, infrastructure changes |`);

  // ── Code Review ────────────────────────────────────────────────────
  sections.push(`
---

## 5. Code Review Requirements

### 5.1 Review Standards

| Requirement | Standard | Applies To |
|------------|----------|------------|
| Minimum reviewers | 1 peer reviewer | All changes |
| Additional reviewers | 2 reviewers | Changes to auth, payment, PII handling |
| Review response time | Within 1 business day | Standard changes |
| Review response time | Within 4 hours | Emergency changes |

### 5.2 Review Checklist

Every code review must verify:

- [ ] Code follows project coding standards and patterns
- [ ] Unit tests cover new functionality and edge cases
- [ ] No hardcoded secrets, credentials, or PII in code
- [ ] Database migrations are reversible
- [ ] API changes maintain backward compatibility (or are versioned)
- [ ] Error handling is comprehensive (no swallowed exceptions)
- [ ] Logging does not include sensitive data (passwords, tokens, PII)
- [ ] Dependencies are from trusted sources with acceptable licenses`);

  if (hasPayment) {
    sections.push(`- [ ] Payment-related changes comply with PCI DSS requirements
- [ ] No credit card data is logged or stored in plaintext`);
  }
  if (hasAI) {
    sections.push(`- [ ] AI model changes include updated model cards and disclosures
- [ ] AI input/output handling follows data minimization principles`);
  }
  if (hasAuth) {
    sections.push(`- [ ] Authentication changes follow OWASP guidelines
- [ ] Session management changes maintain security properties`);
  }

  sections.push(`
### 5.3 Automated Checks

The following automated checks should gate all pull requests:

| Check | Purpose | Required to Pass |
|-------|---------|-----------------|
| Unit tests | Prevent regressions | Yes |
| Integration tests | Verify system behavior | Yes |
| Linting | Code quality and style | Yes |
| Type checking | Type safety | Yes |
| Security scanning | Vulnerability detection | Yes |
| License compliance | Open source license audit | Yes |
| Build verification | Compilation success | Yes |`);

  // ── Deployment Process ─────────────────────────────────────────────
  sections.push(`
---

## 6. Deployment Approval Process

### 6.1 Approval Matrix

| Change Category | Approvers | Environment |
|----------------|-----------|-------------|
| Standard | Automated (CI passes) | Staging, then Production |
| Normal | Team lead approval | Staging, then Production |
| Emergency | Any senior engineer (post-review within 24h) | Direct to Production |
| Major | CTO/VP Engineering + affected team leads | Staging (extended soak), then Production |

### 6.2 Deployment Steps

1. **Pre-deployment**
   - All automated checks pass (CI green)
   - Code review approved by required reviewers
   - Deployment plan documented (for Normal/Major changes)
   - Rollback plan verified

2. **Staging deployment**
   - Deploy to staging environment
   - Run smoke tests and integration tests
   - Verify no performance regressions
   - Minimum soak time: 1 hour (Standard), 24 hours (Normal), 48 hours (Major)

3. **Production deployment**
   - Deploy during approved maintenance window (or progressively via canary/blue-green)
   - Monitor error rates, latency, and key metrics
   - Verify health checks pass
   - Confirm no user-facing regressions

4. **Post-deployment**
   - Update change log
   - Notify stakeholders
   - Monitor for 1 hour minimum post-deploy`);

  // ── Rollback ───────────────────────────────────────────────────────
  sections.push(`
---

## 7. Rollback Procedures

### 7.1 Rollback Triggers

A rollback must be initiated when:

- Error rate increases by more than **5x** baseline
- Response time increases by more than **3x** baseline
- Any **data integrity** issue is detected
- Any **security vulnerability** is discovered in the deployed change
- Core user flows are **broken** (login, checkout, data access)

### 7.2 Rollback Process

| Step | Action | Responsible |
|------|--------|-------------|
| 1 | Confirm rollback decision | On-call engineer + team lead |
| 2 | Initiate rollback (revert deployment) | On-call engineer |
| 3 | Verify rollback success (health checks, smoke tests) | On-call engineer |
| 4 | Notify stakeholders | Engineering lead |
| 5 | Create post-mortem ticket | Engineering lead |
| 6 | Root cause analysis within 48 hours | Responsible team |

### 7.3 Rollback Methods`);

  if (cicdDetections.some(d => d.platform === "Kubernetes")) {
    sections.push(`
- **Kubernetes rollback:** \`kubectl rollout undo deployment/<name>\`
- **Helm rollback:** \`helm rollback <release> <revision>\``);
  }
  if (cicdDetections.some(d => d.platform === "Vercel")) {
    sections.push(`
- **Vercel rollback:** Promote previous deployment via dashboard or CLI`);
  }

  sections.push(`
- **Git revert:** Create a revert commit and deploy through normal pipeline
- **Database rollback:** Execute reverse migration scripts (must be tested pre-deployment)
- **Feature flag:** Disable feature flag to hide change without code rollback`);

  // ── Change Log ─────────────────────────────────────────────────────
  sections.push(`
---

## 8. Change Log Requirements

### 8.1 Required Documentation

Every change must be documented with:

| Field | Description | Example |
|-------|-------------|---------|
| Change ID | Unique identifier | CHG-2026-0042 |
| Date | Date of deployment | 2026-03-15 |
| Author | Who made the change | jane@company.com |
| Category | Standard / Normal / Emergency / Major | Normal |
| Description | What changed and why | Added subscription billing via Stripe |
| Impact | Systems, services, or data affected | Payment flow, user billing data |
| Approver | Who approved the change | john@company.com |
| Rollback plan | How to undo if needed | Revert PR #123, run migration down |
| Status | Planned / In Progress / Completed / Rolled Back | Completed |

### 8.2 Change Log Format

Maintain a \`CHANGELOG.md\` in the repository root using [Keep a Changelog](https://keepachangelog.com/) format:

\`\`\`markdown
## [1.2.0] - 2026-03-15
### Added
- Subscription billing via Stripe
### Changed
- Updated user profile API to include billing status
### Fixed
- Session timeout not respecting configured duration
\`\`\``);

  // ── Compliance ─────────────────────────────────────────────────────
  sections.push(`
---

## 9. Compliance Requirements

### 9.1 Audit Trail

1. All changes must be traceable through version control commits
2. Deployment logs must be retained for a minimum of **1 year**
3. Approval records must be preserved (PR reviews, deployment approvals)
4. Emergency changes must have **retroactive review** within 24 hours

### 9.2 Separation of Duties

1. The person who writes code should **not** be the sole person who approves it
2. Production deployment access should be **limited** to authorized personnel
3. Database migration execution should require **separate approval** from code changes

### 9.3 Regulatory Alignment

| Regulation | Change Management Requirement |
|-----------|-------------------------------|
| SOC 2 CC8.1 | Changes are authorized, designed, developed, configured, documented, tested, approved, and implemented |
| ISO 27001 A.12.1.2 | Change management procedures for information processing facilities |
| GDPR Art. 32 | Appropriate technical measures including ability to restore availability after incidents |
| PCI DSS 6.5 | Address common coding vulnerabilities in software development processes |`);

  // ── Footer ─────────────────────────────────────────────────────────
  sections.push(`
---

## 10. Policy Review

This change management policy should be reviewed:

- **Quarterly** as part of the security and compliance review cycle
- **When CI/CD infrastructure changes** (new platforms, tools, or workflows)
- **After a failed deployment** or rollback to identify process gaps
- **When regulatory requirements** change

For questions about this policy, contact ${email}.

---

*This Change Management Policy was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and verify all entries for accuracy. This document does not constitute legal advice.*`);

  return sections.join("\n");
}
