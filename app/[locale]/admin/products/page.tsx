import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminProductsPage({ params }: PageProps) {
  await params;
  redirect("/admin/products");
}
