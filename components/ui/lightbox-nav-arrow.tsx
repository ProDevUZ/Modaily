import type { ButtonHTMLAttributes } from "react";

type LightboxNavArrowProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  direction: "previous" | "next";
};

export function LightboxNavArrow({ direction, className = "", ...props }: LightboxNavArrowProps) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      className={`interactive-glass-press interactive-glass-icon h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#a9a9a9] text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#9f9f9f] disabled:pointer-events-none disabled:opacity-35 md:h-12 md:w-12 ${className}`}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        {isPrevious ? (
          <path d="M19 12H6m5-5-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M5 12h13m-5-5 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
