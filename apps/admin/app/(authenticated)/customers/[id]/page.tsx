import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@freight/ui";
import { getCustomerById, listShipmentsForCustomer } from "@freight/database";

import { ShipmentsTable } from "../../shipments/ShipmentsTable";

export const metadata: Metadata = {
  title: "Customer | Freight Platform Admin",
};

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders.
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  const shipments = await listShipmentsForCustomer(customer.id);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {customer.name ?? "—"}
        </h1>
        <p className="font-mono text-sm text-muted">{customer.email ?? "—"}</p>
      </header>

      <Card>
        <ShipmentsTable shipments={shipments} />
      </Card>
    </div>
  );
}
