/**
 * Placeholder Supabase client.
 *
 * There is no live Supabase project yet, so this file intentionally does
 * nothing beyond exporting a factory. Once a project exists:
 *   1. Run `supabase gen types typescript` and check the generated types
 *      into this package (e.g. `src/types.generated.ts`).
 *   2. Pass the real project URL / anon key (from env) to
 *      `createSupabaseClient` below, typed against those generated types.
 *   3. Wire NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY /
 *      SUPABASE_SERVICE_ROLE_KEY (see .env.example) into the apps that use it.
 */
import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient(url: string, anonKey: string) {
  return createClient(url, anonKey);
}
