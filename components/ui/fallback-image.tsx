"use client";

import { useState } from "react";

type FallbackImageProps = {
  src?: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
};

export function FallbackImage({ src, fallbackSrc, alt, className }: FallbackImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src && src.trim().length > 0 ? src : fallbackSrc);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
