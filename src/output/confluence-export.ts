import * as fs from "fs";
import * as path from "path";
import type { GeneratedDocument } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

/**
 * Converts markdown content to Confluence-compatible XHTML (Confluence Storage Format).
 *
 * Handles: headings, paragraphs, bold, italic, links, lists (ordered/unordered),
 * tables, code blocks (with Confluence code macro), blockquotes, horizontal rules.
 */
export function markdownToConfluenceXhtml(md: string): string {
  const lines = md.split("\n");
  const result: string[] = [];
  let i = 0;
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockContent: string[] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";
  let inTable = false;
  let tableRows: string[][] = [];
  let isFirstTableRow = true;

  function closeList() {
    if (inList) {
      result.push(`</${listType === "ul" ? "ul" : "ol"}>`);
      inList = false;
    }
  }

  function closeTable() {
    if (inTable && tableRows.length > 0) {
      let html = "<table><tbody>\n";
      for (let r = 0; r < tableRows.length; r++) {
        html += "<tr>";
        const tag = r === 0 ? "th" : "td";
        for (const cell of tableRows[r]) {
          html += `<${tag}><p>${formatInline(cell.trim())}</p></${tag}>`;
        }
        html += "</tr>\n";
      }
      html += "</tbody></table>";

      // Wrap in Confluence table macro for richer rendering
      result.push(confluenceMacro("table", {}, html));
      inTable = false;
      tableRows = [];
      isFirstTableRow = true;
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks (fenced)
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        const content = escapeXml(codeBlockContent.join("\n"));
        result.push(confluenceCodeMacro(content, codeBlockLang));
        codeBlockContent = [];
        codeBlockLang = "";
        inCodeBlock = false;
      } else {
        closeList();
        closeTable();
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
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
      closeTable();
      i++;
      continue;
    }

    // Table detection
    if (trimmed.includes("|")) {
      const cells = parseTableRow(trimmed);
      if (cells) {
        if (!inTable && i + 1 < lines.length) {
          const nextTrimmed = lines[i + 1].trim();
          if (isTableSeparator(nextTrimmed)) {
            closeList();
            inTable = true;
            tableRows = [cells];
            isFirstTableRow = true;
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
      closeTable();
      result.push("<hr />");
      i++;
      continue;
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      closeTable();
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      result.push(`<h${level}>${formatInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      closeList();
      closeTable();
      const quoteText = trimmed.slice(2);
      // Collect consecutive blockquote lines
      const quoteLines = [quoteText];
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith("> ")) {
        i++;
        quoteLines.push(lines[i].trim().slice(2));
      }
      result.push(confluenceInfoMacro(quoteLines.map(l => `<p>${formatInline(l)}</p>`).join("\n")));
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      closeTable();
      if (!inList || listType !== "ul") {
        closeList();
        listType = "ul";
        inList = true;
        result.push("<ul>");
      }
      const content = trimmed.replace(/^[-*+]\s+/, "");
      result.push(`<li><p>${formatInline(content)}</p></li>`);
      i++;
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      closeTable();
      if (!inList || listType !== "ol") {
        closeList();
        listType = "ol";
        inList = true;
        result.push("<ol>");
      }
      result.push(`<li><p>${formatInline(olMatch[2])}</p></li>`);
      i++;
      continue;
    }

    // Paragraph
    closeList();
    closeTable();
    result.push(`<p>${formatInline(trimmed)}</p>`);
    i++;
  }

  closeList();
  closeTable();

  return result.join("\n");
}

/**
 * Generates a Confluence code macro (ac:structured-macro).
 */
function confluenceCodeMacro(content: string, language?: string): string {
  const lang = language || "text";
  return [
    `<ac:structured-macro ac:name="code">`,
    `<ac:parameter ac:name="language">${escapeXml(lang)}</ac:parameter>`,
    `<ac:parameter ac:name="linenumbers">true</ac:parameter>`,
    `<ac:plain-text-body><![CDATA[${content}]]></ac:plain-text-body>`,
    `</ac:structured-macro>`,
  ].join("\n");
}

/**
 * Generates a Confluence info macro (used for blockquotes).
 */
function confluenceInfoMacro(bodyXhtml: string): string {
  return [
    `<ac:structured-macro ac:name="info">`,
    `<ac:rich-text-body>`,
    bodyXhtml,
    `</ac:rich-text-body>`,
    `</ac:structured-macro>`,
  ].join("\n");
}

/**
 * Wraps content in a generic Confluence macro.
 */
function confluenceMacro(name: string, params: Record<string, string>, bodyXhtml: string): string {
  const paramLines = Object.entries(params).map(
    ([k, v]) => `<ac:parameter ac:name="${escapeXml(k)}">${escapeXml(v)}</ac:parameter>`
  );
  return [
    `<ac:structured-macro ac:name="${escapeXml(name)}">`,
    ...paramLines,
    `<ac:rich-text-body>`,
    bodyXhtml,
    `</ac:rich-text-body>`,
    `</ac:structured-macro>`,
  ].join("\n");
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );
  return text;
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

/**
 * Wraps Confluence XHTML content in a complete Confluence storage format document.
 */
function wrapInConfluencePage(title: string, bodyXhtml: string, companyName?: string, lastUpdated?: string): string {
  const header = [
    `<h1>${escapeXml(title)}</h1>`,
  ];

  if (companyName || lastUpdated) {
    const metaParts: string[] = [];
    if (companyName) metaParts.push(escapeXml(companyName));
    if (lastUpdated) metaParts.push(`Last updated: ${escapeXml(lastUpdated)}`);
    header.push(`<p><em>${metaParts.join(" — ")}</em></p>`);
  }

  header.push("<hr />");

  return header.join("\n") + "\n" + bodyXhtml;
}

/**
 * Writes compliance documents as Confluence-compatible XHTML files.
 *
 * Each document becomes a separate .xhtml file that can be imported into
 * Confluence via the Universal Wiki Converter or Confluence REST API.
 *
 * Returns the list of file paths written.
 */
export function writeConfluenceExport(
  docs: GeneratedDocument[],
  outputDir: string,
  config?: CodepliantConfig
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const lastUpdated = new Date().toISOString().split("T")[0];
  const companyName = config?.companyName;
  const writtenFiles: string[] = [];

  for (const doc of docs) {
    // Skip non-Markdown files (e.g., .json config files)
    if (!doc.filename.endsWith(".md")) continue;

    const xhtml = markdownToConfluenceXhtml(doc.content);
    const page = wrapInConfluencePage(doc.name, xhtml, companyName, lastUpdated);

    const filename = doc.filename.replace(/\.md$/, ".xhtml");
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, page, "utf-8");
    writtenFiles.push(filePath);
  }

  // Write an index page
  const indexBody = [
    `<h1>Compliance Documents</h1>`,
    companyName ? `<p><em>${escapeXml(companyName)} — Generated on ${escapeXml(lastUpdated)}</em></p>` : `<p><em>Generated on ${escapeXml(lastUpdated)}</em></p>`,
    `<hr />`,
    `<h2>Documents</h2>`,
    `<ul>`,
    ...docs.filter(doc => doc.filename.endsWith(".md")).map(doc => {
      const filename = doc.filename.replace(/\.md$/, ".xhtml");
      return `<li><p><a href="./${filename}">${escapeXml(doc.name)}</a></p></li>`;
    }),
    `</ul>`,
    `<hr />`,
    `<p><em>Generated by Codepliant</em></p>`,
  ].join("\n");

  const indexPath = path.join(outputDir, "compliance-index.xhtml");
  fs.writeFileSync(indexPath, indexBody, "utf-8");
  writtenFiles.push(indexPath);

  return writtenFiles;
}
