import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateContactMessagePayload } from "@/lib/admin-validators";

export async function GET() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateContactMessagePayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const message = await prisma.contactMessage.create({
      data: parsed.data
    });

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Message could not be created." }, { status: 400 });
  }
}
