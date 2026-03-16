# Contributing to Codepliant

Thanks for your interest in contributing. This guide covers the main extension points.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/joechensmartz/codepliant.git
cd codepliant

# Install dependencies
npm install

# Build
npm run build

# Run in development mode (no build step)
npx tsx src/cli.ts go ./path/to/project

# Run tests
npm test

# Test against a real project
node dist/cli.js go /path/to/project
```

### Project Structure

```
src/
  cli.ts                  # CLI entry point
  index.ts                # Public API exports
  config.ts               # .codepliantrc.json loader
  hook.ts                 # Pre-commit hook management
  scanner/
    types.ts              # Service signatures & types
    index.ts              # Main scanner orchestrator
    dependencies.ts       # package.json scanner (JS/TS)
    imports.ts            # Source code import scanner
    env.ts                # .env file scanner
    python.ts             # Python ecosystem scanner
    golang.ts             # Go ecosystem scanner
    ruby.ts               # Ruby ecosystem scanner
    elixir.ts             # Elixir ecosystem scanner
    php.ts                # PHP ecosystem scanner
    rust.ts               # Rust ecosystem scanner
    java.ts               # Java ecosystem scanner
    dotnet.ts             # .NET ecosystem scanner
    django-models.ts      # Django model scanner
    schema.ts             # Prisma schema scanner
    tracking.ts           # Tracking pixel scanner
    api-routes.ts         # API route scanner
    data-flow.ts          # Data flow analysis
    file-walker.ts        # File system traversal
  generator/
    index.ts              # Document generation orchestrator
    privacy-policy.ts     # Privacy Policy generator
    terms-of-service.ts   # Terms of Service generator
    ai-disclosure.ts      # AI Disclosure generator
    ai-checklist.ts       # AI Act Checklist generator
    cookie-policy.ts      # Cookie Policy generator
    dpa.ts                # Data Processing Agreement generator
    subprocessor-list.ts  # Sub-Processor List generator
    compliance-notes.ts   # Compliance Notes generator
    customization.ts      # Section override support
  output/
    index.ts              # Output format orchestrator
    html.ts               # HTML output (single-page)
    pdf.ts                # PDF output
    json-output.ts        # JSON output
    badge.ts              # SVG badge generator
    diff.ts               # Document diff & changelog
    widget.ts             # Embeddable widget
  mcp/
    server.ts             # MCP server
  i18n/
    translations/         # Translation files
```

## Adding New Service Signatures

Service signatures live in `src/scanner/types.ts` in the `SERVICE_SIGNATURES` object. Each entry maps a package name to its detection metadata.

### Steps

1. Open `src/scanner/types.ts`
2. Add a new entry to `SERVICE_SIGNATURES`:

```typescript
"package-name": {
  category: "analytics",          // ServiceCategory type
  dataCollected: [                 // What data this service typically collects
    "user behavior",
    "page views",
    "device information",
  ],
  envPatterns: [                   // Environment variable names to look for
    "PACKAGE_API_KEY",
    "PACKAGE_SECRET",
  ],
  importPatterns: [                // Import patterns to match in source code
    "package-name",
    "from 'package-name'",
  ],
},
```

3. Choose the appropriate `ServiceCategory`: `ai`, `payment`, `analytics`, `auth`, `email`, `database`, `storage`, `monitoring`, `advertising`, `social`, or `other`.
4. Build and test: `npm run build && node dist/cli.js scan ./test-project`

### Guidelines

- `dataCollected` should list the data types the service _typically_ collects, not every possible field
- `envPatterns` should match common environment variable naming conventions for the service
- `importPatterns` should include the npm/pip/gem package name and any common import aliases
- Keep entries sorted by category, then alphabetically within each category

## Adding New Ecosystem Scanners

Each ecosystem has its own scanner file in `src/scanner/`. Scanners read manifest files and source code to detect third-party services.

### Steps

1. Create a new file `src/scanner/myecosystem.ts`
2. Export a scan function:

```typescript
import type { DetectedService } from "./types.js";

export function scanMyEcosystemDependencies(projectPath: string): DetectedService[] {
  const services: DetectedService[] = [];

  // 1. Read the ecosystem's manifest file (e.g., myecosystem.lock)
  // 2. Parse dependency names
  // 3. Match against SERVICE_SIGNATURES
  // 4. Return DetectedService[] with evidence

  return services;
}
```

3. Register the scanner in `src/scanner/index.ts`:

```typescript
import { scanMyEcosystemDependencies } from "./myecosystem.js";

// Inside the scan() function, add:
const myEcosystemServices = timed("myecosystem", () =>
  scanMyEcosystemDependencies(absPath)
);
mergeServices(services, myEcosystemServices);
```

4. Add corresponding service signatures to `src/scanner/types.ts` for packages in that ecosystem
5. Add tests in `src/scanner/myecosystem.test.ts`
6. Build and verify: `npm run build && npm test`

### Key Patterns

- Use `file-walker.ts` utilities for traversing source files
- Return `Evidence` objects with `type`, `file`, and `detail` fields
- Deduplication is handled by the main scanner orchestrator — just return everything you find

## Adding New Document Generators

Document generators live in `src/generator/`. Each one produces a compliance document based on scan results.

### Steps

1. Create `src/generator/my-document.ts`:

```typescript
import type { ScanResult } from "../scanner/index.js";
import type { GeneratorContext } from "./index.js";

export function generateMyDocument(
  scan: ScanResult,
  ctx: GeneratorContext
): string | null {
  // Return null if this document is not applicable
  // Return the markdown content string if it is

  const hasRelevantServices = scan.services.some(
    (s) => s.category === "payment"
  );
  if (!hasRelevantServices) return null;

  return `# My Document\n\nGenerated for ${ctx.companyName}.\n\n...`;
}
```

2. Register in `src/generator/index.ts`:

```typescript
import { generateMyDocument } from "./my-document.js";

// Inside generateDocuments(), add:
const myDoc = generateMyDocument(scan, ctx);
if (myDoc) {
  docs.push({
    name: "My Document",
    filename: "MY_DOCUMENT.md",
    content: myDoc,
  });
}
```

3. Build and test against a real project

### Guidelines

- Always include a disclaimer about legal review
- Use `ctx` fields (company name, email, jurisdiction) to personalize the document
- Return `null` when the document is not applicable (don't generate empty documents)
- Support `ctx.sectionOverrides` by using consistent markdown headings

## Quality Rules

- Zero network calls — everything runs locally
- No runtime dependencies beyond `@modelcontextprotocol/sdk`
- Build must pass (`npm run build`) before submitting
- All service detections must be deterministic (no AI/LLM in the scanner)
- Generated documents must include a disclaimer about legal review
- Tests must pass (`npm test`)

## Submitting Changes

1. Fork the repo and create a branch
2. Make your changes
3. Run `npm run build && npm test`
4. Open a pull request with a clear description of what you added or changed
