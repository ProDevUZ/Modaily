import { FallbackImage } from "@/components/ui/fallback-image";

type VideoItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type VideoGalleryProps = {
  title: string;
  items: VideoItem[];
};

function GalleryArrow({ direction }: { direction: "left" | "right" }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ba0c2f] text-white">
      <svg
        viewBox="0 0 20 20"
        className={`h-4 w-4 ${direction === "left" ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M4 10h11" />
        <path d="m11 5 5 5-5 5" />
      </svg>
    </span>
  );
}

export function VideoGallery({ title, items }: VideoGalleryProps) {
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <div className="h-[3px] w-44 bg-[#ba0c2f] md:w-60" />
          <h2 className="mt-5 text-[34px] font-medium text-neutral-500 md:text-[40px]">
            {title}
          </h2>
        </div>

        <div className="hidden gap-3 md:flex">
          <GalleryArrow direction="left" />
          <GalleryArrow direction="right" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="grid overflow-hidden rounded-[24px]">
            <FallbackImage
              src={item.imageUrl || "https://placehold.co/375x667"}
              fallbackSrc="https://placehold.co/375x667/f1efeb/bb102b?text=Video"
              alt={item.title || `Video ${index + 1}`}
              className="col-start-1 row-start-1 h-[420px] w-full object-cover md:h-[720px]"
            />
            <div className="col-start-1 row-start-1 flex items-center justify-center bg-black/15">
              <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-black/50 text-white">
                <svg viewBox="0 0 20 20" className="ml-1 h-10 w-10 fill-current" aria-hidden="true">
                  <path d="M5.5 3.5 16 10 5.5 16.5V3.5Z" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
