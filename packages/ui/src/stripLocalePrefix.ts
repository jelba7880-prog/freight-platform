/**
 * Strips exactly the known `/${locale}` prefix from `pathname`, returning
 * the canonical path `nav-data.ts`'s hrefs are written in.
 *
 * Deliberately keyed off the actual `locale` value rather than "drop the
 * first path segment": every locale that exists today (`global`, `us`,
 * `de`) happens to be exactly one segment, so positional slicing looked
 * correct — until a Tier 1 market ships a multilingual split (the spec's
 * own `/{countryCode}/{lang}` design, e.g. a future `/be/nl/...`), at which
 * point a fixed segment count silently strips the wrong thing with no
 * error. Matching the real prefix string is what stays correct once that
 * lands — extending it to a two-segment locale means building `prefix`
 * from both components (`/${locale}/${lang}`) at this call site, not
 * changing how many segments get sliced off.
 *
 * `locale` empty (outside any locale-scoped tree, or a preview that never
 * seeds one) is a no-op: `pathname` is returned unchanged.
 */
export function stripLocalePrefix(pathname: string, locale: string): string {
  if (!locale) return pathname;
  const prefix = `/${locale}`;
  if (pathname === prefix) return "/";
  if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  return pathname;
}
