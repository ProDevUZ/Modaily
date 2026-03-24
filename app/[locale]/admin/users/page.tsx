import { AdminShell } from "@/components/admin/admin-shell";
import { UserManager } from "@/components/admin/user-manager";
import { isLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminUsersPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  return (
    <AdminShell
      locale={locale}
      current="users"
      title="User CRUD"
      description="User yozuvlarini yaratish, tahrirlash va o‘chirish. Hozir bu authsiz admin data panel sifatida ishlaydi."
    >
      <UserManager />
    </AdminShell>
  );
}
