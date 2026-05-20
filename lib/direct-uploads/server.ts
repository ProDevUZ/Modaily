import { createHash, randomBytes, randomUUID, timingSafeEqual } from "crypto";

import { prisma } from "@/lib/prisma";
import { generateMediaStorageKey } from "@/lib/storage/keys";
import { createR2PresignedPutUrl, createR2Storage, headR2Object } from "@/lib/storage/r2";
import { enqueueHlsJob } from "@/lib/video/hls-jobs";
import type {
  DirectUploadCompleteResponse,
  DirectUploadCreateRequest,
  DirectUploadCreateResponse,
  DirectUploadPolicy,
  DirectVideoUploadKind
} from "@/lib/direct-uploads/types";

const DIRECT_UPLOAD_SOURCE = "modaily-direct-upload";
const DEFAULT_EXPIRES_SECONDS = 10 * 60;
const DEFAULT_MAX_VIDEO_SIZE = 250 * 1024 * 1024;

const videoMimeTypes = new Map<string, string>([["video/mp4", ".mp4"]]);

const policies: Record<DirectVideoUploadKind, DirectUploadPolicy> = {
  "product-video": {
    kind: "product-video",
    namespace: "products",
    maxSize: getConfiguredMaxBytes("DIRECT_UPLOAD_PRODUCT_VIDEO_MAX_BYTES"),
    maxSizeLabel: "250 MB",
    allowedMimeTypes: videoMimeTypes
  },
  "gallery-video": {
    kind: "gallery-video",
    namespace: "gallery",
    maxSize: getConfiguredMaxBytes("DIRECT_UPLOAD_GALLERY_VIDEO_MAX_BYTES"),
    maxSizeLabel: "250 MB",
    allowedMimeTypes: videoMimeTypes
  },
  "promo-video": {
    kind: "promo-video",
    namespace: "promo",
    maxSize: getConfiguredMaxBytes("DIRECT_UPLOAD_PROMO_VIDEO_MAX_BYTES"),
    maxSizeLabel: "250 MB",
    allowedMimeTypes: videoMimeTypes
  }
};

function getConfiguredMaxBytes(name: string) {
  const value = Number(process.env[name] || process.env.DIRECT_UPLOAD_MAX_VIDEO_BYTES);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_MAX_VIDEO_SIZE;
}

function getExpiresSeconds() {
  const value = Number(process.env.DIRECT_UPLOAD_URL_EXPIRES_SECONDS);
  if (!Number.isFinite(value) || value <= 0) {
    return DEFAULT_EXPIRES_SECONDS;
  }

  return Math.min(Math.floor(value), 60 * 60);
}

export function isDirectUploadsEnabled() {
  return process.env.EXPERIMENTAL_DIRECT_UPLOADS_ENABLED?.trim().toLowerCase() === "true";
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function verifyTokenHash(token: string, expectedHash: string) {
  const actual = Buffer.from(sha256(token), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function normalizeFilename(filename: string) {
  const value = filename.trim();
  if (!value || value.length > 180) {
    throw new Error("A valid filename is required.");
  }

  return value;
}

function normalizeContentType(contentType: string) {
  return contentType.trim().toLowerCase();
}

function normalizeSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error("A valid file size is required.");
  }

  return Math.floor(size);
}

function getPolicy(kind: string) {
  const policy = policies[kind as DirectVideoUploadKind];
  if (!policy) {
    throw new Error("Unsupported direct upload kind.");
  }

  return policy;
}

function assertAllowedFile(input: DirectUploadCreateRequest, policy: DirectUploadPolicy) {
  const filename = normalizeFilename(input.filename);
  const contentType = normalizeContentType(input.contentType);
  const size = normalizeSize(input.size);
  const expectedExtension = policy.allowedMimeTypes.get(contentType);

  if (!expectedExtension) {
    throw new Error("Only MP4 video uploads are supported by experimental direct upload.");
  }

  if (!filename.toLowerCase().endsWith(expectedExtension)) {
    throw new Error("File extension does not match its MIME type.");
  }

  if (size > policy.maxSize) {
    throw new Error(`Video size must be ${policy.maxSizeLabel} or smaller.`);
  }

  return {
    filename,
    contentType,
    size,
    expectedExtension
  };
}

export function assertDirectUploadRequestAllowed(request: Request) {
  if (!isDirectUploadsEnabled()) {
    throw new Error("Experimental direct uploads are disabled.");
  }

  const requestOrigin = getExternalRequestOrigin(request);
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin && origin !== requestOrigin) {
    throw new Error("Direct upload request origin is not allowed.");
  }

  if (!referer) {
    throw new Error("Direct upload request referer is required.");
  }

  const refererUrl = new URL(referer);
  if (refererUrl.origin !== requestOrigin || !refererUrl.pathname.startsWith("/admin123")) {
    throw new Error("Direct uploads are only allowed from the admin interface.");
  }
}

function getExternalRequestOrigin(request: Request) {
  const url = new URL(request.url);
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || url.host;
  const protocol = forwardedProto || url.protocol.replace(":", "");

  return `${protocol}://${host}`;
}

