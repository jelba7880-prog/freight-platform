import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb, schema } from "@freight/database";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: schema.customers,
    accountsTable: schema.customerAccounts,
    sessionsTable: schema.customerSessions,
    verificationTokensTable: schema.customerVerificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // Explicit rather than relying on the adapter-present default, so the
  // strategy stays database-backed even if providers change later.
  session: { strategy: "database" },
}));
