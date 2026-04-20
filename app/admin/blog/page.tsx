import { AdminShell } from "@/components/admin/admin-shell";
import { BlogListManager } from "@/components/admin/blog-manager";

export default function AdminBlogPage() {
  return (
    <AdminShell
      current="blog"
      title="Блог"
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
      <BlogListManager />
    </AdminShell>
  );
}
