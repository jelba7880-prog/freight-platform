CREATE TABLE "shipments" (
	"id" serial PRIMARY KEY NOT NULL,
	"reference_number" text NOT NULL,
	"origin" text,
	"destination" text,
	"transport_mode" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"estimated_arrival" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipments_reference_number_unique" UNIQUE("reference_number")
);
--> statement-breakpoint
CREATE TABLE "tracking_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_id" integer NOT NULL,
	"event_type" text NOT NULL,
	"location" text,
	"description" text,
	"occurred_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tracking_events_shipment_id_idx" ON "tracking_events" USING btree ("shipment_id");