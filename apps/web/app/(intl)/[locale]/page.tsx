import type { Metadata } from "next";
import {
  buttonClassName,
  ContentCard,
  DEFAULT_PRIMARY_ACTION,
  INDUSTRIES,
  ManifestStrip,
  PORTAL_LINK,
  SERVICES,
} from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Freight Platform — Global freight forwarding & logistics",
  description:
    "Sea, air, and road freight, customs, warehousing, and supply-chain consulting — booked and tracked from one platform, with a specialist behind every shipment.",
};

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
            consulting — booked and tracked from one platform, with a specialist behind
            every shipment.
          </p>
          <div className="flex flex-wrap gap-cozy pt-tight">
            <a
              href={localePath(locale, DEFAULT_PRIMARY_ACTION.href)}
              className={buttonClassName("primary", "md")}
            >
              {DEFAULT_PRIMARY_ACTION.label}
            </a>
            <a href={localePath(locale, "/contact")} className={buttonClassName("secondary", "md")}>
              Talk to an expert
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
            <ContentCard
              key={service.slug}
              entry={service}
              resolveHref={(href) => localePath(locale, href)}
            />
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
            <ContentCard
              key={industry.slug}
              entry={industry}
              resolveHref={(href) => localePath(locale, href)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
