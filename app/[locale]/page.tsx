import type { Metadata } from "next";
import Link from "next/link";

import { Gallery } from "@/components/home/gallery";
import { ProductCard } from "@/components/home/product-card";
import { Reviews } from "@/components/home/reviews";
import { VideoGallery } from "@/components/home/video-gallery";
import { FooterGradientBackground } from "@/components/footer-gradient-background";
import { FallbackImage } from "@/components/ui/fallback-image";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getStorefrontProducts } from "@/lib/storefront-products";
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
  const catalogProducts = await getStorefrontProducts(locale);
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
  const gallerySource = content.galleryImages.some((item) => item.imageUrl?.trim()) ? content.galleryImages : getLocalGalleryItems();
  const galleryImages = gallerySource.length > 0 ? gallerySource : getFallbackGalleryItems();
  const promoCards = repeatToCount(content.promoCards.length > 0 ? content.promoCards : getFallbackPromoCards(locale), 2);
  const testimonials = repeatToCount(content.testimonials.length > 0 ? content.testimonials : getFallbackTestimonials(locale), 6);
  const validVideoItems = content.galleryVideos.filter((item) => item.videoUrl && !item.videoUrl.includes("example.com"));
  const videoItems = repeatToCount(validVideoItems, 3);

  return (
    <div className="bg-white text-black">
      <section className="pt-0">
        <div className="grid h-[696px] w-full overflow-hidden border-b border-black/10 bg-[#ecebe8] lg:hidden">
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
              <h1 className="hero-title mt-[11px] text-[35px] uppercase leading-[1.02] tracking-[-0.045em] text-[#1f1f1f]">
                {content.hero.title}
              </h1>
              <p className="mt-[14px] max-w-[332px] text-[15px] leading-[1.55] text-black/76">
                {content.hero.description}
              </p>
              <Link
                href={content.hero.primaryCtaLink}
                className="mt-[28px] inline-flex h-[50px] w-[254px] items-center justify-center bg-[var(--brand)] text-[13px] uppercase tracking-[0.19em] text-white"
              >
                {content.hero.primaryCta || copy.learnMore}
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden min-h-[460px] w-full overflow-hidden border-b border-black/10 bg-[#ecebe8] lg:grid md:min-h-[520px] xl:min-h-[555px]">
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
              <h1 className="hero-title mt-3 max-w-[8.2ch] text-[52px] uppercase leading-[0.94] tracking-[-0.02em] text-[#565656]">
                {content.hero.title}
              </h1>
              <p className="mt-7 max-w-[690px] text-[17px] leading-[1.46] text-black/58 sm:text-[19px] lg:mt-8 lg:text-[22px]">
                {content.hero.description}
              </p>
              <Link
                href={content.hero.primaryCtaLink}
                className="mt-8 inline-flex h-[48px] w-[218px] items-center justify-center bg-[var(--brand)] text-[13px] font-medium uppercase tracking-[0.18em] text-white sm:h-[52px] sm:w-[250px] lg:mt-9 lg:h-[57px] lg:w-[271px]"
              >
                {content.hero.primaryCta || copy.learnMore}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-[38px] py-9 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-[1680px]">
          <div className="hidden items-center justify-between lg:flex">
            <h2 className="text-[40px] tracking-[-0.04em] md:text-[50px]">{copy.bestsellers}</h2>
            <Link href={`/${locale}/catalog`} className="text-[18px] text-[var(--brand)]">
              {copy.moreProducts} __
            </Link>
          </div>

          <div className="lg:hidden">
            <h2 className="text-[33px] leading-none tracking-[-0.05em] text-black">{copy.bestsellers}</h2>
          </div>

          <div className="mt-5 h-[4px] w-full rounded-full bg-[#e5e8ec] lg:mt-8 lg:h-[3px] lg:bg-black/8">
            <div className="h-full w-[71%] rounded-full bg-[#282828] lg:bg-black" />
          </div>

          <Link href={`/${locale}/catalog`} className="mt-5 inline-flex items-center gap-2 border-b border-[var(--brand)] pb-1 text-[15px] leading-none text-[var(--brand)] lg:hidden">
            <span>{copy.moreProducts}</span>
            <span aria-hidden="true">→</span>
          </Link>

          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-2 xl:grid-cols-4">
            {bestsellerProducts.slice(0, 4).map((product) => (
              <article key={product.id}>
                <div className="flex h-[228px] items-center justify-center bg-[#f5f5f5] md:h-[260px] lg:h-[290px]">
                  <ProductPackshot imageUrl={product.imageUrl} name={product.name} />
                </div>
                <h3 className="mt-3 min-h-[44px] text-[13px] uppercase leading-[1.25] tracking-[-0.03em] text-[#2f2f2f] lg:mt-4 lg:min-h-[54px] lg:text-[18px] lg:leading-6">{product.name}</h3>
                <Link href={`/${locale}/catalog/${product.slug}`} className="mt-3 inline-flex h-[42px] w-full items-center justify-center border border-black/40 text-[11px] uppercase tracking-[0.18em] text-black/72 lg:h-[46px] lg:text-[12px]">
                  {copy.learnMore}
                </Link>
              </article>
            ))}
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
        <div className="mx-auto max-w-[1680px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[42px] uppercase tracking-[-0.04em] text-[var(--brand)] md:text-[56px]">{content.about.title}</h2>
              <p className="mt-5 max-w-[560px] text-[16px] leading-8 text-black/80">{content.about.description}</p>
            </div>
            <div>
              {((content.about.secondaryTitle || "MODAILY").trim().toUpperCase() === "MODAILY") ? (
                <p className="brand-wordmark text-right text-[40px] uppercase leading-none text-[var(--brand)] md:text-[56px]">
                  {content.about.secondaryTitle || "MODAILY"}
                </p>
              ) : (
                <p className="text-right text-[40px] uppercase tracking-[-0.04em] text-[var(--brand)] md:text-[56px]">
                  {content.about.secondaryTitle || "MODAILY"}
                </p>
              )}
              <p className="mt-5 text-[16px] leading-8 text-black/80">{content.about.secondaryDescription || content.about.description}</p>
            </div>
          </div>

          {content.about.bottomDescription ? (
            <p className="mt-8 text-[16px] leading-8 text-black/80">{content.about.bottomDescription}</p>
          ) : null}

          <div className="mt-12 overflow-hidden rounded-[10px] bg-white">
            <FallbackImage
              src={content.about.imageUrl || "/images/Galary/about1.png"}
              fallbackSrc="/images/Galary/about1.png"
              alt={content.about.title}
              className="h-[360px] w-full object-contain object-center md:h-[560px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
