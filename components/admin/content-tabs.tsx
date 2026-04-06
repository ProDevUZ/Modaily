"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminContentSections } from "@/lib/admin-content-navigation";

export function ContentTabs() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto">
      <nav className="flex min-w-max items-center gap-2 rounded-[1.75rem] border border-slate-200 bg-white p-2">
        {adminContentSections.map((section) => {
          const active = section.key === "gallery" ? pathname.startsWith("/admin/content/gallery") : pathname === section.href;

          return (
            <Link
              key={section.key}
              href={section.href}
              className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                active ? "bg-[#0a0720] text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
