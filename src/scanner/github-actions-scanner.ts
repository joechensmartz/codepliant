import * as fs from "fs";
import * as path from "path";
import type { DetectedService } from "./types.js";

/**
 * Scans .github/workflows/ for GitHub Actions that may process data
 * or indicate CI/CD infrastructure relevant to compliance.
 */
export function scanGitHubActions(projectPath: string): DetectedService[] {
  const services: DetectedService[] = [];
  const workflowDir = path.join(projectPath, ".github", "workflows");

  if (!fs.existsSync(workflowDir)) return services;

  let files: string[];
  try {
    files = fs.readdirSync(workflowDir).filter((f) => f.endsWith(".yml") || f.endsWith(".yaml"));
  } catch {
    return services;
  }

  const detectedActions = new Set<string>();

  for (const file of files) {
    const filePath = path.join(workflowDir, file);
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    // Detect deployment-related actions
    const actionPatterns: { pattern: RegExp; name: string; category: DetectedService["category"]; dataCollected: string[] }[] = [
      { pattern: /uses:\s*['"]?actions\/upload-artifact/i, name: "GitHub Artifacts", category: "storage", dataCollected: ["build artifacts", "CI/CD outputs"] },
      { pattern: /uses:\s*['"]?aws-actions\//i, name: "AWS (via GitHub Actions)", category: "storage", dataCollected: ["deployment artifacts", "cloud infrastructure"] },
      { pattern: /uses:\s*['"]?google-github-actions\//i, name: "GCP (via GitHub Actions)", category: "storage", dataCollected: ["deployment artifacts", "cloud infrastructure"] },
      { pattern: /uses:\s*['"]?azure\/login/i, name: "Azure", category: "storage", dataCollected: ["deployment artifacts", "cloud infrastructure"] },
      { pattern: /uses:\s*['"]?docker\/login-action/i, name: "Docker Hub", category: "other", dataCollected: ["container images"] },
      { pattern: /uses:\s*['"]?codecov\/codecov-action/i, name: "Codecov", category: "monitoring", dataCollected: ["code coverage data"] },
      { pattern: /uses:\s*['"]?sonarsource\/sonarcloud-github-action/i, name: "SonarCloud", category: "monitoring", dataCollected: ["code quality metrics"] },
    ];

    for (const ap of actionPatterns) {
      if (ap.pattern.test(content) && !detectedActions.has(ap.name)) {
        detectedActions.add(ap.name);
        services.push({
          name: ap.name,
          category: ap.category,
          evidence: [{ type: "code_pattern", file: filePath, detail: `Found ${ap.name} action in ${file}` }],
          dataCollected: ap.dataCollected,
          isDataProcessor: false,
        });
      }
    }

    // Detect cloud providers from secret references
    const secretPatterns: { pattern: RegExp; name: string; category: DetectedService["category"]; dataCollected: string[] }[] = [
      { pattern: /secrets\.AWS_/i, name: "AWS (via GitHub Actions)", category: "storage", dataCollected: ["deployment artifacts", "cloud infrastructure"] },
      { pattern: /secrets\.GCP_|secrets\.GOOGLE_/i, name: "GCP (via GitHub Actions)", category: "storage", dataCollected: ["deployment artifacts", "cloud infrastructure"] },
      { pattern: /secrets\.AZURE_/i, name: "Azure", category: "storage", dataCollected: ["deployment artifacts", "cloud infrastructure"] },
    ];

    for (const sp of secretPatterns) {
      if (sp.pattern.test(content) && !detectedActions.has(sp.name)) {
        detectedActions.add(sp.name);
        services.push({
          name: sp.name,
          category: sp.category,
          evidence: [{ type: "code_pattern", file: filePath, detail: `Found ${sp.name} secrets in ${file}` }],
          dataCollected: sp.dataCollected,
          isDataProcessor: false,
        });
      }
    }
  }

  return services;
}
