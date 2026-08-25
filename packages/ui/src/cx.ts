/**
 * Tiny className joiner. Not a Tailwind-conflict resolver (no
 * tailwind-merge) — components pass their own variant classes first and
 * the caller's `className` last, so a caller override wins only if the
 * two classes don't target the exact same CSS property. Good enough for
 * this primitive set; revisit if a real conflict shows up in practice.
 */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
