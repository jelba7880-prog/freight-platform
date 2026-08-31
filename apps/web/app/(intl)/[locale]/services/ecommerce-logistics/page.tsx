import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "E-commerce Logistics | Freight Platform",
  description:
    "Fulfilment and returns logistics built for high-volume online retail. Order accuracy and fast turnaround from a network built for e-commerce demand.",
};

export default async function EcommerceLogisticsPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "E-commerce logistics",
    monogram: "EL",
    monogramTagline: "Fulfilment & returns for online retail",
    headline: "Logistics built for the pace of online retail.",
    intro:
      "High-volume online selling runs on fast, accurate fulfilment and a returns process customers don't have to think twice about. Our e-commerce logistics service is built around both, so your storefront can promise delivery times it can actually keep.",
    heroChecklist: [
      "Fast, accurate order fulfilment at online-retail volume",
      "Returns logistics built into the same process",
      "Scalable capacity for sales spikes and seasonal peaks",
      "Integration-ready with major e-commerce platforms",
    ],
    valuePropHeading: "Why choose e-commerce logistics with us",
    valuePropDescription:
      "Online retail doesn't run on a fixed schedule — order volume swings with campaigns, seasons, and viral moments. We build fulfilment capacity that flexes with that pattern, so a spike in orders doesn't become a spike in delays.",
    valuePropItems: [
      {
        title: "High-volume fulfilment",
        description:
          "Order processing built to hold accuracy and speed steady, whether you're shipping hundreds or thousands of orders a day.",
      },
      {
        title: "Built-in returns handling",
        description:
          "Returns logistics designed into the same operation as fulfilment, not bolted on as an afterthought.",
      },
      {
        title: "Scalable for peaks",
        description:
          "Capacity that flexes for seasonal spikes and promotional surges, without a drop in fulfilment speed.",
      },
      {
        title: "Platform-ready integration",
        description:
          "Built to connect with the e-commerce platforms and marketplaces you already sell on.",
      },
    ],
    benefitsDescription:
      "Built for online retailers who need fulfilment and returns to keep pace with order volume, not lag behind it.",
    benefits: [
      {
        icon: "📦",
        title: "Fast order fulfilment",
        description: "Processing built for the turnaround times online shoppers expect from checkout to delivery.",
      },
      {
        icon: "↩️",
        title: "Streamlined returns",
        description: "A returns process built alongside fulfilment, so reverse logistics doesn't slow down the rest of the operation.",
      },
      {
        icon: "📈",
        title: "Peak-ready capacity",
        description: "Fulfilment capacity that scales for sales events and seasonal demand without a drop in accuracy.",
      },
      {
        icon: "🔌",
        title: "Platform integration",
        description: "Built to work with the e-commerce platforms and marketplaces you already sell through.",
      },
      {
        icon: "🤝",
        title: "Dedicated coordination",
        description: "A team that understands online-retail fulfilment, coordinating your orders end to end.",
      },
    ],
    ctaHeading: "Ready to scale your e-commerce fulfilment?",
    ctaDescription:
      "Talk to an e-commerce logistics specialist about your order volume and platforms. Our team will recommend the right fulfilment and returns setup.",
    primaryCta: { label: "Talk to an E-commerce Logistics specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
