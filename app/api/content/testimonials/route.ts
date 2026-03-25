import { NextResponse } from "next/server";

import { validateTestimonialPayload } from "@/lib/admin-validators";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });

  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateTestimonialPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: parsed.data
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Testimonial could not be created." }, { status: 400 });
  }
}
