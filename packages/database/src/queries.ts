import { asc, desc, eq } from "drizzle-orm";

import { getDb } from "./client";
import * as schema from "./schema";
import type { Shipment } from "./schema";

export interface ShipmentWithEvents {
  shipment: {
    referenceNumber: string;
    origin: string | null;
    destination: string | null;
    transportMode: "sea" | "air" | "road" | null;
    status:
      | "pending"
      | "in_transit"
      | "customs_clearance"
      | "out_for_delivery"
      | "delivered"
      | "delayed";
    estimatedArrival: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  events: {
    eventType: "arrival" | "departure" | "status_change" | "milestone" | "exception";
    location: string | null;
    description: string | null;
    occurredAt: Date;
    createdAt: Date;
  }[];
}

export interface ShipmentSummary {
  referenceNumber: string;
  origin: string | null;
  destination: string | null;
  transportMode: "sea" | "air" | "road" | null;
  status: Shipment["status"];
  updatedAt: Date;
}

/**
 * Public tracking lookup by `referenceNumber` — shared by the `/api/track`
 * route and the `/track` page so both stay behind the exact same query.
 * Internal `id` is stripped from the returned shipment: referenceNumber is
 * the public lookup key, `id` must never leak.
 */
export async function getShipmentWithEvents(
  referenceNumber: string,
): Promise<ShipmentWithEvents | null> {
  const db = getDb();

  const [shipment] = await db
    .select({
      id: schema.shipments.id,
      referenceNumber: schema.shipments.referenceNumber,
      origin: schema.shipments.origin,
      destination: schema.shipments.destination,
      transportMode: schema.shipments.transportMode,
      status: schema.shipments.status,
      estimatedArrival: schema.shipments.estimatedArrival,
      createdAt: schema.shipments.createdAt,
      updatedAt: schema.shipments.updatedAt,
    })
    .from(schema.shipments)
    .where(eq(schema.shipments.referenceNumber, referenceNumber))
    .limit(1);

  if (!shipment) {
    return null;
  }

  const events = await db
    .select({
      eventType: schema.trackingEvents.eventType,
      location: schema.trackingEvents.location,
      description: schema.trackingEvents.description,
      occurredAt: schema.trackingEvents.occurredAt,
      createdAt: schema.trackingEvents.createdAt,
    })
    .from(schema.trackingEvents)
    .where(eq(schema.trackingEvents.shipmentId, shipment.id))
    .orderBy(asc(schema.trackingEvents.occurredAt));

  const { id, ...publicShipment } = shipment;
  void id;

  return { shipment: publicShipment, events };
}

/**
 * All shipments, most-recently-updated first — for the admin list view.
 * Deliberately light (no joined tracking events): the detail page is where
 * event history is fetched, via getShipmentWithEvents.
 */
export async function listShipments(): Promise<ShipmentSummary[]> {
  const db = getDb();

  return db
    .select({
      referenceNumber: schema.shipments.referenceNumber,
      origin: schema.shipments.origin,
      destination: schema.shipments.destination,
      transportMode: schema.shipments.transportMode,
      status: schema.shipments.status,
      updatedAt: schema.shipments.updatedAt,
    })
    .from(schema.shipments)
    .orderBy(desc(schema.shipments.updatedAt));
}

/**
 * Resolves the public referenceNumber to the internal id, for admin
 * mutations (createTrackingEvent) that need the FK but only ever see the
 * reference number from the URL — the same id-never-leaves-the-server
 * boundary getShipmentWithEvents enforces for reads.
 */
export async function getShipmentIdByReference(
  referenceNumber: string,
): Promise<number | null> {
  const db = getDb();

  const [shipment] = await db
    .select({ id: schema.shipments.id })
    .from(schema.shipments)
    .where(eq(schema.shipments.referenceNumber, referenceNumber))
    .limit(1);

  return shipment?.id ?? null;
}

export interface CreateTrackingEventInput {
  shipmentId: number;
  eventType: "arrival" | "departure" | "status_change" | "milestone" | "exception";
  location?: string | null;
  description?: string | null;
  occurredAt: Date;
}

// Fixed forward progression a real shipment's status moves through.
// "delayed" is a side branch, not a step in it — a delayed shipment stays
// delayed until someone clears it explicitly, logging more movement events
// doesn't do that on its own. "delivered" is the end of the line.
const NEXT_STATUS: Record<Shipment["status"], Shipment["status"]> = {
  pending: "in_transit",
  in_transit: "customs_clearance",
  customs_clearance: "out_for_delivery",
  out_for_delivery: "delivered",
  delivered: "delivered",
  delayed: "delayed",
};

// arrival/departure are granular location history — a shipment can log many
// of them at intermediate stops without ever changing stage — and
// milestone/exception annotate the journey without asserting a new status.
// Only status_change is the admin's explicit declaration that the shipment
// has moved to its next stage, so it's the sole event type that advances
// shipments.status.
const STATUS_ADVANCING_EVENT_TYPES = new Set<CreateTrackingEventInput["eventType"]>([
  "status_change",
]);

function advanceStatus(current: Shipment["status"]): Shipment["status"] {
  return NEXT_STATUS[current];
}

/**
 * Logs a tracking event and, only when it's a status_change, advances the
 * parent shipment's status and updatedAt in the same call. arrival/departure/
 * milestone/exception are logged as pure history with no side effect on
 * shipments.status — that field only moves on the admin's explicit
 * status_change declaration.
 */
export async function createTrackingEvent(
  input: CreateTrackingEventInput,
): Promise<void> {
  const db = getDb();

  await db.insert(schema.trackingEvents).values({
    shipmentId: input.shipmentId,
    eventType: input.eventType,
    location: input.location ?? null,
    description: input.description ?? null,
    occurredAt: input.occurredAt,
  });

  if (!STATUS_ADVANCING_EVENT_TYPES.has(input.eventType)) {
    return;
  }

  const [shipment] = await db
    .select({ status: schema.shipments.status })
    .from(schema.shipments)
    .where(eq(schema.shipments.id, input.shipmentId))
    .limit(1);

  if (!shipment) {
    return;
  }

  const nextStatus = advanceStatus(shipment.status);
  if (nextStatus === shipment.status) {
    return;
  }

  await db
    .update(schema.shipments)
    .set({ status: nextStatus, updatedAt: new Date() })
    .where(eq(schema.shipments.id, input.shipmentId));
}
