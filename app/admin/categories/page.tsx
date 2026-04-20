import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryListManager } from "@/components/admin/category-manager";

export default function AdminCategoriesPage() {
  return (
    <AdminShell
      current="categories"
      hideHeader
      mainClassName="p-0"
      contentClassName=""
      title="Категории"
      description="Управление структурой каталога. Каждая категория хранится на трех языках и связана с товарами."
    >
      <CategoryListManager />
    </AdminShell>
  );
}
