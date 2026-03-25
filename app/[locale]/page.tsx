import type { Metadata } from "next";
import Link from "next/link";

import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getHomePageContent } from "@/lib/storefront-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const sectionCopy = {
  uz: {
    bestsellers: "Bestsellerlar",
    moreProducts: "Ko'proq mahsulotlar",
    gallery: "Galereya",
    videos: "Video galereya",
    reviews: "Otzivlar"
  },
  ru: {
    bestsellers: "Бестселлеры",
    moreProducts: "Больше продуктов",
    gallery: "Галерея",
    videos: "Видео галерея",
    reviews: "Отзывы"
  },
  en: {
    bestsellers: "Bestsellers",
    moreProducts: "More products",
    gallery: "Gallery",
    videos: "Video gallery",
    reviews: "Reviews"
  }
} as const;

function mediaBackground(imageUrl: string, from: string, to: string) {
  return {
    backgroundImage: `linear-gradient(135deg, ${from}, ${to}), url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  };
}

function ProductSilhouette() {
  return (
    <div className="relative h-44 w-24">
      <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-t-[1.6rem] bg-[linear-gradient(180deg,#d91433_0%,#b50b27_100%)] shadow-lg" />
      <div className="absolute bottom-0 left-1/2 h-36 w-20 -translate-x-1/2 rounded-[1.8rem] bg-[linear-gradient(180deg,#fff_0%,#f7f7f7_100%)] shadow-[0_18px_35px_rgba(0,0,0,0.12)]">
        <div className="px-4 pt-12 text-center text-[9px] font-black uppercase tracking-[0.22em] text-[#c21730]">Modaily</div>
      </div>
    </div>
  );
}

function Stars({ count }: { count: number }) {
  return <div className="text-sm tracking-[0.32em] text-[#d1122f]">{"*".repeat(count)}</div>;
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
  const copy = sectionCopy[locale];

  return (
    <div className="bg-white text-[#1a1a1a]">
      <section className="px-4 pt-4 lg:px-8 lg:pt-5">
        <div
          className="mx-auto grid min-h-[620px] max-w-[1240px] overflow-hidden rounded-[0.15rem] border border-black/5 px-8 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-16"
          style={mediaBackground(content.hero.imageUrl, "#efefef", "#dadada")}
        >
          <div className="flex flex-col justify-center">
            <p className="text-[1.05rem] text-black/45">{content.hero.badge}</p>
            <h1 className="mt-3 max-w-[10ch] text-[3.4rem] font-black uppercase leading-[0.95] tracking-[-0.06em] text-[#4b4b4b] sm:text-[4.4rem] lg:text-[5.2rem]">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-black/58">{content.hero.description}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href={content.hero.primaryCtaLink} className="inline-flex min-w-56 items-center justify-center bg-[#d1122f] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {content.hero.primaryCta}
              </Link>
              <Link href={content.hero.secondaryCtaLink} className="inline-flex min-w-56 items-center justify-center border border-black/20 bg-white/70 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black/70">
                {content.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative mt-10 hidden min-h-[460px] lg:block">
            <div className="absolute bottom-6 left-8 h-40 w-56 rounded-[2rem] bg-[linear-gradient(180deg,#d1122f_0%,#aa0d26_100%)] shadow-[0_22px_70px_rgba(0,0,0,0.18)]" />
            <div className="absolute bottom-28 left-16 flex items-end gap-8">
              <div className="relative">
                <div className="absolute inset-x-4 bottom-0 h-12 rounded-full bg-black/15 blur-2xl" />
                <div className="relative">
                  <div className="mb-4 h-28 w-28 rounded-full bg-[linear-gradient(180deg,#e01a3c_0%,#b50f2c_100%)]" />
                  <div className="h-36 w-32 rounded-[1.8rem] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]" />
                </div>
              </div>
              <div className="h-72 w-28 rounded-[1rem] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]" />
              <div className="h-80 w-24 rounded-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)] shadow-[0_18px_40px_rgba(0,0,0,0.16)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[2rem] font-medium tracking-[-0.04em]">{copy.bestsellers}</h2>
            <Link href={`/${locale}/catalog`} className="text-sm font-medium text-[#d1122f]">
              {copy.moreProducts} -&gt;
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.bestsellers.map((product) => (
              <article key={product.id} className="group">
                <div className="flex min-h-[290px] items-center justify-center bg-[#f6f6f6] px-6 py-8 transition group-hover:bg-[#f1f1f1]">
                  <ProductSilhouette />
                </div>
                <div className="px-1 py-4">
                  <h3 className="max-w-[14ch] text-[1.05rem] uppercase leading-6 tracking-[-0.04em] text-[#242424]">{product.name}</h3>
                  <p className="mt-2 text-sm text-black/45">${product.price}</p>
                  <Link href={`/${locale}/catalog/${product.slug}`} className="mt-5 inline-flex w-full items-center justify-center border border-black/30 px-6 py-3 text-sm uppercase tracking-[0.14em] text-black/70">
                    {content.hero.primaryCta || dictionary.hero.secondaryCta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-[1240px] border-t border-black/15 pt-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {content.promoCards.map((card, index) => (
              <article key={card.id}>
                <div className="h-[320px] rounded-[1.35rem]" style={mediaBackground(card.imageUrl, index % 2 === 0 ? "#e5e5e5" : "#f8e6e6", index % 2 === 0 ? "#d9d9d9" : "#ffffff")} />
                <div className="px-2 py-4">
                  <h3 className="text-xl uppercase tracking-[-0.04em] text-[#343434]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-black/52">{card.description}</p>
                  <Link href={card.buttonLink} className="mt-5 inline-flex min-w-56 items-center justify-center border border-black/30 px-6 py-3 text-sm uppercase tracking-[0.16em] text-black/75">
                    {card.buttonLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="text-[2.8rem] font-medium tracking-[-0.06em]">{copy.gallery}</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {content.galleryImages.map((item, index) => (
              <div
                key={item.id}
                className={`rounded-[1.3rem] ${index === 4 ? "md:col-span-2" : ""} ${index === 0 ? "xl:row-span-2" : ""} min-h-[190px]`}
                style={mediaBackground(item.imageUrl, index % 2 === 0 ? "#f0d3c3" : "#f4efe8", index % 3 === 0 ? "#d9b1a1" : "#d9d9d9")}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="video-gallery" className="px-4 py-10 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="h-0.5 w-52 bg-[#d1122f]" />
              <h2 className="mt-4 text-[2rem] font-medium tracking-[-0.04em] text-black/55">{copy.videos}</h2>
            </div>
            <div className="flex gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b9102c] text-white">&lt;</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#b9102c] text-white">&gt;</span>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.galleryVideos.map((video, index) => (
              <div key={video.id} className="relative h-[380px] overflow-hidden rounded-[1.4rem]" style={mediaBackground(video.imageUrl, index % 2 === 0 ? "#ead2cb" : "#c8bea6", "#f4f1ec")}>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.18)_100%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-black/45 text-xs font-semibold uppercase tracking-[0.2em] text-white">Play</span>
                </div>
                <p className="absolute bottom-5 left-5 text-sm font-medium text-white">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 bg-[linear-gradient(135deg,#7a0a1d_0%,#b30f2c_50%,#861226_100%)] px-4 py-10 text-white lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <h2 className="text-[3rem] font-medium tracking-[-0.06em]">{copy.reviews}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.testimonials.map((item) => (
              <article key={item.id} className="rounded-[1.35rem] bg-white px-5 py-5 text-[#1f1f1f] shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{item.authorName}</p>
                    <p className="mt-1 text-xs text-black/45">{item.authorRole || item.productName}</p>
                  </div>
                  <Stars count={item.rating} />
                </div>
                <p className="mt-4 text-sm leading-7 text-black/68">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-14 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[2.9rem] font-light uppercase tracking-[-0.06em] text-[#d1122f]">{content.about.title}</h2>
              <p className="mt-6 max-w-xl text-sm leading-8 text-black/62">{content.about.description}</p>
            </div>
            <div>
              <p className="text-right text-[3rem] font-black uppercase tracking-[-0.06em] text-[#d1122f]">MODAILY</p>
              <p className="mt-6 text-sm leading-8 text-black/62">{content.about.secondaryDescription || content.about.description}</p>
            </div>
          </div>

          <div className="mt-12 h-[420px] rounded-[1.4rem]" style={mediaBackground(content.about.imageUrl, "#f6f0eb", "#ffffff")} />
        </div>
      </section>
    </div>
  );
}
