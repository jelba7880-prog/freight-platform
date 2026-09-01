import type { Metadata } from "next";
import { Card, Input, SERVICES, buttonClassName } from "@freight/ui";
import { searchLocations } from "@freight/database";

import { LocationCard } from "@/components/LocationCard";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Locations | Freight Platform",
  description:
    "Find our offices by country, city, postcode, or service — with contact details and services offered at each location.",
};

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
              <LocationCard location={location} locale={locale} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
