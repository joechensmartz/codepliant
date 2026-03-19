import * as fs from "fs";
import * as path from "path";
import { type GeneratedDocument, getDocumentCategory } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";
import { generateHtml, generateSingleDocHtml } from "./html.js";
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
 * Writes each document as an individual HTML file alongside the Markdown,
 * preserving category subdirectories.
 */
export function writeIndividualHtml(
  docs: GeneratedDocument[],
  outputDir: string,
  config?: CodepliantConfig
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const writtenFiles: string[] = [];
  const lastUpdated = new Date().toISOString().split("T")[0];

  for (const doc of docs) {
    // Skip non-Markdown files (e.g., .json config files)
    if (!doc.filename.endsWith(".md")) continue;

    const category = doc.category || getDocumentCategory(doc.filename);
    let targetDir = outputDir;
    if (category) {
      targetDir = path.join(outputDir, category);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
    }
    const html = generateSingleDocHtml(doc, {
      companyName: config?.companyName,
      lastUpdated,
    });
    const htmlFilename = doc.filename.replace(/\.md$/, ".html");
    const filePath = path.join(targetDir, htmlFilename);
    fs.writeFileSync(filePath, html, "utf-8");
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
 * Writes each document as an individual PDF file alongside the Markdown,
 * preserving category subdirectories. Uses puppeteer for HTML-to-PDF conversion.
 * Silently skips if puppeteer is not installed.
 */
export async function writeIndividualPdf(
  docs: GeneratedDocument[],
  outputDir: string,
  config?: CodepliantConfig
): Promise<string[]> {
  // Try puppeteer (full) first, then puppeteer-core + @sparticuz/chromium (Lambda)
  let browser: any;
  try {
    const puppeteer = await (Function('return import("puppeteer")')() as Promise<any>);
    browser = await puppeteer.default.launch({ headless: true, args: ["--no-sandbox"] });
  } catch {
    try {
      const puppeteerCore = await (Function('return import("puppeteer-core")')() as Promise<any>);
      const chromium = await (Function('return import("@sparticuz/chromium")')() as Promise<any>);
      browser = await puppeteerCore.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless,
      });
    } catch {
      // Neither puppeteer nor puppeteer-core available, skip PDF
      return [];
    }
  }
  const writtenFiles: string[] = [];
  const lastUpdated = new Date().toISOString().split("T")[0];
  const CONCURRENCY = 3;

  const mdDocs = docs.filter(d => d.filename.endsWith(".md"));

  // Prepare output dirs upfront
  for (const doc of mdDocs) {
    const category = doc.category || getDocumentCategory(doc.filename);
    if (category) {
      const targetDir = path.join(outputDir, category);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    }
  }

  const renderOne = async (doc: GeneratedDocument) => {
    const category = doc.category || getDocumentCategory(doc.filename);
    const targetDir = category ? path.join(outputDir, category) : outputDir;
    const html = generateSingleDocHtml(doc, { companyName: config?.companyName, lastUpdated });
    const page = await browser.newPage();
    try {
      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfFilename = doc.filename.replace(/\.md$/, ".pdf");
      const pdfPath = path.join(targetDir, pdfFilename);
      await page.pdf({
        path: pdfPath,
        format: "A4",
        margin: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
        printBackground: true,
      });
      return pdfPath;
    } finally {
      await page.close();
    }
  };

  try {
    // Process in batches of CONCURRENCY
    for (let i = 0; i < mdDocs.length; i += CONCURRENCY) {
      const batch = mdDocs.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map(renderOne));
      writtenFiles.push(...results);
    }
  } finally {
    await browser.close();
  }

  return writtenFiles;
}

/**
 * Writes documents in the specified format(s).
 * Returns list of all written file paths.
 */
export async function writeDocumentsInFormat(
  docs: GeneratedDocument[],
  outputDir: string,
  format: OutputFormat,
  config?: CodepliantConfig,
  scanResult?: ScanResult
): Promise<string[]> {
  const writtenFiles: string[] = [];
  const isCloud = process.env.CODEPLIANT_CLOUD === "true";
  const PAID_FORMATS: OutputFormat[] = ["html", "pdf", "docx", "notion", "confluence", "wiki"];

  // Gate: non-markdown formats require cloud/paid service
  if (!isCloud && format !== "markdown" && format !== "json") {
    const requestedPaid = format === "all" ? "HTML, PDF, DOCX" : format.toUpperCase();
    console.log(
      `\n  ℹ ${requestedPaid} format requires Codepliant Cloud.\n` +
      `  Markdown output will be generated instead.\n` +
      `  Upgrade at https://www.codepliant.site/pricing\n`
    );
    // Always generate markdown as fallback
    writtenFiles.push(...writeMarkdown(docs, outputDir));
    if (scanResult) {
      writtenFiles.push(...writeJsonOutput(docs, outputDir, scanResult, config));
    }
    return writtenFiles;
  }

  if (format === "markdown" || format === "all") {
    writtenFiles.push(...writeMarkdown(docs, outputDir));
  }

  if (format === "html" || format === "all") {
    writtenFiles.push(...writeIndividualHtml(docs, outputDir, config));
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

    // Individual per-doc PDFs via puppeteer
    const pdfFiles = await writeIndividualPdf(docs, outputDir, config);
    writtenFiles.push(...pdfFiles);
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
