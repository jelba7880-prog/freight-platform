import { locale as rootLocaleParam } from "next/root-params";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/**
 * The locale for the current render, for use in any server component.
 *
 * Reads the `[locale]` root segment straight from the framework via
 * `next/root-params`, which Next populates from the matched route before any
 * component in the tree renders. That ordering is the whole point: this
 * previously used a `cache()`-backed store that the locale layout wrote with
 * a `setLocale()` call and nested components read back, and the read
 * reliably beat the write.
 *
 * The store itself was scoped correctly — every render pass and every
 * request got its own object, and the layout's write did land in it — but
 * Next renders the page segment before the parent layout's body has run, so
 * a page calling `getLocale()` always observed the initializer's
 * `DEFAULT_LOCALE` rather than the layout's value. It failed identically for
 * live per-request rendering, not just at build time: `/de` served the
 * global default. (It was never a cross-request leak — no request ever saw
 * another request's locale, only the default.) Nothing user-land writes here
 * any more, so there is no write to lose a race against.
 *
 * Falls back to the global default outside a locale-scoped tree, which is the
 * correct answer for Tier 2 (`/countries/{slug}`): that route group has no
 * `[locale]` root param at all, so `rootLocaleParam()` resolves to
 * `undefined` there and those pages inherit global content by design.
 *
 * Today this only identifies the market. It exists so Tier 1 differentiation
 * (local contact details, local quotation rules, regional service
 * availability) has a seam to hook into later. Translation strings and the
 * language switcher are Phase 6 and deliberately absent.
 *
 * Server components only. Client islands read the locale via `useLocale()`
 * from ./context, which the locale layout still feeds from its own `params`.
 */
export async function getLocale(): Promise<Locale> {
  return resolveLocaleParam(await rootLocaleParam());
}

/**
 * Narrow a raw `[locale]` route param to a `Locale`.
 *
 * `proxy.ts` already guarantees the segment is a known locale for any
 * request that reaches a page, so an unknown value here means the route was
 * rendered outside the proxy (a direct `generateStaticParams` mistake,
 * say). Falling back to the default keeps that from becoming a 500.
 */
export function resolveLocaleParam(value: string | undefined): Locale {
  return value !== undefined && isLocale(value) ? value : DEFAULT_LOCALE;
}
