"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminContentSections } from "@/lib/admin-content-navigation";

export function ContentTabs() {
  const pathname = usePathname();

  return (
    <div className="admin-content-rail overflow-x-auto">
      <div className="flex min-w-max items-center gap-5">
        <div className="hidden min-w-[220px] items-center gap-3 lg:flex">
          <span className="h-10 w-[3px] rounded-full bg-[var(--brand)] shadow-[0_0_0_6px_rgba(186,12,47,0.08)]" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Навигация контента</p>
            <p className="mt-1 text-sm text-slate-500">Выберите блок для редактирования</p>
          </div>
        </div>

        <nav className="flex min-w-max items-center gap-1.5 rounded-full border border-[#e4ebf6] bg-white/92 p-1.5 shadow-[0_18px_30px_rgba(148,163,184,0.1)]">
        {adminContentSections.map((section, index) => {
          const active = section.key === "gallery" ? pathname.startsWith("/admin/content/gallery") : pathname === section.href;

          return (
            <Link
              key={section.key}
              href={section.href}
              className={`admin-content-tab group inline-flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition ${
                active ? "admin-content-tab-active" : "text-slate-500 hover:text-slate-900"
              }`}
              title={section.description}
            >
              <span
                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-semibold ${
                  active ? "bg-[var(--brand)] text-white" : "bg-[#f3f6fb] text-slate-400"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{section.label}</span>
            </Link>
          );
        })}
        </nav>
      </div>
    </div>
  );
}
