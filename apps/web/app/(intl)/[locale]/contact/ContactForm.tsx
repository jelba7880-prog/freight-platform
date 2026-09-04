"use client";

import { useState, useTransition } from "react";
import type { FormEvent } from "react";
import { Input, Textarea, buttonClassName } from "@freight/ui";

import { submitContactInquiry } from "./contact-actions";
import type { ContactFormResult } from "./contact-actions";

// useTransition + pending-state pattern, same as DocumentsList.tsx/
// CustomerPicker.tsx: call the server action directly from an event
// handler, track pending locally, and react to what it returns rather than
// navigating away — this is often the visitor's only interaction with the
// site, so success gets a real confirmation state, not a toast that
// vanishes, and failure gets a real message, not silence.
export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ContactFormResult | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const outcome = await submitContactInquiry(formData);
      setResult(outcome);
    });
  }

  if (result?.status === "success") {
    return (
      <div className="flex flex-col gap-tight">
        <h2 className="font-display text-lg font-semibold text-foreground">Message sent</h2>
        <p className="text-sm text-foreground">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-cozy">
      <Input id="name" name="name" label="Name" required autoComplete="name" />
      <Input id="email" name="email" type="email" label="Email" required autoComplete="email" />
      <Input id="company" name="company" label="Company (optional)" autoComplete="organization" />
      <Input id="phone" name="phone" type="tel" label="Phone (optional)" autoComplete="tel" />
      <Textarea id="message" name="message" label="Message" rows={5} required />

      {result?.status === "error" ? (
        <p role="alert" className="font-sans text-sm text-danger">
          {result.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className={buttonClassName("primary", "md")}
      >
        {isPending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
