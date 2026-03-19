> **Document Version:** 1.0  
> **Document Owner:** Acme Inc  
> **Next Review Date:** 2027-03-18


**Last updated:** 2026-03-18

**Project:** nextjs-saas-example

**Company:** Acme Inc

## Related Documents

- Privacy Policy (`PRIVACY_POLICY.md`)
- Cookie Policy (`COOKIE_POLICY.md`)
- Lawful Basis Assessment (`LAWFUL_BASIS_ASSESSMENT.md`)

---

> **Purpose:** This guide provides actionable implementation steps for managing user consent
> across all detected services in your project. It covers GDPR, ePrivacy Directive,
> and CCPA requirements.

## 1. Legal Basis Classification

Based on the services detected in your codebase, here is how each service maps to a legal basis under GDPR Article 6:

### Consent Required (Article 6(1)(a))

These services collect non-essential data and require explicit opt-in consent before activation:

| Service | Category | Data Collected | Action Required |
|---------|----------|----------------|-----------------|
| openai | ai | user prompts, conversation history, generated content | Must not load until user consents |
| posthog | analytics | user behavior, session recordings, feature flag usage | Must not load until user consents |

### Legitimate Interest (Article 6(1)(f))

These services may operate under legitimate interest with appropriate documentation and user objection mechanism:

| Service | Category | Data Collected | Notes |
|---------|----------|----------------|-------|
| @sentry/node | monitoring | error data, stack traces, user context | Document in LIA; provide opt-out |
| resend | email | email addresses, email content | Document in LIA; provide opt-out |

### Contractual Necessity (Article 6(1)(b))

These services are required to fulfill contractual obligations and do not require separate consent:

| Service | Category | Data Collected | Notes |
|---------|----------|----------------|-------|
| @supabase/supabase-js | auth | email, password hash, session data | Essential for service delivery |
| prisma | database | user data as defined in schema | Essential for service delivery |
| stripe | payment | payment information, billing address, email | Essential for service delivery |
| stripe-ios | payment | payment information, billing address, email | Essential for service delivery |

## 2. Cookie Consent Banner Requirements

Under the ePrivacy Directive and GDPR, your cookie banner must:

- **Block non-essential cookies** before consent is given (no pre-ticked boxes)
- **Provide granular choices** (analytics, marketing, functional — not just "accept all")
- **Include a reject-all option** equally prominent as "accept all"
- **Not use dark patterns** (e.g., hiding the reject option, making it harder to decline)
- **Record proof of consent** (timestamp, version, choices made)
- **Allow withdrawal** at any time, as easily as giving consent
- **Re-prompt** when consent purposes change or after 12 months

### Consent Categories for Your Project

Based on detected services, configure your consent banner with these categories:

| Category | Services | Default State |
|----------|----------|---------------|
| Strictly Necessary | @supabase/supabase-js, prisma, stripe, stripe-ios | Always active (no toggle) |
| Analytics | posthog | Off until consented |
| AI Services | openai | Off until consented |

### Example: Minimal Cookie Consent Banner

