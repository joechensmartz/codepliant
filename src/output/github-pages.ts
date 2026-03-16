import * as fs from "fs";
import * as path from "path";
import type { GeneratedDocument } from "../generator/index.js";

/**
 * Generates a static HTML site from all compliance documents,
 * suitable for deployment to GitHub Pages.
 *
 * Output structure:
 *   docs/
 *     index.html        — Navigation page with links to all documents
 *     <doc-slug>.html   — Individual document pages
 *     style.css         — Shared stylesheet
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function formatInline(text: string): string {
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

/**
 * Simple markdown to HTML body content (no wrapping html/head).
 */
function markdownToHtmlBody(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let inBlockquote = false;
  let bqContent: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  function closeList() {
    if (inList) { result.push(`</${listType}>`); inList = false; }
  }
  function closeBlockquote() {
    if (inBlockquote) { result.push(`<blockquote><p>${formatInline(bqContent.join(" "))}</p></blockquote>`); inBlockquote = false; bqContent = []; }
  }
  function closeTable() {
    if (inTable && tableRows.length > 0) {
      let html = '<table><thead><tr>';
      for (const cell of tableRows[0]) html += `<th>${formatInline(cell.trim())}</th>`;
      html += '</tr></thead><tbody>';
      for (let r = 1; r < tableRows.length; r++) {
        html += '<tr>';
        for (const cell of tableRows[r]) html += `<td>${formatInline(cell.trim())}</td>`;
        html += '</tr>';
      }
      html += '</tbody></table>';
      result.push(html);
      inTable = false; tableRows = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) { result.push(`<pre><code>${escapeHtml(codeContent.join("\n"))}</code></pre>`); codeContent = []; inCodeBlock = false; }
      else { closeList(); closeBlockquote(); closeTable(); inCodeBlock = true; }
      continue;
    }
    if (inCodeBlock) { codeContent.push(line); continue; }

    const trimmed = line.trim();
    if (trimmed === "") { closeList(); closeBlockquote(); closeTable(); continue; }

    // Table
    if (trimmed.includes("|")) {
      const cells = trimmed.replace(/^\|/, "").replace(/\|$/, "").split("|");
      if (cells.length >= 2) {
        if (!inTable && i + 1 < lines.length && /^\|?\s*[-:]+[-|\s:]*$/.test(lines[i + 1].trim())) {
          closeList(); closeBlockquote(); inTable = true; tableRows = [cells]; i++; continue;
        }
        if (inTable) { tableRows.push(cells); continue; }
      }
    } else if (inTable) { closeTable(); }

    if (/^(---+|\*\*\*+|___+)$/.test(trimmed)) { closeList(); closeBlockquote(); closeTable(); result.push("<hr>"); continue; }

    const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) { closeList(); closeBlockquote(); closeTable(); const lvl = hMatch[1].length; result.push(`<h${lvl}>${formatInline(hMatch[2])}</h${lvl}>`); continue; }

    if (trimmed.startsWith("> ")) { closeList(); closeTable(); if (!inBlockquote) { inBlockquote = true; bqContent = []; } bqContent.push(trimmed.slice(2)); continue; }
    else if (inBlockquote) { closeBlockquote(); }

    const cbMatch = trimmed.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (cbMatch) { closeBlockquote(); closeTable(); if (!inList || listType !== "ul") { closeList(); listType = "ul"; inList = true; result.push('<ul class="checklist">'); } const checked = cbMatch[1] !== " " ? " checked" : ""; result.push(`<li><input type="checkbox" disabled${checked}> ${formatInline(cbMatch[2])}</li>`); continue; }

    if (/^[-*+]\s+/.test(trimmed)) { closeBlockquote(); closeTable(); if (!inList || listType !== "ul") { closeList(); listType = "ul"; inList = true; result.push("<ul>"); } result.push(`<li>${formatInline(trimmed.replace(/^[-*+]\s+/, ""))}</li>`); continue; }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) { closeBlockquote(); closeTable(); if (!inList || listType !== "ol") { closeList(); listType = "ol"; inList = true; result.push("<ol>"); } result.push(`<li>${formatInline(olMatch[2])}</li>`); continue; }

    closeList(); closeBlockquote(); closeTable();
    result.push(`<p>${formatInline(trimmed)}</p>`);
  }
  closeList(); closeBlockquote(); closeTable();
  return result.join("\n");
}

