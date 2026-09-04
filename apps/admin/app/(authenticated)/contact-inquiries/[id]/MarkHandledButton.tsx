"use client";

import { useTransition } from "react";
import { buttonClassName } from "@freight/ui";

import { markContactInquiryHandledAction } from "./mark-actions";

// Client component for the same reason as NotificationsList: "Mark
// handled" needs pending state around a server action call.
export function MarkHandledButton({ inquiryId }: { inquiryId: number }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await markContactInquiryHandledAction(inquiryId);
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleClick}
      className={buttonClassName("secondary", "sm")}
    >
      {isPending ? "Marking handled…" : "Mark handled"}
    </button>
  );
}
