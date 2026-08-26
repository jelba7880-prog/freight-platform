import type { ReactNode } from "react";

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-comfortable border-t border-border pt-loose first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-tight">
        <h2 className="font-display text-2xl font-semibold text-foreground">{title}</h2>
        {description ? <p className="max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