```html
<!-- Cookie Consent Banner -->
<div id="cookie-consent" style="
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #1a1a2e; color: #fff; padding: 1rem;
  display: flex; justify-content: space-between; align-items: center;
  z-index: 9999; font-family: system-ui, sans-serif;
">
  <div>
    <p style="margin: 0 0 0.5rem 0; font-weight: 600;">We value your privacy</p>
    <p style="margin: 0; font-size: 0.875rem; opacity: 0.9;">
      We use cookies to improve your experience. You can customize your preferences.
    </p>
  </div>
  <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
    <button onclick="manageConsent()" style="
      background: transparent; color: #fff; border: 1px solid #fff;
      padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;
    ">Customize</button>
    <button onclick="rejectAll()" style="
      background: transparent; color: #fff; border: 1px solid #fff;
      padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;
    ">Reject All</button>
    <button onclick="acceptAll()" style="
      background: #4CAF50; color: #fff; border: none;
      padding: 0.5rem 1rem; cursor: pointer; border-radius: 4px;
    ">Accept All</button>
  </div>
</div>

<script>
function getConsentState() {
  try {
    return JSON.parse(localStorage.getItem('cookie_consent') || 'null');
  } catch { return null; }
}

function saveConsent(choices) {
  const record = {
    choices,
    timestamp: new Date().toISOString(),
    version: '1.0',
  };
  localStorage.setItem('cookie_consent', JSON.stringify(record));
  document.getElementById('cookie-consent').style.display = 'none';
  applyConsent(choices);
}

function acceptAll() {
  saveConsent({ analytics: true, marketing: true, functional: true });
}

function rejectAll() {
  saveConsent({ analytics: false, marketing: false, functional: false });
}

function manageConsent() {
  // Open a modal with granular toggles per category
  // Implementation depends on your UI framework
}

function applyConsent(choices) {
  if (choices.analytics) {
    // Load analytics scripts here
  }
  if (choices.marketing) {
    // Load marketing scripts here
  }
}

// On page load: check existing consent
(function() {
  const existing = getConsentState();
  if (existing) {
    document.getElementById('cookie-consent').style.display = 'none';
    applyConsent(existing.choices);
  }
})();
</script>
```

## 3. Global Privacy Control (GPC) Signal

