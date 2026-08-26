import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "@freight/ui/fonts";
import { AppShell } from "@/components/AppShell";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Freight Platform",
  description: "Public marketing site.",
};

/**
 * Root layout for the `(tier2)` route group.
 *
 * Independent from `(intl)/[locale]`'s root layout: Tier 2 was never meant
 * to be language-differentiated (a Tier 2 page is global content with local
 * contact details bolted on, not a localized subsite), so `<html lang>` is
 * hardcoded rather than threaded through a locale param that doesn't exist
 * on this branch.
 */
export default function CountriesLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={fontVariables}>
      <body className="flex min-h-screen flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
