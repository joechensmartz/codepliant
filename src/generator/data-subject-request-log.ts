import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

/**
 * Generates DSAR_LOG_TEMPLATE.md — A spreadsheet-style template for
 * logging Data Subject Access Requests (DSARs) to comply with
 * GDPR Article 12(5) record-keeping obligations.
 *
 * Covers:
 * - Request intake logging
 * - Status tracking with deadlines
 * - Request type categorisation (access, erasure, rectification, portability, restriction, objection)
 * - Identity verification tracking
 * - Response and completion logging
 * - Monthly/quarterly summary template
 */

const DSAR_TYPES = [
  { code: "ACC", name: "Access (Art. 15)", deadline: 30, description: "Subject requests copy of their personal data" },
  { code: "ERA", name: "Erasure (Art. 17)", deadline: 30, description: "Subject requests deletion of their personal data" },
  { code: "REC", name: "Rectification (Art. 16)", deadline: 30, description: "Subject requests correction of inaccurate data" },
  { code: "POR", name: "Portability (Art. 20)", deadline: 30, description: "Subject requests data in machine-readable format" },
  { code: "RES", name: "Restriction (Art. 18)", deadline: 30, description: "Subject requests restriction of processing" },
  { code: "OBJ", name: "Objection (Art. 21)", deadline: 30, description: "Subject objects to processing" },
  { code: "OPT", name: "Opt-Out (CCPA)", deadline: 15, description: "Consumer requests opt-out of sale/sharing" },
  { code: "KNO", name: "Right to Know (CCPA)", deadline: 45, description: "Consumer requests disclosure of collected PI" },
  { code: "DEL", name: "Right to Delete (CCPA)", deadline: 45, description: "Consumer requests deletion of personal information" },
];

const STATUS_VALUES = [
  { status: "Received", description: "Request received, awaiting identity verification" },
  { status: "Verifying", description: "Identity verification in progress" },
  { status: "In Progress", description: "Verified; gathering data or executing request" },
  { status: "Extended", description: "Deadline extended (complex request, max +60 days GDPR / +45 days CCPA)" },
  { status: "Completed", description: "Request fulfilled, response sent to subject" },
  { status: "Denied", description: "Request denied with documented reason (e.g. manifestly unfounded)" },
  { status: "Closed", description: "Completed and archived" },
];

