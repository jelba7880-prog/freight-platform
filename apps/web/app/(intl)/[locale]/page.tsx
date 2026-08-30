import type { Metadata } from "next";
import {
  buttonClassName,
  Card,
  DEFAULT_PRIMARY_ACTION,
  INDUSTRIES,
  ManifestStrip,
  PORTAL_LINK,
  SERVICES,
  UTILITY_LINKS,
  type ContentNavLink,
} from "@freight/ui";
import { localePath, type Locale } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Freight Platform — Global freight forwarding & logistics",
  description:
    "Sea, air, and road freight, customs, warehousing, and supply-chain consulting — quoted, booked, and tracked from one platform.",
};

// Fallback only guards the type-checker; UTILITY_LINKS always carries this
// entry (see packages/ui/src/nav-data.ts), so it never actually triggers.
// Mirrors the same lookup Header itself does for its mobile track icon.
const TRACK_LINK = UTILITY_LINKS.find((link) => link.label === "Track shipment") ?? {
  label: "Track shipment",
  href: "/track",
};

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

function ContentCard({ entry, locale }: { entry: ContentNavLink; locale: Locale }) {
  return (
    <a href={localePath(locale, entry.href)} className="block h-full">
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

export default async function Page() {
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      <section className="grid grid-cols-1 items-center gap-loose lg:grid-cols-2">
        <div className="flex flex-col gap-cozy">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            Global freight forwarding
          </p>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Move freight anywhere, with total visibility.
          </h1>
          <p className="max-w-lg text-base text-muted">
            Sea, air, and road freight, customs clearance, warehousing, and supply-chain
            consulting — quoted, booked, and tracked from one platform.
          </p>
          <div className="flex flex-wrap gap-cozy pt-tight">
            <a
              href={localePath(locale, DEFAULT_PRIMARY_ACTION.href)}
              className={buttonClassName("primary", "md")}
            >
              {DEFAULT_PRIMARY_ACTION.label}
            </a>
            <a href={localePath(locale, TRACK_LINK.href)} className={buttonClassName("secondary", "md")}>
              {TRACK_LINK.label}
            </a>
            <a href={localePath(locale, PORTAL_LINK.href)} className={buttonClassName("ghost", "md")}>
              {PORTAL_LINK.label}
            </a>
          </div>
        </div>

        <ManifestStrip />
      </section>

      <section className="flex flex-col gap-comfortable">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">Services</h2>
          <p className="max-w-2xl text-base text-muted">
            Every mode and value-added service, from a single partner.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <ContentCard key={service.slug} entry={service} locale={locale} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-comfortable">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">Industries</h2>
          <p className="max-w-2xl text-base text-muted">
            Sector expertise, certifications, and specialist partners built in.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((industry) => (
            <ContentCard key={industry.slug} entry={industry} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
