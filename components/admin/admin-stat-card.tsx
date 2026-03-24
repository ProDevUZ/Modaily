type AdminStatCardProps = {
  label: string;
  value: number | string;
  copy: string;
  change?: string;
};

export function AdminStatCard({ label, value, copy, change }: AdminStatCardProps) {
  return (
    <article className="admin-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-900">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 17h16" />
            <path d="M7 17V7" />
            <path d="M12 17v-4" />
            <path d="M17 17v-8" />
          </svg>
        </span>
        {change ? <span className="text-sm font-semibold text-emerald-500">{change}</span> : null}
      </div>
      <p className="mt-5 text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-5xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{copy}</p>
    </article>
  );
}
