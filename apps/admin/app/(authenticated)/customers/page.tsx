import type { Metadata } from "next";
import { Card } from "@freight/ui";
import { listCustomersWithShipmentCounts } from "@freight/database";

import { CustomersTable } from "./CustomersTable";

export const metadata: Metadata = {
  title: "Customers | Freight Platform Admin",
};

export default async function CustomersPage() {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders.
  const customers = await listCustomersWithShipmentCounts();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Customers</h1>
        <p className="text-base text-muted">All customers, alphabetical by email.</p>
      </header>

      <Card>
        <CustomersTable customers={customers} />
      </Card>
    </div>
  );
}
