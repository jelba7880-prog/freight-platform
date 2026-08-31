import type { ReactNode } from "react";
import { getLocale } from "@/lib/locale/server";
import { SiteChrome } from "./SiteChrome";

/**
 * Shared chrome for both root layouts in the tree.
 *
 * `(intl)/[locale]` and `(tier2)/countries` are independent root layouts —
 * each owns its own `<html>/<body>` so that `<html lang>` can differ between
 * them — but both need identical Header/Footer/site chrome. This is that
 * shared piece, so the nav shell stays a single edit instead of two.
 */
export async function AppShell({ children }: { children: ReactNode }) {
  // Passed into SiteChrome (a Client Component — see its own doc comment on
  // why the Header/Footer wiring lives there instead of here). Falls back to
  // `DEFAULT_LOCALE` outside a locale-scoped tree (see `getLocale()`'s own
  // doc comment), which is the right answer for the `(tier2)/countries`
  // layout that also renders this component.
  const locale = await getLocale();

  return <SiteChrome locale={locale}>{children}</SiteChrome>;
}
