"use client";

import { createContext, use, type ReactNode } from "react";

const LocaleContext = createContext<string>("");

/**
 * The current locale's routing key (e.g. `"global"`, `"us"`, `"de"`), for
 * client components in this package — today, just `Header`'s own CTA
 * lookup (see `stripLocalePrefix`/`resolveContextualCta`).
 *
 * Deliberately separate from apps/web's own `useLocale()`
 * (apps/web/lib/locale/context.tsx): that module's `Locale` union and
 * seeding both belong to apps/web's specific Tier 1 market list, and
 * `packages/ui` is shared with apps/portal and apps/admin too — it can't
 * take a dependency on one consuming app's locale scheme. This context is
 * typed as a plain `string` and seeded generically by whichever app wires
 * up `LocaleProvider` (see `AppShell` in apps/web).
 *
 * Returns `""` outside any `LocaleProvider` — e.g. the style-guide's
 * standalone `Header` previews — which callers should treat as "no
 * locale segment to account for."
 */
export function useLocale(): string {
  return use(LocaleContext);
}

/** Seeds `useLocale()` for `Header` and any future packages/ui client
 * component that needs the current locale's routing key. */
export function LocaleProvider({ locale, children }: { locale: string; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}
