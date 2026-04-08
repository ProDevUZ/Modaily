import { AdminShell } from "@/components/admin/admin-shell";
import { ProductManager } from "@/components/admin/product-manager";

export default function AdminProductsPage() {
  return (
    <AdminShell
      current="products"
      title="Товары"
      description="Управление SKU, slug, категориями, ценой, остатком и контентом UZ/RU/EN в едином разделе."
    >
      <ProductManager />
    </AdminShell>
  );
}
