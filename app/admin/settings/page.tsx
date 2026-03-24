import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholderPage
      current="settings"
      title="Settings"
      description="Settings sahifasi shop konfiguratsiyasi, locale, metadata va admin parametrlari uchun ajratildi."
      points={[
        "Store identity, email, phone, and support content",
        "Locale and SEO defaults configuration",
        "Payment and delivery provider settings"
      ]}
    />
  );
}
