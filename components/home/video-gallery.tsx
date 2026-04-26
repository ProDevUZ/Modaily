"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { RotatingSectionHeading } from "@/components/home/rotating-section-heading";
import { FallbackImage } from "@/components/ui/fallback-image";

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
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#ba0c2f] text-white transition ${
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

function PlayButton({ playing }: { playing: boolean }) {
  return (
    <span
      className={`flex h-[110px] w-[110px] items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-[2px] transition ${
        playing ? "opacity-0" : "opacity-100"
      }`}
    >
      <svg viewBox="0 0 20 20" className="ml-1 h-10 w-10 fill-current" aria-hidden="true">
        <path d="M5.5 3.5 16 10 5.5 16.5V3.5Z" />
      </svg>
    </span>
  );
}

function formatPlaybackTime(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function VideoPreviewSurface({ item, index }: { item: VideoItem; index: number }) {
  if (item.imageUrl?.trim()) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex h-[420px] w-full items-center justify-center bg-[linear-gradient(180deg,#f3f1ed_0%,#ece7df_100%)] md:h-[576px]">
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
  isActive,
  onToggle
}: {
  item: VideoItem;
  index: number;
  isActive: boolean;
  onToggle: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!videoRef.current || !item.videoUrl) {
      return;
    }

    if (!isActive) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      setPlaying(false);
      setCurrentTime(0);
    }
  }, [isActive, item.videoUrl]);

  async function startPlayback() {
    if (!videoRef.current || !item.videoUrl) {
      return;
    }

    videoRef.current.muted = false;
    videoRef.current.currentTime = 0;

    try {
      await videoRef.current.play();
      setPlaying(true);
    } catch {
      try {
        videoRef.current.muted = true;
        await videoRef.current.play();
        setPlaying(true);
      } catch {
        // iOS/webviews can reject autoplay-like transitions; keep the card selected.
        setPlaying(false);
      }
    }

    onToggle(item.id);
  }

  async function togglePause() {
    if (!videoRef.current || !item.videoUrl) {
      return;
    }

    if (videoRef.current.paused) {
      try {
        await videoRef.current.play();
        setPlaying(true);
      } catch {
        // Keep previous visual state if play is blocked.
      }
      return;
    }

    videoRef.current.pause();
    setPlaying(false);
  }

  function handleProgressChange(nextValue: number) {
    if (!videoRef.current || !item.videoUrl) {
      return;
    }

    videoRef.current.currentTime = nextValue;
    setCurrentTime(nextValue);
  }

  return (
    <div className="group relative block w-full overflow-hidden rounded-[24px] text-left">
      <div className="relative h-[420px] w-full md:h-[576px]">
        {item.videoUrl ? (
          <video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.imageUrl || undefined}
            preload="metadata"
            playsInline
            loop
            muted
            className="pointer-events-none h-full w-full object-cover object-center"
            onLoadedMetadata={(event) => {
              const nextDuration = event.currentTarget.duration;
              setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
            }}
            onTimeUpdate={(event) => {
              setCurrentTime(event.currentTarget.currentTime);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
        ) : (
          <FallbackImage
            src={item.imageUrl || "https://placehold.co/375x667"}
            fallbackSrc="https://placehold.co/375x667/f1efeb/bb102b?text=Video"
            alt={item.title || `Video ${index + 1}`}
            className="h-full w-full object-cover object-center"
          />
        )}

        {(!isActive || !playing) ? <VideoPreviewSurface item={item} index={index} /> : null}

        {!isActive ? (
          <button
            type="button"
            data-video-interactive="true"
            data-video-card-button="true"
            onClick={startPlayback}
            aria-label={item.title || `Video ${index + 1}`}
            className="absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/15"
          >
            <PlayButton playing={playing} />
          </button>
        ) : (
          <>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {item.videoUrl ? (
              <button
                type="button"
                data-video-interactive="true"
                data-video-card-button="true"
                onClick={togglePause}
                aria-label={playing ? "Pause video" : "Play video"}
                className="absolute inset-0 z-[1] flex items-center justify-center bg-transparent"
              >
                {!playing ? <PlayButton playing={false} /> : null}
              </button>
            ) : null}
            {item.videoUrl ? (
              <div
                data-video-interactive="true"
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
                    <span>{formatPlaybackTime(currentTime)}</span>
                    <span>{formatPlaybackTime(duration)}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export function VideoGallery({ title, headings, items }: VideoGalleryProps) {
  const [activeId, setActiveId] = useState("");
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

  function handleDesktopPointerUp(event: React.PointerEvent<HTMLDivElement>) {
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
            <div key={`${item.id}-${index}`} className="w-[255px] shrink-0 snap-start sm:w-[300px]">
              <VideoCard item={item} index={index} isActive={activeId === item.id} onToggle={setActiveId} />
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
        <div className="grid min-w-full grid-flow-col auto-cols-[calc((100%-60px)/3)] gap-[30px] pr-[30px]">
          {desktopLoopItems.map((item, index) => (
            <div key={`${item.id}-${index}`} data-video-gallery-card="true" className="min-w-0 shrink-0">
              <VideoCard item={item} index={index % items.length} isActive={activeId === item.id} onToggle={setActiveId} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
