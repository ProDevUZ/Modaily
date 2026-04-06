"use client";

import { useEffect, useRef, useState } from "react";

import { FallbackImage } from "@/components/ui/fallback-image";

type VideoItem = {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
};

type VideoGalleryProps = {
  title: string;
  items: VideoItem[];
};

function GalleryArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ba0c2f] text-white">
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
    </span>
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

  useEffect(() => {
    if (!videoRef.current || !item.videoUrl) {
      return;
    }

    if (isActive) {
      videoRef.current.muted = false;
      void videoRef.current.play();
      setPlaying(true);
      return;
    }

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    videoRef.current.muted = true;
    setPlaying(false);
  }, [isActive, item.videoUrl]);

  function togglePlayback() {
    if (!videoRef.current || !item.videoUrl) {
      return;
    }

    if (isActive) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      setPlaying(false);
      onToggle("");
      return;
    }

    onToggle(item.id);
  }

  return (
    <button
      type="button"
      onClick={togglePlayback}
      className="group relative overflow-hidden rounded-[24px] text-left"
      aria-label={item.title || `Video ${index + 1}`}
    >
      {item.videoUrl ? (
        <video
          ref={videoRef}
          src={item.videoUrl}
          poster={item.imageUrl || undefined}
          preload="metadata"
          playsInline
          loop
          muted
          className="h-[420px] w-full object-cover md:h-[720px]"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <FallbackImage
          src={item.imageUrl || "https://placehold.co/375x667"}
          fallbackSrc="https://placehold.co/375x667/f1efeb/bb102b?text=Video"
          alt={item.title || `Video ${index + 1}`}
          className="h-[420px] w-full object-cover md:h-[720px]"
        />
      )}

      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 transition group-hover:bg-black/15">
        <PlayButton playing={playing} />
      </span>
    </button>
  );
}

export function VideoGallery({ title, items }: VideoGalleryProps) {
  const [activeId, setActiveId] = useState("");

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <div className="h-[3px] w-44 bg-[#ba0c2f] md:w-60" />
          <h2 className="mt-5 text-[34px] text-neutral-500 md:text-[40px]">
            {title}
          </h2>
        </div>

        <div className="hidden gap-3 md:flex">
          <GalleryArrow direction="left" />
          <GalleryArrow direction="right" />
        </div>
      </div>

      <div className="-mx-8 overflow-x-auto px-8 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-5 md:grid md:w-auto md:grid-cols-3">
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-[255px] shrink-0 snap-start sm:w-[300px] md:w-auto">
              <VideoCard item={item} index={index} isActive={activeId === item.id} onToggle={setActiveId} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
