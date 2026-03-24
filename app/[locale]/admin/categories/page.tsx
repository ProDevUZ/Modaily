import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminCategoriesPage({ params }: PageProps) {
  await params;
  redirect("/admin/categories");
}
