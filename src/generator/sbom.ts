import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import type { ScanResult } from "../scanner/index.js";

export interface CycloneDXComponent {
  type: "library" | "framework" | "application";
  name: string;
  version: string;
  purl?: string;
  "bom-ref"?: string;
}

export interface CycloneDXBom {
  bomFormat: "CycloneDX";
  specVersion: "1.5";
  serialNumber: string;
  version: number;
  metadata: {
    timestamp: string;
    tools: { vendor: string; name: string; version: string }[];
    component?: { type: string; name: string; version: string };
  };
  components: CycloneDXComponent[];
}

/**
 * Build a Package URL (purl) for an npm package.
 * Follows the purl spec: pkg:npm/[namespace/]name@version
 */
function buildPurl(name: string, version: string): string {
  // Scoped packages like @scope/pkg become pkg:npm/%40scope/pkg@version
  const cleanVersion = version.replace(/^[\^~>=<]/, "");
  if (name.startsWith("@")) {
    const encoded = name.replace("@", "%40");
    return `pkg:npm/${encoded}@${cleanVersion}`;
  }
  return `pkg:npm/${name}@${cleanVersion}`;
}

/**
 * Read all dependencies from the project's package.json.
 * Returns a map of package name to version string.
 */
function readPackageJsonDeps(projectPath: string): Record<string, string> {
  const pkgPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return {};
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return {
      ...(pkg.dependencies as Record<string, string> | undefined),
      ...(pkg.devDependencies as Record<string, string> | undefined),
    };
  } catch {
    return {};
  }
}

/**
 * Read the project name and version from package.json.
 */
function readPackageJsonMeta(projectPath: string): { name: string; version: string } {
  const pkgPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return { name: path.basename(projectPath), version: "0.0.0" };
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    return {
      name: pkg.name || path.basename(projectPath),
      version: pkg.version || "0.0.0",
    };
  } catch {
    return { name: path.basename(projectPath), version: "0.0.0" };
  }
}

/**
 * Generate a CycloneDX 1.5 SBOM from a scan result.
 * Reads the full dependency list from package.json (not just known services).
 */
export function generateSbom(scanResult: ScanResult): CycloneDXBom {
  const deps = readPackageJsonDeps(scanResult.projectPath);
  const meta = readPackageJsonMeta(scanResult.projectPath);

  const components: CycloneDXComponent[] = Object.entries(deps).map(
    ([name, version]) => {
      const cleanVersion = version.replace(/^[\^~>=<]/, "");
      const component: CycloneDXComponent = {
        type: "library",
        name,
        version: cleanVersion,
        purl: buildPurl(name, version),
        "bom-ref": `${name}@${cleanVersion}`,
      };
      return component;
    }
  );

  // Sort components by name for deterministic output
  components.sort((a, b) => a.name.localeCompare(b.name));

  const bom: CycloneDXBom = {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: `urn:uuid:${crypto.randomUUID()}`,
    version: 1,
    metadata: {
      timestamp: new Date().toISOString(),
      tools: [
        {
          vendor: "codepliant",
          name: "codepliant",
          version: "1.0.0",
        },
      ],
      component: {
        type: "application",
        name: meta.name,
        version: meta.version,
      },
    },
    components,
  };

  return bom;
}

/**
 * Write the SBOM to a file. Returns the absolute path of the written file.
 */
export function writeSbom(bom: CycloneDXBom, outputPath: string): string {
  const absPath = path.resolve(outputPath);
  const dir = path.dirname(absPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(absPath, JSON.stringify(bom, null, 2) + "\n", "utf-8");
  return absPath;
}
