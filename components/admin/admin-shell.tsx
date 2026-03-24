import Link from "next/link";

import { adminSections, type AdminSectionKey } from "@/lib/admin-navigation";

type AdminShellProps = {
  title: string;
  description: string;
  current: AdminSectionKey;
  children: React.ReactNode;
};

export function AdminShell({ title, description, current, children }: AdminShellProps) {
  return (
    <section className="min-h-screen bg-[#0b1119] text-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-0 xl:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-[#08101a] px-5 py-6 xl:border-b-0 xl:border-r">
          <div className="sticky top-0">
            <Link
              href="/admin"
              className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200"
            >
              Modaily Admin
            </Link>
            <h1 className="mt-6 font-display text-4xl text-white">Control room</h1>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Storefrontdan alohida admin panel. Hozir authsiz ishlaydi va `User`, `Product`, `Category`
              CRUD shu yerda boshqariladi.
            </p>
            <div className="mt-8 space-y-2">
              {adminSections.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    current === link.key
                      ? "bg-cyan-400 text-slate-950"
                      : "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                  }`}
                >
                  <span className="block">{link.label}</span>
                  <span className="mt-1 block text-xs font-normal text-slate-400">{link.summary}</span>
                </Link>
              ))}
            </div>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">System status</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-200">Admin structure and CRUD API are active</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,24,39,0.98),rgba(10,18,30,0.92))] p-6 shadow-2xl shadow-cyan-950/20">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-cyan-200">Dashboard</p>
              <h2 className="mt-3 font-display text-4xl text-white">{title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{description}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
