import { cx } from "./cx";
import type { Brand, BrandGlyph } from "./partner-data";

export interface LogoStripProps {
  /** Mono uppercase eyebrow, e.g. "Trusted by". */
  label: string;
  brands: Brand[];
  /**
   * Which family the strip belongs to, and the only thing that colors it.
   * Customers resolve warm (brand), integrations cool (status-adjacent) —
   * the original ask was for each mark to reveal its own brand color, but
   * that would mean a dozen new hues and would break the palette's
   * warm-is-brand / cool-is-status split. One accent per strip carries the
   * same distinction with no new tokens.
   */
  accent: "oxide" | "transit";
  /** Optional line under the strip, in the muted mono meta treatment. */
  note?: string;
  className?: string;
}

/**
 * Each glyph drawn on a 24x24 grid, fill-only (no strokes) so a single
 * `fill="currentColor"` on the <svg> colors the mark and the logotype
 * together. `ring` and `arc` get their counters from evenodd/subtraction
 * rather than a stroke, for the same reason.
 */
const GLYPH_PATHS: Record<BrandGlyph, string> = {
  chevron: "M4 4 L14 12 L4 20 L8.5 20 L18.5 12 L8.5 4 Z",
  hex: "M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z",
  bar: "M3 6 H21 V9.5 H3 Z M3 12 H16 V15.5 H3 Z M3 18 H9.5 V21.5 H3 Z",
  ring: "M12 2 A10 10 0 1 0 12 22 A10 10 0 1 0 12 2 Z M12 6.5 A5.5 5.5 0 1 1 12 17.5 A5.5 5.5 0 1 1 12 6.5 Z",
  arc: "M12 2 A10 10 0 0 1 22 12 H17.5 A5.5 5.5 0 0 0 12 6.5 Z M2 12 A10 10 0 0 0 12 22 V17.5 A5.5 5.5 0 0 1 6.5 12 Z",
  slash: "M14.5 3 H20 L9.5 21 H4 Z",
};

/**
 * Resting and resolved colors per accent, as whole literal class strings:
 * Tailwind's JIT scans source text, so `text-${accent}` would compile to
 * nothing.
 *
 * The resting `mist` is scoped to `(hover: hover)` on purpose. A
 * hover-only reveal is dead interaction on a phone, so coarse pointers
 * skip the grey state entirely and get the accent immediately.
 *
 * `text-oxide` / `text-transit` are the mode-aware tokens, which resolve
 * to the on-light shades on `paper` — where both strips live — and would
 * resolve to the on-dark shades if a strip ever moved into a dark band.
 * Neither is the solid fill hue.
 */
const ACCENT_CLASSES: Record<LogoStripProps["accent"], string> = {
  oxide:
    "text-oxide [@media(hover:hover)]:text-mist [@media(hover:hover)]:hover:text-oxide [@media(hover:hover)]:focus-within:text-oxide",
  transit:
    "text-transit [@media(hover:hover)]:text-mist [@media(hover:hover)]:hover:text-transit [@media(hover:hover)]:focus-within:text-transit",
};

/**
 * A row of placeholder logotypes, drawn rather than sourced: a geometric
 * glyph plus the brand name as a real SVG <text> in Archivo, set at that
 * brand's own width/weight/tracking (see partner-data.ts).
 *
 * <text>, not outlined paths, so the names stay selectable, searchable
 * and translatable, and so a failed font load degrades down the
 * --font-display stack instead of to nothing.
 *
 * Every name is invented. Following ManifestStrip's "Decorative preview
 * data" precedent, each strip states that in a visually-hidden line
 * rather than a visible disclaimer — the claim is only misleading to
 * someone who can't see that these are unbranded geometric placeholders.
 */
export function LogoStrip({ label, brands, accent, note, className }: LogoStripProps) {
  const kind = accent === "oxide" ? "customers" : "integrations";

  return (
    <section className={cx("flex flex-col gap-comfortable", className)}>
      <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted">{label}</p>

      <ul
        className={cx(
          "grid grid-cols-2 gap-x-comfortable gap-y-loose sm:grid-cols-4",
          "transition-colors duration-base ease-standard",
          ACCENT_CLASSES[accent],
        )}
      >
        {brands.map((brand) => (
          <li key={brand.slug} className="flex items-center">
            <svg
              role="img"
              aria-label={brand.name}
              viewBox="0 0 260 44"
              preserveAspectRatio="xMinYMid meet"
              fill="currentColor"
              className="h-9 w-full"
            >
              <path d={GLYPH_PATHS[brand.glyph]} transform="translate(0 10)" />
              <text
                x="36"
                y="29"
                fontSize="20"
                style={{
                  fontFamily: "var(--font-display)",
                  fontVariationSettings: `"wdth" ${brand.width}`,
                  fontWeight: brand.weight,
                  letterSpacing: `${brand.tracking}em`,
                }}
              >
                {brand.case === "upper" ? brand.name.toUpperCase() : brand.name}
              </text>
            </svg>
          </li>
        ))}
      </ul>

      {note ? <p className="font-mono text-xs text-muted">{note}</p> : null}

      <span className="sr-only">
        These {kind} are illustrative placeholders. None is a real{" "}
        {accent === "oxide" ? "customer" : "integration"} of this site.
      </span>
    </section>
  );
}
