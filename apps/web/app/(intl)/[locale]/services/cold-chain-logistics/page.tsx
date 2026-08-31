import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Cold-chain Logistics | Freight Platform",
  description:
    "Temperature-controlled transport and storage for sensitive, perishable cargo. Consistent conditions maintained from pickup to delivery.",
};

export default async function ColdChainLogisticsPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Cold-chain logistics",
    monogram: "CL",
    monogramTagline: "Temperature-controlled transport & storage",
    headline: "Temperature-controlled logistics for cargo that can't afford a break in the chain.",
    intro:
      "Perishable and temperature-sensitive cargo needs consistent conditions from the moment it's picked up to the moment it arrives. Our cold-chain logistics service maintains that consistency across transport and storage, so your product reaches its destination the way it left.",
    heroChecklist: [
      "Temperature-controlled transport across sea, air, and road",
      "Cold storage available alongside transit",
      "Continuous temperature monitoring in transit",
      "Handling built around sensitive, perishable cargo",
    ],
    valuePropHeading: "Why choose cold-chain logistics with us",
    valuePropDescription:
      "A single break in temperature control can compromise an entire shipment. We build our processes around maintaining consistent conditions at every handoff, so nothing in the chain becomes the weak link.",
    valuePropItems: [
      {
        title: "Consistent temperature control",
        description:
          "Equipment and processes built to hold the required temperature range across every leg of the journey.",
      },
      {
        title: "Continuous monitoring",
        description:
          "Temperature tracked throughout transit, so any deviation is caught and addressed quickly.",
      },
      {
        title: "Storage alongside transit",
        description:
          "Cold storage available at origin, destination, or in transit, so conditions stay consistent even during a handoff.",
      },
      {
        title: "Specialist handling",
        description:
          "A team experienced with the handling requirements of perishable and temperature-sensitive cargo.",
      },
    ],
    benefitsDescription:
      "Built for cargo where a break in temperature control means lost product, not just a delay.",
    benefits: [
      {
        icon: "🌡️",
        title: "Temperature control",
        description: "Transport and storage equipment built to hold consistent temperature ranges across the journey.",
      },
      {
        icon: "📡",
        title: "In-transit monitoring",
        description: "Ongoing temperature tracking so deviations are caught early, not discovered on arrival.",
      },
      {
        icon: "🏭",
        title: "Cold storage access",
        description: "Storage available alongside transport, keeping conditions consistent through every handoff.",
      },
      {
        icon: "🚛",
        title: "Multi-mode coverage",
        description: "Temperature-controlled options across sea, air, and road, matched to your route and timeline.",
      },
      {
        icon: "🤝",
        title: "Specialist coordination",
        description: "A team that understands perishable and temperature-sensitive cargo, coordinating every leg on your behalf.",
      },
    ],
    ctaHeading: "Ready to move your next temperature-sensitive shipment?",
    ctaDescription:
      "Talk to a cold-chain logistics specialist about your cargo's temperature requirements. Our team will recommend the right transport and storage setup.",
    primaryCta: { label: "Talk to a Cold-chain Logistics specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
