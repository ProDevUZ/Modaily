import { FallbackImage } from "@/components/ui/fallback-image";

type ReviewItem = {
  id: string;
  authorName: string;
  authorRole: string;
  body: string;
  avatarUrl: string;
  rating: number;
};

type ReviewsProps = {
  title: string;
  items: ReviewItem[];
};

function splitRows<T>(items: T[]) {
  if (items.length === 0) {
    return { topRow: [], bottomRow: [] };
  }

  const midpoint = Math.ceil(items.length / 2);

  return {
    topRow: items.slice(0, midpoint),
    bottomRow: items.slice(midpoint)
  };
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-[#ba0c2f]">
      {Array.from({ length: rating }).map((_, index) => (
        <svg key={index} viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden="true">
          <path d="m10 1.8 2.54 5.14 5.67.82-4.1 4 1 5.64L10 14.74 4.89 17.4l.98-5.64-4.1-4 5.67-.82L10 1.8Z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const avatarSrc =
    item.avatarUrl && !item.avatarUrl.includes("/images/home/avatar-") ? item.avatarUrl : "/images/home/ModailyProduct.png";

  return (
    <article className="w-[360px] shrink-0 rounded-[24px] bg-white p-6 text-[#0f1125] shadow-[0_16px_30px_rgba(0,0,0,0.08)] sm:w-[420px] xl:w-[520px]">
      <div className="flex items-start gap-4">
        <FallbackImage
          src={avatarSrc}
          fallbackSrc="/images/home/ModailyProduct.png"
          alt={item.authorName}
          className="h-14 w-14 rounded-full object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-[18px] font-semibold">{item.authorName}</h3>
              <p className="text-[14px] text-[#717276]">{item.authorRole}</p>
            </div>
            <Stars rating={item.rating} />
          </div>

          <div className="my-4 border-t border-[#e9eff5]" />

          <p className="text-[15px] leading-8">{item.body}</p>
        </div>
      </div>
    </article>
  );
}

function ReviewRow({
  items,
  animationClass
}: {
  items: ReviewItem[];
  animationClass: string;
}) {
  if (items.length === 0) {
    return null;
  }

  const loopItems = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-4 sm:gap-6 ${animationClass}`}>
        {loopItems.map((item, index) => (
          <ReviewCard key={`${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export function Reviews({ title, items }: ReviewsProps) {
  const { topRow, bottomRow } = splitRows(items);

  return (
    <section className="space-y-8 py-10 text-white md:py-12">
      <h2 className="px-8 text-[42px] tracking-[-0.04em] md:px-10 md:text-[56px] lg:px-12">
        {title}
      </h2>

      <div className="space-y-4 sm:space-y-5">
        <ReviewRow items={topRow} animationClass="gallery-marquee-left" />
        <ReviewRow items={bottomRow.length > 0 ? bottomRow : topRow} animationClass="gallery-marquee-right" />
      </div>
    </section>
  );
}
