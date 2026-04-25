"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { adminSections, type AdminSectionKey } from "@/lib/admin-navigation";

type AdminShellProps = {
  title: string;
  description: string;
  current: AdminSectionKey;
  subHeader?: React.ReactNode;
  searchable?: boolean;
  hideHeader?: boolean;
  headerVariant?: "default" | "compact";
  headerAccessory?: React.ReactNode;
  mainClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

function AdminNavIcon({ section, active }: { section: AdminSectionKey; active: boolean }) {
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center ${active ? "text-slate-700" : "text-slate-400"}`}>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
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
        {section === "users" ? (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="3" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 4.13a4 4 0 0 1 0 7.75" />
          </>
        ) : null}
        {section === "messages" ? (
          <>
            <path d="M5 6.5h14A1.5 1.5 0 0 1 20.5 8v8A1.5 1.5 0 0 1 19 17.5H9.5L5 20v-3.5A1.5 1.5 0 0 1 3.5 15V8A1.5 1.5 0 0 1 5 6.5Z" />
            <path d="m7.5 10 4.1 3a.7.7 0 0 0 .8 0l4.1-3" />
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
        {section === "blog" ? (
          <>
            <path d="M6 5.5h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" />
            <path d="M8 9h8" />
            <path d="M8 12.5h8" />
            <path d="M8 16h5" />
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

const adminUtilityLinks = [
  {
    label: "Admin Profile",
    href: "/admin123/settings",
    icon: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </>
    )
  },
  {
    label: "Logout",
    href: "/",
    icon: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </>
    )
  }
] as const;

export function AdminShell({
  title,
  description,
  current,
  subHeader,
  searchable,
  hideHeader,
  headerVariant = "default",
  headerAccessory,
  mainClassName,
  contentClassName,
  children
}: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const showSearch = searchable ?? (current === "products" || current === "categories");
  const searchValue = searchParams.get("q") || "";
  const compactHeader = headerVariant === "compact";

  useEffect(() => {
    function resizeTextarea(textarea: HTMLTextAreaElement) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    function resizeAllTextareas() {
      document.querySelectorAll<HTMLTextAreaElement>("textarea.admin-textarea").forEach(resizeTextarea);
    }

    function handleInput(event: Event) {
      const target = event.target;

      if (target instanceof HTMLTextAreaElement && target.classList.contains("admin-textarea")) {
        resizeTextarea(target);
      }
    }

    const timers = [0, 120, 350, 800].map((delay) => window.setTimeout(resizeAllTextareas, delay));

    document.addEventListener("input", handleInput, true);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("input", handleInput, true);
    };
  }, [pathname]);

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
      <div className="grid min-h-screen xl:grid-cols-[280px_1fr]">
        <aside className="flex flex-col border-b border-[#e5eaf2] bg-white xl:border-b-0 xl:border-r">
          <div className="border-b border-[#e5eaf2] px-7 py-8">
            <Link href="/admin123" className="inline-flex">
              <p className="brand-wordmark text-[31px] uppercase leading-none text-slate-950">Modaily</p>
            </Link>
          </div>

          <nav className="flex-1 space-y-1.5 px-4 py-6">
            {adminSections.map((section) => {
              const active = current === section.key || pathname === section.href;

              return (
                <Link
                  key={section.key}
                  href={section.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-[1.04rem] font-medium transition ${
                    active
                      ? "bg-[#f3f5f8] text-slate-900"
                      : "text-slate-500 hover:bg-[#f8fafc] hover:text-slate-800"
                  }`}
                >
                  <AdminNavIcon section={section.key} active={active} />
                  <span>{section.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#e5eaf2] px-4 py-5">
            <div className="space-y-1.5">
              {adminUtilityLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[1.04rem] font-medium text-slate-500 transition hover:bg-[#f8fafc] hover:text-slate-800"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.icon}
                    </svg>
                  </span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {!hideHeader ? (
            <header className={`border-b border-[#e9eef7] ${compactHeader ? "bg-white" : "bg-[#fbfcff]"}`}>
              {compactHeader ? (
                <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                  <div className="min-w-0">
                    <h1 className="text-[1.95rem] font-semibold tracking-tight text-slate-950">{title}</h1>
                    {description ? <p className="mt-1.5 text-sm text-slate-500">{description}</p> : null}
                  </div>

                  {(showSearch || headerAccessory) ? (
                    <div className="flex items-center gap-3 lg:shrink-0">
                      {showSearch ? (
                        <div className="relative w-full min-w-[260px] max-w-[360px]">
                          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-300">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="11" cy="11" r="7" />
                              <path d="m20 20-3.5-3.5" />
                            </svg>
                          </span>
                          <input
                            className="admin-input h-11 bg-[#f8faff] pl-12 placeholder:text-slate-300"
                            placeholder="Поиск..."
                            value={searchValue}
                            onChange={(event) => handleSearchChange(event.target.value)}
                          />
                        </div>
                      ) : null}

                      {headerAccessory}
                    </div>
                  ) : null}
                </div>
              ) : (
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
              )}
            </header>
          ) : null}

          {subHeader ? (
            <div className="border-b border-[#e8eef8] bg-white/72 backdrop-blur-xl">
              <div className="px-5 py-4 lg:px-8">{subHeader}</div>
            </div>
          ) : null}

          <main className={mainClassName || "px-5 py-6 lg:px-8"}>
            <div className={contentClassName || "space-y-6"}>{children}</div>
          </main>
        </div>
      </div>
    </section>
  );
}
