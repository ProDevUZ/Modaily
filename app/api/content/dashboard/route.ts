import { NextResponse } from "next/server";

import { defaultHomeAbout, defaultHomeHero, defaultSiteSettings } from "@/lib/content-defaults";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [siteSettings, hero, about, promoCards, galleryItems, testimonials] = await Promise.all([
    prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.homeHero.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.homeAboutSection.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.homePromoCard.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.galleryItem.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
  ]);

  return NextResponse.json({
    siteSettings: siteSettings ?? defaultSiteSettings,
    hero: hero ?? defaultHomeHero,
    about: about ?? defaultHomeAbout,
    promoCards,
    galleryItems,
    testimonials
  });
}
