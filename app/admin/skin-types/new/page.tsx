import { AdminShell } from "@/components/admin/admin-shell";
import { SkinTypeEditor } from "@/components/admin/skin-type-manager";

export default function AdminSkinTypesCreatePage() {
  return (
    <AdminShell
      current="skin-types"
      searchable={false}
      hideHeader
      title="Создание типа кожи"
      description="Новый тип кожи в полноэкранной форме."
      mainClassName="p-0"
      contentClassName=""
    >
      <SkinTypeEditor />
    </AdminShell>
  );
}
