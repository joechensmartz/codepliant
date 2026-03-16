# Environment Variable Audit

> Generated on 2026-03-16 — 17 variable(s) detected.
> **Document Version:** 1.0  
> **Document Owner:** [Your Company Name]  
> **Next Review Date:** 2027-03-16

## Security Recommendations

- **[WARNING]** No .env.example file found. Create one to document required environment variables for new contributors.

## Environment Variables

### API Key / Secret

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `PB_ID_TOKEN_LEEWAY` | tools/auth/oidc.go | No |

### Service Config

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `BASE_URL` | ui/src/App.svelte, ui/src/components/base/FullPage.svelte, ui/src/components/base/TinyMCE.svelte, ui/src/components/collections/OAuth2Accordion.svelte, ui/src/components/collections/OAuth2ProviderPanel.svelte, ui/src/components/collections/OAuth2ProvidersListPanel.svelte, ui/src/components/records/ExternalAuthsList.svelte | No |
| `PB_BACKEND_URL` | ui/src/components/records/PageRecordConfirmEmailChange.svelte, ui/src/components/records/PageRecordConfirmPasswordReset.svelte, ui/src/components/records/PageRecordConfirmVerification.svelte, ui/src/utils/ApiClient.js | No |
| `PB_DART_SDK_URL` | ui/src/components/base/SdkTabs.svelte | No |
| `PB_DOCS_URL` | ui/src/components/base/PageWrapper.svelte, ui/src/components/settings/PageCrons.svelte | No |
| `PB_JS_SDK_URL` | ui/src/components/base/SdkTabs.svelte | No |

### Other

| Variable | Found In | Has Value |
|----------|----------|-----------|
| `GOCACHE` | tools/osutils/run.go | No |
| `PB_FILE_UPLOAD_DOCS` | ui/src/components/collections/docs/CreateApiDocs.svelte, ui/src/components/collections/docs/UpdateApiDocs.svelte | No |
| `PB_FILES_DELETE_MAX_WORKERS` | core/base.go | No |
| `PB_MFA_DOCS` | ui/src/components/collections/MFAAccordion.svelte | No |
| `PB_OAUTH2_EXAMPLE` | ui/src/components/collections/docs/AuthWithOAuth2Docs.svelte | No |
| `PB_PROTECTED_FILE_DOCS` | ui/src/components/collections/schema/SchemaFieldFile.svelte | No |
| `PB_RELEASES` | ui/src/components/base/PageWrapper.svelte | No |
| `PB_RULES_SYNTAX_DOCS` | ui/src/components/collections/CollectionRulesTab.svelte | No |
| `PB_THUMBS_MAX_WAIT` | apis/file.go | No |
| `PB_THUMBS_MAX_WORKERS` | apis/file.go | No |
| `PB_VERSION` | ui/src/components/base/PageWrapper.svelte | No |

## Missing Documentation

The following variables are used but not listed in `.env.example`:

- `BASE_URL`
- `GOCACHE`
- `PB_BACKEND_URL`
- `PB_DART_SDK_URL`
- `PB_DOCS_URL`
- `PB_FILE_UPLOAD_DOCS`
- `PB_FILES_DELETE_MAX_WORKERS`
- `PB_ID_TOKEN_LEEWAY`
- `PB_JS_SDK_URL`
- `PB_MFA_DOCS`
- `PB_OAUTH2_EXAMPLE`
- `PB_PROTECTED_FILE_DOCS`
- `PB_RELEASES`
- `PB_RULES_SYNTAX_DOCS`
- `PB_THUMBS_MAX_WAIT`
- `PB_THUMBS_MAX_WORKERS`
- `PB_VERSION`

## Hardcoded Secrets Detected

> **16 potential secret(s)** found in source code. These should be moved to environment variables.

- **[CRITICAL]** 16 hardcoded secret(s) detected in source code: Hardcoded Secret, Hardcoded Password, Private Key (PEM). Move these to environment variables immediately.
- **[CRITICAL]** Hardcoded secrets can be extracted from version control history even after removal. Rotate any exposed credentials immediately.

| Severity | Type | File | Line | Snippet |
|----------|------|------|------|---------|
| HIGH | Hardcoded Secret | `core/collection_model_auth_options_test.go` | 900 | `ClientSecret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `core/collection_model_auth_options_test.go` | 910 | `ClientSecret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `core/collection_model_auth_options_test.go` | 941 | `ClientSecret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `core/collection_model_auth_options_test.go` | 952 | `ClientSecret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `core/collection_model_test.go` | 655 | `{Name: "test1", ClientId: "[REDACTED]", ClientSecret: "[REDACTED]"},` |
| HIGH | Hardcoded Secret | `core/collection_model_test.go` | 656 | `{Name: "test2", ClientId: "[REDACTED]", ClientSecret: "[REDACTED]"},` |
| HIGH | Hardcoded Secret | `core/collection_model_test.go` | 683 | `{Name: "test1", ClientId: "[REDACTED]", ClientSecret: "[REDACTED]"},` |
| HIGH | Hardcoded Secret | `core/collection_model_test.go` | 684 | `{Name: "test2", ClientId: "[REDACTED]", ClientSecret: "[REDACTED]"},` |
| HIGH | Hardcoded Secret | `core/collection_model_test.go` | 711 | `{Name: "test1", ClientId: "[REDACTED]", ClientSecret: "[REDACTED]"},` |
| HIGH | Hardcoded Secret | `core/collection_model_test.go` | 712 | `{Name: "test2", ClientId: "[REDACTED]", ClientSecret: "[REDACTED]"},` |
| HIGH | Hardcoded Password | `core/field.go` | 28 | `FieldNamePassword        = "password"` |
| HIGH | Hardcoded Password | `core/field_password.go` | 22 | `const FieldTypePassword = "password"` |
| HIGH | Hardcoded Password | `core/mfa_model.go` | 13 | `MFAMethodPassword = "password"` |
| HIGH | Private Key (PEM) | `forms/apple_client_secret_create_test.go` | 56 | `"privateKey": "-----BEGIN PRIVATE KEY----- invalid -----END PRIVATE KEY-----",` |
| HIGH | Hardcoded Secret | `tools/auth/base_provider_test.go` | 213 | `clientSecret: "[REDACTED]",` |
| HIGH | Hardcoded Secret | `tools/auth/base_provider_test.go` | 240 | `clientSecret: "[REDACTED]",` |

### Remediation Steps

1. Move all secrets to environment variables (`.env.local` or your secrets manager)
2. Rotate any credentials that have been committed to version control
3. Add `.env` and `.env.local` to `.gitignore`
4. Consider using a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler)
5. Run `git log --all --full-history -S '<secret>'` to check if secrets exist in git history

---

*This audit was generated by [Codepliant](https://github.com/joechensmartz/codepliant). It is not a substitute for a professional security review.*
