import Link from "next/link";

type AdminSectionCardProps = {
  title: string;
  href: string;
  copy: string;
};

export function AdminSectionCard({ title, href, copy }: AdminSectionCardProps) {
  return (
    <Link
      href={href}
      className="rounded-[1.4rem] border border-white/10 bg-slate-950/40 p-5 transition hover:-translate-y-1 hover:border-cyan-400/40"
    >
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{copy}</p>
    </Link>
  );
}
