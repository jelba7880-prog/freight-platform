import type { Metadata } from "next";
import { Card } from "@freight/ui";
import { listShipmentsForCustomer } from "@freight/database";

import { auth } from "@/auth";
import { ShipmentsTable } from "./ShipmentsTable";

export const metadata: Metadata = {
  title: "My shipments | Freight Platform Portal",
};

export default async function ShipmentsPage() {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders, so session.user is guaranteed here.
  const session = await auth();
  const shipments = await listShipmentsForCustomer(session!.user.id);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">My shipments</h1>
        <p className="text-base text-muted">Your shipments, most recently updated first.</p>
      </header>

      <Card>
        <ShipmentsTable shipments={shipments} />
      </Card>
    </div>
  );
}
