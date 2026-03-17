export interface DetectedService {
  name: string;
  category: ServiceCategory;
  evidence: Evidence[];
  dataCollected: string[];
  /** When false, this service is a utility/dev tool — not a third-party data processor.
   *  It will appear in scan output but be excluded from compliance doc generation. */
  isDataProcessor?: boolean;
}

export type ServiceCategory =
  | "ai"
  | "payment"
  | "analytics"
  | "auth"
  | "email"
  | "database"
  | "storage"
  | "monitoring"
  | "advertising"
  | "social"
  | "other";

export interface Evidence {
  type: "dependency" | "import" | "env_var" | "code_pattern";
  file: string;
  detail: string;
}

export interface WorkspaceInfo {
  name: string;
  path: string;
  relativePath: string;
}

export interface MonorepoInfo {
  detected: boolean;
  type: "npm-workspaces" | "lerna" | "pnpm" | "turbo" | "directory-convention" | null;
  workspaces: WorkspaceInfo[];
}

export interface LicenseScanResult {
  projectLicense: string | null;
  dependencies: { package: string; version: string; license: string; isCopyleft: boolean }[];
  copyleftDependencies: { package: string; version: string; license: string; isCopyleft: boolean }[];
  warnings: string[];
}

export interface ScanResult {
  projectName: string;
  projectPath: string;
  scannedAt: string;
  services: DetectedService[];
  dataCategories: DataCategory[];
  complianceNeeds: ComplianceNeed[];
  monorepo?: MonorepoInfo;
  /** License compliance scan results */
  licenseScan?: LicenseScanResult;
  /** Warnings from scanners that failed but did not prevent the scan from completing */
  warnings?: string[];
}

export interface DataCategory {
  category: string;
  description: string;
  sources: string[];
}

export interface ComplianceNeed {
  document: string;
  reason: string;
  priority: "required" | "recommended";
}

/**
 * Family map: groups of service signatures that represent the same logical service.
 * When multiple members of a family are detected, only the one with the most evidence is kept.
 */
export const FAMILY_MAP: Record<string, string[]> = {
  sentry: [
    "@sentry/node",
    "@sentry/nextjs",
    "@sentry/react",
    "@sentry/nestjs",
    "@sentry/profiling-node",
    "sentry-sdk",
  ],
  aws: [
    "@aws-sdk/client-s3",
    "@aws-sdk/client-ses",
    "@aws-sdk/client-sesv2",
    "@aws-sdk/client-sns",
  ],
  firebase: ["firebase", "firebase-admin"],
  "facebook-android": ["facebook-login-android", "facebook-sdk-android"],
  supabase: ["@supabase/supabase-js", "@supabase/auth-helpers"],
  clerk: ["@clerk/nextjs", "@clerk/backend"],
  mailchimp: ["@mailchimp/mailchimp_marketing", "@mailchimp/mailchimp_transactional"],
};

/**
 * Ecosystem tag for a service signature.
 * Used to restrict env-var matching to the project's actual ecosystem.
 */
export type Ecosystem = "js" | "python" | "go" | "ruby" | "elixir" | "php" | "rust" | "java" | "dotnet" | "dart" | "swift" | "kotlin" | "any";

export const SERVICE_SIGNATURES: Record<
  string,
  {
    category: ServiceCategory;
    dataCollected: string[];
    envPatterns: string[];
    importPatterns: string[];
    /** When false, excluded from compliance doc generation (utility/dev tool). Default true. */
    isDataProcessor?: boolean;
    /** Ecosystem this signature belongs to. Only env patterns from matching ecosystem are checked. */
    ecosystem?: Ecosystem;
  }
