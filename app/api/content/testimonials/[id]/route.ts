import { NextResponse } from "next/server";

import { validateTestimonialPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteProps) {
  const { id } = await params;
  const body = await request.json();
  const parsed = validateTestimonialPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json(testimonial);
  } catch {
    return NextResponse.json({ error: "Testimonial could not be updated." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteProps) {
  const { id } = await params;

  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Testimonial could not be deleted." }, { status: 400 });
  }
}
