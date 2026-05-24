"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FallbackImage } from "@/components/ui/fallback-image";
import { HlsVideo } from "@/components/ui/hls-video";
import { LightboxCloseIcon } from "@/components/ui/lightbox-close-icon";
import { LightboxNavArrow } from "@/components/ui/lightbox-nav-arrow";
import { VideoLoadingSpinner } from "@/components/ui/video-loading-spinner";
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

type BlogMediaLightboxProps = {
  items: BlogPostMediaItem[];
  alt: string;
  initialIndex: number;
  onClose: () => void;
};

function BlogMediaSlide({
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
  const imageClassName = "aspect-[16/9] w-full rounded-[1.25rem] object-cover object-center";
  const videoPreviewClassName = "h-full w-full object-cover object-center";

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
              sizes="(max-width: 767px) 100vw, (max-width: 1179px) 86vw, 760px"
              width={1200}
              height={675}
              quality={84}
              className={videoPreviewClassName}
            />
          ) : (
            <FallbackImage
              src={item.videoPosterUrl || undefined}
              fallbackSrc="/images/home/mainpage.jpg"
              alt={`${alt} ${index + 1}`}
              sizes="(max-width: 767px) 100vw, (max-width: 1179px) 86vw, 760px"
              width={1200}
              height={675}
              quality={84}
              className={videoPreviewClassName}
            />
          )}

          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <span className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-black/10 transition group-hover:bg-black/15">
            <VideoPlaybackIndicator kind="play" />
          </span>
        </button>
      ) : (
        <button
          type="button"
          className="block w-full overflow-hidden rounded-[1.25rem] bg-[#f6f5f2] text-left"
          onClick={onOpen}
        >
          <FallbackImage
            src={item.imageUrl || undefined}
            fallbackSrc="/images/home/mainpage.jpg"
            alt={`${alt} ${index + 1}`}
            sizes="(max-width: 767px) 100vw, (max-width: 1179px) 86vw, 760px"
            width={1200}
            height={675}
            quality={84}
            className={imageClassName}
          />
        </button>
      )}
    </div>
  );
}

function BlogCarouselArrow({
  direction,
  disabled,
  onClick
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";

  return (
    <LightboxNavArrow
      direction={direction}
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrevious ? "Previous media" : "Next media"}
      className={`!absolute inset-y-0 z-10 my-auto hidden md:flex ${
        isPrevious ? "-left-[1.375rem]" : "-right-[1.375rem]"
      }`}
    />
  );
}

function BlogLightboxMedia({ item, alt }: { item: BlogPostMediaItem | undefined; alt: string }) {
  if (item?.type === "VIDEO" && item.videoUrl) {
    return null;
  }

  return (
    <FallbackImage
      src={item?.imageUrl || undefined}
      fallbackSrc="/images/home/mainpage.jpg"
      alt={alt}
      className="max-h-[72vh] w-auto max-w-full rounded-[18px] object-contain"
    />
  );
}

