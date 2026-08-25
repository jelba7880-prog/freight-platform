import type { ReactNode } from "react";

/**
 * Simulates the other two apps' dark mode inline, without this route (or
 * apps/web generally) ever actually switching modes itself. `data-mode` is
 * a plain cascading attribute — nesting it here overrides the light
 * default from within an always-light page.
 */
export function ModePreview({
  mode,
  label,
  children,
}: {
  mode: "light" | "dark";
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-mode={mode}
      className="flex-1 rounded-lg border border-border bg-background p-comfortable text-foreground"
    >
      <p className="mb-cozy font-mono text-xs uppercase tracking-wide text-muted">{label}</p>
      <div className="flex flex-col gap-cozy">{children}</div>
    </div>
  );
}
