/**
 * Font loading for all three typefaces in the Visual Direction spec:
 *   Display — Archivo (self-hosted via the `@fontsource-variable/archivo`
 *             package, built on next/font/local). A grotesque with a real
 *             width axis, so display type contrasts with body copy by
 *             width and tracking rather than by being a second neutral
 *             sans at the same width (see reset.css's h1/h2/h3 rule).
 *   Body    — IBM Plex Sans (self-hosted via the `@fontsource/ibm-plex-sans`
 *             package, built on next/font/local — same pattern as Archivo)
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
 * reach the font CSS variables via var(--font-archivo) etc. — wired
 * into the font-display / font-sans / font-mono Tailwind utilities in
 * packages/config/tailwind/theme.css.
 */
import localFont from "next/font/local";

const archivo = localFont({
  // The `wdth` cut is the variable file carrying BOTH axes — wght 100–900
  // and wdth 62%–125%. Declaring the width range as font-stretch is what
  // keeps a browser from clamping reset.css's `font-variation-settings:
  // "wdth" 112` back to the default 100%.
  src: "../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  variable: "--font-archivo",
  display: "swap",
});

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

export const fontVariables = [archivo.variable, plexSans.variable, plexMono.variable].join(
  " ",
);
