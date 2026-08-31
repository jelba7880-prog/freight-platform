import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Industrial | Freight Platform",
  description:
    "Heavy machinery and industrial equipment logistics, door to door. Specialized handling for oversized and high-value industrial cargo.",
};

export default async function IndustrialPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Industrial",
    monogram: "IN",
    monogramTagline: "Heavy machinery & industrial equipment logistics",
    headline: "Logistics built for cargo that doesn't move like everything else.",
    intro:
      "Heavy machinery and industrial equipment bring size, weight, and handling requirements that generic freight service isn't built for. We coordinate door-to-door transport around what your equipment actually needs, from loading to final placement.",
    heroChecklist: [
      "Handling for heavy and oversized machinery",
      "Door-to-door coordination from origin to installation site",
      "Specialized loading and rigging support",
      "Coordinated visibility across every leg of the move",
    ],
    valuePropHeading: "Why choose industrial logistics with us",
    valuePropDescription:
      "Industrial equipment doesn't tolerate improvised handling. We build every move around the size, weight, and fragility of what you're shipping, so your equipment arrives ready to install, not ready to repair.",
    valuePropItems: [
      {
        title: "Heavy and oversized handling",
        description:
          "Equipment and expertise matched to machinery that standard freight handling isn't built to move.",
      },
      {
        title: "Door-to-door coordination",
        description:
          "Transport arranged from pickup through final placement, reducing the handoffs between your equipment and its destination.",
      },
      {
        title: "Loading and rigging support",
        description:
          "Specialized loading and securing for equipment that needs more than a standard pallet or container.",
      },
      {
        title: "Coordinated visibility",
        description:
          "A dedicated point of contact who coordinates your shipment across every leg and keeps you informed along the way.",
      },
    ],
    benefitsDescription:
      "Built for the handling demands of industrial equipment, from single-machine moves to full facility relocations.",
    benefits: [
      {
        icon: "🏗️",
        title: "Heavy equipment expertise",
        description: "Handling built around the size and weight of industrial machinery, not adapted from standard freight.",
      },
      {
        icon: "📍",
        title: "Door-to-door delivery",
        description: "Coordination from pickup through installation site, minimizing the handoffs along the way.",
      },
      {
        icon: "⚙️",
        title: "Specialized loading",
        description: "Rigging and securing support for equipment that needs more than standard loading methods.",
      },
      {
        icon: "🌍",
        title: "Global route coverage",
        description: "Transport options across sea, air, and road matched to the size and destination of your equipment.",
      },
      {
        icon: "🤝",
        title: "Specialist coordination",
        description: "A team that understands industrial equipment logistics, coordinating every leg on your behalf.",
      },
    ],
    ctaHeading: "Ready to move your next piece of industrial equipment?",
    ctaDescription:
      "Talk to a specialist who understands the handling and coordination heavy industrial equipment requires.",
    primaryCta: { label: "Talk to an Industrial specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
