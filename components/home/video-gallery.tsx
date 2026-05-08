"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { RotatingSectionHeading } from "@/components/home/rotating-section-heading";
import { FallbackImage } from "@/components/ui/fallback-image";
import {
  formatInteractiveVideoTime,
  useInteractiveVideoPlayback
} from "@/components/ui/use-interactive-video-playback";
import { VideoPlaybackIndicator } from "@/components/ui/video-playback-indicator";
import { LightboxCloseIcon } from "@/components/ui/lightbox-close-icon";
import { LightboxNavArrow } from "@/components/ui/lightbox-nav-arrow";

type VideoItem = {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
};

type VideoGalleryProps = {
  title: string;
  headings?: string[];
  items: VideoItem[];
};

type VideoGalleryLightboxProps = {
  items: VideoItem[];
  title: string;
  initialIndex: number;
  onClose: () => void;
};

function MainVideoGalleryIndicator({ kind }: { kind: "play" | "pause" }) {
  return (
    <span className="pointer-events-none relative z-[3] flex h-[88px] w-[88px] items-center justify-center rounded-full border-4 border-white/55 bg-black/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
      {kind === "play" ? (
        <svg viewBox="0 0 20 20" className="ml-1 h-9 w-9 fill-current" aria-hidden="true">
          <path d="M5.5 3.5 16 10 5.5 16.5V3.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-9 w-9 fill-current" aria-hidden="true">
          <path d="M5.5 4.5h3.5v11H5.5zM11 4.5h3.5v11H11z" />
        </svg>
      )}
    </span>
  );
}

function VideoBufferingSpinner() {
  return (
    <span className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
      <span className="h-9 w-9 rounded-full border-2 border-white/45 border-t-white shadow-[0_8px_22px_rgba(0,0,0,0.22)] animate-spin" />
    </span>
  );
}

function MobileSwipeHint() {
  return (
    <span className="pointer-events-none absolute bottom-24 left-1/2 z-[4] flex -translate-x-1/2 items-center justify-center lg:hidden">
      <span className="flex h-16 w-8 animate-bounce items-center justify-center rounded-full border border-white/35 bg-white/20 shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-md">
        <span className="relative h-9 w-px rounded-full bg-white/75">
          <span className="absolute -top-0.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-white/80" />
        </span>
      </span>
    </span>
  );
}

function pauseOtherPageVideos(activeVideo: HTMLVideoElement | null) {
  document.querySelectorAll("video").forEach((video) => {
    if (video === activeVideo) {
      return;
    }

    video.pause();
    video.muted = true;
  });
}

