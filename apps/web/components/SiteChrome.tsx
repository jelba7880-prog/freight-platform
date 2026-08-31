"use client";

import type { ReactNode } from "react";
import { Footer, Header } from "@freight/ui";
import { localePath, type Locale } from "@/lib/locale/config";

/**
 * Client-side half of `AppShell`, split out only because `resolveHref` is a
 * function: a Server Component can't pass a function prop across into a
 * Client Component (Header/Footer are both `"use client"`), so `locale`
 * (a plain, serializable string) crosses that boundary instead, and
 * `resolveHref` is built here, entirely on the client side of it.
 */
export function SiteChrome({ locale, children }: { locale: Locale; children: ReactNode }) {
  const resolveHref = (href: string) => localePath(locale, href);

  return (
    <>
      {/*
        primaryAction is left unset so Header falls back to its own default
        param, DEFAULT_PRIMARY_ACTION. A page's own contextual CTA (e.g. Sea
        Freight's "Talk to a Sea Freight specialist") is resolved by Header
        itself from the route and SERVICES/INDUSTRIES' `ctaLabel` (see
        resolveContextualCta in packages/ui/src/nav-data.ts) — a page never
        passes anything here to get its own CTA shown.
      */}
      <Header locale={locale} resolveHref={resolveHref} />
      <main className="flex-1">{children}</main>
      <Footer resolveHref={resolveHref} />
    </>
  );
}
