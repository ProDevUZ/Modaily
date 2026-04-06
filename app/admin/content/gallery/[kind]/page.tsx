import { notFound } from "next/navigation";

import { ContentManager } from "@/components/admin/content-manager";
import { GalleryModeTabs } from "@/components/admin/gallery-mode-tabs";

export default async function AdminGalleryKindPage({
  params
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;

  if (kind !== "image" && kind !== "video") {
    notFound();
  }

  return (
    <div className="space-y-6">
      <GalleryModeTabs />
      <ContentManager section="gallery" galleryMode={kind} />
    </div>
  );
}
