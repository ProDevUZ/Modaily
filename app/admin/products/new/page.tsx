import { AdminShell } from "@/components/admin/admin-shell";
import { ProductEditor } from "@/components/admin/product-manager";

export default function AdminProductsCreatePage() {
  return (
    <AdminShell
      current="products"
      searchable={false}
      title="Создание товара"
      description="Новая карточка товара в полноэкранной форме без списка и лишних блоков."
      hideHeader
      mainClassName="p-0"
      contentClassName=""
    >
      <ProductEditor />
    </AdminShell>
  );
}
