import type { Metadata } from "next";
import { INDUSTRIES } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Industries | Meridian Freight",
  description:
    "Sector expertise, certifications, and specialist partners built in — logistics tailored to your industry.",
};

/** First letter of up to the first two words — same lightweight monogram
 * ContentCard uses, kept local here rather than shared so restyling this
 * page's rows never risks changing ContentCard's own rendering elsewhere
 * (it's still used on /services and /search). */
function initials(label: string): string {
  return label
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function IndustriesPage() {
  const locale = await getLocale();
  const resolveHref = (href: string) => localePath(locale, href);

  return (
    <>
      <section data-mode="dark" className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-cozy px-comfortable py-expansive">
          <h1 className="font-display text-4xl font-semibold text-foreground">Industries</h1>
          <p className="max-w-2xl text-base text-muted">
            Sector expertise, certifications, and specialist partners built in — so compliance,
            handling, and lead times are designed around your cargo, not retrofitted to it.
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl flex-col px-comfortable py-expansive">
        {INDUSTRIES.map((industry, index) => (
          <a
            key={industry.slug}
            href={resolveHref(industry.href)}
            className="group grid grid-cols-1 gap-cozy border-t border-border py-comfortable sm:grid-cols-[44px_1.15fr_1fr_24px] sm:items-start"
          >
            <span className="font-mono text-xs text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex flex-col gap-tight">
              <span className="flex items-center gap-cozy">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-xs font-medium text-foreground">
                  {initials(industry.label)}
                </span>
                <span className="font-display text-xl font-semibold text-foreground">
                  {industry.label}
                </span>
              </span>
              <span className="max-w-md text-sm text-muted">{industry.shortDescription}</span>
            </span>
            <span className="flex flex-wrap content-start gap-tight">
              {(industry.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm border border-border px-snug py-[0.1875rem] font-mono text-xs uppercase tracking-wide text-foreground"
                >
                  {tag}
                </span>
              ))}
            </span>
            <span className="font-mono text-sm text-beacon opacity-0 transition-opacity duration-base group-hover:opacity-100 sm:pt-tight">
              →
            </span>
          </a>
        ))}
      </div>
    </>
  );
}
