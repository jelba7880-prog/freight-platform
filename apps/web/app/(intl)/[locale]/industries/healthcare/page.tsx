import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Healthcare | Freight Platform",
  description:
    "Compliant, temperature-controlled logistics for pharma and medical devices. Specialized packaging, documentation, and chain-of-custody handling built for regulated shipments.",
};

export default async function HealthcarePage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Healthcare",
    monogram: "HC",
    monogramTagline: "Pharma & medical device logistics",
    headline: "Logistics built for what pharma and medical device shipments demand.",
    intro:
      "From temperature-sensitive pharmaceuticals to fragile medical devices, healthcare shipments carry requirements that generic freight handling can't meet. We build every move around the handling and documentation those shipments demand, with specialized packaging and clear chain-of-custody records from origin to destination.",
    heroChecklist: [
      "Temperature-controlled transport and storage",
      "Compliance-aware documentation for regulated shipments",
      "Specialized packaging for sensitive pharma and devices",
      "Chain-of-custody visibility from pickup to delivery",
    ],
    valuePropHeading: "Why choose healthcare logistics with us",
    valuePropDescription:
      "Pharmaceutical and medical device shipments don't tolerate shortcuts. We build our processes around the handling and documentation requirements these shipments demand, so your product arrives intact, on time, and fully accounted for.",
    valuePropItems: [
      {
        title: "Temperature-controlled handling",
        description:
          "Equipment and processes built around the tight temperature ranges pharmaceutical products require, across every leg of the journey.",
      },
      {
        title: "Compliance-aware documentation",
        description:
          "Paperwork prepared to the standard regulated healthcare shipments require, reducing delays at customs and receiving.",
      },
      {
        title: "Specialized packaging",
        description:
          "Packaging solutions matched to the fragility and sensitivity of pharmaceuticals and medical devices, not generic freight cartons.",
      },
      {
        title: "Chain-of-custody visibility",
        description:
          "A documented handoff record from pickup through delivery, so you always know where your shipment has been and who handled it.",
      },
    ],
    benefitsDescription:
      "Built for the demands of pharmaceutical and medical device supply chains, from bulk shipments to time-critical deliveries.",
    benefits: [
      {
        icon: "🌡️",
        title: "Temperature control",
        description: "Cold-chain and controlled-ambient options matched to your product's stability requirements.",
      },
      {
        icon: "📋",
        title: "Compliance-ready paperwork",
        description: "Documentation prepared with the level of detail regulated pharma and medical device shipments require.",
      },
      {
        icon: "📦",
        title: "Purpose-built packaging",
        description:
          "Packaging designed around the fragility and sensitivity of the products you ship, not one-size-fits-all cartons.",
      },
      {
        icon: "🔗",
        title: "Chain-of-custody records",
        description: "A documented trail of every handoff, giving you an accountable record from origin to destination.",
      },
      {
        icon: "🩺",
        title: "Specialist coordination",
        description:
          "A team that understands the sensitivity of healthcare cargo, coordinating pickup, transport, and delivery on your behalf.",
      },
    ],
    ctaHeading: "Ready to move your next healthcare shipment?",
    ctaDescription:
      "Talk to a specialist who understands the handling and documentation your pharmaceutical or medical device shipment requires.",
    primaryCta: { label: "Talk to a Healthcare specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
