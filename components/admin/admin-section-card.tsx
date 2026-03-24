import Link from "next/link";

type AdminSectionCardProps = {
  title: string;
  href: string;
  copy: string;
};

export function AdminSectionCard({ title, href, copy }: AdminSectionCardProps) {
  return (
    <Link href={href} className="admin-panel-muted p-5 transition hover:-translate-y-1 hover:shadow-md">
      <p className="text-lg font-semibold text-slate-950">{title}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{copy}</p>
    </Link>
  );
}
