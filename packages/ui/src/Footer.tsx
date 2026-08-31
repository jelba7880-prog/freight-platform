import type { HTMLAttributes, Ref } from "react";
import { cx } from "./cx";
import type { NavLink } from "./nav-data";
import { COMPANY_LINKS, RESOURCES_LINKS } from "./nav-data";

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  /**
   * Resolves an internal `href` before it's rendered — e.g. prefixing it
   * with the current locale segment. A plain prop rather than context, for
   * the same reason Header's `locale` prop is (see its doc comment):
   * `AppShell` renders `Footer` directly and nothing else in this package
   * currently needs it. Defaults to the identity function so callers that
   * render `Footer` outside `AppShell` — e.g. the style-guide's standalone
   * preview — keep unprefixed hrefs.
   */
  resolveHref?: (href: string) => string;
}

function LinkColumn({
  title,
  links,
  resolveHref,
}: {
  title: string;
  links: NavLink[];
  resolveHref: (href: string) => string;
}) {
  return (
    <nav aria-label={title} className="flex flex-col gap-tight">
      <h2 className="font-sans text-xs font-semibold uppercase tracking-wide text-muted">
        {title}
      </h2>
      <ul className="flex flex-col gap-tight">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={resolveHref(link.href)}
              className="font-sans text-sm text-foreground transition-colors duration-base hover:text-beacon"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ className, ref, resolveHref = (href) => href, ...props }: FooterProps) {
  return (
    <footer ref={ref} className={cx("border-t border-border bg-surface", className)} {...props}>
      <div className="mx-auto flex max-w-6xl flex-col gap-loose px-comfortable py-loose">
        <div className="grid grid-cols-1 gap-comfortable sm:grid-cols-2">
          {/* Careers lives in this Company column only — per
              Project_Overview.md's CTA-hierarchy principle, career links
              never share a row with commercial actions (track/contact),
              which live in Header instead. */}
          <LinkColumn title="Company" links={COMPANY_LINKS} resolveHref={resolveHref} />
          <LinkColumn title="Resources" links={RESOURCES_LINKS} resolveHref={resolveHref} />
        </div>

        <div className="flex flex-col gap-tight border-t border-border pt-comfortable sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-sm font-semibold text-foreground">
            Freight Platform
          </span>
          <p className="font-mono text-xs text-muted">
            &copy; {new Date().getFullYear()} Freight Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
