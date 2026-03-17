import * as fs from "fs";
import * as path from "path";
import type { DetectedService, Evidence, ServiceCategory } from "./types.js";

/**
 * Terraform resource type signatures: maps resource types to detected services.
 */
interface TerraformResourceSignature {
  serviceName: string;
  category: ServiceCategory;
  dataCollected: string[];
  isDataProcessor?: boolean;
}

const RESOURCE_SIGNATURES: Record<string, TerraformResourceSignature> = {
  // AWS resources
  aws_s3_bucket: {
    serviceName: "aws-s3",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata", "user-generated content"],
  },
  aws_rds_instance: {
    serviceName: "aws-rds",
    category: "database",
    dataCollected: ["user data as defined in schema", "database backups"],
  },
  aws_dynamodb_table: {
    serviceName: "aws-dynamodb",
    category: "database",
    dataCollected: ["user data as defined in schema", "key-value data"],
  },
  aws_sqs_queue: {
    serviceName: "aws-sqs",
    category: "other",
    dataCollected: ["message payloads", "message metadata"],
    isDataProcessor: false,
  },
  aws_sns_topic: {
    serviceName: "aws-sns",
    category: "other",
    dataCollected: ["notification payloads", "subscriber endpoints"],
  },
  aws_lambda_function: {
    serviceName: "aws-lambda",
    category: "other",
    dataCollected: ["function invocation data", "event payloads"],
    isDataProcessor: false,
  },
  aws_cognito_user_pool: {
    serviceName: "aws-cognito",
    category: "auth",
    dataCollected: ["user accounts", "email addresses", "phone numbers", "authentication tokens", "MFA settings"],
  },

  // GCP resources
  google_storage_bucket: {
    serviceName: "gcp-cloud-storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata", "user-generated content"],
  },
  google_sql_database_instance: {
    serviceName: "gcp-cloud-sql",
    category: "database",
    dataCollected: ["user data as defined in schema", "database backups"],
  },
  google_bigquery_dataset: {
    serviceName: "gcp-bigquery",
    category: "analytics",
    dataCollected: ["analytics data", "query results", "user behavioral data"],
  },
  google_cloud_run_service: {
    serviceName: "gcp-cloud-run",
    category: "other",
    dataCollected: ["request data", "service logs"],
    isDataProcessor: false,
  },

  // Azure resources
  azurerm_storage_account: {
    serviceName: "azure-storage",
    category: "storage",
    dataCollected: ["uploaded files", "file metadata", "blob data"],
  },
  azurerm_sql_server: {
    serviceName: "azure-sql",
    category: "database",
    dataCollected: ["user data as defined in schema", "database backups"],
  },
  azurerm_cosmosdb_account: {
    serviceName: "azure-cosmosdb",
    category: "database",
    dataCollected: ["user data as defined in schema", "document data"],
  },
  azurerm_redis_cache: {
    serviceName: "azure-redis",
    category: "database",
    dataCollected: ["cached data", "session data"],
    isDataProcessor: false,
  },
};

/**
 * Terraform provider names to cloud provider labels.
 */
const PROVIDER_SIGNATURES: Record<string, TerraformResourceSignature> = {
  aws: {
    serviceName: "aws",
    category: "other",
    dataCollected: ["cloud infrastructure metadata"],
    isDataProcessor: false,
  },
  google: {
    serviceName: "gcp",
    category: "other",
    dataCollected: ["cloud infrastructure metadata"],
    isDataProcessor: false,
  },
  azurerm: {
    serviceName: "azure",
    category: "other",
    dataCollected: ["cloud infrastructure metadata"],
    isDataProcessor: false,
  },
};

/**
 * Resource types that indicate data storage, mapped to data category info.
 */
const DATA_STORAGE_RESOURCES: Record<string, { category: string; description: string }> = {
  aws_s3_bucket: {
    category: "User-Uploaded Content",
    description: "Files and objects stored in AWS S3 buckets.",
  },
  aws_rds_instance: {
    category: "Stored User Data",
    description: "Relational data stored in AWS RDS databases.",
  },
  aws_dynamodb_table: {
    category: "Stored User Data",
    description: "Key-value and document data stored in AWS DynamoDB.",
  },
  aws_cognito_user_pool: {
    category: "Personal Identity Data",
    description: "User identity and authentication data managed by AWS Cognito.",
  },
  google_storage_bucket: {
    category: "User-Uploaded Content",
    description: "Files and objects stored in Google Cloud Storage buckets.",
  },
  google_sql_database_instance: {
    category: "Stored User Data",
    description: "Relational data stored in Google Cloud SQL databases.",
  },
  google_bigquery_dataset: {
    category: "Usage & Behavioral Data",
    description: "Analytics and query data stored in Google BigQuery.",
  },
  azurerm_storage_account: {
    category: "User-Uploaded Content",
    description: "Files and blobs stored in Azure Storage accounts.",
  },
  azurerm_sql_server: {
    category: "Stored User Data",
    description: "Relational data stored in Azure SQL databases.",
  },
  azurerm_cosmosdb_account: {
    category: "Stored User Data",
    description: "Document data stored in Azure Cosmos DB.",
  },
  azurerm_redis_cache: {
    category: "Stored User Data",
    description: "Cached and session data stored in Azure Redis Cache.",
  },
};

