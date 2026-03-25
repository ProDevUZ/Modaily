import { ContentManager } from "@/components/admin/content-manager";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminContentPage() {
  return (
    <AdminShell
      current="content"
      title="Content CMS"
      description="Home page’dagi editorial bloklar, media gallery, testimonials va global storefront content shu bo‘limda boshqariladi."
    >
      <ContentManager />
    </AdminShell>
  );
}
