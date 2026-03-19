import type { GeneratedDocument } from "../generator/index.js";

/**
 * Simple Markdown to HTML converter. Supports:
 * headings, paragraphs, lists (ordered/unordered), tables, bold, italic,
 * links, blockquotes, code blocks, inline code, horizontal rules.
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let inBlockquote = false;
  let blockquoteContent: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableAlignments: string[] = [];

  function closeList() {
    if (inList) {
      result.push(`</${listType}>`);
      inList = false;
    }
  }

  function closeBlockquote() {
    if (inBlockquote) {
      result.push(`<blockquote>${formatInline(blockquoteContent.join(" "))}</blockquote>`);
      inBlockquote = false;
      blockquoteContent = [];
    }
  }

  function closeTable() {
    if (inTable && tableRows.length > 0) {
      let html = "<table>\n<thead>\n<tr>";
      const headerRow = tableRows[0];
      for (let c = 0; c < headerRow.length; c++) {
        const align = tableAlignments[c] ? ` style="text-align:${tableAlignments[c]}"` : "";
        html += `<th${align}>${formatInline(headerRow[c].trim())}</th>`;
      }
      html += "</tr>\n</thead>\n<tbody>\n";
      for (let r = 1; r < tableRows.length; r++) {
        html += "<tr>";
        for (let c = 0; c < tableRows[r].length; c++) {
          const align = tableAlignments[c] ? ` style="text-align:${tableAlignments[c]}"` : "";
          html += `<td${align}>${formatInline(tableRows[r][c].trim())}</td>`;
        }
        html += "</tr>\n";
      }
      html += "</tbody>\n</table>";
      result.push(html);
      inTable = false;
      tableRows = [];
      tableAlignments = [];
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks (fenced)
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        result.push(`<pre><code>${escapeHtml(codeBlockContent.join("\n"))}</code></pre>`);
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        closeList();
        closeBlockquote();
        closeTable();
        inCodeBlock = true;
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      i++;
      continue;
    }

    const trimmed = line.trim();

    // Empty line
    if (trimmed === "") {
      closeList();
      closeBlockquote();
      closeTable();
      i++;
      continue;
    }

    // Table detection
    if (trimmed.includes("|")) {
      const cells = parseTableRow(trimmed);
      if (cells) {
        // Check if next line is a separator
        if (!inTable && i + 1 < lines.length) {
          const nextTrimmed = lines[i + 1].trim();
          if (isTableSeparator(nextTrimmed)) {
            closeList();
            closeBlockquote();
            inTable = true;
            tableRows = [cells];
            tableAlignments = parseTableAlignments(nextTrimmed);
            i += 2; // skip header + separator
            continue;
          }
        }
        if (inTable) {
          tableRows.push(cells);
          i++;
          continue;
        }
      }
    } else if (inTable) {
      closeTable();
    }

    // Horizontal rule
    if (/^(---+|\*\*\*+|___+)$/.test(trimmed)) {
      closeList();
      closeBlockquote();
      closeTable();
      result.push("<hr>");
      i++;
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      closeBlockquote();
      closeTable();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const id = slugify(text);
      result.push(`<h${level} id="${id}">${formatInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      closeList();
      closeTable();
      if (!inBlockquote) {
        inBlockquote = true;
        blockquoteContent = [];
      }
      blockquoteContent.push(trimmed.slice(2));
      i++;
      continue;
    } else if (inBlockquote) {
      closeBlockquote();
    }

    // Checkbox list items (must check before unordered list)
    const checkboxMatch = trimmed.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (checkboxMatch) {
      closeBlockquote();
      closeTable();
      if (!inList || listType !== "ul") {
        closeList();
        listType = "ul";
        inList = true;
        result.push('<ul class="checklist">');
      }
      const checked = checkboxMatch[1] !== " " ? " checked" : "";
      result.push(`<li><input type="checkbox" disabled${checked}> ${formatInline(checkboxMatch[2])}</li>`);
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      closeBlockquote();
      closeTable();
      if (!inList || listType !== "ul") {
        closeList();
        listType = "ul";
        inList = true;
        result.push("<ul>");
      }
      const content = trimmed.replace(/^[-*+]\s+/, "");
      result.push(`<li>${formatInline(content)}</li>`);
      i++;
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      closeBlockquote();
      closeTable();
      if (!inList || listType !== "ol") {
        closeList();
        listType = "ol";
        inList = true;
        result.push("<ol>");
      }
      result.push(`<li>${formatInline(olMatch[2])}</li>`);
      i++;
      continue;
    }

    // Paragraph
    closeList();
    closeBlockquote();
    closeTable();
    result.push(`<p>${formatInline(trimmed)}</p>`);
    i++;
  }

  closeList();
  closeBlockquote();
  closeTable();

  return result.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatInline(text: string): string {
  // Bold + italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  // Inline code
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

function parseTableRow(line: string): string[] | null {
  if (!line.includes("|")) return null;
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  const cells = trimmed.split("|");
  if (cells.length < 2) return null;
  return cells;
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*[-:]+[-|\s:]*$/.test(line);
}

function parseTableAlignments(line: string): string[] {
  let trimmed = line.trim();
  if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
  if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
  return trimmed.split("|").map((cell) => {
    const c = cell.trim();
    if (c.startsWith(":") && c.endsWith(":")) return "center";
    if (c.endsWith(":")) return "right";
    return "left";
  });
}

/**
 * Estimate reading time in minutes based on word count.
 * Average reading speed: ~200 words per minute for dense/legal text.
 */
