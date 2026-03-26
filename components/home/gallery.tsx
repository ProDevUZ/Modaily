import { FallbackImage } from "@/components/ui/fallback-image";

type GalleryItem = {
  id: string;
  imageUrl: string;
  title: string;
};

type GalleryProps = {
  title: string;
  items: GalleryItem[];
};

const galleryPattern = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-4",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-3"
];

export function Gallery({ title, items }: GalleryProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-[42px] font-medium tracking-[-0.05em] text-black md:text-[56px]">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`overflow-hidden rounded-[24px] ${galleryPattern[index % galleryPattern.length]}`}
          >
            <FallbackImage
              src={item.imageUrl || "https://placehold.co/472x326"}
              fallbackSrc="https://placehold.co/472x326/f4f4f2/bb102b?text=Gallery"
              alt={item.title || `Gallery item ${index + 1}`}
              className="h-[260px] w-full object-cover md:h-[360px]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
