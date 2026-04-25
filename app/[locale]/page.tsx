import type { Metadata } from "next";
import Link from "next/link";

import { BestsellerMarquee } from "@/components/home/bestseller-marquee";
import { Gallery } from "@/components/home/gallery";
import { ProductCard } from "@/components/home/product-card";
import { Reviews } from "@/components/home/reviews";
import { VideoGallery } from "@/components/home/video-gallery";
import { FooterGradientBackground } from "@/components/footer-gradient-background";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getStorefrontProducts, type StorefrontProduct } from "@/lib/storefront-products";
import { getHomePageContent } from "@/lib/storefront-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function repeatToMinimum<T>(items: T[], minimum: number) {
  if (items.length === 0) {
    return [];
  }

  if (items.length >= minimum) {
    return items;
  }

  return Array.from({ length: minimum }, (_, index) => items[index % items.length]);
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

function getLocalGalleryItems() {
  return Array.from({ length: 8 }, (_, index) => ({
    id: `gallery-local-${index + 1}`,
    title: `Gallery ${index + 1}`,
    imageUrl: `/images/Galary/${index + 1}.png`
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
  const catalogProducts = await getStorefrontProducts(locale);
  const copy = labels[locale];
  const bestsellerProducts =
    content.bestsellers.length > 0
      ? content.bestsellers
      : catalogProducts.slice(0, 4).map((product: StorefrontProduct) => ({
          id: product.id,
          sku: product.sku,
          slug: product.slug,
          category: product.category,
          categoryId: product.categoryId,
          categorySlug: product.categorySlug,
          categories: product.categories,
          categorySlugs: product.categorySlugs,
          skinTypes: product.skinTypes,
          size: product.size,
          name: product.name,
          shortName: product.shortName,
          shortDescription: product.shortDescription,
          description: product.description,
          price: product.price,
          discountAmount: product.discountAmount,
          hidePrice: product.hidePrice,
          stock: product.stock,
          colors: product.colors,
          badges: product.badges,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          h1: product.h1,
          imageUrl: product.imageUrl
        }));
  const gallerySource = content.galleryImages.some((item) => item.imageUrl?.trim()) ? content.galleryImages : getLocalGalleryItems();
  const galleryImages = gallerySource.length > 0 ? gallerySource : getFallbackGalleryItems();
  const promoCards = repeatToCount(content.promoCards.length > 0 ? content.promoCards : getFallbackPromoCards(locale), 2);
  const testimonials = repeatToCount(content.testimonials.length > 0 ? content.testimonials : getFallbackTestimonials(locale), 6);
  const validVideoItems = content.galleryVideos.filter((item) => item.videoUrl && !item.videoUrl.includes("example.com"));
  const videoItems = repeatToMinimum(validVideoItems, 3);

  return (
    <div className="bg-white text-black">
      <section className="pt-0">
        <Link
          href={content.hero.primaryCtaLink}
          aria-label={content.hero.primaryCta || copy.learnMore}
          className="grid h-[696px] w-full overflow-hidden border-b border-black/10 bg-[#ecebe8] lg:hidden"
        >
          <FallbackImage
            src={content.hero.imageUrl || "/images/home/mainpage.jpg"}
            fallbackSrc="/images/home/mainpage.jpg"
            alt={content.hero.title}
            className="col-start-1 row-start-1 h-full w-full object-cover object-[62%_4%]"
          />
          <div className="col-start-1 row-start-1 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.34)_66%,rgba(255,255,255,0.82)_79%,rgba(255,255,255,0.98)_89%,#ffffff_100%)]" />
          <div className="col-start-1 row-start-1 flex h-[696px] items-end px-[38px] pb-[31px]">
            <div className="w-full max-w-[338px]">
              <p className="text-[17px] leading-none tracking-[-0.02em] text-black/52">{content.hero.badge || "Novinka"}</p>
              <h1 className="hero-title mt-[11px] text-[35px] uppercase leading-[1.5] tracking-[-0.045em] text-[#1f1f1f]">
                {content.hero.title}
              </h1>
              <p className="mt-[14px] max-w-[332px] text-[15px] leading-[1.55] text-black/76">
                {content.hero.description}
              </p>
              <span className="mt-[28px] inline-flex h-[50px] w-[254px] items-center justify-center bg-[var(--brand)] text-[13px] uppercase tracking-[0.19em] text-white">
                {content.hero.primaryCta || copy.learnMore}
              </span>
            </div>
          </div>
        </Link>

        <Link
          href={content.hero.primaryCtaLink}
          aria-label={content.hero.primaryCta || copy.learnMore}
          className="hidden min-h-[460px] w-full overflow-hidden border-b border-black/10 bg-[#ecebe8] lg:grid md:min-h-[520px] xl:min-h-[555px]"
        >
          <FallbackImage
            src={content.hero.imageUrl || "/images/home/mainpage.jpg"}
            fallbackSrc="/images/home/mainpage.jpg"
            alt={content.hero.title}
            className="col-start-1 row-start-1 h-full min-h-[460px] w-full object-cover object-center md:min-h-[520px] xl:min-h-[555px]"
          />
          <div className="col-start-1 row-start-1 bg-[linear-gradient(90deg,rgba(241,240,236,0.22)_0%,rgba(241,240,236,0.14)_14%,rgba(241,240,236,0.06)_24%,rgba(241,240,236,0.00)_34%)]" />
          <div className="col-start-1 row-start-1 mx-auto flex min-h-[460px] w-full max-w-[1760px] items-center px-6 sm:px-8 lg:px-12 xl:px-[86px]">
            <div className="max-w-[680px] py-10 md:py-12">
              <p className="text-[16px] tracking-[0.01em] text-black/44 md:text-[18px]">
                {content.hero.badge || "Novinka"}
              </p>
              <h1 className="hero-title mt-3 max-w-[13.5ch] text-balance text-[52px] uppercase leading-[1.5] tracking-[-0.02em] text-[#565656]">
                {content.hero.title}
              </h1>
              <p className="mt-7 max-w-[46ch] text-[17px] leading-[1.46] text-black/58 sm:text-[19px] lg:mt-8 lg:text-[22px]">
                {content.hero.description}
              </p>
              <span className="mt-8 inline-flex h-[48px] w-[218px] items-center justify-center bg-[var(--brand)] text-[13px] font-medium uppercase tracking-[0.18em] text-white sm:h-[52px] sm:w-[250px] lg:mt-9 lg:h-[57px] lg:w-[271px]">
                {content.hero.primaryCta || copy.learnMore}
              </span>
            </div>
          </div>
        </Link>
      </section>

      <section className="px-[38px] py-9 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-[1680px]">
          <div className="hidden items-center justify-between lg:flex">
            <h2 className="text-[40px] tracking-[-0.04em] md:text-[50px]">{copy.bestsellers}</h2>
            <Link
              href={`/${locale}/catalog`}
              className="inline-flex items-center gap-[10px] border-b-[1.5px] border-[var(--brand)] pb-[4px] text-[18px] leading-none text-[var(--brand)]"
            >
              <span>{copy.moreProducts}</span>
              <span aria-hidden="true" className="translate-y-[-1px] text-[25px] leading-none">
                →
              </span>
            </Link>
          </div>

          <div className="lg:hidden">
            <h2 className="text-[33px] leading-none tracking-[-0.05em] text-black">{copy.bestsellers}</h2>
          </div>

          <Link
            href={`/${locale}/catalog`}
            className="mt-5 inline-flex items-center gap-2 border-b-[1.5px] border-[var(--brand)] pb-[3px] text-[15px] leading-none text-[var(--brand)] lg:hidden"
          >
            <span>{copy.moreProducts}</span>
            <span aria-hidden="true" className="translate-y-[-1px] text-[20px] leading-none">
              →
            </span>
          </Link>

          <BestsellerMarquee locale={locale} products={bestsellerProducts} learnMoreLabel={copy.learnMore} />
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

      <section className="py-12">
        <Gallery title={copy.gallery} items={galleryImages} />
      </section>

      {videoItems.length > 0 ? (
        <section id="video-gallery" className="px-8 py-12 lg:px-12">
          <div className="mx-auto max-w-[1680px]">
            <VideoGallery title={copy.videos} items={videoItems} />
          </div>
        </section>
      ) : null}

      <FooterGradientBackground imageSrc="/images/home/ModailyBGred.jpg" className="mt-6">
        <section className="py-12 text-white">
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
        </section>
      </FooterGradientBackground>

      <section id="about" className="px-8 py-16 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <div>
            <h2 className="text-[42px] uppercase tracking-[-0.04em] text-[var(--brand)] md:text-[56px]">
              {content.about.title}
            </h2>
            <p className="mt-5 max-w-[900px] text-[16px] leading-8 text-black/80">
              {content.about.description}
            </p>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-[4px] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="bg-[#f4f1eb]">
              <FallbackImage
                src={content.about.imageUrl || "/images/Galary/about1.png"}
                fallbackSrc="/images/Galary/about1.png"
                alt={content.about.title}
                className="h-full min-h-[260px] w-full object-cover"
              />
            </div>

            <div className="bg-[#ba0c2f] px-6 py-7 text-white lg:px-8 lg:py-8">
              <p className="text-[13px] leading-7 text-white/90 md:text-[14px]">
                {content.about.secondaryDescription || content.about.bottomDescription || content.about.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
