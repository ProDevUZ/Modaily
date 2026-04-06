import { AdminShell } from "@/components/admin/admin-shell";
import { ContentTabs } from "@/components/admin/content-tabs";

export default function AdminContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      current="content"
      title="Content CMS"
      description="Homepage editorial bloklari va storefront content endi alohida sahifalarga bo'lingan."
    >
      <div className="space-y-6">
        <ContentTabs />
        {children}
      </div>
    </AdminShell>
  );
}
