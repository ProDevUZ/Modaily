import { notFound, redirect } from "next/navigation";

import { ContentManager } from "@/components/admin/content-manager";
import { isAdminContentSectionKey } from "@/lib/admin-content-navigation";

export default async function AdminContentSectionPage({
  params
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (section === "settings") {
    redirect("/admin123/settings");
  }

  if (!isAdminContentSectionKey(section)) {
    notFound();
  }

  return <ContentManager section={section} />;
}
