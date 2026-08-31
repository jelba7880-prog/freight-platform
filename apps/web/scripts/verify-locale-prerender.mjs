/**
 * Regression test for locale resolution across a multi-variant prerender.
 *
 * Guards the bug that shipped with the homepage: `getLocale()` used to read a
 * `cache()`-backed store that the locale layout wrote via `setLocale()`, but
 * Next renders the page segment before the parent layout's body runs, so the
 * read always beat the write and every variant resolved to DEFAULT_LOCALE.
 * Nothing exercised this before — the locale scaffold landed with no page
 * actually calling `getLocale()`, and the style-guide page never did either.
 *
 * Why it asserts on prerendered HTML rather than calling `getLocale()`
 * directly: the failure only appears when several locale variants of one
 * route are generated in a single `next build` pass, with the real layout →
 * page segment ordering in play. A unit test calling `getLocale()` outside a
 * render would not have caught it, because there is no render context to get
 * the ordering wrong in.
 *
 * The two attributes compared per variant come from deliberately different
 * sources, which is what makes this a real cross-check rather than a
 * tautology:
 *   - `data-locale`  — the layout, from its own `params` (control)
 *   - the page's hrefs — built with `localePath(await getLocale())` (subject)
 * If `getLocale()` regresses to the default, `us.html` links to `/track`
 * while still carrying `data-locale="us"`, and this fails. `/track` is a
 * good pick for this: it's `DEFAULT_PRIMARY_ACTION`'s href, so it's the
 * link most pages on the site render.
 *
 * Run via `pnpm --filter @freight/web test:locale`, which builds first.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const appDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** [locale segment, prerendered file, expected href prefix on that variant] */
const VARIANTS = [
  ["global", "global.html", ""],
  ["us", "us.html", "/us"],
  ["de", "de.html", "/de"],
];

/** Paths the homepage links to that must carry the locale prefix. */
const LOCALIZED_PATHS = ["/track", "/services/sea-freight"];

const failures = [];

for (const [locale, file, prefix] of VARIANTS) {
  const full = path.join(appDir, ".next/server/app", file);

  let html;
  try {
    html = await readFile(full, "utf8");
  } catch {
    failures.push(`${locale}: expected prerendered ${file} — did \`next build\` run, and is this route still SSG?`);
    continue;
  }

  // Control: the layout's own view of the locale, straight from params.
  const declared = html.match(/data-locale="([^"]*)"/)?.[1];
  if (declared !== locale) {
    failures.push(`${locale}: layout rendered data-locale="${declared}", expected "${locale}"`);
  }

  // Subject: hrefs the page built through localePath(await getLocale()).
  for (const p of LOCALIZED_PATHS) {
    const expected = `href="${prefix}${p}"`;
    if (!html.includes(expected)) {
      const actual = html.match(new RegExp(`href="[^"]*${p.replace(/\//g, "\\/")}"`))?.[0] ?? "no matching href";
      failures.push(
        `${locale}: expected ${expected} but found ${actual} — getLocale() likely resolved to the wrong locale`,
      );
    }
  }

  // The default-locale variant must stay unprefixed; a stray "/global/..."
  // would mean the routing key leaked into a public URL.
  if (html.includes('href="/global/')) {
    failures.push(`${locale}: found an href under /global/ — the internal routing key must never appear in a URL`);
  }
}

if (failures.length > 0) {
  console.error("locale prerender check FAILED:\n" + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}

console.error(
  `locale prerender check passed — ${VARIANTS.length} variants, ` +
    `${LOCALIZED_PATHS.length} localized paths each, all resolved by getLocale().`,
);
