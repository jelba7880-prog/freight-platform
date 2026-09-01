import Link from "next/link";
import { Card, SERVICES } from "@freight/ui";
import type { LocationSummary } from "@freight/database";

import { localePath, type Locale } from "@/lib/locale/config";

const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  SERVICES.map((service) => [service.slug, service.label]),
);

function fullAddress(location: LocationSummary): string {
  return [location.addressLine, location.city, location.postcode, location.country]
    .filter(Boolean)
    .join(", ");
}

/**
 * Shared result card for a single location — used by both the /locations
 * directory (structured filters) and /search (free-text). Not a
 * packages/ui primitive: it reaches into @freight/database's LocationSummary
 * and this app's localePath, neither of which packages/ui knows about.
 */
export function LocationCard({ location, locale }: { location: LocationSummary; locale: Locale }) {
  return (
    <Card>
      <div className="flex flex-col gap-cozy">
        <h2 className="font-display text-lg font-semibold text-foreground">{location.name}</h2>
        <dl className="grid grid-cols-1 gap-cozy sm:grid-cols-2">
          <div className="flex flex-col gap-tight">
            <dt className="font-sans text-xs uppercase tracking-wide text-muted">Address</dt>
            <dd className="text-sm text-foreground">{fullAddress(location) || "—"}</dd>
          </div>
          <div className="flex flex-col gap-tight">
            <dt className="font-sans text-xs uppercase tracking-wide text-muted">Phone</dt>
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
  );
}
