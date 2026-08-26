import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer, Header } from "@freight/ui";
import { fontVariables } from "@freight/ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freight Platform",
  description: "Public marketing site.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /*
      Root shell for both branches of the tree: the localized `[locale]`
      routes (Tier 1 + global default) and the top-level `countries` routes
      (Tier 2). It sits above the locale segment, so it has no locale of its
      own — `lang` stays "en" until Phase 6 introduces actual languages, and
      `Header`'s links stay locale-agnostic. Pages that need a locale-aware
      href build it with `localePath()` from lib/locale/config.
    */
    <html lang="en" data-mode="light" className={fontVariables}>
      <body className="flex min-h-screen flex-col">
        {/*
          Header lives in the root layout, so every apps/web route shares
          it. Real per-page contextual CTAs (a Sea Freight page passing its
          own primaryAction, etc.) need routes to actually exist first —
          out of scope here per the task. This wires the mechanism with a
          homepage-flavored CTA; other pages fall back to Header's own
          DEFAULT_PRIMARY_ACTION until they're built and can pass their own.
        */}
        <Header primaryAction={{ label: "Start a quote", href: "/get-a-quote" }} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
