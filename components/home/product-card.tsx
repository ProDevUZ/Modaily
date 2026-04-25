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
    <article className="flex h-full flex-col items-start gap-5">
      <div className="grid w-full overflow-hidden rounded-tl-[5px] rounded-tr-[20px] rounded-br-[5px] rounded-bl-[20px] bg-[#f3f3f1]">
        <FallbackImage
          src={imageUrl || ""}
          fallbackSrc="https://placehold.co/584x356/f3f3f1/f3f3f1"
          alt={title}
          className="col-start-1 row-start-1 h-[280px] w-full object-cover md:h-[320px] xl:h-[356px]"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-[15px] uppercase leading-[2.4] tracking-[0.02em] text-black">
          {title}
        </h3>
        <p className="max-w-[584px] text-[10px] uppercase leading-5 text-[#666]">
          {description}
        </p>
      </div>

      <div className="flex w-full justify-end">
        <Link
          href={href}
          className="inline-flex h-[46px] w-full items-center justify-center border border-black px-6 text-center text-[13px] uppercase tracking-[0.16em] text-black transition hover:bg-black hover:text-white sm:w-[256px]"
        >
          {buttonLabel}
        </Link>
      </div>
    </article>
  );
}
