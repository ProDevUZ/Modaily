import Link from "next/link";

import { ContactMessageForm } from "@/components/about/contact-message-form";
import { FallbackImage } from "@/components/ui/fallback-image";
import type { Locale } from "@/lib/i18n";

type AboutPageViewProps = {
  locale: Locale;
  dictionaryHomeLabel: string;
  brandName: string;
  content: {
    title: string;
    description: string;
    secondaryTitle: string;
    secondaryDescription: string;
    bottomDescription: string;
    imageUrl: string;
  };
  siteSettings: {
    footerPhone: string;
    footerEmail: string;
    footerTelegram: string;
    footerTelegramLink: string;
    footerInstagram: string;
    footerInstagramLink: string;
    storeAddress: string;
    storeMapLink: string;
    footerAddress: string;
  };
};

const copy = {
  uz: {
    about: "Biz haqimizda",
    contacts: "Bizning kontaktlarimiz",
    store: "Do'konimiz",
    phone: "Telefon raqami",
    email: "Bizning pochta",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    instagram: "Instagram",
    namePlaceholder: "Ismingiz",
    phonePlaceholder: "Telefon raqamingiz",
    messagePlaceholder: "Xabaringiz",
    submit: "Xabar yuborish",
    submitPending: "Yuborilmoqda...",
    success: "Xabaringiz yuborildi.",
    requiredError: "Ism va telefon raqami majburiy.",
    fallbackError: "Xabarni yuborib bo'lmadi."
  },
  ru: {
    about: "О нас",
    contacts: "Наши контакты",
    store: "Наш магазин",
    phone: "Номер телефона",
    email: "Наша почта",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    instagram: "Instagram",
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "Ваш номер телефона",
    messagePlaceholder: "Ваше сообщение",
    submit: "Отправить сообщение",
    submitPending: "Отправка...",
    success: "Сообщение отправлено.",
    requiredError: "Имя и номер телефона обязательны.",
    fallbackError: "Не удалось отправить сообщение."
  },
  en: {
    about: "About",
    contacts: "Our contacts",
    store: "Our store",
    phone: "Phone number",
    email: "Our email",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    instagram: "Instagram",
    namePlaceholder: "Your name",
    phonePlaceholder: "Your phone number",
    messagePlaceholder: "Your message",
    submit: "Send message",
    submitPending: "Sending...",
    success: "Your message has been sent.",
    requiredError: "Name and phone number are required.",
    fallbackError: "Message could not be sent."
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

function getInstagramHref(handle: string, link: string) {
  const directLink = normalizeExternalHref(link);

  if (directLink) {
    return directLink;
  }

  const normalizedHandle = normalizeHandle(handle);
  return normalizedHandle ? `https://instagram.com/${normalizedHandle}` : "";
}

function getTelegramHref(handle: string, link: string) {
  const directLink = normalizeExternalHref(link);

  if (directLink) {
    return directLink;
  }

  const normalizedHandle = normalizeHandle(handle);
  return normalizedHandle ? `https://t.me/${normalizedHandle}` : "";
}

function buildMapEmbedSrc(query: string) {
  const normalized = query.trim() || "Modaily Tashkent";
  return `https://maps.google.com/maps?q=${encodeURIComponent(normalized)}&z=14&output=embed`;
}

function SocialCardIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-8 w-8 brightness-0 invert"
      aria-hidden="true"
    />
  );
}

