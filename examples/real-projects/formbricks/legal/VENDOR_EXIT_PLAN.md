# Vendor Exit Plan

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** formbricks

**Organization:** [Your Company Name]

---

## Purpose

This document outlines the migration strategy for each third-party service provider integrated into **formbricks**. It ensures the organization can transition away from any vendor without unacceptable disruption to service delivery or data loss.

This plan is required by enterprise Data Processing Agreements (DPAs) and demonstrates vendor independence in accordance with business continuity best practices.

For questions about vendor exit strategies, contact [your-email@example.com].

---

## Executive Summary

| Vendor | Category | Migration Complexity | Estimated Timeline | Alternatives |
|--------|----------|---------------------|-------------------|-------------|
| Amazon S3 (AWS) | storage | Medium | 2-4 weeks (depends on data volume) | Google Cloud Storage, Azure Blob Storage, Backblaze B2 |
| Sentry | monitoring | Low | 1-2 weeks | Datadog, Bugsnag, Rollbar |
| Google APIs | other | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| PostHog | analytics | Medium | 2-3 weeks | Mixpanel, Amplitude, Google Analytics |
| Stripe | payment | High | 4-8 weeks | PayPal/Braintree, Adyen, Square |

---

## Detailed Exit Plans

### Amazon S3 (AWS)

**Category:** storage
**Migration Complexity:** Medium
**Estimated Timeline:** 2-4 weeks (depends on data volume)

#### Data Export Procedures

AWS CLI: aws s3 sync; SDK: programmatic download; S3 Batch Operations for large-scale

#### Data Portability

All objects downloadable; metadata preserved; no proprietary format lock-in

#### Alternative Services

- Google Cloud Storage
- Azure Blob Storage
- Backblaze B2
- Cloudflare R2
- MinIO (self-hosted)

#### Contract Termination

Delete S3 buckets; close AWS account; data transfer charges apply

#### Key Migration Risks

- Data transfer costs (egress fees)
- IAM policy migration
- Presigned URL expiration
- Cross-region latency changes

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from Amazon S3 (AWS)
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Amazon S3 (AWS)
- [ ] Verify data deletion from Amazon S3 (AWS) per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Sentry

**Category:** monitoring
**Migration Complexity:** Low
**Estimated Timeline:** 1-2 weeks

#### Data Export Procedures

API: export issues, events, and project data; Discover: CSV export

#### Data Portability

Issue and event data exportable via API; source maps stored locally

#### Alternative Services

- Datadog
- Bugsnag
- Rollbar
- LogRocket
- GlitchTip (self-hosted)

#### Contract Termination

Cancel via organization settings; data deleted after retention period

#### Key Migration Risks

- Alert rule migration
- Release tracking reconfiguration
- Source map upload pipeline changes

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from Sentry
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Sentry
- [ ] Verify data deletion from Sentry per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Google APIs

**Category:** other
**Migration Complexity:** Medium
**Estimated Timeline:** [Estimate based on integration depth and data volume]

#### Data Export Procedures

[Contact vendor for data export procedures]

#### Data Portability

[Review vendor documentation for data portability options]

#### Alternative Services

- [Research alternatives based on your requirements]

#### Contract Termination

[Review contract terms for termination procedures and notice periods]

#### Key Migration Risks

- Data migration complexity
- Service continuity during transition
- Contract termination fees

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from Google APIs
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Google APIs
- [ ] Verify data deletion from Google APIs per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### PostHog

**Category:** analytics
**Migration Complexity:** Medium
**Estimated Timeline:** 2-3 weeks

#### Data Export Procedures

Dashboard: export events; API: bulk event retrieval; self-hosted: direct database access

#### Data Portability

Full event data exportable; open-source version allows direct database access

#### Alternative Services

- Mixpanel
- Amplitude
- Google Analytics
- Plausible
- Matomo (self-hosted)

#### Contract Termination

Cancel subscription via dashboard; self-hosted instances can continue indefinitely

#### Key Migration Risks

- Feature flag migration if using PostHog flags
- Session recording data non-transferable

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from PostHog
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with PostHog
- [ ] Verify data deletion from PostHog per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Stripe

**Category:** payment
**Migration Complexity:** High
**Estimated Timeline:** 4-8 weeks

#### Data Export Procedures

Dashboard: export transactions, customers, invoices as CSV; API: bulk data retrieval

#### Data Portability

Full transaction history, customer data, and subscription data exportable via API and dashboard

#### Alternative Services

- PayPal/Braintree
- Adyen
- Square
- Paddle
- Lemon Squeezy

#### Contract Termination

Cancel via dashboard; must migrate active subscriptions before closure; 90-day data access post-closure

#### Key Migration Risks

- Active subscription migration complexity
- PCI compliance re-certification with new provider
- Webhook endpoint reconfiguration
- Payment method re-collection from customers

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from Stripe
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Stripe
- [ ] Verify data deletion from Stripe per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

---

## General Migration Framework

### Phase 1: Planning (Week 1)

1. **Impact Assessment** — Identify all systems, features, and data flows dependent on the vendor
2. **Alternative Evaluation** — Score alternatives on feature parity, pricing, compliance, and data residency
3. **Stakeholder Communication** — Notify affected teams and set expectations for timeline
4. **Budget Approval** — Secure budget for migration effort and potential parallel running costs

### Phase 2: Preparation (Week 2-3)

1. **Data Export** — Execute full data export from current vendor
2. **Data Validation** — Verify export completeness and integrity
3. **Environment Setup** — Provision accounts and configure new vendor
4. **Code Changes** — Implement abstraction layer or direct replacement in codebase

### Phase 3: Migration (Week 3-4)

1. **Staging Deployment** — Deploy to staging with new vendor integration
2. **Regression Testing** — Run full test suite against new integration
3. **Performance Testing** — Verify latency, throughput, and reliability meet requirements
4. **Data Migration** — Import historical data into new vendor (if applicable)

### Phase 4: Cutover (Week 4+)

1. **Blue-Green Deployment** — Run both vendors in parallel during cutover window
2. **Production Switch** — Point production traffic to new vendor
3. **Monitoring** — Watch for errors, performance degradation, and data inconsistencies
4. **Old Vendor Cleanup** — Terminate contract, request data deletion, revoke API keys

### Phase 5: Post-Migration (Week 5+)

1. **Documentation Update** — Update privacy policy, sub-processor list, vendor contacts
2. **Compliance Review** — Verify new vendor meets all DPA and regulatory requirements
3. **Lessons Learned** — Document migration experience for future reference
4. **Audit Trail** — File migration records for compliance auditing

---

## Data Deletion Verification

After completing any vendor migration, verify the following:

- [ ] All personal data has been deleted from the old vendor per GDPR Art. 17
- [ ] Vendor has provided written confirmation of data deletion
- [ ] Backup copies at the vendor have been destroyed (confirm retention schedules)
- [ ] API keys and access tokens for the old vendor have been revoked
- [ ] DNS records, webhooks, and integrations pointing to old vendor have been removed

---

## Review Schedule

This vendor exit plan should be reviewed:

- **Annually** as part of the regular vendor management review
- **When adding** a new third-party vendor
- **When a vendor** changes pricing, terms, or has a significant incident
- **Before contract renewal** to evaluate whether migration is advantageous

---

*This vendor exit plan was generated by [Codepliant](https://github.com/joechensmartz/codepliant) based on automated code analysis. Review and customize for your specific requirements. This document does not constitute legal advice.*