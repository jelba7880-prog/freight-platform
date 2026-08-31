import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Automotive and Mobility | Freight Platform",
  description:
    "Just-in-time and just-in-sequence logistics for automotive supply chains. Precise scheduling built around production-line timing.",
};

export default async function AutomotiveMobilityPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Automotive and mobility",
    monogram: "AM",
    monogramTagline: "Just-in-time & just-in-sequence logistics",
    headline: "Logistics built for production lines that don't wait.",
    intro:
      "Automotive supply chains run on precise timing — a late component can stop a production line, not just a shipment. We coordinate just-in-time and just-in-sequence delivery around your production schedule, so parts arrive exactly when the line needs them.",
    heroChecklist: [
      "Just-in-time and just-in-sequence delivery scheduling",
      "Coordination built around production-line timing",
      "Component and parts handling across every mode",
      "Coordinated visibility across your supply chain",
    ],
    valuePropHeading: "Why choose automotive and mobility logistics with us",
    valuePropDescription:
      "A production line doesn't tolerate a missed delivery window. We build our scheduling and coordination around that reality, so components arrive in sequence and on time, every time.",
    valuePropItems: [
      {
        title: "Just-in-time scheduling",
        description:
          "Delivery timed to production needs, so components arrive when the line needs them, not sitting in a queue beforehand.",
      },
      {
        title: "Just-in-sequence coordination",
        description:
          "Parts sequenced to match assembly order, reducing the sorting and handling work on your production floor.",
      },
      {
        title: "Supply-chain coordination",
        description:
          "A dedicated point of contact who coordinates deliveries across your suppliers and production sites.",
      },
      {
        title: "Multi-mode component handling",
        description:
          "Transport matched to the component — from bulk parts to time-critical, high-value shipments — across sea, air, and road.",
      },
    ],
    benefitsDescription:
      "Built for the timing demands of automotive supply chains, from component delivery to finished-vehicle logistics.",
    benefits: [
      {
        icon: "⏱️",
        title: "Precise scheduling",
        description: "Delivery timing coordinated to production-line needs, minimizing buffer stock and downtime risk.",
      },
      {
        icon: "🔧",
        title: "Sequenced delivery",
        description: "Components delivered in the order your assembly process needs them.",
      },
      {
        icon: "🚗",
        title: "Full supply-chain reach",
        description: "Coordination across suppliers, production sites, and distribution points in one connected flow.",
      },
      {
        icon: "📦",
        title: "Component-matched handling",
        description: "Transport and packaging matched to the sensitivity and value of the parts you ship.",
      },
      {
        icon: "🤝",
        title: "Specialist coordination",
        description: "A team that understands automotive supply-chain timing, coordinating every leg on your behalf.",
      },
    ],
    ctaHeading: "Ready to move your next automotive shipment?",
    ctaDescription:
      "Talk to a specialist who understands the timing and sequencing your automotive supply chain runs on.",
    primaryCta: { label: "Talk to an Automotive and Mobility specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
