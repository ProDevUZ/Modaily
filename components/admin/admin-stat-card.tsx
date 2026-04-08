type AdminStatCardProps = {
  label: string;
  value: number | string;
  copy: string;
  change?: string;
  tone?: "blue" | "yellow" | "purple" | "green";
};

const toneMap = {
  blue: {
    chip: "bg-[#eef3ff] text-[#5777ff]",
    change: "text-[#5777ff]"
  },
  yellow: {
    chip: "bg-[#fff7df] text-[#f0b429]",
    change: "text-[#f0b429]"
  },
  purple: {
    chip: "bg-[#f4efff] text-[#8b5cf6]",
    change: "text-[#8b5cf6]"
  },
  green: {
    chip: "bg-[#eefaf4] text-[#22a06b]",
    change: "text-[#22a06b]"
  }
} as const;

export function AdminStatCard({ label, value, copy, change, tone = "blue" }: AdminStatCardProps) {
  const styles = toneMap[tone];

  return (
    <article className="admin-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.chip}`}>
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 17h16" />
            <path d="M7 17V7" />
            <path d="M12 17v-4" />
            <path d="M17 17v-8" />
          </svg>
        </span>
        {change ? <span className={`text-sm font-semibold ${styles.change}`}>{change}</span> : null}
      </div>
      <p className="mt-5 text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-[2.1rem] font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{copy}</p>
    </article>
  );
}