function GalleryArrow({
  direction,
  onClick,
  disabled = false
}: {
  direction: "left" | "right";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous videos" : "Next videos"}
      className={`interactive-glass-press interactive-glass-icon flex h-9 w-9 items-center justify-center rounded-full bg-[#ba0c2f] text-white transition ${
        disabled ? "cursor-default opacity-45" : "hover:opacity-90"
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        className={`h-4 w-4 ${direction === "left" ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M4 10h11" />
        <path d="m11 5 5 5-5 5" />
      </svg>
    </button>
  );
}

function VideoPreviewSurface({ item, index }: { item: VideoItem; index: number }) {
  if (item.imageUrl?.trim()) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,#f3f1ed_0%,#ece7df_100%)]">
      <div className="flex flex-col items-center gap-4 text-center text-[#8b7d75]">
        <span className="text-[11px] uppercase tracking-[0.34em] text-[#ba0c2f]/70">Video Preview</span>
        <span className="max-w-[14ch] text-[15px] font-medium leading-6 text-[#7a6f68]">
          {item.title || `Video ${index + 1}`}
        </span>
      </div>
    </div>
  );
}

function VideoCard({
  item,
  index,
  onOpen
}: {
  item: VideoItem;
  index: number;
  onOpen: () => void;
}) {
  return (
    <div className="group relative block w-full overflow-hidden rounded-[24px] text-left">
      <div
        data-video-interactive="true"
        className={`relative aspect-[9/16] w-full ${item.videoUrl ? "cursor-pointer" : ""}`}
        onClick={() => {
          if (!item.videoUrl) {
            return;
          }

          onOpen();
        }}
      >
        <FallbackImage
          src={item.imageUrl || "https://placehold.co/375x667"}
          fallbackSrc="https://placehold.co/375x667/f1efeb/bb102b?text=Video"
          alt={item.title || `Video ${index + 1}`}
          className="h-full w-full object-cover object-center"
        />

        <VideoPreviewSurface item={item} index={index} />

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {item.videoUrl ? (
          <button
            type="button"
            data-video-interactive="true"
            data-video-card-button="true"
            onClick={(event) => {
              event.stopPropagation();
              onOpen();
            }}
            aria-label={item.title || `Video ${index + 1}`}
            className="interactive-glass-press !absolute inset-0 z-[2] flex items-center justify-center bg-black/10 transition group-hover:bg-black/15"
          >
            <MainVideoGalleryIndicator kind="play" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MobileVideoLightboxReel({
  items,
  title,
  initialIndex,
  onClose
}: {
  items: VideoItem[];
  title: string;
  initialIndex: number;
  onClose: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const adjustingRef = useRef(false);
  const scrollEndTimeoutRef = useRef<number | null>(null);
  const swipeHintDelayTimeoutRef = useRef<number | null>(null);
  const swipeHintHideTimeoutRef = useRef<number | null>(null);
  const swipeHintDismissedRef = useRef(false);
  const centerIconTimeoutRef = useRef<number | null>(null);
  const [activeVirtualIndex, setActiveVirtualIndex] = useState(items.length > 1 ? initialIndex + 1 : initialIndex);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isActivePlaying, setIsActivePlaying] = useState(false);
  const [activeCurrentTime, setActiveCurrentTime] = useState(0);
  const [activeDuration, setActiveDuration] = useState(0);
  const [centerIcon, setCenterIcon] = useState<"play" | "pause" | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  const loopItems = useMemo(() => {
    if (items.length <= 1) {
      return items.map((item, index) => ({ item, itemIndex: index }));
    }

    const lastIndex = items.length - 1;

    return [
      { item: items[lastIndex], itemIndex: lastIndex },
      ...items.map((item, index) => ({ item, itemIndex: index })),
      { item: items[0], itemIndex: 0 }
    ];
  }, [items]);

  function clearCenterIconTimeout() {
    if (centerIconTimeoutRef.current !== null) {
      window.clearTimeout(centerIconTimeoutRef.current);
      centerIconTimeoutRef.current = null;
    }
  }

  function showCenterIcon(kind: "play" | "pause", autoHide: boolean) {
    clearCenterIconTimeout();
    setCenterIcon(kind);

    if (autoHide) {
      centerIconTimeoutRef.current = window.setTimeout(() => {
        setCenterIcon(null);
        centerIconTimeoutRef.current = null;
      }, 1000);
    }
  }

  function pauseAllVideos(options: { showIndicator?: boolean } = {}) {
    videoRefs.current.forEach((video) => {
      if (!video) {
        return;
      }

      video.pause();
      video.muted = true;
    });
    setIsActivePlaying(false);
    if (options.showIndicator) {
      showCenterIcon("pause", false);
    }
  }

  function playVideoAt(index: number, options: { restart?: boolean; showIndicator?: boolean } = {}) {
    const activeVideo = videoRefs.current[index];

    videoRefs.current.forEach((video, videoIndex) => {
      if (!video || videoIndex === index) {
        return;
      }

      video.pause();
      video.muted = true;
    });

    if (!activeVideo) {
      setIsActivePlaying(false);
      return;
    }

    pauseOtherPageVideos(activeVideo);
    if (options.restart) {
      activeVideo.currentTime = 0;
    }
    activeVideo.muted = false;
    void activeVideo
      .play()
      .then(() => {
        setIsActivePlaying(true);
        if (options.showIndicator) {
          showCenterIcon("play", true);
        }
      })
      .catch(() => setIsActivePlaying(false));
  }

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scroller.scrollTop = (items.length > 1 ? initialIndex + 1 : initialIndex) * scroller.clientHeight;
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [initialIndex, items.length]);

  useEffect(() => {
    playVideoAt(activeVirtualIndex, { restart: true });
    setIsBuffering(false);
    setActiveCurrentTime(0);
    setActiveDuration(0);
  }, [activeVirtualIndex]);

  useEffect(
    () => () => {
      if (scrollEndTimeoutRef.current !== null) {
        window.clearTimeout(scrollEndTimeoutRef.current);
      }
      if (swipeHintDelayTimeoutRef.current !== null) {
        window.clearTimeout(swipeHintDelayTimeoutRef.current);
      }
      if (swipeHintHideTimeoutRef.current !== null) {
        window.clearTimeout(swipeHintHideTimeoutRef.current);
      }
      clearCenterIconTimeout();

      pauseAllVideos();
    },
    []
  );

  useEffect(() => {
    document.body.classList.add("mobile-video-lightbox-open");

    return () => {
      document.body.classList.remove("mobile-video-lightbox-open");
    };
  }, []);

  useEffect(() => {
    if (swipeHintDelayTimeoutRef.current !== null) {
      window.clearTimeout(swipeHintDelayTimeoutRef.current);
      swipeHintDelayTimeoutRef.current = null;
    }
    if (swipeHintHideTimeoutRef.current !== null) {
      window.clearTimeout(swipeHintHideTimeoutRef.current);
      swipeHintHideTimeoutRef.current = null;
    }

    setShowSwipeHint(false);

    if (!isActivePlaying || items.length <= 1 || swipeHintDismissedRef.current) {
      return;
    }

    swipeHintDelayTimeoutRef.current = window.setTimeout(() => {
      if (swipeHintDismissedRef.current) {
        return;
      }

      setShowSwipeHint(true);
      swipeHintHideTimeoutRef.current = window.setTimeout(() => {
        setShowSwipeHint(false);
      }, 3500);
    }, 2000);

    return () => {
      if (swipeHintDelayTimeoutRef.current !== null) {
        window.clearTimeout(swipeHintDelayTimeoutRef.current);
        swipeHintDelayTimeoutRef.current = null;
      }
      if (swipeHintHideTimeoutRef.current !== null) {
        window.clearTimeout(swipeHintHideTimeoutRef.current);
        swipeHintHideTimeoutRef.current = null;
      }
    };
  }, [activeVirtualIndex, isActivePlaying, items.length]);

  function dismissSwipeHint() {
    swipeHintDismissedRef.current = true;
    setShowSwipeHint(false);

    if (swipeHintDelayTimeoutRef.current !== null) {
      window.clearTimeout(swipeHintDelayTimeoutRef.current);
      swipeHintDelayTimeoutRef.current = null;
    }
    if (swipeHintHideTimeoutRef.current !== null) {
      window.clearTimeout(swipeHintHideTimeoutRef.current);
      swipeHintHideTimeoutRef.current = null;
    }
  }

  function normalizeMobileScroll() {
    const scroller = scrollerRef.current;

    if (!scroller || items.length <= 1 || adjustingRef.current) {
      return;
    }

    pauseAllVideos();
    setCenterIcon(null);

    const slideHeight = scroller.clientHeight || 1;

    if (scrollEndTimeoutRef.current !== null) {
      window.clearTimeout(scrollEndTimeoutRef.current);
    }

    scrollEndTimeoutRef.current = window.setTimeout(() => {
      const currentIndex = Math.round(scroller.scrollTop / slideHeight);
      let targetIndex = currentIndex;

      if (currentIndex === 0) {
        targetIndex = items.length;
      } else if (currentIndex === loopItems.length - 1) {
        targetIndex = 1;
      }

      if (targetIndex !== currentIndex) {
        adjustingRef.current = true;
        scroller.scrollTop = targetIndex * slideHeight;
        setActiveVirtualIndex(targetIndex);
        window.requestAnimationFrame(() => {
          adjustingRef.current = false;
        });
        return;
      }

      setActiveVirtualIndex(currentIndex);
      if (currentIndex === activeVirtualIndex) {
        playVideoAt(currentIndex);
      }
    }, 120);
  }

  function toggleActiveVideo() {
    const activeVideo = videoRefs.current[activeVirtualIndex];

    if (!activeVideo) {
      return;
    }

    if (activeVideo.paused) {
      playVideoAt(activeVirtualIndex, { showIndicator: true });
      return;
    }

    pauseAllVideos({ showIndicator: true });
  }

  function updateActiveTime(video: HTMLVideoElement, virtualIndex: number) {
    if (virtualIndex !== activeVirtualIndex) {
      return;
    }

    setActiveCurrentTime(video.currentTime);
    setActiveDuration(Number.isFinite(video.duration) ? video.duration : 0);
  }

  function seekActiveVideo(nextTime: number) {
    const activeVideo = videoRefs.current[activeVirtualIndex];

    if (!activeVideo || !Number.isFinite(activeVideo.duration) || activeVideo.duration <= 0) {
      return;
    }

    const safeTime = Math.min(Math.max(nextTime, 0), activeVideo.duration);
    activeVideo.currentTime = safeTime;
    setActiveCurrentTime(safeTime);
    setActiveDuration(activeVideo.duration);
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="main-video-gallery-lightbox media-lightbox-overlay fixed inset-0 z-[2147483647] h-[100dvh] w-screen overflow-hidden bg-black md:hidden" role="dialog" aria-modal="true" aria-label={`${title} gallery`}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        style={{ left: "auto", right: 3, top: 3 }}
        className="interactive-glass-press interactive-glass-icon !absolute right-[3px] top-[3px] z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-2xl text-white transition hover:bg-black/50"
      >
        <span className="flex h-full w-full items-center justify-center leading-none">×</span>
      </button>

      <div
        ref={scrollerRef}
        className="relative z-10 h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={normalizeMobileScroll}
        onTouchStart={dismissSwipeHint}
      >
        {loopItems.map(({ item, itemIndex }, virtualIndex) => (
          <section
            key={`${item.id}-${virtualIndex}`}
            className="relative h-[100dvh] snap-center snap-always overflow-hidden bg-transparent"
          >
            {item.videoUrl ? (
              <div className="main-video-gallery-lightbox-media">
                <FallbackImage
                  src={item.imageUrl || "https://placehold.co/375x667"}
                  fallbackSrc="https://placehold.co/375x667/f1efeb/bb102b?text=Video"
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <video
                  ref={(element) => {
                    videoRefs.current[virtualIndex] = element;
                  }}
                  src={item.videoUrl}
                  poster={item.imageUrl || undefined}
                  playsInline
                  muted
                  loop
                  preload="metadata"
                  className="main-mobile-reel-video absolute inset-0 block h-full w-full object-cover object-center"
                  onLoadedMetadata={(event) => updateActiveTime(event.currentTarget, virtualIndex)}
                  onTimeUpdate={(event) => updateActiveTime(event.currentTarget, virtualIndex)}
                  onWaiting={() => {
                    if (virtualIndex === activeVirtualIndex) {
                      setIsBuffering(true);
                    }
                  }}
                  onCanPlay={() => setIsBuffering(false)}
                  onPlaying={() => {
                    if (virtualIndex !== activeVirtualIndex) {
                      const video = videoRefs.current[virtualIndex];
                      video?.pause();
                      if (video) {
                        video.muted = true;
                      }
                      return;
                    }

                    setIsBuffering(false);
                    setIsActivePlaying(true);
                  }}
                  onPause={() => {
                    if (virtualIndex === activeVirtualIndex) {
                      setIsActivePlaying(false);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="main-video-gallery-lightbox-media">
                <FallbackImage
                  src={item.imageUrl || "https://placehold.co/375x667"}
                  fallbackSrc="https://placehold.co/375x667/f1efeb/bb102b?text=Video"
                  alt={item.title || `Video ${itemIndex + 1}`}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}

            <VideoPreviewSurface item={item} index={itemIndex} />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            {isBuffering && virtualIndex === activeVirtualIndex ? <VideoBufferingSpinner /> : null}
            {showSwipeHint && virtualIndex === activeVirtualIndex ? <MobileSwipeHint /> : null}
            {item.videoUrl && virtualIndex === activeVirtualIndex ? (
              <div
                className="absolute bottom-[calc(env(safe-area-inset-bottom)+38px)] left-4 right-4 z-20 flex items-center gap-3 text-[12px] font-medium tracking-[0.02em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]"
                onClick={(event) => event.stopPropagation()}
              >
                <span className="shrink-0">
                  {formatInteractiveVideoTime(activeCurrentTime)} / {formatInteractiveVideoTime(activeDuration)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={activeDuration || 0}
                  step="0.1"
                  value={Math.min(activeCurrentTime, activeDuration || 0)}
                  onChange={(event) => seekActiveVideo(Number(event.target.value))}
                  className="main-video-gallery-lightbox-range h-5 min-w-0 flex-1 cursor-pointer appearance-none bg-transparent"
                  aria-label="Video progress"
                />
              </div>
            ) : null}
            {item.videoUrl && virtualIndex === activeVirtualIndex ? (
              <button
                type="button"
                onClick={toggleActiveVideo}
                aria-label={isActivePlaying ? "Pause video" : "Play video"}
                className="interactive-glass-press !absolute inset-0 z-[2] flex items-center justify-center bg-transparent"
              >
                {!isActivePlaying && !centerIcon ? <VideoPlaybackIndicator kind="play" /> : null}
                {centerIcon ? <VideoPlaybackIndicator kind={centerIcon} /> : null}
              </button>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}

function VideoGalleryLightbox({ items, title, initialIndex, onClose }: VideoGalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [isDesktopLightbox, setIsDesktopLightbox] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(min-width: 768px)").matches
  );
  const activeItem = items[currentIndex] ?? items[0];
  const {
    videoRef,
    playing,
    currentTime,
    duration,
    centerIcon,
    startPlayback,
    togglePause,
    handleProgressChange,
    videoEvents
  } = useInteractiveVideoPlayback({
    videoUrl: activeItem?.videoUrl,
    isActive: isDesktopLightbox
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");

    function updateLightboxMode() {
      setIsDesktopLightbox(query.matches);
    }

    updateLightboxMode();
    query.addEventListener("change", updateLightboxMode);

    return () => {
      query.removeEventListener("change", updateLightboxMode);
    };
  }, []);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.classList.add("media-lightbox-open");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (items.length <= 1) {
        return;
      }

      if (event.key === "ArrowLeft") {
        setCurrentIndex((current) => (current === 0 ? items.length - 1 : current - 1));
      }

      if (event.key === "ArrowRight") {
        setCurrentIndex((current) => (current === items.length - 1 ? 0 : current + 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("media-lightbox-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, onClose]);

  useEffect(() => {
    if (isDesktopLightbox && activeItem?.videoUrl) {
      pauseOtherPageVideos(videoRef.current);
      void startPlayback();
    }
    setIsBuffering(false);
  }, [activeItem?.id, activeItem?.videoUrl, isDesktopLightbox]);

  function showPreviousVideo() {
    setCurrentIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  }

  function showNextVideo() {
    setCurrentIndex((current) => (current === items.length - 1 ? 0 : current + 1));
  }

  function handleTouchStart(clientX: number) {
    setTouchStartX(clientX);
    setTouchCurrentX(clientX);
  }

  function handleTouchMove(clientX: number) {
    if (touchStartX === null) {
      return;
    }

    setTouchCurrentX(clientX);
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchCurrentX === null || items.length <= 1) {
      setTouchStartX(null);
      setTouchCurrentX(null);
      return;
    }

    const deltaX = touchCurrentX - touchStartX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        showNextVideo();
      } else {
        showPreviousVideo();
      }
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  }

  const centerIndicatorKind = !playing && !centerIcon ? "play" : centerIcon;
  const playbackEvents = {
    ...videoEvents,
    onWaiting: () => setIsBuffering(true),
    onCanPlay: () => setIsBuffering(false),
    onPlaying: () => {
      pauseOtherPageVideos(videoRef.current);
      setIsBuffering(false);
    }
  };

  const lightbox = (
    <>
      {!isDesktopLightbox ? <MobileVideoLightboxReel items={items} title={title} initialIndex={initialIndex} onClose={onClose} /> : null}
      {isDesktopLightbox ? (
      <div
      className="media-lightbox-overlay fixed inset-0 z-[220] hidden items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-sm sm:px-6 md:flex"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
    >
      <div className="relative flex max-h-full w-full max-w-[1320px] flex-col" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="fixed right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:bg-black/50 sm:right-6 sm:top-6"
        >
          <LightboxCloseIcon />
        </button>

        <div className="mb-4 flex items-center justify-end pt-14 text-white/80">
          <p className="shrink-0 text-sm">
            {currentIndex + 1}/{items.length}
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div
            className="flex w-full items-center justify-center overflow-hidden rounded-[18px] bg-white/4 px-4 py-4 sm:px-10"
            onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
            onTouchMove={(event) => handleTouchMove(event.touches[0]?.clientX ?? 0)}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex max-w-full items-center justify-center gap-4 md:gap-6">
              {items.length > 1 ? (
                <LightboxNavArrow
                  direction="previous"
                  onClick={showPreviousVideo}
                  aria-label="Previous video"
                  className="hidden md:flex"
                />
              ) : null}

              <div className="relative w-[min(72vw,280px)] overflow-hidden rounded-[18px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.35)] md:w-[min(62vw,360px)]">
                <div className="relative aspect-[9/16] w-full">
                  <video
                    ref={videoRef}
                    src={activeItem?.videoUrl || undefined}
                    poster={activeItem?.imageUrl || undefined}
                    preload="metadata"
                    playsInline
                    loop
                    muted
                    className="pointer-events-none h-full w-full object-cover object-center"
                    {...playbackEvents}
                  />

                  {isBuffering ? <VideoBufferingSpinner /> : null}

                  <button
                    type="button"
                    onClick={() => {
                      pauseOtherPageVideos(videoRef.current);
                      void togglePause();
                    }}
                    aria-label={playing ? "Pause video" : "Play video"}
                    className="interactive-glass-press !absolute inset-0 z-[2] flex items-center justify-center bg-transparent"
                  >
                    {centerIndicatorKind ? <VideoPlaybackIndicator kind={centerIndicatorKind} /> : null}
                  </button>

                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="absolute inset-x-3 bottom-3 z-10 rounded-[18px] border border-white/18 bg-black/42 px-3 py-2.5 text-white shadow-[0_14px_28px_rgba(0,0,0,0.18)] backdrop-blur-sm"
                  >
                    <div className="min-w-0">
                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step="0.1"
                        value={Math.min(currentTime, duration || 0)}
                        onChange={(event) => handleProgressChange(Number(event.target.value))}
                        className="h-1.5 w-full cursor-pointer accent-white"
                        aria-label="Video progress"
                      />
                      <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium tracking-[0.02em] text-white/82 md:text-xs">
                        <span>{formatInteractiveVideoTime(currentTime)}</span>
                        <span>{formatInteractiveVideoTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {items.length > 1 ? (
                <LightboxNavArrow
                  direction="next"
                  onClick={showNextVideo}
                  aria-label="Next video"
                  className="hidden md:flex"
                />
              ) : null}
            </div>
          </div>
        </div>

        {items.length > 1 ? (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-[9/16] h-[84px] shrink-0 overflow-hidden rounded-[10px] border transition ${
                  index === currentIndex ? "border-white" : "border-white/18"
                }`}
              >
                <FallbackImage
                  src={item.imageUrl || "https://placehold.co/120x214"}
                  fallbackSrc="https://placehold.co/120x214/f4f4f2/bb102b?text=Video"
                  alt={item.title || `${title} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === currentIndex ? <span className="absolute inset-0 ring-1 ring-white/80" /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      </div>
      ) : null}
    </>
  );

  return portalTarget ? createPortal(lightbox, portalTarget) : null;
}

export function VideoGallery({ title, headings, items }: VideoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const desktopScrollerRef = useRef<HTMLDivElement | null>(null);
  const desktopDraggingRef = useRef(false);
  const desktopSuppressClickRef = useRef(false);
  const desktopAdjustingRef = useRef(false);
  const desktopStartXRef = useRef(0);
  const desktopStartScrollRef = useRef(0);

  const canShiftDesktopGallery = items.length > 3;
  const desktopLoopItems = useMemo(
    () => (canShiftDesktopGallery ? [...items, ...items, ...items] : items),
    [canShiftDesktopGallery, items]
  );

  useEffect(() => {
    const scroller = desktopScrollerRef.current;

    if (!scroller || !canShiftDesktopGallery) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      scroller.scrollLeft = scroller.scrollWidth / 3;
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [canShiftDesktopGallery, desktopLoopItems.length]);

  function normalizeDesktopScrollPosition() {
    const scroller = desktopScrollerRef.current;

    if (!scroller || !canShiftDesktopGallery || desktopAdjustingRef.current) {
      return;
    }

    const segmentWidth = scroller.scrollWidth / 3;
    const minThreshold = segmentWidth * 0.5;
    const maxThreshold = segmentWidth * 1.5;

    if (scroller.scrollLeft > minThreshold && scroller.scrollLeft < maxThreshold) {
      return;
    }

    desktopAdjustingRef.current = true;

    while (scroller.scrollLeft <= minThreshold) {
      scroller.scrollLeft += segmentWidth;
    }

    while (scroller.scrollLeft >= maxThreshold) {
      scroller.scrollLeft -= segmentWidth;
    }

    requestAnimationFrame(() => {
      desktopAdjustingRef.current = false;
    });
  }

  function shiftDesktopGallery(direction: "left" | "right") {
    const scroller = desktopScrollerRef.current;

    if (!scroller || !canShiftDesktopGallery) {
      return;
    }

    const firstCard = scroller.querySelector<HTMLElement>("[data-video-gallery-card='true']");
    const columnGap = Number.parseFloat(
      firstCard?.parentElement
        ? window.getComputedStyle(firstCard.parentElement).columnGap ||
            window.getComputedStyle(firstCard.parentElement).gap
        : "0"
    );
    const cardWidth = firstCard?.offsetWidth ?? scroller.clientWidth / 3;
    const nextOffset = cardWidth + (Number.isFinite(columnGap) ? columnGap : 0);

    scroller.scrollBy({
      left: direction === "left" ? -nextOffset : nextOffset,
      behavior: "smooth"
    });
  }

  function handleDesktopPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    if ((event.target as HTMLElement).closest("[data-video-interactive='true']")) {
      return;
    }

    const scroller = desktopScrollerRef.current;

    if (!scroller || !canShiftDesktopGallery) {
      return;
    }

    desktopDraggingRef.current = true;
    desktopSuppressClickRef.current = false;
    desktopStartXRef.current = event.clientX;
    desktopStartScrollRef.current = scroller.scrollLeft;
  }

  function handleDesktopPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!desktopDraggingRef.current) {
      return;
    }

    const scroller = desktopScrollerRef.current;

    if (!scroller) {
      return;
    }

    const delta = event.clientX - desktopStartXRef.current;

    if (Math.abs(delta) > 6) {
      desktopSuppressClickRef.current = true;
    }

    scroller.scrollLeft = desktopStartScrollRef.current - delta;
    normalizeDesktopScrollPosition();
  }

  function handleDesktopPointerUp() {
    if (!desktopDraggingRef.current) {
      return;
    }

    desktopDraggingRef.current = false;

    normalizeDesktopScrollPosition();
  }

  function handleDesktopClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!desktopSuppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    desktopSuppressClickRef.current = false;
  }

  return (
    <>
      <section className="space-y-8">
        <div className="relative">
          <div className="hidden gap-3 md:absolute md:right-0 md:top-0 md:flex">
            <GalleryArrow direction="left" onClick={() => shiftDesktopGallery("left")} disabled={!canShiftDesktopGallery} />
            <GalleryArrow direction="right" onClick={() => shiftDesktopGallery("right")} disabled={!canShiftDesktopGallery} />
          </div>

          <RotatingSectionHeading
            fallback={title}
            texts={headings}
            accentClassName="mx-auto mb-5 h-[3px] w-44 bg-[#ba0c2f] md:w-60"
            textClassName="text-[34px] leading-[1.1] tracking-[-0.04em] text-center text-neutral-500 md:text-[40px]"
          />
        </div>

        <div className="-mx-8 overflow-x-auto px-8 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-5">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="w-[196px] shrink-0 snap-start sm:w-[210px]">
                <VideoCard item={item} index={index} onOpen={() => setLightboxIndex(index)} />
              </div>
            ))}
          </div>
        </div>

        <div
          ref={desktopScrollerRef}
          className="hidden overflow-x-auto overscroll-x-contain [scrollbar-width:none] md:block [&::-webkit-scrollbar]:hidden"
          onPointerDown={handleDesktopPointerDown}
          onPointerMove={handleDesktopPointerMove}
          onPointerUp={handleDesktopPointerUp}
          onPointerCancel={handleDesktopPointerUp}
          onScroll={normalizeDesktopScrollPosition}
          onClickCapture={handleDesktopClickCapture}
        >
          <div className="grid min-w-full grid-flow-col auto-cols-[220px] gap-6 pr-6 lg:auto-cols-[260px] xl:auto-cols-[280px]">
            {desktopLoopItems.map((item, index) => (
              <div key={`${item.id}-${index}`} data-video-gallery-card="true" className="min-w-0 shrink-0">
                <VideoCard item={item} index={index % items.length} onOpen={() => setLightboxIndex(index % items.length)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightboxIndex !== null && items.length > 0 ? (
        <VideoGalleryLightbox items={items} title={title} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      ) : null}
    </>
  );
}
