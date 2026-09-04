"use server";

import { revalidatePath } from "next/cache";
import { markContactInquiryHandled } from "@freight/database";

import { auth } from "@/auth";

// Server actions are reachable directly (not gated by the page render), so
// this re-checks auth itself — same pattern as every other action in this
// codebase.
export async function markContactInquiryHandledAction(inquiryId: number): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await markContactInquiryHandled(inquiryId);

  revalidatePath("/contact-inquiries");
  revalidatePath(`/contact-inquiries/${inquiryId}`);
}
