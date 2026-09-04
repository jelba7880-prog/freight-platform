import type { Metadata } from "next";
import { Card } from "@freight/ui";
import { listContactInquiries } from "@freight/database";

import { ContactInquiriesTable } from "./ContactInquiriesTable";

export const metadata: Metadata = {
  title: "Contact inquiries | Freight Platform Admin",
};

export default async function ContactInquiriesPage() {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders.
  const inquiries = await listContactInquiries();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Contact inquiries</h1>
        <p className="text-base text-muted">All /contact submissions, most recent first.</p>
      </header>

      <Card>
        <ContactInquiriesTable inquiries={inquiries} />
      </Card>
    </div>
  );
}
