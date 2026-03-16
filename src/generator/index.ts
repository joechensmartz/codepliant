import * as fs from "fs";
import * as path from "path";
import type { ScanResult } from "../scanner/index.js";
import type { CodepliantConfig } from "../config.js";
import type { CodepliantPlugin } from "../plugins/index.js";
import { generatePrivacyPolicy } from "./privacy-policy.js";
import { generateTermsOfService } from "./terms-of-service.js";
import { generateAIDisclosure } from "./ai-disclosure.js";
import { generateCookiePolicy } from "./cookie-policy.js";
import { generateDPA } from "./dpa.js";
import { generateAIChecklist } from "./ai-checklist.js";
import { generateComplianceNotes } from "./compliance-notes.js";
import { generateSubprocessorList } from "./subprocessor-list.js";
import { generateDataFlowMapDocument } from "../scanner/data-flow.js";
import { generateSecurityPolicy } from "./security-policy.js";
import { generateDataRetentionPolicy } from "./data-retention.js";
import { generateIncidentResponsePlan } from "./incident-response.js";
import { generateConsentGuide } from "./consent-guide.js";
import { generateDSARGuide } from "./dsar-guide.js";
import { generatePIA } from "./pia.js";
import { generateThirdPartyRiskAssessment } from "./third-party-risk.js";
import { generateEnvAudit } from "../scanner/env-audit.js";
import { generateVulnerabilityReport } from "../scanner/vulnerability.js";
import { generateSOC2Checklist } from "./soc2-checklist.js";
import { generateComplianceTimeline } from "./compliance-timeline.js";
import { generateDataClassification } from "../scanner/data-classification.js";
import { generateEmployeePrivacyNotice } from "./employee-privacy.js";
import { generateAIModelCard } from "./ai-model-card.js";
import { generateVendorContacts } from "./vendor-contacts.js";
import { generateRegulatoryUpdates } from "./regulatory-updates.js";
import { generateDataFlowDiagram } from "./data-map-visual.js";
import { generateAuditLogPolicy } from "./audit-log-policy.js";
import { generateAcceptableAIUsePolicy } from "./acceptable-ai-use.js";
import { generateTransparencyReport } from "./transparency-report.js";
import { generateAcceptableUsePolicy } from "./acceptable-use.js";
import { generateRefundPolicy } from "./refund-policy.js";
import { generateSLA } from "./sla.js";
import { generateRiskRegister } from "./risk-register.js";
import { generateISO27001Checklist } from "./iso27001.js";
import { applyOverrides } from "./customization.js";
import { hasCustomTemplate, renderCustomTemplate } from "../templates/engine.js";
import { generateLicenseCompliance } from "../scanner/license-scanner.js";
import { generateWhistleblowerPolicy } from "./whistleblower.js";
import { generateRecordOfProcessing } from "./record-of-processing.js";
import { generateTransferImpactAssessment } from "./international-transfer-impact.js";
import { generateDataDictionary } from "./data-dictionary.js";
import { generateAccessControlPolicy } from "./access-control-policy.js";
import { generateChangeManagementPolicy } from "./change-management.js";
import { generateDataBreachNotificationTemplates } from "./data-breach-notification.js";
import { generateVendorSecurityQuestionnaire } from "./vendor-questionnaire.js";
import { generateApiPrivacyDocumentation } from "./api-documentation.js";
import { generateSupplierCodeOfConduct } from "./supplier-code-of-conduct.js";
import { generatePrivacyByDesignChecklist } from "./privacy-by-design.js";
import { generatePenetrationTestScope } from "./penetration-test-scope.js";
import { generateCookieInventory } from "./cookie-inventory.js";
import { generateAIGovernanceFramework } from "./ai-governance.js";
import { generateBusinessContinuityPlan } from "./business-continuity.js";
import { scanCloudProviders } from "../scanner/cloud-scanner.js";
import { generateEncryptionPolicy } from "./encryption-policy.js";
import { generateBackupPolicy } from "./backup-policy.js";
import { generateDisasterRecoveryPlan } from "./disaster-recovery.js";
import { generateInformationSecurityPolicy } from "./information-security-policy.js";
import { scanDatabases } from "../scanner/database-scanner.js";
import { scanCiCd } from "../scanner/ci-cd-scanner.js";
import { generateDataSubjectCategories } from "./data-subject-categories.js";
import { generateLawfulBasisAssessment } from "./lawful-basis-assessment.js";
import { generateAnnualReviewChecklist } from "./annual-review-checklist.js";
import {
  buildReviewNotes,
  buildRelatedDocuments,
  getRelatedDocuments,
  getReviewNotes,
} from "./review-notes.js";
import { generateSubprocessorChangeNotification } from "./subprocessor-notification.js";
import { generateDataProtectionPolicy } from "./data-protection-policy.js";
import { generateMediaConsentForm } from "./media-consent.js";
import { generateComplianceCertificate } from "./compliance-certificate.js";
import { generateResponsibleDisclosurePolicy } from "./responsible-disclosure.js";
import { generateApiTermsOfUse } from "./api-terms.js";
import { generateOpenSourceNotice } from "./open-source-notice.js";
import { generateThirdPartyCookieNotice } from "./third-party-cookie-notice.js";
import { generateDataPortabilityGuide } from "./data-portability-guide.js";
import { generateAITrainingDataNotice } from "./ai-training-data-notice.js";
import { generateEmployeeHandbookPrivacySection } from "./employee-handbook-privacy.js";
import { generateVendorOnboardingChecklist } from "./vendor-onboarding-checklist.js";
import { generateExecutiveDashboard } from "./executive-dashboard.js";
import { generatePrivacyNoticeShort } from "./privacy-notice-short.js";
import { generateCookieConsentConfig } from "./cookie-consent-config.js";
import { generateQuickStartGuide } from "./quick-start-guide.js";
import { generateComplianceRoadmap } from "./compliance-roadmap.js";
import { generatePrivacyDashboardConfig } from "./privacy-dashboard-config.js";
import { generateDPOHandbook } from "./dpo-handbook.js";
import { generateIncidentCommunicationTemplates } from "./incident-communication-templates.js";
import { generateTrainingRecord } from "./training-record.js";
import { generateConsentRecordTemplate } from "./consent-record-template.js";
import { generateDataDeletionProcedures } from "./data-deletion-procedures.js";
import { generateSecurityAwarenessProgram } from "./security-awareness-program.js";
import { generatePrivacyRiskMatrix } from "./privacy-risk-matrix.js";
import { generateDataMappingRegister } from "./data-mapping-register.js";
import { generateComplianceMaturityModel } from "./compliance-maturity-model.js";
import { generateAIEthicsStatement } from "./ai-ethics-statement.js";
import { generateDataBreachResponseDrill } from "./data-breach-response-drill.js";
import { generateRegulatoryCorrespondenceLog } from "./regulatory-correspondence-log.js";
import { generatePrivacyPolicyChangelog } from "./privacy-policy-changelog.js";
import { generatePrivacyProgramCharter } from "./privacy-program-charter.js";
import { generateThirdPartyDueDiligence } from "./third-party-due-diligence.js";
import { generateComplianceSummaryEmail } from "./compliance-summary-email.js";
import { generateVendorExitPlan } from "./vendor-exit-plan.js";
import { generatePrivacyPolicyComparison } from "./privacy-policy-comparison.js";
import { generateAIImpactAssessment } from "./ai-impact-assessment.js";
import { generateCrossBorderTransferMap } from "./cross-border-transfer-map.js";
import { generateComplianceGapAnalysis } from "./compliance-gap-analysis.js";
import { generateKeyPersonRiskAssessment } from "./key-person-risk.js";
import { generateRegulatoryReadinessScorecard } from "./regulatory-readiness-scorecard.js";
import { generateDataLifecycleDiagram } from "./data-lifecycle-diagram.js";
import { generateComplianceBudgetTemplate } from "./compliance-budget-template.js";
import { generateIncidentSeverityMatrix } from "./incident-severity-matrix.js";
import { generateDataSubjectRightsPortal } from "./data-subject-rights-portal.js";
import { generateComplianceAutomationGuide } from "./compliance-automation-guide.js";
import { generateComplianceOath } from "./compliance-oath.js";
import { generatePrivacyImpactRegister } from "./privacy-impact-register.js";
import { generateAIRedTeamGuide } from "./ai-red-team-guide.js";
import { generateComplianceKPIDashboard } from "./compliance-kpi-dashboard.js";
import { generateDataRetentionScheduleVisual } from "./data-retention-schedule-visual.js";
import { generateComplianceCommunicationPlan } from "./compliance-communication-plan.js";
import { generateExecutiveBriefing } from "./executive-briefing.js";
import { generateComplianceFAQ } from "./compliance-faq.js";
import { generatePrivacyRoadmap } from "./privacy-roadmap.js";
import { generateComplianceGlossary } from "./compliance-glossary.js";
import { generateVendorRiskTierAssessment } from "./vendor-risk-tier.js";
import { generateComplianceScorecardVisual } from "./compliance-scorecard-visual.js";
import { generateDataSubjectRequestLog } from "./data-subject-request-log.js";

