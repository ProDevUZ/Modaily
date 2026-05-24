"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type VideoHTMLAttributes
} from "react";
import type Hls from "hls.js";

type HlsPlaybackStatus = "idle" | "loading" | "mp4_only" | "pending" | "processing" | "ready" | "failed" | "fallback";

type HlsPlaybackLookup = {
  status: HlsPlaybackStatus;
  hlsUrl: string | null;
  posterUrl: string | null;
  videoId?: string;
};

export type HlsVideoState = {
  status: HlsPlaybackStatus;
  usingHls: boolean;
  effectiveUrl: string | null;
  posterUrl: string | null;
};

type HlsVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster"> & {
  mp4Url?: string | null;
  poster?: string | null;
  enableHls?: boolean;
  pauseWhenHidden?: boolean;
  onHlsStateChange?: (state: HlsVideoState) => void;
};

function logVideo(message: string, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.info(`[hls-video] ${message}`, data || {});
}

function canPlayNativeHls(video: HTMLVideoElement) {
  return Boolean(
    video.canPlayType("application/vnd.apple.mpegurl") ||
      video.canPlayType("application/x-mpegURL")
  );
}

async function loadHlsConstructor() {
  const mod = await import("hls.js");
  return mod.default;
}

type NetworkInformationLike = {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
};

function getNetworkInformation() {
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };

  return nav.connection || nav.mozConnection || nav.webkitConnection || null;
}

function isSmallScreen() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

function getStartupLevelHint() {
  const connection = getNetworkInformation();
  const effectiveType = connection?.effectiveType || "";

  if (connection?.saveData || effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g") {
    return 0;
  }

  if (isSmallScreen()) {
    return 0;
  }

  if (typeof connection?.downlink === "number" && connection.downlink > 6) {
    return 1;
  }

  return 0;
}

function clampStartupLevel(levelCount: number) {
  if (levelCount <= 0) {
    return -1;
  }

  return Math.min(getStartupLevelHint(), levelCount - 1);
}

function getCanonicalPlaybackBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "https://modaily.uk";
}

function normalizePlaybackLookupUrl(videoUrl: string) {
  const trimmed = videoUrl.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/api/uploads/")) {
    return new URL(trimmed, getCanonicalPlaybackBaseUrl()).toString();
  }

  return trimmed;
}

