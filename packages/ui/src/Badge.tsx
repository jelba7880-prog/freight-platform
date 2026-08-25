import type { HTMLAttributes, Ref } from "react";
import { cx } from "./cx";

/**
 * Status pill mapped directly onto real domain states. This backs actual
 * Quote-tier and Shipment-status badges later — "in-transit" and "cleared"
 * are not decorative color options, they mean exactly what their names
 * say. Extend this union only when a new state actually exists.
 */
export type BadgeVariant = "in-transit" | "cleared" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  ref?: Ref<HTMLSpanElement>;
}

const styles: Record<BadgeVariant, string> = {
  "in-transit": "border-beacon/30 bg-beacon-soft text-beacon",
  cleared: "border-cleared/30 bg-cleared-soft text-cleared",
  neutral: "border-border bg-transparent text-muted",
};

const dotStyles: Record<BadgeVariant, string> = {
  "in-transit": "bg-beacon",
  cleared: "bg-cleared",
  neutral: "bg-mist",
};

export function Badge({ variant = "neutral", className, children, ref, ...props }: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cx(
        "inline-flex items-center gap-tight rounded-full border px-snug py-[0.1875rem] font-sans text-xs font-medium leading-none",
        styles[variant],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cx("size-1.5 shrink-0 rounded-full", dotStyles[variant])} />
      {children}
    </span>
  );
}
