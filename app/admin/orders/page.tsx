import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";

export default function AdminOrdersPage() {
  return (
    <AdminPlaceholderPage
      current="orders"
      title="Orders"
      description="Orders moduli uchun strukturaviy sahifa. Keyingi bosqichda checkout, payment status va fulfillment boshqaruvi shu yerga ulanadi."
      points={[
        "Order table with status, customer, payment, and delivery columns",
        "Order detail drawer or page with product items and notes",
        "Status workflow: new, paid, packed, shipped, completed"
      ]}
    />
  );
}
