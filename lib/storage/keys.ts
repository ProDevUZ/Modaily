import { randomUUID } from "crypto";
import path from "path";

import type { MediaNamespace, MediaObjectKind } from "@/lib/storage/types";

const allowedExtensions = new Set([
  ".avif",
  ".gif",
  ".jpg",
  ".jpeg",
  ".m3u8",
  ".mov",
  ".mp4",
  ".png",
  ".ts",
  ".webm",
  ".webp"
]);

const contentTypeExtensions = new Map<string, string>([
  ["application/vnd.apple.mpegurl", ".m3u8"],
  ["application/x-mpegurl", ".m3u8"],
  ["image/avif", ".avif"],
  ["image/gif", ".gif"],
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["video/mp2t", ".ts"],
  ["video/mp4", ".mp4"],
  ["video/quicktime", ".mov"],
  ["video/webm", ".webm"]
]);

export const mediaStoragePrefixes: Record<MediaObjectKind, string> = {
  originals: "originals",
  hls: "hls",
  posters: "posters",
  thumbnails: "thumbnails",
  temp: "temp"
};

function normalizeExtension(extension: string) {
  const normalized = extension.toLowerCase();
  return normalized === ".jpeg" ? ".jpg" : normalized;
}

function extensionFromFilename(filename?: string | null) {
  if (!filename) {
    return "";
  }

  return normalizeExtension(path.extname(path.basename(filename)));
}

export function getSafeStorageExtension(input: { filename?: string | null; contentType?: string | null; extension?: string | null }) {
  const explicitExtension = input.extension ? normalizeExtension(input.extension.startsWith(".") ? input.extension : `.${input.extension}`) : "";
  const contentTypeExtension = input.contentType ? contentTypeExtensions.get(input.contentType.toLowerCase()) || "" : "";
  const filenameExtension = extensionFromFilename(input.filename);
  const extension = explicitExtension || contentTypeExtension || filenameExtension;

  if (!extension || !allowedExtensions.has(extension)) {
    return null;
  }

  return extension;
}

function datePath(now: Date) {
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export function generateMediaStorageKey(input: {
  namespace: MediaNamespace;
  kind?: MediaObjectKind;
  filename?: string | null;
  contentType?: string | null;
  extension?: string | null;
  now?: Date;
}) {
  const extension = getSafeStorageExtension(input);

  if (!extension) {
    throw new Error("Unsupported or missing media file extension.");
  }

  const kind = input.kind || "originals";
  const now = input.now || new Date();
  const timestamp = now.getTime();

  return `${mediaStoragePrefixes[kind]}/${input.namespace}/${datePath(now)}/${timestamp}-${randomUUID()}${extension}`;
}

export function assertSafeStorageKey(key: string) {
  const normalized = key.trim();

  if (!normalized || normalized.startsWith("/") || normalized.includes("\\") || normalized.includes("..")) {
    throw new Error("Invalid storage key.");
  }

  return normalized;
}
