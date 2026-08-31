import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb, schema } from "@freight/database";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
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
    .where(eq(schema.shipments.referenceNumber, reference))
    .limit(1);

  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
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

  // `id` is the internal PK — never expose it, referenceNumber is the
  // public lookup key.
  const { id, ...publicShipment } = shipment;
  void id;

  return NextResponse.json({ shipment: publicShipment, events });
}
