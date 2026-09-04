import type { Metadata } from "next";
import { Card } from "@freight/ui";

import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact us | Freight Platform",
  description: "Get in touch with our team about a shipment, quote, or general enquiry.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-comfortable px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Contact us</h1>
        <p className="max-w-2xl text-base text-muted">
          Tell us about your shipment or question and a member of our team will get back to you.
        </p>
      </header>

      <Card>
        <ContactForm />
      </Card>
    </div>
  );
}