function estimateReadingTime(text: string): number {
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Generates a single self-contained HTML page from an array of generated documents.
 *
 * Design: Apple-inspired single-column layout. Typography-driven hierarchy,
 * with table of contents, back-to-top button, copy-to-clipboard for code blocks,
 * and estimated reading time per document.
 */
export function generateHtml(
  docs: GeneratedDocument[],
  options: {
    companyName?: string;
    lastUpdated?: string;
  } = {}
): string {
  const companyName = options.companyName || "Your Company";
  const lastUpdated = options.lastUpdated || new Date().toISOString().split("T")[0];

  // Calculate total reading time
  const totalWords = docs.reduce((sum, doc) => sum + doc.content.split(/\s+/).length, 0);
  const totalReadingTime = Math.max(1, Math.ceil(totalWords / 200));

  // Build table of contents with reading times
  const tocEntries = docs
    .map((doc) => {
      const id = slugify(doc.name);
      const readingTime = estimateReadingTime(doc.content);
      return `<li><a href="#${id}">${escapeHtml(doc.name)}</a> <span class="reading-time">${readingTime} min read</span></li>`;
    })
    .join("\n          ");

  // Build document navigation (simple text links at the top)
  const navLinks = docs
    .map((doc) => {
      const id = slugify(doc.name);
      return `<a href="#${id}">${escapeHtml(doc.name)}</a>`;
    })
    .join("\n        ");

  // Build document sections
  const documentSections = docs
    .map((doc) => {
      const id = slugify(doc.name);
      const htmlContent = markdownToHtml(doc.content);
      const readingTime = estimateReadingTime(doc.content);

      return `
      <section id="${id}">
        <div class="section-meta">
          <span class="reading-time">${readingTime} min read</span>
          <a href="#top" class="back-to-top">Back to top</a>
        </div>
        ${htmlContent}
      </section>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(companyName)} — Compliance Documents</title>
  <style>
    :root {
      --text: #1d1d1f;
      --text-secondary: #6e6e73;
      --bg: #fff;
      --bg-alt: #f5f5f7;
      --accent: #0066cc;
      --border: #d2d2d7;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --text: #f5f5f7;
        --text-secondary: #a1a1a6;
        --bg: #000;
        --bg-alt: #1d1d1f;
        --accent: #2997ff;
        --border: #424245;
      }
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Helvetica, Arial, sans-serif;
      font-size: 17px;
      line-height: 1.47059;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .page {
      max-width: 680px;
      margin: 0 auto;
      padding: 80px 24px 120px;
    }

    .page-header {
      margin-bottom: 64px;
    }

    .page-header h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }

    .page-header .meta {
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* Table of Contents */
    .toc {
      margin-bottom: 64px;
      padding: 24px;
      background: var(--bg-alt);
      border-radius: 12px;
    }

    .toc h2 {
      font-size: 17px;
      font-weight: 600;
      margin: 0 0 12px 0;
      color: var(--text);
    }

    .toc ol {
      margin: 0;
      padding-left: 20px;
    }

    .toc li {
      margin-bottom: 6px;
      font-size: 15px;
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .toc li a {
      color: var(--accent);
      text-decoration: none;
    }

    .toc li a:hover { text-decoration: underline; }

    .reading-time {
      font-size: 12px;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .doc-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 24px;
      margin-bottom: 64px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .doc-nav a {
      font-size: 14px;
      color: var(--accent);
      text-decoration: none;
    }

    .doc-nav a:hover { text-decoration: underline; }

    /* Section meta (reading time + back to top) */
    .section-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    .back-to-top {
      font-size: 13px;
      color: var(--text-secondary);
      text-decoration: none;
    }

    .back-to-top:hover {
      color: var(--accent);
      text-decoration: underline;
    }

    /* Floating back-to-top button */
    .back-to-top-float {
      position: fixed;
      bottom: 32px;
      right: 32px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      border: none;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .back-to-top-float.visible { opacity: 1; }
    .back-to-top-float:hover { transform: scale(1.1); }

    /* Code block with copy button */
    .code-block-wrapper {
      position: relative;
    }

    .copy-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 10px;
      font-size: 12px;
      font-family: inherit;
      background: var(--bg);
      color: var(--text-secondary);
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .code-block-wrapper:hover .copy-btn { opacity: 1; }
    .copy-btn:hover { color: var(--text); border-color: var(--text-secondary); }
    .copy-btn.copied { color: #34c759; border-color: #34c759; }

    section { margin-bottom: 80px; }

    h1 { font-size: 40px; line-height: 1.1; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 16px; }
    h2 { font-size: 28px; line-height: 1.14; font-weight: 700; letter-spacing: -0.01em; margin-top: 56px; margin-bottom: 12px; }
    h3 { font-size: 21px; line-height: 1.19; font-weight: 600; margin-top: 40px; margin-bottom: 8px; }
    h4 { font-size: 17px; line-height: 1.47; font-weight: 600; margin-top: 32px; margin-bottom: 8px; }

    p { margin-bottom: 16px; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    strong { font-weight: 600; }

    ul, ol { margin: 8px 0 16px 24px; }
    li { margin-bottom: 6px; }

    blockquote {
      border-left: 3px solid var(--border);
      padding-left: 20px;
      color: var(--text-secondary);
      margin: 16px 0;
    }

    pre {
      background: var(--bg-alt);
      border-radius: 8px;
      padding: 16px 20px;
      overflow-x: auto;
      margin: 16px 0;
      font-size: 14px;
      line-height: 1.5;
    }

    code {
      font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace;
      font-size: 0.88em;
    }

    :not(pre) > code {
      background: var(--bg-alt);
      padding: 2px 6px;
      border-radius: 4px;
    }

    pre code {
      background: none;
      padding: 0;
      border-radius: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 15px;
      margin: 16px 0;
    }

    th {
      text-align: left;
      font-weight: 600;
      padding: 10px 12px;
      border-bottom: 2px solid var(--border);
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
    }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 48px 0;
    }

    ul.checklist { list-style: none; margin-left: 0; }
    ul.checklist li { padding-left: 4px; }

    .footer {
      margin-top: 80px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-size: 13px;
      color: var(--text-secondary);
    }

    @media (max-width: 600px) {
      .page { padding: 48px 20px 80px; }
      h1 { font-size: 32px; }
      h2 { font-size: 24px; margin-top: 40px; }
      h3 { font-size: 19px; margin-top: 32px; }
      .back-to-top-float { bottom: 16px; right: 16px; }
      .toc { padding: 16px; }
    }

    @media print {
      body {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #000;
        background: #fff;
      }
      .page { max-width: 100%; padding: 0; }
      .doc-nav, .footer, .back-to-top-float, .copy-btn, .back-to-top { display: none; }
      h1 { font-size: 18pt; }
      h2 { font-size: 14pt; }
      section { page-break-inside: avoid; }
      a { color: #000; }
      .toc { background: none; border: 1px solid #ccc; }
    }
  </style>
</head>
<body id="top">
  <div class="page">
    <header class="page-header">
      <h1>${escapeHtml(companyName)}</h1>
      <p class="meta">Compliance Documents &middot; Last updated ${escapeHtml(lastUpdated)} &middot; ~${totalReadingTime} min total read</p>
    </header>

    <div class="toc">
      <h2>Table of Contents</h2>
      <ol>
          ${tocEntries}
      </ol>
    </div>

    <nav class="doc-nav">
      ${navLinks}
    </nav>
${documentSections}

    <footer class="footer">
      Generated by Codepliant
    </footer>
  </div>

  <button class="back-to-top-float" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">&uarr;</button>

  <script>
    // Back-to-top button visibility
    (function() {
      var btn = document.querySelector('.back-to-top-float');
      window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });
    })();

    // Copy-to-clipboard for code blocks
    (function() {
      var pres = document.querySelectorAll('pre');
      pres.forEach(function(pre) {
        var wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        var btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy code to clipboard');
        wrapper.appendChild(btn);

        btn.addEventListener('click', function() {
          var code = pre.querySelector('code');
          var text = code ? code.textContent : pre.textContent;
          navigator.clipboard.writeText(text).then(function() {
            btn.textContent = 'Copied';
            btn.classList.add('copied');
            setTimeout(function() {
              btn.textContent = 'Copy';
              btn.classList.remove('copied');
            }, 2000);
          });
        });
      });
    })();
  </script>
</body>
</html>`;
}

/**
 * Generates a standalone HTML page for a single document.
 */
export function generateSingleDocHtml(
  doc: GeneratedDocument,
  options: { companyName?: string; lastUpdated?: string } = {}
): string {
  const companyName = options.companyName || "Your Company";
  const lastUpdated = options.lastUpdated || new Date().toISOString().split("T")[0];
  // Strip the first H1 from content since it's already in the page header
  const lines = doc.content.split("\n");
  const firstH1Idx = lines.findIndex((l) => /^#\s+/.test(l));
  const contentWithoutH1 = firstH1Idx >= 0 ? lines.filter((_, i) => i !== firstH1Idx).join("\n") : doc.content;
  const htmlContent = markdownToHtml(contentWithoutH1);
  const readingTime = estimateReadingTime(doc.content);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(doc.name)} — ${escapeHtml(companyName)}</title>
  <style>
    :root {
      --text: #1d1d1f;
      --text-secondary: #6e6e73;
      --bg: #fff;
      --bg-alt: #f5f5f7;
      --accent: #0066cc;
      --border: #d2d2d7;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --text: #f5f5f7;
        --text-secondary: #a1a1a6;
        --bg: #000;
        --bg-alt: #1d1d1f;
        --accent: #2997ff;
        --border: #424245;
      }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 17px; line-height: 1.47059; color: var(--text); background: var(--bg);
      -webkit-font-smoothing: antialiased;
    }
    .page { max-width: 680px; margin: 0 auto; padding: 80px 24px 120px; }
    .page-header { margin-bottom: 48px; }
    .page-header h1 { font-size: 32px; font-weight: 700; letter-spacing: -0.01em; margin-bottom: 4px; }
    .page-header .meta { font-size: 14px; color: var(--text-secondary); }
    h1 { font-size: 40px; line-height: 1.1; font-weight: 700; letter-spacing: -0.015em; margin-bottom: 16px; }
    h2 { font-size: 28px; line-height: 1.14; font-weight: 700; letter-spacing: -0.01em; margin-top: 56px; margin-bottom: 12px; }
    h3 { font-size: 21px; line-height: 1.19; font-weight: 600; margin-top: 40px; margin-bottom: 8px; }
    h4 { font-size: 17px; line-height: 1.47; font-weight: 600; margin-top: 32px; margin-bottom: 8px; }
    p { margin-bottom: 16px; } a { color: var(--accent); text-decoration: none; } a:hover { text-decoration: underline; }
    strong { font-weight: 600; } ul, ol { margin: 8px 0 16px 24px; } li { margin-bottom: 6px; }
    blockquote { border-left: 3px solid var(--border); padding-left: 20px; color: var(--text-secondary); margin: 16px 0; }
    pre { background: var(--bg-alt); border-radius: 8px; padding: 16px 20px; overflow-x: auto; margin: 16px 0; font-size: 14px; line-height: 1.5; }
    code { font-family: "SF Mono", ui-monospace, Menlo, Consolas, monospace; font-size: 0.88em; }
    :not(pre) > code { background: var(--bg-alt); padding: 2px 6px; border-radius: 4px; }
    pre code { background: none; padding: 0; border-radius: 0; }
    table { width: 100%; border-collapse: collapse; font-size: 15px; margin: 16px 0; }
    th { text-align: left; font-weight: 600; padding: 10px 12px; border-bottom: 2px solid var(--border); }
    td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
    hr { border: none; border-top: 1px solid var(--border); margin: 48px 0; }
    ul.checklist { list-style: none; margin-left: 0; } ul.checklist li { padding-left: 4px; }
    .footer { margin-top: 80px; padding-top: 16px; border-top: 1px solid var(--border); font-size: 13px; color: var(--text-secondary); }
    @media (max-width: 600px) { .page { padding: 48px 20px 80px; } h1 { font-size: 32px; } h2 { font-size: 24px; } }
    @media print {
      body { font-family: Georgia, "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.5; color: #000; background: #fff; }
      .page { max-width: 100%; padding: 0; } .footer { display: none; } a { color: #000; }
    }
  </style>
</head>
<body>
  <div class="page">
    <header class="page-header">
      <h1>${escapeHtml(doc.name)}</h1>
      <p class="meta">${escapeHtml(companyName)} &middot; Last updated ${escapeHtml(lastUpdated)} &middot; ~${readingTime} min read</p>
    </header>
    ${htmlContent}
    <footer class="footer">Generated by Codepliant</footer>
  </div>
</body>
</html>`;
}
