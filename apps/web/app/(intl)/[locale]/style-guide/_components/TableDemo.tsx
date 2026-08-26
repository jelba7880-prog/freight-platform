"use client";

import { useState } from "react";
import { Badge, Table } from "@freight/ui";
import type { Column, SortState } from "@freight/ui";

interface ShipmentRow {
  reference: string;
  route: string;
  status: "in-transit" | "cleared" | "draft";
  eta: string;
}

const SHIPMENTS: ShipmentRow[] = [
  { reference: "FR-88213-JP", route: "Rotterdam → Yokohama", status: "in-transit", eta: "2026-09-02" },
  { reference: "FR-40217-SG", route: "Hamburg → Singapore", status: "cleared", eta: "2026-08-24" },
  { reference: "FR-72933-US", route: "Shanghai → Los Angeles", status: "in-transit", eta: "2026-09-05" },
  { reference: "FR-15820-KR", route: "Antwerp → Busan", status: "draft", eta: "2026-09-12" },
  { reference: "FR-63410-HK", route: "Rotterdam → Hong Kong", status: "cleared", eta: "2026-08-21" },
  { reference: "FR-29187-DE", route: "Singapore → Hamburg", status: "in-transit", eta: "2026-08-30" },
];

function statusBadge(status: ShipmentRow["status"]) {
  if (status === "in-transit") return <Badge variant="in-transit">In transit</Badge>;
  if (status === "cleared") return <Badge variant="cleared">Cleared</Badge>;
  return <Badge variant="neutral">Draft</Badge>;
}

const columns: Column<ShipmentRow>[] = [
  { key: "reference", header: "Reference", type: "data", sortable: true, widthHint: "9rem" },
  { key: "route", header: "Route", sortable: true },
  { key: "status", header: "Status", sortable: true, render: (row) => statusBadge(row.status) },
  { key: "eta", header: "ETA", type: "data", align: "right", sortable: true, widthHint: "7rem" },
];

function sortRows(rows: ShipmentRow[], sort: SortState | null): ShipmentRow[] {
  if (!sort) return rows;
  const sorted = [...rows].sort((a, b) => {
    const av = String((a as unknown as Record<string, unknown>)[sort.key] ?? "");
    const bv = String((b as unknown as Record<string, unknown>)[sort.key] ?? "");
    return av.localeCompare(bv, undefined, { numeric: true });
  });
  return sort.direction === "desc" ? sorted.reverse() : sorted;
}

/**
 * Table is controlled, so this demo owns real sort state and actually
 * re-sorts SHIPMENTS on onSort — not a static mock. Each rendered instance
 * (e.g. the light vs. dark preview panel) gets its own independent state.
 */
export function TableDemo({ variant }: { variant: "populated" | "loading" | "empty" }) {
  const [sort, setSort] = useState<SortState | null>(null);

  if (variant === "loading") {
    return <Table columns={columns} data={[]} isLoading caption="Recent shipments" />;
  }
  if (variant === "empty") {
    return <Table columns={columns} data={[]} caption="Recent shipments" />;
  }

  return (
    <Table
      columns={columns}
      data={sortRows(SHIPMENTS, sort)}
      sort={sort}
      onSort={setSort}
      rowKey={(row) => row.reference}
      caption="Recent shipments"
    />
  );
}
