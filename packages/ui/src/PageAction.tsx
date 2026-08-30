"use client";

import { createContext, use, useEffect, useState, type ReactNode } from "react";
import type { PrimaryAction } from "./Header";

// Split into two contexts on purpose: `setAction` (from `useState`) has a
// stable identity across renders, while `action` itself changes every time
// a page registers or clears its CTA. Registering components only ever
// need the stable setter, so they never re-run their effect just because
// some other value changed — keeping the setter and the value together in
// one object would recreate that object (and retrigger every consumer's
// effect) on every registration.
const PageActionSetterContext = createContext<((action: PrimaryAction | null) => void) | null>(
  null,
);
const PageActionValueContext = createContext<PrimaryAction | null>(null);

/**
 * Wraps the shared shell — Header plus the routed page content — so a page
 * anywhere below can register its own contextual CTA without Header ever
 * needing to know that page's route exists. Rendered once by `AppShell`,
 * above both `Header` and `children`.
 */
export function PageActionProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<PrimaryAction | null>(null);
  return (
    <PageActionSetterContext value={setAction}>
      <PageActionValueContext value={action}>{children}</PageActionValueContext>
    </PageActionSetterContext>
  );
}

/**
 * Registers `action` as the page's contextual primary CTA for as long as
 * the calling component stays mounted, and clears it on unmount so
 * navigating away restores the site-wide default. Client-only (it's a
 * `useEffect`), which is why a server-component page can't call this
 * directly — render `<PageAction>` below instead.
 */
export function usePageAction(action: PrimaryAction): void {
  const setAction = use(PageActionSetterContext);
  const { label, href } = action;
  useEffect(() => {
    if (!setAction) return;
    setAction({ label, href });
    return () => setAction(null);
  }, [setAction, label, href]);
}

/** Header's read side: the currently registered page CTA, or `null` when
 * no page below has registered one (including outside any provider, e.g.
 * the style-guide's standalone Header previews). */
export function usePageActionValue(): PrimaryAction | null {
  return use(PageActionValueContext);
}

/**
 * Declarative counterpart to `usePageAction` for server-component pages,
 * which can't call hooks themselves: render this anywhere in the page's
 * JSX to register its contextual CTA. Renders nothing.
 */
export function PageAction({ label, href }: PrimaryAction) {
  usePageAction({ label, href });
  return null;
}
