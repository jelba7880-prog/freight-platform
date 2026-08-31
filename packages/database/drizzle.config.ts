import { defineConfig } from "drizzle-kit";

import { requireEnv } from "./src/env";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Schema migrations need a direct connection — running DDL through the
    // pooler is a known source of intermittent failures.
    url: requireEnv("DATABASE_URL_UNPOOLED"),
  },
});
