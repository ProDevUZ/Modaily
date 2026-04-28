import { AdminShell } from "@/components/admin/admin-shell";
import { SkinTypeListManager } from "@/components/admin/skin-type-manager";

export default function AdminSkinTypesPage() {
  return (
    <AdminShell
      current="skin-types"
      hideHeader
      mainClassName="p-0"
      contentClassName=""
      title="Тип кожи"
      description="Управление справочником типов кожи. Используется в карточках товаров и в фильтрах каталога."
    >
      <SkinTypeListManager />
    </AdminShell>
  );
}
