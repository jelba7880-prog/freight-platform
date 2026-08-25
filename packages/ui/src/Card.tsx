import type { HTMLAttributes, Ref } from "react";
import { cx } from "./cx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Card({ className, ref, ...props }: CardProps) {
  return (
    <div
      ref={ref}
      className={cx("rounded-lg border border-border bg-surface p-comfortable shadow-sm", className)}
      {...props}
    />
  );
}
