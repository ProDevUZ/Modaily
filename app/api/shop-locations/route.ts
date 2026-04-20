import { NextResponse } from "next/server";

import { validateShopLocationPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";
import { serializeShopLocation } from "@/lib/shop-locations";

export async function GET() {
  const locations = await prisma.shopLocation.findMany({
    include: {
      workingHours: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
      }
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  return NextResponse.json(locations.map(serializeShopLocation));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateShopLocationPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const location = await prisma.shopLocation.create({
      data: {
        address: parsed.data.address,
        mapLink: parsed.data.mapLink,
        active: parsed.data.active,
        sortOrder: parsed.data.sortOrder,
        workingHours: {
          create: parsed.data.workingHours
        }
      },
      include: {
        workingHours: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
        }
      }
    });

    return NextResponse.json(serializeShopLocation(location), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Shop location could not be created." }, { status: 400 });
  }
}
