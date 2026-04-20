import { NextResponse } from "next/server";

import { MAX_GALLERY_VIDEO_SIZE, saveGalleryVideo } from "@/lib/gallery-video-storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Video file is required." }, { status: 400 });
    }

    const uploaded = await saveGalleryVideo(file);

    return NextResponse.json(
      {
        url: uploaded.url,
        filename: uploaded.filename,
        sizeLimit: MAX_GALLERY_VIDEO_SIZE
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Video upload failed."
      },
      { status: 400 }
    );
  }
}
