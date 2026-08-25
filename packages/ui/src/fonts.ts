/**
 * Font loading for all three typefaces in the Visual Direction spec:
 *   Display — Geist (self-hosted via the `geist` package, built on
 *             next/font/local under the hood)
 *   Body    — IBM Plex Sans (next/font/google)
 *   Mono    — IBM Plex Mono (next/font/google), for reference numbers,
 *             container IDs, coordinates, and timestamps
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
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = [GeistSans.variable, plexSans.variable, plexMono.variable].join(
  " ",
);
