import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsManager } from "@/components/admin/settings-manager";

export default function AdminSettingsPage() {
  return (
    <AdminShell
      current="settings"
      title="Настройки"
      description="Глобальные параметры видимости цен и оформления заказа на витрине."
    >
      <SettingsManager />
    </AdminShell>
  );
}
