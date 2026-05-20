import {
  DeleteObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { assertSafeStorageKey } from "@/lib/storage/keys";
import type { ObjectStorage, StorageProviderName, StorageUploadInput, StorageUploadResult } from "@/lib/storage/types";

const provider: StorageProviderName = "r2";
type R2AddressingMode = "path-style" | "virtual-host";

function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required for Cloudflare R2 storage.`);
  }

  return value;
}

function optionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value || null;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function encodeKeyForUrl(key: string) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

async function normalizeBody(body: StorageUploadInput["body"]) {
  if (body instanceof ArrayBuffer) {
    return Buffer.from(body);
  }

  if (typeof Blob !== "undefined" && body instanceof Blob) {
    return Buffer.from(await body.arrayBuffer());
  }

  return body;
}

export function getR2Config() {
  const accountId = requireEnv("CLOUDFLARE_R2_ACCOUNT_ID");
  const bucket = requireEnv("CLOUDFLARE_R2_BUCKET");
  const accessKeyId = requireEnv("CLOUDFLARE_R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY");
  const publicBaseUrl = optionalEnv("CLOUDFLARE_R2_PUBLIC_BASE_URL");
  const endpoint = trimTrailingSlash(optionalEnv("CLOUDFLARE_R2_ENDPOINT") || `https://${accountId}.r2.cloudflarestorage.com`);
  const region = optionalEnv("CLOUDFLARE_R2_REGION") || "auto";
  const forcePathStyle = optionalEnv("CLOUDFLARE_R2_FORCE_PATH_STYLE") === "true";

  return {
    accountId,
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: publicBaseUrl ? trimTrailingSlash(publicBaseUrl) : null,
    endpoint,
    region,
    forcePathStyle
  };
}

function forcePathStyleForMode(config: ReturnType<typeof getR2Config>, mode?: R2AddressingMode) {
  if (mode === "path-style") {
    return true;
  }

  if (mode === "virtual-host") {
    return false;
  }

  return config.forcePathStyle;
}

export function createR2Client(options: { addressingMode?: R2AddressingMode } = {}) {
  const config = getR2Config();

  return new S3Client({
    region: config.region,
    endpoint: config.endpoint,
    forcePathStyle: forcePathStyleForMode(config, options.addressingMode),
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });
}

function maskEndpointHostname(hostname: string) {
  const parts = hostname.split(".");

  if (parts.length < 4 || !parts.includes("r2") || !parts.includes("cloudflarestorage")) {
    return hostname;
  }

  const account = parts[0] || "";
  const maskedAccount = account.length <= 8 ? "***" : `${account.slice(0, 4)}...${account.slice(-4)}`;

  return [maskedAccount, ...parts.slice(1)].join(".");
}

export function getR2DebugSummary(options: { addressingMode?: R2AddressingMode } = {}) {
  const config = getR2Config();
  const endpointUrl = new URL(config.endpoint);
  const endpointHostname = endpointUrl.hostname;
  const forcePathStyle = forcePathStyleForMode(config, options.addressingMode);
  const addressingMode = forcePathStyle ? "path-style" : "virtual-host";
  const pathStyleTarget = `${endpointUrl.protocol}//${maskEndpointHostname(endpointHostname)}/${config.bucket}`;
  const virtualHostTarget = `${endpointUrl.protocol}//${config.bucket}.${maskEndpointHostname(endpointHostname)}`;

  return {
    bucket: config.bucket,
    endpointHostname: maskEndpointHostname(endpointHostname),
    region: config.region,
    addressingMode,
    forcePathStyle,
    requestTarget: forcePathStyle ? pathStyleTarget : virtualHostTarget,
    publicBaseUrlConfigured: Boolean(config.publicBaseUrl)
  };
}

async function checkConfiguredBucketVisibility(client: S3Client, bucket: string) {
  try {
    const response = await client.send(new ListBucketsCommand({}));
    const bucketNames = response.Buckets?.map((entry) => entry.Name).filter((name): name is string => Boolean(name)) || [];

    return {
      checked: true,
      bucketVisible: bucketNames.includes(bucket),
      bucketCount: bucketNames.length
    };
  } catch (error) {
    return {
      checked: false,
      bucketVisible: false,
      bucketCount: 0,
      error
    };
  }
}

async function checkConfiguredBucketAccess(client: S3Client, bucket: string) {
  try {
    await client.send(
      new HeadBucketCommand({
        Bucket: bucket
      })
    );

    return {
      checked: true,
      accessible: true
    };
  } catch (error) {
    return {
      checked: true,
      accessible: false,
      error
    };
  }
}

