import { AdminShell } from "@/components/admin/admin-shell";
import { UserEditor } from "@/components/admin/user-manager";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell
      current="users"
      searchable={false}
      hideHeader
      title="Редактирование пользователя"
      description="Отдельная рабочая зона для редактирования пользователя."
      mainClassName="p-0"
      contentClassName=""
    >
      <UserEditor userId={id} />
    </AdminShell>
  );
}
