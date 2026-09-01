import { asc, eq } from "drizzle-orm";

import { getDb } from "./client";
import * as schema from "./schema";

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
    eventType: "status_change" | "milestone" | "exception";
    location: string | null;
    description: string | null;
    occurredAt: Date;
    createdAt: Date;
  }[];
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
