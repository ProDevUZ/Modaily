"use client";

import { useEffect, useRef, useState } from "react";

import { FallbackImage } from "@/components/ui/fallback-image";
import {
  formatInteractiveVideoTime,
  useInteractiveVideoPlayback
} from "@/components/ui/use-interactive-video-playback";
import { VideoPlaybackIndicator } from "@/components/ui/video-playback-indicator";
import type { BlogPostMediaItem } from "@/lib/blog-post-types";

type BlogMediaCarouselProps = {
  media: BlogPostMediaItem[];
  alt: string;
};

type BlogVideoLightboxProps = {
  items: BlogPostMediaItem[];
  alt: string;
  initialIndex: number;
  onClose: () => void;
};

function BlogVideoSlide({
  item,
  index,
  alt,
  onOpen
}: {
  item: BlogPostMediaItem;
  index: number;
  alt: string;
  onOpen: () => void;
}) {
  const showVideo = item.type === "VIDEO" && item.videoUrl;

  return (
    <div className="w-full shrink-0 snap-center">
      {showVideo ? (
        <button
          type="button"
          className="group relative block aspect-[16/9] w-full overflow-hidden rounded-[1.25rem] bg-black text-left"
          onClick={onOpen}
        >
          {item.imageUrl?.trim() ? (
            <FallbackImage
              src={item.imageUrl}
              fallbackSrc="/images/home/mainpage.jpg"
              alt={`${alt} ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <video
              src={item.videoUrl || undefined}
              poster={item.imageUrl || undefined}
              preload="metadata"
              playsInline
              muted
              className="pointer-events-none h-full w-full object-cover object-center"
              aria-label={`${alt} ${index + 1}`}
            />
          )}

          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <span className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/10 transition group-hover:bg-black/15">
            <VideoPlaybackIndicator kind="play" />
          </span>
        </button>
      ) : (
        <FallbackImage
          src={item.imageUrl || undefined}
          fallbackSrc="/images/home/mainpage.jpg"
          alt={`${alt} ${index + 1}`}
          className="aspect-[16/9] w-full rounded-[1.25rem] object-cover object-center"
        />
      )}
    </div>
  );
}

function BlogVideoLightbox({ items, alt, initialIndex, onClose }: BlogVideoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
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
    isActive: true
  });

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, onClose]);

  useEffect(() => {
    if (activeItem?.videoUrl) {
      void startPlayback();
    }
  }, [activeItem?.id, activeItem?.videoUrl]);

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

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-sm sm:px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} video gallery`}
    >
      <div className="relative flex max-h-full w-full max-w-[1320px] flex-col" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="interactive-glass-press interactive-glass-icon absolute right-0 top-0 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-2xl text-white transition hover:bg-black/50"
        >
          <span className="translate-y-[5%]">×</span>
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
                <button
                  type="button"
                  onClick={showPreviousVideo}
                  aria-label="Previous video"
                  className="interactive-glass-press interactive-glass-icon hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white transition hover:bg-black/50 md:flex md:h-12 md:w-12"
                >
                  ←
                </button>
              ) : null}

              <div className="w-full max-w-[min(92vw,1120px)] md:max-w-[min(82vw,980px)]">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                  <video
                    ref={videoRef}
                    src={activeItem?.videoUrl || undefined}
                    poster={activeItem?.imageUrl || undefined}
                    preload="metadata"
                    playsInline
                    loop
                    muted
                    className="pointer-events-none h-full w-full object-cover object-center"
                    {...videoEvents}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      void togglePause();
                    }}
                    aria-label={playing ? "Pause video" : "Play video"}
                    className="interactive-glass-press !absolute inset-0 z-[2] flex items-center justify-center bg-transparent"
                  >
                    {centerIndicatorKind ? <VideoPlaybackIndicator kind={centerIndicatorKind} /> : null}
                  </button>
                </div>

                <div
                  onClick={(event) => event.stopPropagation()}
                  className="mt-3 rounded-[12px] bg-black/8 px-3 py-2 text-black/80 sm:mt-4 sm:rounded-[18px] sm:border sm:border-white/18 sm:bg-black/42 sm:px-4 sm:py-2.5 sm:text-white sm:shadow-[0_14px_28px_rgba(0,0,0,0.18)] sm:backdrop-blur-sm"
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
                    <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium tracking-[0.02em] md:text-xs">
                      <span>{formatInteractiveVideoTime(currentTime)}</span>
                      <span>{formatInteractiveVideoTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {items.length > 1 ? (
                <button
                  type="button"
                  onClick={showNextVideo}
                  aria-label="Next video"
                  className="interactive-glass-press interactive-glass-icon hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white transition hover:bg-black/50 md:flex md:h-12 md:w-12"
                >
                  →
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogMediaCarousel({ media, alt }: BlogMediaCarouselProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const videoItems = media.filter((item) => item.type === "VIDEO" && item.videoUrl);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const updateActiveIndex = () => {
      const slideWidth = rail.clientWidth;

      if (!slideWidth) {
        return;
      }

      const nextIndex = Math.round(rail.scrollLeft / slideWidth);
      setActiveIndex(Math.max(0, Math.min(media.length - 1, nextIndex)));
    };

    updateActiveIndex();
    rail.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      rail.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [media.length]);

  if (media.length === 0) {
    return null;
  }

  const thumbWidth = `${100 / media.length}%`;
  const thumbOffset = `${(100 / media.length) * activeIndex}%`;

  return (
    <div>
      <div
        ref={railRef}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-[1.25rem] scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {media.map((item, index) => (
          <BlogVideoSlide
            key={item.id}
            item={item}
            index={index}
            alt={alt}
            onOpen={() => {
              const videoIndex = videoItems.findIndex((videoItem) => videoItem.id === item.id);

              if (videoIndex >= 0) {
                setLightboxIndex(videoIndex);
              }
            }}
          />
        ))}
      </div>

      {media.length > 1 ? (
        <div className="mt-4 flex justify-center">
          <div className="relative h-[3px] w-[96px] overflow-hidden rounded-full bg-black/10">
            <span
              className="absolute inset-y-0 rounded-full bg-[var(--brand)] transition-[left] duration-300 ease-out"
              style={{
                width: thumbWidth,
                left: thumbOffset
              }}
            />
          </div>
        </div>
      ) : null}

      {lightboxIndex !== null && videoItems.length > 0 ? (
        <BlogVideoLightbox items={videoItems} alt={alt} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      ) : null}
    </div>
  );
}
