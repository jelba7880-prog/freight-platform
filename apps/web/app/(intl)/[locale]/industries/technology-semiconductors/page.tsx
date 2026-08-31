import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Technology and Semiconductors | Freight Platform",
  description:
    "Secure, time-critical logistics for high-value tech and semiconductor cargo. Careful handling and coordinated transport built around what this cargo demands.",
};

export default async function TechnologySemiconductorsPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Technology and semiconductors",
    monogram: "TS",
    monogramTagline: "High-value tech & semiconductor cargo",
    headline: "Logistics built for high-value tech and semiconductor cargo.",
    intro:
      "Semiconductor components and technology hardware carry a combination of high value, sensitivity, and tight production schedules that generic freight handling wasn't built for. We coordinate secure, time-critical transport around what this cargo actually demands, from factory floor to customer.",
    heroChecklist: [
      "Secure handling for high-value technology cargo",
      "Time-critical transport coordinated to production schedules",
      "Specialized packaging for sensitive components",
      "Coordinated visibility across every leg of the move",
    ],
    valuePropHeading: "Why choose technology and semiconductor logistics with us",
    valuePropDescription:
      "High-value electronics and semiconductor cargo can't tolerate delay or mishandling. We build our processes around the security and timing these shipments require, so your cargo moves with the care it needs.",
    valuePropItems: [
      {
        title: "Security-conscious handling",
        description:
          "Processes built around the value and sensitivity of technology cargo, from pickup through final delivery.",
      },
      {
        title: "Schedule-driven coordination",
        description:
          "Transport planned around your production and delivery windows, so components arrive when your line needs them.",
      },
      {
        title: "Specialized packaging",
        description:
          "Packaging matched to the sensitivity of semiconductor components and technology hardware, not generic freight cartons.",
      },
      {
        title: "Coordinated visibility",
        description:
          "A dedicated point of contact who coordinates your shipment across every leg and keeps you informed along the way.",
      },
    ],
    benefitsDescription:
      "Built for the demands of technology and semiconductor supply chains, from component shipments to finished hardware.",
    benefits: [
      {
        icon: "🔒",
        title: "Secure handling",
        description: "Processes designed around the value and sensitivity of technology and semiconductor cargo.",
      },
      {
        icon: "⏱️",
        title: "Time-critical coordination",
        description: "Transport planned to meet the tight production and delivery windows this industry runs on.",
      },
      {
        icon: "📦",
        title: "Purpose-built packaging",
        description: "Packaging designed around the fragility and sensitivity of semiconductor components and hardware.",
      },
      {
        icon: "🌐",
        title: "Global coordination",
        description: "Support across the international routes that technology and semiconductor supply chains depend on.",
      },
      {
        icon: "🤝",
        title: "Specialist coordination",
        description: "A team that understands the demands of high-value tech cargo, coordinating every leg on your behalf.",
      },
    ],
    ctaHeading: "Ready to move your next technology shipment?",
    ctaDescription:
      "Talk to a specialist who understands the handling and timing that high-value tech and semiconductor cargo requires.",
    primaryCta: { label: "Talk to a Technology and Semiconductors specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