The [Global Privacy Control](https://globalprivacycontrol.org/) is a browser-level signal that indicates a user's privacy preferences. Under CCPA/CPRA, honoring GPC is legally required for California residents. Under GDPR, it serves as a valid objection signal.

### Implementation

```javascript
// Check for GPC signal on page load
function checkGPC() {
  if (navigator.globalPrivacyControl) {
    // User has opted out via GPC
    // Treat as: reject analytics + advertising cookies
    saveConsent({ analytics: false, marketing: false, functional: true });
    console.log('[Consent] GPC signal detected — non-essential tracking disabled');
    return true;
  }
  return false;
}

// Call before showing consent banner
if (!checkGPC()) {
  // Show consent banner if no GPC and no prior consent
  const existing = getConsentState();
  if (!existing) {
    document.getElementById('cookie-consent').style.display = 'flex';
  }
}
```

## 4. Service-Specific Consent Patterns

### PostHog — Opt-In / Opt-Out

```javascript
import posthog from 'posthog-js';

// Initialize with opt-out by default (GDPR-compliant)
posthog.init('YOUR_PROJECT_KEY', {
  api_host: 'https://app.posthog.com',
  opt_out_capturing_by_default: true,  // No tracking until consent
  persistence: 'localStorage',
});

// When user gives consent:
function onAnalyticsConsent() {
  posthog.opt_in_capturing();
}

// When user withdraws consent:
function onAnalyticsRevoke() {
  posthog.opt_out_capturing();
  posthog.reset();  // Clear any stored user data
}
```

## 5. Consent Storage Recommendations

### Where to Store Consent Records

| Method | Pros | Cons | Recommended |
|--------|------|------|-------------|
| localStorage | Simple, client-side only | Lost on clear, not shared across subdomains | Development / simple sites |
| First-party cookie | Shared across subdomains, server-readable | 4KB limit, sent with every request | Production sites |
| Server-side database | Auditable, tamper-proof, survives device changes | Requires API endpoint | Enterprise / regulated |

### Consent Record Schema

Store the following data for each consent record:

```json
{
  "userId": "anonymous-uuid-or-user-id",
  "timestamp": "2026-03-15T10:30:00.000Z",
  "version": "1.0",
  "choices": {
    "analytics": true,
    "marketing": false,
    "functional": true,
    "ai": false
  },
  "gpcDetected": false,
  "method": "banner-click",
  "ipCountry": "DE"
}
```

### Retention

- Keep consent records for the **duration of consent + 3 years** (to demonstrate compliance under GDPR Article 7(1))
- Update records when the user changes preferences
- Re-collect consent when purposes change or annually

## 6. Consent Withdrawal Process

Under GDPR Article 7(3), withdrawing consent must be as easy as giving it.

### Required Steps

1. **Provide a persistent link** (footer, settings page, or floating widget) to manage cookie preferences
2. **When consent is withdrawn:**
   - Stop all non-essential tracking immediately
   - Clear any locally stored tracking identifiers
   - Send a server-side signal to stop processing (if applicable)
   - Update the consent record with the withdrawal timestamp

### Implementation

```javascript
function withdrawConsent(category) {
  const consent = getConsentState();
  if (!consent) return;

  consent.choices[category] = false;
  consent.timestamp = new Date().toISOString();
  localStorage.setItem('cookie_consent', JSON.stringify(consent));

  // Category-specific cleanup
  switch (category) {
    case 'analytics':
      // Clear analytics cookies and local storage
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('_ga') || name.startsWith('ph_') || name.startsWith('mp_')) {
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }
      });
      // PostHog cleanup
      if (window.posthog) {
        window.posthog.opt_out_capturing();
        window.posthog.reset();
      }
      break;
    case 'marketing':
      // Clear advertising cookies
      document.cookie.split(';').forEach(cookie => {
        const name = cookie.split('=')[0].trim();
        if (name.startsWith('_fb') || name.startsWith('ads_')) {
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        }
      });
      break;
  }
}
```

## 7. Technical Implementation Checklist

### General

- [ ] Cookie consent banner loads before any non-essential scripts
- [ ] Non-essential scripts are blocked until consent is given
- [ ] GPC signal (navigator.globalPrivacyControl) is checked on load
- [ ] Consent record is stored with timestamp, version, and choices
- [ ] Consent withdrawal is available from every page (footer link or widget)
- [ ] Consent is re-collected when purposes change
- [ ] Consent banner is accessible (keyboard navigable, screen reader compatible)
- [ ] "Reject All" button is equally prominent as "Accept All"
- [ ] No pre-ticked checkboxes for non-essential categories

### Per-Service Checklist

#### openai (ai)
- [ ] Script/SDK does not load before consent
- [ ] Consent category mapped: AI Services
- [ ] Opt-out mechanism implemented
- [ ] Data cleared on consent withdrawal
- [ ] Third-party cookies documented in cookie policy

#### posthog (analytics)
- [ ] Script/SDK does not load before consent
- [ ] Consent category mapped: Analytics
- [ ] Opt-out mechanism implemented
- [ ] Data cleared on consent withdrawal
- [ ] Third-party cookies documented in cookie policy

#### @sentry/node (monitoring) — Legitimate Interest
- [ ] Legitimate Interest Assessment (LIA) documented
- [ ] User objection mechanism provided
- [ ] Data minimization applied
- [ ] Processing documented in privacy policy

#### resend (email) — Legitimate Interest
- [ ] Legitimate Interest Assessment (LIA) documented
- [ ] User objection mechanism provided
- [ ] Data minimization applied
- [ ] Processing documented in privacy policy

## 8. Recommended Consent Management Platforms

If you prefer a managed solution over a custom implementation:

| Platform | Open Source | GDPR | CCPA | GPC Support | Notes |
|----------|-----------|------|------|-------------|-------|
| [Cookiebot](https://www.cookiebot.com) | No | Yes | Yes | Yes | Auto-scans cookies |
| [Osano](https://www.osano.com) | No | Yes | Yes | Yes | Consent + data mapping |
| [Klaro](https://klaro.org) | Yes | Yes | Yes | Partial | Self-hosted, lightweight |
| [CookieConsent](https://cookieconsent.orestbida.com) | Yes | Yes | Yes | Manual | Popular open-source option |
| [Consent Manager](https://www.consentmanager.net) | No | Yes | Yes | Yes | IAB TCF 2.2 support |

## 9. Contact

For questions about consent management or data processing:

- **Email:** legal@acme.com

---

*This guide was auto-generated by Codepliant based on code analysis of nextjs-saas-example. It provides implementation guidance only and does not constitute legal advice. Consult with a qualified privacy professional for your specific compliance requirements.*