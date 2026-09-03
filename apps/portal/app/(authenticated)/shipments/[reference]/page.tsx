import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge, Card } from "@freight/ui";
import { getShipmentForCustomer } from "@freight/database";

import { auth } from "@/auth";
import { EVENT_TYPE_LABELS, STATUS_BADGE_VARIANTS, STATUS_LABELS, formatDate } from "@/lib/shipment-labels";

export const metadata: Metadata = {
  title: "Shipment | Freight Platform Portal",
};

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders, so session.user is guaranteed here.
  const session = await auth();
  const { reference } = await params;
  const result = await getShipmentForCustomer(session!.user.id, reference);

  // A reference that doesn't exist and one that belongs to someone else
  // must be indistinguishable — getShipmentForCustomer already returns
  // null for both, so this renders the exact same not-found state either
  // way, with no hint of which case it was.
  if (!result) {
    notFound();
  }

  const { shipment, events } = result;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Shipment</h1>
      </header>

      <Card>
        <div className="flex flex-col gap-cozy">
          <div className="flex items-center justify-between gap-cozy">
            <h2 className="font-mono text-lg font-semibold text-foreground">
              {shipment.referenceNumber}
            </h2>
            <Badge variant={STATUS_BADGE_VARIANTS[shipment.status]}>
              {STATUS_LABELS[shipment.status]}
            </Badge>
          </div>
          <dl className="grid grid-cols-1 gap-cozy sm:grid-cols-2">
            <div className="flex flex-col gap-tight">
              <dt className="font-sans text-xs uppercase tracking-wide text-muted">Origin</dt>
              <dd className="text-sm text-foreground">{shipment.origin ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-tight">
              <dt className="font-sans text-xs uppercase tracking-wide text-muted">Destination</dt>
              <dd className="text-sm text-foreground">{shipment.destination ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-tight">
              <dt className="font-sans text-xs uppercase tracking-wide text-muted">
                Transport mode
              </dt>
              <dd className="text-sm text-foreground capitalize">
                {shipment.transportMode ?? "—"}
              </dd>
            </div>
            {shipment.estimatedArrival ? (
              <div className="flex flex-col gap-tight">
                <dt className="font-sans text-xs uppercase tracking-wide text-muted">
                  Estimated arrival
                </dt>
                <dd className="text-sm text-foreground">{formatDate(shipment.estimatedArrival)}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-cozy">
          <h3 className="font-display text-lg font-semibold text-foreground">Tracking history</h3>
          {events.length > 0 ? (
            <ol className="flex flex-col gap-cozy">
              {events.map((event, index) => (
                <li key={index} className="flex flex-col gap-tight border-l-2 border-border pl-cozy">
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
  );
}
