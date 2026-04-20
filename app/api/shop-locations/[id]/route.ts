import { NextResponse } from "next/server";

import { validateShopLocationPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";
import { serializeShopLocation } from "@/lib/shop-locations";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { id } = await params;

  const location = await prisma.shopLocation.findUnique({
    where: { id },
    include: {
      workingHours: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    }
  });

  if (!location) {
    return NextResponse.json({ error: "Shop location not found." }, { status: 404 });
  }

  return NextResponse.json(serializeShopLocation(location));
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateShopLocationPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const location = await prisma.shopLocation.update({
      where: { id },
      data: {
        address: parsed.data.address,
        mapLink: parsed.data.mapLink,
        active: parsed.data.active,
        sortOrder: parsed.data.sortOrder,
        workingHours: {
          deleteMany: {},
          create: parsed.data.workingHours
        }
      },
      include: {
        workingHours: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
        }
      }
    });

    return NextResponse.json(serializeShopLocation(location));
  } catch {
    return NextResponse.json({ error: "Shop location could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    await prisma.shopLocation.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Shop location could not be deleted." }, { status: 400 });
  }
}
