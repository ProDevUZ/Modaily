import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const MAX_PRODUCT_VIDEO_SIZE = 50 * 1024 * 1024;
const allowedMimeTypes = new Map<string, string>([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/quicktime", ".mov"]
]);
const allowedExtensions = new Set([".mp4", ".webm", ".mov"]);

function normalizeExtension(extension: string) {
  return extension.toLowerCase();
}

export function getProductVideoDirectory() {
  if (process.env.UPLOAD_DIR) {
    return path.join(process.env.UPLOAD_DIR, "product-videos");
  }

  if (process.env.DATABASE_URL?.includes("/data/")) {
    return "/data/uploads/product-videos";
  }

  return path.join(process.cwd(), "public", "uploads", "product-videos");
}

export function getProductVideoUrl(filename: string) {
  return `/api/uploads/product-videos/${filename}`;
}

export async function ensureProductVideoDirectory() {
  const directory = getProductVideoDirectory();
  await mkdir(directory, { recursive: true });
  return directory;
}

export function validateProductVideoFile(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    return "Only MP4, WebM and MOV videos are allowed.";
  }

  if (file.size <= 0) {
    return "Video file is empty.";
  }

  if (file.size > MAX_PRODUCT_VIDEO_SIZE) {
    return "Video size must be 50 MB or smaller.";
  }

  return null;
}

export async function saveProductVideo(file: File) {
  const validationError = validateProductVideoFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const directory = await ensureProductVideoDirectory();
  const extension = allowedMimeTypes.get(file.type) || normalizeExtension(path.extname(file.name));
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(directory, filename), buffer);

  return {
    filename,
    url: getProductVideoUrl(filename)
  };
}

export function sanitizeProductVideoFilename(filename: string) {
  const safeName = path.basename(filename);
  const extension = normalizeExtension(path.extname(safeName));

  if (safeName !== filename || !allowedExtensions.has(extension)) {
    return null;
  }

  return safeName;
}

export function getProductVideoContentType(filename: string) {
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

export async function readProductVideo(filename: string) {
  return readFile(path.join(getProductVideoDirectory(), filename));
}

export function getProductVideoPath(filename: string) {
  return path.join(getProductVideoDirectory(), filename);
}

export { MAX_PRODUCT_VIDEO_SIZE };
