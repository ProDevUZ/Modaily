import { AdminShell } from "@/components/admin/admin-shell";
import { ContentTabs } from "@/components/admin/content-tabs";

export default function AdminContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell
      current="content"
      title="Контент-центр"
      description="Профессиональная панель управления блоками главной страницы, медиа и текстами витрины. Здесь собраны все сценарии, которые команда контента меняет чаще всего."
      subHeader={<ContentTabs />}
    >
      {children}
    </AdminShell>
  );
}
