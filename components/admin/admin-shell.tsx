"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { adminSections, type AdminSectionKey } from "@/lib/admin-navigation";

type AdminShellProps = {
  title: string;
  description: string;
  current: AdminSectionKey;
  subHeader?: React.ReactNode;
  children: React.ReactNode;
};

const navToneMap: Record<
  AdminSectionKey,
  { iconBg: string; iconText: string; iconBorder: string; activeGlow: string }
> = {
  overview: {
    iconBg: "bg-[#eef3ff]",
    iconText: "text-[#5777ff]",
    iconBorder: "border-[#dbe4ff]",
    activeGlow: "shadow-[0_16px_34px_rgba(87,119,255,0.14)]"
  },
  products: {
    iconBg: "bg-[#fff2f4]",
    iconText: "text-[var(--brand)]",
    iconBorder: "border-[#ffdbe2]",
    activeGlow: "shadow-[0_16px_34px_rgba(186,12,47,0.12)]"
  },
  categories: {
    iconBg: "bg-[#fff7e8]",
    iconText: "text-[#f0a320]",
    iconBorder: "border-[#ffe7b3]",
    activeGlow: "shadow-[0_16px_34px_rgba(240,163,32,0.12)]"
  },
  content: {
    iconBg: "bg-[#fff0f6]",
    iconText: "text-[#ec4899]",
    iconBorder: "border-[#ffd5e8]",
    activeGlow: "shadow-[0_16px_34px_rgba(236,72,153,0.14)]"
  },
  settings: {
    iconBg: "bg-[#f4f6fa]",
    iconText: "text-[#64748b]",
    iconBorder: "border-[#e2e8f0]",
    activeGlow: "shadow-[0_16px_34px_rgba(100,116,139,0.12)]"
  },
  shop: {
    iconBg: "bg-[#eefcf7]",
    iconText: "text-[#10b981]",
    iconBorder: "border-[#d0f5e7]",
    activeGlow: "shadow-[0_16px_34px_rgba(16,185,129,0.14)]"
  }
};

function AdminNavIcon({ section, active }: { section: AdminSectionKey; active: boolean }) {
  const tone = navToneMap[section];
  const iconClass = active
    ? "border-transparent bg-[#0f172a] text-white"
    : `${tone.iconBg} ${tone.iconText} ${tone.iconBorder}`;

  return (
    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${iconClass}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-4.5 w-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {section === "overview" ? (
          <>
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="5" rx="1.5" />
            <rect x="14" y="10" width="7" height="11" rx="1.5" />
            <rect x="3" y="12" width="7" height="9" rx="1.5" />
          </>
        ) : null}
        {section === "products" ? (
          <>
            <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
            <path d="m4 7 8 4 8-4" />
            <path d="M12 11v10" />
          </>
        ) : null}
        {section === "categories" ? (
          <>
            <path d="M4 7h7" />
            <path d="M4 12h7" />
            <path d="M4 17h7" />
            <rect x="14" y="5" width="6" height="4" rx="1" />
            <rect x="14" y="10" width="6" height="4" rx="1" />
            <rect x="14" y="15" width="6" height="4" rx="1" />
          </>
        ) : null}
        {section === "content" ? (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2.5" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
            <path d="M8 17h8" />
          </>
        ) : null}
        {section === "settings" ? (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
          </>
        ) : null}
        {section === "shop" ? (
          <>
            <path d="M5 10.5h14" />
            <path d="M6 10.5 7.3 5h9.4l1.3 5.5" />
            <path d="M7 10.5V18a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-7.5" />
            <path d="M10 14h4" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

export function AdminShell({ title, description, current, subHeader, children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showSearch = current === "products" || current === "categories";
  const searchValue = searchParams.get("q") || "";

  function handleSearchChange(value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  return (
    <section className="admin-surface">
      <div className="grid min-h-screen xl:grid-cols-[332px_1fr]">
        <aside className="border-b border-[#e9eef7] bg-white xl:border-b-0 xl:border-r">
          <div className="px-10 py-8">
            <Link href="/admin" className="flex items-center gap-4 rounded-3xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.35rem] bg-[#0f172a] text-white shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 10V8a6 6 0 0 1 12 0v2" />
                  <rect x="4" y="10" width="16" height="10" rx="2.5" />
                  <path d="M9.5 14h5" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="brand-wordmark text-[32px] uppercase leading-none text-[var(--brand)]">Modaily</p>
                <p className="mt-1 text-xs font-medium tracking-[0.24em] text-slate-400">Панель управления</p>
              </div>
            </Link>
          </div>

          <nav className="space-y-1.5 px-8 pb-8">
            {adminSections.map((section) => {
              const active = current === section.key || pathname === section.href;
              const tone = navToneMap[section.key];

              return (
                <Link
                  key={section.key}
                  href={section.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? `bg-white text-slate-950 shadow-[0_14px_30px_rgba(15,23,42,0.06)] ${tone.activeGlow}`
                      : "text-slate-500 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  <AdminNavIcon section={section.key} active={active} />
                  <span>{section.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-[#e9eef7] bg-[#fbfcff]">
            <div
              className={`px-5 py-5 lg:px-8 ${
                showSearch
                  ? "flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
                  : "space-y-3"
              }`}
            >
              <div className="max-w-[1100px]">
                <h1 className="text-[2.35rem] font-semibold tracking-tight text-slate-950">{title}</h1>
                <p className="mt-3 text-base leading-7 text-slate-500">{description}</p>
              </div>

              {showSearch ? (
                <div className="w-full max-w-[460px] lg:shrink-0">
                  <div className="relative w-full">
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-300">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                    </span>
                    <input
                      className="admin-input bg-white pl-12 placeholder:text-slate-300"
                      placeholder="Поиск..."
                      value={searchValue}
                      onChange={(event) => handleSearchChange(event.target.value)}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </header>

          {subHeader ? (
            <div className="border-b border-[#e8eef8] bg-white/72 backdrop-blur-xl">
              <div className="px-5 py-4 lg:px-8">{subHeader}</div>
            </div>
          ) : null}

          <main className="px-5 py-6 lg:px-8">
            <div className="space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </section>
  );
}