function generateSharedCSS(): string {
  return `
:root {
  --text: #1d1d1f;
  --text-secondary: #6e6e73;
  --bg: #fff;
  --bg-alt: #f5f5f7;
  --accent: #0066cc;
  --border: #d2d2d7;
  --sidebar-bg: #fafafa;
}
@media (prefers-color-scheme: dark) {
  :root {
    --text: #f5f5f7;
    --text-secondary: #a1a1a6;
    --bg: #000;
    --bg-alt: #1d1d1f;
    --accent: #2997ff;
    --border: #424245;
    --sidebar-bg: #111;
  }
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 17px; line-height: 1.47; color: var(--text); background: var(--bg);
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 720px; margin: 0 auto; padding: 60px 24px 100px; }
h1 { font-size: 36px; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 8px; }
h2 { font-size: 26px; font-weight: 700; margin-top: 48px; margin-bottom: 12px; }
h3 { font-size: 20px; font-weight: 600; margin-top: 36px; margin-bottom: 8px; }
h4 { font-size: 17px; font-weight: 600; margin-top: 28px; margin-bottom: 8px; }
p { margin-bottom: 14px; }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
strong { font-weight: 600; }
ul, ol { margin: 8px 0 14px 24px; }
li { margin-bottom: 5px; }
blockquote { border-left: 3px solid var(--border); padding-left: 18px; color: var(--text-secondary); margin: 14px 0; }
pre { background: var(--bg-alt); border-radius: 8px; padding: 14px 18px; overflow-x: auto; margin: 14px 0; font-size: 14px; line-height: 1.5; }
code { font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace; font-size: 0.88em; }
:not(pre) > code { background: var(--bg-alt); padding: 2px 5px; border-radius: 4px; }
pre code { background: none; padding: 0; }
table { width: 100%; border-collapse: collapse; font-size: 15px; margin: 14px 0; }
th { text-align: left; font-weight: 600; padding: 9px 11px; border-bottom: 2px solid var(--border); }
td { padding: 9px 11px; border-bottom: 1px solid var(--border); }
hr { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
ul.checklist { list-style: none; margin-left: 0; }
.meta { font-size: 14px; color: var(--text-secondary); margin-bottom: 32px; }
.nav-link { display: inline-block; margin-bottom: 4px; font-size: 15px; }
.back-link { font-size: 14px; color: var(--text-secondary); margin-bottom: 24px; display: inline-block; }
.back-link:hover { color: var(--accent); }
.doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 32px; }
.doc-card { padding: 18px; border: 1px solid var(--border); border-radius: 10px; transition: border-color 0.2s, box-shadow 0.2s; }
.doc-card:hover { border-color: var(--accent); box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.doc-card a { font-weight: 600; font-size: 15px; }
.doc-card .doc-file { font-size: 12px; color: var(--text-secondary); margin-top: 4px; font-family: "SF Mono", monospace; }
.footer { margin-top: 64px; padding-top: 14px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-secondary); }
@media (max-width: 600px) { .container { padding: 40px 18px 60px; } h1 { font-size: 28px; } .doc-grid { grid-template-columns: 1fr; } }
@media print { .back-link, .footer { display: none; } }
`.trim();
}

function generateDocPage(
  doc: GeneratedDocument,
  companyName: string,
  lastUpdated: string,
): string {
  const body = markdownToHtmlBody(doc.content);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(doc.name)} — ${escapeHtml(companyName)}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <a href="index.html" class="back-link">&larr; All Documents</a>
    ${body}
    <footer class="footer">
      Generated by <a href="https://github.com/joechensmartz/codepliant">Codepliant</a> &middot; ${escapeHtml(lastUpdated)}
    </footer>
  </div>
</body>
</html>`;
}

function generateIndexPage(
  docs: GeneratedDocument[],
  companyName: string,
  lastUpdated: string,
): string {
  const cards = docs
    .map((doc) => {
      const slug = slugify(doc.name);
      return `      <div class="doc-card">
        <a href="${slug}.html">${escapeHtml(doc.name)}</a>
        <div class="doc-file">${escapeHtml(doc.filename)}</div>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(companyName)} — Compliance Documents</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(companyName)}</h1>
    <p class="meta">Compliance Documents &middot; Last updated ${escapeHtml(lastUpdated)} &middot; ${docs.length} documents</p>
    <p>These compliance documents were auto-generated from source code analysis by <a href="https://github.com/joechensmartz/codepliant">Codepliant</a>. They should be reviewed by qualified legal counsel before reliance.</p>
    <div class="doc-grid">
${cards}
    </div>
    <footer class="footer">
      Generated by <a href="https://github.com/joechensmartz/codepliant">Codepliant</a> &middot; ${escapeHtml(lastUpdated)}
    </footer>
  </div>
</body>
</html>`;
}

export interface GithubPagesOptions {
  docs: GeneratedDocument[];
  outputDir: string;
  companyName?: string;
}

/**
 * Generate a static HTML site from compliance documents and write to the output directory.
 * Returns the list of written file paths.
 */
export function writeGithubPages(options: GithubPagesOptions): string[] {
  const { docs, outputDir } = options;
  const companyName = options.companyName || "Your Company";
  const lastUpdated = new Date().toISOString().split("T")[0];

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const written: string[] = [];

  // Write shared CSS
  const cssPath = path.join(outputDir, "style.css");
  fs.writeFileSync(cssPath, generateSharedCSS(), "utf-8");
  written.push(cssPath);

  // Write index.html
  const indexPath = path.join(outputDir, "index.html");
  fs.writeFileSync(indexPath, generateIndexPage(docs, companyName, lastUpdated), "utf-8");
  written.push(indexPath);

  // Write individual document pages
  for (const doc of docs) {
    const slug = slugify(doc.name);
    const docPath = path.join(outputDir, `${slug}.html`);
    fs.writeFileSync(docPath, generateDocPage(doc, companyName, lastUpdated), "utf-8");
    written.push(docPath);
  }

  return written;
}
