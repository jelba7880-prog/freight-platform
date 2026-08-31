import type { ReactNode } from "react";
import { Footer, Header } from "@freight/ui";
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
  // Passed straight into Header's `locale` prop below (a plain prop, not
  // context: AppShell renders Header directly, and no other packages/ui
  // component currently needs this value — see Header's own doc comment on
  // that prop). Falls back to `DEFAULT_LOCALE` outside a locale-scoped tree
  // (see `getLocale()`'s own doc comment), which is the right answer for
  // the `(tier2)/countries` layout that also renders this component.
  const locale = await getLocale();

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
      <Header locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
