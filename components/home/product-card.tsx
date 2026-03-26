import Link from "next/link";

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
    <article className="flex h-full flex-col gap-5">
      <div className="grid overflow-hidden rounded-[20px]">
        <img
          src={imageUrl || "https://placehold.co/584x356"}
          alt={title}
          className="col-start-1 row-start-1 h-[260px] w-full object-cover md:h-[320px] xl:h-[356px]"
        />
        <div className="col-start-1 row-start-1 bg-white/10" />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.06em] text-black md:text-base">
          {title}
        </h3>
        <p className="text-[11px] uppercase leading-5 text-neutral-500 md:text-xs md:leading-6">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex min-h-[46px] w-full items-center justify-center border border-black px-6 text-center text-[11px] uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white sm:w-[256px]"
      >
        {buttonLabel}
      </Link>
    </article>
  );
}
