import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  isNonLocalizedSegment,
  isTier1Locale,
} from "@/lib/locale/config";

/**
 * Resolves the `[locale]` segment for every marketing-site request.
 *
 * This is Next.js 16's `proxy.ts` — the renamed `middleware.ts` convention;
 * same request-interception hook, same Edge runtime.
 *
 * Three outcomes, one per branch of the tier model:
 *
 *   /us/services/sea-freight   Tier 1 code → passes through untouched; the
 *                              segment is already the locale.
 *   /countries/bulgaria        Tier 2 → passes through; lives outside the
 *                              `[locale]` tree entirely.
 *   /services/sea-freight      no country code → rewritten internally to
 *                              /global/services/sea-freight. The visitor's
 *                              URL does not change, so every existing and
 *                              planned unprefixed path resolves exactly as
 *                              it did before the locale segment existed.
 *
 * A rewrite (not a redirect) is what makes the default locale unprefixed:
 * the `[locale]` param is populated server-side while the canonical public
 * URL stays country-code-free.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  // The internal default prefix must not become a second, duplicate URL for
  // the same content. Send it back to the canonical unprefixed path.
  if (firstSegment === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url);
  }

  if (isTier1Locale(firstSegment) || isNonLocalizedSegment(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /*
   * Everything except Next internals, the metadata files Next serves from
   * the app root, and anything with a file extension (static assets) — none
   * of those have a locale dimension.
   */
  matcher: ["/((?!_next/|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$|.*\\.[^/]+$).*)"],
};
