import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const MAX_PRODUCT_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedMimeTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"]
]);
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function normalizeExtension(extension: string) {
  const normalized = extension.toLowerCase();
  return normalized === ".jpeg" ? ".jpg" : normalized;
}

export function getProductImageDirectory() {
  if (process.env.UPLOAD_DIR) {
    return path.join(process.env.UPLOAD_DIR, "products");
  }

  if (process.env.DATABASE_URL?.includes("/data/")) {
    return "/data/uploads/products";
  }

  return path.join(process.cwd(), "public", "uploads", "products");
}

export function getProductImageUrl(filename: string) {
  return `/api/uploads/products/${filename}`;
}

export async function ensureProductImageDirectory() {
  const directory = getProductImageDirectory();
  await mkdir(directory, { recursive: true });
  return directory;
}

export function validateProductImageFile(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    return "Only JPG, PNG and WebP images are allowed.";
  }

  if (file.size <= 0) {
    return "Image file is empty.";
  }

  if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
    return "Image size must be 5 MB or smaller.";
  }

  return null;
}

export async function saveProductImage(file: File) {
  const validationError = validateProductImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const directory = await ensureProductImageDirectory();
  const extension = allowedMimeTypes.get(file.type) || normalizeExtension(path.extname(file.name));
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path.join(directory, filename), buffer);

  return {
    filename,
    url: getProductImageUrl(filename)
  };
}

export function sanitizeProductImageFilename(filename: string) {
  const safeName = path.basename(filename);
  const extension = normalizeExtension(path.extname(safeName));

  if (safeName !== filename || !allowedExtensions.has(extension)) {
    return null;
  }

  return safeName;
}

export function getProductImageContentType(filename: string) {
  const extension = normalizeExtension(path.extname(filename));

  switch (extension) {
    case ".jpg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function readProductImage(filename: string) {
  return readFile(path.join(getProductImageDirectory(), filename));
}

export { MAX_PRODUCT_IMAGE_SIZE };
