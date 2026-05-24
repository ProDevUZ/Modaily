import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/admin123",
          "/admin123/",
          "/*/admin",
          "/*/admin/",
          "/cart",
          "/cart/",
          "/*/cart",
          "/*/cart/",
          "/login",
          "/login/",
          "/*/login",
          "/*/login/",
          "/profile",
          "/profile/",
          "/*/profile",
          "/*/profile/",
          "/api",
          "/api/",
          "/*/catalog/*/store"
        ]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
