import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb, schema } from "@freight/database";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  // Auth.js falls back to AUTH_SECRET when `secret` is unset — set it
  // explicitly so admin sessions never end up signed with the portal's
  // secret in an environment where both are present.
  secret: process.env.AUTH_ADMIN_SECRET,
  adapter: DrizzleAdapter(getDb(), {
    usersTable: schema.staff,
    accountsTable: schema.staffAccounts,
    sessionsTable: schema.staffSessions,
    verificationTokensTable: schema.staffVerificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_ADMIN_GOOGLE_ID,
      clientSecret: process.env.AUTH_ADMIN_GOOGLE_SECRET,
    }),
  ],
  // Explicit rather than relying on the adapter-present default, so the
  // strategy stays database-backed even if providers change later.
  session: { strategy: "database" },
  callbacks: {
    // Reject the sign-in outright — not just hiding UI afterward — for
    // any Google account outside the company Workspace domain.
    async signIn({ profile }) {
      return profile?.hd === process.env.AUTH_ADMIN_ALLOWED_DOMAIN;
    },
  },
}));
