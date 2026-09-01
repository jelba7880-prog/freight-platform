"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createShipment, searchCustomersByEmail } from "@freight/database";
import type { CustomerSummary, Shipment } from "@freight/database";

import { auth } from "@/auth";

const TRANSPORT_MODES = new Set<NonNullable<Shipment["transportMode"]>>([
  "sea",
  "air",
  "road",
]);

function isTransportMode(value: string): value is NonNullable<Shipment["transportMode"]> {
  return TRANSPORT_MODES.has(value as NonNullable<Shipment["transportMode"]>);
}

// Server actions are reachable directly (not gated by the page render), so
// this re-checks auth itself rather than trusting the form that called it —
// same pattern as logTrackingEvent in ../[reference]/actions.ts.
export async function createShipmentAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const origin = String(formData.get("origin") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const transportModeRaw = String(formData.get("transportMode") ?? "").trim();
  const estimatedArrivalRaw = String(formData.get("estimatedArrival") ?? "").trim();
  const customerId = String(formData.get("customerId") ?? "").trim();

  const transportMode = transportModeRaw && isTransportMode(transportModeRaw)
    ? transportModeRaw
    : null;

  let estimatedArrival: Date | null = null;
  if (estimatedArrivalRaw) {
    const parsed = new Date(estimatedArrivalRaw);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Invalid estimated arrival date");
    }
    estimatedArrival = parsed;
  }

  const shipment = await createShipment({
    origin: origin || null,
    destination: destination || null,
    transportMode,
    estimatedArrival,
    customerId: customerId || null,
  });

  revalidatePath("/shipments");
  redirect(`/shipments/${shipment.referenceNumber}`);
}

// Called from the client-side customer picker as it types — re-checks auth
// for the same reason createShipmentAction does.
export async function searchCustomers(query: string): Promise<CustomerSummary[]> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return searchCustomersByEmail(query);
}
