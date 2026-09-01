import { test, after } from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";

import { getDb } from "./client";
import * as schema from "./schema";
import {
  createShipment,
  createTrackingEvent,
  getShipmentForCustomer,
  listShipmentsForCustomer,
  searchCustomersByEmail,
} from "./queries";

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
const createdCustomerIds: string[] = [];

after(async () => {
  // Tracking events reference shipments with onDelete: "restrict", so
  // events must go first. Shipments go before customers so there's nothing
  // left pointing at a customer row when it's deleted (harmless either way,
  // since shipments.customerId is onDelete: "set null", but this keeps
  // cleanup order obviously correct rather than relying on that).
  for (const shipmentId of createdShipmentIds) {
    await db
      .delete(schema.trackingEvents)
      .where(eq(schema.trackingEvents.shipmentId, shipmentId));
    await db.delete(schema.shipments).where(eq(schema.shipments.id, shipmentId));
  }
  for (const customerId of createdCustomerIds) {
    await db.delete(schema.customers).where(eq(schema.customers.id, customerId));
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

test("createShipment with no customer selected succeeds with a null customerId", async () => {
  const created = await createShipment({
    origin: "Test Origin",
    destination: "Test Destination",
    transportMode: "air",
    estimatedArrival: null,
    customerId: null,
  });

  const [row] = await db
    .select({ id: schema.shipments.id, customerId: schema.shipments.customerId })
    .from(schema.shipments)
    .where(eq(schema.shipments.referenceNumber, created.referenceNumber))
    .limit(1);
  assert.ok(row);
  createdShipmentIds.push(row.id);

  assert.equal(row.customerId, null);
});

test("createShipment with a customer selected sets the FK correctly", async () => {
  // Transient fixture: this environment's `customers` table is empty (no
  // real portal sign-ins yet), so the only way to exercise the FK path is
  // to create a customer row here and tear it down in `after` — nothing
  // persists once the test run finishes.
  const [customer] = await db
    .insert(schema.customers)
    .values({ name: "Test Customer", email: "queries-test-customer@example.com" })
    .returning({ id: schema.customers.id });
  assert.ok(customer);
  createdCustomerIds.push(customer.id);

  const created = await createShipment({
    origin: "Test Origin",
    destination: "Test Destination",
    customerId: customer.id,
  });

  const [row] = await db
    .select({ id: schema.shipments.id, customerId: schema.shipments.customerId })
    .from(schema.shipments)
    .where(eq(schema.shipments.referenceNumber, created.referenceNumber))
    .limit(1);
  assert.ok(row);
  createdShipmentIds.push(row.id);

  assert.equal(row.customerId, customer.id);
});

test("searchCustomersByEmail finds a prefix match and excludes non-matches", async () => {
  const [customer] = await db
    .insert(schema.customers)
    .values({ name: "Searchable Customer", email: "search-target-customer@example.com" })
    .returning({ id: schema.customers.id });
  assert.ok(customer);
  createdCustomerIds.push(customer.id);

  const prefixMatches = await searchCustomersByEmail("search-target-customer@");
  assert.ok(prefixMatches.some((match) => match.id === customer.id));

  const nonMatches = await searchCustomersByEmail("no-such-customer-prefix@");
  assert.ok(!nonMatches.some((match) => match.id === customer.id));

  const emptyQueryMatches = await searchCustomersByEmail("   ");
  assert.deepEqual(emptyQueryMatches, []);
});

test("listShipmentsForCustomer and getShipmentForCustomer scope strictly to the caller's own customerId", async () => {
  // Transient fixtures again — see the comment on the FK test above.
  const [customerA] = await db
    .insert(schema.customers)
    .values({ name: "Customer A", email: "customer-a@example.com" })
    .returning({ id: schema.customers.id });
  const [customerB] = await db
    .insert(schema.customers)
    .values({ name: "Customer B", email: "customer-b@example.com" })
    .returning({ id: schema.customers.id });
  assert.ok(customerA);
  assert.ok(customerB);
  createdCustomerIds.push(customerA.id, customerB.id);

  const shipmentA = await createShipment({
    origin: "A Origin",
    destination: "A Destination",
    customerId: customerA.id,
  });
  const shipmentB = await createShipment({
    origin: "B Origin",
    destination: "B Destination",
    customerId: customerB.id,
  });

  const [rowA] = await db
    .select({ id: schema.shipments.id })
    .from(schema.shipments)
    .where(eq(schema.shipments.referenceNumber, shipmentA.referenceNumber))
    .limit(1);
  const [rowB] = await db
    .select({ id: schema.shipments.id })
    .from(schema.shipments)
    .where(eq(schema.shipments.referenceNumber, shipmentB.referenceNumber))
    .limit(1);
  assert.ok(rowA);
  assert.ok(rowB);
  createdShipmentIds.push(rowA.id, rowB.id);

  // A's list shows only A's shipment, never B's.
  const listForA = await listShipmentsForCustomer(customerA.id);
  assert.ok(listForA.some((s) => s.referenceNumber === shipmentA.referenceNumber));
  assert.ok(!listForA.some((s) => s.referenceNumber === shipmentB.referenceNumber));

  const listForB = await listShipmentsForCustomer(customerB.id);
  assert.ok(listForB.some((s) => s.referenceNumber === shipmentB.referenceNumber));
  assert.ok(!listForB.some((s) => s.referenceNumber === shipmentA.referenceNumber));

  // A can fetch A's own shipment by reference.
  const ownResult = await getShipmentForCustomer(customerA.id, shipmentA.referenceNumber);
  assert.ok(ownResult);
  assert.equal(ownResult.shipment.referenceNumber, shipmentA.referenceNumber);

  // A hitting B's reference gets null — same as a reference that doesn't
  // exist at all, so the caller can't distinguish the two cases.
  const crossCustomerResult = await getShipmentForCustomer(customerA.id, shipmentB.referenceNumber);
  const nonexistentResult = await getShipmentForCustomer(customerA.id, "NOSUCHREFERENCE1");
  assert.equal(crossCustomerResult, null);
  assert.equal(nonexistentResult, null);
  assert.deepEqual(crossCustomerResult, nonexistentResult);
});