function BlogMediaLightbox({ items, alt, initialIndex, onClose }: BlogMediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoActivated, setVideoActivated] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
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
    videoUrl: activeItem?.type === "VIDEO" ? activeItem.videoUrl : undefined,
    isActive: activeItem?.type === "VIDEO"
  });

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

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
    setIsBuffering(false);

    if (activeItem?.type === "VIDEO" && activeItem.videoUrl) {
      setVideoActivated(true);
      void startPlayback();
      return;
    }

    setVideoActivated(false);
  }, [activeItem?.id, activeItem?.type, activeItem?.videoUrl]);

  function showPreviousMedia() {
    setCurrentIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  }

  function showNextMedia() {
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
        showNextMedia();
      } else {
        showPreviousMedia();
      }
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  }

  const centerIndicatorKind = !playing && !centerIcon ? "play" : centerIcon;
  const showActiveVideo = activeItem?.type === "VIDEO" && activeItem.videoUrl;
  const lightboxFrameClassName = "relative flex max-h-[72vh] w-full items-center justify-center overflow-hidden rounded-[18px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.35)]";
  const lightboxVideoClassName = "pointer-events-none max-h-[72vh] w-auto max-w-full object-contain object-center";
  const playbackEvents = {
    ...videoEvents,
    onWaiting: () => setIsBuffering(true),
    onCanPlay: () => setIsBuffering(false),
    onPlaying: () => setIsBuffering(false)
  };

  const lightbox = (
    <div
      className="media-lightbox-overlay fixed inset-0 z-[220] flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-sm sm:px-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} media gallery`}
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
                  onClick={showPreviousMedia}
                  aria-label="Previous media"
                  className="hidden md:flex"
                />
              ) : null}

              <div className="w-full max-w-[min(92vw,1120px)] md:max-w-[min(82vw,980px)]">
                {showActiveVideo ? (
                  <>
                    <div className={lightboxFrameClassName}>
                      <HlsVideo
                        ref={videoRef}
                        mp4Url={activeItem?.videoUrl || undefined}
                        poster={activeItem?.videoPosterUrl || undefined}
                        preload="metadata"
                        playsInline
                        loop
                        muted
                        className={lightboxVideoClassName}
                        onHlsStateChange={(state) => {
                          setIsBuffering(state.status === "loading" || state.status === "pending" || state.status === "processing");
                        }}
                        {...playbackEvents}
                      />

                      {isBuffering ? <VideoLoadingSpinner /> : null}

                      <button
                        type="button"
                        onClick={() => {
                          if (!playing && currentTime === 0) {
                            setVideoActivated(true);
                            void startPlayback();
                            return;
                          }

                          setVideoActivated(true);
                          void togglePause();
                        }}
                        aria-label={playing ? "Pause video" : "Play video"}
                        className="interactive-glass-press !absolute inset-0 z-[2] flex items-center justify-center bg-transparent"
                      >
                        {centerIndicatorKind ? <VideoPlaybackIndicator kind={centerIndicatorKind} /> : null}
                      </button>

                      {videoActivated ? (
                        <div
                          onClick={(event) => event.stopPropagation()}
                          className="absolute inset-x-3 bottom-3 z-10 rounded-[18px] border border-white/18 bg-black/42 px-3 py-2.5 text-white shadow-[0_14px_28px_rgba(0,0,0,0.18)] backdrop-blur-sm md:inset-x-4 md:bottom-4 md:px-4"
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
                      ) : null}
                    </div>
                  </>
                ) : (
                  <div className="relative inline-flex w-full items-center justify-center">
                    <BlogLightboxMedia item={activeItem} alt={`${alt} media ${currentIndex + 1}`} />
                  </div>
                )}
              </div>

              {items.length > 1 ? (
                <LightboxNavArrow
                  direction="next"
                  onClick={showNextMedia}
                  aria-label="Next media"
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
                className={`relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[10px] border bg-black transition ${
                  index === currentIndex ? "border-white" : "border-white/18"
                }`}
              >
                {item.type === "VIDEO" && item.videoUrl ? (
                  <>
                    {item.imageUrl || item.videoPosterUrl ? (
                      <FallbackImage
                        src={item.videoPosterUrl || item.imageUrl || undefined}
                        fallbackSrc="/images/home/mainpage.jpg"
                        alt={`${alt} thumbnail ${index + 1}`}
                        sizes="74px"
                        width={148}
                        height={148}
                        quality={72}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FallbackImage
                        src={undefined}
                        fallbackSrc="/images/home/mainpage.jpg"
                        alt={`${alt} thumbnail ${index + 1}`}
                        sizes="74px"
                        width={148}
                        height={148}
                        quality={72}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/18 text-white">
                      <VideoPlaybackIndicator kind="play" />
                    </span>
                  </>
                ) : (
                  <FallbackImage
                    src={item.imageUrl || undefined}
                    fallbackSrc="/images/home/mainpage.jpg"
                    alt={`${alt} thumbnail ${index + 1}`}
                    sizes="74px"
                    width={148}
                    height={148}
                    quality={72}
                    className="h-full w-full object-cover"
                  />
                )}
                {index === currentIndex ? <span className="absolute inset-0 ring-1 ring-white/80" /> : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  return portalTarget ? createPortal(lightbox, portalTarget) : null;
}

export function BlogMediaCarousel({ media, alt }: BlogMediaCarouselProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      const clampedIndex = Math.max(0, Math.min(media.length - 1, nextIndex));
      activeIndexRef.current = clampedIndex;
      setActiveIndex(clampedIndex);
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

  function scrollToMediaIndex(index: number) {
    const rail = railRef.current;
    const nextIndex = Math.max(0, Math.min(media.length - 1, index));

    if (!rail) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      return;
    }

    const targetSlide = rail.children.item(nextIndex) as HTMLElement | null;

    rail.scrollTo({
      left: targetSlide?.offsetLeft ?? rail.clientWidth * nextIndex,
      behavior: "smooth"
    });
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  }

  const thumbWidth = `${100 / media.length}%`;
  const thumbOffset = `${(100 / media.length) * activeIndex}%`;

  return (
    <div>
      <div className="relative">
        <div
          ref={railRef}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-[1.25rem] scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {media.map((item, index) => (
            <BlogMediaSlide
              key={item.id}
              item={item}
              index={index}
              alt={alt}
              onOpen={() => setLightboxIndex(index)}
            />
          ))}
        </div>

        {media.length > 1 ? (
          <>
            <BlogCarouselArrow
              direction="previous"
              disabled={activeIndex === 0}
              onClick={() => scrollToMediaIndex(activeIndexRef.current - 1)}
            />
            <BlogCarouselArrow
              direction="next"
              disabled={activeIndex === media.length - 1}
              onClick={() => scrollToMediaIndex(activeIndexRef.current + 1)}
            />
          </>
        ) : null}
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

      {lightboxIndex !== null ? (
        <BlogMediaLightbox items={media} alt={alt} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      ) : null}
    </div>
  );
}
