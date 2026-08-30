"use client";

import { createContext, use, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import type { PrimaryAction } from "./Header";

// `useLayoutEffect` on the client so a page's registration is flushed
// before the browser paints, and plain `useEffect` on the server, where
// layout effects never run and React warns if you ask for one.
//
// This narrows, but does NOT close, the window where Header shows the
// site-wide fallback instead of the page's own CTA. Measured on a warm
// production build at 4x CPU throttle (n=6): 326ms with `useEffect`,
// 279ms with `useLayoutEffect`. The residual gap is not effect timing —
// it is that the prerendered HTML itself carries the fallback label, and
// the browser paints that at first contentful paint, long before any of
// this code runs. Nothing client-side can close that; see the tracking
// issue on server-resolved CTAs for the options and their trade-offs.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
 * navigating away restores the site-wide default. Client-only (it's an
 * effect), which is why a server-component page can't call this directly
 * — render `<PageAction>` below instead.
 */
export function usePageAction(action: PrimaryAction): void {
  const setAction = use(PageActionSetterContext);
  const { label, href } = action;
  useIsomorphicLayoutEffect(() => {
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
