import { cx } from "./cx";

export interface LaneTickerProps {
  lanes: string[];
  className?: string;
}

/**
 * A continuously scrolling strip of trade-lane pairs — ambient chrome for a
 * dark hero, matching the reference's marquee. Pure CSS transform animation
 * (see theme.css's `--animate-marquee`), so it needs no JS
 * prefers-reduced-motion hook the way ManifestStrip's row churn does:
 * reset.css's blanket override already zeroes it out. Content renders
 * twice back to back so the `-50%` loop point reads as seamless; the
 * duplicate is aria-hidden with a single sr-only label instead, same
 * pattern as ManifestStrip's decorative rows.
 */
export function LaneTicker({ lanes, className }: LaneTickerProps) {
  const track = (
    <div className="flex shrink-0 items-center gap-comfortable pr-comfortable">
      {lanes.map((lane, index) => (
        <span
          key={index}
          className="flex items-center gap-comfortable whitespace-nowrap font-mono text-xs uppercase tracking-wide text-muted"
        >
          {lane}
          <span aria-hidden="true" className="text-beacon">
            /
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cx("overflow-hidden border-t border-border", className)}>
      <span className="sr-only">Sample trade lanes (decorative)</span>
      <div aria-hidden="true" className="flex w-max animate-marquee">
        {track}
        {track}
      </div>
    </div>
  );
}
