import { getLocale } from "@/lib/locale/server";

/**
 * Tier 2 placeholder — secondary markets.
 *
 * Sits outside `app/[locale]` on purpose. A Tier 2 page is a lightweight
 * landing page: local contact info and office list over content otherwise
 * inherited from the global default. It is not a localized subsite, so it
 * has no locale segment of its own, and `getLocale()` correctly reports the
 * global default here — the inheritance is the content model, not a gap.
 *
 * Real Tier 2 content is a later phase; this exists so the route separation
 * is established (and exercised by `proxy.ts`) before pages depend on it.
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div data-tier="2" data-locale={getLocale()} data-country-slug={slug} />;
}
