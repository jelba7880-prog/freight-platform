"use client";

import { useState, useTransition } from "react";
import { buttonClassName } from "@freight/ui";
import type { DocumentSummary } from "@freight/database";

import { DOCUMENT_TYPE_LABELS, formatDate, formatFileSize } from "@/lib/shipment-labels";
import { deleteDocument, requestDocumentDownloadUrl } from "./document-actions";

// Client component for two reasons: downloading needs a signed URL minted
// on demand (a server action call, not a value baked into the page at
// render time — see requestDocumentDownloadUrl's own comment), and deleting
// needs a confirmation step before it fires. Mirrors CustomerPicker's
// pattern of invoking server actions directly from an event handler rather
// than through a <form>.
export function DocumentsList({
  documents,
  referenceNumber,
}: {
  documents: DocumentSummary[];
  referenceNumber: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<number | null>(null);

  function handleDownload(documentId: number) {
    setPendingId(documentId);
    startTransition(async () => {
      try {
        const url = await requestDocumentDownloadUrl(documentId);
        window.open(url, "_blank", "noopener,noreferrer");
      } finally {
        setPendingId(null);
      }
    });
  }

  function handleDelete(documentId: number, fileName: string) {
    if (!window.confirm(`Delete "${fileName}"? This can't be undone.`)) {
      return;
    }
    setPendingId(documentId);
    startTransition(async () => {
      try {
        await deleteDocument(documentId, referenceNumber);
      } finally {
        setPendingId(null);
      }
    });
  }

  if (documents.length === 0) {
    return <p className="text-sm text-muted">No documents uploaded yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-cozy">
      {documents.map((document) => {
        const rowPending = isPending && pendingId === document.id;
        return (
          <li
            key={document.id}
            className="flex flex-wrap items-center justify-between gap-cozy border-b border-border pb-cozy last:border-b-0 last:pb-0"
          >
            <div className="flex flex-col gap-tight">
              <span className="font-sans text-sm font-medium text-foreground">
                {document.fileName}
              </span>
              <span className="font-mono text-xs text-muted">
                {DOCUMENT_TYPE_LABELS[document.documentType]} ·{" "}
                {formatFileSize(document.fileSizeBytes)} · {formatDate(document.uploadedAt)}
              </span>
            </div>
            <div className="flex items-center gap-tight">
              <button
                type="button"
                disabled={rowPending}
                onClick={() => handleDownload(document.id)}
                className={buttonClassName("secondary", "sm")}
              >
                Download
              </button>
              <button
                type="button"
                disabled={rowPending}
                onClick={() => handleDelete(document.id, document.fileName)}
                className={buttonClassName("ghost", "sm")}
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
