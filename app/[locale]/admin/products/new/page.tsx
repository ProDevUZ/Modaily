import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedAdminProductsCreatePage({ params }: PageProps) {
  await params;
  redirect("/admin123/products/new");
}
