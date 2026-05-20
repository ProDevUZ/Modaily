"use client";

import type {
  DirectUploadCompleteResponse,
  DirectUploadCreateResponse,
  DirectVideoUploadKind
} from "@/lib/direct-uploads/types";

type DirectVideoUploadInput = {
  file: File;
  kind: DirectVideoUploadKind;
  fallbackEndpoint: string;
  onProgress?: (progress: number) => void;
};

type UploadResult = {
  url: string;
  direct: boolean;
  hlsVideoId?: string | null;
};

function directUploadsEnabled() {
  return process.env.NEXT_PUBLIC_EXPERIMENTAL_DIRECT_UPLOADS === "true";
}

async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || "Request failed");
  }

  return (await response.json()) as T;
}

function isDirectUploadCandidate(file: File) {
  return file.type === "video/mp4" && file.name.toLowerCase().endsWith(".mp4");
}

async function uploadViaLegacyRoute(file: File, endpoint: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const payload = await requestJson<{ url: string }>(endpoint, {
    method: "POST",
    body: formData
  });

  return {
    url: payload.url,
    direct: false
  };
}

function putFileToSignedUrl(input: {
  file: File;
  uploadUrl: string;
  headers: Record<string, string>;
  onProgress?: (progress: number) => void;
}) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", input.uploadUrl);

    Object.entries(input.headers).forEach(([name, value]) => {
      xhr.setRequestHeader(name, value);
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && input.onProgress) {
        input.onProgress(Math.min(90, Math.round((event.loaded / event.total) * 90)));
      }
    };

    xhr.onerror = () => reject(new Error("Direct R2 upload failed."));
    xhr.ontimeout = () => reject(new Error("Direct R2 upload timed out."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      reject(new Error(`Direct R2 upload failed with HTTP ${xhr.status}.`));
    };

    xhr.timeout = 15 * 60 * 1000;
    xhr.send(input.file);
  });
}

async function completeUploadWithRetry(uploadId: string, uploadToken: string) {
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await requestJson<DirectUploadCompleteResponse>("/api/experimental/direct-uploads/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uploadId,
          uploadToken
        })
      });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => window.setTimeout(resolve, 600 * (attempt + 1)));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Direct upload completion failed.");
}

export async function uploadVideoWithDirectR2Fallback({
  file,
  kind,
  fallbackEndpoint,
  onProgress
}: DirectVideoUploadInput): Promise<UploadResult> {
  onProgress?.(0);

  if (!directUploadsEnabled() || !isDirectUploadCandidate(file)) {
    const legacy = await uploadViaLegacyRoute(file, fallbackEndpoint);
    onProgress?.(100);
    return legacy;
  }

  let session: DirectUploadCreateResponse | null = null;

  try {
    session = await requestJson<DirectUploadCreateResponse>("/api/experimental/direct-uploads/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind,
        filename: file.name,
        contentType: file.type,
        size: file.size
      })
    });
  } catch (error) {
    console.warn("[direct-upload] falling back to legacy upload route", error);
    const legacy = await uploadViaLegacyRoute(file, fallbackEndpoint);
    onProgress?.(100);
    return legacy;
  }

  try {
    await putFileToSignedUrl({
      file,
      uploadUrl: session.uploadUrl,
      headers: session.headers,
      onProgress
    });
  } catch (error) {
    console.warn("[direct-upload] R2 PUT failed; falling back to legacy upload route", error);
    const legacy = await uploadViaLegacyRoute(file, fallbackEndpoint);
    onProgress?.(100);
    return legacy;
  }

  const completed = await completeUploadWithRetry(session.uploadId, session.uploadToken);
  onProgress?.(100);

  return {
    url: completed.url,
    direct: true,
    hlsVideoId: completed.hls.videoId
  };
}