export function generateDataSubjectRequestLog(
  scan: ScanResult,
  ctx?: GeneratorContext,
): string | null {
  if (scan.services.length === 0) {
    return null;
  }

  const company = ctx?.companyName || "[Your Company Name]";
  const dpoEmail = ctx?.dpoEmail || "[dpo@example.com]";
  const date = new Date().toISOString().split("T")[0];

  // Determine applicable regulations from jurisdictions
  const jurisdictions = ctx?.jurisdictions || [];
  const hasGDPR = jurisdictions.length === 0 || jurisdictions.some((j) => j === "gdpr" || j === "uk-gdpr");
  const hasCCPA = jurisdictions.some((j) => j === "ccpa");

  // Filter DSAR types by applicable regulations
  const applicableTypes = DSAR_TYPES.filter((t) => {
    if (t.code === "OPT" || t.code === "KNO" || t.code === "DEL") return hasCCPA;
    return hasGDPR;
  });

  const services = scan.services.filter((s) => s.isDataProcessor !== false);

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────

  lines.push(`# Data Subject Access Request (DSAR) Log`);
  lines.push(``);
  lines.push(`**Organisation:** ${company}`);
  lines.push(`**DPO / Privacy Contact:** ${dpoEmail}`);
  lines.push(`**Created:** ${date}`);
  lines.push(`**Applicable Regulations:** ${[hasGDPR ? "GDPR" : "", hasCCPA ? "CCPA/CPRA" : ""].filter(Boolean).join(", ") || "GDPR"}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`> This template provides a structured log for recording and tracking all Data Subject Access Requests (DSARs). Maintaining this log is required under GDPR Article 12(5) to demonstrate compliance with data subject rights obligations. Each request must be documented from receipt through completion.`);
  lines.push(``);

  // ── Request Type Reference ──────────────────────────────────────────

  lines.push(`## Request Type Reference`);
  lines.push(``);
  lines.push(`| Code | Type | Deadline (days) | Description |`);
  lines.push(`|------|------|-----------------|-------------|`);
  for (const t of applicableTypes) {
    lines.push(`| ${t.code} | ${t.name} | ${t.deadline} | ${t.description} |`);
  }
  lines.push(``);

  // ── Status Reference ────────────────────────────────────────────────

  lines.push(`## Status Values`);
  lines.push(``);
  lines.push(`| Status | Description |`);
  lines.push(`|--------|-------------|`);
  for (const s of STATUS_VALUES) {
    lines.push(`| ${s.status} | ${s.description} |`);
  }
  lines.push(``);

  // ── Main DSAR Log Template ──────────────────────────────────────────

  lines.push(`## DSAR Log`);
  lines.push(``);
  lines.push(`> Copy and append a new row for each incoming request.`);
  lines.push(``);
  lines.push(`| ID | Date Received | Type | Data Subject | Channel | Status | Due Date | Completed | Handler | Notes |`);
  lines.push(`|----|---------------|------|--------------|---------|--------|----------|-----------|---------|-------|`);
  lines.push(`| DSAR-001 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |`);
  lines.push(`| DSAR-002 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |`);
  lines.push(`| DSAR-003 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |`);
  lines.push(`| DSAR-004 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |`);
  lines.push(`| DSAR-005 | __________ | ___ | ____________ | Email / Form / Phone | Received | __________ | | _______ | |`);
  lines.push(``);

  // ── Identity Verification Log ───────────────────────────────────────

  lines.push(`## Identity Verification Log`);
  lines.push(``);
  lines.push(`> Before processing any DSAR, verify the identity of the requester to prevent unauthorised disclosure.`);
  lines.push(``);
  lines.push(`| DSAR ID | Verification Method | Verified By | Verified Date | Outcome |`);
  lines.push(`|---------|---------------------|-------------|---------------|---------|`);
  lines.push(`| DSAR-001 | ID document / Account login / Knowledge-based | _______ | __________ | Confirmed / Denied |`);
  lines.push(`| DSAR-002 | ID document / Account login / Knowledge-based | _______ | __________ | Confirmed / Denied |`);
  lines.push(`| DSAR-003 | ID document / Account login / Knowledge-based | _______ | __________ | Confirmed / Denied |`);
  lines.push(``);

  // ── Per-Service Data Locations ──────────────────────────────────────

  if (services.length > 0) {
    lines.push(`## Data Locations by Service`);
    lines.push(``);
    lines.push(`> When fulfilling a DSAR, data must be gathered from all services that store personal data.`);
    lines.push(``);
    lines.push(`| Service | Category | Data Collected | Action Required |`);
    lines.push(`|---------|----------|----------------|-----------------|`);
    for (const svc of services) {
      const data = svc.dataCollected?.join(", ") || "Various";
      lines.push(`| ${svc.name} | ${svc.category} | ${data} | Export / Delete / Rectify |`);
    }
    lines.push(``);
  }

  // ── Response Template ───────────────────────────────────────────────

  lines.push(`## Response Tracking`);
  lines.push(``);
  lines.push(`| DSAR ID | Response Date | Response Method | Data Provided | Exemptions Applied | Sent By |`);
  lines.push(`|---------|---------------|-----------------|---------------|--------------------|---------| `);
  lines.push(`| DSAR-001 | __________ | Email / Portal / Post | Yes / Partial | None / Art. 17(3) | _______ |`);
  lines.push(`| DSAR-002 | __________ | Email / Portal / Post | Yes / Partial | None / Art. 17(3) | _______ |`);
  lines.push(`| DSAR-003 | __________ | Email / Portal / Post | Yes / Partial | None / Art. 17(3) | _______ |`);
  lines.push(``);

  // ── Deadline Extension Log ──────────────────────────────────────────

  lines.push(`## Deadline Extensions`);
  lines.push(``);
  lines.push(`> GDPR allows a 60-day extension for complex requests (Art. 12(3)). CCPA allows a 45-day extension. Extensions must be communicated to the data subject within the original deadline.`);
  lines.push(``);
  lines.push(`| DSAR ID | Original Due Date | Extended Due Date | Reason | Subject Notified | Notified Date |`);
  lines.push(`|---------|-------------------|-------------------|--------|------------------|---------------|`);
  lines.push(`| _______ | __________ | __________ | Complex request / Multiple systems | Yes / No | __________ |`);
  lines.push(``);

  // ── Denial Log ──────────────────────────────────────────────────────

  lines.push(`## Denial Log`);
  lines.push(``);
  lines.push(`> Requests may be denied if manifestly unfounded or excessive (GDPR Art. 12(5)). Document the reason and inform the data subject of their right to complain to a supervisory authority.`);
  lines.push(``);
  lines.push(`| DSAR ID | Denial Date | Reason | Legal Basis | Subject Informed | Supervisory Authority Info Provided |`);
  lines.push(`|---------|-------------|--------|-------------|------------------|-------------------------------------|`);
  lines.push(`| _______ | __________ | ____________ | Art. 12(5) / Art. 17(3) | Yes | Yes |`);
  lines.push(``);

  // ── Monthly Summary Template ────────────────────────────────────────

  lines.push(`## Monthly DSAR Summary`);
  lines.push(``);
  lines.push(`> Complete this section at the end of each month to track DSAR volume and performance.`);
  lines.push(``);
  lines.push(`### Month: __________ Year: __________`);
  lines.push(``);
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total requests received | ___ |`);
  lines.push(`| Access requests (ACC) | ___ |`);
  lines.push(`| Erasure requests (ERA) | ___ |`);
  lines.push(`| Rectification requests (REC) | ___ |`);
  lines.push(`| Portability requests (POR) | ___ |`);
  lines.push(`| Restriction requests (RES) | ___ |`);
  lines.push(`| Objection requests (OBJ) | ___ |`);
  if (hasCCPA) {
    lines.push(`| Opt-out requests (OPT) | ___ |`);
    lines.push(`| Right to Know requests (KNO) | ___ |`);
    lines.push(`| Right to Delete requests (DEL) | ___ |`);
  }
  lines.push(`| Completed within deadline | ___ |`);
  lines.push(`| Completed with extension | ___ |`);
  lines.push(`| Denied | ___ |`);
  lines.push(`| Still open | ___ |`);
  lines.push(`| Average response time (days) | ___ |`);
  lines.push(``);
  lines.push(`**Reported by:** _______________`);
  lines.push(`**Date:** _______________`);
  lines.push(``);

  // ── Quarterly Summary ───────────────────────────────────────────────

  lines.push(`## Quarterly DSAR Report`);
  lines.push(``);
  lines.push(`### Quarter: Q__ Year: __________`);
  lines.push(``);
  lines.push(`| Month | Received | Completed | On-Time % | Avg Response (days) | Denied |`);
  lines.push(`|-------|----------|-----------|-----------|---------------------|--------|`);
  lines.push(`| Month 1 | ___ | ___ | ___% | ___ | ___ |`);
  lines.push(`| Month 2 | ___ | ___ | ___% | ___ | ___ |`);
  lines.push(`| Month 3 | ___ | ___ | ___% | ___ | ___ |`);
  lines.push(`| **Total** | **___** | **___** | **___**% | **___** | **___** |`);
  lines.push(``);
  lines.push(`**Trends and Observations:**`);
  lines.push(`1. ___`);
  lines.push(`2. ___`);
  lines.push(`3. ___`);
  lines.push(``);
  lines.push(`**Reviewed by:** _______________`);
  lines.push(`**Date:** _______________`);
  lines.push(``);

  // ── SLA Reference ───────────────────────────────────────────────────

  lines.push(`## Response Deadlines Reference`);
  lines.push(``);
  lines.push(`| Regulation | Standard Deadline | Maximum Extension | Total Maximum |`);
  lines.push(`|------------|-------------------|-------------------|---------------|`);
  if (hasGDPR) {
    lines.push(`| GDPR | 30 days | +60 days (complex) | 90 days |`);
  }
  if (hasCCPA) {
    lines.push(`| CCPA/CPRA | 45 days | +45 days (once) | 90 days |`);
  }
  if (hasGDPR) {
    lines.push(`| UK GDPR | 30 days | +60 days (complex) | 90 days |`);
  }
  lines.push(``);

  // ── Footer ──────────────────────────────────────────────────────────

  lines.push(`---`);
  lines.push(``);
  lines.push(`*This DSAR Log Template was generated by [Codepliant](https://github.com/codepliant/codepliant) based on automated code analysis. It implements record-keeping requirements under GDPR Article 12(5) and CCPA operational tracking. Adapt this template to your specific organisational needs and have it reviewed by your data protection officer or legal counsel.*`);
  lines.push(``);

  return lines.join("\n");
}
