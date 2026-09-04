CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"shipment_id" integer NOT NULL,
	"tracking_event_id" integer,
	"new_status" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tracking_event_id_tracking_events_id_fk" FOREIGN KEY ("tracking_event_id") REFERENCES "public"."tracking_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notifications_customer_id_idx" ON "notifications" USING btree ("customer_id");