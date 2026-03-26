import type { Metadata } from "next";
import Link from "next/link";

import { Gallery } from "@/components/home/gallery";
import { ProductCard } from "@/components/home/product-card";
import { Reviews } from "@/components/home/reviews";
import { VideoGallery } from "@/components/home/video-gallery";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getHomePageContent } from "@/lib/storefront-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const labels = {
  uz: {
    bestsellers: "Bestsellerlar",
    moreProducts: "Boshqa mahsulotlar",
    gallery: "Galereya",
    videos: "Video galereya",
    reviews: "Otzivlar",
    learnMore: "Batafsil"
  },
  ru: {
    bestsellers: "Бестселлеры",
    moreProducts: "Больше продуктов",
    gallery: "Галерея",
    videos: "Видео галерея",
    reviews: "Отзывы",
    learnMore: "Узнать подробнее"
  },
  en: {
    bestsellers: "Bestsellers",
    moreProducts: "More products",
    gallery: "Gallery",
    videos: "Video gallery",
    reviews: "Reviews",
    learnMore: "Learn more"
  }
} as const;

function repeatToCount<T>(items: T[], count: number) {
  if (items.length === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => items[index % items.length]);
}

function MiniBottle() {
  return (
    <div className="flex h-[146px] w-[64px] flex-col items-center justify-end">
      <div className="h-[34px] w-[28px] rounded-t-[20px] rounded-b-[8px] bg-[linear-gradient(180deg,#db1534_0%,#bb102b_100%)]" />
      <div className="flex h-[112px] w-[50px] items-start justify-center rounded-[18px] bg-[linear-gradient(180deg,#fff_0%,#f7f7f7_100%)] pt-[34px] shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
        <div className="text-center text-[7px] font-black uppercase tracking-[0.16em] text-[#c61731]">
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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);

  return {
    title: dictionary.meta.home.title,
    description: dictionary.meta.home.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        uz: "/uz",
        ru: "/ru",
        en: "/en"
      }
    }
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const dictionary = getDictionary(locale);
  const content = await getHomePageContent(locale);
  const copy = labels[locale];
  const galleryImages = repeatToCount(content.galleryImages, 8);
  const promoCards = repeatToCount(content.promoCards, 2);
  const testimonials = repeatToCount(content.testimonials, 6);
  const videoItems = repeatToCount(content.galleryVideos, 3);

  return (
    <div className="bg-white text-black">
      <section className="px-4 pt-0 lg:px-6">
        <div className="mx-auto max-w-[1320px] overflow-hidden border-b border-black/10 bg-[#f2f2f0]">
          <div className="grid min-h-[560px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center px-8 py-10 lg:px-12 xl:px-14">
              <p className="text-[12px] uppercase tracking-[0.35em] text-black/35">
                {content.hero.badge || "Novinka"}
              </p>
              <h1 className="mt-4 max-w-[8.5ch] text-[56px] font-black uppercase leading-[0.9] tracking-[-0.07em] text-[#494949] lg:text-[76px] xl:text-[86px]">
                {content.hero.title}
              </h1>
              <p className="mt-5 max-w-[460px] text-[18px] leading-8 text-black/56">{content.hero.description}</p>
              <Link
                href={content.hero.primaryCtaLink}
                className="mt-8 inline-flex h-[52px] w-[220px] items-center justify-center bg-[#cf1230] text-[12px] font-semibold uppercase tracking-[0.22em] text-white"
              >
                {content.hero.primaryCta || copy.learnMore}
              </Link>
            </div>

            <div className="hidden items-end justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.52)_0%,rgba(255,255,255,0)_68%)] px-8 py-10 lg:flex">
              <FallbackImage
                src={content.hero.imageUrl || "https://placehold.co/720x555"}
                fallbackSrc="https://placehold.co/720x555/f1f1ef/bb102b?text=Modaily+Hero"
                alt={content.hero.title}
                className="max-h-[500px] w-full max-w-[720px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[34px] tracking-[-0.05em] md:text-[46px]">{copy.bestsellers}</h2>
            <Link href={`/${locale}/catalog`} className="text-[15px] text-[#cf1230]">
              {copy.moreProducts} __
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {content.bestsellers.slice(0, 4).map((product) => (
              <article key={product.id}>
                <div className="flex h-[290px] items-center justify-center bg-[#f5f5f5]">
                  <ProductPackshot imageUrl={product.imageUrl} name={product.name} />
                </div>
                <h3 className="mt-4 min-h-[54px] text-[18px] uppercase leading-6 tracking-[-0.03em] text-[#2f2f2f]">{product.name}</h3>
                <Link href={`/${locale}/catalog/${product.slug}`} className="mt-3 inline-flex h-[46px] w-full items-center justify-center border border-black/40 text-[12px] uppercase tracking-[0.18em] text-black/72">
                  {copy.learnMore}
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 h-[3px] w-full bg-black/8">
            <div className="h-full w-[72%] bg-black" />
          </div>
        </div>
      </section>

      <section className="px-4 py-6 lg:px-6">
        <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-2">
          {promoCards.slice(0, 2).map((card, index) => (
            <ProductCard
              key={`${card.id}-${index}`}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              href={card.buttonLink}
              buttonLabel={card.buttonLabel || copy.learnMore}
            />
          ))}
        </div>
      </section>

      <section className="px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-[1320px]">
          <Gallery title={copy.gallery} items={galleryImages} />
        </div>
      </section>

      <section id="video-gallery" className="px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-[1320px]">
          <VideoGallery title={copy.videos} items={videoItems} />
        </div>
      </section>

      <section className="mt-6 bg-[linear-gradient(135deg,#820d20_0%,#ba102d_50%,#8f1326_100%)] px-4 py-12 text-white lg:px-6">
        <div className="mx-auto max-w-[1320px]">
          <Reviews
            title={copy.reviews}
            items={testimonials.map((item, index) => ({
              id: `${item.id}-${index}`,
              authorName: item.authorName,
              authorRole: item.authorRole || item.productName,
              body: item.body,
              avatarUrl: item.avatarUrl,
              rating: item.rating
            }))}
          />
        </div>
      </section>

      <section id="about" className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[42px] uppercase tracking-[-0.06em] text-[#cf1230] md:text-[56px]">{content.about.title}</h2>
              <p className="mt-5 max-w-[560px] text-[16px] leading-8 text-black/64">{content.about.description}</p>
            </div>
            <div>
              <p className="text-right text-[40px] font-black uppercase tracking-[-0.06em] text-[#cf1230] md:text-[56px]">
                {content.about.secondaryTitle || "MODAILY"}
              </p>
              <p className="mt-5 text-[16px] leading-8 text-black/64">{content.about.secondaryDescription || content.about.description}</p>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-[10px] bg-[#f4f4f2]">
            <FallbackImage
              src={content.about.imageUrl || "https://placehold.co/1259x514"}
              fallbackSrc="https://placehold.co/1259x514/f4f4f2/bb102b?text=Modaily+About"
              alt={content.about.title}
              className="h-[360px] w-full object-cover md:h-[500px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
