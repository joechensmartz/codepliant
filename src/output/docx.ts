import * as fs from "fs";
import * as path from "path";
import * as zlib from "zlib";
import { type GeneratedDocument, getDocumentCategory } from "../generator/index.js";
import type { CodepliantConfig } from "../config.js";

/**
 * Minimal .docx generator using raw XML — no external libraries required.
 *
 * A .docx file is a ZIP archive containing XML files. We build the minimal
 * required structure: [Content_Types].xml, _rels/.rels, word/document.xml,
 * word/_rels/document.xml.rels, and word/styles.xml.
 *
 * We use a simple ZIP builder (no compression, "stored" method) since the
 * Node.js zlib module only supports deflate — and docx readers accept stored entries.
 */

// --- Minimal ZIP builder (stored, no compression) ---

interface ZipEntry {
  name: string;
  data: Buffer;
}

function buildZip(entries: ZipEntry[]): Buffer {
  const parts: Buffer[] = [];
  const centralDir: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, "utf-8");
    const crc = crc32(entry.data);

    // Local file header
    const localHeader = Buffer.alloc(30 + nameBuffer.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(0, 8); // compression: stored
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14); // crc32
    localHeader.writeUInt32LE(entry.data.length, 18); // compressed size
    localHeader.writeUInt32LE(entry.data.length, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBuffer.length, 26); // filename length
    localHeader.writeUInt16LE(0, 28); // extra field length
    nameBuffer.copy(localHeader, 30);

    parts.push(localHeader);
    parts.push(entry.data);

    // Central directory entry
    const centralEntry = Buffer.alloc(46 + nameBuffer.length);
    centralEntry.writeUInt32LE(0x02014b50, 0); // signature
    centralEntry.writeUInt16LE(20, 4); // version made by
    centralEntry.writeUInt16LE(20, 6); // version needed
    centralEntry.writeUInt16LE(0, 8); // flags
    centralEntry.writeUInt16LE(0, 10); // compression: stored
    centralEntry.writeUInt16LE(0, 12); // mod time
    centralEntry.writeUInt16LE(0, 14); // mod date
    centralEntry.writeUInt32LE(crc, 16); // crc32
    centralEntry.writeUInt32LE(entry.data.length, 20); // compressed
    centralEntry.writeUInt32LE(entry.data.length, 24); // uncompressed
    centralEntry.writeUInt16LE(nameBuffer.length, 28); // filename length
    centralEntry.writeUInt16LE(0, 30); // extra field length
    centralEntry.writeUInt16LE(0, 32); // comment length
    centralEntry.writeUInt16LE(0, 34); // disk number
    centralEntry.writeUInt16LE(0, 36); // internal attrs
    centralEntry.writeUInt32LE(0, 38); // external attrs
    centralEntry.writeUInt32LE(offset, 42); // relative offset
    nameBuffer.copy(centralEntry, 46);

    centralDir.push(centralEntry);
    offset += localHeader.length + entry.data.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const cd of centralDir) {
    parts.push(cd);
    centralDirSize += cd.length;
  }

  // End of central directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // start disk
  eocd.writeUInt16LE(entries.length, 8); // entries on disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12); // central dir size
  eocd.writeUInt32LE(centralDirOffset, 16); // central dir offset
  eocd.writeUInt16LE(0, 20); // comment length
  parts.push(eocd);

  return Buffer.concat(parts);
}

/**
 * CRC-32 implementation (no external dependency).
 */
function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// --- XML escaping ---

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- Markdown to DOCX XML conversion ---

