import { randomUUID } from "node:crypto";
import { del, issueSignedToken, presignUrl, put } from "@vercel/blob";
import { eq } from "drizzle-orm";

import { getDb } from "./client";
import * as schema from "./schema";
import type { Document } from "./schema";

// Short-lived — a few minutes, not the multi-day max presignUrl supports.
// Every download link is minted fresh on request (see getDocumentDownloadUrl),
// so there's no reason for a URL to outlive the click that asked for it.
const DOWNLOAD_URL_TTL_MS = 5 * 60 * 1000;

/**
 * Uploads a shipment document to the private Blob store and records it.
 * Pathname scheme is `documents/<referenceNumber>/<uuid>-<fileName>` — the
 * UUID makes it collision-safe on its own (no addRandomSuffix needed), and
 * keeping the reference number and original filename in the path makes a
 * blob's origin legible from the Blob dashboard alone, without a DB lookup.
 */
export async function uploadShipmentDocument(
  shipmentId: number,
  file: File,
  documentType: Document["documentType"],
): Promise<Document> {
  const db = getDb();

  const [shipment] = await db
    .select({ referenceNumber: schema.shipments.referenceNumber })
    .from(schema.shipments)
    .where(eq(schema.shipments.id, shipmentId))
    .limit(1);

  if (!shipment) {
    throw new Error(`[@freight/database] No shipment with id ${shipmentId}`);
  }

  const blobPathname = `documents/${shipment.referenceNumber}/${randomUUID()}-${file.name}`;

  const blob = await put(blobPathname, file, {
    access: "private",
    contentType: file.type || undefined,
  });

  const [document] = await db
    .insert(schema.documents)
    .values({
      shipmentId,
      documentType,
      fileName: file.name,
      blobPathname: blob.pathname,
      contentType: file.type || null,
      fileSizeBytes: file.size,
    })
    .returning();

  // A single-row insert always returns exactly one row.
  return document!;
}

/**
 * Mints a short-lived signed URL for downloading a document's blob.
 * Callers (admin now, portal later) are responsible for their own
 * access-control check before calling this — it does not verify who's
 * asking or that they're allowed to see this shipment's documents, same
 * division of responsibility as getShipmentForCustomer (scoped) vs.
 * getShipmentWithEvents (not) for shipment reads.
 */
export async function getDocumentDownloadUrl(documentId: number): Promise<string> {
  const db = getDb();

  const [document] = await db
    .select({ blobPathname: schema.documents.blobPathname })
    .from(schema.documents)
    .where(eq(schema.documents.id, documentId))
    .limit(1);

  if (!document) {
    throw new Error(`[@freight/database] No document with id ${documentId}`);
  }

  const signedToken = await issueSignedToken({
    pathname: document.blobPathname,
    operations: ["get"],
    validUntil: Date.now() + DOWNLOAD_URL_TTL_MS,
  });

  const { presignedUrl } = await presignUrl(signedToken, {
    operation: "get",
    pathname: document.blobPathname,
    access: "private",
  });

  return presignedUrl;
}

/**
 * Deletes both the blob and its documents row — a hard delete, not a soft
 * one. This is a different question from trackingEvents.shipmentId's
 * onDelete: "restrict" above: that guards against a *shipment* disappearing
 * and silently taking its audit trail with it as a side effect. Removing a
 * single document here is instead a deliberate, targeted action a staff
 * member takes on purpose (the admin UI requires a confirmation step before
 * calling this) — e.g. the wrong file was uploaded. Nothing else in this
 * schema soft-deletes, and there's no retention/compliance requirement on
 * record that would call for a tombstone instead, so this stays consistent
 * with the rest of the schema: delete for real, both places.
 *
 * Blob deleted before the row: if the row-delete step then failed, the
 * leftover row would point at a now-missing blob — visibly broken (its
 * download link would 404) and safe to retry. The reverse order risks a
 * silent storage leak instead: if the blob-delete step failed after the row
 * was already gone, there would be no document left in the app to retry
 * the delete from, and the orphaned blob would sit in the store unseen.
 */
export async function deleteShipmentDocument(documentId: number): Promise<void> {
  const db = getDb();

  const [document] = await db
    .select({ blobPathname: schema.documents.blobPathname })
    .from(schema.documents)
    .where(eq(schema.documents.id, documentId))
    .limit(1);

  if (!document) {
    return;
  }

  await del(document.blobPathname);
  await db.delete(schema.documents).where(eq(schema.documents.id, documentId));
}
