CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"shipment_id" integer NOT NULL,
	"document_type" text DEFAULT 'other' NOT NULL,
	"file_name" text NOT NULL,
	"blob_pathname" text NOT NULL,
	"content_type" text,
	"file_size_bytes" integer,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documents_blob_pathname_unique" UNIQUE("blob_pathname")
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "documents_shipment_id_idx" ON "documents" USING btree ("shipment_id");