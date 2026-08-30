import type { Metadata } from "next";
import { Badge, buttonClassName, Card } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Healthcare | Freight Platform",
  description:
    "Compliant, temperature-controlled logistics for pharma and medical devices. Specialized packaging, documentation, and chain-of-custody handling built for regulated shipments.",
};

export default async function HealthcarePage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      {/* Hero section */}
      <section className="grid grid-cols-1 items-center gap-loose lg:grid-cols-2">
        <div className="flex flex-col gap-cozy">
          <Badge variant="neutral">Healthcare</Badge>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Logistics built for what pharma and medical device shipments demand.
          </h1>
          <p className="max-w-lg text-base text-muted">
            From temperature-sensitive pharmaceuticals to fragile medical devices, healthcare shipments carry requirements that generic freight handling can&apos;t meet. We build every move around the handling and documentation those shipments demand, with specialized packaging and clear chain-of-custody records from origin to destination.
          </p>
        </div>

        <div className="flex flex-col gap-tight rounded-lg border border-border bg-surface p-comfortable">
          <div className="flex items-center gap-snug">
            <div className="flex size-12 items-center justify-center rounded-md border border-border bg-background font-mono text-lg font-semibold text-foreground">
              HC
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-foreground">Healthcare</span>
              <span className="text-xs text-muted">Pharma & medical device logistics</span>
            </div>
          </div>
          <div className="border-t border-border pt-comfortable">
            <ul className="flex flex-col gap-snug">
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Temperature-controlled transport and storage</span>
              </li>
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Compliance-aware documentation for regulated shipments</span>
              </li>
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Specialized packaging for sensitive pharma and devices</span>
              </li>
              <li className="flex gap-snug text-sm text-muted">
                <span className="shrink-0">✓</span>
                <span>Chain-of-custody visibility from pickup to delivery</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="flex flex-col gap-comfortable rounded-lg border border-border bg-surface p-comfortable lg:p-expansive">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">Why choose healthcare logistics with us</h2>
          <p className="max-w-2xl text-base text-muted">
            Pharmaceutical and medical device shipments don&apos;t tolerate shortcuts. We build our processes around the handling and documentation requirements these shipments demand, so your product arrives intact, on time, and fully accounted for.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-comfortable sm:grid-cols-2">
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Temperature-controlled handling</h3>
            <p className="text-sm text-muted">
              Equipment and processes built around the tight temperature ranges pharmaceutical products require, across every leg of the journey.
            </p>
          </div>
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Compliance-aware documentation</h3>
            <p className="text-sm text-muted">
              Paperwork prepared to the standard regulated healthcare shipments require, reducing delays at customs and receiving.
            </p>
          </div>
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Specialized packaging</h3>
            <p className="text-sm text-muted">
              Packaging solutions matched to the fragility and sensitivity of pharmaceuticals and medical devices, not generic freight cartons.
            </p>
          </div>
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-base font-semibold text-foreground">Chain-of-custody visibility</h3>
            <p className="text-sm text-muted">
              A documented handoff record from pickup through delivery, so you always know where your shipment has been and who handled it.
            </p>
          </div>
        </div>
      </section>

      {/* Key benefits as cards */}
      <section className="flex flex-col gap-comfortable">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">Key benefits</h2>
          <p className="max-w-2xl text-base text-muted">
            Built for the demands of pharmaceutical and medical device supply chains, from bulk shipments to time-critical deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              🌡️
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Temperature control</h3>
              <p className="text-sm text-muted">
                Cold-chain and controlled-ambient options matched to your product&apos;s stability requirements.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              📋
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Compliance-ready paperwork</h3>
              <p className="text-sm text-muted">
                Documentation prepared with the level of detail regulated pharma and medical device shipments require.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              📦
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Purpose-built packaging</h3>
              <p className="text-sm text-muted">
                Packaging designed around the fragility and sensitivity of the products you ship, not one-size-fits-all cartons.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              🔗
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Chain-of-custody records</h3>
              <p className="text-sm text-muted">
                A documented trail of every handoff, giving you an accountable record from origin to destination.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col gap-cozy">
            <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
              🩺
            </div>
            <div className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">Specialist coordination</h3>
              <p className="text-sm text-muted">
                A team that understands the sensitivity of healthcare cargo, coordinating pickup, transport, and delivery on your behalf.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA section */}
      <section className="flex flex-col gap-comfortable rounded-lg border border-border/50 bg-background p-comfortable lg:p-expansive">
        <div className="flex flex-col gap-snug">
          <h2 className="font-display text-2xl font-semibold text-foreground">Ready to move your next healthcare shipment?</h2>
          <p className="max-w-lg text-base text-muted">
            Talk to a specialist who understands the handling and documentation your pharmaceutical or medical device shipment requires.
          </p>
        </div>
        <div className="flex flex-wrap gap-cozy pt-tight">
          <a
            href={localePath(locale, "/contact")}
            className={buttonClassName("primary", "md")}
          >
            Talk to a Healthcare specialist
          </a>
          <a
            href={localePath(locale, "/get-a-quote")}
            className={buttonClassName("secondary", "md")}
          >
            Get a quote
          </a>
        </div>
      </section>
    </div>
  );
}
