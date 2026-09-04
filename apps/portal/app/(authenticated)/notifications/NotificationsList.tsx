"use client";

import { useState, useTransition } from "react";
import { Badge, buttonClassName } from "@freight/ui";
import type { NotificationSummary } from "@freight/database";

import { STATUS_LABELS, formatDate } from "@/lib/shipment-labels";
import { markNotificationReadAction } from "./notification-actions";

// Client component for the same reason as DocumentsList: "Mark read" needs
// per-row pending state around a server action call.
export function NotificationsList({ notifications }: { notifications: NotificationSummary[] }) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<number | null>(null);

  function handleMarkRead(notificationId: number) {
    setPendingId(notificationId);
    startTransition(async () => {
      try {
        await markNotificationReadAction(notificationId);
      } finally {
        setPendingId(null);
      }
    });
  }

  if (notifications.length === 0) {
    return <p className="text-sm text-muted">No notifications yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-cozy">
      {notifications.map((notification) => {
        const unread = notification.readAt === null;
        const rowPending = isPending && pendingId === notification.id;
        return (
          <li
            key={notification.id}
            className="flex flex-wrap items-center justify-between gap-cozy border-b border-border pb-cozy last:border-b-0 last:pb-0"
          >
            <div className="flex flex-col gap-tight">
              <div className="flex items-center gap-tight">
                {unread ? <Badge variant="in-transit">New</Badge> : null}
                <span
                  className={`font-sans text-sm ${unread ? "font-medium text-foreground" : "text-muted"}`}
                >
                  {notification.shipmentReferenceNumber} is now{" "}
                  {STATUS_LABELS[notification.newStatus]}
                </span>
              </div>
              <span className="font-mono text-xs text-muted">
                {formatDate(notification.createdAt)}
              </span>
            </div>
            {unread ? (
              <button
                type="button"
                disabled={rowPending}
                onClick={() => handleMarkRead(notification.id)}
                className={buttonClassName("secondary", "sm")}
              >
                Mark read
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
