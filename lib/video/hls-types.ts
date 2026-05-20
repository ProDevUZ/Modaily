export type HlsRenditionName = "360p" | "720p" | "1080p";

export type HlsInputMetadata = {
  durationSeconds: number | null;
  width: number | null;
  height: number | null;
  bitrate: number | null;
  videoCodec: string | null;
  audioCodec: string | null;
  hasAudio: boolean;
};

export type HlsUploadedAsset = {
  key: string;
  url: string;
  contentType: string;
  sizeBytes: number;
};

export type HlsGenerationInput = {
  videoUrl: string;
  videoId?: string;
};

export type HlsGenerationResult = {
  videoId: string;
  masterPlaylistKey: string;
  masterPlaylistUrl: string;
  posterKey: string;
  posterUrl: string;
  metadata: HlsInputMetadata;
  assets: HlsUploadedAsset[];
  localWorkDir: string;
  ffmpegCommand: string[];
  ffprobeCommand: string[];
};
