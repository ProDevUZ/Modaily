import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminContentRedirectPage({ params }: PageProps) {
  await params;
  redirect("/admin/content");
}
