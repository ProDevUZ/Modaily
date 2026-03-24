"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { adminSections, type AdminSectionKey } from "@/lib/admin-navigation";

type AdminShellProps = {
  title: string;
  description: string;
  current: AdminSectionKey;
  children: React.ReactNode;
};

function AdminNavIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${
        active ? "border-[#0a0720] bg-[#0a0720] text-white" : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
      </svg>
    </span>
  );
}

export function AdminShell({ title, description, current, children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <section className="admin-surface">
      <div className="grid min-h-screen xl:grid-cols-[240px_1fr]">
        <aside className="border-b border-slate-200 bg-white xl:border-b-0 xl:border-r">
          <div className="px-4 py-5">
            <Link href="/admin" className="flex items-center gap-3 rounded-2xl px-2 py-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0a0720] text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  <rect x="4" y="10" width="16" height="10" rx="2" />
                  <path d="M9 15h6" />
                </svg>
              </span>
              <div>
                <p className="text-2xl font-semibold text-slate-950">Modaily</p>
              </div>
            </Link>
          </div>

          <nav className="space-y-1 px-4 pb-6">
            {adminSections.map((section) => {
              const active = current === section.key || pathname === section.href;

              return (
                <Link
                  key={section.key}
                  href={section.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                    active ? "bg-[#0a0720] text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <AdminNavIcon active={active} />
                  <span>{section.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="relative w-full max-w-xl">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                </span>
                <input className="admin-input pl-12" placeholder="Search..." />
              </div>

              <div className="flex items-center justify-end gap-5">
                <button type="button" className="relative text-slate-500">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
                    <path d="M10 21a2 2 0 0 0 4 0" />
                  </svg>
                  <span className="absolute -right-0.5 top-0 h-2.5 w-2.5 rounded-full bg-red-500" />
                </button>

                <div className="hidden h-10 w-px bg-slate-200 sm:block" />

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-sm font-semibold text-white">
                    AU
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Admin User</p>
                    <p className="text-sm text-slate-500">admin@modaily.com</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="px-5 py-6 lg:px-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
                <p className="mt-3 text-lg text-slate-600">{description}</p>
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
