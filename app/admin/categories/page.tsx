import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryManager } from "@/components/admin/category-manager";

export default function AdminCategoriesPage() {
  return (
    <AdminShell
      current="categories"
      title="Категории"
      description="Управление структурой каталога. Каждая категория хранится на трех языках и связана с товарами."
    >
      <CategoryManager />
    </AdminShell>
  );
}
