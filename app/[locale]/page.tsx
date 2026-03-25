import type { Metadata } from "next";
import Link from "next/link";

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
    bestsellers: "Bestsellery",
    moreProducts: "Bol'she produktov",
    gallery: "Galereya",
    videos: "Video galereya",
    reviews: "Otzyvy",
    learnMore: "Uznat' podrobnee"
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

function graySurface(imageUrl: string, opacity = 0.52) {
  return {
    backgroundImage: `linear-gradient(rgba(237,237,237,${opacity}), rgba(237,237,237,${opacity})), radial-gradient(circle at 12% 16%, rgba(255,255,255,0.38) 0, transparent 18%), radial-gradient(circle at 76% 70%, rgba(0,0,0,0.06) 0, transparent 22%), radial-gradient(circle at 30% 82%, rgba(0,0,0,0.04) 0, transparent 12%), url(${imageUrl})`,
    backgroundColor: "#e2e2e2",
    backgroundSize: "cover",
    backgroundPosition: "center"
  };
}

function softPhotoSurface(imageUrl: string, tint: string) {
  return {
    backgroundImage: `linear-gradient(${tint}, ${tint}), url(${imageUrl})`,
    backgroundColor: "#f2f2f2",
    backgroundSize: "cover",
    backgroundPosition: "center"
  };
}

function MiniBottle() {
  return (
    <div className="relative h-[146px] w-[64px]">
      <div className="absolute left-1/2 top-0 h-[38px] w-[30px] -translate-x-1/2 rounded-t-[20px] rounded-b-[8px] bg-[linear-gradient(180deg,#db1534_0%,#bb102b_100%)]" />
      <div className="absolute bottom-0 left-1/2 h-[112px] w-[50px] -translate-x-1/2 rounded-[18px] bg-[linear-gradient(180deg,#fff_0%,#f7f7f7_100%)] shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
        <div className="pt-[44px] text-center text-[7px] font-black uppercase tracking-[0.16em] text-[#c61731]">Modaily</div>
      </div>
    </div>
  );
}

function HeroPackshot() {
  return (
    <div className="relative h-[360px] w-full">
      <div className="absolute bottom-[18px] left-[32px] h-[120px] w-[150px] rounded-[8px] bg-[linear-gradient(180deg,#cf1730_0%,#ad1028_100%)] shadow-[0_16px_38px_rgba(0,0,0,0.16)]" />
      <div className="absolute bottom-[118px] left-[62px] h-[86px] w-[86px] rounded-full bg-[linear-gradient(180deg,#e31839_0%,#bf132d_100%)] shadow-[0_10px_28px_rgba(0,0,0,0.16)]" />
      <div className="absolute bottom-[76px] left-[52px] h-[120px] w-[104px] rounded-[18px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]" />
      <div className="absolute bottom-[62px] left-[178px] h-[210px] w-[78px] rounded-[8px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]" />
      <div className="absolute bottom-[56px] left-[284px] h-[240px] w-[60px] rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)] shadow-[0_16px_40px_rgba(0,0,0,0.14)]" />
      <div className="absolute bottom-[252px] left-[292px] h-[54px] w-[46px] rounded-t-[22px] rounded-b-[10px] bg-[linear-gradient(180deg,#dc1735_0%,#ba1029_100%)]" />
    </div>
  );
}

