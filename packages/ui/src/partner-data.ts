/**
 * Logotype content for the homepage's two LogoStrip rows: the customers
 * the site claims to move freight for, and the systems it claims to
 * integrate with. Deliberately NOT part of nav-data.ts — that file owns
 * services and industries, which are real routable content with slugs,
 * descriptions and CTAs behind them. These entries route nowhere and
 * exist only to be drawn, so they get their own file rather than
 * widening nav-data's contract.
 *
 * Kept as plain data (not props) for the same reason nav-data is: a page
 * can't casually grow a logo strip by passing an array. Extending it
 * means editing this file, a visible, reviewable change.
 *
 * EVERY NAME BELOW IS INVENTED. No real company, product or trademark is
 * referenced here, and none should be added — these are placeholder
 * logotypes for a scaffold, and both strips carry a visually-hidden line
 * saying so (see LogoStrip).
 *
 * There is no artwork: each mark is drawn at runtime from a geometric
 * glyph plus Archivo set at the entry's own width/weight/tracking. That
 * typographic variation is the whole point — it is what makes eight
 * names read as eight separate logotypes rather than a list of words.
 */

/** The six geometric marks a logotype can pair with. Drawn inline in
 *  LogoStrip on a 24x24 grid; no external assets. */
export type BrandGlyph = "chevron" | "hex" | "bar" | "ring" | "arc" | "slash";

export interface Brand {
  slug: string;
  name: string;
  glyph: BrandGlyph;
  /** Archivo `wdth` axis value. The face is loaded across 62–125 (see
   *  packages/ui/src/fonts.ts), so anything in that range renders. */
  width: number;
  weight: number;
  /** Letter-spacing in em. */
  tracking: number;
  case: "upper" | "title";
}

/**
 * Eight customer logotypes, spread deliberately wide across the width,
 * weight and case axes: a condensed 75 next to an extended 125, a 400
 * next to an 800. The wide/heavy settings go to the short names and the
 * condensed ones to the long names, so no mark runs past its cell.
 */
export const CUSTOMERS: Brand[] = [
  { slug: "northrig", name: "Northrig", glyph: "hex", width: 118, weight: 700, tracking: -0.02, case: "upper" },
  { slug: "aveley", name: "Aveley", glyph: "ring", width: 125, weight: 500, tracking: 0.08, case: "upper" },
  { slug: "kestrel", name: "Kestrel Athletic", glyph: "chevron", width: 88, weight: 600, tracking: -0.01, case: "title" },
  { slug: "marston", name: "Marston Motors", glyph: "slash", width: 80, weight: 500, tracking: 0.02, case: "upper" },
  { slug: "pallas", name: "Pallas Micro", glyph: "bar", width: 112, weight: 800, tracking: -0.025, case: "title" },
  { slug: "brightfold", name: "Brightfold", glyph: "arc", width: 96, weight: 400, tracking: 0.06, case: "title" },
  { slug: "halstead", name: "Halstead Goods", glyph: "hex", width: 75, weight: 650, tracking: 0.01, case: "title" },
  { slug: "sierra-mills", name: "Sierra Mills", glyph: "chevron", width: 104, weight: 450, tracking: 0.04, case: "upper" },
];

/**
 * Four integration logotypes. Held to one weight, one tracking and a
 * three-point width band on purpose — where CUSTOMERS reads as eight
 * unrelated companies that each chose their own mark, these should read
 * as one product family, and only the glyph tells them apart.
 */
export const INTEGRATIONS: Brand[] = [
  { slug: "shiplane", name: "Shiplane", glyph: "bar", width: 94, weight: 600, tracking: 0.02, case: "title" },
  { slug: "ratecraft", name: "Ratecraft", glyph: "slash", width: 92, weight: 600, tracking: 0.02, case: "title" },
  { slug: "loadhive", name: "Loadhive", glyph: "hex", width: 96, weight: 600, tracking: 0.02, case: "title" },
  { slug: "consignly", name: "Consignly", glyph: "arc", width: 94, weight: 600, tracking: 0.02, case: "title" },
];
