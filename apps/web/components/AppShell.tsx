import type { ReactNode } from "react";
import { Footer, Header, PageActionProvider } from "@freight/ui";

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
    // Wraps Header and the routed page together so a page anywhere in
    // `children` can register its own contextual CTA (via `usePageAction`/
    // `<PageAction>`) that Header — its sibling, not its parent — picks up.
    // Without this provider, `primaryAction` below is the only CTA there
    // could ever be: a page has no direct way to pass a prop to a
    // component that a shared layout renders above it.
    <PageActionProvider>
      <Header primaryAction={{ label: "Start a quote", href: "/get-a-quote" }} />
      <main className="flex-1">{children}</main>
      <Footer />
    </PageActionProvider>
  );
}
