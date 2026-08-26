"use client";

import { useEffect, useRef, useState } from "react";
import type { Key, ReactNode } from "react";
import { cx } from "./cx";

export type ColumnAlign = "left" | "center" | "right";
export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface Column<T> {
  key: string;
  header: string;
  /** Custom cell content (e.g. a Badge for a status column). If omitted,
   * the raw value at `row[key]` is rendered as text, in the font `type`
   * below selects. Not typed to `keyof T`: a column is free to be a
   * derived/computed value with no 1:1 data property, as long as it
   * supplies `render`. */
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  align?: ColumnAlign;
  /** CSS width hint (e.g. "10rem") applied to the <th>/<td>. Advisory,
   * not a hard constraint — the browser table layout can still grow it. */
  widthHint?: string;
  /** Font role for the *default* (no `render`) rendering path: "data" for
   * reference codes / numeric values / dates & timestamps (IBM Plex Mono,
   * matching the type system's data/utility rule), "text" for everything
   * else (IBM Plex Sans). @default "text" */
  type?: "text" | "data";
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  /** Stable React key per row. Defaults to row index if omitted — fine for
   * static demo data, but a real key is worth passing once rows can
   * reorder (e.g. after a sort). */
  rowKey?: (row: T, index: number) => Key;
  /** The currently-applied sort. Table is controlled: it renders this back
   * as the header's indicator/aria-sort, but never sorts `data` itself —
   * that's the caller's job (client-side now, server-side once
   * packages/database is real, without Table needing to change). */
  sort?: SortState | null;
  /** Fired with the *next* sort descriptor when a sortable header is
   * activated (click, or Enter/Space — a real <button>, so keyboard
   * activation is native, not reimplemented). Toggles asc/desc on the
   * active column; switching columns starts at asc. */
  onSort?: (next: SortState) => void;
  isLoading?: boolean;
  /** Skeleton row count while loading. @default 5 */
  loadingRowCount?: number;
  /** Rendered in place of the body when `data` is empty and not loading.
   * @default a generic "No results" state */
  emptyState?: ReactNode;
  /** Enables a vertically-scrolling body with a header that stays pinned
   * (position: sticky) instead of scrolling away. */
  maxHeight?: string;
  /** Visible <caption>, also the scroll region's accessible name. */
  caption?: string;
  className?: string;
}

/**
 * Deliberately starts at `false` rather than lazily computing the real
 * value up front. This route is statically prerendered, so the server
 * render always has no `window` and produces `false`; a client-computed
 * `true` on the very first render would then be a real, permanent
 * hydration mismatch — React logs it as "this won't be patched up" and
 * keeps the server-rendered (wrong) className forever, not just for one
 * frame. Syncing the real value inside an effect instead means the first
 * client render matches the server exactly (no mismatch), and the correct
 * value lands immediately after mount as a normal update. The one-frame
 * gap where a reduced-motion user could theoretically see the shimmer
 * class is covered by reset.css's blanket animation-duration override,
 * which is pure CSS and has no hydration timing to get wrong.
 */
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}

const alignClass: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function SortIcon({ direction }: { direction?: SortDirection }) {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true" className="shrink-0">
      <path d="M6 1.5l3 3.5H3l3-3.5z" fill="currentColor" opacity={direction === "desc" ? 0.3 : 1} />
      <path d="M6 10.5L3 7h6l-3 3.5z" fill="currentColor" opacity={direction === "asc" ? 0.3 : 1} />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12l11-6 11 6-11 6-11-6z" />
      <path d="M5 12v9l11 6 11-6v-9" />
      <path d="M16 18v9" />
    </svg>
  );
}

function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center gap-tight py-loose text-muted">
      <EmptyIcon />
      <p className="font-sans text-sm font-medium text-foreground">No results</p>
      <p className="font-sans text-xs text-muted">There&apos;s nothing to show here yet.</p>
    </div>
  );
}

export function Table<T>({
  columns,
  data,
  rowKey,
  sort = null,
  onSort,
  isLoading = false,
  loadingRowCount = 5,
  emptyState,
  maxHeight,
  caption,
  className,
}: TableProps<T>) {
  const reducedMotion = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function updateAffordance() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }

    updateAffordance();
    el.addEventListener("scroll", updateAffordance);
    window.addEventListener("resize", updateAffordance);
    return () => {
      el.removeEventListener("scroll", updateAffordance);
      window.removeEventListener("resize", updateAffordance);
    };
    // Re-measure whenever the column set or row count could change layout.
  }, [columns, data, isLoading]);

  function handleSort(column: Column<T>) {
    if (!column.sortable || !onSort) return;
    const direction: SortDirection =
      sort?.key === column.key && sort.direction === "asc" ? "desc" : "asc";
    onSort({ key: column.key, direction });
  }

  const showEmpty = !isLoading && data.length === 0;

  return (
    <div className={cx("relative", className)}>
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-surface to-transparent transition-opacity duration-base",
          canScrollLeft ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-surface to-transparent transition-opacity duration-base",
          canScrollRight ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={caption ?? "Table, horizontally scrollable"}
        className="overflow-x-auto rounded-lg border border-border focus-visible:outline-none"
        style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
      >
        <table className="w-full min-w-max border-collapse" aria-busy={isLoading || undefined}>
          {caption ? (
            <caption className="border-b border-border px-cozy py-snug text-left font-sans text-sm font-medium text-foreground">
              {caption}
            </caption>
          ) : null}
          <thead className={cx(maxHeight ? "sticky top-0 z-[1]" : undefined, "bg-surface")}>
            <tr className="border-b border-border">
              {columns.map((column) => {
                const isActive = sort?.key === column.key;
                const ariaSortValue = column.sortable
                  ? isActive
                    ? sort!.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                  : undefined;

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSortValue}
                    style={column.widthHint ? { width: column.widthHint } : undefined}
                    className={cx(
                      "px-cozy py-snug font-sans text-xs font-semibold uppercase tracking-wide text-muted",
                      alignClass[column.align ?? "left"],
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column)}
                        className={cx(
                          "inline-flex items-center gap-tight rounded-sm transition-colors duration-base hover:text-foreground",
                          column.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {column.header}
                        <SortIcon direction={isActive ? sort!.direction : undefined} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: loadingRowCount }, (_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border last:border-b-0">
                    {columns.map((column, colIndex) => (
                      <td key={column.key} className={cx("px-cozy py-snug", alignClass[column.align ?? "left"])}>
                        <span
                          aria-hidden="true"
                          className={cx(
                            "block h-3 rounded-full",
                            reducedMotion ? "bg-border" : "skeleton-shimmer",
                          )}
                          style={{ width: `${60 + ((rowIndex + colIndex) % 3) * 12}%` }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : showEmpty
                ? (
                    <tr>
                      <td colSpan={columns.length} className="px-cozy py-snug">
                        {emptyState ?? <DefaultEmptyState />}
                      </td>
                    </tr>
                  )
                : data.map((row, index) => (
                    <tr
                      key={rowKey ? rowKey(row, index) : index}
                      className="border-b border-border last:border-b-0 hover:bg-border/10"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cx(
                            "px-cozy py-snug text-sm text-foreground",
                            column.type === "data" ? "font-mono" : "font-sans",
                            alignClass[column.align ?? "left"],
                          )}
                        >
                          {column.render
                            ? column.render(row)
                            : String((row as Record<string, unknown>)[column.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
