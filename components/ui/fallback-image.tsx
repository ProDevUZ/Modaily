"use client";

import { useState } from "react";

type FallbackImageProps = {
  src?: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
};

export function FallbackImage({ src, fallbackSrc, alt, className }: FallbackImageProps) {
  const inlineFallback = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f3f1ed"/>
          <stop offset="100%" stop-color="#e7e4de"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#bg)"/>
      <rect x="530" y="175" width="140" height="110" rx="28" fill="#BA0C2F"/>
      <rect x="490" y="265" width="220" height="280" rx="48" fill="#ffffff"/>
      <rect x="560" y="312" width="80" height="16" rx="8" fill="#d8d8d8"/>
      <rect x="545" y="345" width="110" height="14" rx="7" fill="#e3e3e3"/>
      <rect x="520" y="610" width="160" height="16" rx="8" fill="#BA0C2F" opacity="0.9"/>
      <text x="600" y="700" fill="#BA0C2F" font-size="46" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">${alt}</text>
    </svg>`
  )}`;

  const [currentSrc, setCurrentSrc] = useState(src && src.trim().length > 0 ? src : fallbackSrc || inlineFallback);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackSrc && fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          return;
        }

        if (currentSrc !== inlineFallback) {
          setCurrentSrc(inlineFallback);
        }
      }}
    />
  );
}
