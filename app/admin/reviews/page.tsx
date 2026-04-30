import { AdminShell } from "@/components/admin/admin-shell";
import { ReviewListManager } from "@/components/admin/review-manager";

export default function AdminReviewsPage() {
  return (
    <AdminShell
      current="reviews"
      title="Отзывы"
      description=""
      searchable={false}
      headerVariant="compact"
      headerAccessory={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f5f9] text-sm font-semibold text-slate-500">
          A
        </span>
      }
      mainClassName="p-0"
      contentClassName=""
    >
      <ReviewListManager />
    </AdminShell>
  );
}
