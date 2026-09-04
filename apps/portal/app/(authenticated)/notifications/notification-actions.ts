"use server";

import { revalidatePath } from "next/cache";
import { markNotificationRead } from "@freight/database";

import { auth } from "@/auth";

// Server actions are reachable directly (not gated by the page render), so
// this re-checks auth itself — same pattern as every other action in this
// codebase. markNotificationRead itself silently no-ops for a notification
// that doesn't exist or isn't the caller's, so there's nothing further to
// branch on here.
export async function markNotificationReadAction(notificationId: number): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await markNotificationRead(session.user.id, notificationId);

  revalidatePath("/notifications");
}
