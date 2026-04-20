import { AdminShell } from "@/components/admin/admin-shell";
import { UserEditor } from "@/components/admin/user-manager";

export default function AdminUsersCreatePage() {
  return (
    <AdminShell
      current="users"
      searchable={false}
      hideHeader
      title="Создание пользователя"
      description="Новая пользовательская запись в полноэкранной форме."
      mainClassName="p-0"
      contentClassName=""
    >
      <UserEditor />
    </AdminShell>
  );
}
