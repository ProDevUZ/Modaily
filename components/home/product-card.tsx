import Link from "next/link";

import { FallbackImage } from "@/components/ui/fallback-image";

type HomeProductCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  buttonLabel: string;
};

export function ProductCard({
  title,
  description,
  imageUrl,
  href,
  buttonLabel
}: HomeProductCardProps) {
  return (
    <article className="flex h-full flex-col gap-6">
      <div className="grid overflow-hidden rounded-[20px]">
        <FallbackImage
          src={imageUrl || "https://placehold.co/584x356"}
          fallbackSrc="https://placehold.co/584x356/f4f4f2/bb102b?text=Modaily"
          alt={title}
          className="col-start-1 row-start-1 h-[320px] w-full object-cover md:h-[380px] xl:h-[420px]"
        />
        <div className="col-start-1 row-start-1 bg-white/10" />
      </div>

      <div className="space-y-4">
        <h3 className="text-[18px] font-semibold uppercase tracking-[0.05em] text-black md:text-[22px]">
          {title}
        </h3>
        <p className="text-[13px] uppercase leading-6 text-neutral-500 md:text-[14px] md:leading-7">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex min-h-[52px] w-full items-center justify-center border border-black px-6 text-center text-[12px] uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white sm:w-[280px]"
      >
        {buttonLabel}
      </Link>
    </article>
  );
}
