import * as fs from "fs";
import * as path from "path";
import { type GeneratedDocument, getDocumentCategory } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";
import { generateHtml } from "./html.js";
import { writePdf, type PdfResult } from "./pdf.js";
import { writeWidget } from "./widget.js";
import { writeBadges } from "./badge.js";
import { writeJsonOutput } from "./json-output.js";
import { writeCompliancePage } from "./compliance-page.js";
import type { ScanResult } from "../scanner/index.js";
import { writeEnvExample } from "../generator/env-example.js";
import { writeComplianceReport } from "./compliance-report.js";
import { writeCookieBanner } from "./cookie-banner.js";
import { writeNotionExport } from "./notion-export.js";
import { writeConfluenceExport } from "./confluence-export.js";
import { writeGithubWiki } from "./github-wiki.js";
import { writeDocx } from "./docx.js";

export type OutputFormat = "markdown" | "html" | "pdf" | "json" | "notion" | "confluence" | "wiki" | "docx" | "all";
export type { PdfResult };
export { writeCompliancePage } from "./compliance-page.js";
export { writeGithubWiki } from "./github-wiki.js";
export { generateComplianceReport, writeComplianceReport, generateExecutiveSummary, writeExecutiveSummary } from "./compliance-report.js";
export type { ComplianceReportOptions } from "./compliance-report.js";
export { enhanceMarkdownDocuments, type EnhanceOptions } from "./markdown-enhanced.js";

let _lastPdfResult: PdfResult | null = null;

/**
 * Returns the result from the most recent PDF generation, if any.
 */
export function getLastPdfResult(): PdfResult | null {
  return _lastPdfResult;
}

/**
 * Writes documents as individual Markdown files (current/default behavior).
 */
export function writeMarkdown(
  docs: GeneratedDocument[],
  outputDir: string
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const writtenFiles: string[] = [];

  for (const doc of docs) {
    const category = doc.category || getDocumentCategory(doc.filename);
    let targetDir = outputDir;
    if (category) {
      targetDir = path.join(outputDir, category);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }
    const filePath = path.join(targetDir, doc.filename);
    fs.writeFileSync(filePath, doc.content, "utf-8");
    writtenFiles.push(filePath);
  }

  return writtenFiles;
}

/**
 * Writes documents as a single self-contained HTML file (legal/index.html).
 */
export function writeHtml(
  docs: GeneratedDocument[],
  outputDir: string,
  config?: CodepliantConfig
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const html = generateHtml(docs, {
    companyName: config?.companyName,
    lastUpdated: new Date().toISOString().split("T")[0],
  });

  const filePath = path.join(outputDir, "index.html");
  fs.writeFileSync(filePath, html, "utf-8");
  return [filePath];
}

/**
 * Determines the output format from config, defaulting to 'markdown'.
 */
export function getOutputFormat(config?: CodepliantConfig): OutputFormat {
  if (config?.outputFormat) {
    const fmt = config.outputFormat;
    if (fmt === "markdown" || fmt === "html" || fmt === "pdf" || fmt === "json" || fmt === "notion" || fmt === "confluence" || fmt === "wiki" || fmt === "docx" || fmt === "all") {
      return fmt;
    }
  }
  return "markdown";
}

/**
 * Writes documents in the specified format(s).
 * Returns list of all written file paths.
 */
export function writeDocumentsInFormat(
  docs: GeneratedDocument[],
  outputDir: string,
  format: OutputFormat,
  config?: CodepliantConfig,
  scanResult?: ScanResult
): string[] {
  const writtenFiles: string[] = [];

  if (format === "markdown" || format === "all") {
    writtenFiles.push(...writeMarkdown(docs, outputDir));
  }

  if (format === "html" || format === "all") {
    writtenFiles.push(...writeHtml(docs, outputDir, config));
    writtenFiles.push(
      ...writeWidget(docs, outputDir, {
        companyName: config?.companyName,
        lastUpdated: new Date().toISOString().split("T")[0],
      })
    );
  }

  if (format === "pdf" || format === "all") {
    const { files, result } = writePdf(docs, outputDir, config);
    writtenFiles.push(...files);
    _lastPdfResult = result;
  }

  if ((format === "json" || format === "all") && scanResult) {
    writtenFiles.push(...writeJsonOutput(docs, outputDir, scanResult, config));
  }

  if (format === "html" || format === "all") {
    writtenFiles.push(
      ...writeCompliancePage(docs, outputDir, {
        companyName: config?.companyName,
        lastUpdated: new Date().toISOString().split("T")[0],
      })
    );
  }

  if (format === "notion" || format === "all") {
    writtenFiles.push(...writeNotionExport(docs, outputDir, config));
  }

  if (format === "confluence" || format === "all") {
    writtenFiles.push(...writeConfluenceExport(docs, outputDir, config));
  }

  if (format === "wiki" || format === "all") {
    writtenFiles.push(...writeGithubWiki(docs, outputDir, config));
  }

  if (format === "docx" || format === "all") {
    writtenFiles.push(...writeDocx(docs, outputDir, config));
  }

  if (format === "all" && scanResult) {
    writtenFiles.push(...writeBadges(scanResult, outputDir));

    // Generate .env.example from detected services
    const envExamplePath = writeEnvExample(scanResult, outputDir);
    if (envExamplePath) {
      writtenFiles.push(envExamplePath);
    }

    // Generate cookie consent banner
    writtenFiles.push(
      ...writeCookieBanner(scanResult, outputDir, {
        companyName: config?.companyName,
      })
    );
  }

  return writtenFiles;
}
