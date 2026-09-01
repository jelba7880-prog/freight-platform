import {
  index,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { randomUUID } from "node:crypto";

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

// Auth.js (@auth/drizzle-adapter) tables. Column shapes match the
// adapter's Postgres defaults exactly — only the physical table names are
// customer-portal-specific — so `DrizzleAdapter(getDb(), { usersTable:
// customers, ... })` in apps/portal/auth.ts works unmodified.
export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export const customerAccounts = pgTable(
  "customer_accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ],
);

export type CustomerAccount = typeof customerAccounts.$inferSelect;
export type NewCustomerAccount = typeof customerAccounts.$inferInsert;

export const customerSessions = pgTable("customer_sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type CustomerSession = typeof customerSessions.$inferSelect;
export type NewCustomerSession = typeof customerSessions.$inferInsert;

export const customerVerificationTokens = pgTable(
  "customer_verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

export type CustomerVerificationToken =
  typeof customerVerificationTokens.$inferSelect;
export type NewCustomerVerificationToken =
  typeof customerVerificationTokens.$inferInsert;

// Same Auth.js shape as the customer tables above, staff-prefixed for
// apps/admin/auth.ts — this is exactly why the generic Auth.js table names
// were reserved rather than reused.
export const staff = pgTable("staff", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;

export const staffAccounts = pgTable(
  "staff_accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => staff.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ],
);

export type StaffAccount = typeof staffAccounts.$inferSelect;
export type NewStaffAccount = typeof staffAccounts.$inferInsert;

export const staffSessions = pgTable("staff_sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => staff.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export type StaffSession = typeof staffSessions.$inferSelect;
export type NewStaffSession = typeof staffSessions.$inferInsert;

export const staffVerificationTokens = pgTable(
  "staff_verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })],
);

export type StaffVerificationToken =
  typeof staffVerificationTokens.$inferSelect;
export type NewStaffVerificationToken =
  typeof staffVerificationTokens.$inferInsert;
