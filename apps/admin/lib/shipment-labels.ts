import type { Document, Shipment, TrackingEvent } from "@freight/database";
import type { BadgeVariant } from "@freight/ui";

// Mirrors apps/web's /track page labels — kept as a separate copy since
// admin and the public site are independent deployables with no shared
// UI-copy package between them.
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

export const DOCUMENT_TYPE_LABELS: Record<Document["documentType"], string> = {
  bill_of_lading: "Bill of lading",
  commercial_invoice: "Commercial invoice",
  packing_list: "Packing list",
  customs_declaration: "Customs declaration",
  certificate_of_origin: "Certificate of origin",
  other: "Other",
};

export function formatFileSize(bytes: number | null): string {
  if (bytes === null) {
    return "—";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
