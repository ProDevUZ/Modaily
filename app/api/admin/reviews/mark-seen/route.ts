import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH() {
  const result = await prisma.productReview.updateMany({
    where: {
      adminSeenAt: null
    },
    data: {
      adminSeenAt: new Date()
    }
  });

  return NextResponse.json({ success: true, count: result.count });
}
