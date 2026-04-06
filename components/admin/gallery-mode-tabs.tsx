"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const galleryModes = [
  { key: "image", href: "/admin/content/gallery/image", label: "Image" },
  { key: "video", href: "/admin/content/gallery/video", label: "Video" }
] as const;

export function GalleryModeTabs() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <nav className="flex min-w-max items-center gap-4">
        {galleryModes.map((mode) => {
          const active = pathname === mode.href;

          return (
            <Link
              key={mode.key}
              href={mode.href}
              className={`inline-flex min-w-[180px] items-center justify-center border px-8 py-3 text-xl font-semibold transition ${
                active ? "border-[#0a0720] bg-[#0a0720] text-white" : "border-slate-900 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {mode.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
