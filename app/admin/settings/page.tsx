import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsManager } from "@/components/admin/settings-manager";

export default function AdminSettingsPage() {
  return (
    <AdminShell
      current="settings"
      title="Настройки"
      description="Только глобальный режим скрытия цен и оформления заказа для всей витрины."
    >
      <SettingsManager />
    </AdminShell>
  );
}
