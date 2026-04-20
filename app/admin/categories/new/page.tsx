import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryEditor } from "@/components/admin/category-manager";

export default function AdminCategoriesCreatePage() {
  return (
    <AdminShell
      current="categories"
      searchable={false}
      hideHeader
      title="Создание категории"
      description="Новая категория в полноэкранной форме."
      mainClassName="p-0"
      contentClassName=""
    >
      <CategoryEditor />
    </AdminShell>
  );
}