function ContactCard({
  icon,
  title,
  value,
  href
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex min-h-[96px] flex-col items-center justify-center rounded-[3px] bg-[#ba0c2f] px-4 py-5 text-center text-white">
      <div className="mb-4 flex h-8 w-8 items-center justify-center text-white" aria-hidden="true">
        {icon}
      </div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/78">{title}</p>
      <p className="mt-3 text-[14px] leading-6">{value}</p>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <a href={href} className="block transition hover:opacity-90" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
      {content}
    </a>
  );
}

export function AboutPageView({
  locale,
  dictionaryHomeLabel,
  brandName,
  content,
  siteSettings
}: AboutPageViewProps) {
  const labels = copy[locale];
  const storeLabel = siteSettings.storeAddress || siteSettings.footerAddress;
  const phoneHref = getPhoneHref(siteSettings.footerPhone);
  const whatsappHref = getWhatsAppHref(siteSettings.footerPhone);
  const emailHref = getEmailHref(siteSettings.footerEmail);
  const telegramHref = getTelegramHref(siteSettings.footerTelegram, siteSettings.footerTelegramLink);
  const instagramHref = getInstagramHref(siteSettings.footerInstagram, siteSettings.footerInstagramLink);
  const mapQuery = siteSettings.storeAddress || siteSettings.footerAddress;
  const primaryPanelText = content.secondaryDescription || content.description;
  const secondaryPanelText = content.bottomDescription || content.secondaryDescription || content.description;
  const brandWord = content.secondaryTitle || brandName;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-8">
        <div className="text-[11px] text-black/40">
          <Link href={`/${locale}`} className="transition hover:text-black/65">
            {dictionaryHomeLabel}
          </Link>
          <span className="mx-2">/</span>
          <span>{labels.about}</span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <h1 className="text-[2rem] uppercase leading-none tracking-[-0.04em] text-[var(--brand)] md:text-[3.5rem]">
              {content.title || labels.about}
            </h1>
            <p className="mt-5 max-w-[600px] text-[14px] leading-7 text-black/75 md:text-[15px] md:leading-8">
              {content.description}
            </p>
          </div>

          <div className="lg:pt-3">
            <p className="brand-wordmark text-left text-[2.15rem] uppercase leading-none text-[var(--brand)] md:text-right md:text-[3.6rem]">
              {brandWord}
            </p>
          </div>
        </div>

        <div className="mt-9 grid overflow-hidden rounded-[4px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="bg-[#f4f1eb]">
            <FallbackImage
              src={content.imageUrl || "/images/Galary/about1.png"}
              fallbackSrc="/images/Galary/about1.png"
              alt={content.title || brandWord}
              className="h-full min-h-[260px] w-full object-cover"
            />
          </div>

          <div className="bg-[#ba0c2f] px-6 py-7 text-white lg:px-8 lg:py-8">
            <div className="space-y-5 text-[13px] leading-7 text-white/90 md:text-[14px]">
              <p>{primaryPanelText}</p>
              <p>{secondaryPanelText}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-[1.9rem] tracking-[-0.03em] text-black md:text-[2.3rem]">{labels.contacts}</h2>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ContactCard
            icon={
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M5 10.5V19h14v-8.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 10.5h17" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 10.5V8a3.5 3.5 0 1 1 7 0v2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 16.5h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title={labels.store}
            value={storeLabel}
          />
          <ContactCard
            icon={
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M6.8 5.4h2.6l1.3 3.4-1.8 1.6a14.8 14.8 0 0 0 4.7 4.7l1.6-1.8 3.4 1.3v2.6a1.7 1.7 0 0 1-1.8 1.7A15.9 15.9 0 0 1 5.1 7.2a1.7 1.7 0 0 1 1.7-1.8Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title={labels.phone}
            value={siteSettings.footerPhone}
            href={phoneHref}
          />
          <ContactCard
            icon={
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.9">
                <rect x="4" y="5" width="16" height="14" rx="3" />
                <path d="m5 7 7 6 7-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title={labels.email}
            value={siteSettings.footerEmail}
            href={emailHref}
          />
          <ContactCard
            icon={<SocialCardIcon src="/icons/WAsvg.svg" alt="WhatsApp" />}
            title={labels.whatsapp}
            value={siteSettings.footerPhone}
            href={whatsappHref}
          />
          <ContactCard
            icon={<SocialCardIcon src="/icons/TGsvg.svg" alt="Telegram" />}
            title={labels.telegram}
            value={siteSettings.footerTelegram}
            href={telegramHref}
          />
          <ContactCard
            icon={
              <SocialCardIcon src="/icons/INSTAsvg.svg" alt="Instagram" />
            }
            title={labels.instagram}
            value={siteSettings.footerInstagram}
            href={instagramHref}
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <ContactMessageForm
              locale={locale}
              labels={{
                namePlaceholder: labels.namePlaceholder,
                phonePlaceholder: labels.phonePlaceholder,
                messagePlaceholder: labels.messagePlaceholder,
                submit: labels.submit,
                submitPending: labels.submitPending,
                success: labels.success,
                requiredError: labels.requiredError,
                fallbackError: labels.fallbackError
              }}
            />
          </div>

          <div className="overflow-hidden rounded-[4px] border border-black/10 bg-[#f7f5f1]">
            <iframe
              title={`${brandName} map`}
              src={buildMapEmbedSrc(mapQuery)}
              className="h-[320px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