> = {
  // AI Services
  openai: {
    category: "ai",
    dataCollected: [
      "user prompts",
      "conversation history",
      "generated content",
    ],
    envPatterns: ["OPENAI_API_KEY", "OPENAI_ORG"],
    importPatterns: ["openai", "OpenAI"],
  },
  langchain: {
    category: "ai",
    dataCollected: [
      "user prompts",
      "conversation history",
      "document content",
    ],
    envPatterns: [],
    importPatterns: ["langchain"],
  },
  "@anthropic-ai/sdk": {
    category: "ai",
    dataCollected: [
      "user prompts",
      "conversation history",
      "generated content",
    ],
    envPatterns: ["ANTHROPIC_API_KEY", "CLAUDE_API_KEY"],
    importPatterns: ["@anthropic-ai/sdk", "Anthropic"],
  },
  "@google/generative-ai": {
    category: "ai",
    dataCollected: [
      "user prompts",
      "conversation history",
      "generated content",
    ],
    envPatterns: ["GOOGLE_AI_KEY", "GEMINI_API_KEY"],
    importPatterns: ["@google/generative-ai", "GoogleGenerativeAI"],
  },
  replicate: {
    category: "ai",
    dataCollected: ["user inputs", "generated content", "model predictions"],
    envPatterns: ["REPLICATE_API_TOKEN"],
    importPatterns: ["replicate"],
  },
  "together-ai": {
    category: "ai",
    dataCollected: ["user prompts", "generated content"],
    envPatterns: ["TOGETHER_API_KEY"],
    importPatterns: ["together-ai", "togetherai"],
  },
  cohere: {
    category: "ai",
    dataCollected: ["user prompts", "embeddings", "generated content"],
    envPatterns: ["COHERE_API_KEY", "CO_API_KEY"],
    importPatterns: ["cohere", "cohere-ai"],
  },
  "@pinecone-database/pinecone": {
    category: "ai",
    dataCollected: ["vector embeddings", "metadata"],
    envPatterns: ["PINECONE_API_KEY", "PINECONE_ENVIRONMENT"],
    importPatterns: ["@pinecone-database/pinecone", "Pinecone"],
  },

  // Payment
  stripe: {
    category: "payment",
    dataCollected: [
      "payment information",
      "billing address",
      "email",
      "transaction history",
    ],
    envPatterns: [
      "STRIPE_SECRET_KEY",
      "STRIPE_PUBLISHABLE_KEY",
      "STRIPE_WEBHOOK_SECRET",
    ],
    importPatterns: ["stripe", "@stripe/stripe-js", "@stripe/react-stripe-js"],
  },
  "@paypal/checkout-server-sdk": {
    category: "payment",
    dataCollected: ["payment information", "email", "transaction history"],
    envPatterns: ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET"],
    importPatterns: ["@paypal", "paypal"],
  },
  "@lemonsqueezy/lemonsqueezy.js": {
    category: "payment",
    dataCollected: [
      "payment information",
      "email",
      "billing address",
      "transaction history",
    ],
    envPatterns: ["LEMONSQUEEZY_API_KEY", "LEMON_SQUEEZY"],
    importPatterns: ["@lemonsqueezy", "lemonsqueezy"],
  },

  // Analytics
  "@google-analytics/data": {
    category: "analytics",
    dataCollected: [
      "page views",
      "user behavior",
      "device information",
      "IP address",
      "location data",
    ],
    envPatterns: [
      "GA_TRACKING_ID",
      "GOOGLE_ANALYTICS",
      "GA_MEASUREMENT_ID",
      "NEXT_PUBLIC_GA",
    ],
    importPatterns: ["google-analytics", "gtag", "react-ga"],
  },
  posthog: {
    category: "analytics",
    dataCollected: [
      "user behavior",
      "session recordings",
      "feature flag usage",
      "device information",
    ],
    envPatterns: ["POSTHOG_API_KEY", "NEXT_PUBLIC_POSTHOG", "POSTHOG_HOST"],
    importPatterns: ["posthog", "posthog-js", "posthog-node"],
  },
  mixpanel: {
    category: "analytics",
    dataCollected: [
      "user behavior",
      "user profiles",
      "device information",
      "location data",
    ],
    envPatterns: ["MIXPANEL_TOKEN", "MIXPANEL_API_SECRET"],
    importPatterns: ["mixpanel", "mixpanel-browser"],
  },
  "@amplitude/analytics-browser": {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
    envPatterns: ["AMPLITUDE_API_KEY"],
    importPatterns: ["@amplitude", "amplitude"],
  },
  "@vercel/analytics": {
    category: "analytics",
    dataCollected: ["page views", "web vitals", "visitor information"],
    envPatterns: [],
    importPatterns: ["@vercel/analytics"],
  },
  hotjar: {
    category: "analytics",
    dataCollected: [
      "session recordings",
      "heatmaps",
      "user behavior",
      "form interactions",
    ],
    envPatterns: ["HOTJAR_ID", "NEXT_PUBLIC_HOTJAR"],
    importPatterns: ["hotjar", "react-hotjar"],
  },

  // Auth
  "next-auth": {
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "profile picture",
      "OAuth tokens",
      "session data",
    ],
    envPatterns: ["NEXTAUTH_SECRET", "NEXTAUTH_URL"],
    importPatterns: ["next-auth", "NextAuth"],
  },
  "@clerk/nextjs": {
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "phone number",
      "profile picture",
      "session data",
    ],
    envPatterns: [
      "CLERK_SECRET_KEY",
      "NEXT_PUBLIC_CLERK",
      "CLERK_PUBLISHABLE_KEY",
    ],
    importPatterns: ["@clerk"],
  },
  "@supabase/supabase-js": {
    category: "auth",
    dataCollected: ["email", "password hash", "session data", "user metadata"],
    envPatterns: ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE"],
    importPatterns: ["@supabase/supabase-js", "@supabase/auth-helpers"],
  },
  "@auth/core": {
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "profile picture",
      "OAuth tokens",
      "session data",
    ],
    envPatterns: ["AUTH_SECRET"],
    importPatterns: ["@auth/core", "@auth/"],
  },
  "better-auth": {
    category: "auth",
    dataCollected: [
      "email",
      "name",
      "password hash",
      "session data",
      "OAuth tokens",
    ],
    envPatterns: ["BETTER_AUTH_SECRET"],
    importPatterns: ["better-auth"],
  },
  passport: {
    category: "auth",
    dataCollected: ["email", "name", "OAuth tokens", "session data"],
    envPatterns: [],
    importPatterns: ["passport", "passport-local", "passport-google-oauth"],
  },

  // Email
  "@sendgrid/mail": {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["SENDGRID_API_KEY"],
    importPatterns: ["@sendgrid"],
  },
  resend: {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["RESEND_API_KEY"],
    importPatterns: ["resend"],
  },
  nodemailer: {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "EMAIL_SERVER"],
    importPatterns: ["nodemailer"],
  },
  postmark: {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["POSTMARK_API_TOKEN", "POSTMARK_SERVER_TOKEN"],
    importPatterns: ["postmark"],
  },

  // Database
  prisma: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["PRISMA_DATABASE_URL"],
    importPatterns: ["@prisma/client", "PrismaClient"],
  },
  drizzle: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["DRIZZLE_DATABASE_URL"],
    importPatterns: ["drizzle-orm"],
  },
  mongoose: {
    category: "database",
    dataCollected: ["user data as defined in schema"],
    envPatterns: ["MONGODB_URI", "MONGO_URL"],
    importPatterns: ["mongoose"],
  },

  // Storage
  "@aws-sdk/client-s3": {
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
    envPatterns: [
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY",
      "AWS_S3_BUCKET",
    ],
    importPatterns: ["@aws-sdk/client-s3", "aws-sdk"],
  },
  "@uploadthing/react": {
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
    envPatterns: ["UPLOADTHING_SECRET", "UPLOADTHING_APP_ID"],
    importPatterns: ["@uploadthing", "uploadthing"],
  },
  cloudinary: {
    category: "storage",
    dataCollected: ["uploaded files", "images", "file metadata"],
    envPatterns: ["CLOUDINARY_URL", "CLOUDINARY_API_KEY"],
    importPatterns: ["cloudinary"],
  },

  // Communication
  twilio: {
    category: "other",
    dataCollected: [
      "phone numbers",
      "SMS message content",
      "voice call metadata",
      "call recordings",
    ],
    envPatterns: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_PHONE_NUMBER"],
    importPatterns: ["twilio"],
  },
  "@twilio/voice-sdk": {
    category: "other",
    dataCollected: [
      "phone numbers",
      "voice call metadata",
      "call recordings",
      "device information",
    ],
    envPatterns: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
    importPatterns: ["@twilio/voice-sdk"],
  },
  intercom: {
    category: "other",
    dataCollected: [
      "user profiles",
      "email",
      "name",
      "conversations",
      "user behavior",
      "company data",
    ],
    envPatterns: ["INTERCOM_APP_ID", "INTERCOM_ACCESS_TOKEN", "INTERCOM_SECRET_KEY"],
    importPatterns: ["intercom", "intercom-client"],
  },
  "@intercom/messenger-js-sdk": {
    category: "other",
    dataCollected: [
      "user profiles",
      "email",
      "name",
      "conversations",
      "page views",
    ],
    envPatterns: ["INTERCOM_APP_ID"],
    importPatterns: ["@intercom/messenger-js-sdk"],
  },
  "crisp-sdk-web": {
    category: "other",
    dataCollected: [
      "user profiles",
      "email",
      "conversations",
      "page views",
      "device information",
    ],
    envPatterns: ["CRISP_WEBSITE_ID"],
    importPatterns: ["crisp-sdk-web"],
  },

  // Marketing
  "@mailchimp/mailchimp_marketing": {
    category: "email",
    dataCollected: [
      "email addresses",
      "names",
      "audience segments",
      "campaign engagement",
      "subscriber activity",
    ],
    envPatterns: ["MAILCHIMP_API_KEY", "MAILCHIMP_SERVER_PREFIX", "MAILCHIMP_LIST_ID"],
    importPatterns: ["@mailchimp/mailchimp_marketing"],
  },
  "@mailchimp/mailchimp_transactional": {
    category: "email",
    dataCollected: [
      "email addresses",
      "email content",
      "delivery status",
    ],
    envPatterns: ["MAILCHIMP_TRANSACTIONAL_API_KEY", "MANDRILL_API_KEY"],
    importPatterns: ["@mailchimp/mailchimp_transactional"],
  },
  "@hubspot/api-client": {
    category: "other",
    dataCollected: [
      "contact information",
      "email addresses",
      "names",
      "phone numbers",
      "company data",
      "deal information",
      "engagement history",
    ],
    envPatterns: ["HUBSPOT_ACCESS_TOKEN", "HUBSPOT_API_KEY", "HUBSPOT_CLIENT_SECRET"],
    importPatterns: ["@hubspot/api-client"],
  },

  // Feature Management
  "launchdarkly-js-client-sdk": {
    category: "analytics",
    dataCollected: [
      "user attributes",
      "feature flag evaluations",
      "custom events",
    ],
    envPatterns: ["LAUNCHDARKLY_SDK_KEY", "LAUNCHDARKLY_CLIENT_ID"],
    importPatterns: ["launchdarkly-js-client-sdk"],
  },
  "@launchdarkly/node-server-sdk": {
    category: "analytics",
    dataCollected: [
      "user attributes",
      "feature flag evaluations",
      "custom events",
    ],
    envPatterns: ["LAUNCHDARKLY_SDK_KEY"],
    importPatterns: ["@launchdarkly/node-server-sdk"],
  },

  // Firebase
  firebase: {
    category: "analytics",
    dataCollected: [
      "user behavior",
      "device information",
      "crash data",
      "app performance metrics",
      "user identity",
    ],
    envPatterns: [
      "FIREBASE_API_KEY",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_APP_ID",
      "NEXT_PUBLIC_FIREBASE",
    ],
    importPatterns: ["firebase/app", "firebase/analytics", "firebase/auth"],
  },
  "firebase-admin": {
    category: "database",
    dataCollected: [
      "user data",
      "authentication records",
      "cloud messaging tokens",
      "database content",
    ],
    envPatterns: [
      "FIREBASE_SERVICE_ACCOUNT",
      "FIREBASE_ADMIN_KEY",
      "GOOGLE_APPLICATION_CREDENTIALS",
    ],
    importPatterns: ["firebase-admin"],
  },

  // Segment
  "@segment/analytics-next": {
    category: "analytics",
    dataCollected: [
      "user identity",
      "user behavior",
      "page views",
      "custom events",
      "device information",
      "IP address",
    ],
    envPatterns: ["SEGMENT_WRITE_KEY", "NEXT_PUBLIC_SEGMENT_WRITE_KEY"],
    importPatterns: ["@segment/analytics-next", "@segment/analytics-node"],
  },

  // Search
  algoliasearch: {
    category: "other",
    dataCollected: [
      "search queries",
      "search result clicks",
      "user search behavior",
    ],
    envPatterns: [
      "ALGOLIA_APP_ID",
      "ALGOLIA_API_KEY",
      "ALGOLIA_SEARCH_KEY",
      "NEXT_PUBLIC_ALGOLIA",
    ],
    importPatterns: ["algoliasearch", "react-instantsearch"],
  },
  "@meilisearch/instant-meilisearch": {
    category: "other",
    dataCollected: [
      "search queries",
      "search result clicks",
    ],
    envPatterns: ["MEILISEARCH_HOST", "MEILISEARCH_API_KEY"],
    importPatterns: ["@meilisearch/instant-meilisearch", "meilisearch"],
  },

  // Push Notifications
  "@onesignal/node-onesignal": {
    category: "other",
    dataCollected: [
      "device tokens",
      "user segments",
      "notification engagement",
      "device information",
    ],
    envPatterns: ["ONESIGNAL_APP_ID", "ONESIGNAL_API_KEY", "ONESIGNAL_REST_API_KEY"],
    importPatterns: ["@onesignal/node-onesignal", "@onesignal"],
  },
  "web-push": {
    category: "other",
    dataCollected: [
      "push subscription endpoints",
      "device tokens",
      "notification content",
    ],
    envPatterns: ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "WEB_PUSH_EMAIL"],
    importPatterns: ["web-push"],
  },

  // Monitoring
  "@sentry/node": {
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
      "IP address",
    ],
    envPatterns: ["SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN", "SENTRY_AUTH_TOKEN"],
    importPatterns: ["@sentry/node"],
  },
  "@sentry/nextjs": {
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
      "IP address",
    ],
    envPatterns: ["SENTRY_DSN", "NEXT_PUBLIC_SENTRY_DSN"],
    importPatterns: ["@sentry/nextjs"],
  },
  "@sentry/react": {
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
    ],
    envPatterns: ["SENTRY_DSN"],
    importPatterns: ["@sentry/react"],
  },
  "@sentry/nestjs": {
    category: "monitoring",
    dataCollected: [
      "error data",
      "stack traces",
      "user context",
      "device information",
    ],
    envPatterns: ["SENTRY_DSN"],
    importPatterns: ["@sentry/nestjs"],
  },
  "@sentry/profiling-node": {
    category: "monitoring",
    dataCollected: [
      "performance profiles",
      "stack traces",
      "device information",
    ],
    envPatterns: ["SENTRY_DSN"],
    importPatterns: ["@sentry/profiling-node"],
  },

  // Google APIs
  googleapis: {
    category: "other",
    dataCollected: [
      "user data via Google APIs",
      "calendar data",
      "email data",
      "profile information",
    ],
    envPatterns: ["GOOGLE_API_KEY", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    importPatterns: ["googleapis", "@googleapis/"],
  },
  "google-auth-library": {
    category: "auth",
    dataCollected: ["OAuth tokens", "Google profile data", "email"],
    envPatterns: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    importPatterns: ["google-auth-library"],
  },
  "@google-cloud/storage": {
    category: "storage",
    dataCollected: ["uploaded files", "file metadata"],
    envPatterns: ["GOOGLE_APPLICATION_CREDENTIALS", "GCS_BUCKET"],
    importPatterns: ["@google-cloud/storage"],
  },
  "@google-cloud/kms": {
    category: "other",
    dataCollected: ["encryption keys", "key metadata"],
    envPatterns: ["GOOGLE_APPLICATION_CREDENTIALS"],
    importPatterns: ["@google-cloud/kms"],
  },

  // Vercel AI SDK
  "@vercel/ai": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: [],
    importPatterns: ["@vercel/ai", "ai"],
  },
  "@ai-sdk/openai": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: [],
    importPatterns: ["@ai-sdk/openai"],
  },
  "@ai-sdk/anthropic": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: [],
    importPatterns: ["@ai-sdk/anthropic"],
  },
  "@ai-sdk/google": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: [],
    importPatterns: ["@ai-sdk/google"],
  },
  "@ai-sdk/google-vertex": {
    category: "ai",
    dataCollected: ["user prompts", "conversation history", "generated content"],
    envPatterns: ["GOOGLE_APPLICATION_CREDENTIALS"],
    importPatterns: ["@ai-sdk/google-vertex"],
  },

  // Redis
  ioredis: {
    category: "database",
    dataCollected: ["cached data", "session data"],
    envPatterns: ["REDIS_URL", "REDIS_HOST"],
    importPatterns: ["ioredis"],
  },
  redis: {
    category: "database",
    dataCollected: ["cached data", "session data"],
    envPatterns: ["REDIS_URL", "REDIS_HOST"],
    importPatterns: ["redis"],
  },
  "@upstash/redis": {
    category: "database",
    dataCollected: ["cached data", "session data"],
    envPatterns: ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
    importPatterns: ["@upstash/redis"],
  },

  // AWS SES
  "@aws-sdk/client-ses": {
    category: "email",
    dataCollected: ["email addresses", "email content"],
    envPatterns: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SES_REGION"],
    importPatterns: ["@aws-sdk/client-ses", "@aws-sdk/client-sesv2"],
  },

  // AWS SNS
  "@aws-sdk/client-sns": {
    category: "other",
    dataCollected: ["phone numbers", "notification content", "subscription data"],
    envPatterns: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
    importPatterns: ["@aws-sdk/client-sns"],
  },

  // Datadog
  "dd-trace": {
    category: "monitoring",
    dataCollected: [
      "performance traces",
      "error data",
      "request metadata",
      "user context",
    ],
    envPatterns: ["DD_API_KEY", "DD_APP_KEY", "DATADOG_API_KEY"],
    importPatterns: ["dd-trace", "datadog-metrics", "@datadog/"],
  },

  // Cloudflare
  "@cloudflare/workers-types": {
    category: "other",
    dataCollected: ["HTTP request data", "IP address", "geolocation data"],
    envPatterns: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"],
    importPatterns: ["@cloudflare/workers-types", "cloudflare"],
    isDataProcessor: false,
  },

  // Plaid (financial)
  plaid: {
    category: "payment",
    dataCollected: [
      "bank account data",
      "transaction history",
      "account balances",
      "financial institution data",
    ],
    envPatterns: ["PLAID_CLIENT_ID", "PLAID_SECRET", "PLAID_ENV"],
    importPatterns: ["plaid"],
  },

  // BullMQ (job queue)
  bullmq: {
    category: "other",
    dataCollected: ["job data", "user data processed in background jobs"],
    envPatterns: [],
    importPatterns: ["bullmq"],
    isDataProcessor: false,
  },

  // Passport OAuth providers
  "passport-google-oauth20": {
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
    envPatterns: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
    importPatterns: ["passport-google-oauth20", "passport-google-oauth"],
  },
  "passport-microsoft": {
    category: "auth",
    dataCollected: ["email", "name", "Microsoft profile data", "OAuth tokens"],
    envPatterns: ["MICROSOFT_CLIENT_ID", "MICROSOFT_CLIENT_SECRET"],
    importPatterns: ["passport-microsoft"],
  },

  // WebAuthn
  "@simplewebauthn/server": {
    category: "auth",
    dataCollected: ["biometric authentication data", "device attestation", "credential IDs"],
    envPatterns: [],
    importPatterns: ["@simplewebauthn/server", "@simplewebauthn/browser"],
  },

  // Localization (indicates multi-region users)
  "next-intl": {
    category: "other",
    dataCollected: ["user locale", "language preferences", "region data"],
    envPatterns: [],
    importPatterns: ["next-intl"],
    isDataProcessor: false,
  },
  i18next: {
    category: "other",
    dataCollected: ["user locale", "language preferences", "region data"],
    envPatterns: [],
    importPatterns: ["i18next", "react-i18next"],
    isDataProcessor: false,
  },

  // Data Fetching
  "@tanstack/react-query": {
    category: "other",
    dataCollected: ["cached API responses", "user data from queries"],
    envPatterns: [],
    importPatterns: ["@tanstack/react-query", "@tanstack/query-core"],
    isDataProcessor: false,
  },

  // Real-time Communication
  "socket.io": {
    category: "other",
    dataCollected: ["real-time user data", "connection metadata", "IP address"],
    envPatterns: [],
    importPatterns: ["socket.io", "socket.io-client"],
    isDataProcessor: false,
  },
  pusher: {
    category: "other",
    dataCollected: ["real-time event data", "channel subscriptions", "connection metadata"],
    envPatterns: ["PUSHER_APP_ID", "PUSHER_KEY", "PUSHER_SECRET", "NEXT_PUBLIC_PUSHER"],
    importPatterns: ["pusher", "pusher-js"],
    isDataProcessor: false,
  },

  // Caching
  "@prisma/extension-accelerate": {
    category: "database",
    dataCollected: ["cached query results", "connection metadata"],
    envPatterns: ["ACCELERATE_URL"],
    importPatterns: ["@prisma/extension-accelerate"],
    isDataProcessor: false,
  },

  // Env Validation
  "@t3-oss/env-nextjs": {
    category: "other",
    dataCollected: ["environment configuration"],
    envPatterns: [],
    importPatterns: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
    isDataProcessor: false,
  },

  // Validation
  zod: {
    category: "other",
    dataCollected: ["validated user input", "structured form data"],
    envPatterns: [],
    importPatterns: ["zod"],
    isDataProcessor: false,
  },

  // Flutter/Dart
  firebase_core: {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "crash data", "app performance metrics"],
    envPatterns: ["FIREBASE_API_KEY", "FIREBASE_PROJECT_ID"],
    importPatterns: ["firebase_core"],
    ecosystem: "dart",
  },
  firebase_auth: {
    category: "auth",
    dataCollected: ["email", "name", "phone number", "OAuth tokens", "session data"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["firebase_auth"],
    ecosystem: "dart",
  },
  firebase_analytics: {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "app events", "screen views"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["firebase_analytics"],
    ecosystem: "dart",
  },
  cloud_firestore: {
    category: "database",
    dataCollected: ["user data as defined in schema", "document content"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["cloud_firestore"],
    ecosystem: "dart",
  },
  stripe_sdk: {
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
    envPatterns: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY"],
    importPatterns: ["stripe_sdk"],
    ecosystem: "dart",
  },
  flutter_stripe: {
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
    envPatterns: ["STRIPE_SECRET_KEY", "STRIPE_PUBLISHABLE_KEY"],
    importPatterns: ["flutter_stripe"],
    ecosystem: "dart",
  },
  sentry_flutter: {
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
    envPatterns: ["SENTRY_DSN"],
    importPatterns: ["sentry_flutter"],
    ecosystem: "dart",
  },
  supabase_flutter: {
    category: "auth",
    dataCollected: ["email", "password hash", "session data", "user metadata", "database content"],
    envPatterns: ["SUPABASE_URL", "SUPABASE_ANON_KEY"],
    importPatterns: ["supabase_flutter"],
    ecosystem: "dart",
  },
  amplitude_flutter: {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
    envPatterns: ["AMPLITUDE_API_KEY"],
    importPatterns: ["amplitude_flutter"],
    ecosystem: "dart",
  },
  onesignal_flutter: {
    category: "other",
    dataCollected: ["device tokens", "user segments", "notification engagement", "device information"],
    envPatterns: ["ONESIGNAL_APP_ID"],
    importPatterns: ["onesignal_flutter"],
    ecosystem: "dart",
  },
  google_sign_in: {
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
    envPatterns: ["GOOGLE_CLIENT_ID"],
    importPatterns: ["google_sign_in"],
    ecosystem: "dart",
  },
  flutter_facebook_auth: {
    category: "auth",
    dataCollected: ["email", "name", "Facebook profile data", "OAuth tokens", "social connections"],
    envPatterns: ["FACEBOOK_APP_ID"],
    importPatterns: ["flutter_facebook_auth"],
    ecosystem: "dart",
  },
  mixpanel_flutter: {
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information", "location data"],
    envPatterns: ["MIXPANEL_TOKEN"],
    importPatterns: ["mixpanel_flutter"],
    ecosystem: "dart",
  },

  // Swift/iOS Ecosystem
  "firebase-ios-sdk": {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "crash data", "app performance metrics"],
    envPatterns: ["FIREBASE_API_KEY", "GOOGLE_APP_ID"],
    importPatterns: ["FirebaseAnalytics", "FirebaseCore", "FirebaseCrashlytics"],
    ecosystem: "swift",
  },
  Firebase: {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "crash data", "app performance metrics"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["Firebase"],
    ecosystem: "swift",
  },
  "stripe-ios": {
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
    envPatterns: ["STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY"],
    importPatterns: ["Stripe", "StripePaymentSheet"],
    ecosystem: "swift",
  },
  "sentry-cocoa": {
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
    envPatterns: ["SENTRY_DSN"],
    importPatterns: ["Sentry"],
    ecosystem: "swift",
  },
  "amplitude-ios": {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
    envPatterns: ["AMPLITUDE_API_KEY"],
    importPatterns: ["Amplitude", "AmplitudeSwift"],
    ecosystem: "swift",
  },
  "mixpanel-swift": {
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information", "location data"],
    envPatterns: ["MIXPANEL_TOKEN"],
    importPatterns: ["Mixpanel"],
    ecosystem: "swift",
  },
  "onesignal-ios-sdk": {
    category: "other",
    dataCollected: ["device tokens", "user segments", "notification engagement", "device information"],
    envPatterns: ["ONESIGNAL_APP_ID"],
    importPatterns: ["OneSignalFramework", "OneSignal"],
    ecosystem: "swift",
  },
  "AppAuth-iOS": {
    category: "auth",
    dataCollected: ["OAuth tokens", "session data", "user identity"],
    envPatterns: [],
    importPatterns: ["AppAuth"],
    ecosystem: "swift",
  },
  "facebook-ios-sdk": {
    category: "auth",
    dataCollected: ["email", "name", "Facebook profile data", "OAuth tokens", "social connections"],
    envPatterns: ["FACEBOOK_APP_ID"],
    importPatterns: ["FacebookLogin", "FacebookCore", "FBSDKLoginKit"],
    ecosystem: "swift",
  },
  "google-signin-ios": {
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
    envPatterns: ["GOOGLE_CLIENT_ID"],
    importPatterns: ["GoogleSignIn"],
    ecosystem: "swift",
  },

  // Kotlin/Android Ecosystem
  "firebase-analytics-android": {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "app events", "screen views"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["com.google.firebase.analytics"],
    ecosystem: "kotlin",
  },
  "firebase-auth-android": {
    category: "auth",
    dataCollected: ["email", "name", "phone number", "OAuth tokens", "session data"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["com.google.firebase.auth"],
    ecosystem: "kotlin",
  },
  "firebase-crashlytics-android": {
    category: "monitoring",
    dataCollected: ["crash data", "stack traces", "device information", "app state"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["com.google.firebase.crashlytics"],
    ecosystem: "kotlin",
  },
  "firebase-firestore-android": {
    category: "database",
    dataCollected: ["user data as defined in schema", "document content"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["com.google.firebase.firestore"],
    ecosystem: "kotlin",
  },
  "firebase-messaging-android": {
    category: "other",
    dataCollected: ["device tokens", "notification content", "message data"],
    envPatterns: ["FIREBASE_API_KEY"],
    importPatterns: ["com.google.firebase.messaging"],
    ecosystem: "kotlin",
  },
  "stripe-android": {
    category: "payment",
    dataCollected: ["payment information", "billing address", "email", "transaction history"],
    envPatterns: ["STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY"],
    importPatterns: ["com.stripe.android"],
    ecosystem: "kotlin",
  },
  "sentry-android": {
    category: "monitoring",
    dataCollected: ["error data", "stack traces", "user context", "device information"],
    envPatterns: ["SENTRY_DSN"],
    importPatterns: ["io.sentry"],
    ecosystem: "kotlin",
  },
  "amplitude-android": {
    category: "analytics",
    dataCollected: ["user behavior", "device information", "session data"],
    envPatterns: ["AMPLITUDE_API_KEY"],
    importPatterns: ["com.amplitude"],
    ecosystem: "kotlin",
  },
  "mixpanel-android": {
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information", "location data"],
    envPatterns: ["MIXPANEL_TOKEN"],
    importPatterns: ["com.mixpanel.android"],
    ecosystem: "kotlin",
  },
  "onesignal-android": {
    category: "other",
    dataCollected: ["device tokens", "user segments", "notification engagement", "device information"],
    envPatterns: ["ONESIGNAL_APP_ID"],
    importPatterns: ["com.onesignal"],
    ecosystem: "kotlin",
  },
  "facebook-login-android": {
    category: "auth",
    dataCollected: ["email", "name", "Facebook profile data", "OAuth tokens", "social connections"],
    envPatterns: ["FACEBOOK_APP_ID"],
    importPatterns: ["com.facebook.login"],
    ecosystem: "kotlin",
  },
  "facebook-sdk-android": {
    category: "auth",
    dataCollected: ["email", "name", "Facebook profile data", "OAuth tokens", "social connections"],
    envPatterns: ["FACEBOOK_APP_ID"],
    importPatterns: ["com.facebook.FacebookSdk"],
    ecosystem: "kotlin",
  },
  "google-auth-android": {
    category: "auth",
    dataCollected: ["email", "name", "Google profile data", "OAuth tokens"],
    envPatterns: ["GOOGLE_CLIENT_ID"],
    importPatterns: ["com.google.android.gms.auth"],
    ecosystem: "kotlin",
  },
  "braze-android": {
    category: "analytics",
    dataCollected: ["user behavior", "user profiles", "device information", "push tokens", "location data"],
    envPatterns: [],
    importPatterns: ["com.braze"],
    ecosystem: "kotlin",
  },
  "revenuecat-android": {
    category: "payment",
    dataCollected: ["purchase history", "subscription data", "transaction receipts", "user identity"],
    envPatterns: [],
    importPatterns: ["com.revenuecat.purchases"],
    ecosystem: "kotlin",
  },
  "google-ads-android": {
    category: "advertising",
    dataCollected: ["device information", "ad interaction data", "user behavior", "location data"],
    envPatterns: [],
    importPatterns: ["com.google.android.gms.ads"],
    ecosystem: "kotlin",
  },

  // API Framework
  "@trpc/server": {
    category: "other",
    dataCollected: ["API request data", "user input via procedures"],
    envPatterns: [],
    importPatterns: ["@trpc/server", "@trpc/client", "@trpc/react-query"],
    isDataProcessor: false,
  },
};
