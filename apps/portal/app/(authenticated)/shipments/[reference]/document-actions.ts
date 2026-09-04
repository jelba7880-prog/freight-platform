"use server";

import { getDocumentDownloadUrl, isDocumentAccessibleToCustomer } from "@freight/database";

import { auth } from "@/auth";

// Server actions are reachable directly (not gated by the page render), so
// this re-checks auth itself — same pattern as admin's document-actions.ts.
// Read-only: the portal has no upload/delete path, only this.
//
// isDocumentAccessibleToCustomer's true/false collapses into one generic
// error below rather than two different messages — a customer must not be
// able to tell "no such document" apart from "that document isn't yours"
// from the error alone, same indistinguishability getShipmentForCustomer
// already guarantees for shipment lookups.
export async function requestDocumentDownloadUrl(documentId: number): Promise<string> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const accessible = await isDocumentAccessibleToCustomer(session.user.id, documentId);
  if (!accessible) {
    throw new Error("Not found");
  }

  return getDocumentDownloadUrl(documentId);
}
