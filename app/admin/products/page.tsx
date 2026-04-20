import { AdminShell } from "@/components/admin/admin-shell";
import { ProductListManager } from "@/components/admin/product-manager";

export default function AdminProductsPage() {
  return (
    <AdminShell
      current="products"
      title="Товары"
      description=""
      searchable={false}
      headerVariant="compact"
      headerAccessory={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9] text-sm font-semibold text-slate-500">
          A
        </span>
      }
      mainClassName="p-0"
      contentClassName=""
    >
      <ProductListManager />
    </AdminShell>
  );
}
