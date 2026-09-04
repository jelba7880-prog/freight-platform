"use client";

import { useId } from "react";
import type { Ref, TextareaHTMLAttributes } from "react";
import { cx } from "./cx";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label: string;
  /** Presence of an error string puts the textarea in its error state
   * (border, message, aria-invalid) — there is no separate boolean flag.
   * Mirrors Input's error convention exactly. */
  error?: string;
  id?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({ label, error, id, className, required, ref, ...props }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;

  return (
    <div className="flex flex-col gap-tight">
      <label htmlFor={textareaId} className="font-sans text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
        ) : null}
      </label>
      <textarea
        ref={ref}
        id={textareaId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cx(
          "min-h-32 rounded-sm border bg-surface px-cozy py-snug font-sans text-sm text-foreground",
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
