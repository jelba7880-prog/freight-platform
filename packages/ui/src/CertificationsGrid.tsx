import { cx } from "./cx";

export interface Certification {
  code: string;
  description: string;
}

export interface CertificationsGridProps {
  items: Certification[];
  className?: string;
}

/** A grid of compliance/certification marks (AEO, ISO 9001, ...) — plain
 * bordered tiles rather than badge logos, since no certifying-body artwork
 * exists in this design system and the code + one-line description reads
 * fine at this density. */
export function CertificationsGrid({ items, className }: CertificationsGridProps) {
  return (
    <div className={cx("grid grid-cols-2 gap-tight sm:grid-cols-3", className)}>
      {items.map((item) => (
        <div key={item.code} className="rounded-sm border border-border px-cozy py-cozy">
          <span className="block font-mono text-sm font-medium text-foreground">{item.code}</span>
          <span className="mt-tight block font-mono text-xs text-muted">{item.description}</span>
        </div>
      ))}
    </div>
  );
}
