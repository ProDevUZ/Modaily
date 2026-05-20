import { config } from "dotenv";

import { validateR2StorageConnection } from "../lib/storage/r2";

config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

function formatValidationError(error: unknown) {
  if (!(error instanceof Error)) {
    return String(error);
  }

  const cause = error.cause;
  const source = cause instanceof Error ? cause : error;
  const metadata = (source as { $metadata?: { httpStatusCode?: number } }).$metadata;
  const details = [
    error.message,
    source.name !== "Error" ? source.name : "",
    source.message !== error.message ? source.message : "",
    metadata?.httpStatusCode ? `HTTP ${metadata.httpStatusCode}` : ""
  ].filter(Boolean);

  return details.join(" - ") || "Unknown validation error";
}

async function main() {
  let passed = false;

  for (const addressingMode of ["path-style", "virtual-host"] as const) {
    console.log(`Cloudflare R2 validation mode: ${addressingMode}`);

    try {
      await validateR2StorageConnection({ debug: true, addressingMode });
      console.log(`Cloudflare R2 validation passed (${addressingMode}): put object, head object, delete object.`);
      passed = true;
    } catch (error) {
      console.warn(
        `Cloudflare R2 validation failed (${addressingMode}):`,
        formatValidationError(error)
      );
    }
  }

  if (!passed) {
    process.exitCode = 1;
  }
}

void main();