interface TerraformDetection {
  serviceName: string;
  category: ServiceCategory;
  dataCollected: string[];
  evidence: Evidence;
  isDataProcessor?: boolean;
}

/**
 * Scans a project for Terraform (.tf) files and detects cloud services
 * from `resource` and `provider` blocks.
 */
export function scanTerraform(projectPath: string): DetectedService[] {
  const tfFiles = findTerraformFiles(projectPath);

  if (tfFiles.length === 0) {
    return [];
  }

  const detections: TerraformDetection[] = [];

  for (const filePath of tfFiles) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const relPath = path.relative(projectPath, filePath);

    detections.push(...parseResourceBlocks(content, relPath));
    detections.push(...parseProviderBlocks(content, relPath));
  }

  if (detections.length === 0) {
    return [];
  }

  return groupDetections(detections);
}

/**
 * Recursively finds .tf files in the project, skipping common non-project directories.
 */
function findTerraformFiles(projectPath: string): string[] {
  const found: string[] = [];
  const skipDirs = new Set([
    "node_modules",
    ".git",
    ".terraform",
    "__pycache__",
    ".venv",
    "venv",
    "dist",
    "build",
    ".next",
  ]);

  function walk(dir: string, depth: number) {
    if (depth > 10) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!skipDirs.has(entry.name) && !entry.name.startsWith(".")) {
          walk(path.join(dir, entry.name), depth + 1);
        }
      } else if (entry.name.endsWith(".tf")) {
        found.push(path.join(dir, entry.name));
      }
    }
  }

  walk(projectPath, 0);
  return found;
}

/**
 * Parses `resource "type" "name" { ... }` blocks from Terraform content.
 */
function parseResourceBlocks(content: string, filePath: string): TerraformDetection[] {
  const detections: TerraformDetection[] = [];

  // Match resource "resource_type" "resource_name"
  const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = resourceRegex.exec(content)) !== null) {
    const resourceType = match[1];
    const resourceName = match[2];

    const sig = RESOURCE_SIGNATURES[resourceType];
    if (sig) {
      detections.push({
        serviceName: sig.serviceName,
        category: sig.category,
        dataCollected: [...sig.dataCollected],
        evidence: {
          type: "code_pattern",
          file: filePath,
          detail: `Terraform resource "${resourceType}" "${resourceName}"`,
        },
        isDataProcessor: sig.isDataProcessor,
      });
    }
  }

  return detections;
}

/**
 * Parses `provider "name" { ... }` blocks from Terraform content.
 * Only emits a detection if no resource-level detection for that provider already exists.
 */
function parseProviderBlocks(content: string, filePath: string): TerraformDetection[] {
  const detections: TerraformDetection[] = [];

  const providerRegex = /provider\s+"([^"]+)"/g;
  let match: RegExpExecArray | null;

  while ((match = providerRegex.exec(content)) !== null) {
    const providerName = match[1];

    const sig = PROVIDER_SIGNATURES[providerName];
    if (sig) {
      detections.push({
        serviceName: sig.serviceName,
        category: sig.category,
        dataCollected: [...sig.dataCollected],
        evidence: {
          type: "code_pattern",
          file: filePath,
          detail: `Terraform provider "${providerName}"`,
        },
        isDataProcessor: sig.isDataProcessor,
      });
    }
  }

  return detections;
}

/**
 * Groups detections by service name into DetectedService objects,
 * merging evidence and dataCollected.
 */
function groupDetections(detections: TerraformDetection[]): DetectedService[] {
  const serviceMap = new Map<string, DetectedService>();

  for (const detection of detections) {
    const existing = serviceMap.get(detection.serviceName);
    if (existing) {
      existing.evidence.push(detection.evidence);
      for (const d of detection.dataCollected) {
        if (!existing.dataCollected.includes(d)) {
          existing.dataCollected.push(d);
        }
      }
    } else {
      serviceMap.set(detection.serviceName, {
        name: detection.serviceName,
        category: detection.category,
        evidence: [detection.evidence],
        dataCollected: [...detection.dataCollected],
        isDataProcessor: detection.isDataProcessor,
      });
    }
  }

  return Array.from(serviceMap.values());
}
