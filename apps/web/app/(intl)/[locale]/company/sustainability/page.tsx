import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";

export const metadata: Metadata = {
  title: "Sustainability | Freight Platform",
  description:
    "How Freight Platform approaches emissions reporting, low-carbon transport options, and sustainable packaging across our freight network.",
};

export default function SustainabilityPage() {
  const content: CompanyPageContent = {
    headline: "Sustainability",
    intro:
      "Freight moves the physical economy, and that comes with a real environmental footprint. We treat reducing it as an operational responsibility, not a marketing line — built into how we route shipments and choose partners, not bolted on afterward.",
    sections: [
      {
        type: "prose",
        heading: "Emissions reporting",
        paragraphs: [
          "We calculate shipment-level carbon estimates using transport mode, distance, and load factor, following the GLEC Framework methodology that most of the freight industry has converged on. That means a customer comparing sea, air, and road options for the same lane sees a consistent, comparable emissions figure alongside cost and transit time — not a number that changes definition depending on which service they're booking.",
        ],
      },
      {
        type: "prose",
        heading: "Lower-carbon routing and modes",
        paragraphs: [
          "Where transit time allows, we default quotes toward sea and rail options over air freight, and toward consolidated loads over partial truckloads, since both reduce emissions per unit shipped without asking a customer to compromise on reliability. For ocean freight, we prioritize partner carriers that have committed to alternative fuels and vessel efficiency retrofits over the next decade.",
        ],
      },
      {
        type: "prose",
        heading: "Packaging and waste",
        paragraphs: [
          "Our warehousing and fulfilment operations use recyclable and right-sized packaging by default, reducing both material waste and the wasted cargo space that drives up emissions per shipment. We work with customers moving high packaging volumes to redesign cartons and dunnage around the actual dimensions of what they ship, rather than a one-size-fits-all box.",
        ],
      },
    ],
  };

  return <CompanyPageTemplate content={content} />;
}
