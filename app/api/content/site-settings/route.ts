import { NextResponse } from "next/server";

import { validateSiteSettingsPayload } from "@/lib/admin-validators";
import { defaultSiteSettings } from "@/lib/content-defaults";
import { prisma } from "@/lib/prisma";

async function getSiteSettings() {
  const existing = await prisma.siteSettings.findFirst({
    orderBy: { createdAt: "asc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.siteSettings.create({
    data: defaultSiteSettings
  });
}

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("site settings fallback", error);
    return NextResponse.json(defaultSiteSettings);
  }
}

export async function PATCH(request: Request) {
  const current = await getSiteSettings();
  const body = await request.json();
  const parsed = validateSiteSettingsPayload(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const updated = await prisma.siteSettings.update({
    where: { id: current.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}
