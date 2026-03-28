import type { Metadata } from "next";
import Link from "next/link";

import { Gallery } from "@/components/home/gallery";
import { ProductCard } from "@/components/home/product-card";
import { Reviews } from "@/components/home/reviews";
import { VideoGallery } from "@/components/home/video-gallery";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getLocalizedProducts } from "@/lib/products";
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

function getFallbackPromoCards(locale: keyof typeof labels) {
  const buttonLabel = labels[locale].learnMore;

  return [
    {
      id: "promo-fallback-1",
      title:
        locale === "ru"
          ? "В конце дня уделите себе несколько минут..."
          : locale === "en"
            ? "Take a few quiet minutes at the end of the day..."
            : "Kun oxirida o'zingiz uchun bir necha daqiqa ajrating...",
      description:
        locale === "ru"
          ? "Тонер глубоко увлажняет кожу, сыворотка ухаживает, а крем сохраняет мягкость и гладкость."
          : locale === "en"
            ? "Toner layers hydration, serum refines the look of skin, and cream seals in softness."
            : "Toner namlik beradi, serum parvarishlaydi, krem esa terini mayin va silliq saqlaydi.",
      buttonLabel,
      buttonLink: `/${locale}/catalog`,
      imageUrl: ""
    },
    {
      id: "promo-fallback-2",
      title: locale === "ru" ? "SLIN LIFTING COLLAGEN CREAM" : "SLIN LIFTING COLLAGEN CREAM",
      description:
        locale === "ru"
          ? "Гиалуроновая кислота, керамиды и пептиды помогают коже выглядеть более гладкой и упругой."
          : locale === "en"
            ? "Hyaluronic acid, ceramides and peptides help skin look smoother and more resilient."
            : "Gialuron kislotasi, keramidler va peptidlar terini silliqroq va tarangroq ko'rsatishga yordam beradi.",
      buttonLabel,
      buttonLink: `/${locale}/catalog`,
      imageUrl: ""
    }
  ];
}

function getFallbackGalleryItems() {
  return Array.from({ length: 8 }, (_, index) => ({
    id: `gallery-fallback-${index + 1}`,
    title: `Gallery ${index + 1}`,
    imageUrl: ""
  }));
}

function getFallbackVideoItems() {
  return Array.from({ length: 3 }, (_, index) => ({
    id: `video-fallback-${index + 1}`,
    title: `Video ${index + 1}`,
    imageUrl: ""
  }));
}

function getFallbackTestimonials(locale: keyof typeof labels) {
  return [
    {
      id: "testimonial-fallback-1",
      authorName: locale === "ru" ? "Азиза" : "Aziza",
      authorRole: locale === "ru" ? "Очищающая пенка Modaily" : "Modaily Cleanser",
      body:
        locale === "ru"
          ? "Пользуюсь косметикой MODAILY уже больше месяца. Кожа стала мягче, а текстура выглядит заметно ровнее."
          : locale === "en"
            ? "I have used MODAILY for over a month. My skin feels softer and the texture looks more even."
            : "MODAILY mahsulotlarini bir oydan ko'proq ishlatdim. Teri yumshadi va tekstura ancha tekis ko'rinadi.",
      avatarUrl: "",
      rating: 5
    },
    {
      id: "testimonial-fallback-2",
      authorName: locale === "ru" ? "Камола" : "Kamola",
      authorRole: locale === "ru" ? "Крем для рук Silk Touch Modaily" : "Silk Touch Hand Cream",
      body:
        locale === "ru"
          ? "Крем хорошо ложится под повседневный уход и держит ощущение комфорта в течение дня."
          : locale === "en"
            ? "The cream fits nicely into a daily routine and keeps skin comfortable throughout the day."
            : "Krem kundalik parvarishga yaxshi mos tushadi va kun bo'yi qulaylik hissini saqlab turadi.",
      avatarUrl: "",
      rating: 5
    },
    {
      id: "testimonial-fallback-3",
      authorName: locale === "ru" ? "Умида" : "Umida",
      authorRole: locale === "ru" ? "Очищающая пенка Modaily" : "Modaily Foam Cleanser",
      body:
        locale === "ru"
          ? "У меня чувствительная кожа, поэтому особенно важно, что формулы работают мягко и без раздражения."
          : locale === "en"
            ? "My skin is sensitive, so it matters that the formulas feel gentle and non-irritating."
            : "Mening terim sezgir, shuning uchun formulalar muloyim va bezovta qilmasligi juda muhim.",
      avatarUrl: "",
      rating: 5
    }
  ];
}

