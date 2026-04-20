import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function LocalizedAdminProductEditPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/admin123/products/${id}`);
}