export interface GeneratedDocument {
  name: string;
  filename: string;
  content: string;
}

export interface GeneratorContext {
  companyName: string;
  contactEmail: string;
  website?: string;
  jurisdiction?: string;
  dpoName?: string;
  dpoEmail?: string;
  euRepresentative?: string;
  dataRetentionDays?: number;
  aiRiskLevel?: "minimal" | "limited" | "high";
  aiUsageDescription?: string;
  jurisdictions?: string[];
  companyLocation?: string;
  tollFreeNumber?: string;
  securityEmail?: string;
  bugBountyUrl?: string;
  sectionOverrides?: Record<string, string>;
  language?: string;
}

function configToContext(config?: CodepliantConfig): GeneratorContext {
  return {
    companyName: config?.companyName || "[Your Company Name]",
    contactEmail: config?.contactEmail || "[your-email@example.com]",
    website: config?.website,
    jurisdiction: config?.jurisdiction,
    dpoName: config?.dpoName,
    dpoEmail: config?.dpoEmail,
    euRepresentative: config?.euRepresentative,
    dataRetentionDays: config?.dataRetentionDays,
    aiRiskLevel: config?.aiRiskLevel,
    aiUsageDescription: config?.aiUsageDescription,
    jurisdictions: config?.jurisdictions,
    companyLocation: config?.companyLocation,
    tollFreeNumber: config?.tollFreeNumber,
    securityEmail: config?.securityEmail,
    bugBountyUrl: config?.bugBountyUrl,
    sectionOverrides: config?.sectionOverrides,
    language: config?.language,
  };
}

