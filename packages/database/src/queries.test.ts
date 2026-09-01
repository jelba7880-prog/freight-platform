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
  searchLocations,
  searchLocationsByText,
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
const createdLocationIds: number[] = [];

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
  for (const locationId of createdLocationIds) {
    await db.delete(schema.locations).where(eq(schema.locations.id, locationId));
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

test("searchLocations with no filters returns nothing", async () => {
  const results = await searchLocations({});
  assert.deepEqual(results, []);

  const whitespaceOnly = await searchLocations({ country: "  ", city: "  " });
  assert.deepEqual(whitespaceOnly, []);
});

test("searchLocations narrows by each filter type in isolation, and combines two with AND not OR", async () => {
  // Fixture: two offices sharing a country, but differing on city/postcode/
  // service, so each filter's isolation and the AND-vs-OR case can both be
  // proven from the same two rows.
  const [officeX] = await db
    .insert(schema.locations)
    .values({
      name: "Fixture Office X",
      addressLine: "1 Fixture Street",
      city: "Fixtureville",
      country: "Fixtureland",
      postcode: "FX100",
      phone: "+1 555 0100",
      services: ["sea-freight"],
    })
    .returning({ id: schema.locations.id });
  const [officeY] = await db
    .insert(schema.locations)
    .values({
      name: "Fixture Office Y",
      addressLine: "2 Fixture Avenue",
      city: "Othertown",
      country: "Fixtureland",
      postcode: "OT200",
      phone: "+1 555 0200",
      services: ["air-freight"],
    })
    .returning({ id: schema.locations.id });
  assert.ok(officeX);
  assert.ok(officeY);
  createdLocationIds.push(officeX.id, officeY.id);

  // country narrows to both (prefix match, shared country).
  const byCountry = await searchLocations({ country: "Fixturel" });
  assert.ok(byCountry.some((l) => l.id === officeX.id));
  assert.ok(byCountry.some((l) => l.id === officeY.id));

  // city narrows to X only.
  const byCity = await searchLocations({ city: "Fixturev" });
  assert.ok(byCity.some((l) => l.id === officeX.id));
  assert.ok(!byCity.some((l) => l.id === officeY.id));

  // postcode narrows to Y only.
  const byPostcode = await searchLocations({ postcode: "OT2" });
  assert.ok(byPostcode.some((l) => l.id === officeY.id));
  assert.ok(!byPostcode.some((l) => l.id === officeX.id));

  // service narrows to X only.
  const byService = await searchLocations({ service: "sea-freight" });
  assert.ok(byService.some((l) => l.id === officeX.id));
  assert.ok(!byService.some((l) => l.id === officeY.id));

  // Combining country (matches both) + service (matches only X) must apply
  // AND: only X comes back, not Y — if this were OR, Y would appear too
  // since it matches the country filter on its own.
  const combined = await searchLocations({ country: "Fixturel", service: "sea-freight" });
  assert.ok(combined.some((l) => l.id === officeX.id));
  assert.ok(!combined.some((l) => l.id === officeY.id));
});

test("searchLocationsByText matches on each field individually and combines with OR, not AND", async () => {
  // Fixture: two offices with nothing in common except a shared, unique
  // token in the name — every other field is distinct, so each field's
  // match can be proven in isolation, and the OR-vs-AND case is proven by a
  // term that matches office P only via city and office Q only via
  // country: an AND semantics (like searchLocations') would return neither.
  const [officeP] = await db
    .insert(schema.locations)
    .values({
      name: "Freetext Office Pxyzzy",
      addressLine: "1 Freetext Street",
      city: "Quuxborough",
      country: "Wibbleland",
      postcode: "FT100",
      phone: "+1 555 0300",
      services: [],
    })
    .returning({ id: schema.locations.id });
  const [officeQ] = await db
    .insert(schema.locations)
    .values({
      name: "Freetext Office Qxyzzy",
      addressLine: "2 Freetext Avenue",
      city: "Wobbleburg",
      country: "Quuxania",
      postcode: "FT200",
      phone: "+1 555 0400",
      services: [],
    })
    .returning({ id: schema.locations.id });
  assert.ok(officeP);
  assert.ok(officeQ);
  createdLocationIds.push(officeP.id, officeQ.id);

  const byName = await searchLocationsByText("xyzzy");
  assert.ok(byName.some((l) => l.id === officeP.id));
  assert.ok(byName.some((l) => l.id === officeQ.id));

  const byCity = await searchLocationsByText("Quuxborough");
  assert.ok(byCity.some((l) => l.id === officeP.id));
  assert.ok(!byCity.some((l) => l.id === officeQ.id));

  const byCountry = await searchLocationsByText("Wibbleland");
  assert.ok(byCountry.some((l) => l.id === officeP.id));
  assert.ok(!byCountry.some((l) => l.id === officeQ.id));

  const byPostcode = await searchLocationsByText("FT200");
  assert.ok(byPostcode.some((l) => l.id === officeQ.id));
  assert.ok(!byPostcode.some((l) => l.id === officeP.id));

  // "quux" matches office P only via its city ("Quuxborough") and office Q
  // only via its country ("Quuxania") — no field matches both rows. OR
  // semantics returns both; AND semantics (like searchLocations') would
  // return neither, since no single field on either row satisfies more
  // than one condition.
  const orMatch = await searchLocationsByText("quux");
  assert.ok(orMatch.some((l) => l.id === officeP.id));
  assert.ok(orMatch.some((l) => l.id === officeQ.id));

  const emptyQueryMatches = await searchLocationsByText("   ");
  assert.deepEqual(emptyQueryMatches, []);
});
