"use client";

import Link from "next/link";
import { Table } from "@freight/ui";
import type { Column } from "@freight/ui";
import type { CustomerWithShipmentCount } from "@freight/database";

// Table's render/rowKey props are functions, which can't cross the
// server/client boundary as serialized props — so the column config lives
// here, inside the client component, rather than in the server page above.
const columns: Column<CustomerWithShipmentCount>[] = [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <Link href={`/customers/${row.id}`} className="text-beacon hover:underline">
        {row.name ?? "—"}
      </Link>
    ),
  },
  {
    key: "email",
    header: "Email",
    type: "data",
    render: (row) => (
      <Link href={`/customers/${row.id}`} className="font-mono text-sm text-beacon hover:underline">
        {row.email ?? "—"}
      </Link>
    ),
  },
  {
    key: "shipmentCount",
    header: "Shipments",
    type: "data",
    align: "right",
    render: (row) => row.shipmentCount,
  },
];

export function CustomersTable({ customers }: { customers: CustomerWithShipmentCount[] }) {
  return (
    <Table
      columns={columns}
      data={customers}
      rowKey={(row) => row.id}
      caption="Customers"
      emptyState={<p className="text-sm text-muted">No customers yet.</p>}
    />
  );
}
