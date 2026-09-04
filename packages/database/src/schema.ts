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
  // Optional — a shipment can exist with no portal customer attached (e.g.
  // logged for a walk-in/offline booking). Cleared rather than blocked if
  // the customer record is ever removed.
  customerId: text("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
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
      .$type<"arrival" | "departure" | "status_change" | "milestone" | "exception">(),
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

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    shipmentId: integer("shipment_id")
      .notNull()
      // Same reasoning as trackingEvents.shipmentId — a document's audit
      // trail must never silently disappear if a shipment row is deleted.
      .references(() => shipments.id, { onDelete: "restrict" }),
    documentType: text("document_type")
      .notNull()
      .default("other")
      .$type<
        | "bill_of_lading"
        | "commercial_invoice"
        | "packing_list"
        | "customs_declaration"
        | "certificate_of_origin"
        | "other"
      >(),
    // Original uploaded filename, for display — not used to derive the blob
    // pathname (see blobPathname below).
    fileName: text("file_name").notNull(),
    // The Vercel Blob pathname — the source of truth for later get()/
    // presignUrl() calls. Deliberately not a stored full URL: private blob
    // URLs require a signed token to be useful anyway, so a bare URL column
    // would just be stale, misleading copy sitting next to the real thing.
    blobPathname: text("blob_pathname").notNull().unique(),
    contentType: text("content_type"),
    fileSizeBytes: integer("file_size_bytes"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Fast "all documents for this shipment" lookups — same rationale as
    // trackingEvents' index.
    index("documents_shipment_id_idx").on(table.shipmentId),
  ],
);

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),
    // Unlike shipments.customerId's onDelete: "set null" — a shipment can
    // meaningfully exist with no owning customer (a walk-in booking), but a
    // notification cannot: its entire reason to exist is being something a
    // specific customer sees. If that customer is gone, cascade it away
    // rather than leave an orphaned row or block the customer's deletion.
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    // Unlike trackingEvents.shipmentId's onDelete: "restrict" — trackingEvents
    // is an audit trail that must never silently vanish. Notifications are
    // an ephemeral read-state feed, not a record of truth: if a shipment
    // were ever deleted, its notifications should go with it, not block
    // the deletion.
    shipmentId: integer("shipment_id")
      .notNull()
      .references(() => shipments.id, { onDelete: "cascade" }),
    // No delete path exists for tracking events today, so this is a
    // correctness-not-urgency choice. "set null" (not "cascade" or
    // "restrict"): newStatus below already snapshots what happened
    // independently of this row, so the notification stays fully
    // meaningful without it — this FK is just a traceability pointer back
    // to the originating event, not load-bearing. Losing that pointer
    // shouldn't silently delete a customer's (possibly already-read)
    // notification, and an ephemeral read-state row is exactly the kind of
    // thing that must never block deleting an audit-trail row, the same
    // reasoning shipmentId above already applies one level up.
    trackingEventId: integer("tracking_event_id").references(() => trackingEvents.id, {
      onDelete: "set null",
    }),
    // Snapshot of what status this notification is about, captured at
    // generation time. Never read shipments.status live when rendering a
    // notification — it can keep advancing after this row was created, and
    // the notification must describe what happened at *that* moment.
    newStatus: text("new_status")
      .notNull()
      .$type<
        | "pending"
        | "in_transit"
        | "customs_clearance"
        | "out_for_delivery"
        | "delivered"
        | "delayed"
      >(),
    // null means unread.
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // "my notifications" lookups — same rationale as every other
    // customerId/shipmentId index in this schema.
    index("notifications_customer_id_idx").on(table.customerId),
  ],
);

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

// Public marketing content (the /locations directory) — deliberately no
// customerId/user linkage, unlike shipments. Not user data.
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  addressLine: text("address_line"),
  city: text("city"),
  country: text("country"),
  postcode: text("postcode"),
  phone: text("phone"),
  // Slugs from packages/ui/src/nav-data.ts's SERVICES — kept as plain text
  // here (not a Postgres enum) since that list is content the UI package
  // owns and can grow independently of a schema migration.
  services: text("services").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

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
