import { cache } from "react";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/**
 * Request-scoped holder for the resolved locale.
 *
 * `cache()` gives one object per server render pass (per request when
 * rendering dynamically, per page when prerendering), so this is a safe
 * place to hand the locale down without threading `params` through every
 * component. `app/[locale]/layout.tsx` writes it before its children render;
 * anything below reads it with `getLocale()`.
 */
const localeStore = cache((): { current: Locale } => ({ current: DEFAULT_LOCALE }));

/**
 * Record the locale for the current render. Called by the layout that owns
 * the `[locale]` segment — pages and components should not call it.
 */
export function setLocale(locale: Locale): void {
  localeStore().current = locale;
}

/**
 * The locale for the current render, for use in any server component.
 *
 * Falls back to the global default outside a locale-scoped tree, which is
 * the correct answer for Tier 2 (`/countries/{slug}`): those pages inherit
 * global content by design.
 *
 * Today this only identifies the market. It exists now so Tier 1
 * differentiation (local contact details, local quotation rules, regional
 * service availability) has a seam to hook into later. Translation strings
 * and the language switcher are Phase 6 and deliberately absent.
 */
export function getLocale(): Locale {
  return localeStore().current;
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
