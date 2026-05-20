export type StorageProviderName = "r2";

export type MediaNamespace = "products" | "blog" | "gallery" | "promo";

export type MediaObjectKind = "originals" | "hls" | "posters" | "thumbnails" | "temp";

export type StorageObjectBody = Buffer | Uint8Array | ArrayBuffer | Blob | string;

export type StorageUploadInput = {
  key: string;
  body: StorageObjectBody;
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
};

export type StorageUploadResult = {
  key: string;
  url: string;
  provider: StorageProviderName;
};

export type ObjectStorage = {
  readonly provider: StorageProviderName;
  uploadObject(input: StorageUploadInput): Promise<StorageUploadResult>;
  deleteObject(key: string): Promise<void>;
  getPublicUrl(key: string): string;
};
