import { createR2Storage } from "@/lib/storage/r2";
import type { ObjectStorage } from "@/lib/storage/types";

export * from "@/lib/storage/keys";
export * from "@/lib/storage/hybrid-media-storage";
export * from "@/lib/storage/r2";
export * from "@/lib/storage/types";

export function createObjectStorage(): ObjectStorage {
  const provider = process.env.MEDIA_STORAGE_PROVIDER?.trim().toLowerCase();

  if (!provider || provider === "r2") {
    return createR2Storage();
  }

  throw new Error(`Unsupported media storage provider: ${provider}`);
}
