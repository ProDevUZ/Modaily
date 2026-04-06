import { NextResponse } from "next/server";

import { MAX_PROMO_IMAGE_SIZE, savePromoImage } from "@/lib/promo-image-storage";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  try {
    const uploaded = await savePromoImage(file);

    return NextResponse.json(
      {
        url: uploaded.url,
        filename: uploaded.filename,
        sizeLimit: MAX_PROMO_IMAGE_SIZE
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Promo image upload failed."
      },
      { status: 400 }
    );
  }
}
