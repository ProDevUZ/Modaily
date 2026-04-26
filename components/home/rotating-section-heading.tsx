"use client";

import { useEffect, useMemo, useState } from "react";

import { renderRichText } from "@/lib/rich-text";

type RotatingSectionHeadingProps = {
  fallback: string;
  texts?: string[];
  textClassName: string;
  accentClassName?: string;
  wrapperClassName?: string;
};

export function RotatingSectionHeading({
  fallback,
  texts = [],
  textClassName,
  accentClassName,
  wrapperClassName = ""
}: RotatingSectionHeadingProps) {
  const normalizedTexts = useMemo(() => {
    const values = texts
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value));

    return values.length > 0 ? values : [fallback];
  }, [fallback, texts]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setActiveIndex(0);
    setVisible(true);
  }, [normalizedTexts]);

  useEffect(() => {
    if (normalizedTexts.length <= 1) {
      return;
    }

    let fadeTimer: number | undefined;
    const switchTimer = window.setTimeout(() => {
      setVisible(false);

      fadeTimer = window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % normalizedTexts.length);
        setVisible(true);
      }, 220);
    }, 2000);

    return () => {
      window.clearTimeout(switchTimer);
      if (fadeTimer) {
        window.clearTimeout(fadeTimer);
      }
    };
  }, [activeIndex, normalizedTexts]);

  const activeText = normalizedTexts[activeIndex] ?? fallback;

  return (
    <div className={`mx-auto w-full max-w-[60rem] md:w-[60%] ${wrapperClassName}`.trim()}>
      {accentClassName ? <div className={accentClassName} /> : null}
      <div className={`transition duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
        {renderRichText(activeText, {
          containerClassName: "space-y-3 text-center",
          blockClassName: `whitespace-pre-line ${textClassName}`.trim(),
          listClassName: `mx-auto inline-block list-disc space-y-2 pl-5 text-left ${textClassName}`.trim(),
          listItemClassName: "whitespace-pre-line"
        })}
      </div>
    </div>
  );
}
