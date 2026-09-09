import { cx } from "./cx";

export interface Stat {
  value: string;
  label: string;
}

export interface StatBandProps {
  stats: Stat[];
  className?: string;
}

/**
 * A full-bleed bordered row of headline numbers (e.g. "148 offices in 46
 * countries"), meant to sit directly below a hero. Full-bleed by design —
 * the border-y spans the viewport while the stats themselves stay
 * container-width, matching how Header/Footer split full-bleed chrome from
 * contained content.
 */
export function StatBand({ stats, className }: StatBandProps) {
  return (
    <div className={cx("border-y border-border bg-background", className)}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-y divide-border px-comfortable sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-tight py-comfortable sm:px-comfortable sm:first:pl-0 sm:last:pr-0"
          >
            <span className="font-mono text-3xl font-semibold text-foreground sm:text-4xl">
              {stat.value}
            </span>
            <span className="font-mono text-xs font-medium uppercase tracking-wide text-muted">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
