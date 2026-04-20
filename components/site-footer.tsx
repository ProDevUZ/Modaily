import Link from "next/link";

import { FooterGradientBackground } from "@/components/footer-gradient-background";
import type { Dictionary, Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  siteSettings: {
    brandName: string;
    footerPhone: string;
    footerEmail: string;
    footerTelegram: string;
    footerTelegramLink: string;
    footerInstagram: string;
    footerInstagramLink: string;
    footerAddress: string;
    newsletterTitle: string;
    newsletterPlaceholder: string;
  };
};

const footerLabels = {
  uz: {
    pages: "Sahifalar",
    stores: "Do'konlarimiz",
    blog: "Blog",
    about: "Biz haqimizda"
  },
  ru: {
    pages: "Страницы",
    stores: "Наши магазины",
    blog: "Блог",
    about: "О нас"
  },
  en: {
    pages: "Pages",
    stores: "Our stores",
    blog: "Blog",
    about: "About"
  }
} as const;

function normalizeHandle(value: string) {
  return value.trim().replace(/^@/, "");
}

function normalizeExternalHref(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function getPhoneHref(phone: string) {
  const normalized = phone.trim().replace(/[^+\d]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

function getWhatsAppHref(phone: string) {
  const normalized = phone.trim().replace(/[^\d]/g, "");
  return normalized ? `https://wa.me/${normalized}` : "";
}

function getEmailHref(email: string) {
  const normalized = email.trim();
  return normalized ? `mailto:${normalized}` : "";
}

function getTelegramHref(handle: string, link: string) {
  const directLink = normalizeExternalHref(link);

  if (directLink) {
    return directLink;
  }

  const normalizedHandle = normalizeHandle(handle);
  return normalizedHandle ? `https://t.me/${normalizedHandle}` : "";
}

function getInstagramHref(handle: string, link: string) {
  const directLink = normalizeExternalHref(link);

  if (directLink) {
    return directLink;
  }

  const normalizedHandle = normalizeHandle(handle);
  return normalizedHandle ? `https://instagram.com/${normalizedHandle}` : "";
}

function FooterAssetIcon({
  src,
  alt,
  className
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className || "h-[23px] w-[23px] brightness-0 invert"}
      aria-hidden="true"
    />
  );
}

function FooterBrandWordmark({
  brandName,
  className
}: {
  brandName: string;
  className?: string;
}) {
  const normalizedBrandName = brandName.trim() || "Modaily";
  const firstLetter = normalizedBrandName.slice(0, 1);
  const remainingLetters = normalizedBrandName.slice(1);
  const isLeadingM = firstLetter.toUpperCase() === "M";

  return (
    <p className={`brand-wordmark uppercase text-white ${className || ""}`} aria-label={normalizedBrandName}>
      {isLeadingM ? (
        <>
          <span aria-hidden="true" className="inline-block origin-left scale-x-[1.15] mr-[0.18em]">
            {firstLetter}
          </span>
          <span aria-hidden="true">{remainingLetters}</span>
        </>
      ) : (
        normalizedBrandName
      )}
    </p>
  );
}

function FooterInfoLink({
  href,
  iconSrc,
  iconAlt,
  text,
  external = false
}: {
  href: string;
  iconSrc: string;
  iconAlt: string;
  text: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex items-center gap-[17px] text-[16px] leading-[23px] text-white/95 transition hover:text-white"
    >
      <FooterAssetIcon src={iconSrc} alt={iconAlt} />
      <span>{text}</span>
    </a>
  );
}

function FooterSocialLink({
  href,
  iconSrc,
  iconAlt,
  text
}: {
  href: string;
  iconSrc: string;
  iconAlt: string;
  text: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-[17px] text-[16px] leading-[23px] text-white/95 transition hover:text-white"
    >
      <FooterAssetIcon src={iconSrc} alt={iconAlt} />
      <span>{text}</span>
    </a>
  );
}

function FooterIconOnlyLink({
  href,
  iconSrc,
  iconAlt
}: {
  href: string;
  iconSrc: string;
  iconAlt: string;
}) {
  const isWebLink = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={isWebLink ? "_blank" : undefined}
      rel={isWebLink ? "noreferrer" : undefined}
      className="transition hover:opacity-100"
    >
      <FooterAssetIcon src={iconSrc} alt={iconAlt} className="h-[31px] w-[31px] brightness-0 invert" />
    </a>
  );
}

export function SiteFooter({ locale, dictionary, siteSettings }: SiteFooterProps) {
  const labels = footerLabels[locale];
  const phoneHref = getPhoneHref(siteSettings.footerPhone);
  const whatsappHref = getWhatsAppHref(siteSettings.footerPhone);
  const emailHref = getEmailHref(siteSettings.footerEmail);
  const telegramHref = getTelegramHref(siteSettings.footerTelegram, siteSettings.footerTelegramLink);
  const instagramHref = getInstagramHref(siteSettings.footerInstagram, siteSettings.footerInstagramLink);
  const whatsappText = siteSettings.footerTelegram || siteSettings.footerPhone;

  return (
    <FooterGradientBackground imageSrc="/images/home/ModailyBGred.jpg" className="text-white">
      <footer>
        <div className="lg:hidden">
          <div className="mx-auto max-w-[390px] px-[34px] pb-[50px] pt-[48px]">
            <div className="flex flex-col items-center text-center">
              <FooterBrandWordmark brandName={siteSettings.brandName} className="text-[34px] leading-none" />
              <div className="mt-[24px] h-[2px] w-[36px] bg-white/80" />
            </div>

            <nav className="mt-[34px] grid grid-cols-4 items-center justify-items-center gap-x-3 text-center text-[17px] leading-[1.18] text-white/95">
              <Link href={`/${locale}`} className="transition hover:text-white">
                {dictionary.nav.home}
              </Link>
              <Link href={`/${locale}/catalog`} className="transition hover:text-white">
                {dictionary.nav.catalog}
              </Link>
              <Link href={`/${locale}/blog`} className="transition hover:text-white">
                {labels.blog}
              </Link>
              <Link href={`/${locale}/main/about-us`} className="transition hover:text-white">
                {labels.about}
              </Link>
            </nav>

            <div className="mt-[56px]">
              <p className="text-[17px] font-medium leading-[1.25] text-white">{labels.stores}</p>
              <p className="mt-[18px] max-w-[320px] text-[17px] leading-[1.45] text-white/82">{siteSettings.footerAddress}</p>
            </div>

            <div className="mt-[64px] h-px bg-white/42" />

            <div className="mt-[38px] flex items-center justify-center gap-[24px]">
              {phoneHref ? <FooterIconOnlyLink href={phoneHref} iconSrc="/icons/call.svg" iconAlt="Phone" /> : null}
              {instagramHref ? <FooterIconOnlyLink href={instagramHref} iconSrc="/icons/INSTAsvg.svg" iconAlt="Instagram" /> : null}
              {emailHref ? <FooterIconOnlyLink href={emailHref} iconSrc="/icons/mail.svg" iconAlt="Email" /> : null}
              {telegramHref ? <FooterIconOnlyLink href={telegramHref} iconSrc="/icons/TGsvg.svg" iconAlt="Telegram" /> : null}
              {whatsappHref ? <FooterIconOnlyLink href={whatsappHref} iconSrc="/icons/WAsvg.svg" iconAlt="WhatsApp" /> : null}
            </div>

            <p className="mt-[44px] text-center text-[15px] leading-5 text-white/88">
              © 2026 {siteSettings.brandName}. All rights reserved.
            </p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="mx-auto max-w-[1075px] px-0 pb-[33px] pt-[33px]">
            <div className="h-px bg-white/45" />

            <div className="pt-[44px]">
              <div
                className="grid items-start"
                style={{
                  gridTemplateColumns: "289px 232px 74px 178px 302px"
                }}
              >
                <div className="col-[1]">
                  <FooterBrandWordmark
                    brandName={siteSettings.brandName}
                    className="mt-[22px] w-[289px] text-[51px] leading-[0.86]"
                  />

                  <div className="mt-[46px] space-y-[17px]">
                    {phoneHref ? (
                      <FooterInfoLink href={phoneHref} iconSrc="/icons/call.svg" iconAlt="Phone" text={siteSettings.footerPhone} />
                    ) : null}

                    {emailHref ? (
                      <FooterInfoLink href={emailHref} iconSrc="/icons/mail.svg" iconAlt="Email" text={siteSettings.footerEmail} />
                    ) : null}
                  </div>

                  <div className="mt-[17px] flex items-center gap-[29px]">
                    {whatsappHref ? (
                      <FooterSocialLink href={whatsappHref} iconSrc="/icons/WAsvg.svg" iconAlt="WhatsApp" text={whatsappText} />
                    ) : null}

                    {telegramHref ? (
                      <FooterSocialLink href={telegramHref} iconSrc="/icons/TGsvg.svg" iconAlt="Telegram" text={siteSettings.footerTelegram} />
                    ) : null}
                  </div>
                </div>

                <div className="col-[3] pt-[4px]">
                  <p className="text-[16px] font-medium leading-[23px] text-white">{labels.pages}</p>
                  <nav className="mt-[29px] space-y-[13px] text-[16px] leading-[23px] text-white/88">
                    <Link href={`/${locale}`} className="block transition hover:text-white">
                      {dictionary.nav.home}
                    </Link>
                    <Link href={`/${locale}/catalog`} className="block transition hover:text-white">
                      {dictionary.nav.catalog}
                    </Link>
                    <Link href={`/${locale}/blog`} className="block transition hover:text-white">
                      {labels.blog}
                    </Link>
                    <Link href={`/${locale}/main/about-us`} className="block transition hover:text-white">
                      {labels.about}
                    </Link>
                  </nav>
                </div>

                <div className="col-[5] pt-[4px]">
                  <p className="text-[16px] font-medium leading-[23px] text-white">{labels.stores}</p>
                  <p className="mt-[38px] min-h-[95px] w-[302px] text-[16px] leading-[1.35] text-white/82">
                    {siteSettings.footerAddress}
                  </p>
                </div>
              </div>

              <p className="mx-auto mt-[68px] text-center text-[15px] leading-5 text-white/62">
                © 2026 {siteSettings.brandName}. All rights reserved.
              </p>

              <div className="mt-[22px] h-px bg-white/45" />
            </div>
          </div>
        </div>
      </footer>
    </FooterGradientBackground>
  );
}
