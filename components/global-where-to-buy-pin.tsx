"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { Locale } from "@/lib/i18n";
import type { ShopLocationRecord } from "@/lib/shop-location-types";

const copy: Record<
  Locale,
  {
    button: string;
    overlayTitle: string;
    overlayDescription: string;
    mapCta: string;
    hoursLabel: string;
    closeLabel: string;
    emptyTitle: string;
    emptyDescription: string;
  }
> = {
  uz: {
    button: "Qayerdan sotib olish",
    overlayTitle: "Qayerdan sotib olish",
    overlayDescription: "Sizga yaqin bo'lgan do'kon manzili, xarita havolasi va ish vaqtlarini shu yerda ko'rishingiz mumkin.",
    mapCta: "Xaritani ochish",
    hoursLabel: "Ish vaqti",
    closeLabel: "Yopish",
    emptyTitle: "Do'konlar hali qo'shilmagan",
    emptyDescription: "Admin paneldan birinchi manzil qo'shilgach, bu yerda user uchun ro'yxat paydo bo'ladi."
  },
  ru: {
    button: "Где купить",
    overlayTitle: "Где купить",
    overlayDescription: "Здесь собраны адреса магазинов, ссылки на карту и актуальные часы работы.",
    mapCta: "Открыть карту",
    hoursLabel: "Время работы",
    closeLabel: "Закрыть",
    emptyTitle: "Точки продаж пока не добавлены",
    emptyDescription: "Как только в админ-панели появится первая локация, она отобразится здесь списком."
  },
  en: {
    button: "Where to buy",
    overlayTitle: "Where to buy",
    overlayDescription: "Browse store addresses, map links, and opening hours in one clean overlay.",
    mapCta: "Open map",
    hoursLabel: "Opening hours",
    closeLabel: "Close",
    emptyTitle: "No stores added yet",
    emptyDescription: "Once the first location is added in admin, it will appear here for users."
  }
};

type GlobalWhereToBuyPinProps = {
  locale: Locale;
  locations: ShopLocationRecord[];
};

function buildMapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function GlobalWhereToBuyPin({ locale, locations }: GlobalWhereToBuyPinProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const labels = copy[locale];
  const isProductPage = useMemo(
    () => new RegExp(`^/${locale}/catalog/[^/]+$`).test(pathname || ""),
    [locale, pathname]
  );
  const orderedLocations = useMemo(
    () =>
      [...locations].sort((left, right) => {
        if (left.sortOrder !== right.sortOrder) {
          return left.sortOrder - right.sortOrder;
        }

        return left.createdAt.localeCompare(right.createdAt);
      }),
    [locations]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    function handleOpenRequest() {
      setOpen(true);
    }

    window.addEventListener("modaily:open-where-to-buy", handleOpenRequest);

    return () => {
      window.removeEventListener("modaily:open-where-to-buy", handleOpenRequest);
    };
  }, []);

  return (
    <>
      {!isProductPage ? (
        <button
          type="button"
          aria-label={labels.button}
          onClick={() => setOpen(true)}
          className="where-to-buy-pin group fixed bottom-6 right-4 z-[260] flex h-[86px] w-[86px] items-start justify-center rounded-[999px] border border-white/55 pt-3 text-[#8e1431] shadow-[0_18px_40px_rgba(104,34,49,0.18)] backdrop-blur-xl transition-transform duration-300 hover:scale-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ba0c2f]/35 focus-visible:ring-offset-2 sm:bottom-10 sm:right-8 sm:h-[102px] sm:w-[102px] sm:pt-4 lg:bottom-12"
        >
          <span className="where-to-buy-pin-tail pointer-events-none absolute left-1/2 top-[67px] h-[26px] w-[26px] -translate-x-1/2 rotate-45 rounded-[7px] border-r border-b border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08))] sm:top-[79px] sm:h-[30px] sm:w-[30px]" />
          <span className="pointer-events-none absolute inset-[1px] rounded-[999px] bg-[linear-gradient(180deg,rgba(255,255,255,0.44),rgba(255,255,255,0.12))]" />
          <span className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#d11842] shadow-[0_0_14px_rgba(209,24,66,0.65)]">
            <span className="where-to-buy-signal absolute inset-0 rounded-full bg-[#d11842]/45" />
          </span>
          <span className="relative z-10 flex flex-col items-center gap-1 text-center">
            <span className="where-to-buy-icon relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/72 shadow-[0_10px_20px_rgba(255,255,255,0.22)] sm:h-12 sm:w-12">
              <span className="pointer-events-none absolute h-[18px] w-[18px] rounded-full border border-[#c41a43]/30 sm:h-[22px] sm:w-[22px]" />
              <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.85" aria-hidden="true">
                <path d="M4 9.5 12 4l8 5.5" />
                <path d="M5.5 10.5h13v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" />
                <path d="M9 19.5v-5h6v5" />
                <path d="M9.5 10.5V8h5v2.5" />
              </svg>
            </span>
            {locale === "uz" ? (
              <span className="max-w-[64px] px-2 text-center text-[8px] font-semibold leading-[1.12] tracking-[0.08em] text-[#7a1029] sm:max-w-[72px] sm:text-[9px]">
                <span className="block whitespace-nowrap">Qayerdan</span>
                <span className="block whitespace-nowrap">sotib olish</span>
              </span>
            ) : (
              <span className="px-2 text-[9px] font-semibold uppercase leading-tight tracking-[0.18em] text-[#7a1029] sm:text-[10px]">
                {labels.button}
              </span>
            )}
          </span>
        </button>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-[320] flex items-end justify-center bg-[#1b1020]/38 px-4 py-4 backdrop-blur-[8px] sm:items-center sm:px-6" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={labels.overlayTitle}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[85vh] w-full max-w-[860px] flex-col overflow-hidden rounded-[2rem] border border-[#f1dfe4] bg-[linear-gradient(180deg,#fffdfd_0%,#fff8f8_100%)] shadow-[0_26px_90px_rgba(80,17,35,0.24)]"
          >
            <div className="border-b border-[#f2e5e8] px-5 py-5 sm:px-7 sm:py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-[560px]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#ba0c2f]/65">
                    Modaily
                  </p>
                  <h3 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#51121f] sm:text-[2.3rem]">
                    {labels.overlayTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#6f4b55] sm:text-[15px]">
                    {labels.overlayDescription}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#ead9dd] bg-white text-[#8e1431] transition hover:bg-[#fff5f7]"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {orderedLocations.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-[#e8d6db] bg-white/65 px-5 py-10 text-center">
                  <p className="text-lg font-semibold text-[#51121f]">{labels.emptyTitle}</p>
                  <p className="mx-auto mt-2 max-w-[420px] text-sm leading-7 text-[#7a5b64]">
                    {labels.emptyDescription}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderedLocations.map((location, index) => (
                    <div
                      key={location.id}
                      className="rounded-[1.6rem] border border-[#f0dfe4] bg-white px-5 py-5 shadow-[0_16px_34px_rgba(135,20,49,0.06)] sm:px-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ba0c2f]/65">
                            {String(index + 1).padStart(2, "0")}
                          </p>
                          <p className="mt-2 max-w-[560px] text-[1.05rem] leading-7 text-[#4a1a25] sm:text-[1.15rem]">
                            {location.address}
                          </p>
                        </div>

                        <a
                          href={location.mapLink || buildMapHref(location.address)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-[#e6c9d2] px-5 text-sm font-semibold text-[#8e1431] transition hover:bg-[#fff4f6]"
                        >
                          {labels.mapCta}
                        </a>
                      </div>

                      {location.workingHours.length > 0 ? (
                        <div className="mt-5 rounded-[1.25rem] bg-[#fff7f8] px-4 py-4 sm:px-5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ba0c2f]/65">
                            {labels.hoursLabel}
                          </p>
                          <div className="mt-3 space-y-2.5">
                            {location.workingHours.map((hour) => (
                              <div key={hour.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm sm:text-[15px]">
                                <span className="font-medium text-[#5f2b37]">
                                  {hour.label || labels.hoursLabel}
                                </span>
                                <span className="text-[#7e5964]">{hour.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-[#f2e5e8] px-5 py-4 sm:px-7">
              <div className="flex justify-end">
                <button type="button" className="admin-button-secondary min-w-[132px]" onClick={() => setOpen(false)}>
                  {labels.closeLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
