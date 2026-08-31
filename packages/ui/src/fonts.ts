/**
 * Font loading for all three typefaces in the Visual Direction spec:
 *   Display — Geist (self-hosted via the `geist` package, built on
 *             next/font/local under the hood)
 *   Body    — IBM Plex Sans (self-hosted via the `@fontsource/ibm-plex-sans`
 *             package, built on next/font/local — same pattern as Geist)
 *   Mono    — IBM Plex Mono (self-hosted via the `@fontsource/ibm-plex-mono`
 *             package, built on next/font/local), for reference numbers,
 *             container IDs, coordinates, and timestamps
 *
 * All three load from local WOFF2 files rather than next/font/google, so a
 * build never depends on reaching fonts.googleapis.com.
 *
 * next/font calls only get processed by Next's compiler when this file is
 * actually bundled into an app (each app's next.config.ts lists
 * "@freight/ui" in transpilePackages for exactly this reason). Each app's
 * root layout applies `fontVariables` to <html> so every descendant can
 * reach the font CSS variables via var(--font-geist-sans) etc. — wired
 * into the font-display / font-sans / font-mono Tailwind utilities in
 * packages/config/tailwind/theme.css.
 */
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

const plexSans = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = [GeistSans.variable, plexSans.variable, plexMono.variable].join(
  " ",
);