export async function createDirectUploadSession(input: DirectUploadCreateRequest): Promise<DirectUploadCreateResponse> {
  const policy = getPolicy(input.kind);
  const file = assertAllowedFile(input, policy);
  const expiresInSeconds = getExpiresSeconds();
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
  const uploadToken = randomBytes(32).toString("hex");
  const key = generateMediaStorageKey({
    namespace: policy.namespace,
    kind: "originals",
    filename: file.filename,
    contentType: file.contentType,
    extension: file.expectedExtension
  });
  const storage = createR2Storage();
  const publicUrl = storage.getPublicUrl(key);
  const session = await prisma.experimentalDirectUploadSession.create({
    data: {
      uploadTokenHash: sha256(uploadToken),
      kind: policy.kind,
      namespace: policy.namespace,
      objectKey: key,
      publicUrl,
      originalName: file.filename,
      contentType: file.contentType,
      declaredSize: file.size,
      status: "pending",
      expiresAt
    }
  });
  const metadata = {
    source: DIRECT_UPLOAD_SOURCE,
    uploadSessionId: session.id,
    uploadKind: policy.kind
  };
  const uploadUrl = await createR2PresignedPutUrl({
    key,
    contentType: file.contentType,
    expiresInSeconds,
    metadata
  });

  console.info("[direct-upload] signed upload created", {
    uploadId: session.id,
    kind: policy.kind,
    key,
    size: file.size,
    expiresAt: expiresAt.toISOString()
  });

  return {
    ok: true,
    uploadId: session.id,
    uploadToken,
    uploadUrl,
    method: "PUT",
    key,
    publicUrl,
    expiresAt: expiresAt.toISOString(),
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "x-amz-meta-source": DIRECT_UPLOAD_SOURCE,
      "x-amz-meta-uploadsessionid": session.id,
      "x-amz-meta-uploadkind": policy.kind
    },
    maxSize: policy.maxSize
  };
}

export async function completeDirectUploadSession(input: {
  uploadId: string;
  uploadToken: string;
}): Promise<DirectUploadCompleteResponse> {
  const session = await prisma.experimentalDirectUploadSession.findUnique({
    where: { id: input.uploadId }
  });

  if (!session || !verifyTokenHash(input.uploadToken, session.uploadTokenHash)) {
    throw new Error("Invalid upload session.");
  }

  if (session.status === "completed") {
    return {
      ok: true,
      url: session.publicUrl,
      key: session.objectKey,
      hls: {
        enqueued: false,
        status: "duplicate",
        videoId: session.hlsJobId
      }
    };
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await failSession(session.id, "Upload session expired.");
    throw new Error("Upload session expired.");
  }

  let head;
  try {
    head = await headR2Object(session.objectKey);
  } catch (error) {
    await failSession(session.id, "Uploaded object was not found in R2.");
    throw new Error("Uploaded object was not found in R2.", { cause: error });
  }

  const actualSize = Number(head.ContentLength || 0);
  const actualContentType = head.ContentType?.toLowerCase() || "";

  if (actualSize !== session.declaredSize || actualSize <= 0) {
    await deleteUnsafeUpload(session.objectKey);
    await failSession(session.id, "Uploaded object size does not match the signed session.");
    throw new Error("Uploaded object size does not match the signed session.");
  }

  if (actualContentType !== session.contentType.toLowerCase()) {
    await deleteUnsafeUpload(session.objectKey);
    await failSession(session.id, "Uploaded object content type does not match the signed session.");
    throw new Error("Uploaded object content type does not match the signed session.");
  }

  await prisma.experimentalDirectUploadSession.update({
    where: { id: session.id },
    data: {
      status: "completed",
      completedAt: new Date(),
      verifiedAt: new Date(),
      errorMessage: null
    }
  });

  let hls:
    | {
        enqueued: boolean;
        status: string | null;
        videoId: string | null;
      }
    | null = null;

  try {
    const videoId = `direct-${session.id}-${randomUUID().slice(0, 8)}`;
    const enqueued = await enqueueHlsJob({
      videoUrl: session.publicUrl,
      videoId
    });

    await prisma.experimentalDirectUploadSession.update({
      where: { id: session.id },
      data: {
        hlsJobId: enqueued.job.videoId,
        errorMessage: null
      }
    });

    hls = {
      enqueued: enqueued.created || enqueued.retried || enqueued.duplicate,
      status: enqueued.job.status,
      videoId: enqueued.job.videoId
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "HLS enqueue failed.";

    await prisma.experimentalDirectUploadSession.update({
      where: { id: session.id },
      data: {
        errorMessage: `Upload completed; HLS enqueue failed: ${message}`.slice(0, 1000)
      }
    });

    console.warn("[direct-upload] upload completed but HLS enqueue failed", {
      uploadId: session.id,
      key: session.objectKey,
      error: message
    });

    hls = {
      enqueued: false,
      status: "enqueue_failed",
      videoId: null
    };
  }

  console.info("[direct-upload] upload completed", {
    uploadId: session.id,
    kind: session.kind,
    key: session.objectKey,
    hlsVideoId: hls.videoId,
    hlsEnqueued: hls.enqueued
  });

  return {
    ok: true,
    url: session.publicUrl,
    key: session.objectKey,
    hls
  };
}

async function failSession(id: string, message: string) {
  await prisma.experimentalDirectUploadSession.update({
    where: { id },
    data: {
      status: "failed",
      errorMessage: message.slice(0, 1000)
    }
  });
}

async function deleteUnsafeUpload(key: string) {
  try {
    await createR2Storage().deleteObject(key);
  } catch (error) {
    console.warn("[direct-upload] failed to delete rejected upload", {
      key,
      error: error instanceof Error ? error.message : "Unknown delete error"
    });
  }
}

export async function cleanupExpiredDirectUploads() {
  const now = new Date();
  const expired = await prisma.experimentalDirectUploadSession.findMany({
    where: {
      status: "pending",
      expiresAt: {
        lt: now
      }
    },
    take: 50,
    orderBy: {
      expiresAt: "asc"
    }
  });

  for (const session of expired) {
    await deleteUnsafeUpload(session.objectKey);
    await prisma.experimentalDirectUploadSession.update({
      where: { id: session.id },
      data: {
        status: "expired",
        errorMessage: "Upload session expired before completion."
      }
    });
  }

  return {
    expired: expired.length
  };
}
