import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateSkinTypeOptionPayload } from "@/lib/admin-validators";
import { getSkinTypeOptions } from "@/lib/skin-type-options";

export async function GET() {
  const options = await getSkinTypeOptions();
  return NextResponse.json(options);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateSkinTypeOptionPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const created = await prisma.skinTypeOption.create({
      data: parsed.data
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Skin type could not be created." }, { status: 400 });
  }
}
