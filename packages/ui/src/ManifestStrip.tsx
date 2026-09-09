"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "./cx";
import { PORTAL_LINK } from "./nav-data";

/**
 * A small stack of rows styled like a live shipment-tracking feed —
 * simulated data only, meant as ambient "subtle live feel" chrome (e.g.
 * for a marketing homepage hero). Not wired to any real Shipments data,
 * and not wired into a page anywhere yet; see /style-guide for the review
 * surface.
 */
export interface ManifestStripProps {
  /** Rows visible at once. @default 5 */
  maxRows?: number;
  /** [min, max] ms between new-row insertions — re-randomized every tick,
   * not a fixed metronome. @default [4000, 6000] */
  intervalRange?: [number, number];
  className?: string;
}

type Status = "in-transit" | "cleared" | "delivered" | "loading" | "booked" | "customs-hold";
type Phase = "entering" | "idle" | "exiting";

interface ManifestRow {
  id: string;
  reference: string;
  coordinateLabel: string;
  timestampLabel: string;
  status: Status;
  phase: Phase;
}

/**
 * Real major port/airport coordinates, not random lat/long — random
 * coordinates can land on oceans or arbitrary residential addresses,
 * which breaks the "plausible" illusion in the wrong direction. The
 * reference code's country suffix is drawn from the same entry, so a
 * given row reads as internally coherent (e.g. an NL suffix pairs with
 * Rotterdam, not a random other country).
 */
// 2-decimal precision (~1km) rather than the 4-decimal figures a lookup
// gives — plenty for a glanceable feed row, and short enough to stay
// legible at this component's width without truncating.
const LOCATIONS = [
  { country: "NL", label: "51.92°N 4.48°E" }, // Rotterdam
  { country: "SG", label: "1.26°N 103.84°E" }, // Singapore
  { country: "US", label: "33.74°N 118.26°W" }, // Los Angeles
  { country: "CN", label: "31.23°N 121.47°E" }, // Shanghai
  { country: "DE", label: "53.55°N 9.97°E" }, // Hamburg
  { country: "CN", label: "22.54°N 114.06°E" }, // Shenzhen
  { country: "KR", label: "35.10°N 129.04°E" }, // Busan
  { country: "AE", label: "25.01°N 55.06°E" }, // Dubai (Jebel Ali)
  { country: "BE", label: "51.22°N 4.40°E" }, // Antwerp
  { country: "HK", label: "22.32°N 114.17°E" }, // Hong Kong
  { country: "JP", label: "35.44°N 139.64°E" }, // Yokohama
  { country: "US", label: "40.69°N 74.04°W" }, // New York
] as const;

const TRANSITION_MS = 260; // within the requested ~200-300ms range
const MIN_AGE_MS = 90_000; // 1.5 minutes
const MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

/**
 * Static placeholder, matching the design reference exactly — not derived
 * from anything. Whether this should instead be wired to a real shipments
 * count is an open question, not decided here: this component's rows are
 * already explicitly simulated/decorative (see the file doc comment above),
 * so a static number is consistent with that, but a real count is a
 * reasonable alternative if this ever needs to feel less like a mockup.
 */
const ACTIVE_BOOKINGS_COUNT = "12,480";

function randomReference(): { reference: string; coordinateLabel: string } {
  // Non-null: index is always < LOCATIONS.length, a fixed non-empty array.
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]!;
  const digits = Math.floor(10000 + Math.random() * 90000);
  return {
    reference: `FR-${digits}-${location.country}`,
    coordinateLabel: location.label,
  };
}

function randomStatus(): Status {
  // Roughly 45/15/12/10/10/8: in-transit / cleared / delivered / loading /
  // booked / customs-hold.
  const roll = Math.random();
  if (roll < 0.45) return "in-transit";
  if (roll < 0.6) return "cleared";
  if (roll < 0.72) return "delivered";
  if (roll < 0.82) return "loading";
  if (roll < 0.92) return "booked";
  return "customs-hold";
}

function formatTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}Z`
  );
}

function generateRow(phase: Phase): ManifestRow {
  const { reference, coordinateLabel } = randomReference();
  const ageMs = MIN_AGE_MS + Math.random() * (MAX_AGE_MS - MIN_AGE_MS);
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    reference,
    coordinateLabel,
    timestampLabel: formatTimestamp(new Date(Date.now() - ageMs)),
    status: randomStatus(),
    phase,
  };
}

/**
 * A consuming app's @types/node (needed for next.config.ts etc.) can
 * shadow the DOM lib's `setTimeout`/`clearTimeout` return type even when
 * called via `window.`, so `ReturnType<typeof window.setTimeout>` isn't
 * reliably `number` depending on which app typechecks this file. This
 * component only ever runs in the browser ("use client"), so pin the type
 * explicitly here instead of fighting ambient global resolution at every
 * call site.
 */
function browserSetTimeout(fn: () => void, delay: number): number {
  return window.setTimeout(fn, delay) as unknown as number;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

const statusStyles: Record<Status, { dot: string; text: string; label: string; pulses: boolean }> = {
  "in-transit": { dot: "bg-beacon", text: "text-beacon", label: "In transit", pulses: true },
  cleared: { dot: "bg-cleared", text: "text-cleared", label: "Cleared", pulses: true },
  // Delivered reuses the cleared/teal token — it's the same "done" family
  // as cleared, just a later milestone, not a distinct accent.
  delivered: { dot: "bg-cleared", text: "text-cleared", label: "Delivered", pulses: true },
  // Loading has no natural home in the palette (ink/steel/paper/mist/
  // beacon/cleared/danger) — it borrows the neutral muted token rather
  // than introduce a new hue outside the design system.
  loading: { dot: "bg-muted", text: "text-muted", label: "Loading", pulses: true },
  // Booked hasn't started moving yet, so its dot sits static — the pulse is
  // meant to read as "in motion," and a booked shipment isn't.
  booked: { dot: "bg-muted", text: "text-muted", label: "Booked", pulses: false },
  // The one status with a real exception state — reuses the existing
  // danger token rather than a new hue.
  "customs-hold": { dot: "bg-danger", text: "text-danger", label: "Customs hold", pulses: true },
};

const rowPhaseStyles: Record<Phase, string> = {
  entering: "opacity-0 -translate-y-1.5",
  idle: "opacity-100 translate-y-0",
  exiting: "opacity-0 translate-y-1.5",
};

export function ManifestStrip({
  maxRows = 5,
  intervalRange = [4000, 6000],
  className,
}: ManifestStripProps) {
  const [rows, setRows] = useState<ManifestRow[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const timeoutsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Idempotent: only seeds rows once (or after a prop-driven remount via
    // key), never wipes an in-progress live feed on re-render.
    setRows((prev) =>
      prev.length > 0 ? prev : Array.from({ length: maxRows }, () => generateRow("idle")),
    );

    if (reducedMotion) {
      // "Render as a static list with static dots, no exceptions": no
      // scheduled churn at all while reduced motion is active, not just a
      // near-zero transition duration. Rows already on screen simply stay
      // put.
      return;
    }

    const timeouts = timeoutsRef.current;
    const [min, max] = intervalRange;

    function scheduleNext() {
      const delay = min + Math.random() * (max - min);
      const id = browserSetTimeout(() => {
        timeouts.delete(id);
        addRow();
        scheduleNext();
      }, delay);
      timeouts.add(id);
    }

    function addRow() {
      const newRow = generateRow("entering");
      let exitingId: string | undefined;

      setRows((prev) => {
        // Insertion is authoritative for row count, not the cleanup timer
        // below: if a prior cycle's "exiting" row is still here because its
        // own timer got throttled (e.g. a backgrounded tab), drop it here
        // synchronously instead of letting it pile up with newer ones.
        const settled = prev.filter((row) => row.phase !== "exiting");
        const next = [newRow, ...settled];
        if (next.length <= maxRows) return next;

        // Overflow: the array holds one extra row (maxRows + 1) only for the
        // duration of its fade-out transition, removed by id below — never
        // by a time-based sweep, so a delayed timer can't let rows stack up.
        const oldest = next[next.length - 1]!;
        exitingId = oldest.id;
        return next.map((row) =>
          row.id === oldest.id ? { ...row, phase: "exiting" as const } : row,
        );
      });

      // Double rAF: guarantees the "entering" (pre-transition) styles paint
      // at least once before flipping to "idle", so the CSS transition
      // actually animates instead of jumping straight to its end state.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRows((prev) =>
            prev.map((row) => (row.id === newRow.id ? { ...row, phase: "idle" } : row)),
          );
        });
      });

      if (exitingId !== undefined) {
        const id = exitingId;
        const cleanupId = browserSetTimeout(() => {
          timeouts.delete(cleanupId);
          setRows((prev) => prev.filter((row) => row.id !== id));
        }, TRANSITION_MS + 40);
        timeouts.add(cleanupId);
      }
    }

    scheduleNext();

    return () => {
      for (const id of timeouts) window.clearTimeout(id);
      timeouts.clear();
    };
  }, [maxRows, intervalRange, reducedMotion]);

  return (
    <div className={cx("rounded-lg border border-border bg-surface shadow-sm", className)}>
      <div className="flex items-center justify-between gap-cozy border-b border-border px-snug py-snug">
        <div className="flex items-center gap-tight">
          <span
            aria-hidden="true"
            className={cx(
              "size-1.5 shrink-0 rounded-full bg-beacon",
              !reducedMotion && "animate-pulse-dot",
            )}
          />
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-foreground">
            Live manifest
          </span>
        </div>
        <span className="font-mono text-xs uppercase tracking-wide text-muted">
          Decorative preview data
        </span>
      </div>

      <span className="sr-only">Live shipment tracking feed (decorative preview data)</span>
      <div aria-hidden="true" className="divide-y divide-border">
        {rows.map((row) => {
          const status = statusStyles[row.status];
          return (
            <div
              key={row.id}
              className={cx(
                // Literal duration-[260ms], matching TRANSITION_MS above —
                // Tailwind's scanner needs the class as literal text, it
                // can't evaluate a template-interpolated value.
                "flex items-center gap-tight px-snug py-snug transition-[opacity,transform] duration-[260ms] ease-out",
                rowPhaseStyles[row.phase],
              )}
            >
              <div className="flex shrink-0 items-center gap-tight">
                <span
                  className={cx(
                    "size-1.5 shrink-0 rounded-full",
                    status.dot,
                    !reducedMotion && status.pulses && "animate-pulse-dot",
                  )}
                />
                <span className={cx("font-sans text-xs font-medium whitespace-nowrap", status.text)}>
                  {status.label}
                </span>
              </div>
              <span className="shrink-0 font-mono text-xs font-medium text-foreground">
                {row.reference}
              </span>
              <span className="hidden flex-1 truncate font-mono text-xs text-muted sm:block">
                {row.coordinateLabel}
              </span>
              <span className="shrink-0 font-mono text-xs text-muted">{row.timestampLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-cozy border-t border-border px-snug py-snug">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">
          {ACTIVE_BOOKINGS_COUNT} active bookings
        </span>
        <a
          href={PORTAL_LINK.href}
          className="font-mono text-xs uppercase tracking-wide text-muted transition-colors duration-base hover:text-beacon"
        >
          Open portal ↗
        </a>
      </div>
    </div>
  );
}