export function createR2Storage(options: { addressingMode?: R2AddressingMode } = {}): ObjectStorage {
  const config = getR2Config();
  const client = createR2Client(options);

  return {
    provider,
    getPublicUrl(key: string) {
      const safeKey = assertSafeStorageKey(key);
      if (!config.publicBaseUrl) {
        throw new Error("CLOUDFLARE_R2_PUBLIC_BASE_URL is required to create public media URLs.");
      }

      return `${config.publicBaseUrl}/${encodeKeyForUrl(safeKey)}`;
    },
    async uploadObject(input: StorageUploadInput): Promise<StorageUploadResult> {
      const key = assertSafeStorageKey(input.key);

      await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: await normalizeBody(input.body),
          ContentType: input.contentType,
          CacheControl: input.cacheControl,
          Metadata: input.metadata
        })
      );

      return {
        key,
        url: config.publicBaseUrl ? this.getPublicUrl(key) : "",
        provider
      };
    },
    async deleteObject(key: string) {
      const safeKey = assertSafeStorageKey(key);

      await client.send(
        new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: safeKey
        })
      );
    }
  };
}

export async function headR2Object(key: string, options: { addressingMode?: R2AddressingMode } = {}) {
  const config = getR2Config();
  const client = createR2Client(options);
  const safeKey = assertSafeStorageKey(key);

  return client.send(
    new HeadObjectCommand({
      Bucket: config.bucket,
      Key: safeKey
    })
  );
}

export async function createR2PresignedPutUrl(input: {
  key: string;
  contentType: string;
  expiresInSeconds: number;
  metadata?: Record<string, string>;
}) {
  const config = getR2Config();
  const client = createR2Client();
  const key = assertSafeStorageKey(input.key);

  return getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ContentType: input.contentType,
      CacheControl: "public, max-age=31536000, immutable",
      Metadata: input.metadata
    }),
    {
      expiresIn: input.expiresInSeconds
    }
  );
}

export async function validateR2StorageConnection(options: { debug?: boolean; addressingMode?: R2AddressingMode } = {}) {
  const config = getR2Config();
  const client = createR2Client({ addressingMode: options.addressingMode });
  const storage = createR2Storage({ addressingMode: options.addressingMode });
  const validationKey = `temp/system/r2-validation-${Date.now()}.txt`;
  let validationError: Error | null = null;

  if (options.debug) {
    const summary = getR2DebugSummary({ addressingMode: options.addressingMode });
    console.info("[storage] R2 target", {
      bucket: summary.bucket,
      endpointHostname: summary.endpointHostname,
      region: summary.region,
      addressingMode: summary.addressingMode,
      forcePathStyle: summary.forcePathStyle,
      requestTarget: summary.requestTarget,
      publicBaseUrlConfigured: summary.publicBaseUrlConfigured
    });
    const bucketAccess = await checkConfiguredBucketAccess(client, config.bucket);
    const visibility = await checkConfiguredBucketVisibility(client, config.bucket);

    console.info("[storage] R2 bucket introspection", {
      headBucket: {
        checked: bucketAccess.checked,
        accessible: bucketAccess.accessible
      },
      listBuckets: {
        checked: visibility.checked,
        configuredBucketVisible: visibility.bucketVisible,
        accessibleBucketCount: visibility.bucketCount
      },
      blockingValidation: false
    });
  }

  try {
    await storage.uploadObject({
      key: validationKey,
      body: "modaily-r2-validation",
      contentType: "text/plain",
      cacheControl: "no-store",
      metadata: {
        purpose: "modaily-r2-validation"
      }
    });

    if (options.debug) {
      console.info("[storage] R2 PutObject passed", {
        key: validationKey
      });
    }
  } catch (error) {
    validationError = new Error("temp upload failed", { cause: error });
  }

  if (!validationError) {
    try {
      await headR2Object(validationKey, { addressingMode: options.addressingMode });

      if (options.debug) {
        console.info("[storage] R2 HeadObject passed", {
          key: validationKey
        });
      }
    } catch (error) {
      validationError = new Error("object existence check failed", { cause: error });
    }
  }

  try {
    await storage.deleteObject(validationKey);

    if (options.debug) {
      console.info("[storage] R2 DeleteObject passed", {
        key: validationKey
      });
    }
  } catch (error) {
    if (validationError) {
      throw new Error(`${validationError.message}; temp delete also failed`, { cause: validationError.cause });
    }

    validationError = new Error("temp delete failed", { cause: error });
  }

  if (validationError) {
    throw validationError;
  }
}
