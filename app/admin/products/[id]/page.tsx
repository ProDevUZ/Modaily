import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-manager";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProductEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell
      current="products"
      searchable={false}
      title="Редактирование товара"
      description="Отдельная рабочая зона для редактирования карточки товара."
      hideHeader
      mainClassName="p-0"
      contentClassName=""
    >
      <ProductEditor productId={id} />
    </AdminShell>
  );
}
