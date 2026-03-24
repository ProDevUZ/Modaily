import { AdminShell } from "@/components/admin/admin-shell";
import { ProductManager } from "@/components/admin/product-manager";
import { isLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProductsPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  return (
    <AdminShell
      locale={locale}
      current="products"
      title="Product CRUD"
      description="Mahsulotlar SKU, slug, category, price, stock va UZ/RU/EN kontent bilan boshqariladi. Shu qatlam keyingi checkout va order modullari uchun tayyor backend bo‘ladi."
    >
      <ProductManager />
    </AdminShell>
  );
}
