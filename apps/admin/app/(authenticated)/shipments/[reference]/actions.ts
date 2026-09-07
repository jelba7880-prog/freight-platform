"use server";

import { revalidatePath } from "next/cache";
import {
  createTrackingEvent,
  getShipmentIdByReference,
  markShipmentDelayed,
  resumeShipmentStatus,
} from "@freight/database";
import type { TrackingEvent } from "@freight/database";

import { auth } from "@/auth";

const EVENT_TYPES = new Set<TrackingEvent["eventType"]>([
  "arrival",
  "departure",
  "status_change",
  "milestone",
  "exception",
]);

function isEventType(value: string): value is TrackingEvent["eventType"] {
  return EVENT_TYPES.has(value as TrackingEvent["eventType"]);
}

type ResumeTargetStatus = "in_transit" | "customs_clearance" | "out_for_delivery" | "delivered";

const RESUME_TARGET_STATUSES = new Set<ResumeTargetStatus>([
  "in_transit",
  "customs_clearance",
  "out_for_delivery",
  "delivered",
]);

function isResumeTargetStatus(value: string): value is ResumeTargetStatus {
  return RESUME_TARGET_STATUSES.has(value as ResumeTargetStatus);
}

// Server actions are reachable directly (not gated by the page render), so
// this re-checks auth itself rather than trusting the form that called it.
export async function logTrackingEvent(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const referenceNumber = String(formData.get("referenceNumber") ?? "");
  const eventTypeRaw = String(formData.get("eventType") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const occurredAtRaw = String(formData.get("occurredAt") ?? "");

  if (!referenceNumber) {
    throw new Error("Missing shipment reference");
  }
  if (!isEventType(eventTypeRaw)) {
    throw new Error("Invalid event type");
  }

  const occurredAt = new Date(occurredAtRaw);
  if (Number.isNaN(occurredAt.getTime())) {
    throw new Error("Invalid occurred-at date");
  }

  const shipmentId = await getShipmentIdByReference(referenceNumber);
  if (shipmentId === null) {
    throw new Error("Shipment not found");
  }

  await createTrackingEvent({
    shipmentId,
    eventType: eventTypeRaw,
    location: location || null,
    description: description || null,
    occurredAt,
  });

  revalidatePath(`/shipments/${referenceNumber}`);
}

// Server actions are reachable directly (not gated by the page render), so
// this re-checks auth itself rather than trusting the form that called it.
export async function markDelayed(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const referenceNumber = String(formData.get("referenceNumber") ?? "");
  const description = String(formData.get("description") ?? "").trim();

  if (!referenceNumber) {
    throw new Error("Missing shipment reference");
  }

  const shipmentId = await getShipmentIdByReference(referenceNumber);
  if (shipmentId === null) {
    throw new Error("Shipment not found");
  }

  await markShipmentDelayed(shipmentId, description || null);

  revalidatePath(`/shipments/${referenceNumber}`);
}

// Server actions are reachable directly (not gated by the page render), so
// this re-checks auth itself rather than trusting the form that called it.
export async function resumeStatus(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const referenceNumber = String(formData.get("referenceNumber") ?? "");
  const newStatusRaw = String(formData.get("newStatus") ?? "");

  if (!referenceNumber) {
    throw new Error("Missing shipment reference");
  }
  if (!isResumeTargetStatus(newStatusRaw)) {
    throw new Error("Invalid resume status");
  }

  const shipmentId = await getShipmentIdByReference(referenceNumber);
  if (shipmentId === null) {
    throw new Error("Shipment not found");
  }

  await resumeShipmentStatus(shipmentId, newStatusRaw);

  revalidatePath(`/shipments/${referenceNumber}`);
}
