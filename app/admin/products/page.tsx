import { AdminShell } from "@/components/admin/admin-shell";
import { ProductManager } from "@/components/admin/product-manager";

export default function AdminProductsPage() {
  return (
    <AdminShell
      current="products"
      title="Product CRUD"
      description="Mahsulot moduli SKU, slug, category, narx, stock va UZ/RU/EN kontentni bitta dashboard orqali boshqaradi."
    >
      <ProductManager />
    </AdminShell>
  );
}
