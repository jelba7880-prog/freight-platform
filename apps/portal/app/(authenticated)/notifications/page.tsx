import type { Metadata } from "next";
import { Card } from "@freight/ui";
import { listNotificationsForCustomer } from "@freight/database";

import { auth } from "@/auth";
import { NotificationsList } from "./NotificationsList";

export const metadata: Metadata = {
  title: "Notifications | Freight Platform Portal",
};

export default async function NotificationsPage() {
  // The (authenticated) layout above already redirects unauthenticated
  // requests before this page renders, so session.user is guaranteed here.
  const session = await auth();
  const notifications = await listNotificationsForCustomer(session!.user.id);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Notifications</h1>
        <p className="text-base text-muted">Status updates for your shipments, most recent first.</p>
      </header>

      <Card>
        <NotificationsList notifications={notifications} />
      </Card>
    </div>
  );
}
