"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/cart-provider";
import { useCustomerProfile } from "@/components/customer-profile-provider";
import type { Locale } from "@/lib/i18n";

type HeaderCommerceLabels = {
  login: string;
  profile: string;
  logout: string;
};

type HeaderCommerceProps = {
  locale: Locale;
  labels: HeaderCommerceLabels;
  onInteract?: () => void;
  onCloseMenu?: () => void;
};

export function DesktopHeaderCommerceActions({ locale, labels, onInteract }: HeaderCommerceProps) {
  const { profile, isLoggedIn, clearProfile } = useCustomerProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      {isLoggedIn && profile ? (
        <div className="relative">
          <button
            type="button"
            className="flex min-w-[128px] flex-col items-end text-right"
            onClick={() => {
              setIsProfileOpen((current) => !current);
              onInteract?.();
            }}
          >
            <span className="text-[12px] font-medium leading-none text-black">{profile.fullName}</span>
            <span className="mt-1 text-[11px] leading-none text-black/55">{profile.phone}</span>
          </button>

          {isProfileOpen ? (
            <div className="absolute right-0 top-[calc(100%+10px)] z-20 min-w-[156px] overflow-hidden rounded-[10px] border border-black/12 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
              <div className="border-b border-black/8 px-4 py-3">
                <p className="text-[11px] text-black/35">{labels.profile}</p>
                <p className="mt-1 text-[13px] font-medium text-black">{profile.fullName}</p>
                <p className="mt-1 text-[12px] text-black/55">{profile.phone}</p>
              </div>
              <button
                type="button"
                className="block w-full px-4 py-3 text-left text-[13px] text-[var(--brand)] transition hover:bg-[#f8f6f4]"
                onClick={() => {
                  clearProfile();
                  setIsProfileOpen(false);
                }}
              >
                {labels.logout}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <Link
          href={`/${locale}/login`}
          className="text-[13px] leading-none text-black transition hover:text-[var(--brand)]"
          onClick={() => {
            setIsProfileOpen(false);
            onInteract?.();
          }}
        >
          {labels.login}
        </Link>
      )}

    </>
  );
}

export function DesktopHeaderCartAction({ locale }: Pick<HeaderCommerceProps, "locale">) {
  const { count } = useCart();

  return (
    <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-7 w-7 shrink-0 items-center justify-center text-black">
      <Image src="/icons/basket.svg" alt="" width={31} height={31} className="h-7 w-7" aria-hidden="true" />
      <span className="absolute -right-[8px] -top-[7px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#ea0025] px-[4px] text-[10px] font-bold leading-none text-white">
        {count}
      </span>
    </Link>
  );
}

export function MobileHeaderCartAction({ locale }: Pick<HeaderCommerceProps, "locale">) {
  const { count } = useCart();

  return (
    <Link href={`/${locale}/cart`} aria-label="Cart" className="relative flex h-[34px] w-[34px] items-center justify-center text-black">
      <Image src="/icons/basket.svg" alt="" width={31} height={31} className="h-[22px] w-[22px]" aria-hidden="true" />
      <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#d1112e] px-1 text-[9px] font-bold text-white">
        {count}
      </span>
    </Link>
  );
}

export function MobileMenuProfileAction({ locale, labels, onCloseMenu }: HeaderCommerceProps) {
  const { profile, isLoggedIn, clearProfile } = useCustomerProfile();

  if (isLoggedIn && profile) {
    return (
      <div className="rounded-[18px] border border-black/8 bg-[#faf8f6] px-5 py-4">
        <p className="text-[12px] text-black/35">{labels.profile}</p>
        <p className="mt-1.5 text-[17px] font-medium text-black">{profile.fullName}</p>
        <p className="mt-1 text-[14px] text-black/55">{profile.phone}</p>
        <button
          type="button"
          className="mt-4 text-[14px] text-[#ba0c2f]"
          onClick={() => {
            clearProfile();
            onCloseMenu?.();
          }}
        >
          {labels.logout}
        </button>
      </div>
    );
  }

  return (
    <Link href={`/${locale}/login`} className="text-[17px] text-black" onClick={onCloseMenu}>
      {labels.login}
    </Link>
  );
}
