import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedAdminCategoriesCreatePage({ params }: PageProps) {
  await params;
  redirect("/admin123/categories/new");
}
