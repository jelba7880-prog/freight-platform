/**
 * Three-tier locale/routing convention for the public marketing site.
 * See "Multi-Region & Internationalisation" in /Project Overview.md.
 *
 *   Tier 1 — major markets, fully localized subsite.  /{countryCode}/...
 *   Tier 2 — secondary markets, lightweight landing page inheriting global
 *            content.                                  /countries/{slug}
 *   Tier 3 — long-tail, no dedicated page, filter only on the global
 *            Locations directory.
 *
 * Only Tier 1 lives inside the routed `app/[locale]` tree. Tier 2 is a
 * deliberately separate top-level route: those pages are global content with
 * local contact details bolted on, not localized subsites, and folding them
 * into the same param space would conflate two different content models.
 *
 * This module is the single source of truth shared by proxy.ts (Edge
 * runtime) and the app — keep it free of React and Node-only imports.
 */

/**
 * The global fallback. It is never visible in a URL: `/services/sea-freight`
 * is rewritten internally to `/global/services/sea-freight`, so the
 * unprefixed path stays the canonical one and the default market pays no
 * URL-shape cost for the locale segment existing.
 */
export const DEFAULT_LOCALE = "global";

/**
 * Placeholder Tier 1 markets. These exist purely to prove the routing
 * mechanism resolves a country code into locale context — there is no
 * localized content behind them yet, and no market has been committed to.
 * Real Tier 1 rollout (and the `/{countryCode}/{lang}` multilingual split
 * for markets like Belgium) is Phase 6.
 */
export const TIER1_LOCALES = ["us", "de"] as const;

export type Tier1Locale = (typeof TIER1_LOCALES)[number];
export type DefaultLocale = typeof DEFAULT_LOCALE;
export type Locale = DefaultLocale | Tier1Locale;

/** Every value the `[locale]` route segment can legitimately hold. */
export const LOCALES: readonly Locale[] = [DEFAULT_LOCALE, ...TIER1_LOCALES];

/**
 * Top-level path segments that sit *outside* the `[locale]` tree and must
 * not be rewritten under the default locale prefix.
 *
 * `countries` is Tier 2. Anything added here is a deliberate statement that
 * a route has no locale dimension at all — the default is that new routes
 * live under `app/[locale]`.
 */
export const NON_LOCALIZED_SEGMENTS = ["countries"] as const;

export function isTier1Locale(value: string): value is Tier1Locale {
  return (TIER1_LOCALES as readonly string[]).includes(value);
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function isNonLocalizedSegment(value: string): boolean {
  return (NON_LOCALIZED_SEGMENTS as readonly string[]).includes(value);
}

/**
 * Build a public href for a path within a locale. The default locale is
 * unprefixed, so `localePath("global", "/services/sea-freight")` gives back
 * exactly the path Phase 1 pages already link to today.
 *
 * Use this rather than hand-concatenating a prefix, so that the day a Tier 1
 * market ships, internal links follow the visitor's locale automatically.
 */
export function localePath(locale: Locale, path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}
