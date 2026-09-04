"use client";

import Link from "next/link";
import { Badge, Table } from "@freight/ui";
import type { Column } from "@freight/ui";
import type { ContactInquiry } from "@freight/database";

import { formatDate } from "@/lib/shipment-labels";

// Table's render/rowKey props are functions, which can't cross the
// server/client boundary as serialized props — so the column config lives
// here, inside the client component, rather than in the server page above.
const columns: Column<ContactInquiry>[] = [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <Link href={`/contact-inquiries/${row.id}`} className="text-beacon hover:underline">
        {row.name}
      </Link>
    ),
  },
  {
    key: "email",
    header: "Email",
    type: "data",
    render: (row) => (
      <Link
        href={`/contact-inquiries/${row.id}`}
        className="font-mono text-sm text-beacon hover:underline"
      >
        {row.email}
      </Link>
    ),
  },
  {
    key: "company",
    header: "Company",
    render: (row) => row.company ?? "—",
  },
  {
    key: "createdAt",
    header: "Submitted",
    type: "data",
    render: (row) => formatDate(row.createdAt),
  },
  {
    key: "status",
    header: "Status",
    // "New" badge for unhandled rows — same variant NotificationsList.tsx
    // uses for its unread badge, not a new one invented for this table.
    render: (row) => (row.handledAt === null ? <Badge variant="in-transit">New</Badge> : null),
  },
];

export function ContactInquiriesTable({ inquiries }: { inquiries: ContactInquiry[] }) {
  return (
    <Table
      columns={columns}
      data={inquiries}
      rowKey={(row) => row.id}
      caption="Contact inquiries"
      emptyState={<p className="text-sm text-muted">No inquiries yet.</p>}
    />
  );
}
