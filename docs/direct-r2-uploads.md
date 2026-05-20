# Experimental Direct-to-R2 Uploads

This is a parallel experimental upload path. Existing `/api/uploads/*` routes remain the production fallback.

## Flow

1. Admin UI requests `POST /api/experimental/direct-uploads/create`.
2. Server validates origin/referer, file kind, MIME, extension, declared size and expiry.
3. Server creates `ExperimentalDirectUploadSession` and returns a short-lived presigned R2 `PUT` URL.
4. Browser uploads the MP4 directly to R2 with `XMLHttpRequest` so upload progress is visible.
5. Admin UI calls `POST /api/experimental/direct-uploads/complete`.
6. Server verifies the object with `HeadObject`, checks size and content type, marks the session completed and enqueues the existing HLS worker.
7. Existing product/gallery save flows store the returned public R2 URL in the current DB fields.

## Supported Kinds

- `product-video` -> `originals/products/...`
- `gallery-video` -> `originals/gallery/...`
- `promo-video` -> `originals/promo/...`

Only MP4 is enabled in this experimental path because the HLS worker currently accepts MP4 inputs. Legacy upload routes still handle the old accepted formats.

## Required Environment

```env
EXPERIMENTAL_DIRECT_UPLOADS_ENABLED="true"
NEXT_PUBLIC_EXPERIMENTAL_DIRECT_UPLOADS="true"
DIRECT_UPLOAD_URL_EXPIRES_SECONDS="600"
DIRECT_UPLOAD_MAX_VIDEO_BYTES="262144000"
```

The server still requires the normal Cloudflare R2 variables used by the existing storage layer.

## R2 CORS

The R2 bucket must allow browser `PUT` requests from the production admin origin. Minimum policy:

```json
[
  {
    "AllowedOrigins": ["https://modaily.uk", "https://www.modaily.uk"],
    "AllowedMethods": ["PUT", "HEAD"],
    "AllowedHeaders": [
      "content-type",
      "cache-control",
      "x-amz-meta-source",
      "x-amz-meta-uploadsessionid",
      "x-amz-meta-uploadkind"
    ],
    "ExposeHeaders": ["etag"],
    "MaxAgeSeconds": 3600
  }
]
```

Without this CORS config, the browser upload fails and the UI falls back to the legacy Next.js upload route.

## Cleanup

Expired pending sessions are marked expired and their object keys are deleted if present:

```bash
pnpm run direct-uploads:cleanup
```

There is also a protected cleanup route:

```http
POST /api/experimental/direct-uploads/cleanup
x-hls-experiment-token: <HLS_EXPERIMENT_TOKEN>
```

## Security Limits

The current project has no real admin login/session auth. This layer uses same-origin checks, admin referer checks, random per-upload tokens, short URL expiry, scoped object keys and completion verification. That is safer than an open presign endpoint, but it is not a replacement for real admin authentication.
