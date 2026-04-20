"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

import { ProductBadgeStack } from "@/components/product-badge-stack";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { Locale } from "@/lib/i18n";
import type { StorefrontProductBadge } from "@/lib/product-badges";

type BestsellerMarqueeProduct = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  badges: StorefrontProductBadge[];
};

type BestsellerMarqueeProps = {
  locale: Locale;
  products: BestsellerMarqueeProduct[];
  learnMoreLabel: string;
};

function repeatToMinimum<T>(items: T[], minimum: number) {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length: Math.max(minimum, items.length) }, (_, index) => items[index % items.length]);
}

function MiniBottle() {
  return (
    <div className="flex h-[146px] w-[64px] flex-col items-center justify-end">
      <div className="h-[34px] w-[28px] rounded-t-[20px] rounded-b-[8px] bg-[linear-gradient(180deg,#db1534_0%,#bb102b_100%)]" />
      <div className="flex h-[112px] w-[50px] items-start justify-center rounded-[18px] bg-[linear-gradient(180deg,#fff_0%,#f7f7f7_100%)] pt-[34px] shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
        <div className="text-center text-[7px] font-black uppercase tracking-[0.16em] text-[var(--brand)]">
          Modaily
        </div>
      </div>
    </div>
  );
}

function ProductPackshot({ imageUrl, name }: { imageUrl: string; name: string }) {
  if (!imageUrl) {
    return <MiniBottle />;
  }

  return (
    <FallbackImage
      src={imageUrl}
      fallbackSrc="https://placehold.co/180x240/f3f3f3/bb102b?text=Modaily"
      alt={name}
      className="h-[240px] w-[180px] object-contain"
    />
  );
}

export function BestsellerMarquee({ locale, products, learnMoreLabel }: BestsellerMarqueeProps) {
  const router = useRouter();
  const baseProducts = useMemo(() => repeatToMinimum(products, 4), [products]);
  const loopProducts = useMemo(
    () => [...baseProducts, ...baseProducts, ...baseProducts],
    [baseProducts]
  );
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const adjustingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller || baseProducts.length === 0) {
      return;
    }

    scroller.scrollLeft = scroller.scrollWidth / 3;

    let frameId = 0;
    let lastTimestamp = 0;
    const speed = 0.035;

    const step = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
      }

      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!pausedRef.current && !draggingRef.current) {
        scroller.scrollLeft += delta * speed;
        normalizeScrollPosition();
      }

      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [baseProducts.length]);

  function normalizeScrollPosition() {
    const scroller = scrollerRef.current;

    if (!scroller || adjustingRef.current) {
      return;
    }

    const segmentWidth = scroller.scrollWidth / 3;
    const minThreshold = segmentWidth * 0.5;
    const maxThreshold = segmentWidth * 1.5;

    if (scroller.scrollLeft > minThreshold && scroller.scrollLeft < maxThreshold) {
      return;
    }

    adjustingRef.current = true;

    while (scroller.scrollLeft <= minThreshold) {
      scroller.scrollLeft += segmentWidth;
    }

    while (scroller.scrollLeft >= maxThreshold) {
      scroller.scrollLeft -= segmentWidth;
    }

    requestAnimationFrame(() => {
      adjustingRef.current = false;
    });
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    draggingRef.current = true;
    pausedRef.current = true;
    suppressClickRef.current = false;
    startXRef.current = event.clientX;
    startScrollRef.current = scroller.scrollLeft;
    scroller.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) {
      return;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const delta = event.clientX - startXRef.current;

    if (Math.abs(delta) > 6) {
      suppressClickRef.current = true;
    }

    scroller.scrollLeft = startScrollRef.current - delta;
    normalizeScrollPosition();
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) {
      return;
    }

    const scroller = scrollerRef.current;

    draggingRef.current = false;

    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }

    if (!suppressClickRef.current && event.pointerType === "mouse") {
      const target = document.elementFromPoint(event.clientX, event.clientY);
      const link = target?.closest<HTMLAnchorElement>("[data-bestseller-link='true']");
      const href = link?.getAttribute("href");

      if (href) {
        router.push(href);
      }
    }

    pausedRef.current = false;
    normalizeScrollPosition();
    suppressClickRef.current = false;
  }

  function handleClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

  if (baseProducts.length === 0) {
    return null;
  }

  return (
    <div
      ref={scrollerRef}
      className="bestseller-scroller mt-7 overflow-x-auto overscroll-x-contain"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        if (!draggingRef.current) {
          pausedRef.current = false;
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onScroll={normalizeScrollPosition}
      onClickCapture={handleClickCapture}
    >
      <div className="flex w-max items-start gap-4 pr-4 lg:gap-[10px] lg:pr-[10px]">
        {loopProducts.map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            href={`/${locale}/catalog/${product.slug}`}
            data-bestseller-link="true"
            className="relative w-[182px] shrink-0 select-none sm:w-[220px] lg:w-[290px] xl:w-[320px]"
            aria-label={product.name}
          >
            <div className="relative flex h-[228px] items-center justify-center bg-[#f5f5f5] md:h-[260px] lg:h-[290px]">
              <ProductBadgeStack badges={product.badges || []} />
              <ProductPackshot imageUrl={product.imageUrl} name={product.name} />
            </div>
            <h3 className="mt-3 min-h-[44px] text-[13px] uppercase leading-[1.25] tracking-[-0.03em] text-[#2f2f2f] lg:mt-4 lg:min-h-[54px] lg:text-[18px] lg:leading-6">
              {product.name}
            </h3>
            <span className="relative z-[2] mt-3 inline-flex h-[42px] w-full items-center justify-center border border-black/40 text-[11px] uppercase tracking-[0.18em] text-black/72 lg:h-[46px] lg:text-[12px]">
              {learnMoreLabel}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
