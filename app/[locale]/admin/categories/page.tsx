import { AdminShell } from "@/components/admin/admin-shell";
import { CategoryManager } from "@/components/admin/category-manager";
import { isLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminCategoriesPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  return (
    <AdminShell
      locale={locale}
      current="categories"
      title="Category CRUD"
      description="Kategoriyalar uch tilda saqlanadi. Product relation borligi uchun ichida mahsulotlar bo‘lgan category delete qilinmaydi."
    >
      <CategoryManager />
    </AdminShell>
  );
}
