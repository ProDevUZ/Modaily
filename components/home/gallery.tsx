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

const rowWidths = [
  "w-[260px] sm:w-[300px] lg:w-[472px]",
  "w-[210px] sm:w-[230px] lg:w-[268px]",
  "w-[250px] sm:w-[300px] lg:w-[436px]",
  "w-[250px] sm:w-[300px] lg:w-[436px]"
] as const;

function buildRows(items: GalleryItem[]) {
  if (items.length === 0) {
    return { topRow: [], bottomRow: [] };
  }

  if (items.length <= 8) {
    return {
      topRow: items,
      bottomRow: items
    };
  }

  const midpoint = Math.ceil(items.length / 2);

  return {
    topRow: items.slice(0, midpoint),
    bottomRow: items.slice(midpoint)
  };
}

function GalleryRow({
  items,
  animationClass
}: {
  items: GalleryItem[];
  animationClass: string;
}) {
  if (items.length === 0) {
    return null;
  }

  const loopItems = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div className={`flex w-max gap-4 sm:gap-5 ${animationClass}`}>
        {loopItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`shrink-0 overflow-hidden rounded-[24px] ${rowWidths[index % rowWidths.length]}`}
          >
            <FallbackImage
              src={item.imageUrl}
              fallbackSrc="https://placehold.co/472x326/f4f4f2/bb102b?text=Gallery"
              alt={item.title || `Gallery item ${index + 1}`}
              className="h-[220px] w-full object-cover sm:h-[250px] lg:h-[326px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Gallery({ title, items }: GalleryProps) {
  const { topRow, bottomRow } = buildRows(items);

  return (
    <section className="space-y-8">
      <h2 className="px-8 text-[42px] tracking-[-0.04em] text-black md:px-10 md:text-[56px] lg:px-12">
        {title}
      </h2>

      <div className="space-y-4 sm:space-y-5">
        <GalleryRow items={topRow} animationClass="gallery-marquee-left" />
        <GalleryRow items={bottomRow} animationClass="gallery-marquee-right" />
      </div>
    </section>
  );
}
