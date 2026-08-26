"use client";

import { createContext, use, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/**
 * Client-side counterpart to `getLocale()`. Server components read the
 * locale via `getLocale()`; client islands (quote calculators, location
 * search, the tracking widget) read it with `useLocale()`.
 */
export function useLocale(): Locale {
  return use(LocaleContext);
}

/**
 * Publishes the resolved locale to client components. Rendered by
 * `app/[locale]/layout.tsx`; `children` stay server-rendered because they
 * are passed in from a server component.
 */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}
