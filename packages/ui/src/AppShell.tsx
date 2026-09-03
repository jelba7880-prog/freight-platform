import type { ReactNode } from "react";
import { buttonClassName } from "./Button";

export interface AppShellNavItem {
  label: string;
  href: string;
}

export interface AppShellProps {
  brand: string;
  navItems: AppShellNavItem[];
  /**
   * Resolves an internal `href` before it's rendered — e.g. prefixing it
   * with an app-specific base path. Defaults to the identity function,
   * matching the `resolveHref` pattern every other shared nav component in
   * this package (Header, Footer) already follows.
   */
  resolveHref?: (href: string) => string;
  userEmail: string;
  signOutAction: () => Promise<void>;
  children: ReactNode;
}

/**
 * Top bar for an authenticated app (portal, admin): brand, nav links, the
 * signed-in user's email, and a sign-out control. Deliberately not
 * `Header` — no mega-menu, no locale awareness, no mobile disclosure. Does
 * not wrap `children` in a content width/padding container; pages own
 * that themselves (e.g. `max-w-5xl` vs `max-w-3xl` in apps/portal) and
 * shouldn't be forced to match.
 */
export function AppShell({
  brand,
  navItems,
  resolveHref = (href) => href,
  userEmail,
  signOutAction,
  children,
}: AppShellProps) {
  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-cozy px-comfortable py-snug">
          <div className="flex items-center gap-comfortable">
            <a
              href={resolveHref("/")}
              className="font-display text-lg font-semibold text-foreground"
            >
              {brand}
            </a>
            <nav aria-label="Primary" className="flex items-center gap-tight">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={resolveHref(item.href)}
                  className="rounded-sm px-tight py-tight font-sans text-sm text-foreground transition-colors duration-base hover:text-beacon"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-cozy">
            <span className="font-sans text-sm text-muted">{userEmail}</span>
            <form action={signOutAction}>
              <button type="submit" className={buttonClassName("secondary", "sm")}>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
