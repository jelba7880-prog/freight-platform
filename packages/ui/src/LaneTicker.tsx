import { cx } from "./cx";

export interface LaneTickerProps {
  lanes: string[];
  className?: string;
}

/**
 * A horizontally scrolling strip of trade-lane pairs — ambient chrome for a
 * dark hero, matching the reference's marquee. Its translation is bound to
 * document scroll position via `animation-timeline: scroll(root)` (see
 * `.lane-ticker-track` in theme.css), not a timer, so it still needs no JS:
 * theme.css gates the animation itself behind `@media` and `@supports`,
 * falling back to a static (non-animated) strip when scroll-timelines
 * aren't supported or the visitor prefers reduced motion. Content renders
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
          <span aria-hidden="true" className="text-oxide">
            /
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cx("overflow-hidden border-t border-border", className)}>
      <span className="sr-only">Sample trade lanes (decorative)</span>
      <div aria-hidden="true" className="lane-ticker-track flex w-max">
        {track}
        {track}
      </div>
    </div>
  );
}
