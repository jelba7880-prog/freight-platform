import type { Metadata } from "next";
import { Badge, Card, Input, buttonClassName, type BadgeVariant } from "@freight/ui";
import type { ShipmentWithEvents } from "@freight/database";
import { getShipmentWithEvents } from "@freight/database";

export const metadata: Metadata = {
  title: "Track shipment | Freight Platform",
  description: "Look up a shipment's current status and tracking history by reference number.",
};

const STATUS_LABELS: Record<ShipmentWithEvents["shipment"]["status"], string> = {
  pending: "Pending",
  in_transit: "In transit",
  customs_clearance: "Customs clearance",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  delayed: "Delayed",
};

const STATUS_BADGE_VARIANTS: Record<ShipmentWithEvents["shipment"]["status"], BadgeVariant> = {
  pending: "neutral",
  in_transit: "in-transit",
  customs_clearance: "in-transit",
  out_for_delivery: "in-transit",
  delivered: "cleared",
  delayed: "neutral",
};

const EVENT_TYPE_LABELS: Record<ShipmentWithEvents["events"][number]["eventType"], string> = {
  arrival: "Arrival",
  departure: "Departure",
  status_change: "Status change",
  milestone: "Milestone",
  exception: "Exception",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function TrackForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <Card>
      <form method="get" className="flex flex-col gap-cozy sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            id="ref"
            name="ref"
            label="Reference number"
            defaultValue={defaultValue}
            placeholder="e.g. FR-88213-JP"
            className="font-mono"
          />
        </div>
        <button type="submit" className={buttonClassName("primary", "md")}>
          Track shipment
        </button>
      </form>
    </Card>
  );
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  const result = ref ? await getShipmentWithEvents(ref) : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Track shipment</h1>
        <p className="max-w-2xl text-base text-muted">
          Enter your shipment reference number to see its current status and tracking history.
        </p>
      </header>

      <TrackForm defaultValue={ref} />

      {ref && !result ? (
        <p className="text-base text-muted">No shipment found for reference {ref}.</p>
      ) : null}

      {result ? (
        <div className="flex flex-col gap-comfortable">
          <Card>
            <div className="flex flex-col gap-cozy">
              <div className="flex items-center justify-between gap-cozy">
                <h2 className="font-mono text-lg font-semibold text-foreground">
                  {result.shipment.referenceNumber}
                </h2>
                <Badge variant={STATUS_BADGE_VARIANTS[result.shipment.status]}>
                  {STATUS_LABELS[result.shipment.status]}
                </Badge>
              </div>
              <dl className="grid grid-cols-1 gap-cozy sm:grid-cols-2">
                <div className="flex flex-col gap-tight">
                  <dt className="font-sans text-xs uppercase tracking-wide text-muted">Origin</dt>
                  <dd className="text-sm text-foreground">{result.shipment.origin ?? "—"}</dd>
                </div>
                <div className="flex flex-col gap-tight">
                  <dt className="font-sans text-xs uppercase tracking-wide text-muted">
                    Destination
                  </dt>
                  <dd className="text-sm text-foreground">{result.shipment.destination ?? "—"}</dd>
                </div>
                <div className="flex flex-col gap-tight">
                  <dt className="font-sans text-xs uppercase tracking-wide text-muted">
                    Transport mode
                  </dt>
                  <dd className="text-sm text-foreground capitalize">
                    {result.shipment.transportMode ?? "—"}
                  </dd>
                </div>
                {result.shipment.estimatedArrival ? (
                  <div className="flex flex-col gap-tight">
                    <dt className="font-sans text-xs uppercase tracking-wide text-muted">
                      Estimated arrival
                    </dt>
                    <dd className="text-sm text-foreground">
                      {formatDate(result.shipment.estimatedArrival)}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-cozy">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Tracking history
              </h3>
              {result.events.length > 0 ? (
                <ol className="flex flex-col gap-cozy">
                  {result.events.map((event, index) => (
                    <li
                      key={index}
                      className="flex flex-col gap-tight border-l-2 border-border pl-cozy"
                    >
                      <div className="flex flex-wrap items-center gap-tight">
                        <span className="font-sans text-sm font-medium text-foreground">
                          {EVENT_TYPE_LABELS[event.eventType]}
                        </span>
                        <span className="font-mono text-xs text-muted">
                          {formatDate(event.occurredAt)}
                        </span>
                      </div>
                      {event.location ? (
                        <span className="font-mono text-xs text-muted">{event.location}</span>
                      ) : null}
                      {event.description ? (
                        <p className="text-sm text-foreground">{event.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted">No tracking events yet.</p>
              )}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
