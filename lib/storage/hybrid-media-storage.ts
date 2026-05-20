import path from "path";

import { generateMediaStorageKey } from "@/lib/storage/keys";
import { createR2Storage, validateR2StorageConnection } from "@/lib/storage/r2";
import type { MediaNamespace } from "@/lib/storage/types";

type SaveLocalFile = (file: File) => Promise<{ filename: string; url: string }>;

type SaveHybridMediaFileInput = {
  file: File;
  namespace: MediaNamespace;
  allowedMimeTypes: Map<string, string>;
  maxSize: number;
  maxSizeLabel: string;
  emptyMessage: string;
  mimeMessage: string;
  sizeMessage: string;
  localSave: SaveLocalFile;
};

const r2ValidationState: {
  promise: Promise<boolean> | null;
  warned: boolean;
} = {
  promise: null,
  warned: false
};

function normalizeExtension(extension: string) {
  const normalized = extension.toLowerCase();
  return normalized === ".jpeg" ? ".jpg" : normalized;
}

function getFilenameExtension(filename: string) {
  return normalizeExtension(path.extname(path.basename(filename)));
}

function extensionsMatch(fileExtension: string, expectedExtension: string) {
  return normalizeExtension(fileExtension) === normalizeExtension(expectedExtension);
}

async function getFileHeader(file: File, byteLength = 16) {
  const header = file.slice(0, byteLength);
  return new Uint8Array(await header.arrayBuffer());
}

function looksLikeJpeg(header: Uint8Array) {
  return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
}

function looksLikePng(header: Uint8Array) {
  return header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
}

function looksLikeWebp(header: Uint8Array) {
  return (
    header[0] === 0x52 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x46 &&
    header[8] === 0x57 &&
    header[9] === 0x45 &&
    header[10] === 0x42 &&
    header[11] === 0x50
  );
}

function looksLikeAvif(header: Uint8Array) {
  return header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70;
}

function looksLikeMp4OrMov(header: Uint8Array) {
  return header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70;
}

function looksLikeWebm(header: Uint8Array) {
  return header[0] === 0x1a && header[1] === 0x45 && header[2] === 0xdf && header[3] === 0xa3;
}

async function validateFileSignature(file: File) {
  const header = await getFileHeader(file);

  switch (file.type) {
    case "image/jpeg":
      return looksLikeJpeg(header);
    case "image/png":
      return looksLikePng(header);
    case "image/webp":
      return looksLikeWebp(header);
    case "image/avif":
      return looksLikeAvif(header);
    case "video/mp4":
    case "video/quicktime":
      return looksLikeMp4OrMov(header);
    case "video/webm":
      return looksLikeWebm(header);
    default:
      return true;
  }
}

export async function validateHybridMediaFile({
  file,
  allowedMimeTypes,
  maxSize,
  emptyMessage,
  mimeMessage,
  sizeMessage
}: Omit<SaveHybridMediaFileInput, "namespace" | "localSave" | "maxSizeLabel">) {
  const expectedExtension = allowedMimeTypes.get(file.type);

  if (!expectedExtension) {
    return mimeMessage;
  }

  if (file.size <= 0) {
    return emptyMessage;
  }

  if (file.size > maxSize) {
    return sizeMessage;
  }

  const fileExtension = getFilenameExtension(file.name);

  if (fileExtension && !Array.from(allowedMimeTypes.values()).some((extension) => extensionsMatch(fileExtension, extension))) {
    return "File extension is not supported.";
  }

  if (fileExtension && !extensionsMatch(fileExtension, expectedExtension)) {
    return "File extension does not match its MIME type.";
  }

  if (!(await validateFileSignature(file))) {
    return "File content does not match its MIME type.";
  }

  return null;
}

export function isR2StorageEnabled() {
  return process.env.MEDIA_STORAGE_PROVIDER?.trim().toLowerCase() === "r2";
}

async function ensureR2ReadyForUpload() {
  if (!process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.trim()) {
    if (!r2ValidationState.warned) {
      console.warn("[storage] CLOUDFLARE_R2_PUBLIC_BASE_URL is missing; falling back to legacy local uploads.");
      r2ValidationState.warned = true;
    }

    return false;
  }

  if (!r2ValidationState.promise) {
    r2ValidationState.promise = validateR2StorageConnection()
      .then(() => true)
      .catch((error) => {
        if (!r2ValidationState.warned) {
          console.warn(
            "[storage] Cloudflare R2 validation failed; falling back to legacy local uploads.",
            error instanceof Error ? error.message : error
          );
          r2ValidationState.warned = true;
        }

        return false;
      });
  }

  return r2ValidationState.promise;
}

export async function saveHybridMediaFile(input: SaveHybridMediaFileInput) {
  const validationError = await validateHybridMediaFile(input);

  if (validationError) {
    throw new Error(validationError);
  }

  if (!isR2StorageEnabled()) {
    return input.localSave(input.file);
  }

  const r2Ready = await ensureR2ReadyForUpload();

  if (!r2Ready) {
    return input.localSave(input.file);
  }

  try {
    const storage = createR2Storage();
    const expectedExtension = input.allowedMimeTypes.get(input.file.type);
    const key = generateMediaStorageKey({
      namespace: input.namespace,
      kind: "originals",
      filename: input.file.name,
      contentType: input.file.type,
      extension: expectedExtension
    });

    const uploaded = await storage.uploadObject({
      key,
      body: Buffer.from(await input.file.arrayBuffer()),
      contentType: input.file.type,
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        source: "modaily-upload",
        maxSize: input.maxSizeLabel
      }
    });

    return {
      filename: key,
      url: uploaded.url
    };
  } catch (error) {
    console.warn(
      "[storage] Cloudflare R2 upload failed; falling back to legacy local uploads.",
      error instanceof Error ? error.message : error
    );

    return input.localSave(input.file);
  }
}
