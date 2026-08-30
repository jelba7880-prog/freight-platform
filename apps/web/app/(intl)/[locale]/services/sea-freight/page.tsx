import type { Metadata } from "next";
import { Badge, buttonClassName, Card, PageAction } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Sea Freight | Freight Platform",
  description:
    "Full container and consolidated ocean freight across major global trade lanes. Scale your shipments with competitive rates and reliable transit schedules.",
};

export default async function SeaFreightPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      <PageAction label="Get a quote for sea freight" href="/get-a-quote" />

      {/* Hero section */}
      <section className="grid grid-cols-1 items-center gap-loose lg:grid-cols-2">
        <div className="flex flex-col gap-cozy">
          <Badge variant="neutral">Sea freight</Badge>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Global ocean freight that scales with your business.
          </h1>
          <p className="max-w-lg text-base text-muted">
            Whether you ship full containers or smaller consolidated shipments, our ocean freight service connects you to major global trade lanes with transparent pricing, predictable transit times, and dedicated account management.
          </p>
        </div>

        <div className="flex flex-col gap-tight rounded-lg border border-border bg-surface p-comfortable">
          <div className="flex items-center gap-snug">
            <div className="flex size-12 items-center justify-center rounded-md border border-border bg-background font-mono text-lg font-semibold text-foreground">
              SF
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-foreground">Sea freight</span>
              <span className="text-xs text-muted">Full containers & consolidated shipments</span>
            </div>
          </div>
          <div className="border-t border-border pt-comfortable">
            <ul className="flex flex-col gap-snug">
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Competitive rates for FCL and LCL</span>
              </li>
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Reliable 15&ndash;45 day transit across major routes</span>
              </li>
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Full shipment visibility from port to port</span>
              </li>
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Integrated customs and documentation handling</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="flex flex-col gap-comfortable rounded-lg border border-border bg-surface p-comfortable lg:p-expansive">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">Why choose sea freight with us</h2>
          <p className="max-w-2xl text-base text-muted">
            We handle everything from quoting to delivery, so you can focus on your supply chain. Our global network and local expertise mean your shipment gets the care and attention it deserves.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-comfortable sm:grid-cols-2">
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Transparent pricing</h3>
            <p className="text-sm text-muted">
              Clear, itemized quotes that show every cost — no hidden fees, and rates competitive with industry standards.
            </p>
          </div>
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Global coverage</h3>
            <p className="text-sm text-muted">
              Service to and from major ports worldwide. Whether it&apos;s Asia to Europe or domestic coastal routes, we&apos;ve got the capacity.
            </p>
          </div>
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Reliable schedules</h3>
            <p className="text-sm text-muted">
              Predictable transit times backed by steady partnerships with carriers and port operators across key trade lanes.
            </p>
          </div>
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Dedicated support</h3>
            <p className="text-sm text-muted">
              Your account manager tracks your shipments, handles documentation, and coordinates with ports and warehouses on your behalf.
            </p>
          </div>
        </div>
      </section>

      {/* Key benefits as cards */}
      <section className="flex flex-col gap-comfortable">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">Key benefits</h2>
          <p className="max-w-2xl text-base text-muted">
            Sea freight is the most cost-effective option for shipments weighing over 10–15 tons or with flexible delivery windows.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              ⚓
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Lower cost per ton</h3>
              <p className="text-sm text-muted">
                Ocean freight is the most economical choice for high-volume, lower-urgency shipments across continents.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              📦
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Flexible container options</h3>
              <p className="text-sm text-muted">
                Choose full container loads (FCL) for complete shipment control, or consolidated less-than-container (LCL) loads to share costs.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              🌍
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Established trade routes</h3>
              <p className="text-sm text-muted">
                Access to well-established shipping corridors with frequent sailings and consistent transit performance.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              📍
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Door-to-door coordination</h3>
              <p className="text-sm text-muted">
                We arrange pickup, haulage to port, ocean transport, port clearance, and final delivery as one seamless service.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              📋
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Documentation & compliance</h3>
              <p className="text-sm text-muted">
                Bills of lading, export/import permits, customs forms — we handle the paperwork so you don&apos;t have to.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA section */}
      <section className="flex flex-col gap-comfortable rounded-lg border border-border/50 bg-background p-comfortable lg:p-expansive">
        <div className="flex flex-col gap-snug">
          <h2 className="font-display text-2xl font-semibold text-foreground">Ready to ship?</h2>
          <p className="max-w-lg text-base text-muted">
            Get a competitive quote for your sea freight shipment. Our team will review your needs and provide transparent pricing within hours.
          </p>
        </div>
        <div className="flex flex-wrap gap-cozy pt-tight">
          <a
            href={localePath(locale, "/get-a-quote")}
            className={buttonClassName("primary", "md")}
          >
            Get a quote for sea freight
          </a>
          <a
            href={localePath(locale, "/contact")}
            className={buttonClassName("secondary", "md")}
          >
            Talk to an expert
          </a>
        </div>
      </section>
    </div>
  );
}
