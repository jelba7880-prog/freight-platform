import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@freight/ui/fonts";
import { AppShell } from "@/components/AppShell";
import { LOCALES } from "@/lib/locale/config";
import { LocaleProvider } from "@/lib/locale/context";
import { resolveLocaleParam, setLocale } from "@/lib/locale/server";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Freight Platform",
  description: "Public marketing site.",
};

/**
 * Root layout for the `(intl)` route group: Tier 1 markets plus the
 * unprefixed global default. Independent from `(tier2)/countries`'s root
 * layout — that split is what lets this one set `<html lang>` per market
 * without touching Tier 2, which has no language dimension at all.
 *
 * Every Phase 1+ marketing page is built under this layout, so the resolved
 * market is available to the whole tree. Deliberately not here yet:
 * translated strings, a language switcher, or any per-locale content
 * branching. Those are Phase 6 — this is the seam they will hang off,
 * nothing more.
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
    <html lang={locale} data-mode="light" className={fontVariables}>
      <body className="flex min-h-screen flex-col">
        <LocaleProvider locale={locale}>
          <AppShell>
            {/*
              `display: contents` — this wrapper adds no box and no styling,
              so the rendered layout is byte-for-byte what it was before the
              locale segment existed. It carries the resolved locale into the
              DOM, which makes the routing observable to tests and to the
              browser inspector without any page having to render
              locale-specific markup. Kept inside `<main>` (not around
              `AppShell`) so it wraps exactly the same content it did before
              the route-group split — Header/Footer never carried it.
            */}
            <div data-locale={locale} className="contents">
              {children}
            </div>
          </AppShell>
        </LocaleProvider>
      </body>
    </html>
  );
}

/**
 * Prerender the default plus each Tier 1 market. `dynamicParams = false`
 * makes an unrecognised code a 404 rather than a silently-rendered market
 * that nobody has content for — `proxy.ts` already routes unknown segments
 * through the default locale, so nothing legitimate lands here.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;
