import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { generateReferenceNumber } from "./ids";

export const healthCheck = pgTable("health_check", {
  id: serial("id").primaryKey(),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type HealthCheck = typeof healthCheck.$inferSelect;
export type NewHealthCheck = typeof healthCheck.$inferInsert;

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  // Public lookup key — never derive this from `id`, see ./ids.ts.
  referenceNumber: text("reference_number")
    .notNull()
    .unique()
    .$defaultFn(generateReferenceNumber),
  origin: text("origin"),
  destination: text("destination"),
  // Physical mode the shipment travels by — distinct from the marketing
  // service categories in packages/ui/src/nav-data.ts.
  transportMode: text("transport_mode").$type<"sea" | "air" | "road">(),
  status: text("status")
    .notNull()
    .default("pending")
    .$type<
      | "pending"
      | "in_transit"
      | "customs_clearance"
      | "out_for_delivery"
      | "delivered"
      | "delayed"
    >(),
  estimatedArrival: timestamp("estimated_arrival", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;

export const trackingEvents = pgTable(
  "tracking_events",
  {
    id: serial("id").primaryKey(),
    shipmentId: integer("shipment_id")
      .notNull()
      // Tracking history must never silently disappear if a shipment row
      // is ever deleted.
      .references(() => shipments.id, { onDelete: "restrict" }),
    eventType: text("event_type")
      .notNull()
      .$type<"status_change" | "milestone" | "exception">(),
    location: text("location"),
    // Human-readable milestone text ops staff write.
    description: text("description"),
    // When the event happened, as authored — may be backdated.
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    // When the record was actually inserted, kept distinct from occurredAt.
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Fast "all events for this shipment, ordered by occurredAt" lookups —
    // the exact query both public and portal tracking need.
    index("tracking_events_shipment_id_idx").on(table.shipmentId),
  ],
);

export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type NewTrackingEvent = typeof trackingEvents.$inferInsert;
