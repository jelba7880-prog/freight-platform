import { Card } from "./Card";
import type { ContentNavLink } from "./nav-data";

export interface ContentCardProps {
  entry: ContentNavLink;
  /**
   * Resolves `entry.href` before it's rendered — e.g. prefixing it with the
   * current locale segment. Same pattern as Header/Footer's `resolveHref`
   * prop (see their doc comments): a plain prop rather than context, since
   * packages/ui otherwise has no locale awareness of its own. Defaults to
   * the identity function so callers that don't need locale prefixing
   * (e.g. the style-guide) keep unprefixed hrefs.
   */
  resolveHref?: (href: string) => string;
}

/** First letter of up to the first two words — a lightweight monogram in
 * place of a bespoke icon set, which doesn't exist yet for these entries. */
function initials(label: string): string {
  return label
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function ContentCard({ entry, resolveHref = (href) => href }: ContentCardProps) {
  return (
    <a href={resolveHref(entry.href)} className="block h-full">
      <Card className="flex h-full flex-col gap-cozy transition-colors duration-base hover:border-mist">
        <span
          aria-hidden="true"
          className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground"
        >
          {initials(entry.label)}
        </span>
        <div className="flex flex-col gap-tight">
          <h3 className="font-display text-lg font-semibold text-foreground">{entry.label}</h3>
          <p className="text-sm text-muted">{entry.shortDescription}</p>
        </div>
      </Card>
    </a>
  );
}
