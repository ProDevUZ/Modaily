import type { Metadata } from "next";
import Link from "next/link";

import { BestsellerMarquee } from "@/components/home/bestseller-marquee";
import { Gallery } from "@/components/home/gallery";
import { HomeHeroImage } from "@/components/home/hero-image";
import { ProductCard } from "@/components/home/product-card";
import { Reviews } from "@/components/home/reviews";
import { VideoGallery } from "@/components/home/video-gallery";
import { FooterGradientBackground } from "@/components/footer-gradient-background";
import { JsonLd } from "@/components/seo/json-ld";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { absoluteUrl, localizedAlternates, localizedOpenGraph, localizedPath, metadataDescription, metadataTitle } from "@/lib/seo";
import { buildGraphSchema, buildVideoObjectSchema } from "@/lib/structured-data";
import { getStorefrontProducts, type StorefrontProduct } from "@/lib/storefront-products";
import { getHomePageContent } from "@/lib/storefront-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{ locale: string }>;
};

type HomeGalleryImageItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type HomeGalleryVideoItem = HomeGalleryImageItem & {
  videoUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

type HomePromoCardItem = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonLink: string;
  imageUrl: string;
};

type HomeTestimonialItem = {
  id: string;
  authorName: string;
  authorRole: string;
  productName: string;
  body: string;
  avatarUrl: string;
  rating: number;
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

function getFallbackTestimonials(locale: keyof typeof labels) {
  return [
    {
      id: "testimonial-fallback-1",
      authorName: locale === "ru" ? "Азиза" : "Aziza",
      authorRole: locale === "ru" ? "Очищающая пенка Modaily" : "Modaily Cleanser",
      productName: locale === "ru" ? "Очищающая пенка Modaily" : "Modaily Cleanser",
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
      productName: locale === "ru" ? "Крем для рук Silk Touch Modaily" : "Silk Touch Hand Cream",
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
      productName: locale === "ru" ? "Очищающая пенка Modaily" : "Modaily Foam Cleanser",
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
  const title = metadataTitle(dictionary.meta.home.title);
  const description = metadataDescription(dictionary.meta.home.description, "Modaily skincare storefront.");

  return {
    title,
    description,
    alternates: localizedAlternates(locale),
    openGraph: localizedOpenGraph({
      locale,
      path: "",
      title,
      description
    })
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const dictionary = getDictionary(locale);
  const content: Awaited<ReturnType<typeof getHomePageContent>> = await getHomePageContent(locale);
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
  const contentGalleryImages = content.galleryImages as HomeGalleryImageItem[];
  const contentGalleryVideos = content.galleryVideos as HomeGalleryVideoItem[];
  const contentTestimonials = content.testimonials as HomeTestimonialItem[];
  const gallerySource = contentGalleryImages.some((item) => item.imageUrl?.trim()) ? contentGalleryImages : getLocalGalleryItems();
  const galleryImages = gallerySource.length > 0 ? gallerySource : getFallbackGalleryItems();
  const contentPromoCards = content.promoCards as HomePromoCardItem[];
  const promoCards = contentPromoCards.length > 0 ? contentPromoCards : getFallbackPromoCards(locale);
  const testimonials = repeatToCount(contentTestimonials.length > 0 ? contentTestimonials : getFallbackTestimonials(locale), 6);
  const validVideoItems = contentGalleryVideos.filter((item) => item.videoUrl && !item.videoUrl.includes("example.com"));
  const videoItems = repeatToMinimum(validVideoItems, 3);
  const videoSchemas = validVideoItems
    .map((item, index) =>
      buildVideoObjectSchema({
        id: `${absoluteUrl(localizedPath(locale))}#home-video-${index + 1}`,
        title: item.title || `${copy.videos} ${index + 1}`,
        description: item.title || copy.videos,
        thumbnailUrl: item.imageUrl,
        contentUrl: item.videoUrl,
        uploadDate: item.createdAt || item.updatedAt
      })
    )
    .filter(Boolean);

  return (
    <div className="bg-white text-black">
      {videoSchemas.length > 0 ? <JsonLd data={buildGraphSchema(videoSchemas)} /> : null}
      <h1 className="sr-only">{dictionary.meta.home.title}</h1>
      <section className="pt-0">
        <Link
          href={content.hero.primaryCtaLink}
          aria-label="Hero product"
          className="grid aspect-[375/574] max-h-[760px] w-full overflow-hidden border-b border-black/10 bg-[#ecebe8] sm:max-h-[820px] lg:aspect-[1440/555] lg:max-h-none"
        >
          <HomeHeroImage
            mobileSrc={content.hero.mobileImageUrl}
            desktopSrc={content.hero.imageUrl}
            fallbackSrc="/images/home/mainpage.jpg"
            alt="Hero product"
          />
        </Link>
      </section>

      <section className="section-x py-9 lg:py-10 desktop:py-12">
        <div className="layout-container-wide">
          <div className="hidden items-center justify-between lg:flex">
            <h2 className="text-[38px] tracking-[-0.04em] laptop:text-[44px] desktop:text-[50px]">{copy.bestsellers}</h2>
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

      <section className="section-x py-6 laptop:py-8 desktop:py-10">
        <div className="layout-container-wide grid gap-6 desktop:gap-8 laptop:grid-cols-2">
          {promoCards.map((card, index) => (
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

      <section className="py-10 desktop:py-12">
        <Gallery title={copy.gallery} headings={content.galleryImageHeadings} items={galleryImages} />
      </section>

      {videoItems.length > 0 ? (
        <section id="video-gallery" className="section-x py-10 desktop:py-12">
          <div className="layout-container-wide">
            <VideoGallery title={copy.videos} headings={content.galleryVideoHeadings} items={videoItems} />
          </div>
        </section>
      ) : null}

      <FooterGradientBackground imageSrc="/images/home/ModailyBGred.jpg" className="mt-6">
        <section className="py-10 desktop:py-12 text-white">
          <Reviews
            title={copy.reviews}
            headings={content.reviewHeadings}
            items={testimonials.map((item, index) => ({
              id: `${item.id}-${index}`,
              authorName: item.authorName,
              authorRole: item.productName || item.authorRole,
              body: item.body,
              avatarUrl: item.avatarUrl,
              rating: item.rating
            }))}
          />
        </section>
      </FooterGradientBackground>

      <section id="about" className="section-x py-12 desktop:py-16">
        <div className="layout-container-content">
          <div>
            <h2 className="text-[42px] uppercase tracking-[-0.04em] text-[var(--brand)] md:text-[56px]">
              {content.about.title}
            </h2>
            <p className="mt-5 max-w-[900px] text-[16px] leading-8 text-black/80">
              {content.about.description}
            </p>
          </div>

          <div className="mt-12 grid overflow-hidden rounded-[4px] laptop:grid-cols-[1.08fr_0.92fr]">
            <div className="bg-[#f4f1eb]">
              <FallbackImage
                src={content.about.imageUrl || "/images/Galary/about1.png"}
                fallbackSrc="/images/Galary/about1.png"
                alt={content.about.title}
                sizes="(max-width: 1179px) 100vw, 51vw"
                quality={86}
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
