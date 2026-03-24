import { AdminPlaceholderPage } from "@/components/admin/admin-placeholder-page";

export default function AdminAnalyticsPage() {
  return (
    <AdminPlaceholderPage
      current="analytics"
      title="Analytics"
      description="Analytics moduli uchun struktura tayyor. Figma UI va real metric manbalari keyingi bosqichda shu yerga tushadi."
      points={[
        "Revenue, conversion, and product performance widgets",
        "Date filtering and comparison controls",
        "Traffic and campaign attribution blocks"
      ]}
    />
  );
}
