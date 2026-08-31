#!/usr/bin/env node
// Throwaway insert/read-back check against the `health_check` table.
// Confirms DATABASE_URL is reachable and the 0000 migration has been applied.
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("[verify] Missing DATABASE_URL");
  process.exit(1);
}

const sql = neon(databaseUrl);

const [inserted] = await sql`
  insert into health_check default values returning id, checked_at
`;
console.log("[verify] inserted row:", inserted);

const [readBack] = await sql`
  select id, checked_at from health_check where id = ${inserted.id}
`;

if (!readBack || readBack.id !== inserted.id) {
  console.error("[verify] read-back mismatch:", readBack);
  process.exit(1);
}

console.log("[verify] read back row:", readBack);
console.log("[verify] OK — migration applied and DB round-trip succeeded");
