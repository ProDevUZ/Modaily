import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const count = await prisma.productReview.count({
    where: {
      adminSeenAt: null
    }
  });

  return NextResponse.json({ count });
}
