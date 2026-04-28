import { AdminShell } from "@/components/admin/admin-shell";
import { SkinTypeEditor } from "@/components/admin/skin-type-manager";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminSkinTypeEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell
      current="skin-types"
      searchable={false}
      hideHeader
      title="Редактирование типа кожи"
      description="Отдельная рабочая зона для редактирования типа кожи."
      mainClassName="p-0"
      contentClassName=""
    >
      <SkinTypeEditor skinTypeId={id} />
    </AdminShell>
  );
}
