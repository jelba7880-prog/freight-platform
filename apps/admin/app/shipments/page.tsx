import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Card } from "@freight/ui";
import { listShipments } from "@freight/database";

import { auth } from "@/auth";
import { ShipmentsTable } from "./ShipmentsTable";

export const metadata: Metadata = {
  title: "Shipments | Freight Platform Admin",
};

export default async function ShipmentsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const shipments = await listShipments();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Shipments</h1>
        <p className="text-base text-muted">All shipments, most recently updated first.</p>
      </header>

      <Card>
        <ShipmentsTable shipments={shipments} />
      </Card>
    </div>
  );
}