function MiniBottle() {
  return (
    <div className="flex h-[146px] w-[64px] flex-col items-center justify-end">
      <div className="h-[34px] w-[28px] rounded-t-[20px] rounded-b-[8px] bg-[linear-gradient(180deg,#db1534_0%,#bb102b_100%)]" />
      <div className="flex h-[112px] w-[50px] items-start justify-center rounded-[18px] bg-[linear-gradient(180deg,#fff_0%,#f7f7f7_100%)] pt-[34px] shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
        <div className="text-center text-[7px] font-black uppercase tracking-[0.16em] text-[var(--brand)]">
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
  const catalogProducts = getLocalizedProducts(locale);
  const copy = labels[locale];
  const bestsellerProducts =
    content.bestsellers.length > 0
      ? content.bestsellers
      : catalogProducts.slice(0, 4).map((product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          shortDescription: product.shortDescription,
          price: product.price,
          imageUrl: ""
        }));
  const galleryImages = repeatToCount(content.galleryImages.length > 0 ? content.galleryImages : getFallbackGalleryItems(), 8);
  const promoCards = repeatToCount(content.promoCards.length > 0 ? content.promoCards : getFallbackPromoCards(locale), 2);
  const testimonials = repeatToCount(content.testimonials.length > 0 ? content.testimonials : getFallbackTestimonials(locale), 6);
  const videoItems = repeatToCount(content.galleryVideos.length > 0 ? content.galleryVideos : getFallbackVideoItems(), 3);

  return (
    <div className="bg-white text-black">
      <section className="pt-0">
        <div className="grid min-h-[690px] w-full overflow-hidden border-b border-black/10 bg-[#ecebe8]">
          <FallbackImage
            src={content.hero.imageUrl || "/images/home/mainpage.jpg"}
            fallbackSrc="/images/home/mainpage.jpg"
            alt={content.hero.title}
            className="col-start-1 row-start-1 h-full min-h-[690px] w-full object-cover object-center"
          />
          <div className="col-start-1 row-start-1 bg-[linear-gradient(90deg,rgba(236,235,232,0.96)_0%,rgba(236,235,232,0.92)_28%,rgba(236,235,232,0.72)_46%,rgba(236,235,232,0.18)_68%,rgba(236,235,232,0.04)_100%)]" />
          <div className="col-start-1 row-start-1 mx-auto flex min-h-[690px] w-full max-w-[1760px] items-center px-8 lg:px-12 xl:px-[118px]">
            <div className="max-w-[760px] py-12">
              <p className="text-[18px] tracking-[0.02em] text-black/42">
                {content.hero.badge || "Novinka"}
              </p>
              <h1 className="hero-title mt-3 max-w-[8.5ch] text-[74px] uppercase leading-[0.92] tracking-[-0.045em] text-[#515151] lg:text-[88px] xl:text-[102px]">
                {content.hero.title}
              </h1>
              <p className="mt-8 max-w-[640px] text-[22px] leading-[1.55] text-black/55">{content.hero.description}</p>
              <Link
                href={content.hero.primaryCtaLink}
                className="mt-10 inline-flex h-[60px] w-[340px] items-center justify-center bg-[var(--brand)] text-[14px] font-medium uppercase tracking-[0.18em] text-white"
              >
                {content.hero.primaryCta || copy.learnMore}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-12 lg:px-12">
        <div className="mx-auto max-w-[1680px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[40px] tracking-[-0.04em] md:text-[50px]">{copy.bestsellers}</h2>
            <Link href={`/${locale}/catalog`} className="text-[18px] text-[var(--brand)]">
              {copy.moreProducts} __
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {bestsellerProducts.slice(0, 4).map((product) => (
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

      <section className="px-8 py-6 lg:px-12">
        <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-2">
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

      <section className="px-8 py-12 lg:px-12">
        <div className="mx-auto max-w-[1680px]">
          <Gallery title={copy.gallery} items={galleryImages} />
        </div>
      </section>

      <section id="video-gallery" className="px-8 py-12 lg:px-12">
        <div className="mx-auto max-w-[1680px]">
          <VideoGallery title={copy.videos} items={videoItems} />
        </div>
      </section>

      <section className="mt-6 bg-[linear-gradient(135deg,#820d20_0%,#ba102d_50%,#8f1326_100%)] px-8 py-12 text-white lg:px-12">
        <div className="mx-auto max-w-[1680px]">
          <Reviews
            title={copy.reviews}
            items={testimonials.map((item, index) => ({
              id: `${item.id}-${index}`,
              authorName: item.authorName,
              authorRole: item.authorRole,
              body: item.body,
              avatarUrl: item.avatarUrl,
              rating: item.rating
            }))}
          />
        </div>
      </section>

      <section id="about" className="px-8 py-16 lg:px-12">
        <div className="mx-auto max-w-[1680px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[42px] uppercase tracking-[-0.04em] text-[var(--brand)] md:text-[56px]">{content.about.title}</h2>
              <p className="mt-5 max-w-[560px] text-[16px] leading-8 text-black/64">{content.about.description}</p>
            </div>
            <div>
              <p className="font-display text-right text-[40px] uppercase tracking-[-0.04em] text-[var(--brand)] md:text-[56px]">
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
