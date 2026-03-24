import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryManager } from "@/components/admin/category-manager";

export default function AdminCategoriesPage() {
  return (
    <AdminShell
      current="categories"
      title="Category CRUD"
      description="Kategoriya bo‘limi katalog strukturasi uchun alohida boshqaruv moduli. Har bir category uch tilda saqlanadi va product relation bilan ishlaydi."
    >
      <CategoryManager />
    </AdminShell>
  );
}
