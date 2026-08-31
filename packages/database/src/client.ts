import { drizzle } from "drizzle-orm/neon-http";

import { requireEnv } from "./env";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    _db = drizzle(requireEnv("DATABASE_URL"), { schema });
  }
  return _db;
}