export const HlsVideo = forwardRef<HTMLVideoElement, HlsVideoProps>(function HlsVideo(
  {
    mp4Url,
    poster,
    enableHls = true,
    pauseWhenHidden = true,
    onHlsStateChange,
    onError,
    onLoadedMetadata,
    onPlay,
    onPause,
    ...videoProps
  },
  forwardedRef
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const onHlsStateChangeRef = useRef(onHlsStateChange);
  const resumeWhenVisibleRef = useRef(false);
  const [lookup, setLookup] = useState<HlsPlaybackLookup>({
    status: "idle",
    hlsUrl: null,
    posterUrl: null
  });
  const [fallbackToMp4, setFallbackToMp4] = useState(false);
  const hlsUrl = !fallbackToMp4 && lookup.status === "ready" ? lookup.hlsUrl : null;
  const effectivePoster = lookup.posterUrl || poster || undefined;
  const shouldHoldForProcessing = !fallbackToMp4 && (lookup.status === "pending" || lookup.status === "processing");
  const effectiveUrl = shouldHoldForProcessing ? null : hlsUrl || mp4Url || null;
  const usingHls = Boolean(hlsUrl && effectiveUrl === hlsUrl);

  useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement, []);

  useEffect(() => {
    onHlsStateChangeRef.current = onHlsStateChange;
  }, [onHlsStateChange]);

  useEffect(() => {
    let cancelled = false;

    setFallbackToMp4(false);

    if (!mp4Url || !enableHls) {
      setLookup({ status: "mp4_only", hlsUrl: null, posterUrl: null });
      return;
    }

    setLookup((current) => ({
      ...current,
      status: "loading"
    }));

    const playbackLookupUrl = normalizePlaybackLookupUrl(mp4Url);

    logVideo("playback lookup requested", {
      inputUrl: mp4Url,
      lookupUrl: playbackLookupUrl
    });

    fetch(`/api/experimental/hls/playback?videoUrl=${encodeURIComponent(playbackLookupUrl)}`, {
      cache: "no-store"
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: HlsPlaybackLookup | null) => {
        if (cancelled) {
          return;
        }

        if (!payload) {
          setLookup({ status: "mp4_only", hlsUrl: null, posterUrl: null });
          return;
        }

        setLookup({
          status: payload.status,
          hlsUrl: payload.hlsUrl,
          posterUrl: payload.posterUrl,
          videoId: payload.videoId
        });
        logVideo("playback lookup resolved", {
          status: payload.status,
          videoId: payload.videoId,
          hasHls: Boolean(payload.hlsUrl)
        });
      })
      .catch((error) => {
        if (!cancelled) {
          setLookup({ status: "mp4_only", hlsUrl: null, posterUrl: null });
          logVideo("playback lookup failed, falling back to mp4", { error: String(error) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enableHls, mp4Url]);

  useEffect(() => {
    onHlsStateChangeRef.current?.({
      status: fallbackToMp4 ? "fallback" : lookup.status,
      usingHls,
      effectiveUrl,
      posterUrl: effectivePoster || null
    });
  }, [effectivePoster, effectiveUrl, fallbackToMp4, lookup.status, usingHls]);

  useEffect(() => {
    const video = videoRef.current;

    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (!video) {
      return;
    }

    if (!effectiveUrl) {
      video.removeAttribute("src");
      video.load();
      return;
    }

    if (!usingHls) {
      video.src = effectiveUrl;
      return;
    }

    if (canPlayNativeHls(video)) {
      video.src = effectiveUrl;
      logVideo("using native hls", { url: effectiveUrl });
      return;
    }

    let cancelled = false;

    loadHlsConstructor()
      .then((HlsConstructor) => {
        if (cancelled || !videoRef.current) {
          return;
        }

        if (!HlsConstructor.isSupported()) {
          setFallbackToMp4(true);
          logVideo("hls.js unsupported, falling back to mp4");
          return;
        }

        const hls = new HlsConstructor({
          enableWorker: true,
          lowLatencyMode: false,
          startLevel: getStartupLevelHint(),
          capLevelToPlayerSize: true,
          capLevelOnFPSDrop: true,
          testBandwidth: true,
          abrEwmaDefaultEstimate: 900_000,
          abrEwmaFastVoD: 4,
          abrEwmaSlowVoD: 15,
          abrBandWidthFactor: 0.85,
          abrBandWidthUpFactor: 0.7,
          abrMaxWithRealBitrate: true,
          maxBufferLength: isSmallScreen() ? 12 : 18,
          maxMaxBufferLength: isSmallScreen() ? 24 : 36,
          maxBufferSize: isSmallScreen() ? 24 * 1000 * 1000 : 48 * 1000 * 1000,
          backBufferLength: isSmallScreen() ? 10 : 20,
          maxBufferHole: 0.5,
          nudgeMaxRetry: 5
        });

        hlsRef.current = hls;
        hls.on(HlsConstructor.Events.MANIFEST_PARSED, (_event, data) => {
          const startupLevel = clampStartupLevel(data.levels.length);

          if (startupLevel >= 0) {
            hls.startLevel = startupLevel;
            hls.nextLevel = startupLevel;
          }

          logVideo("manifest parsed", {
            levels: data.levels.map((level) => ({
              height: level.height,
              bitrate: level.bitrate
            })),
            startupLevel,
            network: getNetworkInformation()
          });
        });
        hls.on(HlsConstructor.Events.LEVEL_SWITCHED, (_event, data) => {
          const level = hls.levels[data.level];
          logVideo("level switched", {
            level: data.level,
            height: level?.height,
            bitrate: level?.bitrate
          });
        });
        hls.on(HlsConstructor.Events.ERROR, (_event, data) => {
          if (!data.fatal) {
            logVideo("non-fatal hls.js error", {
              type: data.type,
              details: data.details
            });
            return;
          }

          logVideo("fatal hls.js error, falling back to mp4", {
            type: data.type,
            details: data.details
          });
          hls.destroy();
          hlsRef.current = null;
          setFallbackToMp4(true);
        });
        hls.loadSource(effectiveUrl);
        hls.attachMedia(videoRef.current);
        logVideo("using hls.js", { url: effectiveUrl });
      })
      .catch((error) => {
        setFallbackToMp4(true);
        logVideo("hls.js import failed, falling back to mp4", { error: String(error) });
      });

    return () => {
      cancelled = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [effectiveUrl, usingHls]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !pauseWhenHidden || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          if (resumeWhenVisibleRef.current) {
            resumeWhenVisibleRef.current = false;
            void video.play().catch(() => undefined);
          }
          return;
        }

        resumeWhenVisibleRef.current = !video.paused;
        video.pause();
      },
      {
        threshold: 0.15
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [pauseWhenHidden]);

  useEffect(
    () => () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    },
    []
  );

  return (
    <video
      {...videoProps}
      ref={videoRef}
      poster={effectivePoster}
      onLoadedMetadata={onLoadedMetadata}
      onPlay={onPlay}
      onPause={onPause}
      onError={(event) => {
        if (usingHls && mp4Url && !fallbackToMp4) {
          setFallbackToMp4(true);
          logVideo("video element error, falling back to mp4");
          return;
        }
        onError?.(event);
      }}
    />
  );
});
