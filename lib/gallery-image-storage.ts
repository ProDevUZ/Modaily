import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const MAX_GALLERY_IMAGE_SIZE = 20 * 1024 * 1024;
const allowedMimeTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"]
]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function normalizeExtension(extension: string) {
  const normalized = extension.toLowerCase();
  return normalized === ".jpeg" ? ".jpg" : normalized;
}

export function getGalleryImageDirectory() {
  if (process.env.UPLOAD_DIR) {
    return path.join(process.env.UPLOAD_DIR, "gallery");
  }

  if (process.env.DATABASE_URL?.includes("/data/")) {
    return "/data/uploads/gallery";
  }

  return path.join(process.cwd(), "public", "uploads", "gallery");
}

export function getGalleryImageUrl(filename: string) {
  return `/api/uploads/gallery/${filename}`;
}

export async function ensureGalleryImageDirectory() {
  const directory = getGalleryImageDirectory();
  await mkdir(directory, { recursive: true });
  return directory;
}

export function validateGalleryImageFile(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    return "Only JPG, PNG, WebP and AVIF images are allowed.";
  }

  if (file.size <= 0) {
    return "Image file is empty.";
  }

  if (file.size > MAX_GALLERY_IMAGE_SIZE) {
    return "Gallery image must be 20 MB or smaller.";
  }

  return null;
}

export async function saveGalleryImage(file: File) {
  const validationError = validateGalleryImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const directory = await ensureGalleryImageDirectory();
  const extension = allowedMimeTypes.get(file.type) || normalizeExtension(path.extname(file.name));
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(directory, filename), buffer);

  return {
    filename,
    url: getGalleryImageUrl(filename)
  };
}

export function sanitizeGalleryImageFilename(filename: string) {
  const safeName = path.basename(filename);
  const extension = normalizeExtension(path.extname(safeName));

  if (safeName !== filename || !allowedExtensions.has(extension)) {
    return null;
  }

  return safeName;
}

export function getGalleryImageContentType(filename: string) {
  const extension = normalizeExtension(path.extname(filename));

  switch (extension) {
    case ".jpg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

export async function readGalleryImage(filename: string) {
  return readFile(path.join(getGalleryImageDirectory(), filename));
}

export { MAX_GALLERY_IMAGE_SIZE };
