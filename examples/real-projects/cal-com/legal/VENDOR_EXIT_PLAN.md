# Vendor Exit Plan

> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16


**Last updated:** 2026-03-16

**Project:** calcom-monorepo

**Organization:** [Your Company Name]

---

## Purpose

This document outlines the migration strategy for each third-party service provider integrated into **calcom-monorepo**. It ensures the organization can transition away from any vendor without unacceptable disruption to service delivery or data loss.

This plan is required by enterprise Data Processing Agreements (DPAs) and demonstrates vendor independence in accordance with business continuity best practices.

For questions about vendor exit strategies, contact [your-email@example.com].

---

## Executive Summary

| Vendor | Category | Migration Complexity | Estimated Timeline | Alternatives |
|--------|----------|---------------------|-------------------|-------------|
| HubSpot | other | High | 4-8 weeks | Salesforce, Pipedrive, Zoho CRM |
| SendGrid | email | Medium | 2-3 weeks | Resend, Postmark, Amazon SES |
| Sentry | monitoring | Low | 1-2 weeks | Datadog, Bugsnag, Rollbar |
| Upstash Redis | database | Low | 1-2 weeks | Redis Cloud, Amazon ElastiCache, Self-hosted Redis |
| Google Analytics | analytics | Medium | 2-4 weeks | PostHog, Plausible, Fathom |
| Google Tag Manager | analytics | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| Google Auth | auth | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| Google APIs | other | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| Intercom | other | High | 4-6 weeks | Zendesk, Crisp, HelpScout |
| Plausible Analytics | analytics | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| PostgreSQL | database | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| PostgreSQL (env) | database | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| PostHog | analytics | Medium | 2-3 weeks | Mixpanel, Amplitude, Google Analytics |
| Redis | database | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| Redis (env) | database | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |
| Stripe | payment | High | 4-8 weeks | PayPal/Braintree, Adyen, Square |
| Twilio | other | Medium | [Estimate based on integration depth and data volume] | [Research alternatives based on your requirements] |

---

## Detailed Exit Plans

### HubSpot

**Category:** other
**Migration Complexity:** High
**Estimated Timeline:** 4-8 weeks

#### Data Export Procedures

Settings: bulk data export; API: CRM object retrieval; GDPR: data portability request

#### Data Portability

Full CRM data exportable via Settings or API; includes contacts, deals, and activities

#### Alternative Services

- Salesforce
- Pipedrive
- Zoho CRM
- Close CRM

#### Contract Termination

Cancel via account settings; annual contracts have specific termination windows

#### Key Migration Risks

- Workflow and automation migration
- Custom property mapping
- Integration reconnection
- Email template migration

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from HubSpot
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with HubSpot
- [ ] Verify data deletion from HubSpot per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### SendGrid

**Category:** email
**Migration Complexity:** Medium
**Estimated Timeline:** 2-3 weeks

#### Data Export Procedures

API: export contact lists, templates, and activity; Dashboard: CSV export

#### Data Portability

Contact lists, templates, and suppression lists exportable

#### Alternative Services

- Resend
- Postmark
- Amazon SES
- Mailgun
- SparkPost

#### Contract Termination

Cancel via dashboard; account data retained for 30 days

#### Key Migration Risks

- IP reputation does not transfer
- Template format conversion
- Suppression list migration

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from SendGrid
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with SendGrid
- [ ] Verify data deletion from SendGrid per DPA requirements
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

### Upstash Redis

**Category:** database
**Migration Complexity:** Low
**Estimated Timeline:** 1-2 weeks

#### Data Export Procedures

Redis CLI: DUMP/RESTORE commands; or use RDB snapshot

#### Data Portability

Standard Redis protocol; data fully portable via RDB or RESP

#### Alternative Services

- Redis Cloud
- Amazon ElastiCache
- Self-hosted Redis
- Dragonfly

#### Contract Termination

Cancel via dashboard; data deleted after account closure

#### Key Migration Risks

- Connection string updates
- REST API to standard Redis protocol change if using HTTP mode

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from Upstash Redis
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Upstash Redis
- [ ] Verify data deletion from Upstash Redis per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Google Analytics

**Category:** analytics
**Migration Complexity:** Medium
**Estimated Timeline:** 2-4 weeks

#### Data Export Procedures

BigQuery Export, Google Analytics API, or manual CSV export from dashboard

#### Data Portability

Historical data exportable via BigQuery or API; raw event data available

#### Alternative Services

- PostHog
- Plausible
- Fathom
- Matomo (self-hosted)
- Mixpanel

#### Contract Termination

Delete property from GA dashboard; data retained for 26 months by default

#### Key Migration Risks

- Historical data format conversion
- Custom event taxonomy mapping
- Attribution model differences

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from Google Analytics
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Google Analytics
- [ ] Verify data deletion from Google Analytics per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Google Tag Manager

**Category:** analytics
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
- [ ] Export all data from Google Tag Manager
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Google Tag Manager
- [ ] Verify data deletion from Google Tag Manager per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Google Auth

**Category:** auth
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
- [ ] Export all data from Google Auth
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Google Auth
- [ ] Verify data deletion from Google Auth per DPA requirements
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

### Intercom

**Category:** other
**Migration Complexity:** High
**Estimated Timeline:** 4-6 weeks

#### Data Export Procedures

Data export via Settings > Data Management; API: export conversations and contacts

#### Data Portability

Conversation history, contact data, and articles exportable

#### Alternative Services

- Zendesk
- Crisp
- HelpScout
- Freshdesk
- Chatwoot (self-hosted)

#### Contract Termination

Cancel via billing settings; annual contracts may have early termination fees

#### Key Migration Risks

- Conversation history migration
- Custom bot and workflow recreation
- Product tour migration

#### Migration Checklist

- [ ] Identify all integration points in codebase
- [ ] Export all data from Intercom
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Intercom
- [ ] Verify data deletion from Intercom per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Plausible Analytics

**Category:** analytics
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
- [ ] Export all data from Plausible Analytics
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Plausible Analytics
- [ ] Verify data deletion from Plausible Analytics per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### PostgreSQL

**Category:** database
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
- [ ] Export all data from PostgreSQL
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with PostgreSQL
- [ ] Verify data deletion from PostgreSQL per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### PostgreSQL (env)

**Category:** database
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
- [ ] Export all data from PostgreSQL (env)
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with PostgreSQL (env)
- [ ] Verify data deletion from PostgreSQL (env) per DPA requirements
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

### Redis

**Category:** database
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
- [ ] Export all data from Redis
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Redis
- [ ] Verify data deletion from Redis per DPA requirements
- [ ] Update compliance documentation (privacy policy, sub-processor list)

### Redis (env)

**Category:** database
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
- [ ] Export all data from Redis (env)
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Redis (env)
- [ ] Verify data deletion from Redis (env) per DPA requirements
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

### Twilio

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
- [ ] Export all data from Twilio
- [ ] Select and evaluate replacement service
- [ ] Implement replacement integration in staging
- [ ] Verify data migration completeness
- [ ] Update environment variables and configuration
- [ ] Test all affected functionality
- [ ] Deploy to production with rollback plan
- [ ] Confirm contract termination with Twilio
- [ ] Verify data deletion from Twilio per DPA requirements
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