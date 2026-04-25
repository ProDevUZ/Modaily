import { NextResponse } from "next/server";

import { blogPostLinkedProductSelect, serializeBlogPost } from "@/lib/blog-posts";
import { defaultHomeAbout, defaultHomeHero, defaultSiteSettings } from "@/lib/content-defaults";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [siteSettings, hero, about, promoCards, galleryItems, testimonials, blogPosts] = await Promise.all([
      prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" } }),
      prisma.homeHero.findFirst({ orderBy: { createdAt: "asc" } }),
      prisma.homeAboutSection.findFirst({ orderBy: { createdAt: "asc" } }),
      prisma.homePromoCard.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.galleryItem.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.blogPost.findMany({
        include: {
          linkedProduct: {
            select: blogPostLinkedProductSelect
          },
          media: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
          },
          dynamicSections: {
            orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
          }
        },
        orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }]
      })
    ]);

    return NextResponse.json({
      siteSettings: siteSettings ?? defaultSiteSettings,
      hero: hero ?? defaultHomeHero,
      about: about ?? defaultHomeAbout,
      promoCards,
      galleryItems,
      testimonials,
      blogPosts: blogPosts.map((post) => serializeBlogPost(post))
    });
  } catch (error) {
    console.error("content dashboard fallback", error);

    return NextResponse.json({
      siteSettings: defaultSiteSettings,
      hero: defaultHomeHero,
      about: defaultHomeAbout,
      promoCards: [],
      galleryItems: [],
      testimonials: [],
      blogPosts: [],
      degraded: true
    });
  }
}
