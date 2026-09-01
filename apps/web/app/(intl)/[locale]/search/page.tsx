import type { Metadata } from "next";
import { ContentCard, INDUSTRIES, SERVICES } from "@freight/ui";
import type { ContentNavLink } from "@freight/ui";
import { searchLocationsByText } from "@freight/database";

import { LocationCard } from "@/components/LocationCard";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Search | Freight Platform",
  description: "Search services, industries, and locations across the site.",
};

function matches(entry: ContentNavLink, term: string): boolean {
  const needle = term.toLowerCase();
  return (
    entry.label.toLowerCase().includes(needle) ||
    entry.shortDescription.toLowerCase().includes(needle)
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const locale = await getLocale();
  const { q } = await searchParams;
  const term = q?.trim() ?? "";
  const hasQuery = Boolean(term);

  const serviceResults = hasQuery ? SERVICES.filter((entry) => matches(entry, term)) : [];
  const industryResults = hasQuery ? INDUSTRIES.filter((entry) => matches(entry, term)) : [];
  const locationResults = hasQuery ? await searchLocationsByText(term) : [];

  const noResults =
    hasQuery &&
    serviceResults.length === 0 &&
    industryResults.length === 0 &&
    locationResults.length === 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Search</h1>
        {hasQuery ? (
          <p className="max-w-2xl text-base text-muted">Results for &ldquo;{term}&rdquo;</p>
        ) : (
          <p className="max-w-2xl text-base text-muted">Enter a search term to get started.</p>
        )}
      </header>

      {noResults ? (
        <p className="text-base text-muted">No results for &ldquo;{term}&rdquo;.</p>
      ) : null}

      {hasQuery && !noResults ? (
        <div className="flex flex-col gap-expansive">
          <section className="flex flex-col gap-comfortable">
            <h2 className="font-display text-xl font-semibold text-foreground">Services</h2>
            {serviceResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
                {serviceResults.map((service) => (
                  <ContentCard
                    key={service.slug}
                    entry={service}
                    resolveHref={(href) => localePath(locale, href)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-base text-muted">No matching services.</p>
            )}
          </section>

          <section className="flex flex-col gap-comfortable">
            <h2 className="font-display text-xl font-semibold text-foreground">Industries</h2>
            {industryResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
                {industryResults.map((industry) => (
                  <ContentCard
                    key={industry.slug}
                    entry={industry}
                    resolveHref={(href) => localePath(locale, href)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-base text-muted">No matching industries.</p>
            )}
          </section>

          <section className="flex flex-col gap-comfortable">
            <h2 className="font-display text-xl font-semibold text-foreground">Locations</h2>
            {locationResults.length > 0 ? (
              <ul className="flex flex-col gap-cozy">
                {locationResults.map((location) => (
                  <li key={location.id}>
                    <LocationCard location={location} locale={locale} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-base text-muted">No matching locations.</p>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
