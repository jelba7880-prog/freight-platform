#!/usr/bin/env node
// Throwaway seed: one shipment + a few tracking events, for exercising the
// GET /api/track/[reference] route end to end. Not part of the app.
import { randomBytes } from "node:crypto";

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("[seed-shipment] Missing DATABASE_URL");
  process.exit(1);
}

const sql = neon(databaseUrl);

// Mirrors src/ids.ts's generateReferenceNumber — this script goes through
// @neondatabase/serverless directly (like verify.mjs), so Drizzle's
// $defaultFn never runs and the reference number has to be supplied here.
const REFERENCE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function generateReferenceNumber() {
  const bytes = randomBytes(12);
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += REFERENCE_ALPHABET[bytes[i] % REFERENCE_ALPHABET.length];
  }
  return code;
}

const referenceNumber = generateReferenceNumber();

const [shipment] = await sql`
  insert into shipments (reference_number, origin, destination, transport_mode, status, estimated_arrival)
  values (${referenceNumber}, 'Shanghai, CN', 'Rotterdam, NL', 'sea', 'in_transit', now() + interval '9 days')
  returning id, reference_number
`;
console.log("[seed-shipment] inserted shipment:", shipment);

await sql`
  insert into tracking_events (shipment_id, event_type, location, description, occurred_at)
  values
    (${shipment.id}, 'status_change', 'Shanghai, CN', 'Booking confirmed', now() - interval '5 days'),
    (${shipment.id}, 'milestone', 'Shanghai, CN', 'Departed origin port', now() - interval '4 days'),
    (${shipment.id}, 'milestone', 'Singapore, SG', 'Transshipment complete', now() - interval '1 days')
`;
console.log("[seed-shipment] inserted 3 tracking events");
console.log("[seed-shipment] reference number:", shipment.reference_number);
