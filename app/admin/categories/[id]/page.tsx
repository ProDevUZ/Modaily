import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryEditor } from "@/components/admin/category-manager";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminCategoryEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell
      current="categories"
      searchable={false}
      hideHeader
      title="Редактирование категории"
      description="Отдельная рабочая зона для редактирования категории."
      mainClassName="p-0"
      contentClassName=""
    >
      <CategoryEditor categoryId={id} />
    </AdminShell>
  );
}
