import { and, arrayContains, asc, desc, eq, ilike, or } from "drizzle-orm";

import { getDb } from "./client";
import * as schema from "./schema";
import type { Document, Shipment } from "./schema";

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
 * Portal lookup for a customer's own shipment — like getShipmentWithEvents,
 * but the initial lookup matches on customerId AND referenceNumber
 * together, so a customer can never distinguish "doesn't exist" from
 * "exists but isn't yours": both return null from this one query, before
 * any tracking events are fetched.
 */
export async function getShipmentForCustomer(
  customerId: string,
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
    .where(
      and(
        eq(schema.shipments.customerId, customerId),
        eq(schema.shipments.referenceNumber, referenceNumber),
      ),
    )
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
 * A customer's own shipments, most-recently-updated first — the portal
 * equivalent of listShipments, scoped to customerId so one customer can
 * never see another's shipments in the list.
 */
export async function listShipmentsForCustomer(
  customerId: string,
): Promise<ShipmentSummary[]> {
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
    .where(eq(schema.shipments.customerId, customerId))
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

export interface CreateShipmentInput {
  origin?: string | null;
  destination?: string | null;
  transportMode?: "sea" | "air" | "road" | null;
  estimatedArrival?: Date | null;
  // Optional — a shipment can be created with no portal customer attached.
  customerId?: string | null;
}

/**
 * Creates a shipment for the admin "new shipment" form. referenceNumber and
 * status are never taken as input — referenceNumber comes from the schema's
 * $defaultFn (see ./ids.ts), status always starts at its "pending" default.
 */
export async function createShipment(
  input: CreateShipmentInput,
): Promise<{ referenceNumber: string }> {
  const db = getDb();

  const [shipment] = await db
    .insert(schema.shipments)
    .values({
      origin: input.origin ?? null,
      destination: input.destination ?? null,
      transportMode: input.transportMode ?? null,
      estimatedArrival: input.estimatedArrival ?? null,
      customerId: input.customerId ?? null,
    })
    .returning({ referenceNumber: schema.shipments.referenceNumber });

  // A single-row insert always returns exactly one row.
  return shipment!;
}

export interface CustomerSummary {
  id: string;
  name: string | null;
  email: string | null;
}

/**
 * Prefix match on email for the admin shipment-creation customer picker —
 * exact/prefix only, no fuzzy search needed for a small lookup like this.
 * Empty query returns no results rather than the whole customers table.
 */
export async function searchCustomersByEmail(
  emailPrefix: string,
): Promise<CustomerSummary[]> {
  const db = getDb();

  const trimmed = emailPrefix.trim();
  if (!trimmed) {
    return [];
  }

  return db
    .select({
      id: schema.customers.id,
      name: schema.customers.name,
      email: schema.customers.email,
    })
    .from(schema.customers)
    .where(ilike(schema.customers.email, `${trimmed}%`))
    .orderBy(asc(schema.customers.email))
    .limit(10);
}

export interface SearchLocationsFilters {
  country?: string;
  city?: string;
  postcode?: string;
  /** A single services slug — see packages/ui/src/nav-data.ts's SERVICES. */
  service?: string;
}

export interface LocationSummary {
  id: number;
  name: string;
  addressLine: string | null;
  city: string | null;
  country: string | null;
  postcode: string | null;
  phone: string | null;
  services: string[];
}

/**
 * Filtered lookup for the public /locations directory. Every provided
 * filter combines with AND — country+service narrows to offices in that
 * country that also offer that service, not either condition alone.
 * country/city/postcode are prefix matches (same ilike pattern as
 * searchCustomersByEmail); service matches offices whose services array
 * contains that exact slug. No filters provided returns [] rather than the
 * whole table — same empty-guard principle as searchCustomersByEmail, so a
 * bare page load doesn't dump every location.
 */
export async function searchLocations(
  filters: SearchLocationsFilters,
): Promise<LocationSummary[]> {
  const db = getDb();

  const conditions = [];

  const country = filters.country?.trim();
  if (country) {
    conditions.push(ilike(schema.locations.country, `${country}%`));
  }

  const city = filters.city?.trim();
  if (city) {
    conditions.push(ilike(schema.locations.city, `${city}%`));
  }

  const postcode = filters.postcode?.trim();
  if (postcode) {
    conditions.push(ilike(schema.locations.postcode, `${postcode}%`));
  }

  const service = filters.service?.trim();
  if (service) {
    conditions.push(arrayContains(schema.locations.services, [service]));
  }

  if (conditions.length === 0) {
    return [];
  }

  return db
    .select({
      id: schema.locations.id,
      name: schema.locations.name,
      addressLine: schema.locations.addressLine,
      city: schema.locations.city,
      country: schema.locations.country,
      postcode: schema.locations.postcode,
      phone: schema.locations.phone,
      services: schema.locations.services,
    })
    .from(schema.locations)
    .where(and(...conditions))
    .orderBy(asc(schema.locations.name));
}

/**
 * Free-text lookup for the public /search page — distinct from
 * searchLocations' structured filters, which AND every provided field
 * together. Here there's a single box, so the right semantics are OR: a
 * location matches if the term appears anywhere in name, city, country, or
 * postcode. Contains match (not prefix), same empty-guard principle as
 * searchLocations/searchCustomersByEmail, capped at 10 results.
 */
export async function searchLocationsByText(term: string): Promise<LocationSummary[]> {
  const db = getDb();

  const trimmed = term.trim();
  if (!trimmed) {
    return [];
  }

  const pattern = `%${trimmed}%`;

  return db
    .select({
      id: schema.locations.id,
      name: schema.locations.name,
      addressLine: schema.locations.addressLine,
      city: schema.locations.city,
      country: schema.locations.country,
      postcode: schema.locations.postcode,
      phone: schema.locations.phone,
      services: schema.locations.services,
    })
    .from(schema.locations)
    .where(
      or(
        ilike(schema.locations.name, pattern),
        ilike(schema.locations.city, pattern),
        ilike(schema.locations.country, pattern),
        ilike(schema.locations.postcode, pattern),
      ),
    )
    .orderBy(asc(schema.locations.name))
    .limit(10);
}

export interface DocumentSummary {
  id: number;
  documentType: Document["documentType"];
  fileName: string;
  contentType: string | null;
  fileSizeBytes: number | null;
  uploadedAt: Date;
}

/**
 * All documents for a shipment, most-recently-uploaded first — admin sees
 * everything, no customer scoping, same as listShipments. blobPathname is
 * deliberately left out of this shape: the page never needs it directly,
 * only a documentId to hand to getDocumentDownloadUrl/deleteShipmentDocument
 * in ./storage, which look it up themselves.
 */
export async function listDocumentsForShipment(shipmentId: number): Promise<DocumentSummary[]> {
  const db = getDb();

  return db
    .select({
      id: schema.documents.id,
      documentType: schema.documents.documentType,
      fileName: schema.documents.fileName,
      contentType: schema.documents.contentType,
      fileSizeBytes: schema.documents.fileSizeBytes,
      uploadedAt: schema.documents.uploadedAt,
    })
    .from(schema.documents)
    .where(eq(schema.documents.shipmentId, shipmentId))
    .orderBy(desc(schema.documents.uploadedAt));
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
