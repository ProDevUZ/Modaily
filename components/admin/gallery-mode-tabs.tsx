"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const galleryModes = [
  { key: "image", href: "/admin/content/gallery/image", label: "Изображения" },
  { key: "video", href: "/admin/content/gallery/video", label: "Видео" }
] as const;

export function GalleryModeTabs() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <nav className="inline-flex min-w-max items-center gap-1.5 rounded-full border border-[#e4ebf6] bg-white/92 p-1.5 shadow-[0_18px_30px_rgba(148,163,184,0.1)]">
        {galleryModes.map((mode) => {
          const active = pathname === mode.href;

          return (
            <Link
              key={mode.key}
              href={mode.href}
              className={`admin-content-tab inline-flex min-w-[170px] items-center justify-center gap-3 px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "admin-content-tab-active"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span
                className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-semibold ${
                  active ? "bg-[var(--brand)] text-white" : "bg-[#f3f6fb] text-slate-500"
                }`}
              >
                {mode.key === "image" ? "Фото" : "Видео"}
              </span>
              {mode.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
