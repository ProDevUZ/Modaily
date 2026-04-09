import Link from "next/link";
import { notFound } from "next/navigation";

import { FallbackImage } from "@/components/ui/fallback-image";
import type { Locale } from "@/lib/i18n";
import { getProductPageCopy } from "@/lib/product-page-copy";
import { getLocalizedSiteSettings } from "@/lib/storefront-content";
import { getStorefrontProductDetail } from "@/lib/storefront-products";

type PageProps = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

function splitLines(value: string) {
  return value
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
}

function storePageMeta(locale: Locale) {
  if (locale === "ru") {
    return {
      title: "MODAILY FLAGSHIP STORE",
      openMap: "Открыть в карте",
      noLocation: "Адрес скоро появится",
      noContacts: "Контакты скоро появятся"
    };
  }

  if (locale === "en") {
    return {
      title: "MODAILY FLAGSHIP STORE",
      openMap: "Open in map",
      noLocation: "Address coming soon",
      noContacts: "Contacts coming soon"
    };
  }

  return {
    title: "MODAILY FLAGSHIP STORE",
    openMap: "Xaritada ochish",
    noLocation: "Manzil tez orada qo'shiladi",
    noContacts: "Kontaktlar tez orada qo'shiladi"
  };
}

function buildMapHref(location: string) {
  const query = location.trim() || "Modaily Tashkent";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#ff6c95]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/58" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v4.6l3 1.8" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/58" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M6.8 5.5h2.4l1.2 3.2-1.6 1.6a13.8 13.8 0 0 0 4.9 4.9l1.6-1.6 3.2 1.2v2.4a1.6 1.6 0 0 1-1.8 1.6A14.9 14.9 0 0 1 5.2 7.3 1.6 1.6 0 0 1 6.8 5.5Z" />
    </svg>
  );
}

export default async function ProductStorePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const [product, siteSettings] = await Promise.all([
    getStorefrontProductDetail(locale, slug),
    getLocalizedSiteSettings(locale)
  ]);

  if (!product) {
    notFound();
  }

  const copy = getProductPageCopy(locale);
  const meta = storePageMeta(locale);
  const store = product.store ?? {
    imageUrl: "",
    location: "",
    contacts: ""
  };

  const location = siteSettings.storeAddress || store.location;
  const mapLink = siteSettings.storeMapLink || buildMapHref(location);

  const locationLines = splitLines(location);
  const contactLines = splitLines(store.contacts);

  return (
    <div className="min-h-screen bg-[#fffdf9] text-[#1f1a17]">
      <div className="mx-auto max-w-[440px] px-4 pb-10 pt-2 sm:px-5">
        <div className="sticky top-0 z-20 border-b border-black/8 bg-[#fffdf9]/92 py-4 backdrop-blur-xl">
          <Link
            href={`/${locale}/catalog/${product.slug}`}
            className="inline-flex h-11 items-center gap-3 rounded-full border border-black/10 bg-white/88 px-3 pr-4 text-sm font-medium text-[#1f1a17] shadow-[0_12px_28px_rgba(31,26,23,0.06)] transition hover:border-black/18 hover:bg-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6efe7] text-[#1f1a17]" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M15 6 9 12l6 6" />
                <path d="M9 12h10" />
              </svg>
            </span>
            {copy.actions.whereToBuy}
          </Link>
        </div>

        <div className="space-y-8 py-6">
          <div className="overflow-hidden rounded-[1.25rem] border border-black/8 bg-white/68 p-4 shadow-[0_18px_42px_rgba(31,26,23,0.08)] backdrop-blur-sm">
            <FallbackImage
              src={store.imageUrl}
              fallbackSrc={product.imageUrl || "/images/home/mainpage.jpg"}
              alt={`${product.name} store`}
              className="h-[240px] w-full rounded-[0.9rem] object-cover"
            />
          </div>

          <section className="rounded-[1.25rem] border border-black/8 bg-white/78 p-5 shadow-[0_18px_42px_rgba(31,26,23,0.07)] backdrop-blur-sm">
            <h1 className="text-base font-semibold uppercase tracking-[0.08em] text-[#1f1a17]">{meta.title}</h1>

            <div className="mt-3 flex gap-3 text-[14px] leading-6 text-black/62">
              <MapPinIcon />
              <div className="space-y-1">
                {locationLines.length > 0 ? (
                  locationLines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)
                ) : (
                  <p>{meta.noLocation}</p>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-2 text-[14px] leading-6 text-black/62">
              {contactLines.length > 0 ? (
                contactLines.map((line, index) => (
                  <div key={`${line}-${index}`} className="flex gap-3">
                    {index === 0 ? <ClockIcon /> : <ContactIcon />}
                    <p>{line}</p>
                  </div>
                ))
              ) : (
                <div className="flex gap-3">
                  <ClockIcon />
                  <p>{meta.noContacts}</p>
                </div>
              )}
            </div>
          </section>

          <div className="pb-2">
          <a
            href={mapLink}
            target="_blank"
            rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center rounded-[999px] bg-[#ba0c2f] px-6 text-sm font-medium text-white shadow-[0_16px_34px_rgba(186,12,47,0.24)] transition hover:translate-y-[-1px] hover:bg-[#a10a28]"
            >
              {meta.openMap}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
