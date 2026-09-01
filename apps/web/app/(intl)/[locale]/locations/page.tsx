import Link from "next/link";
import type { Metadata } from "next";
import { Card, Input, SERVICES, buttonClassName } from "@freight/ui";
import type { LocationSummary } from "@freight/database";
import { searchLocations } from "@freight/database";

import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Locations | Freight Platform",
  description:
    "Find our offices by country, city, postcode, or service — with contact details and services offered at each location.",
};

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICES.map((service) => [service.slug, service.label]),
);

function fullAddress(location: LocationSummary): string {
  return [location.addressLine, location.city, location.postcode, location.country]
    .filter(Boolean)
    .join(", ");
}

function LocationsFilterForm({
  country,
  city,
  postcode,
  service,
}: {
  country?: string;
  city?: string;
  postcode?: string;
  service?: string;
}) {
  return (
    <Card>
      <form
        method="get"
        className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
      >
        <Input id="country" name="country" label="Country" defaultValue={country} placeholder="e.g. Germany" />
        <Input id="city" name="city" label="City" defaultValue={city} placeholder="e.g. Hamburg" />
        <Input
          id="postcode"
          name="postcode"
          label="Postcode"
          defaultValue={postcode}
          placeholder="e.g. 20457"
        />
        <div className="flex flex-col gap-tight">
          <label htmlFor="service" className="font-sans text-sm font-medium text-foreground">
            Service
          </label>
          <select
            id="service"
            name="service"
            defaultValue={service ?? ""}
            className="h-10 rounded-sm border border-border bg-surface px-cozy font-sans text-sm text-foreground transition-colors duration-base ease-standard focus:border-beacon"
          >
            <option value="">Any service</option>
            {SERVICES.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={buttonClassName("primary", "md")}>
          Search
        </button>
      </form>
    </Card>
  );
}

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; city?: string; postcode?: string; service?: string }>;
}) {
  const locale = await getLocale();
  const { country, city, postcode, service } = await searchParams;

  const hasQuery = Boolean(country?.trim() || city?.trim() || postcode?.trim() || service?.trim());
  const results = hasQuery ? await searchLocations({ country, city, postcode, service }) : [];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Locations</h1>
        <p className="max-w-2xl text-base text-muted">
          Search our offices by country, city, postcode, or service to find contact details and
          what each location offers.
        </p>
      </header>

      <LocationsFilterForm country={country} city={city} postcode={postcode} service={service} />

      {!hasQuery ? (
        <p className="text-base text-muted">Enter at least one filter to search locations.</p>
      ) : null}

      {hasQuery && results.length === 0 ? (
        <p className="text-base text-muted">No locations found matching your filters.</p>
      ) : null}

      {results.length > 0 ? (
        <ul className="flex flex-col gap-cozy">
          {results.map((location) => (
            <li key={location.id}>
              <Card>
                <div className="flex flex-col gap-cozy">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {location.name}
                  </h2>
                  <dl className="grid grid-cols-1 gap-cozy sm:grid-cols-2">
                    <div className="flex flex-col gap-tight">
                      <dt className="font-sans text-xs uppercase tracking-wide text-muted">
                        Address
                      </dt>
                      <dd className="text-sm text-foreground">{fullAddress(location) || "—"}</dd>
                    </div>
                    <div className="flex flex-col gap-tight">
                      <dt className="font-sans text-xs uppercase tracking-wide text-muted">
                        Phone
                      </dt>
                      <dd className="text-sm text-foreground">{location.phone ?? "—"}</dd>
                    </div>
                  </dl>
                  {location.services.length > 0 ? (
                    <div className="flex flex-wrap gap-tight">
                      {location.services.map((slug) => (
                        <Link
                          key={slug}
                          href={localePath(locale, `/services/${slug}`)}
                          className="rounded-full border border-border px-snug py-[0.1875rem] font-sans text-xs font-medium text-muted transition-colors duration-base ease-standard hover:border-beacon hover:text-beacon"
                        >
                          {SERVICE_LABELS[slug] ?? slug}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
