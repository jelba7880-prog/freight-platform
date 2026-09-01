import type { Shipment, TrackingEvent } from "@freight/database";
import type { BadgeVariant } from "@freight/ui";

// Mirrors apps/web's /track page and apps/admin's copy — kept separate
// since portal, admin, and the public site are independent deployables
// with no shared UI-copy package between them.
export const STATUS_LABELS: Record<Shipment["status"], string> = {
  pending: "Pending",
  in_transit: "In transit",
  customs_clearance: "Customs clearance",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  delayed: "Delayed",
};

export const STATUS_BADGE_VARIANTS: Record<Shipment["status"], BadgeVariant> = {
  pending: "neutral",
  in_transit: "in-transit",
  customs_clearance: "in-transit",
  out_for_delivery: "in-transit",
  delivered: "cleared",
  delayed: "neutral",
};

export const EVENT_TYPE_LABELS: Record<TrackingEvent["eventType"], string> = {
  arrival: "Arrival",
  departure: "Departure",
  status_change: "Status change",
  milestone: "Milestone",
  exception: "Exception",
};

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
