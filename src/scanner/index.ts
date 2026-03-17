import * as fs from "fs";
import * as path from "path";
import { scanDependencies } from "./dependencies.js";
import { scanEnvFiles, detectEcosystems } from "./env.js";
import { scanImports } from "./imports.js";
import { scanPythonDependencies } from "./python.js";
import { scanGoDependencies } from "./golang.js";
import { scanRubyDependencies } from "./ruby.js";
import { scanElixirDependencies } from "./elixir.js";
import { scanPhpDependencies } from "./php.js";
import { scanRustDependencies } from "./rust.js";
import { scanJavaDependencies } from "./java.js";
import { scanDotnetDependencies } from "./dotnet.js";
import { scanFlutterDependencies } from "./flutter.js";
import { scanSwiftDependencies } from "./swift.js";
import { scanKotlinDependencies } from "./kotlin.js";
import { scanPrismaSchema } from "./schema.js";
import { scanDjangoModels } from "./django-models.js";
import { scanDjangoSettings } from "./django-settings.js";
import { scanTerraform } from "./terraform.js";
import { scanGoStructs } from "./go-structs.js";
import { scanSqlalchemyModels } from "./sqlalchemy-models.js";
import { scanTypeormModels } from "./typeorm-models.js";
import { scanMongooseModels } from "./mongoose-models.js";
import { scanDrizzleModels } from "./drizzle-models.js";
import { scanGraphqlSchema } from "./graphql-schema.js";
import { scanOpenApiSpecs } from "./openapi.js";
import { scanTracking } from "./tracking.js";
import { scanFrameworkImplicit } from "./framework-implicit.js";
import { scanApiRoutes } from "./api-routes.js";
import { scanIndustryCompliance, deriveIndustryComplianceNeeds } from "./industry.js";
import { scanAccessibility, deriveAccessibilityComplianceNeeds } from "./accessibility.js";
import { scanVulnerabilities } from "./vulnerability.js";
import { scanInfrastructure } from "./infrastructure.js";
import { scanLicenses, generateLicenseCompliance, type LicenseScanResult } from "./license-scanner.js";
import { scanCors, deriveCorsComplianceNeeds } from "./cors-scanner.js";
import { scanAuth, deriveAuthComplianceNeeds } from "./auth-scanner.js";
import { scanLogging } from "./logging-scanner.js";
import { scanDockerComposeServices } from "./docker-compose-services.js";
import { scanGitHubActions } from "./github-actions-scanner.js";
import { scanWebSockets } from "./websocket-scanner.js";
import { scanFileUploads } from "./file-upload-scanner.js";
import { scanCaching } from "./caching-scanner.js";
import { scanGraphQLEndpoints } from "./graphql-endpoint-scanner.js";
import { scanTurboRepo } from "./turbo-scanner.js";
import { walkDirectory, ALL_EXTENSIONS } from "./file-walker.js";
import type {
  ComplianceNeed,
  DataCategory,
  DetectedService,
  ScanResult,
  MonorepoInfo,
  WorkspaceInfo,
} from "./types.js";
import { SERVICE_SIGNATURES, FAMILY_MAP } from "./types.js";
import type { CodepliantPlugin } from "../plugins/index.js";

export type { ScanResult, DetectedService, ComplianceNeed, DataCategory, MonorepoInfo, WorkspaceInfo };

export interface ScanTimings {
  [scanner: string]: number;
}

export interface ScanOptions {
  /** When true, collect per-scanner timing data */
  verbose?: boolean;
  /** Loaded plugins whose custom scanners and signatures will be used */
  plugins?: CodepliantPlugin[];
}

/**
 * Detect whether a project is a monorepo and resolve workspace package paths.
 */
