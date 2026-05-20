import type { MediaNamespace } from "@/lib/storage/types";

export type DirectVideoUploadKind = "product-video" | "gallery-video" | "promo-video";

export type DirectUploadStatus = "pending" | "completed" | "failed" | "expired";

export type DirectUploadPolicy = {
  kind: DirectVideoUploadKind;
  namespace: MediaNamespace;
  maxSize: number;
  maxSizeLabel: string;
  allowedMimeTypes: Map<string, string>;
};

export type DirectUploadCreateRequest = {
  kind: DirectVideoUploadKind;
  filename: string;
  contentType: string;
  size: number;
};

export type DirectUploadCreateResponse = {
  ok: true;
  uploadId: string;
  uploadToken: string;
  uploadUrl: string;
  method: "PUT";
  key: string;
  publicUrl: string;
  expiresAt: string;
  headers: Record<string, string>;
  maxSize: number;
};

export type DirectUploadCompleteRequest = {
  uploadId: string;
  uploadToken: string;
};

export type DirectUploadCompleteResponse = {
  ok: true;
  url: string;
  key: string;
  hls: {
    enqueued: boolean;
    status: string | null;
    videoId: string | null;
  };
};
