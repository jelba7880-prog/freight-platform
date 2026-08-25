"use client";

import { useId } from "react";
import type { InputHTMLAttributes, Ref } from "react";
import { cx } from "./cx";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  /** Presence of an error string puts the input in its error state
   * (border, message, aria-invalid) — there is no separate boolean flag. */
  error?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
}

export function Input({ label, error, id, className, required, ref, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-tight">
      <label htmlFor={inputId} className="font-sans text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(
          "h-10 rounded-sm border bg-surface px-cozy font-sans text-sm text-foreground",
          "placeholder:text-muted transition-colors duration-base ease-standard",
          error ? "border-danger" : "border-border focus:border-beacon",
          className,
        )}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="font-sans text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
