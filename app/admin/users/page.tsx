import { AdminShell } from "@/components/admin/admin-shell";
import { UserListManager } from "@/components/admin/user-manager";

export default function AdminUsersPage() {
  return (
    <AdminShell
      current="users"
      searchable
      hideHeader
      mainClassName="p-0"
      contentClassName=""
      title="Пользователи"
      description="Список пользователей и клиентских записей."
    >
      <UserListManager />
    </AdminShell>
  );
}
