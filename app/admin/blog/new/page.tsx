import { AdminShell } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";

export default function AdminBlogCreatePage() {
  return (
    <AdminShell
      current="blog"
      searchable={false}
      title="Создание поста"
      description="Новая публикация в полноэкранной форме без списка и лишних блоков."
      hideHeader
      mainClassName="p-0"
      contentClassName=""
    >
      <BlogEditor />
    </AdminShell>
  );
}