export function detectMonorepo(absPath: string): MonorepoInfo {
  const noMonorepo: MonorepoInfo = { detected: false, type: null, workspaces: [] };

  // 1. npm/yarn workspaces: "workspaces" field in package.json
  const pkgPath = path.join(absPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      const workspacesField: string[] | undefined =
        Array.isArray(pkg.workspaces)
          ? pkg.workspaces
          : Array.isArray(pkg.workspaces?.packages)
            ? pkg.workspaces.packages
            : undefined;

      if (workspacesField && workspacesField.length > 0) {
        const resolved = resolveWorkspaceGlobs(absPath, workspacesField);
        if (resolved.length > 0) {
          return { detected: true, type: "npm-workspaces", workspaces: resolved };
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  // 2. lerna.json
  const lernaPath = path.join(absPath, "lerna.json");
  if (fs.existsSync(lernaPath)) {
    try {
      const lerna = JSON.parse(fs.readFileSync(lernaPath, "utf-8"));
      const patterns: string[] = lerna.packages || ["packages/*"];
      const resolved = resolveWorkspaceGlobs(absPath, patterns);
      if (resolved.length > 0) {
        return { detected: true, type: "lerna", workspaces: resolved };
      }
    } catch {
      // ignore
    }
  }

  // 3. pnpm-workspace.yaml
  const pnpmPath = path.join(absPath, "pnpm-workspace.yaml");
  if (fs.existsSync(pnpmPath)) {
    try {
      const content = fs.readFileSync(pnpmPath, "utf-8");
      // Simple YAML parsing for the packages list
      const patterns = parsePnpmWorkspaceYaml(content);
      if (patterns.length > 0) {
        const resolved = resolveWorkspaceGlobs(absPath, patterns);
        if (resolved.length > 0) {
          return { detected: true, type: "pnpm", workspaces: resolved };
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. turbo.json (Turborepo)
  const turboPath = path.join(absPath, "turbo.json");
  if (fs.existsSync(turboPath)) {
    // Use dedicated turbo scanner for comprehensive package discovery
    const turboResult = scanTurboRepo(absPath);
    if (turboResult.packages.length > 0) {
      return { detected: true, type: "turbo", workspaces: turboResult.packages };
    }
    // Fallback to convention dirs
    const resolved = resolveConventionDirs(absPath);
    if (resolved.length > 0) {
      return { detected: true, type: "turbo", workspaces: resolved };
    }
  }

  // 5. Directory convention: packages/ or apps/ with own package.json
  const resolved = resolveConventionDirs(absPath);
  if (resolved.length > 0) {
    return { detected: true, type: "directory-convention", workspaces: resolved };
  }

  return noMonorepo;
}

/**
 * Parse pnpm-workspace.yaml to extract package glob patterns.
 * Handles the common format:
 *   packages:
 *     - 'packages/*'
 *     - 'apps/*'
 */
function parsePnpmWorkspaceYaml(content: string): string[] {
  const patterns: string[] = [];
  const lines = content.split("\n");
  let inPackages = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "packages:" || trimmed === "packages :") {
      inPackages = true;
      continue;
    }
    if (inPackages) {
      if (trimmed.startsWith("- ")) {
        // Strip quotes and leading dash
        const val = trimmed.slice(2).trim().replace(/^['"]|['"]$/g, "");
        if (val) patterns.push(val);
      } else if (trimmed !== "" && !trimmed.startsWith("#")) {
        // New top-level key, stop
        break;
      }
    }
  }
  return patterns;
}

/**
 * Resolve workspace glob patterns like "packages/*" to actual directories
 * that contain a package.json.
 */
function resolveWorkspaceGlobs(absPath: string, patterns: string[]): WorkspaceInfo[] {
  const workspaces: WorkspaceInfo[] = [];
  const seen = new Set<string>();

  for (const pattern of patterns) {
    // Strip trailing /* or /** and treat as directory prefix
    const cleanPattern = pattern.replace(/\/\*\*?$/, "");
    const parentDir = path.join(absPath, cleanPattern);

    if (!fs.existsSync(parentDir) || !fs.statSync(parentDir).isDirectory()) {
      // If the pattern doesn't end with *, it might be a direct path
      const directPkg = path.join(absPath, pattern, "package.json");
      if (fs.existsSync(directPkg)) {
        const fullPath = path.join(absPath, pattern);
        if (!seen.has(fullPath)) {
          seen.add(fullPath);
          workspaces.push(makeWorkspaceInfo(absPath, fullPath));
        }
      }
      continue;
    }

    // List subdirectories of parentDir
    try {
      const entries = fs.readdirSync(parentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const fullPath = path.join(parentDir, entry.name);
        const pkgJson = path.join(fullPath, "package.json");
        if (fs.existsSync(pkgJson) && !seen.has(fullPath)) {
          seen.add(fullPath);
          workspaces.push(makeWorkspaceInfo(absPath, fullPath));
        }
      }
    } catch {
      // ignore
    }
  }

  return workspaces;
}

/**
 * Look for packages/ and apps/ directories containing sub-packages.
 */
function resolveConventionDirs(absPath: string): WorkspaceInfo[] {
  const conventionDirs = ["packages", "apps"];
  const workspaces: WorkspaceInfo[] = [];
  const seen = new Set<string>();

  for (const dir of conventionDirs) {
    const fullDir = path.join(absPath, dir);
    if (!fs.existsSync(fullDir) || !fs.statSync(fullDir).isDirectory()) continue;

    try {
      const entries = fs.readdirSync(fullDir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const fullPath = path.join(fullDir, entry.name);
        const pkgJson = path.join(fullPath, "package.json");
        if (fs.existsSync(pkgJson) && !seen.has(fullPath)) {
          seen.add(fullPath);
          workspaces.push(makeWorkspaceInfo(absPath, fullPath));
        }
      }
    } catch {
      // ignore
    }
  }

  return workspaces;
}

function makeWorkspaceInfo(rootPath: string, pkgPath: string): WorkspaceInfo {
  const relativePath = path.relative(rootPath, pkgPath);
  let name = path.basename(pkgPath);

  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgPath, "package.json"), "utf-8"));
    if (pkg.name) name = pkg.name;
  } catch {
    // use directory name
  }

  return { name, path: pkgPath, relativePath };
}

/**
 * Tag evidence file paths with the workspace-relative prefix.
 */
function tagEvidenceWithPackage(services: DetectedService[], rootPath: string, workspacePath: string): void {
  const prefix = path.relative(rootPath, workspacePath);
  for (const service of services) {
    for (const ev of service.evidence) {
      // If the file path is absolute, make it relative to root and ensure it shows the package prefix
      if (path.isAbsolute(ev.file)) {
        ev.file = path.relative(rootPath, ev.file);
      } else if (!ev.file.startsWith(prefix)) {
        ev.file = path.join(prefix, ev.file);
      }
    }
  }
}

/**
 * Merge services from a workspace scan into the main service map.
 */
function mergeServicesIntoMap(serviceMap: Map<string, DetectedService>, services: DetectedService[]): void {
  for (const service of services) {
    if (serviceMap.has(service.name)) {
      const existing = serviceMap.get(service.name)!;
      existing.evidence.push(...service.evidence);
      for (const d of service.dataCollected) {
        if (!existing.dataCollected.includes(d)) {
          existing.dataCollected.push(d);
        }
      }
    } else {
      serviceMap.set(service.name, { ...service });
    }
  }
}

/**
 * Deduplicate services from the same "family" (e.g. @sentry/node, @sentry/nextjs, @sentry/react).
 * When multiple family members are detected, keep only the one with the most evidence and merge
 * the evidence from the others into it.
 */
export function deduplicateServiceFamilies(serviceMap: Map<string, DetectedService>): void {
  for (const [, members] of Object.entries(FAMILY_MAP)) {
    // Find which family members are present in the service map
    const present = members.filter((m) => serviceMap.has(m));
    if (present.length <= 1) continue;

    // Pick the winner: the member with the most evidence
    let winner = present[0];
    let maxEvidence = serviceMap.get(winner)!.evidence.length;
    for (let i = 1; i < present.length; i++) {
      const count = serviceMap.get(present[i])!.evidence.length;
      if (count > maxEvidence) {
        maxEvidence = count;
        winner = present[i];
      }
    }

    // Merge evidence from losers into the winner, then remove losers
    const winnerService = serviceMap.get(winner)!;
    for (const member of present) {
      if (member === winner) continue;
      const loser = serviceMap.get(member)!;
      winnerService.evidence.push(...loser.evidence);
      for (const d of loser.dataCollected) {
        if (!winnerService.dataCollected.includes(d)) {
          winnerService.dataCollected.push(d);
        }
      }
      serviceMap.delete(member);
    }
  }
}

export function scan(projectPath: string, options?: ScanOptions): ScanResult & { timings?: ScanTimings } {
  const absPath = path.resolve(projectPath);
  const verbose = options?.verbose ?? false;
  const plugins = options?.plugins ?? [];
  const timings: ScanTimings = {};
  const warnings: string[] = [];

  // Merge plugin-contributed service signatures into the global registry
  for (const plugin of plugins) {
    if (plugin.signatures) {
      for (const [key, sig] of Object.entries(plugin.signatures)) {
        if (!(key in SERVICE_SIGNATURES)) {
          (SERVICE_SIGNATURES as Record<string, typeof sig>)[key] = sig;
        }
      }
    }
  }

  function timed<T>(name: string, fn: () => T): T {
    if (!verbose) return fn();
    const t0 = Date.now();
    const result = fn();
    timings[name] = Date.now() - t0;
    return result;
  }

  /**
   * Run a scanner with graceful degradation: if it throws, log a warning
   * and return the fallback value instead of crashing the entire scan.
   */
  function safeRun<T>(name: string, fn: () => T, fallback: T): T {
    try {
      return timed(name, fn);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      warnings.push(`${name} scanner failed: ${message}`);
      return fallback;
    }
  }

  // Get project name from package.json or directory name
  let projectName = path.basename(absPath);
  const pkgPath = path.join(absPath, "package.json");
  if (fs.existsSync(pkgPath)) {
    try {
      const raw = fs.readFileSync(pkgPath, "utf-8").trim();
      if (raw.length === 0) {
        warnings.push("package.json exists but is empty");
      } else {
        const pkg = JSON.parse(raw);
        if (pkg && typeof pkg === "object" && pkg.name) projectName = pkg.name;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Provide actionable message for JSON parse errors
      if (err instanceof SyntaxError) {
        const lineMatch = message.match(/position (\d+)/);
        if (lineMatch) {
          const pos = parseInt(lineMatch[1], 10);
          try {
            const raw = fs.readFileSync(pkgPath, "utf-8");
            const line = raw.substring(0, pos).split("\n").length;
            warnings.push(`package.json has invalid JSON at line ${line}: ${message}`);
          } catch {
            warnings.push(`package.json has invalid JSON: ${message}`);
          }
        } else {
          warnings.push(`package.json has invalid JSON: ${message}`);
        }
      } else {
        warnings.push(`Could not read package.json: ${message}`);
      }
    }
  }

  // Detect monorepo
  const monorepoInfo = safeRun("Monorepo detection", () => detectMonorepo(absPath), { detected: false, type: null, workspaces: [] } as MonorepoInfo);

  // Single directory walk shared by all file-based scanners
  const allFiles = safeRun("File walk", () =>
    walkDirectory(absPath, { extensions: ALL_EXTENSIONS, skipTests: true }),
    []
  );

  // Run all scanners on root project — each wrapped for graceful degradation
  const depServices = safeRun("Dependencies", () => scanDependencies(absPath), []);
  const pythonServices = safeRun("Python deps", () => scanPythonDependencies(absPath), []);
  const goServices = safeRun("Go deps", () => scanGoDependencies(absPath), []);
  const rubyServices = safeRun("Ruby deps", () => scanRubyDependencies(absPath), []);
  const elixirServices = safeRun("Elixir deps", () => scanElixirDependencies(absPath), []);
  const phpServices = safeRun("PHP deps", () => scanPhpDependencies(absPath), []);
  const rustServices = safeRun("Rust deps", () => scanRustDependencies(absPath), []);
  const javaServices = safeRun("Java deps", () => scanJavaDependencies(absPath), []);
  const dotnetServices = safeRun("Dotnet deps", () => scanDotnetDependencies(absPath), []);
  const flutterServices = safeRun("Flutter deps", () => scanFlutterDependencies(absPath), []);
  const swiftServices = safeRun("Swift deps", () => scanSwiftDependencies(absPath), []);
  const kotlinServices = safeRun("Kotlin deps", () => scanKotlinDependencies(absPath), []);
  const importServices = safeRun("Imports", () => scanImports(absPath, allFiles), []);
  const envServices = safeRun("Env vars", () => scanEnvFiles(absPath), []);
  const trackingServices = safeRun("Tracking", () => scanTracking(absPath, allFiles), []);
  const frameworkImplicitServices = safeRun("Framework implicit", () => scanFrameworkImplicit(absPath), []);
  const djangoSettingsServices = safeRun("Django settings", () => scanDjangoSettings(absPath), []);
  const terraformServices = safeRun("Terraform", () => scanTerraform(absPath), []);
  const dockerComposeServices = safeRun("Docker Compose services", () => scanDockerComposeServices(absPath), []);
  const githubActionsServices = safeRun("GitHub Actions", () => scanGitHubActions(absPath), []);
  const webSocketServices = safeRun("WebSockets", () => scanWebSockets(absPath, allFiles), []);
  const fileUploadServices = safeRun("File uploads", () => scanFileUploads(absPath, allFiles), []);
  const cachingServices = safeRun("Caching", () => scanCaching(absPath, allFiles), []);
  const graphqlEndpointResult = safeRun("GraphQL endpoints", () => scanGraphQLEndpoints(absPath, allFiles), { endpoints: [], services: [] });
  const graphqlEndpointServices = graphqlEndpointResult.services;

  // Merge results (deduplicate by service name, combine evidence)
  const serviceMap = new Map<string, DetectedService>();

  // Run custom scanners from plugins
  const pluginScanResults: DetectedService[][] = [];
  for (const plugin of plugins) {
    if (plugin.scanners) {
      for (const customScanner of plugin.scanners) {
        const results = safeRun(`Plugin: ${customScanner.name}`, () =>
          customScanner.scan(absPath),
          []
        );
        pluginScanResults.push(results);
      }
    }
  }

  for (const svcList of [depServices, pythonServices, goServices, rubyServices, elixirServices, phpServices, rustServices, javaServices, dotnetServices, flutterServices, swiftServices, kotlinServices, importServices, envServices, trackingServices, frameworkImplicitServices, djangoSettingsServices, terraformServices, dockerComposeServices, githubActionsServices, webSocketServices, fileUploadServices, cachingServices, graphqlEndpointServices, ...pluginScanResults]) {
    mergeServicesIntoMap(serviceMap, svcList);
  }

  // If monorepo detected, ensure root package.json is scanned, then scan each workspace
  if (monorepoInfo.detected) {
    // Always scan root package.json deps (many monorepos put shared deps like stripe, sentry at root)
    const rootDeps = safeRun("Monorepo root deps", () => scanDependencies(absPath), []);
    // Tag root deps evidence to show they come from the root
    for (const svc of rootDeps) {
      for (const ev of svc.evidence) {
        if (ev.file === "package.json") {
          ev.file = "package.json (root)";
        }
      }
    }
    mergeServicesIntoMap(serviceMap, rootDeps);

    for (const workspace of monorepoInfo.workspaces) {
      try {
        const wsPath = workspace.path;
        const wsFiles = walkDirectory(wsPath, { extensions: ALL_EXTENSIONS, skipTests: true });

        const allWsServices = [
          // Pass absPath as rootPath so workspace dep scan also picks up shared root deps
          ...safeRun(`WS:${workspace.name}:deps`, () => scanDependencies(wsPath, absPath), []),
          ...safeRun(`WS:${workspace.name}:python`, () => scanPythonDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:go`, () => scanGoDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:ruby`, () => scanRubyDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:elixir`, () => scanElixirDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:php`, () => scanPhpDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:rust`, () => scanRustDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:java`, () => scanJavaDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:dotnet`, () => scanDotnetDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:flutter`, () => scanFlutterDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:swift`, () => scanSwiftDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:kotlin`, () => scanKotlinDependencies(wsPath), []),
          ...safeRun(`WS:${workspace.name}:imports`, () => scanImports(wsPath, wsFiles), []),
          ...safeRun(`WS:${workspace.name}:env`, () => scanEnvFiles(wsPath), []),
          ...safeRun(`WS:${workspace.name}:tracking`, () => scanTracking(wsPath, wsFiles), []),
          ...safeRun(`WS:${workspace.name}:framework`, () => scanFrameworkImplicit(wsPath), []),
        ];

        // Tag evidence with workspace-relative path (e.g., "packages/api/package.json")
        tagEvidenceWithPackage(allWsServices, absPath, wsPath);
        mergeServicesIntoMap(serviceMap, allWsServices);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        warnings.push(`Workspace "${workspace.name}" scan failed: ${message}`);
      }
    }
  }

  // Deduplicate services within the same family (e.g. multiple @sentry/* packages).
  // Keep only the family member with the most evidence.
  deduplicateServiceFamilies(serviceMap);

  const services = Array.from(serviceMap.values());

  // Scan for additional data categories — each wrapped for graceful degradation
  const schemaCategories = safeRun("Schema", () => scanPrismaSchema(absPath), []);
  const djangoCategories = safeRun("Django models", () => scanDjangoModels(absPath), []);
  const sqlalchemyCategories = safeRun("SQLAlchemy models", () => scanSqlalchemyModels(absPath), []);
  const goStructCategories = safeRun("Go structs", () => scanGoStructs(absPath), []);
  const typeormCategories = safeRun("TypeORM/Sequelize models", () => scanTypeormModels(absPath), []);
  const mongooseCategories = safeRun("Mongoose models", () => scanMongooseModels(absPath), []);
  const graphqlCategories = safeRun("GraphQL schema", () => scanGraphqlSchema(absPath), []);
  const drizzleCategories = safeRun("Drizzle models", () => scanDrizzleModels(absPath), []);

  // Derive data categories
  const dataCategories = deriveDataCategories(services);

  // Merge schema-derived categories (append, deduplicate by category name)
  for (const schemaCat of schemaCategories) {
    const existing = dataCategories.find((c) => c.category === schemaCat.category);
    if (existing) {
      existing.description += " " + schemaCat.description;
      for (const src of schemaCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(schemaCat);
    }
  }

  // Merge Django model-derived categories
  for (const djangoCat of djangoCategories) {
    const existing = dataCategories.find((c) => c.category === djangoCat.category);
    if (existing) {
      existing.description += " " + djangoCat.description;
      for (const src of djangoCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(djangoCat);
    }
  }

  // Merge SQLAlchemy model-derived categories
  for (const sqaCat of sqlalchemyCategories) {
    const existing = dataCategories.find((c) => c.category === sqaCat.category);
    if (existing) {
      existing.description += " " + sqaCat.description;
      for (const src of sqaCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(sqaCat);
    }
  }

  // Merge Go struct-derived categories
  for (const goCat of goStructCategories) {
    const existing = dataCategories.find((c) => c.category === goCat.category);
    if (existing) {
      existing.description += " " + goCat.description;
      for (const src of goCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(goCat);
    }
  }

  // Merge TypeORM/Sequelize model-derived categories
  for (const typeormCat of typeormCategories) {
    const existing = dataCategories.find((c) => c.category === typeormCat.category);
    if (existing) {
      existing.description += " " + typeormCat.description;
      for (const src of typeormCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(typeormCat);
    }
  }

  // Merge Mongoose model-derived categories
  for (const mongooseCat of mongooseCategories) {
    const existing = dataCategories.find((c) => c.category === mongooseCat.category);
    if (existing) {
      existing.description += " " + mongooseCat.description;
      for (const src of mongooseCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(mongooseCat);
    }
  }


  // Merge Drizzle model-derived categories
  for (const drizzleCat of drizzleCategories) {
    const existing = dataCategories.find((c) => c.category === drizzleCat.category);
    if (existing) {
      existing.description += " " + drizzleCat.description;
      for (const src of drizzleCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(drizzleCat);
    }
  }
  // Merge GraphQL schema-derived categories
  for (const graphqlCat of graphqlCategories) {
    const existing = dataCategories.find((c) => c.category === graphqlCat.category);
    if (existing) {
      existing.description += " " + graphqlCat.description;
      for (const src of graphqlCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(graphqlCat);
    }
  }

  // Merge OpenAPI/Swagger spec-derived categories
  const openapiCategories = safeRun("OpenAPI specs", () => scanOpenApiSpecs(absPath), []);
  for (const openapiCat of openapiCategories) {
    const existing = dataCategories.find((c) => c.category === openapiCat.category);
    if (existing) {
      existing.description += " " + openapiCat.description;
      for (const src of openapiCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(openapiCat);
    }
  }

  // Scan API routes for data collection endpoints
  const apiCategories = safeRun("API routes", () => scanApiRoutes(absPath, allFiles), []);
  for (const apiCat of apiCategories) {
    const existing = dataCategories.find((c) => c.category === apiCat.category);
    if (existing) {
      existing.description += " " + apiCat.description;
      for (const src of apiCat.sources) {
        if (!existing.sources.includes(src)) {
          existing.sources.push(src);
        }
      }
    } else {
      dataCategories.push(apiCat);
    }
  }

  // Scan for industry-specific compliance needs (HIPAA, PCI DSS)
  const industryResult = safeRun("Industry", () => scanIndustryCompliance(absPath, allFiles), { hipaa: { detected: false, evidence: [] }, pciDss: { detected: false, evidence: [] }, coppa: { detected: false, evidence: [] } });
  const hasPaymentService = services.some((s) => s.category === "payment");

  // Determine compliance needs
  const complianceNeeds = deriveComplianceNeeds(services);

  // Append industry-specific compliance needs
  const industryNeeds = deriveIndustryComplianceNeeds(industryResult, hasPaymentService);
  complianceNeeds.push(...industryNeeds);

  // Scan for accessibility compliance
  const accessibilityResult = safeRun("Accessibility", () => scanAccessibility(absPath, allFiles), { hasA11yTooling: false, usesAria: false, hasA11yLinting: false, evidence: [] });
  const accessibilityNeeds = deriveAccessibilityComplianceNeeds(accessibilityResult);
  complianceNeeds.push(...accessibilityNeeds);

  // Scan for CORS configuration issues
  const corsResult = safeRun("CORS", () => scanCors(absPath, allFiles), { detected: false, findings: [], hasWildcardOrigin: false });
  const corsNeeds = deriveCorsComplianceNeeds(corsResult);
  complianceNeeds.push(...corsNeeds);

  // Scan for authentication patterns (JWT, sessions, OAuth, password hashing, MFA)
  const authResult = safeRun("Auth patterns", () => scanAuth(absPath, allFiles), { jwt: [], sessionManagement: [], oauth: [], passwordHashing: [], mfa: [] });
  const authNeeds = deriveAuthComplianceNeeds(authResult);
  complianceNeeds.push(...authNeeds);

  // Scan infrastructure files (Dockerfile, docker-compose, Kubernetes)
  const infraResult = safeRun("Infrastructure", () => scanInfrastructure(absPath), { findings: [], complianceNeeds: [] });
  complianceNeeds.push(...infraResult.complianceNeeds);

  // Scan for known dependency vulnerabilities
  const vulnResult = safeRun("Vulnerability scan", () => scanVulnerabilities(absPath), { findings: [], lockfileUsed: null, packageCount: 0 });
  if (vulnResult.findings.length > 0) {
    complianceNeeds.push({
      document: "Security Policy",
      reason: `${vulnResult.findings.length} package(s) may have known vulnerabilities. Run npm audit to check for security issues.`,
      priority: "required",
    });
  }

  // Scan for logging practices and potential PII exposure in logs
  const loggingResult = safeRun("Logging scan", () => scanLogging(absPath, allFiles), { libraries: [], totalLogCalls: 0, piiFindings: [], findings: [] });
  if (loggingResult.piiFindings.length > 0) {
    complianceNeeds.push({
      document: "Security Policy",
      reason: `${loggingResult.piiFindings.length} log statement(s) may expose PII. Review logging practices to prevent data leakage.`,
      priority: "required",
    });
  }

  // Deduplicate compliance needs by document name (keep highest priority)
  const needsByDoc = new Map<string, ComplianceNeed>();
  for (const need of complianceNeeds) {
    const existing = needsByDoc.get(need.document);
    if (!existing || (need.priority === "required" && existing.priority !== "required")) {
      needsByDoc.set(need.document, need);
    }
  }
  const deduplicatedNeeds = Array.from(needsByDoc.values());

  // Sort services by name for deterministic output
  services.sort((a, b) => a.name.localeCompare(b.name));

  // Scan for open source license compliance
  const licenseScanResult = safeRun("License scan", () => scanLicenses(absPath), { projectLicense: null, dependencies: [], copyleftDependencies: [], warnings: [] } as LicenseScanResult);

  const result: ScanResult & { timings?: ScanTimings } = {
    projectName,
    projectPath: absPath,
    scannedAt: new Date().toISOString(),
    services,
    dataCategories,
    complianceNeeds: deduplicatedNeeds,
  };

  // Detect ecosystems and include in result
  const detectedEcosystems = safeRun("Ecosystem detection", () => {
    const ecoSet = detectEcosystems(absPath);
    return Array.from(ecoSet).sort();
  }, [] as string[]);
  if (detectedEcosystems.length > 0) {
    result.ecosystems = detectedEcosystems as ScanResult["ecosystems"];
  }

  if (licenseScanResult.dependencies.length > 0 || licenseScanResult.projectLicense) {
    result.licenseScan = licenseScanResult;
  }

  if (monorepoInfo.detected) {
    result.monorepo = monorepoInfo;
  }

  if (warnings.length > 0) {
    result.warnings = warnings;
  }

  if (verbose) {
    result.timings = timings;
  }

  return result;
}

function deriveDataCategories(services: DetectedService[]): DataCategory[] {
  const categories: DataCategory[] = [];

  const hasCategory = (cat: string) =>
    services.some((s) => s.category === cat);

  if (hasCategory("auth")) {
    categories.push({
      category: "Personal Identity Data",
      description:
        "Email addresses, names, profile pictures, and account credentials collected through authentication.",
      sources: services
        .filter((s) => s.category === "auth")
        .map((s) => s.name),
    });
  }

  if (hasCategory("payment")) {
    categories.push({
      category: "Financial Data",
      description:
        "Payment card information, billing addresses, and transaction history processed through payment providers.",
      sources: services
        .filter((s) => s.category === "payment")
        .map((s) => s.name),
    });
  }

  if (hasCategory("analytics")) {
    categories.push({
      category: "Usage & Behavioral Data",
      description:
        "Page views, click patterns, session recordings, device information, and IP addresses collected through analytics tools.",
      sources: services
        .filter((s) => s.category === "analytics")
        .map((s) => s.name),
    });
  }

  if (hasCategory("ai")) {
    categories.push({
      category: "AI Interaction Data",
      description:
        "User prompts, conversation history, and AI-generated content processed through third-party AI services.",
      sources: services
        .filter((s) => s.category === "ai")
        .map((s) => s.name),
    });
  }

  if (hasCategory("email")) {
    categories.push({
      category: "Communication Data",
      description:
        "Email addresses and email content processed through email service providers.",
      sources: services
        .filter((s) => s.category === "email")
        .map((s) => s.name),
    });
  }

  if (hasCategory("monitoring")) {
    categories.push({
      category: "Technical & Diagnostic Data",
      description:
        "Error reports, stack traces, performance data, and user context collected through monitoring tools.",
      sources: services
        .filter((s) => s.category === "monitoring")
        .map((s) => s.name),
    });
  }

  if (hasCategory("storage")) {
    categories.push({
      category: "User-Uploaded Content",
      description:
        "Files, images, and documents uploaded by users and stored through cloud storage providers.",
      sources: services
        .filter((s) => s.category === "storage")
        .map((s) => s.name),
    });
  }

  if (hasCategory("advertising")) {
    categories.push({
      category: "Advertising & Conversion Data",
      description:
        "Conversion events, page views, user interactions, and device information collected through advertising pixels and tracking scripts.",
      sources: services
        .filter((s) => s.category === "advertising")
        .map((s) => s.name),
    });
  }

  if (hasCategory("database")) {
    categories.push({
      category: "Stored User Data",
      description:
        "Persistent user data stored in databases as defined by the application schema.",
      sources: services
        .filter((s) => s.category === "database")
        .map((s) => s.name),
    });
  }

  return categories;
}

function deriveComplianceNeeds(services: DetectedService[]): ComplianceNeed[] {
  const needs: ComplianceNeed[] = [];

  // Privacy Policy is always needed if any data is collected
  if (services.length > 0) {
    needs.push({
      document: "Privacy Policy",
      reason:
        "Your application collects user data through " +
        services.length +
        " detected service(s). A privacy policy is legally required in most jurisdictions (GDPR, CCPA, etc.).",
      priority: "required",
    });
  }

  // Terms of Service is always recommended
  needs.push({
    document: "Terms of Service",
    reason:
      "A Terms of Service agreement defines the rules for using your application and limits your liability.",
    priority: "recommended",
  });

  // AI Disclosure if AI services are detected
  const hasAI = services.some((s) => s.category === "ai");
  if (hasAI) {
    needs.push({
      document: "AI Disclosure",
      reason:
        "Your application uses AI services. The EU AI Act (effective August 2026) requires transparency about AI usage, including what AI systems are used, what data is processed, and how AI-generated content is identified.",
      priority: "required",
    });
  }

  // Cookie Policy if analytics/tracking is detected
  const hasAnalytics = services.some(
    (s) => s.category === "analytics" || s.category === "advertising"
  );
  const hasAuth = services.some((s) => s.category === "auth");
  if (hasAnalytics || hasAuth) {
    needs.push({
      document: "Cookie Policy",
      reason:
        "Your application uses cookies or similar tracking technologies through analytics or authentication services. GDPR and ePrivacy Directive require cookie consent and disclosure.",
      priority: "required",
    });
  }

  // Data Processing Agreement if third-party data processors detected
  const hasThirdPartyProcessors = services.some(
    (s) => s.category !== "database" && s.category !== "other"
  );
  if (hasThirdPartyProcessors) {
    needs.push({
      document: "Data Processing Agreement",
      reason:
        "Your application shares personal data with third-party processors. GDPR Article 28 requires a Data Processing Agreement with each processor that handles personal data on your behalf.",
      priority: "recommended",
    });
  }

  return needs;
}
