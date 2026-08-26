import type { ReactNode } from "react";
import { LOCALES } from "@/lib/locale/config";
import { LocaleProvider } from "@/lib/locale/context";
import { resolveLocaleParam, setLocale } from "@/lib/locale/server";

/**
 * Owner of the `[locale]` segment: every Phase 1+ marketing page is built
 * under this layout, so the resolved market is available to the whole tree.
 *
 * Deliberately not here yet: translated strings, a language switcher, or any
 * per-locale content branching. Those are Phase 6 — this is the seam they
 * will hang off, nothing more.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocaleParam((await params).locale);

  // Runs before `children` render, which is what lets any server component
  // below call `getLocale()` without `params` being threaded down to it.
  setLocale(locale);

  return (
    <LocaleProvider locale={locale}>
      {/*
        `display: contents` — this wrapper adds no box and no styling, so the
        rendered layout is byte-for-byte what it was before the locale
        segment existed. It carries the resolved locale into the DOM, which
        makes the routing observable to tests and to the browser inspector
        without any page having to render locale-specific markup.
      */}
      <div data-locale={locale} className="contents">
        {children}
      </div>
    </LocaleProvider>
  );
}

/**
 * Prerender the default plus each Tier 1 market. `dynamicParams = false`
 * makes an unrecognised code a 404 rather than a silently-rendered market
 * that nobody has content for — `proxy.ts` already routes unknown
 * segments through the default locale, so nothing legitimate lands here.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;
