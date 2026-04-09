import { AdminShell } from "@/components/admin/admin-shell";
import type { AdminSectionKey } from "@/lib/admin-navigation";

type AdminPlaceholderPageProps = {
  current: AdminSectionKey;
  title: string;
  description: string;
  points: string[];
};

export function AdminPlaceholderPage({
  current,
  title,
  description,
  points
}: AdminPlaceholderPageProps) {
  return (
    <AdminShell current={current} title={title} description={description}>
      <div className="admin-panel p-6">
        <h2 className="text-2xl font-semibold text-slate-950">Структура модуля</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {points.map((point) => (
            <div key={point} className="admin-panel-muted p-5">
              <p className="text-sm font-medium leading-7 text-slate-700">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
