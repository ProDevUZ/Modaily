"use client";

import { useEffect, useMemo, useState } from "react";

import { FallbackImage } from "@/components/ui/fallback-image";

type GalleryItem = {
  id: string;
  imageUrl: string;
  title: string;
};

type GalleryProps = {
  title: string;
  items: GalleryItem[];
};

type GalleryLightboxProps = {
  items: GalleryItem[];
  title: string;
  initialIndex: number;
  onClose: () => void;
};

const rowWidths = [
  "w-[260px] sm:w-[300px] lg:w-[472px]",
  "w-[210px] sm:w-[230px] lg:w-[268px]",
  "w-[250px] sm:w-[300px] lg:w-[436px]",
  "w-[250px] sm:w-[300px] lg:w-[436px]"
] as const;

function buildRows(items: GalleryItem[]) {
  if (items.length === 0) {
    return { topRow: [], bottomRow: [] };
  }

  if (items.length <= 8) {
    return {
      topRow: items,
      bottomRow: items
    };
  }

  const midpoint = Math.ceil(items.length / 2);

  return {
    topRow: items.slice(0, midpoint),
    bottomRow: items.slice(midpoint)
  };
}

function GalleryLightbox({ items, title, initialIndex, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

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

  const activeItem = items[currentIndex] ?? items[0];

  function showPreviousImage() {
    setCurrentIndex((current) => (current === 0 ? items.length - 1 : current - 1));
  }

  function showNextImage() {
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
        showNextImage();
      } else {
        showPreviousImage();
      }
    }

    setTouchStartX(null);
    setTouchCurrentX(null);
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-sm sm:px-6"
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
          className="absolute right-0 top-0 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/35 text-2xl text-white transition hover:bg-black/50"
        >
          ×
        </button>

        <div className="mb-4 flex items-center justify-between gap-4 pt-14 text-white/80">
          <p className="truncate text-sm uppercase tracking-[0.22em]">{activeItem?.title || title}</p>
          <p className="shrink-0 text-sm">
            {currentIndex + 1}/{items.length}
          </p>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="Previous image"
                className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white transition hover:bg-black/50 md:flex"
              >
                ←
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="Next image"
                className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-xl text-white transition hover:bg-black/50 md:flex"
              >
                →
              </button>
            </>
          ) : null}

          <div
            className="flex w-full items-center justify-center overflow-hidden rounded-[18px] bg-white/4 px-4 py-4 sm:px-10"
            onTouchStart={(event) => handleTouchStart(event.touches[0]?.clientX ?? 0)}
            onTouchMove={(event) => handleTouchMove(event.touches[0]?.clientX ?? 0)}
            onTouchEnd={handleTouchEnd}
          >
            <FallbackImage
              src={activeItem?.imageUrl || ""}
              fallbackSrc="https://placehold.co/1200x900/f4f4f2/bb102b?text=Gallery"
              alt={activeItem?.title || `${title} image ${currentIndex + 1}`}
              className="max-h-[78vh] w-auto max-w-full object-contain"
            />
          </div>
        </div>

        {items.length > 1 ? (
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[10px] border transition ${
                  index === currentIndex ? "border-white" : "border-white/18"
                }`}
              >
                <FallbackImage
                  src={item.imageUrl}
                  fallbackSrc="https://placehold.co/200x200/f4f4f2/bb102b?text=Gallery"
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
  );
}

function GalleryRow({
  items,
  animationClass,
  allItems,
  onOpen
}: {
  items: GalleryItem[];
  animationClass: string;
  allItems: GalleryItem[];
  onOpen: (index: number) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  const loopItems = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-4 sm:gap-5 ${animationClass}`}>
        {loopItems.map((item, index) => {
          const galleryIndex = allItems.findIndex((entry) => entry.id === item.id);

          return (
            <button
              key={`${item.id}-${index}`}
              type="button"
              className={`shrink-0 overflow-hidden rounded-[24px] text-left transition hover:opacity-95 ${rowWidths[index % rowWidths.length]}`}
              onClick={() => {
                if (galleryIndex >= 0) {
                  onOpen(galleryIndex);
                }
              }}
              aria-label={`Open ${item.title || `gallery image ${index + 1}`}`}
            >
              <FallbackImage
                src={item.imageUrl}
                fallbackSrc="https://placehold.co/472x326/f4f4f2/bb102b?text=Gallery"
                alt={item.title || `Gallery item ${index + 1}`}
                className="h-[220px] w-full object-cover sm:h-[250px] lg:h-[326px]"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Gallery({ title, items }: GalleryProps) {
  const { topRow, bottomRow } = useMemo(() => buildRows(items), [items]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section className="space-y-8">
        <h2 className="px-8 text-[42px] tracking-[-0.04em] text-black md:px-10 md:text-[56px] lg:px-12">
          {title}
        </h2>

        <div className="space-y-4 sm:space-y-5">
          <GalleryRow items={topRow} allItems={items} animationClass="gallery-marquee-left" onOpen={setLightboxIndex} />
          <GalleryRow items={bottomRow} allItems={items} animationClass="gallery-marquee-right" onOpen={setLightboxIndex} />
        </div>
      </section>

      {lightboxIndex !== null && items.length > 0 ? (
        <GalleryLightbox items={items} title={title} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      ) : null}
    </>
  );
}
