import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Consumer Goods | Freight Platform",
  description:
    "Reliable, scalable logistics for fast-moving consumer goods brands. Consistent transit and coordinated distribution built for retail schedules and seasonal demand.",
};

export default async function ConsumerGoodsPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Consumer goods",
    monogram: "CG",
    monogramTagline: "Fast-moving consumer goods logistics",
    headline: "Logistics that scale with your consumer goods business.",
    intro:
      "Fast-moving consumer goods brands need logistics that keep pace with retail calendars, seasonal spikes, and changing demand. We build reliable, scalable transport and distribution around those rhythms, so your products reach shelves and customers on schedule.",
    heroChecklist: [
      "Reliable transit built for retail and distribution schedules",
      "Scalable capacity for seasonal and promotional demand",
      "Coordinated distribution across retail and direct channels",
      "Consistent service across high shipment volumes",
    ],
    valuePropHeading: "Why choose consumer goods logistics with us",
    valuePropDescription:
      "Consumer goods brands run on tight retail calendars and shifting demand. We build our processes around that pace, so your shipments arrive consistently, whether you're moving everyday volume or a seasonal surge.",
    valuePropItems: [
      {
        title: "Scalable capacity",
        description:
          "Transport and distribution capacity that flexes with seasonal peaks and promotional spikes, not just steady-state volume.",
      },
      {
        title: "Retail-ready coordination",
        description:
          "Shipments planned around retail delivery windows and distribution requirements, so your products land on schedule.",
      },
      {
        title: "Consistent service at volume",
        description:
          "Reliable transit performance across high shipment counts, so your supply chain stays predictable as you grow.",
      },
      {
        title: "Dedicated support",
        description:
          "An account manager who coordinates your shipments and adapts with you as demand and channels change.",
      },
    ],
    benefitsDescription:
      "Built for the pace and scale of fast-moving consumer goods, from everyday replenishment to seasonal demand surges.",
    benefits: [
      {
        icon: "📦",
        title: "Scalable capacity",
        description: "Transport and distribution capacity that flexes with seasonal peaks and promotional demand.",
      },
      {
        icon: "🛒",
        title: "Retail-ready transit",
        description: "Shipments coordinated around retail delivery windows and distribution center requirements.",
      },
      {
        icon: "📅",
        title: "Consistent scheduling",
        description: "Reliable transit performance that holds up across high shipment volumes and tight calendars.",
      },
      {
        icon: "🌍",
        title: "Global and regional reach",
        description: "Distribution support across the retail and direct-to-consumer channels consumer goods brands rely on.",
      },
      {
        icon: "🤝",
        title: "Dedicated coordination",
        description: "A team that understands consumer goods supply chains, coordinating your shipments end to end.",
      },
    ],
    ctaHeading: "Ready to scale your consumer goods logistics?",
    ctaDescription:
      "Talk to a specialist who understands the retail schedules and seasonal demand your consumer goods supply chain runs on.",
    primaryCta: { label: "Talk to a Consumer Goods specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Get a quote", href: localePath(locale, "/get-a-quote") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
