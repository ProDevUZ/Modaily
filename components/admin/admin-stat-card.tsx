type AdminStatCardProps = {
  label: string;
  value: number | string;
  copy: string;
};

export function AdminStatCard({ label, value, copy }: AdminStatCardProps) {
  return (
    <article className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">{label}</p>
      <p className="mt-4 font-display text-5xl text-white">{value}</p>
      <p className="mt-4 text-sm leading-7 text-slate-300">{copy}</p>
    </article>
  );
}
