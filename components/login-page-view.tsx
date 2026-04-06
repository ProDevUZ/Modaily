"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useCustomerProfile } from "@/components/customer-profile-provider";
import type { Dictionary, Locale } from "@/lib/i18n";

type LoginPageViewProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const copy = {
  uz: {
    eyebrow: "Profil",
    title: "Login",
    description: "Header profil qismi uchun ismingiz va telefon raqamingizni kiriting.",
    name: "Ism",
    phone: "Telefon raqam",
    submit: "Saqlash",
    back: "Katalogga qaytish"
  },
  ru: {
    eyebrow: "Профиль",
    title: "Login",
    description: "Введите имя и номер телефона для пользовательского профиля в header.",
    name: "Имя",
    phone: "Номер телефона",
    submit: "Сохранить",
    back: "Вернуться в каталог"
  },
  en: {
    eyebrow: "Profile",
    title: "Login",
    description: "Enter your name and phone number for the customer profile shown in the header.",
    name: "Name",
    phone: "Phone number",
    submit: "Save",
    back: "Back to catalog"
  }
} as const;

export function LoginPageView({ locale }: LoginPageViewProps) {
  const router = useRouter();
  const { profile, saveProfile } = useCustomerProfile();
  const [fullName, setFullName] = useState(profile?.fullName ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");

  const labels = copy[locale];

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[540px] rounded-[28px] border border-black/8 bg-[#faf8f6] p-8 md:p-10">
          <p className="text-[12px] uppercase tracking-[0.26em] text-black/35">{labels.eyebrow}</p>
          <h1 className="mt-4 text-[42px] leading-none text-black">{labels.title}</h1>
          <p className="mt-4 text-[16px] leading-7 text-black/58">{labels.description}</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveProfile({
                fullName: fullName.trim(),
                phone: phone.trim()
              });
              router.push(`/${locale}`);
            }}
          >
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder={labels.name}
              className="h-14 w-full rounded-[16px] border border-black/12 bg-white px-5 text-[15px] text-black outline-none transition focus:border-[var(--brand)]"
              required
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder={labels.phone}
              className="h-14 w-full rounded-[16px] border border-black/12 bg-white px-5 text-[15px] text-black outline-none transition focus:border-[var(--brand)]"
              required
            />
            <button
              type="submit"
              className="inline-flex h-14 w-full items-center justify-center rounded-[16px] bg-[var(--brand)] px-6 text-[14px] uppercase tracking-[0.16em] text-white transition hover:opacity-90"
            >
              {labels.submit}
            </button>
          </form>

          <Link href={`/${locale}/catalog`} className="mt-5 inline-block text-sm text-black/55 transition hover:text-[var(--brand)]">
            {labels.back}
          </Link>
        </div>
      </div>
    </section>
  );
}
