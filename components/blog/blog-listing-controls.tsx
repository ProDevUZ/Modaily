"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type BlogListingControlsProps = {
  categories: string[];
  selectedCategory: string;
  selectedSort: string;
  selectedView: "3" | "2" | "1";
  labels: {
    allPosts: string;
    sortLabel: string;
    sortNewest: string;
    sortOldest: string;
    viewThree: string;
    viewTwo: string;
    viewOne: string;
  };
};

export function BlogListingControls({
  categories,
  selectedCategory,
  selectedSort,
  selectedView,
  labels
}: BlogListingControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortMenuRef = useRef<HTMLDivElement | null>(null);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSortOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function updateParam(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function selectSort(value: string) {
    updateParam("sort", value);
    setIsSortOpen(false);
  }

  const sortOptions = [
    { value: "newest", label: labels.sortNewest },
    { value: "oldest", label: labels.sortOldest }
  ];

  const viewOptions = [
    {
      value: "3" as const,
      label: labels.viewThree,
      icon: (
        <div className="grid grid-cols-3 gap-[3px]">
          {Array.from({ length: 9 }).map((_, index) => (
            <span key={index} className="h-[6px] w-[6px] rounded-[1px] bg-current" />
          ))}
        </div>
      )
    },
    {
      value: "2" as const,
      label: labels.viewTwo,
      icon: (
        <div className="grid grid-cols-2 gap-[4px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index} className="h-[8px] w-[8px] rounded-[2px] bg-current" />
          ))}
        </div>
      )
    },
    {
      value: "1" as const,
      label: labels.viewOne,
      icon: (
        <div className="grid gap-[4px]">
          <span className="h-[8px] w-[18px] rounded-[2px] bg-current" />
          <span className="h-[8px] w-[18px] rounded-[2px] bg-current" />
        </div>
      )
    }
  ];

  return (
    <div className="mx-auto mt-0 flex w-full max-w-[1180px] flex-col gap-5 pt-0 lg:flex-row lg:items-center lg:justify-between">
      <div className="hidden flex-wrap items-center gap-x-7 gap-y-3 lg:flex lg:pl-0">
        <button
          type="button"
          onClick={() => updateParam("category", "")}
          className={`shrink-0 border-b pb-[5px] text-[13px] leading-[16px] transition lg:text-[14px] ${
            !selectedCategory
              ? "border-black text-slate-950"
              : "border-transparent text-slate-400 hover:border-black/30 hover:text-slate-700"
          }`}
        >
          {labels.allPosts}
        </button>

        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => updateParam("category", category)}
            className={`shrink-0 border-b pb-[5px] text-[13px] leading-[16px] transition lg:text-[14px] ${
              selectedCategory === category
                ? "border-black text-slate-950"
                : "border-transparent text-slate-400 hover:border-black/30 hover:text-slate-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex w-full items-center justify-between gap-6 sm:justify-end lg:w-auto lg:gap-8">
        <div ref={sortMenuRef} className="relative w-full lg:w-auto">
          <button
            type="button"
            aria-expanded={isSortOpen}
            aria-haspopup="menu"
            onClick={() => setIsSortOpen((current) => !current)}
            className="inline-flex h-[52px] w-full items-center justify-between rounded-[10px] border border-[#9aa2af] px-[18px] py-[9px] text-[18px] leading-[22px] text-slate-700 transition hover:text-slate-900 lg:h-[40px] lg:w-auto lg:justify-start lg:gap-2 lg:rounded-none lg:border-0 lg:px-[14px] lg:text-[15px] lg:leading-[19px]"
          >
            <span>{labels.sortLabel}</span>
            <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isSortOpen ? (
            <div className="absolute right-0 top-full z-20 mt-3 w-full min-w-[220px] rounded-[1.1rem] border border-[#e7e3dc] bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.08)] lg:w-auto">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedSort === option.value}
                  onClick={() => selectSort(option.value)}
                  className={`flex w-full items-center justify-between rounded-[0.9rem] px-4 py-3 text-left text-sm transition ${
                    selectedSort === option.value
                      ? "bg-[#faf7f2] text-[var(--brand)]"
                      : "text-slate-700 hover:bg-[#faf9f7]"
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedSort === option.value ? (
                    <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="hidden overflow-hidden rounded-[8px] border border-[#e7e3dc] bg-white lg:inline-flex">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={selectedView === option.value}
              onClick={() => updateParam("view", option.value)}
              className={`flex h-[40px] w-[46px] items-center justify-center border-l border-[#e7e3dc] p-[9px] text-slate-400 transition first:border-l-0 ${
                selectedView === option.value
                  ? "bg-[#f4f4f2] text-slate-900"
                  : "bg-white hover:bg-[#faf9f7] hover:text-slate-700"
              }`}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
