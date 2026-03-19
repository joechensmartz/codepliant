> **Automate compliance for Acme Inc with Codepliant.**
> Never ship non-compliant code again.
> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18

*Generated on 2026-03-18 | 8 services detected*

---

## 1. Overview

Manual compliance is slow, error-prone, and expensive. This guide shows how to:

1. **Integrate Codepliant into CI/CD** — Block PRs that introduce new services without updated docs
2. **Schedule periodic scans** — Catch drift between code and compliance docs
3. **Set up webhook alerts** — Get notified when compliance status changes
4. **Keep docs evergreen** — Best practices for maintaining compliance over time

**Time to set up:** ~30 minutes
**ROI:** Save 4-8 hours per week on manual compliance reviews

---

## 2. CI/CD Integration

### 2.1 GitHub Actions

Add this workflow to `.github/workflows/compliance.yml`:

```yaml
name: Compliance Check

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Codepliant
        run: npm install -g codepliant

      - name: Scan for compliance
        run: codepliant check . --json > compliance-result.json

      - name: Validate existing docs
        run: codepliant validate .

      - name: Check for drift
        run: |
          codepliant diff .
          if [ $? -ne 0 ]; then
            echo "::warning::Compliance documents are out of date"
          fi

      - name: Upload compliance report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: compliance-report
          path: compliance-result.json
```

### 2.2 GitLab CI

Add to `.gitlab-ci.yml`:

```yaml
compliance:
  stage: test
  image: node:20
  script:
    - npm install -g codepliant
    - codepliant check . --json > compliance-result.json
    - codepliant validate .
    - codepliant diff .
  artifacts:
    when: always
    paths:
      - compliance-result.json
    expire_in: 30 days
  rules:
    - if: $CI_MERGE_REQUEST_ID
    - if: $CI_COMMIT_BRANCH == "main"
```

### 2.3 CircleCI

Add to `.circleci/config.yml`:

```yaml
version: 2.1

jobs:
  compliance:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run:
          name: Install Codepliant
          command: npm install -g codepliant
      - run:
          name: Compliance check
          command: codepliant check . --json > compliance-result.json
      - run:
          name: Validate docs
          command: codepliant validate .
      - store_artifacts:
          path: compliance-result.json

workflows:
  main:
    jobs:
      - compliance
```

### 2.4 Pre-commit Hook

Catch compliance issues before they even reach CI:

```bash
# Install the pre-commit hook
codepliant hook install

# Or manually add to .husky/pre-commit or lefthook.yml:
codepliant check . --quiet
```

The pre-commit hook will:
- Run a quick scan (~2 seconds)
- Block commits that add new services without updating docs
- Show actionable fix suggestions

---

## 3. Scheduled Scanning (Cron)

### 3.1 Using Codepliant's Built-in Scheduler

```bash
# Schedule weekly scans
codepliant schedule install --frequency weekly

# Schedule daily scans (recommended for regulated industries)
codepliant schedule install --frequency daily

# Check schedule status
codepliant schedule status

# Remove scheduled scans
codepliant schedule uninstall
```

### 3.2 Custom Cron Setup

For more control, use crontab directly:

```bash
# Edit crontab
crontab -e

# Weekly scan every Monday at 9am
0 9 * * 1 cd /path/to/project && codepliant go . --quiet --format json 2>&1 | tee /var/log/codepliant-scan.log

# Daily drift check at 8am
0 8 * * * cd /path/to/project && codepliant diff . --json > /tmp/compliance-diff.json 2>&1
```

### 3.3 GitHub Actions Scheduled Workflow

```yaml
name: Scheduled Compliance Scan

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9am UTC
  workflow_dispatch:       # Allow manual trigger

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Codepliant
        run: npm install -g codepliant

      - name: Full compliance scan
        run: codepliant go . --format json --quiet

      - name: Generate report
        run: codepliant report . --format html

      - name: Check for drift
        id: drift
        run: |
          OUTPUT=$(codepliant diff . 2>&1)
          if echo "$OUTPUT" | grep -q "changes detected"; then
            echo "drift=true" >> $GITHUB_OUTPUT
            echo "$OUTPUT"
          else
            echo "drift=false" >> $GITHUB_OUTPUT
          fi

      - name: Create issue if drift detected
        if: steps.drift.outputs.drift == 'true'
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Compliance docs out of date',
              body: 'Scheduled compliance scan detected drift between code and compliance documents. Run `codepliant update` to fix.',
              labels: ['compliance', 'automated']
            });
```

---

## 4. Webhook Alerts

### 4.1 Slack Notifications

```bash
# Send compliance status to Slack
codepliant notify --webhook https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Include in CI/CD:
codepliant go . --quiet && \
  codepliant notify --webhook $SLACK_WEBHOOK_URL
```

### 4.2 Email Alerts

```bash
# Configure email notifications
codepliant notify --email compliance-team@acmeinc.com

# Or use the compliance summary email generator:
# The COMPLIANCE_SUMMARY_EMAIL.md is auto-generated and can be sent via your mail system
```

### 4.3 Custom Webhook Integration

```bash
# Generic webhook (works with Zapier, n8n, Make, etc.)
codepliant notify --webhook https://your-webhook-endpoint.com/compliance

# The webhook payload looks like:
# {
#   "project": "nextjs-saas-example",
#   "services_detected": 8,
#   "compliance_score": 85,
#   "documents_generated": 25,
#   "drift_detected": false,
#   "timestamp": "2026-03-18T09:00:00Z"
# }
```

