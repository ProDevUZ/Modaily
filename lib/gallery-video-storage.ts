import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { saveHybridMediaFile } from "@/lib/storage/hybrid-media-storage";

const MAX_GALLERY_VIDEO_SIZE = 250 * 1024 * 1024;
const allowedMimeTypes = new Map<string, string>([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/quicktime", ".mov"]
]);
const allowedExtensions = new Set([".mp4", ".webm", ".mov"]);

function normalizeExtension(extension: string) {
  return extension.toLowerCase();
}

export function getGalleryVideoDirectory() {
  if (process.env.UPLOAD_DIR) {
    return path.join(process.env.UPLOAD_DIR, "gallery-videos");
  }

  if (process.env.DATABASE_URL?.includes("/data/")) {
    return "/data/uploads/gallery-videos";
  }

  return path.join(process.cwd(), "public", "uploads", "gallery-videos");
}

export function getGalleryVideoUrl(filename: string) {
  return `/api/uploads/gallery-videos/${filename}`;
}

export async function ensureGalleryVideoDirectory() {
  const directory = getGalleryVideoDirectory();
  await mkdir(directory, { recursive: true });
  return directory;
}

export function validateGalleryVideoFile(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    return "Only MP4, WebM and MOV videos are allowed.";
  }

  if (file.size <= 0) {
    return "Video file is empty.";
  }

  if (file.size > MAX_GALLERY_VIDEO_SIZE) {
    return "Video size must be 250 MB or smaller.";
  }

  return null;
}

async function saveGalleryVideoLocal(file: File) {
  const directory = await ensureGalleryVideoDirectory();
  const extension = allowedMimeTypes.get(file.type) || normalizeExtension(path.extname(file.name));
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(directory, filename), buffer);

  return {
    filename,
    url: getGalleryVideoUrl(filename)
  };
}

export async function saveGalleryVideo(file: File) {
  return saveHybridMediaFile({
    file,
    namespace: "gallery",
    allowedMimeTypes,
    maxSize: MAX_GALLERY_VIDEO_SIZE,
    maxSizeLabel: "250MB",
    emptyMessage: "Video file is empty.",
    mimeMessage: "Only MP4, WebM and MOV videos are allowed.",
    sizeMessage: "Video size must be 250 MB or smaller.",
    localSave: saveGalleryVideoLocal
  });
}

export function sanitizeGalleryVideoFilename(filename: string) {
  const safeName = path.basename(filename);
  const extension = normalizeExtension(path.extname(safeName));

  if (safeName !== filename || !allowedExtensions.has(extension)) {
    return null;
  }

  return safeName;
}

export function getGalleryVideoContentType(filename: string) {
  const extension = normalizeExtension(path.extname(filename));

  switch (extension) {
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}

export async function readGalleryVideo(filename: string) {
  return readFile(path.join(getGalleryVideoDirectory(), filename));
}

export function getGalleryVideoPath(filename: string) {
  return path.join(getGalleryVideoDirectory(), filename);
}

export { MAX_GALLERY_VIDEO_SIZE };
