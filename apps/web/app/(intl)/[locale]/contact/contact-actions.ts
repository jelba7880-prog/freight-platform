"use server";

import { createContactInquiry } from "@freight/database";

export interface ContactFormResult {
  status: "success" | "error";
  message: string;
}

// Public, unauthenticated form — unlike every other server action in this
// codebase, there's no session to re-check here. createContactInquiry does
// its own server-side validation (name/email/message), since a public form
// is the one place in this app reachable by something other than our own
// UI; this action's only job is turning a thrown validation error into a
// result ContactForm can render instead of failing silently.
export async function submitContactInquiry(formData: FormData): Promise<ContactFormResult> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const company = String(formData.get("company") ?? "");
  const phone = String(formData.get("phone") ?? "");
  const message = String(formData.get("message") ?? "");

  try {
    await createContactInquiry({
      name,
      email,
      company: company || null,
      phone: phone || null,
      message,
    });
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
    };
  }

  return {
    status: "success",
    message: "Thanks — we've received your message and will be in touch shortly.",
  };
}
