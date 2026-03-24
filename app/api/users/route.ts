import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateUserPayload } from "@/lib/admin-validators";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateUserPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: parsed.data
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "User could not be created." }, { status: 400 });
  }
}
