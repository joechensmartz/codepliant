#!/usr/bin/env bash
set -euo pipefail

PROJECT_PATH="${INPUT_PATH:-.}"
OUTPUT_DIR="${INPUT_OUTPUT_DIR:-legal}"
FAIL_ON_MISSING="${INPUT_FAIL_ON_MISSING:-false}"
FORMAT="${INPUT_FORMAT:-markdown}"
COMMENT_ON_PR="${INPUT_COMMENT_ON_PR:-true}"

echo "::group::Codepliant Scan"
echo "Scanning: $PROJECT_PATH"
echo "Output dir: $OUTPUT_DIR"
echo "Format: $FORMAT"
echo "Fail on missing: $FAIL_ON_MISSING"
echo "Comment on PR: $COMMENT_ON_PR"
echo ""

# Run the scan to get JSON results for analysis
SCAN_OUTPUT=$(npx codepliant scan "$PROJECT_PATH" --json 2>/dev/null || true)

if [ -z "$SCAN_OUTPUT" ]; then
  echo "::warning::Codepliant produced no scan output."
  echo "services-count=0" >> "$GITHUB_OUTPUT"
  echo "documents-count=0" >> "$GITHUB_OUTPUT"
  echo "compliance-score=100" >> "$GITHUB_OUTPUT"
  echo "::endgroup::"
  exit 0
fi

# Generate documents if output dir is specified
FORMAT_FLAG=""
if [ "$FORMAT" != "markdown" ]; then
  FORMAT_FLAG="--format $FORMAT"
fi
npx codepliant go "$PROJECT_PATH" --output "$OUTPUT_DIR" $FORMAT_FLAG 2>/dev/null || true

