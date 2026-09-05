import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";

export const metadata: Metadata = {
  title: "About | Freight Platform",
  description:
    "Freight Platform connects shippers to sea, air, and road capacity across every major trade lane, with one accountable team behind every shipment.",
};

export default function AboutPage() {
  const content: CompanyPageContent = {
    headline: "Global freight forwarding, run by people who've moved cargo for a living.",
    intro:
      "Freight Platform was founded in 2011 on a simple frustration: shippers were stitching together carriers, brokers, and spreadsheets to move a single container, and nobody owned the outcome end to end. We built a single platform — and a single accountable team — around every shipment instead.",
    sections: [
      {
        type: "prose",
        heading: "What we do",
        paragraphs: [
          "We book, document, and track sea, air, and road freight from one platform, backed by a network of owned offices and vetted partner agents across major trade lanes. Customs clearance, cargo insurance, warehousing, and last-mile distribution sit alongside core transport, so a shipment doesn't have to change hands between providers to get where it's going.",
          "Every booking is assigned a specialist who stays with it from pickup to delivery — the same person who quoted your shipment is the one you call when a customs form needs a signature or a vessel misses its window.",
        ],
      },
      {
        type: "prose",
        heading: "How we're organized",
        paragraphs: [
          "Regional operations teams sit close to the ports, airports, and border crossings they serve, so local knowledge — which terminal is congested this week, which customs office wants an extra document — reaches your shipment before it becomes a delay. Those teams are backed by a central network operations desk that manages capacity across carriers and lanes, so we can flex to volume spikes without leaving a shipper short of space during peak season.",
        ],
      },
      {
        type: "prose",
        heading: "What we're building toward",
        paragraphs: [
          "Freight forwarding has historically made customers choose between visibility and simplicity — a single dashboard with none of your actual shipment detail, or a detailed but siloed system for each mode of transport. We're building toward the alternative: one platform, real operational detail, and a specialist accountable for the outcome, not just the booking.",
        ],
      },
    ],
  };

  return <CompanyPageTemplate content={content} />;
}
