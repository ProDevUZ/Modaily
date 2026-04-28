import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedAdminSkinTypesCreatePage({ params }: PageProps) {
  await params;
  redirect("/admin123/skin-types/new");
}
