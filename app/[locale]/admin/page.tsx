import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { isLocale, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOverviewPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  return (
    <AdminShell
      locale={locale}
      current="overview"
      title="Backend management"
      description="Bu bo‘limda authsiz admin ishlaydi. User, Product va Category ma’lumotlari Prisma orqali SQLite bazada saqlanadi va API CRUD route’lari bilan boshqariladi."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {[
          {
            title: "Users",
            copy: "Customer yoki lead yozuvlarini boshqarish.",
            href: `/${locale}/admin/users`
          },
          {
            title: "Products",
            copy: "Multilingual mahsulot kartalari, SKU, narx, stock va status.",
            href: `/${locale}/admin/products`
          },
          {
            title: "Categories",
            copy: "Kategoriyalarni uch tilda yuritish va mahsulotlarga bog‘lash.",
            href: `/${locale}/admin/categories`
          }
        ].map((item) => (
          <Link key={item.title} href={item.href} className="glass rounded-[1.8rem] p-6 transition hover:-translate-y-1">
            <p className="eyebrow">Admin module</p>
            <h2 className="mt-3 font-display text-3xl text-ink">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">{item.copy}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