# Parse results with Node.js
PARSED=$(echo "$SCAN_OUTPUT" | node -e "
  const fs = require('fs');
  const input = fs.readFileSync('/dev/stdin', 'utf8');
  try {
    const data = JSON.parse(input);
    const services = data.services || [];
    const needs = data.complianceNeeds || [];

    // Count services
    const serviceCount = services.length;

    // Count documents needed
    const docsCount = needs.length;

    // Calculate compliance score
    const outputDir = process.argv[1] || 'legal';
    const projectPath = process.argv[2] || '.';
    const path = require('path');
    const absOutputDir = path.resolve(projectPath, outputDir);

    const docFileMap = {
      'Privacy Policy': ['PRIVACY_POLICY.md', 'PRIVACY_POLICY.html'],
      'Terms of Service': ['TERMS_OF_SERVICE.md', 'TERMS_OF_SERVICE.html'],
      'AI Disclosure': ['AI_DISCLOSURE.md', 'AI_DISCLOSURE.html'],
      'Cookie Policy': ['COOKIE_POLICY.md', 'COOKIE_POLICY.html'],
      'Data Processing Agreement': ['DATA_PROCESSING_AGREEMENT.md', 'DATA_PROCESSING_AGREEMENT.html'],
      'Refund Policy': ['REFUND_POLICY.md', 'REFUND_POLICY.html'],
      'Security Policy': ['SECURITY_POLICY.md', 'SECURITY_POLICY.html'],
    };

    let score = 100;
    if (needs.length > 0) {
      let earned = 0;
      let total = 0;
      for (const need of needs) {
        const weight = need.priority === 'required' ? 15 : 5;
        total += weight;
        const filenames = docFileMap[need.document] || [];
        const exists = filenames.some(f => {
          try { fs.accessSync(path.join(absOutputDir, f)); return true; } catch { return false; }
        });
        if (exists) earned += weight;
      }
      score = total > 0 ? Math.round((earned / total) * 100) : 100;
    }

    // Build service summary for PR comment
    const serviceLines = services.map(s => {
      const icons = { ai: '🤖', payment: '💳', analytics: '📊', auth: '🔐', email: '📧', database: '🗄️', storage: '📁', monitoring: '🔍', advertising: '📢', social: '👥', other: '📦' };
      const icon = icons[s.category] || '📦';
      return '| ' + icon + ' ' + s.name + ' | ' + s.category + ' | ' + s.dataCollected.join(', ') + ' |';
    }).join('\n');

    const needLines = needs.map(n => {
      const icon = n.priority === 'required' ? '🔴' : '🟡';
      return '| ' + icon + ' ' + n.document + ' | ' + n.priority + ' | ' + n.reason + ' |';
    }).join('\n');

    // Score badge
    let scoreEmoji = '🔴';
    if (score > 80) scoreEmoji = '🟢';
    else if (score > 60) scoreEmoji = '🟡';

    const result = {
      serviceCount,
      docsCount,
      score,
      serviceLines,
      needLines,
      scoreEmoji,
      hasAI: services.some(s => s.category === 'ai'),
      missingRequired: needs.filter(n => {
        if (n.priority !== 'required') return false;
        const filenames = docFileMap[n.document] || [];
        return !filenames.some(f => {
          try { fs.accessSync(path.join(absOutputDir, f)); return true; } catch { return false; }
        });
      }).map(n => n.document),
    };

    console.log(JSON.stringify(result));
  } catch (e) {
    console.error('Parse error: ' + e.message);
    console.log(JSON.stringify({ serviceCount: 0, docsCount: 0, score: 100, serviceLines: '', needLines: '', scoreEmoji: '🟢', hasAI: false, missingRequired: [] }));
  }
" "$OUTPUT_DIR" "$PROJECT_PATH" 2>/dev/null)

SERVICE_COUNT=$(echo "$PARSED" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.serviceCount)")
DOCS_COUNT=$(echo "$PARSED" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.docsCount)")
COMPLIANCE_SCORE=$(echo "$PARSED" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.score)")
SCORE_EMOJI=$(echo "$PARSED" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.scoreEmoji)")
SERVICE_LINES=$(echo "$PARSED" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.serviceLines)")
NEED_LINES=$(echo "$PARSED" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.needLines)")
MISSING_REQUIRED=$(echo "$PARSED" | node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); console.log(d.missingRequired.join(', '))")

echo ""
echo "Services found: $SERVICE_COUNT"
echo "Documents needed: $DOCS_COUNT"
echo "Compliance score: $COMPLIANCE_SCORE%"
echo ""

# Set outputs
echo "services-count=$SERVICE_COUNT" >> "$GITHUB_OUTPUT"
echo "documents-count=$DOCS_COUNT" >> "$GITHUB_OUTPUT"
echo "compliance-score=$COMPLIANCE_SCORE" >> "$GITHUB_OUTPUT"

echo "::endgroup::"

# Post PR comment if enabled and in a pull request context
if [ "$COMMENT_ON_PR" = "true" ] && [ "${GITHUB_EVENT_NAME:-}" = "pull_request" ]; then
  echo "::group::PR Comment"

  PR_NUMBER=$(node -e "
    const fs = require('fs');
    try {
      const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      console.log(event.pull_request.number);
    } catch { console.log(''); }
  ")

  if [ -n "$PR_NUMBER" ] && [ -n "${GITHUB_TOKEN:-}" ]; then
    COMMENT_BODY="## $SCORE_EMOJI Codepliant Compliance Report

**Compliance Score: ${COMPLIANCE_SCORE}%**

### Services Detected ($SERVICE_COUNT)
"

    if [ "$SERVICE_COUNT" -gt 0 ] 2>/dev/null; then
      COMMENT_BODY="${COMMENT_BODY}
| Service | Category | Data Collected |
|---------|----------|----------------|
${SERVICE_LINES}
"
    else
      COMMENT_BODY="${COMMENT_BODY}
No third-party services detected.
"
    fi

    if [ "$DOCS_COUNT" -gt 0 ] 2>/dev/null; then
      COMMENT_BODY="${COMMENT_BODY}
### Documents Needed ($DOCS_COUNT)

| Document | Priority | Reason |
|----------|----------|--------|
${NEED_LINES}
"
    fi

    if [ -n "$MISSING_REQUIRED" ]; then
      COMMENT_BODY="${COMMENT_BODY}
> **Missing required documents:** ${MISSING_REQUIRED}
> Run \`npx codepliant go\` to generate them.
"
    fi

    COMMENT_BODY="${COMMENT_BODY}
---
*Generated by [Codepliant](https://github.com/joechensmartz/codepliant) — compliance documents from your actual code*"

    # Delete previous codepliant comments to avoid spam
    EXISTING_COMMENTS=$(gh api \
      "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments" \
      --jq '.[] | select(.body | contains("Codepliant Compliance Report")) | .id' 2>/dev/null || true)

    for COMMENT_ID in $EXISTING_COMMENTS; do
      gh api \
        --method DELETE \
        "repos/${GITHUB_REPOSITORY}/issues/comments/${COMMENT_ID}" 2>/dev/null || true
    done

    # Post the new comment
    gh api \
      --method POST \
      "repos/${GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments" \
      -f body="$COMMENT_BODY" || echo "::warning::Failed to post PR comment. Ensure GITHUB_TOKEN has write permissions."

    echo "Posted compliance report to PR #${PR_NUMBER}"
  else
    echo "::warning::Could not determine PR number or GITHUB_TOKEN not set. Skipping PR comment."
  fi

  echo "::endgroup::"
fi

# Fail if required documents are missing
if [ "$FAIL_ON_MISSING" = "true" ] && [ -n "$MISSING_REQUIRED" ]; then
  echo ""
  echo "::error::Required compliance documents are missing: ${MISSING_REQUIRED}"
  echo "Run 'npx codepliant go' to generate them."
  exit 1
fi

echo ""
echo "Codepliant scan complete."