function ReviewStars({ rating }: { rating: number }) {
  return <span className="text-[13px] tracking-[0.24em] text-[#d41230]">{Array.from({ length: rating }, () => "*").join("")}</span>;
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
        <div className="mx-auto max-w-[1038px] overflow-hidden border-b border-black/10">
          <div className="grid min-h-[392px] lg:grid-cols-[1fr_1fr]" style={graySurface(content.hero.imageUrl, 0.58)}>
            <div className="flex flex-col justify-center px-8 py-8 lg:px-10">
              <p className="text-[10px] uppercase tracking-[0.35em] text-black/28">Novinka</p>
              <h1 className="mt-3 max-w-[8.5ch] text-[40px] font-black uppercase leading-[0.93] tracking-[-0.06em] text-[#494949] lg:text-[54px]">
                {content.hero.title}
              </h1>
              <p className="mt-4 max-w-[370px] text-[13px] leading-6 text-black/48">{content.hero.description}</p>
              <Link href={content.hero.primaryCtaLink} className="mt-7 inline-flex h-[38px] w-[170px] items-center justify-center bg-[#cf1230] text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                {copy.learnMore}
              </Link>
            </div>

            <div className="hidden items-end justify-center px-4 py-7 lg:flex">
              <HeroPackshot />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 lg:px-6">
        <div className="mx-auto max-w-[1038px]">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] tracking-[-0.03em]">{copy.bestsellers}</h2>
            <Link href={`/${locale}/catalog`} className="text-[12px] text-[#cf1230]">
              {copy.moreProducts} __
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {content.bestsellers.slice(0, 4).map((product) => (
              <article key={product.id}>
                <div className="flex h-[156px] items-center justify-center bg-[#f5f5f5]">
                  <MiniBottle />
                </div>
                <h3 className="mt-3 min-h-[40px] text-[12px] uppercase leading-4 tracking-[-0.03em] text-[#2f2f2f]">{product.name}</h3>
                <Link href={`/${locale}/catalog/${product.slug}`} className="mt-2 inline-flex h-[30px] w-full items-center justify-center border border-black/40 text-[9px] uppercase tracking-[0.18em] text-black/72">
                  {copy.learnMore}
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-5 h-[2px] w-full bg-black/8">
            <div className="h-full w-[72%] bg-black" />
          </div>
        </div>
      </section>

      <section className="px-4 py-2 lg:px-6">
        <div className="mx-auto grid max-w-[1038px] gap-5 lg:grid-cols-2">
          {promoCards.slice(0, 2).map((card, index) => (
            <article key={`${card.id}-${index}`}>
              <div className="h-[218px] overflow-hidden rounded-[10px]" style={softPhotoSurface(card.imageUrl, index === 0 ? "rgba(240,240,240,0.35)" : "rgba(255,255,255,0.18)")}>
                {index === 0 ? (
                  <div className="flex h-full items-end justify-center pb-5">
                    <div className="w-[224px] scale-[0.68]">
                      <HeroPackshot />
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="px-1 py-4">
                <h3 className="text-[16px] uppercase tracking-[-0.04em] text-[#383838]">{card.title}</h3>
                <p className="mt-2 min-h-[48px] text-[10px] leading-5 text-black/48">{card.description}</p>
                <Link href={card.buttonLink} className="mt-4 inline-flex h-[32px] w-[152px] items-center justify-center border border-black/35 text-[9px] uppercase tracking-[0.18em] text-black/72">
                  {copy.learnMore}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 lg:px-6">
        <div className="mx-auto max-w-[1038px]">
          <h2 className="text-[26px] tracking-[-0.05em]">{copy.gallery}</h2>
          <div className="mt-5 grid grid-cols-12 gap-3">
            {galleryImages.map((item, index) => {
              const spans = [
                "col-span-6 md:col-span-3",
                "col-span-6 md:col-span-3",
                "col-span-6 md:col-span-3",
                "col-span-6 md:col-span-3",
                "col-span-6 md:col-span-3",
                "col-span-12 md:col-span-4",
                "col-span-6 md:col-span-2",
                "col-span-6 md:col-span-3"
              ];

              const tones = [
                "rgba(242,223,211,0.32)",
                "rgba(245,230,221,0.22)",
                "rgba(224,196,184,0.12)",
                "rgba(243,230,226,0.2)",
                "rgba(223,188,181,0.2)",
                "rgba(207,171,166,0.16)",
                "rgba(243,231,213,0.1)",
                "rgba(232,232,232,0.12)"
              ];

              return (
                <div
                  key={`${item.id}-${index}`}
                  className={`${spans[index]} min-h-[160px] overflow-hidden rounded-[12px] md:min-h-[180px]`}
                  style={softPhotoSurface(item.imageUrl, tones[index])}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section id="video-gallery" className="px-4 py-8 lg:px-6">
        <div className="mx-auto max-w-[1038px]">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-[2px] w-[228px] bg-[#cf1230]" />
              <h2 className="mt-4 text-[20px] text-black/62">{copy.videos}</h2>
            </div>
            <div className="flex gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c21330] text-[12px] text-white">&lt;</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c21330] text-[12px] text-white">&gt;</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {videoItems.map((video, index) => (
              <div
                key={`${video.id}-${index}`}
                className="relative h-[332px] overflow-hidden rounded-[14px]"
                style={softPhotoSurface(video.imageUrl, index === 2 ? "rgba(80,55,40,0.18)" : "rgba(255,255,255,0.12)")}
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(0,0,0,0.18)_100%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-black/48 text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
                    Play
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 bg-[linear-gradient(135deg,#820d20_0%,#ba102d_50%,#8f1326_100%)] px-4 py-8 text-white lg:px-6">
        <div className="mx-auto max-w-[1038px]">
          <h2 className="text-[22px]">{copy.reviews}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((item, index) => (
              <article key={`${item.id}-${index}`} className="rounded-[16px] bg-white px-4 py-4 text-black shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold">{item.authorName}</p>
                    <p className="mt-1 text-[11px] text-black/45">{item.authorRole || item.productName}</p>
                  </div>
                  <ReviewStars rating={item.rating} />
                </div>
                <p className="mt-4 text-[12px] leading-6 text-black/68">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-[1038px]">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-[26px] uppercase tracking-[-0.06em] text-[#cf1230]">{content.about.title}</h2>
              <p className="mt-4 max-w-[470px] text-[12px] leading-6 text-black/64">{content.about.description}</p>
            </div>
            <div>
              <p className="text-right text-[28px] font-black uppercase tracking-[-0.06em] text-[#cf1230]">MODAILY</p>
              <p className="mt-4 text-[12px] leading-6 text-black/64">{content.about.secondaryDescription || content.about.description}</p>
            </div>
          </div>

          <div className="mt-10 h-[360px] overflow-hidden rounded-[10px]" style={softPhotoSurface(content.about.imageUrl, "rgba(255,255,255,0.18)")}>
            <div className="flex h-full items-end justify-center gap-4 px-6 pb-8">
              <div className="h-[220px] w-[110px] rounded-[34px] bg-[linear-gradient(180deg,#fdfdfd_0%,#f0efef_100%)] shadow-[0_14px_36px_rgba(0,0,0,0.14)]" />
              <div className="h-[250px] w-[74px] rounded-[18px] bg-[linear-gradient(180deg,#cf1730_0%,#b10f29_100%)] shadow-[0_14px_36px_rgba(0,0,0,0.14)]" />
              <div className="h-[140px] w-[58px] rounded-[16px] bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)] shadow-[0_14px_36px_rgba(0,0,0,0.14)]" />
              <div className="h-[150px] w-[64px] rounded-[16px] bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)] shadow-[0_14px_36px_rgba(0,0,0,0.14)]" />
              <div className="h-[230px] w-[70px] rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)] shadow-[0_14px_36px_rgba(0,0,0,0.14)]" />
              <div className="h-[120px] w-[110px] rounded-[18px] bg-[linear-gradient(180deg,#cf1730_0%,#b00f28_100%)] shadow-[0_14px_36px_rgba(0,0,0,0.14)]" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