export function generateDocuments(
  scan: ScanResult,
  config?: CodepliantConfig,
  plugins?: CodepliantPlugin[]
): GeneratedDocument[] {
  const ctx = configToContext(config);
  const docs: GeneratedDocument[] = [];

  // Filter out non-data-processors (utility libs like zod, @tanstack/react-query, etc.)
  // They remain in scan output for transparency, but are excluded from compliance docs.
  const filteredScan: ScanResult = {
    ...scan,
    services: scan.services.filter((s) => s.isDataProcessor !== false),
  };
  // Use filteredScan for all doc generation below
  const docScan = filteredScan;

  // Always generate Privacy Policy if services detected
  if (docScan.services.length > 0) {
    docs.push({
      name: "Privacy Policy",
      filename: "PRIVACY_POLICY.md",
      content: generatePrivacyPolicy(docScan, ctx),
    });
  }

  // Always generate Terms of Service
  docs.push({
    name: "Terms of Service",
    filename: "TERMS_OF_SERVICE.md",
    content: generateTermsOfService(docScan, ctx),
  });

  // Always generate Security Policy (every project needs SECURITY.md)
  docs.push({
    name: "Security Policy",
    filename: "SECURITY.md",
    content: generateSecurityPolicy(docScan, ctx),
  });

  // Always generate Incident Response Plan (every project needs this)
  docs.push({
    name: "Incident Response Plan",
    filename: "INCIDENT_RESPONSE_PLAN.md",
    content: generateIncidentResponsePlan(docScan, ctx),
  });

  // AI Disclosure only if AI services detected
  const aiDisclosure = generateAIDisclosure(docScan, ctx);
  if (aiDisclosure) {
    docs.push({
      name: "AI Disclosure",
      filename: "AI_DISCLOSURE.md",
      content: aiDisclosure,
    });
  }

  // AI Checklist only if AI services detected
  const aiChecklist = generateAIChecklist(docScan, ctx);
  if (aiChecklist) {
    docs.push({
      name: "AI Act Compliance Checklist",
      filename: "AI_ACT_CHECKLIST.md",
      content: aiChecklist,
    });
  }


  // AI Model Card only if AI services detected (EU AI Act Art. 53)
  const aiModelCard = generateAIModelCard(docScan, ctx);
  if (aiModelCard) {
    docs.push({
      name: "AI Model Card",
      filename: "AI_MODEL_CARD.md",
      content: aiModelCard,
    });
  }

  // Cookie Policy only if analytics/auth detected
  const cookiePolicy = generateCookiePolicy(docScan, ctx);
  if (cookiePolicy) {
    docs.push({
      name: "Cookie Policy",
      filename: "COOKIE_POLICY.md",
      content: cookiePolicy,
    });
  }

  // Consent Management Guide only if analytics/advertising detected
  const consentGuide = generateConsentGuide(docScan, ctx);
  if (consentGuide) {
    docs.push({
      name: "Consent Management Guide",
      filename: "CONSENT_MANAGEMENT_GUIDE.md",
      content: consentGuide,
    });
  }

  // Data Processing Agreement if third-party data processors detected
  const dpa = generateDPA(docScan, ctx);
  if (dpa) {
    docs.push({
      name: "Data Processing Agreement",
      filename: "DATA_PROCESSING_AGREEMENT.md",
      content: dpa,
    });
  }

  // Sub-Processor List when 3+ third-party services detected
  const subprocessorList = generateSubprocessorList(docScan, ctx);
  if (subprocessorList) {
    docs.push({
      name: "Sub-Processor List",
      filename: "SUBPROCESSOR_LIST.md",
      content: subprocessorList,
    });
  }

  // Data Retention Policy when 3+ services detected
  const dataRetentionPolicy = generateDataRetentionPolicy(docScan, ctx);
  if (dataRetentionPolicy) {
    docs.push({
      name: "Data Retention Policy",
      filename: "DATA_RETENTION_POLICY.md",
      content: dataRetentionPolicy,
    });
  }

  // DSAR Handling Guide when services detected
  const dsarGuide = generateDSARGuide(docScan, ctx);
  if (dsarGuide) {
    docs.push({
      name: "DSAR Handling Guide",
      filename: "DSAR_HANDLING_GUIDE.md",
      content: dsarGuide,
    });
  }

  // Vendor Contacts Directory — DPA contacts, privacy emails, deletion URLs for DSAR handling
  const vendorContacts = generateVendorContacts(docScan, ctx);
  if (vendorContacts) {
    docs.push({
      name: "Vendor Contacts Directory",
      filename: "VENDOR_CONTACTS.md",
      content: vendorContacts,
    });
  }

  // Data Flow Map — standalone document showing data collection, storage, and sharing
  if (docScan.services.length > 0) {
    docs.push({
      name: "Data Flow Map",
      filename: "DATA_FLOW_MAP.md",
      content: generateDataFlowMapDocument(docScan, ctx.companyName),
    });
  }

  // Compliance Notes — regulation overview based on detected services + jurisdictions
  const complianceNotes = generateComplianceNotes(docScan, ctx);
  if (complianceNotes) {
    docs.push({
      name: "Compliance Notes",
      filename: "COMPLIANCE_NOTES.md",
      content: complianceNotes,
    });
  }

  // Compliance Timeline — deadlines, per-project obligations, action items, review schedule
  const complianceTimeline = generateComplianceTimeline(docScan, ctx);
  if (complianceTimeline) {
    docs.push({
      name: "Compliance Timeline",
      filename: "COMPLIANCE_TIMELINE.md",
      content: complianceTimeline,
    });
  }

  // SOC 2 Readiness Checklist when 5+ services detected
  const soc2Checklist = generateSOC2Checklist(docScan, ctx);
  if (soc2Checklist) {
    docs.push({
      name: "SOC 2 Readiness Checklist",
      filename: "SOC2_READINESS_CHECKLIST.md",
      content: soc2Checklist,
    });
  }


  // ISO 27001 Compliance Checklist when 5+ services detected
  const iso27001Checklist = generateISO27001Checklist(docScan, ctx);
  if (iso27001Checklist) {
    docs.push({
      name: "ISO 27001 Compliance Checklist",
      filename: "ISO_27001_CHECKLIST.md",
      content: iso27001Checklist,
    });
  }
  // Third-Party Risk Assessment when 3+ third-party services detected
  const thirdPartyRisk = generateThirdPartyRiskAssessment(docScan, ctx);
  if (thirdPartyRisk) {
    docs.push({
      name: "Third-Party Risk Assessment",
      filename: "THIRD_PARTY_RISK_ASSESSMENT.md",
      content: thirdPartyRisk,
    });
  }

  // Privacy Impact Assessment (DPIA) only when AI or analytics services detected
  const pia = generatePIA(docScan, ctx);
  if (pia) {
    docs.push({
      name: "Privacy Impact Assessment",
      filename: "PRIVACY_IMPACT_ASSESSMENT.md",
      content: pia,
    });
  }

  // Environment Variable Audit
  const envAudit = generateEnvAudit(docScan.projectPath);
  if (envAudit) {
    docs.push({
      name: "Environment Variable Audit",
      filename: "ENV_AUDIT.md",
      content: envAudit,
    });
  }

  // Data Classification Report — GDPR sensitivity classification of all detected data
  const dataClassification = generateDataClassification(docScan, { companyName: ctx.companyName });
  if (dataClassification) {
    docs.push({
      name: "Data Classification Report",
      filename: "DATA_CLASSIFICATION.md",
      content: dataClassification,
    });
  }

  // Dependency Vulnerability Scan
  const vulnReport = generateVulnerabilityReport(docScan.projectPath);
  if (vulnReport) {
    docs.push({
      name: "Dependency Vulnerability Scan",
      filename: "VULNERABILITY_SCAN.md",
      content: vulnReport,
    });
  }

  // Employee Privacy Notice — only when explicitly enabled via config
  if (config?.generateEmployeeNotice) {
    const employeeNotice = generateEmployeePrivacyNotice(docScan, ctx);
    if (employeeNotice) {
      docs.push({
        name: "Employee Privacy Notice",
        filename: "EMPLOYEE_PRIVACY_NOTICE.md",
        content: employeeNotice,
      });
    }
  }

  // Regulatory Updates — upcoming regulatory changes based on jurisdictions + services
  const regulatoryUpdates = generateRegulatoryUpdates(docScan, ctx);
  if (regulatoryUpdates) {
    docs.push({
      name: "Regulatory Updates",
      filename: "REGULATORY_UPDATES.md",
      content: regulatoryUpdates,
    });
  }

  // Transparency Report — annual public reporting template for data requests & compliance metrics
  if (docScan.services.length > 0) {
    docs.push({
      name: "Transparency Report",
      filename: "TRANSPARENCY_REPORT.md",
      content: generateTransparencyReport(docScan, ctx),
    });
  }

  // Acceptable Use Policy — always generated (standard SaaS AUP)
  docs.push({
    name: "Acceptable Use Policy",
    filename: "ACCEPTABLE_USE_POLICY.md",
    content: generateAcceptableUsePolicy(docScan, ctx),
  });

  // Refund Policy — only when payment services detected
  const refundPolicy = generateRefundPolicy(docScan, ctx);
  if (refundPolicy) {
    docs.push({
      name: "Refund Policy",
      filename: "REFUND_POLICY.md",
      content: refundPolicy,
    });
  }

  // Service Level Agreement — only when monitoring services detected
  const sla = generateSLA(docScan, ctx);
  if (sla) {
    docs.push({
      name: "Service Level Agreement",
      filename: "SERVICE_LEVEL_AGREEMENT.md",
      content: sla,
    });
  }

  // Data Flow Diagram — Mermaid-based visual data flow diagram
  const dataFlowDiagram = generateDataFlowDiagram(docScan, ctx);
  if (dataFlowDiagram) {
    docs.push({
      name: "Data Flow Diagram",
      filename: "DATA_FLOW_DIAGRAM.md",
      content: dataFlowDiagram,
    });
  }

  // Audit Log Policy — what events are logged, retention, access controls
  const auditLogPolicy = generateAuditLogPolicy(docScan, ctx);
  if (auditLogPolicy) {
    docs.push({
      name: "Audit Log Policy",
      filename: "AUDIT_LOG_POLICY.md",
      content: auditLogPolicy,
    });
  }

  // Acceptable AI Use Policy — only when AI services detected
  const acceptableAIUse = generateAcceptableAIUsePolicy(docScan, ctx);
  if (acceptableAIUse) {
    docs.push({
      name: "Acceptable AI Use Policy",
      filename: "ACCEPTABLE_AI_USE_POLICY.md",
      content: acceptableAIUse,
    });
  }

  // Risk Register — catalog of identified compliance risks with scoring matrix
  const riskRegister = generateRiskRegister(docScan, ctx);
  if (riskRegister) {
    docs.push({
      name: "Risk Register",
      filename: "RISK_REGISTER.md",
      content: riskRegister,
    });
  }

  // License Compliance Report — open source license audit
  if (docScan.licenseScan && (docScan.licenseScan.dependencies.length > 0 || docScan.licenseScan.projectLicense)) {
    docs.push({
      name: "License Compliance Report",
      filename: "LICENSE_COMPLIANCE.md",
      content: generateLicenseCompliance(docScan.licenseScan, ctx.companyName),
    });
  }

  // Whistleblower Policy — EU Whistleblower Directive compliance (EU jurisdictions only)
  const whistleblowerPolicy = generateWhistleblowerPolicy(docScan, ctx);
  if (whistleblowerPolicy) {
    docs.push({
      name: "Whistleblower Policy",
      filename: "WHISTLEBLOWER_POLICY.md",
      content: whistleblowerPolicy,
    });
  }

  // Record of Processing Activities — GDPR Article 30 requirement
  const recordOfProcessing = generateRecordOfProcessing(docScan, ctx);
  if (recordOfProcessing) {
    docs.push({
      name: "Record of Processing Activities",
      filename: "RECORD_OF_PROCESSING_ACTIVITIES.md",
      content: recordOfProcessing,
    });
  }

  // Transfer Impact Assessment — Schrems II compliance for EU-to-US transfers
  const transferImpact = generateTransferImpactAssessment(docScan, ctx);
  if (transferImpact) {
    docs.push({
      name: "Transfer Impact Assessment",
      filename: "TRANSFER_IMPACT_ASSESSMENT.md",
      content: transferImpact,
    });
  }

  // Data Dictionary — catalog of every data field across all scanners
  const dataDictionary = generateDataDictionary(docScan, ctx);
  if (dataDictionary) {
    docs.push({
      name: "Data Dictionary",
      filename: "DATA_DICTIONARY.md",
      content: dataDictionary,
    });
  }

  // Access Control Policy — RBAC, password policy, session management, MFA
  const accessControlPolicy = generateAccessControlPolicy(docScan, ctx);
  if (accessControlPolicy) {
    docs.push({
      name: "Access Control Policy",
      filename: "ACCESS_CONTROL_POLICY.md",
      content: accessControlPolicy,
    });
  }

  // Change Management Policy — code review, deployment, rollback procedures
  docs.push({
    name: "Change Management Policy",
    filename: "CHANGE_MANAGEMENT_POLICY.md",
    content: generateChangeManagementPolicy(docScan, ctx),
  });

  // Data Breach Notification Templates — pre-filled templates per jurisdiction
  const breachNotification = generateDataBreachNotificationTemplates(docScan, ctx);
  if (breachNotification) {
    docs.push({
      name: "Data Breach Notification Templates",
      filename: "DATA_BREACH_NOTIFICATION_TEMPLATE.md",
      content: breachNotification,
    });
  }

  // Vendor Security Questionnaire — SIG Lite format, pre-answered from detected controls
  const vendorQuestionnaire = generateVendorSecurityQuestionnaire(docScan, ctx);
  if (vendorQuestionnaire) {
    docs.push({
      name: "Vendor Security Questionnaire",
      filename: "VENDOR_SECURITY_QUESTIONNAIRE.md",
      content: vendorQuestionnaire,
    });
  }

  // API Privacy Documentation — endpoint-level data mapping for API-first companies
  const apiPrivacyDoc = generateApiPrivacyDocumentation(docScan, ctx);
  if (apiPrivacyDoc) {
    docs.push({
      name: "API Privacy Documentation",
      filename: "API_PRIVACY_DOCUMENTATION.md",
      content: apiPrivacyDoc,
    });
  }

  // Supplier Code of Conduct — data protection requirements for vendors/suppliers
  const supplierCodeOfConduct = generateSupplierCodeOfConduct(docScan, ctx);
  if (supplierCodeOfConduct) {
    docs.push({
      name: "Supplier Code of Conduct",
      filename: "SUPPLIER_CODE_OF_CONDUCT.md",
      content: supplierCodeOfConduct,
    });
  }

  // Privacy by Design Checklist — GDPR Article 25 requirements
  const privacyByDesign = generatePrivacyByDesignChecklist(docScan, ctx);
  if (privacyByDesign) {
    docs.push({
      name: "Privacy by Design Checklist",
      filename: "PRIVACY_BY_DESIGN_CHECKLIST.md",
      content: privacyByDesign,
    });
  }

  // Penetration Test Scope — recommended pentest scope based on detected services
  const pentestScope = generatePenetrationTestScope(docScan, ctx);
  if (pentestScope) {
    docs.push({
      name: "Penetration Test Scope",
      filename: "PENTEST_SCOPE.md",
      content: pentestScope,
    });
  }

  // Cookie Inventory — detailed inventory of all cookies (ePrivacy Directive)
  const cookieInventory = generateCookieInventory(docScan, ctx);
  if (cookieInventory) {
    docs.push({
      name: "Cookie Inventory",
      filename: "COOKIE_INVENTORY.md",
      content: cookieInventory,
    });
  }

  // AI Governance Framework — EU AI Act + NIST AI RMF compliance
  const aiGovernance = generateAIGovernanceFramework(docScan, ctx);
  if (aiGovernance) {
    docs.push({
      name: "AI Governance Framework",
      filename: "AI_GOVERNANCE_FRAMEWORK.md",
      content: aiGovernance,
    });
  }

  // Business Continuity Plan — RTO/RPO, failover, communication plan
  const cloudScan = scanCloudProviders(docScan.projectPath);
  const bcp = generateBusinessContinuityPlan(docScan, ctx, cloudScan);
  if (bcp) {
    docs.push({
      name: "Business Continuity Plan",
      filename: "BUSINESS_CONTINUITY_PLAN.md",
      content: bcp,
    });
  }

  // Shared scanner results for security docs
  const dbScan = scanDatabases(docScan.projectPath);
  const cicdScan = scanCiCd(docScan.projectPath);

  // Encryption Policy — at-rest, in-transit, key management
  const encryptionPolicy = generateEncryptionPolicy(docScan, ctx, dbScan, cloudScan);
  if (encryptionPolicy) {
    docs.push({
      name: "Encryption Policy",
      filename: "ENCRYPTION_POLICY.md",
      content: encryptionPolicy,
    });
  }

  // Backup Policy — schedules, retention, recovery testing
  const backupPolicy = generateBackupPolicy(docScan, ctx, dbScan);
  if (backupPolicy) {
    docs.push({
      name: "Backup Policy",
      filename: "BACKUP_POLICY.md",
      content: backupPolicy,
    });
  }

  // Disaster Recovery Plan — recovery procedures, communication, testing
  const drp = generateDisasterRecoveryPlan(docScan, ctx, cloudScan, cicdScan);
  if (drp) {
    docs.push({
      name: "Disaster Recovery Plan",
      filename: "DISASTER_RECOVERY_PLAN.md",
      content: drp,
    });
  }

  // Information Security Policy — umbrella ISMS policy (ISO 27001 / NIST CSF)
  const isp = generateInformationSecurityPolicy(docScan, ctx, cicdScan);
  if (isp) {
    docs.push({
      name: "Information Security Policy",
      filename: "INFORMATION_SECURITY_POLICY.md",
      content: isp,
    });
  }

  // Data Subject Categories — GDPR Art. 30 requirement
  const dataSubjectCategories = generateDataSubjectCategories(
    docScan,
    ctx,
    config?.generateEmployeeNotice
  );
  if (dataSubjectCategories) {
    docs.push({
      name: "Data Subject Categories",
      filename: "DATA_SUBJECT_CATEGORIES.md",
      content: dataSubjectCategories,
    });
  }

  // Lawful Basis Assessment — per-processing-activity GDPR Art. 6 assessment
  const lawfulBasisAssessment = generateLawfulBasisAssessment(docScan, ctx);
  if (lawfulBasisAssessment) {
    docs.push({
      name: "Lawful Basis Assessment",
      filename: "LAWFUL_BASIS_ASSESSMENT.md",
      content: lawfulBasisAssessment,
    });
  }

  // Annual Review Checklist — yearly compliance review
  const annualReview = generateAnnualReviewChecklist(docScan, ctx);
  if (annualReview) {
    docs.push({
      name: "Annual Review Checklist",
      filename: "ANNUAL_REVIEW_CHECKLIST.md",
      content: annualReview,
    });
  }

  // Sub-Processor Change Notification — template for notifying customers of sub-processor changes
  const subprocessorNotification = generateSubprocessorChangeNotification(docScan, ctx);
  if (subprocessorNotification) {
    docs.push({
      name: "Sub-Processor Change Notification",
      filename: "SUBPROCESSOR_CHANGE_NOTIFICATION.md",
      content: subprocessorNotification,
    });
  }

  // Data Protection Policy — internal policy covering classification, handling, access, disposal
  const dataProtectionPolicy = generateDataProtectionPolicy(docScan, ctx);
  if (dataProtectionPolicy) {
    docs.push({
      name: "Data Protection Policy",
      filename: "DATA_PROTECTION_POLICY.md",
      content: dataProtectionPolicy,
    });
  }

  // Media Consent Form — user media consent template when storage services detected
  const mediaConsent = generateMediaConsentForm(docScan, ctx);
  if (mediaConsent) {
    docs.push({
      name: "Media Consent Form",
      filename: "MEDIA_CONSENT_FORM.md",
      content: mediaConsent,
    });
  }

  // Responsible Disclosure Policy — bug bounty, reporting process, safe harbor
  const responsibleDisclosure = generateResponsibleDisclosurePolicy(docScan, ctx);
  if (responsibleDisclosure) {
    docs.push({
      name: "Responsible Disclosure Policy",
      filename: "RESPONSIBLE_DISCLOSURE_POLICY.md",
      content: responsibleDisclosure,
    });
  }

  // API Terms of Use — rate limits, authentication, SLA for API consumers
  const apiTerms = generateApiTermsOfUse(docScan, ctx);
  if (apiTerms) {
    docs.push({
      name: "API Terms of Use",
      filename: "API_TERMS_OF_USE.md",
      content: apiTerms,
    });
  }

  // Open Source Notice — attribution notices, license text summaries
  const openSourceNotice = generateOpenSourceNotice(docScan, ctx);
  if (openSourceNotice) {
    docs.push({
      name: "Open Source Notice",
      filename: "OPEN_SOURCE_NOTICE.md",
      content: openSourceNotice,
    });
  }

  // Third-Party Cookie Notice — per-provider cookie notice with opt-out URLs
  const thirdPartyCookieNotice = generateThirdPartyCookieNotice(docScan, ctx);
  if (thirdPartyCookieNotice) {
    docs.push({
      name: "Third-Party Cookie Notice",
      filename: "THIRD_PARTY_COOKIE_NOTICE.md",
      content: thirdPartyCookieNotice,
    });
  }

  // Data Portability Guide — GDPR Art. 20 right to data portability
  const dataPortabilityGuide = generateDataPortabilityGuide(docScan, ctx);
  if (dataPortabilityGuide) {
    docs.push({
      name: "Data Portability Guide",
      filename: "DATA_PORTABILITY_GUIDE.md",
      content: dataPortabilityGuide,
    });
  }

  // AI Training Data Notice — when AI services detected, disclose training data usage
  const aiTrainingDataNotice = generateAITrainingDataNotice(docScan, ctx);
  if (aiTrainingDataNotice) {
    docs.push({
      name: "AI Training Data Notice",
      filename: "AI_TRAINING_DATA_NOTICE.md",
      content: aiTrainingDataNotice,
    });
  }

  // Employee Handbook Privacy Section — monitoring policies, device usage, email monitoring
  const employeeHandbookPrivacy = generateEmployeeHandbookPrivacySection(docScan, ctx);
  if (employeeHandbookPrivacy) {
    docs.push({
      name: "Employee Handbook Privacy Section",
      filename: "EMPLOYEE_HANDBOOK_PRIVACY_SECTION.md",
      content: employeeHandbookPrivacy,
    });
  }

  // Vendor Onboarding Checklist — DPA, security assessment, data classification
  const vendorOnboardingChecklist = generateVendorOnboardingChecklist(docScan, ctx);
  if (vendorOnboardingChecklist) {
    docs.push({
      name: "Vendor Onboarding Checklist",
      filename: "VENDOR_ONBOARDING_CHECKLIST.md",
      content: vendorOnboardingChecklist,
    });
  }

  // Executive Dashboard — one-page C-suite compliance overview
  const executiveDashboard = generateExecutiveDashboard(docScan, ctx);
  if (executiveDashboard) {
    docs.push({
      name: "Executive Dashboard",
      filename: "EXECUTIVE_DASHBOARD.md",
      content: executiveDashboard,
    });
  }

  // Privacy Notice (Short) — one-page simplified privacy notice for app/website display
  const privacyNoticeShort = generatePrivacyNoticeShort(docScan, ctx);
  if (privacyNoticeShort) {
    docs.push({
      name: "Privacy Notice (Short)",
      filename: "PRIVACY_NOTICE_SHORT.md",
      content: privacyNoticeShort,
    });
  }

  // Cookie Consent Config — machine-readable cookie configuration for CMP integration
  const cookieConsentConfig = generateCookieConsentConfig(docScan, ctx);
  if (cookieConsentConfig) {
    docs.push({
      name: "Cookie Consent Configuration",
      filename: "COOKIE_CONSENT_CONFIG.json",
      content: cookieConsentConfig,
    });
  }

  // Quick Start Compliance Guide — always generated, personalized to detected stack
  docs.push({
    name: "Quick Start Compliance Guide",
    filename: "QUICK_START_COMPLIANCE_GUIDE.md",
    content: generateQuickStartGuide(docScan, ctx),
  });

  // Compliance Roadmap — phased implementation plan
  docs.push({
    name: "Compliance Roadmap",
    filename: "COMPLIANCE_ROADMAP.md",
    content: generateComplianceRoadmap(docScan, ctx),
  });

  // Privacy Dashboard Config — machine-readable config for user-facing "My Data" page
  const privacyDashboardConfig = generatePrivacyDashboardConfig(docScan, ctx);
  if (privacyDashboardConfig) {
    docs.push({
      name: "Privacy Dashboard Configuration",
      filename: "PRIVACY_DASHBOARD_CONFIG.json",
      content: privacyDashboardConfig,
    });
  }

  // DPO Handbook — guide for the appointed Data Protection Officer (GDPR Art. 37-39)
  const dpoHandbook = generateDPOHandbook(docScan, ctx);
  if (dpoHandbook) {
    docs.push({
      name: "DPO Handbook",
      filename: "DPO_HANDBOOK.md",
      content: dpoHandbook,
    });
  }

  // Incident Communication Templates — pre-written templates for incident lifecycle
  const incidentCommTemplates = generateIncidentCommunicationTemplates(docScan, ctx);
  if (incidentCommTemplates) {
    docs.push({
      name: "Incident Communication Templates",
      filename: "INCIDENT_COMMUNICATION_TEMPLATES.md",
      content: incidentCommTemplates,
    });
  }

  // Training Record — GDPR Art. 39(1)(b) staff training record
  const trainingRecord = generateTrainingRecord(docScan, ctx);
  if (trainingRecord) {
    docs.push({
      name: "Training Record",
      filename: "TRAINING_RECORD.md",
      content: trainingRecord,
    });
  }

  // Consent Record Template — GDPR Art. 7 consent evidence logging
  const consentRecordTemplate = generateConsentRecordTemplate(docScan, ctx);
  if (consentRecordTemplate) {
    docs.push({
      name: "Consent Record Template",
      filename: "CONSENT_RECORD_TEMPLATE.md",
      content: consentRecordTemplate,
    });
  }

  // Data Deletion Procedures — GDPR Art. 17 right to erasure per-service instructions
  const dataDeletionProcedures = generateDataDeletionProcedures(docScan, ctx);
  if (dataDeletionProcedures) {
    docs.push({
      name: "Data Deletion Procedures",
      filename: "DATA_DELETION_PROCEDURES.md",
      content: dataDeletionProcedures,
    });
  }

  // Security Awareness Program — employee security training program outline
  const securityAwarenessProgram = generateSecurityAwarenessProgram(docScan, ctx);
  if (securityAwarenessProgram) {
    docs.push({
      name: "Security Awareness Program",
      filename: "SECURITY_AWARENESS_PROGRAM.md",
      content: securityAwarenessProgram,
    });
  }

  // Privacy Risk Matrix — visual likelihood x impact matrix for all data processing
  const privacyRiskMatrix = generatePrivacyRiskMatrix(docScan, ctx);
  if (privacyRiskMatrix) {
    docs.push({
      name: "Privacy Risk Matrix",
      filename: "PRIVACY_RISK_MATRIX.md",
      content: privacyRiskMatrix,
    });
  }

  // Data Mapping Register — GDPR Art. 30 complete data inventory
  const dataMappingRegister = generateDataMappingRegister(docScan, ctx);
  if (dataMappingRegister) {
    docs.push({
      name: "Data Mapping Register",
      filename: "DATA_MAPPING_REGISTER.md",
      content: dataMappingRegister,
    });
  }

  // AI Ethics Statement — UNESCO AI Ethics Recommendation aligned, when AI services detected
  const aiEthicsStatement = generateAIEthicsStatement(docScan, ctx);
  if (aiEthicsStatement) {
    docs.push({
      name: "AI Ethics Statement",
      filename: "AI_ETHICS_STATEMENT.md",
      content: aiEthicsStatement,
    });
  }

  // Data Breach Response Drill — tabletop exercise template for breach response
  const breachDrill = generateDataBreachResponseDrill(docScan, ctx);
  if (breachDrill) {
    docs.push({
      name: "Data Breach Response Drill Template",
      filename: "DATA_BREACH_DRILL_TEMPLATE.md",
      content: breachDrill,
    });
  }

  // Regulatory Correspondence Log — tracking communications with regulators
  const regulatoryCorrespondenceLog = generateRegulatoryCorrespondenceLog(docScan, ctx);
  if (regulatoryCorrespondenceLog) {
    docs.push({
      name: "Regulatory Correspondence Log",
      filename: "REGULATORY_CORRESPONDENCE_LOG.md",
      content: regulatoryCorrespondenceLog,
    });
  }

  // Privacy Policy Changelog — tracking all changes to privacy policy over time
  const privacyPolicyChangelog = generatePrivacyPolicyChangelog(docScan, ctx);
  if (privacyPolicyChangelog) {
    docs.push({
      name: "Privacy Policy Changelog",
      filename: "PRIVACY_POLICY_CHANGELOG.md",
      content: privacyPolicyChangelog,
    });
  }

  // Privacy Program Charter — formal privacy program establishment with governance
  const privacyProgramCharter = generatePrivacyProgramCharter(docScan, ctx);
  if (privacyProgramCharter) {
    docs.push({
      name: "Privacy Program Charter",
      filename: "PRIVACY_PROGRAM_CHARTER.md",
      content: privacyProgramCharter,
    });
  }

  // Third-Party Due Diligence Template — vendor evaluation questionnaire
  const thirdPartyDueDiligence = generateThirdPartyDueDiligence(docScan, ctx);
  if (thirdPartyDueDiligence) {
    docs.push({
      name: "Third-Party Due Diligence Template",
      filename: "THIRD_PARTY_DUE_DILIGENCE_TEMPLATE.md",
      content: thirdPartyDueDiligence,
    });
  }

  // Compliance Maturity Model — 5-level auto-assessed maturity with roadmap
  const complianceMaturityModel = generateComplianceMaturityModel(docScan, ctx, docs);
  if (complianceMaturityModel) {
    docs.push({
      name: "Compliance Maturity Model",
      filename: "COMPLIANCE_MATURITY_MODEL.md",
      content: complianceMaturityModel,
    });
  }

  // Compliance Summary Email — stakeholder/board-ready compliance status email
  const complianceSummaryEmail = generateComplianceSummaryEmail(docScan, ctx, docs);
  if (complianceSummaryEmail) {
    docs.push({
      name: "Compliance Summary Email",
      filename: "COMPLIANCE_SUMMARY_EMAIL.md",
      content: complianceSummaryEmail,
    });
  }

  // Vendor Exit Plan — migration strategies for each detected third-party service (enterprise DPA requirement)
  const vendorExitPlan = generateVendorExitPlan(docScan, ctx);
  if (vendorExitPlan) {
    docs.push({
      name: "Vendor Exit Plan",
      filename: "VENDOR_EXIT_PLAN.md",
      content: vendorExitPlan,
    });
  }

  // Privacy Policy Comparison — benchmark against industry standards (Stripe, Vercel, Linear, etc.)
  const privacyPolicyComparison = generatePrivacyPolicyComparison(docScan, ctx);
  if (privacyPolicyComparison) {
    docs.push({
      name: "Privacy Policy Comparison",
      filename: "PRIVACY_POLICY_COMPARISON.md",
      content: privacyPolicyComparison,
    });
  }

  // AI Impact Assessment — EU AI Act + Colorado AI Act combined assessment
  const aiImpactAssessment = generateAIImpactAssessment(docScan, ctx);
  if (aiImpactAssessment) {
    docs.push({
      name: "AI Impact Assessment",
      filename: "AI_IMPACT_ASSESSMENT.md",
      content: aiImpactAssessment,
    });
  }

  // Cross-Border Transfer Map — visual map of all international data transfers
  const crossBorderMap = generateCrossBorderTransferMap(docScan, ctx);
  if (crossBorderMap) {
    docs.push({
      name: "Cross-Border Transfer Map",
      filename: "CROSS_BORDER_TRANSFER_MAP.md",
      content: crossBorderMap,
    });
  }

  // Compliance Gap Analysis — current state vs target state per regulation
  const complianceGapAnalysis = generateComplianceGapAnalysis(docScan, ctx);
  if (complianceGapAnalysis) {
    docs.push({
      name: "Compliance Gap Analysis",
      filename: "COMPLIANCE_GAP_ANALYSIS.md",
      content: complianceGapAnalysis,
    });
  }

  // Key Person Risk Assessment — single points of failure + cross-training recommendations
  const keyPersonRisk = generateKeyPersonRiskAssessment(docScan, ctx);
  if (keyPersonRisk) {
    docs.push({
      name: "Key Person Risk Assessment",
      filename: "KEY_PERSON_RISK_ASSESSMENT.md",
      content: keyPersonRisk,
    });
  }

  // Regulatory Readiness Scorecard — per-regulation readiness score with visual bars
  const regulatoryScorecard = generateRegulatoryReadinessScorecard(docScan, ctx);
  if (regulatoryScorecard) {
    docs.push({
      name: "Regulatory Readiness Scorecard",
      filename: "REGULATORY_READINESS_SCORECARD.md",
      content: regulatoryScorecard,
    });
  }

  // Data Lifecycle Diagram — Mermaid diagram: Collection -> Processing -> Storage -> Sharing -> Deletion
  const dataLifecycle = generateDataLifecycleDiagram(docScan, ctx);
  if (dataLifecycle) {
    docs.push({
      name: "Data Lifecycle Diagram",
      filename: "DATA_LIFECYCLE_DIAGRAM.md",
      content: dataLifecycle,
    });
  }

  // Compliance Budget Template — estimated costs for compliance program
  docs.push({
    name: "Compliance Budget Template",
    filename: "COMPLIANCE_BUDGET_TEMPLATE.md",
    content: generateComplianceBudgetTemplate(docScan, ctx),
  });

  // Incident Severity Matrix — P0-P4 severity levels with response times and escalation
  docs.push({
    name: "Incident Severity Matrix",
    filename: "INCIDENT_SEVERITY_MATRIX.md",
    content: generateIncidentSeverityMatrix(docScan, ctx),
  });

  // Data Subject Rights Portal — self-service privacy portal specification
  const dataSubjectRightsPortal = generateDataSubjectRightsPortal(docScan, ctx);
  if (dataSubjectRightsPortal) {
    docs.push({
      name: "Data Subject Rights Portal",
      filename: "DATA_SUBJECT_RIGHTS_PORTAL.md",
      content: dataSubjectRightsPortal,
    });
  }

  // Compliance Automation Guide — CI/CD integration, cron scanning, webhook alerts
  docs.push({
    name: "Compliance Automation Guide",
    filename: "COMPLIANCE_AUTOMATION_GUIDE.md",
    content: generateComplianceAutomationGuide(docScan, ctx),
  });

  // Compliance Oath — management commitment statement (ISO 27001 management commitment)
  const complianceOath = generateComplianceOath(docScan, ctx);
  if (complianceOath) {
    docs.push({
      name: "Compliance Oath",
      filename: "COMPLIANCE_OATH.md",
      content: complianceOath,
    });
  }

  // Privacy Impact Register — registry of all PIAs/DPIAs conducted (GDPR Art. 35(1))
  const privacyImpactRegister = generatePrivacyImpactRegister(docScan, ctx);
  if (privacyImpactRegister) {
    docs.push({
      name: "Privacy Impact Register",
      filename: "PRIVACY_IMPACT_REGISTER.md",
      content: privacyImpactRegister,
    });
  }

  // AI Red Team Guide — adversarial testing guide for AI features (OWASP LLM Top 10)
  const aiRedTeamGuide = generateAIRedTeamGuide(docScan, ctx);
  if (aiRedTeamGuide) {
    docs.push({
      name: "AI Red Team Guide",
      filename: "AI_RED_TEAM_GUIDE.md",
      content: aiRedTeamGuide,
    });
  }

  // Compliance KPI Dashboard — KPIs for compliance program measurement
  const complianceKPIDashboard = generateComplianceKPIDashboard(docScan, ctx);
  if (complianceKPIDashboard) {
    docs.push({
      name: "Compliance KPI Dashboard",
      filename: "COMPLIANCE_KPI_DASHBOARD.md",
      content: complianceKPIDashboard,
    });
  }

  // Data Retention Schedule Visual — Mermaid Gantt chart of retention timelines
  const dataRetentionVisual = generateDataRetentionScheduleVisual(docScan, ctx);
  if (dataRetentionVisual) {
    docs.push({
      name: "Data Retention Schedule Visual",
      filename: "DATA_RETENTION_SCHEDULE_VISUAL.md",
      content: dataRetentionVisual,
    });
  }

  // Compliance Communication Plan — internal communication plan for compliance updates
  const complianceCommunicationPlan = generateComplianceCommunicationPlan(docScan, ctx);
  if (complianceCommunicationPlan) {
    docs.push({
      name: "Compliance Communication Plan",
      filename: "COMPLIANCE_COMMUNICATION_PLAN.md",
      content: complianceCommunicationPlan,
    });
  }

  // Compliance Glossary — auto-generated glossary of compliance terms used in generated docs
  const complianceGlossary = generateComplianceGlossary(docScan, ctx);
  if (complianceGlossary) {
    docs.push({
      name: "Compliance Glossary",
      filename: "COMPLIANCE_GLOSSARY.md",
      content: complianceGlossary,
    });
  }

  // Vendor Risk Tier Assessment — tier each detected vendor: Critical/High/Medium/Low
  const vendorRiskTier = generateVendorRiskTierAssessment(docScan, ctx);
  if (vendorRiskTier) {
    docs.push({
      name: "Vendor Risk Tier Assessment",
      filename: "VENDOR_RISK_TIER_ASSESSMENT.md",
      content: vendorRiskTier,
    });
  }

  // Compliance Scorecard — visual ASCII scorecard with letter grades per area
  const complianceScorecard = generateComplianceScorecardVisual(docScan, ctx);
  if (complianceScorecard) {
    docs.push({
      name: "Compliance Scorecard",
      filename: "COMPLIANCE_SCORECARD.md",
      content: complianceScorecard,
    });
  }

  // DSAR Log Template — spreadsheet-style template for logging data subject requests (GDPR Art. 12(5))
  const dsarLogTemplate = generateDataSubjectRequestLog(docScan, ctx);
  if (dsarLogTemplate) {
    docs.push({
      name: "DSAR Log Template",
      filename: "DSAR_LOG_TEMPLATE.md",
      content: dsarLogTemplate,
    });
  }

  // Compliance FAQ — auto-generated FAQ based on detected services
  const complianceFAQ = generateComplianceFAQ(docScan, ctx);
  if (complianceFAQ) {
    docs.push({
      name: "Compliance FAQ",
      filename: "COMPLIANCE_FAQ.md",
      content: complianceFAQ,
    });
  }

  // Privacy Roadmap — 12-month privacy program roadmap based on maturity level
  const privacyRoadmap = generatePrivacyRoadmap(docScan, ctx, docs);
  if (privacyRoadmap) {
    docs.push({
      name: "Privacy Program Roadmap",
      filename: "PRIVACY_ROADMAP.md",
      content: privacyRoadmap,
    });
  }

  // Executive Briefing — one-page C-suite briefing with compliance gauge
  // Note: score is not available at this point; it will show 0/N/A.
  const executiveBriefing = generateExecutiveBriefing(docScan, ctx, docs);
  if (executiveBriefing) {
    docs.push({
      name: "Executive Briefing",
      filename: "EXECUTIVE_BRIEFING.md",
      content: executiveBriefing,
    });
  }

  // Compliance Certificate — self-attestation certificate (generated after all other docs)
  // Note: score is not available at this point; it will show 0/N/A.
  // The certificate is primarily about documenting which docs were generated.
  const complianceCertificate = generateComplianceCertificate(docScan, ctx, docs);
  if (complianceCertificate) {
    docs.push({
      name: "Compliance Certificate",
      filename: "COMPLIANCE_CERTIFICATE.md",
      content: complianceCertificate,
    });
  }

  // Run custom generators from plugins
  if (plugins) {
    for (const plugin of plugins) {
      if (plugin.generators) {
        for (const customGenerator of plugin.generators) {
          try {
            const doc = customGenerator.generate(docScan, ctx);
            if (doc) {
              docs.push(doc);
            }
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(
              `Plugin generator "${customGenerator.name}" from "${plugin.name}" failed: ${message}`
            );
          }
        }
      }
    }
  }

  // Apply custom templates: if a user template exists for a document, use it
  // instead of the built-in generated content
  for (const doc of docs) {
    const customContent = renderCustomTemplate(docScan.projectPath, doc.filename, docScan, ctx);
    if (customContent !== null) {
      doc.content = customContent;
    }
  }

  // Apply section-level overrides if configured
  if (ctx.sectionOverrides && Object.keys(ctx.sectionOverrides).length > 0) {
    for (const doc of docs) {
      doc.content = applyOverrides(doc.content, ctx.sectionOverrides);
    }
  }

  // Append Review Notes and Related Documents sections to all generated docs.
  // Only add if the document doesn't already include these sections (the new
  // generators like data-subject-categories, lawful-basis-assessment, and
  // annual-review-checklist embed them inline).
  for (const doc of docs) {
    const hasReviewNotes = doc.content.includes("## Review Notes");
    const hasRelatedDocs = doc.content.includes("## Related Documents");

    // Insert before the footer divider (---) at the end if present
    const footerMatch = doc.content.match(/\n---\n(?=[^]*$)/);

    let reviewNotesBlock = "";
    let relatedDocsBlock = "";

    if (!hasReviewNotes) {
      const reviewData = getReviewNotes(doc.filename);
      if (reviewData) {
        reviewNotesBlock = buildReviewNotes(reviewData);
      }
    }

    if (!hasRelatedDocs) {
      const relatedDocs = getRelatedDocuments(doc.filename);
      if (relatedDocs.length > 0) {
        relatedDocsBlock = buildRelatedDocuments(relatedDocs);
      }
    }

    if (reviewNotesBlock || relatedDocsBlock) {
      const insertion = "\n" + reviewNotesBlock + relatedDocsBlock;
      if (footerMatch && footerMatch.index !== undefined) {
        // Insert before the final footer divider
        doc.content =
          doc.content.slice(0, footerMatch.index) +
          insertion +
          doc.content.slice(footerMatch.index);
      } else {
        // Append at the end
        doc.content += insertion;
      }
    }
  }

  // Inject document metadata headers (Document Version, Next Review Date, Document Owner)
  // into any document that doesn't already contain them.
  const metaDate = new Date().toISOString().split("T")[0];
  const nextReviewDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const documentOwner = ctx.companyName;

  for (const doc of docs) {
    // Skip JSON files and docs that already have Document Version
    if (doc.filename.endsWith(".json") || doc.content.includes("Document Version")) {
      continue;
    }

    // Insert metadata block after the first header line (# Title) and any
    // existing blockquote lines that follow it.
    const headerMatch = doc.content.match(/^(# .+\n(?:\n(?:>.*\n)*)?)/);
    if (headerMatch) {
      const metaBlock =
        `> **Document Version:** 1.0  \n` +
        `> **Document Owner:** ${documentOwner}  \n` +
        `> **Next Review Date:** ${nextReviewDate}\n\n`;

      // If the header already has blockquote lines, append to them
      const headerEnd = headerMatch[0];
      if (headerEnd.includes(">")) {
        // Insert before the blank line after blockquotes
        const lastQuoteIdx = doc.content.lastIndexOf(">", headerMatch[0].length - 1);
        const lineEnd = doc.content.indexOf("\n", lastQuoteIdx);
        if (lineEnd !== -1) {
          doc.content =
            doc.content.slice(0, lineEnd + 1) +
            `> **Document Version:** 1.0  \n` +
            `> **Document Owner:** ${documentOwner}  \n` +
            `> **Next Review Date:** ${nextReviewDate}\n` +
            doc.content.slice(lineEnd + 1);
        }
      } else {
        // No blockquotes: insert after the title line + blank line
        const titleEnd = doc.content.indexOf("\n");
        if (titleEnd !== -1) {
          doc.content =
            doc.content.slice(0, titleEnd + 1) +
            "\n" + metaBlock +
            doc.content.slice(titleEnd + 1);
        }
      }
    }
  }

  return docs;
}

export function writeDocuments(
  docs: GeneratedDocument[],
  outputDir: string
): string[] {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const writtenFiles: string[] = [];

  for (const doc of docs) {
    const filePath = path.join(outputDir, doc.filename);
    fs.writeFileSync(filePath, doc.content, "utf-8");
    writtenFiles.push(filePath);
  }

  return writtenFiles;
}
