import { AdminShell } from "@/components/admin/admin-shell";
import { UserManager } from "@/components/admin/user-manager";

export default function AdminUsersPage() {
  return (
    <AdminShell
      current="users"
      title="User CRUD"
      description="Customer va lead yozuvlarini shu alohida dashboard ichida boshqarasiz. Create, update va delete amallari API orqali bazaga tushadi."
    >
      <UserManager />
    </AdminShell>
  );
}
