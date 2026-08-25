import type { ButtonHTMLAttributes, Ref } from "react";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** "primary" is beacon-filled — reserve it for the ONE primary action in
   * a given view. It is never used decoratively or repeated. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  ref?: Ref<HTMLButtonElement>;
}

const base =
  "inline-flex items-center justify-center gap-tight whitespace-nowrap font-sans font-medium " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-base ease-standard " +
  "disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";

const variants: Record<ButtonVariant, string> = {
  // The one place beacon-solid is a full-bleed fill: always paired with
  // ink text, regardless of which app/mode is rendering it.
  primary: "bg-beacon-solid text-ink shadow-sm hover:brightness-105",
  secondary: "border border-border bg-surface text-foreground hover:border-mist",
  ghost: "bg-transparent text-foreground hover:bg-surface active:bg-border/40",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 rounded-sm px-cozy text-xs",
  md: "h-10 rounded-md px-comfortable text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ref,
  ...props
}: ButtonProps) {
  return (
    <button ref={ref} className={cx(base, variants[variant], sizes[size], className)} {...props} />
  );
}
