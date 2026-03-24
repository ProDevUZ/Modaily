import Link from "next/link";

import type { Locale } from "@/lib/i18n";

const adminLinks = [
  { key: "overview", href: "", label: "Overview" },
  { key: "users", href: "/users", label: "Users" },
  { key: "products", href: "/products", label: "Products" },
  { key: "categories", href: "/categories", label: "Categories" }
];

type AdminShellProps = {
  locale: Locale;
  title: string;
  description: string;
  current: "overview" | "users" | "products" | "categories";
  children: React.ReactNode;
};

export function AdminShell({ locale, title, description, current, children }: AdminShellProps) {
  return (
    <section className="section-gap">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="glass h-fit rounded-[2rem] p-5">
            <p className="eyebrow">Admin</p>
            <h1 className="mt-3 font-display text-3xl text-ink">Modaily CMS</h1>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Auth keyingi bosqichda ulanadi. Hozir bu joy User, Product va Category CRUD uchun ochiq admin panel.
            </p>
            <div className="mt-6 space-y-2">
              {adminLinks.map((link) => (
                <Link
                  key={link.key}
                  href={`/${locale}/admin${link.href}`}
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold ${
                    current === link.key ? "bg-ink text-sand" : "bg-white/70 text-stone-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-6">
              <p className="eyebrow">Control panel</p>
              <h2 className="mt-3 font-display text-4xl text-ink">{title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
