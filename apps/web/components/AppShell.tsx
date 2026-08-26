import type { ReactNode } from "react";
import { Footer, Header } from "@freight/ui";

/**
 * Shared chrome for both root layouts in the tree.
 *
 * `(intl)/[locale]` and `(tier2)/countries` are independent root layouts —
 * each owns its own `<html>/<body>` so that `<html lang>` can differ between
 * them — but both need identical Header/Footer/site chrome. This is that
 * shared piece, so the nav shell stays a single edit instead of two.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      {/*
        Real per-page contextual CTAs (a Sea Freight page passing its own
        primaryAction, etc.) need routes to actually exist first — out of
        scope here. This wires the mechanism with a homepage-flavored CTA;
        other pages fall back to Header's own DEFAULT_PRIMARY_ACTION until
        they're built and can pass their own.
      */}
      <Header primaryAction={{ label: "Start a quote", href: "/get-a-quote" }} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
