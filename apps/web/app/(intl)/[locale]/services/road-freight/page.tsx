import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Road Freight | Freight Platform",
  description:
    "Full-truckload, part-load, and cross-border road transport across regions. Flexible capacity and door-to-door coverage for every shipment size.",
};

export default async function RoadFreightPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Road freight",
    monogram: "RF",
    monogramTagline: "Full-truckload, part-load & cross-border transport",
    headline: "Road transport that flexes with your shipment size and route.",
    intro:
      "From single pallets to full trailers, our road freight service moves cargo across regions and borders with the flexibility to match your volume. Whether you need a dedicated truck or a shared load, we build the route around what you're shipping.",
    heroChecklist: [
      "Full-truckload (FTL) and part-load (LTL) options",
      "Cross-border transport across major regional corridors",
      "Door-to-door pickup and delivery",
      "Shipment visibility through every leg of the route",
    ],
    valuePropHeading: "Why choose road freight with us",
    valuePropDescription:
      "Road transport works best when the capacity matches the load. We plan every shipment around your actual volume and timeline, so you're never paying for space you don't need or waiting on a truck that isn't full.",
    valuePropItems: [
      {
        title: "Flexible capacity",
        description:
          "Full-truckload for complete control over your shipment, or part-load to share space and cost when you don't need a whole trailer.",
      },
      {
        title: "Cross-border expertise",
        description:
          "Established routes and border-crossing experience across major regional corridors, so customs and paperwork don't slow down transit.",
      },
      {
        title: "Door-to-door coverage",
        description:
          "Pickup at origin, delivery at destination — no intermediate handoffs to coordinate or track down yourself.",
      },
      {
        title: "Dedicated support",
        description:
          "An account manager who plans your route, tracks your shipment, and coordinates with drivers and receiving locations on your behalf.",
      },
    ],
    benefitsDescription:
      "Road freight is the right fit for regional and cross-border shipments where flexibility and door-to-door coverage matter most.",
    benefits: [
      {
        icon: "🚚",
        title: "Full-truckload capacity",
        description: "Dedicated trailer space for larger shipments that need complete control over routing and timing.",
      },
      {
        icon: "📦",
        title: "Part-load options",
        description: "Share trailer space on smaller shipments to reduce cost without sacrificing reliable transit.",
      },
      {
        icon: "🗺️",
        title: "Regional route coverage",
        description: "Established road corridors across major regions, including established cross-border lanes.",
      },
      {
        icon: "📍",
        title: "Door-to-door delivery",
        description: "Pickup and delivery handled end to end, without intermediate transfers to coordinate.",
      },
      {
        icon: "📋",
        title: "Documentation handled",
        description: "Cross-border paperwork and customs documentation prepared and managed on your behalf.",
      },
    ],
    ctaHeading: "Ready to move your next shipment by road?",
    ctaDescription:
      "Talk to a road freight specialist about your route and volume. Our team will recommend the right truckload option and plan your delivery.",
    primaryCta: { label: "Talk to a Road Freight specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
