import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Badge, Card, Input, buttonClassName } from "@freight/ui";
import { getShipmentWithEvents } from "@freight/database";

import { auth } from "@/auth";
import { EVENT_TYPE_LABELS, STATUS_BADGE_VARIANTS, STATUS_LABELS, formatDate } from "@/lib/shipment-labels";
import { logTrackingEvent } from "./actions";

export const metadata: Metadata = {
  title: "Shipment | Freight Platform Admin",
};

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const { reference } = await params;
  const result = await getShipmentWithEvents(reference);

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

      <Card>
        <div className="flex flex-col gap-cozy">
          <h3 className="font-display text-lg font-semibold text-foreground">Log a new event</h3>
          <form action={logTrackingEvent} className="flex flex-col gap-cozy">
            <input type="hidden" name="referenceNumber" value={shipment.referenceNumber} />

            <div className="flex flex-col gap-tight">
              <label htmlFor="eventType" className="font-sans text-sm font-medium text-foreground">
                Event type
              </label>
              <select
                id="eventType"
                name="eventType"
                required
                defaultValue="milestone"
                className="h-10 rounded-sm border border-border bg-surface px-cozy font-sans text-sm text-foreground transition-colors duration-base ease-standard focus:border-beacon"
              >
                {(Object.keys(EVENT_TYPE_LABELS) as (keyof typeof EVENT_TYPE_LABELS)[]).map(
                  (eventType) => (
                    <option key={eventType} value={eventType}>
                      {EVENT_TYPE_LABELS[eventType]}
                    </option>
                  ),
                )}
              </select>
            </div>

            <Input id="location" name="location" label="Location" placeholder="e.g. Singapore, SG" />

            <div className="flex flex-col gap-tight">
              <label htmlFor="description" className="font-sans text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="e.g. Departed origin port"
                className="rounded-sm border border-border bg-surface px-cozy py-snug font-sans text-sm text-foreground placeholder:text-muted transition-colors duration-base ease-standard focus:border-beacon"
              />
            </div>

            <Input
              id="occurredAt"
              name="occurredAt"
              type="datetime-local"
              label="Occurred at"
              required
            />

            <button type="submit" className={buttonClassName("primary", "md")}>
              Log event
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
