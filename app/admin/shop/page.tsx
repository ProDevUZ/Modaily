import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";

export default function AdminShopPage() {
  return (
    <AdminPlaceholderPage
      current="shop"
      title="Shop"
      description="Shop moduli storefront boshqaruvi uchun ajratilgan. Featured sections, banners va merchandising shu bo‘limga yig‘iladi."
      points={[
        "Homepage sections and featured product slots",
        "Hero banners and seasonal campaign controls",
        "Collections and curated landing pages"
      ]}
    />
  );
}
