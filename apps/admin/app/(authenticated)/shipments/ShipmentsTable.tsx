"use client";

import Link from "next/link";
import { Badge, Table } from "@freight/ui";
import type { Column } from "@freight/ui";
import type { ShipmentSummary } from "@freight/database";

import { STATUS_BADGE_VARIANTS, STATUS_LABELS } from "@/lib/shipment-labels";

// Table's render/rowKey props are functions, which can't cross the
// server/client boundary as serialized props — so the column config lives
// here, inside the client component, rather than in the server page above.
const columns: Column<ShipmentSummary>[] = [
  {
    key: "referenceNumber",
    header: "Reference",
    type: "data",
    render: (row) => (
      <Link
        href={`/shipments/${row.referenceNumber}`}
        className="font-mono text-sm text-beacon hover:underline"
      >
        {row.referenceNumber}
      </Link>
    ),
  },
  {
    key: "route",
    header: "Origin → Destination",
    render: (row) => `${row.origin ?? "—"} → ${row.destination ?? "—"}`,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <Badge variant={STATUS_BADGE_VARIANTS[row.status]}>{STATUS_LABELS[row.status]}</Badge>
    ),
  },
  {
    key: "transportMode",
    header: "Mode",
    render: (row) => <span className="capitalize">{row.transportMode ?? "—"}</span>,
  },
];

export function ShipmentsTable({ shipments }: { shipments: ShipmentSummary[] }) {
  return (
    <Table
      columns={columns}
      data={shipments}
      rowKey={(row) => row.referenceNumber}
      caption="Shipments"
      emptyState={<p className="text-sm text-muted">No shipments yet.</p>}
    />
  );
}
