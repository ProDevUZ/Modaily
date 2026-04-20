import { AdminShell } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminBlogEditPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell
      current="blog"
      searchable={false}
      title="Редактирование поста"
      description="Отдельная рабочая зона для редактирования статьи."
      hideHeader
      mainClassName="p-0"
      contentClassName=""
    >
      <BlogEditor postId={id} />
    </AdminShell>
  );
}
