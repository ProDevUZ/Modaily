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
    <section className="space-y-6">
      <h2 className="text-[32px] font-medium tracking-[-0.05em] text-black md:text-[50px]">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`overflow-hidden rounded-[24px] ${galleryPattern[index % galleryPattern.length]}`}
          >
            <img
              src={item.imageUrl || "https://placehold.co/472x326"}
              alt={item.title || `Gallery item ${index + 1}`}
              className="h-[240px] w-full object-cover md:h-[326px]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
