import { config } from "dotenv";

import { cleanupExpiredDirectUploads } from "../lib/direct-uploads/server";

config({ path: ".env", quiet: true });
config({ path: ".env.local", override: true, quiet: true });

async function main() {
  const result = await cleanupExpiredDirectUploads();
  console.info("[direct-upload] cleanup completed", result);
}

main().catch((error) => {
  console.error("[direct-upload] cleanup failed", error);
  process.exit(1);
});