### 4.4 PagerDuty (Critical Compliance Failures)

For payment-processing environments where compliance failures are critical:

```yaml
# In your CI/CD pipeline:
- name: Compliance gate
  run: |
    SCORE=$(codepliant count . --json | jq '.compliance_score')
    if [ "$SCORE" -lt 70 ]; then
      curl -X POST https://events.pagerduty.com/v2/enqueue \
        -H "Content-Type: application/json" \
        -d '{
          "routing_key": "'$PD_ROUTING_KEY'",
          "event_action": "trigger",
          "payload": {
            "summary": "Compliance score dropped below 70%",
            "severity": "critical",
            "source": "codepliant"
          }
        }'
      exit 1
    fi
```

---

## 5. Automation Best Practices

### 5.1 Keep Docs in Sync with Code

| Practice | How | Frequency |
|----------|-----|-----------|
| Pre-commit scan | `codepliant hook install` | Every commit |
| CI/CD gate | Block PRs with compliance drift | Every PR |
| Scheduled full scan | `codepliant schedule install --frequency weekly` | Weekly |
| Quarterly review | `codepliant report . --format pdf` | Quarterly |

### 5.2 Version Control Your Compliance Docs

```bash
# Always commit compliance docs alongside code changes
git add legal/
git commit -m "chore: update compliance docs for new service integration"
```

**Why?** Git history provides an audit trail showing when compliance docs were updated and by whom — valuable for audits.

### 5.3 Automate Document Regeneration

```bash
# In your CI/CD pipeline, auto-regenerate and commit:
codepliant update .
git diff --quiet legal/ || {
  git add legal/
  git commit -m "chore(compliance): auto-update compliance documents"
  git push
}
```

### 5.4 Monitor for New Services

When a developer adds a new dependency that processes user data:

1. **Pre-commit hook** catches it immediately
2. **CI/CD check** blocks the PR
3. **Developer runs** `codepliant update` to regenerate docs
4. **PR includes** both code change and updated compliance docs

### 5.5 Compliance Score Tracking

Track your compliance score over time:

```bash
# Output score as JSON for tracking
codepliant count . --json | jq '.compliance_score'

# Store in a time-series database or spreadsheet
DATE=$(date +%Y-%m-%d)
SCORE=$(codepliant count . --json | jq '.compliance_score')
echo "$DATE,$SCORE" >> compliance-score-history.csv
```

### 5.6 Multi-Project (Monorepo) Setup

```bash
# Scan all projects under a directory
codepliant scan-all /path/to/monorepo

# Generate docs for all projects
codepliant generate-all /path/to/monorepo

# Compare compliance across projects
codepliant compare /path/to/project-a /path/to/project-b
```

---

## 6. Recommended Automation Pipeline

```
Developer writes code
        │
        ▼
  ┌─────────────┐
  │ Pre-commit   │  codepliant check (2 sec)
  │ hook         │  Blocks if new service without docs
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ CI/CD        │  codepliant validate + diff
  │ pipeline     │  Blocks PR if docs are stale
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Auto-update  │  codepliant update (on main branch merge)
  │ on merge     │  Regenerate + commit docs
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Weekly scan  │  codepliant go --format json
  │ (cron)       │  Full scan + report
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Notify       │  Slack/email/webhook
  │ stakeholders │  Score, drift, action items
  └─────────────┘
```

---

## 7. Compliance as Code Maturity Model

| Level | Description | Automation |
|-------|-------------|------------|
| **Level 0** | No compliance docs | None |
| **Level 1** | Manual docs, occasionally updated | `codepliant go` run manually |
| **Level 2** | Docs in version control | Pre-commit hook installed |
| **Level 3** | CI/CD compliance gate | PRs blocked without updated docs |
| **Level 4** | Fully automated pipeline | Scheduled scans + auto-regeneration + alerts |
| **Level 5** | Continuous compliance | Real-time monitoring + dashboards + audit trail |

**Your current level based on 8 detected services:** Target Level 3-4

---

## 8. Troubleshooting

| Issue | Solution |
|-------|----------|
| CI scan takes too long | Use `codepliant check` (fast) instead of `codepliant go` (full) |
| False positives in drift | Add stable sections to `.codepliantrc.json` ignore list |
| Pre-commit hook too slow | Use `codepliant check --quiet` for minimal output |
| Monorepo scan misses projects | Use `codepliant scan-all` with explicit root path |
| Score fluctuates | Pin Codepliant version in CI (`npm install -g codepliant@2026`) |

---

## 9. Environment Variables for CI/CD

| Variable | Purpose | Required |
|----------|---------|----------|
| `CODEPLIANT_OUTPUT` | Override output directory | No |
| `CODEPLIANT_FORMAT` | Default output format | No |
| `CODEPLIANT_QUIET` | Suppress output (`1` or `true`) | No |
| `NO_COLOR` | Disable colored output | No |
| `SLACK_WEBHOOK_URL` | Slack notification endpoint | For alerts |
| `CODEPLIANT_LICENSE` | Pro/Team license key | For premium features |

---

*This guide was auto-generated by Codepliant based on analysis of 8 services in your codebase. Customize the CI/CD examples for your specific setup.*

---

> **Disclaimer:** This guide provides automation recommendations based on code analysis. Review and adapt the configurations to your specific infrastructure and compliance requirements.
