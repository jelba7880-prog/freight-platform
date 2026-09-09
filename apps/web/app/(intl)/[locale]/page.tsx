import type { Metadata } from "next";
import {
  buttonClassName,
  CertificationsGrid,
  DarkCtaBand,
  DEFAULT_PRIMARY_ACTION,
  INDUSTRIES,
  ManifestStrip,
  PORTAL_LINK,
  SERVICES,
  StatBand,
  TestimonialBlock,
} from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Meridian Freight — Global freight forwarding & logistics",
  description:
    "Sea, air, and road freight, customs, warehousing, and supply-chain consulting — booked and tracked from one platform, with a specialist behind every shipment.",
};

const STATS = [
  { value: "148", label: "Offices in 46 countries" },
  { value: "2.4M", label: "TEU moved annually" },
  { value: "96.2%", label: "On-time lane performance" },
  { value: "24/7", label: "Named specialist per account" },
];

const CERTIFICATIONS = [
  { code: "AEO", description: "Customs simplification" },
  { code: "IATA CASS", description: "Air cargo agent" },
  { code: "C-TPAT", description: "Supply-chain security" },
  { code: "ISO 9001", description: "Quality management" },
  { code: "GDP", description: "Pharma distribution" },
  { code: "ISO 14001", description: "Environmental" },
];

/** First letter of up to the first two words — same lightweight monogram
 * ContentCard uses, kept local here rather than shared so restyling this
 * page's grids never risks changing ContentCard's own rendering on
 * /services, /industries, or /search. */
function initials(label: string): string {
  return label
    .split(/[\s,/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function Page() {
  const locale = await getLocale();
  const resolveHref = (href: string) => localePath(locale, href);

  return (
    <>
      <section data-mode="dark" className="bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-loose px-comfortable py-expansive lg:grid-cols-2">
          <div className="flex flex-col gap-cozy">
            <p className="font-mono text-xs uppercase tracking-wide text-beacon">
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
                href={resolveHref(DEFAULT_PRIMARY_ACTION.href)}
                className={buttonClassName("primary", "md")}
              >
                {DEFAULT_PRIMARY_ACTION.label}
              </a>
              <a href={resolveHref("/contact")} className={buttonClassName("secondary", "md")}>
                Talk to an expert
              </a>
              <a href={resolveHref(PORTAL_LINK.href)} className={buttonClassName("ghost", "md")}>
                {PORTAL_LINK.label}
              </a>
            </div>
          </div>

          <ManifestStrip />
        </div>
      </section>

      <StatBand stats={STATS} />

      <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
        <section className="flex flex-col gap-comfortable">
          <div className="flex flex-wrap items-end justify-between gap-cozy">
            <div className="flex flex-col gap-tight">
              <p className="font-mono text-xs font-medium uppercase tracking-wide text-beacon">
                01 — Services
              </p>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Every mode and value-added service, from a single partner.
              </h2>
            </div>
            <a
              href={resolveHref("/services")}
              className="font-mono text-xs font-medium uppercase tracking-wide text-muted transition-colors duration-base hover:text-beacon"
            >
              All services ↗
            </a>
          </div>

          <div className="flex flex-col">
            {SERVICES.map((service, index) => (
              <a
                key={service.slug}
                href={resolveHref(service.href)}
                className={`group grid grid-cols-[28px_36px_1fr_22px] items-start gap-cozy border-t border-border py-comfortable transition-colors duration-base ${
                  index === 0
                    ? "-mx-cozy rounded-md border-t-transparent bg-beacon-soft px-cozy"
                    : ""
                }`}
              >
                <span className="pt-tight font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-xs font-medium text-foreground">
                  {initials(service.label)}
                </span>
                <span className="flex flex-col gap-tight">
                  <span className="font-display text-lg font-semibold text-foreground">
                    {service.label}
                  </span>
                  <span className="max-w-md text-sm text-muted">{service.shortDescription}</span>
                </span>
                <span className="pt-tight font-mono text-sm text-beacon opacity-0 transition-opacity duration-base group-hover:opacity-100">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-comfortable">
          <div className="flex flex-wrap items-end justify-between gap-cozy">
            <div className="flex flex-col gap-tight">
              <p className="font-mono text-xs font-medium uppercase tracking-wide text-beacon">
                02 — Industries
              </p>
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Sector expertise, certifications, and specialist partners built in.
              </h2>
            </div>
            <a
              href={resolveHref("/industries")}
              className="font-mono text-xs font-medium uppercase tracking-wide text-muted transition-colors duration-base hover:text-beacon"
            >
              All industries ↗
            </a>
          </div>

          <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((industry, index) => (
              <a key={industry.slug} href={resolveHref(industry.href)} className="block h-full">
                <div className="flex h-full flex-col gap-cozy rounded-md border border-t-2 border-border bg-surface p-comfortable transition-[border-color,transform] duration-base hover:-translate-y-0.5 hover:border-t-beacon">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-md border border-border bg-background font-mono text-xs font-medium text-foreground">
                      {initials(industry.label)}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="font-display text-lg font-semibold text-foreground">
                    {industry.label}
                  </span>
                  <span className="mt-auto text-sm text-muted">{industry.shortDescription}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-loose border-t border-border pt-expansive lg:grid-cols-2">
          <div className="flex flex-col gap-cozy">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-beacon">
              03 — Assurance
            </p>
            <TestimonialBlock
              quote="We stopped chasing status emails. Every booking, customs file, and exception now lands in one place — and there is a named person behind it."
              attributionName="Head of global logistics"
              attributionDetail="Consumer electronics manufacturer"
            />
          </div>
          <div className="flex flex-col gap-cozy">
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-muted">
              Certifications and compliance
            </p>
            <CertificationsGrid items={CERTIFICATIONS} />
          </div>
        </section>
      </div>

      <DarkCtaBand
        eyebrow="Talk to a specialist"
        heading="Tell us the lane. We will tell you the fastest compliant way to move it."
        meta="Response within one business day · 148 offices · 46 countries"
        primaryCta={{ label: "Talk to an expert", href: resolveHref("/contact") }}
        secondaryCta={{ label: "Find a location", href: resolveHref("/locations") }}
      />
    </>
  );
}
