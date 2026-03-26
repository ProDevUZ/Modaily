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

export function Reviews({ title, items }: ReviewsProps) {
  return (
    <section className="space-y-8 rounded-[32px] bg-[linear-gradient(135deg,#7e0d22_0%,#ba0c2f_52%,#8b1025_100%)] px-4 py-10 text-white md:px-8 md:py-12">
      <h2 className="text-[42px] font-medium tracking-[-0.05em] md:text-[56px]">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-[24px] bg-white p-7 text-[#0f1125] shadow-[0_16px_30px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-4">
              <FallbackImage
                src={item.avatarUrl || "https://placehold.co/56x56"}
                fallbackSrc="https://placehold.co/64x64/f0f0f0/bb102b?text=M"
                alt={item.authorName}
                className="h-16 w-16 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-[20px] font-semibold">{item.authorName}</h3>
                    <p className="text-[15px] text-[#717276]">{item.authorRole}</p>
                  </div>
                  <Stars rating={item.rating} />
                </div>

                <div className="my-4 border-t border-[#e9eff5]" />

                <p className="text-[17px] leading-8">{item.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
