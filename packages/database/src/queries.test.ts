import { test, after } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";

import { getDb } from "./client";
import * as schema from "./schema";
import { createTrackingEvent } from "./queries";

const db = getDb();

async function makeShipment() {
  const [shipment] = await db
    .insert(schema.shipments)
    .values({ origin: "Test Origin", destination: "Test Destination" })
    .returning({ id: schema.shipments.id, status: schema.shipments.status });
  assert.ok(shipment);
  return shipment;
}

async function statusOf(shipmentId: number) {
  const [row] = await db
    .select({ status: schema.shipments.status })
    .from(schema.shipments)
    .where(eq(schema.shipments.id, shipmentId))
    .limit(1);
  return row?.status;
}

const createdShipmentIds: number[] = [];

after(async () => {
  // Tracking events reference shipments with onDelete: "restrict", so
  // events must go first.
  for (const shipmentId of createdShipmentIds) {
    await db
      .delete(schema.trackingEvents)
      .where(eq(schema.trackingEvents.shipmentId, shipmentId));
    await db.delete(schema.shipments).where(eq(schema.shipments.id, shipmentId));
  }
});

test("arrival then departure at an intermediate stop leaves status unchanged", async () => {
  const shipment = await makeShipment();
  createdShipmentIds.push(shipment.id);
  assert.equal(shipment.status, "pending");

  await createTrackingEvent({
    shipmentId: shipment.id,
    eventType: "arrival",
    location: "Intermediate Port",
    occurredAt: new Date(),
  });
  await createTrackingEvent({
    shipmentId: shipment.id,
    eventType: "departure",
    location: "Intermediate Port",
    occurredAt: new Date(),
  });

  assert.equal(await statusOf(shipment.id), "pending");
});

test("status_change advances status by exactly one stage", async () => {
  const shipment = await makeShipment();
  createdShipmentIds.push(shipment.id);
  assert.equal(shipment.status, "pending");

  await createTrackingEvent({
    shipmentId: shipment.id,
    eventType: "status_change",
    description: "Departed origin",
    occurredAt: new Date(),
  });
  assert.equal(await statusOf(shipment.id), "in_transit");

  await createTrackingEvent({
    shipmentId: shipment.id,
    eventType: "status_change",
    description: "Cleared customs",
    occurredAt: new Date(),
  });
  assert.equal(await statusOf(shipment.id), "customs_clearance");
});

test("milestone and exception events leave status unchanged", async () => {
  const shipment = await makeShipment();
  createdShipmentIds.push(shipment.id);
  assert.equal(shipment.status, "pending");

  await createTrackingEvent({
    shipmentId: shipment.id,
    eventType: "milestone",
    description: "Documents received",
    occurredAt: new Date(),
  });
  await createTrackingEvent({
    shipmentId: shipment.id,
    eventType: "exception",
    description: "Weather delay noted",
    occurredAt: new Date(),
  });

  assert.equal(await statusOf(shipment.id), "pending");
});
