"use client";

type VideoLoadingSpinnerProps = {
  className?: string;
};

export function VideoLoadingSpinner({ className = "" }: VideoLoadingSpinnerProps) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 z-[3] flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/18 bg-black/35 shadow-[0_18px_42px_rgba(0,0,0,0.28)] backdrop-blur-[3px]">
        <span className="h-8 w-8 animate-spin rounded-full border-[2.5px] border-white/35 border-t-white" />
      </span>
    </span>
  );
}
