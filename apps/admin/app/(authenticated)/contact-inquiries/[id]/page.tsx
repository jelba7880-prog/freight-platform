import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge, Card } from "@freight/ui";
import { getContactInquiryById } from "@freight/database";

import { formatDate } from "@/lib/shipment-labels";
import { MarkHandledButton } from "./MarkHandledButton";

export const metadata: Metadata = {
  title: "Contact inquiry | Freight Platform Admin",
};

export default async function ContactInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders.
  const { id } = await params;
  const inquiryId = Number(id);
  const inquiry = Number.isNaN(inquiryId) ? null : await getContactInquiryById(inquiryId);

  if (!inquiry) {
    notFound();
  }

  const unhandled = inquiry.handledAt === null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Contact inquiry</h1>
      </header>

      <Card>
        <div className="flex flex-col gap-cozy">
          <div className="flex items-center justify-between gap-cozy">
            <h2 className="font-display text-lg font-semibold text-foreground">{inquiry.name}</h2>
            {unhandled ? <Badge variant="in-transit">New</Badge> : null}
          </div>

          <dl className="grid grid-cols-1 gap-cozy sm:grid-cols-2">
            <div className="flex flex-col gap-tight">
              <dt className="font-sans text-xs uppercase tracking-wide text-muted">Email</dt>
              <dd className="font-mono text-sm text-foreground">{inquiry.email}</dd>
            </div>
            <div className="flex flex-col gap-tight">
              <dt className="font-sans text-xs uppercase tracking-wide text-muted">Company</dt>
              <dd className="text-sm text-foreground">{inquiry.company ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-tight">
              <dt className="font-sans text-xs uppercase tracking-wide text-muted">Phone</dt>
              <dd className="text-sm text-foreground">{inquiry.phone ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-tight">
              <dt className="font-sans text-xs uppercase tracking-wide text-muted">Submitted</dt>
              <dd className="text-sm text-foreground">{formatDate(inquiry.createdAt)}</dd>
            </div>
            {inquiry.handledAt ? (
              <div className="flex flex-col gap-tight">
                <dt className="font-sans text-xs uppercase tracking-wide text-muted">Handled</dt>
                <dd className="text-sm text-foreground">{formatDate(inquiry.handledAt)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="flex flex-col gap-tight">
            <span className="font-sans text-xs uppercase tracking-wide text-muted">Message</span>
            <p className="whitespace-pre-wrap text-sm text-foreground">{inquiry.message}</p>
          </div>

          {unhandled ? (
            <div>
              <MarkHandledButton inquiryId={inquiry.id} />
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
