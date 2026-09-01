import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb, schema } from "@freight/database";
import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";

// Auth.js's default `session` callback only forwards name/email/image to the
// client — id is deliberately left off unless a callback re-adds it. Every
// customer-scoped query (listShipmentsForCustomer, getShipmentForCustomer)
// depends on session.user.id being customers.id, so this isn't optional.
declare module "next-auth" {
  // Declaration merging, not a new binding — eslint's base no-unused-vars
  // can't see the merge and misreads this as dead code.
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

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
  callbacks: {
    // Database sessions receive the full adapter user record, not a JWT —
    // `user.id` here is customers.id. Rebuilt to the same minimal shape
    // the default callback returns (rather than spreading the raw {
    // session, user } args), plus id — otherwise adapter-internal fields
    // like sessionToken/userId/emailVerified leak into the client-visible
    // session payload.
    session({ session, user }) {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        expires: session.expires,
      };
    },
  },
}));
