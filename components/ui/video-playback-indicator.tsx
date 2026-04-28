"use client";

type VideoPlaybackIndicatorProps = {
  kind: "play" | "pause";
  className?: string;
};

export function VideoPlaybackIndicator({ kind, className }: VideoPlaybackIndicatorProps) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 top-1/2 flex h-[110px] w-[110px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-[2px] transition ${className || ""}`}
    >
      {kind === "play" ? (
        <svg viewBox="0 0 20 20" className="ml-1 h-10 w-10 fill-current" aria-hidden="true">
          <path d="M5.5 3.5 16 10 5.5 16.5V3.5Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-10 w-10 fill-current" aria-hidden="true">
          <path d="M5.5 4.5h3.5v11H5.5zM11 4.5h3.5v11H11z" />
        </svg>
      )}
    </span>
  );
}