function markdownToDocxXml(markdown: string): string {
  const lines = markdown.split("\n");
  const paragraphs: string[] = [];
  let inCodeBlock = false;
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) {
      paragraphs.push(
        `<w:p><w:pPr><w:pStyle w:val="Code"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="18"/></w:rPr><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`
      );
      continue;
    }

    // Empty lines
    if (line.trim() === "") {
      if (inList) inList = false;
      continue;
    }

    // Headings
    const h1Match = line.match(/^# (.+)/);
    if (h1Match) {
      paragraphs.push(
        `<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>${escapeXml(h1Match[1])}</w:t></w:r></w:p>`
      );
      continue;
    }

    const h2Match = line.match(/^## (.+)/);
    if (h2Match) {
      paragraphs.push(
        `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>${escapeXml(h2Match[1])}</w:t></w:r></w:p>`
      );
      continue;
    }

    const h3Match = line.match(/^### (.+)/);
    if (h3Match) {
      paragraphs.push(
        `<w:p><w:pPr><w:pStyle w:val="Heading3"/></w:pPr><w:r><w:t>${escapeXml(h3Match[1])}</w:t></w:r></w:p>`
      );
      continue;
    }

    const h4Match = line.match(/^#### (.+)/);
    if (h4Match) {
      paragraphs.push(
        `<w:p><w:pPr><w:pStyle w:val="Heading4"/></w:pPr><w:r><w:t>${escapeXml(h4Match[1])}</w:t></w:r></w:p>`
      );
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      paragraphs.push(
        `<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="999999"/></w:pBdr></w:pPr></w:p>`
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const content = line.slice(2);
      paragraphs.push(
        `<w:p><w:pPr><w:ind w:left="720"/></w:pPr><w:r><w:rPr><w:i/><w:color w:val="666666"/></w:rPr><w:t xml:space="preserve">${escapeXml(content)}</w:t></w:r></w:p>`
      );
      continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const content = line.replace(/^[-*] /, "");
      inList = true;
      paragraphs.push(
        `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t xml:space="preserve">${escapeXml(content)}</w:t></w:r></w:p>`
      );
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.+)/);
    if (olMatch) {
      inList = true;
      paragraphs.push(
        `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="2"/></w:numPr></w:pPr><w:r><w:t xml:space="preserve">${escapeXml(olMatch[1])}</w:t></w:r></w:p>`
      );
      continue;
    }

    // Table rows — convert to simple paragraphs with tab-separated values
    if (line.startsWith("|")) {
      // Skip separator rows
      if (line.match(/^\|[-\s|:]+\|$/)) continue;
      const cells = line.split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
      const text = cells.join("  |  ");
      paragraphs.push(
        `<w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`
      );
      continue;
    }

    // Regular paragraph — handle inline bold/italic
    let content = escapeXml(line);
    // Bold: **text** → we'll just strip the markers for simplicity
    content = content.replace(/\*\*(.+?)\*\*/g, "$1");
    content = content.replace(/__(.+?)__/g, "$1");
    // Italic: *text*
    content = content.replace(/\*(.+?)\*/g, "$1");
    content = content.replace(/_(.+?)_/g, "$1");

    paragraphs.push(
      `<w:p><w:r><w:t xml:space="preserve">${content}</w:t></w:r></w:p>`
    );
  }

  return paragraphs.join("\n");
}

// --- DOCX XML templates ---

function contentTypesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
</Types>`;
}

function relsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
}

function documentRelsXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
</Relationships>`;
}

function stylesXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:styleId="Normal" w:default="1">
    <w:name w:val="Normal"/>
    <w:rPr><w:sz w:val="22"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
    <w:pPr><w:spacing w:after="120"/></w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr><w:spacing w:before="360" w:after="120"/></w:pPr>
    <w:rPr><w:sz w:val="36"/><w:b/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="1F3864"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading2">
    <w:name w:val="heading 2"/>
    <w:pPr><w:spacing w:before="240" w:after="80"/></w:pPr>
    <w:rPr><w:sz w:val="28"/><w:b/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="2E75B6"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading3">
    <w:name w:val="heading 3"/>
    <w:pPr><w:spacing w:before="200" w:after="80"/></w:pPr>
    <w:rPr><w:sz w:val="24"/><w:b/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:color w:val="404040"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading4">
    <w:name w:val="heading 4"/>
    <w:pPr><w:spacing w:before="160" w:after="80"/></w:pPr>
    <w:rPr><w:sz w:val="22"/><w:b/><w:i/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="ListParagraph">
    <w:name w:val="List Paragraph"/>
    <w:pPr><w:ind w:left="720"/><w:spacing w:after="60"/></w:pPr>
    <w:rPr><w:sz w:val="22"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Code">
    <w:name w:val="Code"/>
    <w:pPr><w:spacing w:after="0"/><w:shd w:val="clear" w:fill="F5F5F5"/></w:pPr>
    <w:rPr><w:sz w:val="18"/><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/></w:rPr>
  </w:style>
</w:styles>`;
}

function numberingXml(): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="\u2022"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
    </w:lvl>
  </w:abstractNum>
  <w:abstractNum w:abstractNumId="1">
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="decimal"/>
      <w:lvlText w:val="%1."/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
  <w:num w:numId="2"><w:abstractNumId w:val="1"/></w:num>
</w:numbering>`;
}

function documentXml(bodyContent: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
${bodyContent}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;
}

/**
 * Generate a .docx file from a single markdown document.
 */
export function generateDocx(markdown: string): Buffer {
  const bodyXml = markdownToDocxXml(markdown);

  const entries: ZipEntry[] = [
    { name: "[Content_Types].xml", data: Buffer.from(contentTypesXml(), "utf-8") },
    { name: "_rels/.rels", data: Buffer.from(relsXml(), "utf-8") },
    { name: "word/document.xml", data: Buffer.from(documentXml(bodyXml), "utf-8") },
    { name: "word/_rels/document.xml.rels", data: Buffer.from(documentRelsXml(), "utf-8") },
    { name: "word/styles.xml", data: Buffer.from(stylesXml(), "utf-8") },
    { name: "word/numbering.xml", data: Buffer.from(numberingXml(), "utf-8") },
  ];

  return buildZip(entries);
}

/**
 * Write all compliance documents as individual .docx files.
 */
export function writeDocx(
  docs: GeneratedDocument[],
  outputDir: string,
  _config?: CodepliantConfig
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const writtenFiles: string[] = [];

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
    const docxBuffer = generateDocx(doc.content);
    const filename = doc.filename.replace(/\.md$/, ".docx");
    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, docxBuffer);
    writtenFiles.push(filePath);
  }

  return writtenFiles;
}
