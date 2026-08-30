import type { ReactNode } from "react";
import { Footer, Header, LocaleProvider } from "@freight/ui";
import { getLocale } from "@/lib/locale/server";

/**
 * Shared chrome for both root layouts in the tree.
 *
 * `(intl)/[locale]` and `(tier2)/countries` are independent root layouts —
 * each owns its own `<html>/<body>` so that `<html lang>` can differ between
 * them — but both need identical Header/Footer/site chrome. This is that
 * shared piece, so the nav shell stays a single edit instead of two.
 */
export async function AppShell({ children }: { children: ReactNode }) {
  // Seeds packages/ui's own `LocaleProvider` (see Header, which reads it via
  // `useLocale()` to normalize `usePathname()` for its contextual-CTA
  // lookup) — not apps/web/lib/locale/context.tsx's provider, which is a
  // separate mechanism for this app's own client islands. packages/ui can't
  // depend on apps/web's locale config, so it owns a plain-string version
  // of this same seeding, fed from here. Falls back to `DEFAULT_LOCALE`
  // outside a locale-scoped tree (see `getLocale()`'s own doc comment),
  // which is the right answer for the `(tier2)/countries` layout that also
  // renders this component.
  const locale = await getLocale();

  return (
    <LocaleProvider locale={locale}>
      {/*
        This is only ever the site-wide fallback. A page's own contextual
        CTA (e.g. Sea Freight's "Get a quote for sea freight") is resolved
        by Header itself from the route and SERVICES/INDUSTRIES' `ctaLabel`
        (see resolveContextualCta in packages/ui/src/nav-data.ts) — a page
        never passes anything here to get its own CTA shown.
      */}
      <Header primaryAction={{ label: "Start a quote", href: "/get-a-quote" }} />
      <main className="flex-1">{children}</main>
      <Footer />
    </LocaleProvider>
  );
}
