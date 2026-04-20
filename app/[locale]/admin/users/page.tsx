import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminUsersPage({ params }: PageProps) {
  await params;
  redirect("/admin123/users");
}
