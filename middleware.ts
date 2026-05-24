import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "@/lib/i18n";
import { DEFAULT_LOCALE, SEO_LOCALE_HEADER } from "@/lib/seo";

function requestHeadersWithLocale(request: NextRequest, locale: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(SEO_LOCALE_HEADER, locale);

  return requestHeaders;
}

function nextWithLocale(request: NextRequest, locale: string) {
  return NextResponse.next({
    request: {
      headers: requestHeadersWithLocale(request, locale)
    }
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localizedAdminSecretMatch = pathname.match(new RegExp(`^/(${locales.join("|")})/admin123(?:(/.*)|$)`));
  const localizedAdminMatch = pathname.match(new RegExp(`^/(${locales.join("|")})/admin(?:(/.*)|$)`));

  if (localizedAdminSecretMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/admin123${localizedAdminSecretMatch[2] || ""}`;
    return NextResponse.redirect(url);
  }

  if (localizedAdminMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/${localizedAdminMatch[1]}`;
    return NextResponse.redirect(url);
  }

  if (pathname === "/admin123" || pathname.startsWith("/admin123/")) {
    const url = request.nextUrl.clone();
    const requestHeaders = requestHeadersWithLocale(request, DEFAULT_LOCALE);
    requestHeaders.set("x-admin-secret-rewrite", "1");

    url.pathname = `/admin${pathname.slice("/admin123".length)}`;
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders
      }
    });
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (request.headers.get("x-admin-secret-rewrite") === "1") {
      return nextWithLocale(request, DEFAULT_LOCALE);
    }

    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (hasLocale) {
    const locale = locales.find((entry) => pathname === `/${entry}` || pathname.startsWith(`/${entry}/`));
    return nextWithLocale(request, locale || DEFAULT_LOCALE);
  }

  const url = request.nextUrl.clone();
  url.pathname = `${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
