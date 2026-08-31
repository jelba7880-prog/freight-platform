import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Sea Freight | Freight Platform",
  description:
    "Full container and consolidated ocean freight across major global trade lanes. Scale your shipments with competitive rates and reliable transit schedules.",
};

export default async function SeaFreightPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Sea freight",
    monogram: "SF",
    monogramTagline: "Full containers & consolidated shipments",
    headline: "Global ocean freight that scales with your business.",
    intro:
      "Whether you ship full containers or smaller consolidated shipments, our ocean freight service connects you to major global trade lanes with transparent pricing, predictable transit times, and dedicated account management.",
    heroChecklist: [
      "Competitive rates for FCL and LCL",
      "Reliable 15–45 day transit across major routes",
      "Full shipment visibility from port to port",
      "Integrated customs and documentation handling",
    ],
    valuePropHeading: "Why choose sea freight with us",
    valuePropDescription:
      "We handle everything from quoting to delivery, so you can focus on your supply chain. Our global network and local expertise mean your shipment gets the care and attention it deserves.",
    valuePropItems: [
      {
        title: "Transparent pricing",
        description:
          "Clear, itemized quotes that show every cost — no hidden fees, and rates competitive with industry standards.",
      },
      {
        title: "Global coverage",
        description:
          "Service to and from major ports worldwide. Whether it's Asia to Europe or domestic coastal routes, we've got the capacity.",
      },
      {
        title: "Reliable schedules",
        description:
          "Predictable transit times backed by steady partnerships with carriers and port operators across key trade lanes.",
      },
      {
        title: "Dedicated support",
        description:
          "Your account manager tracks your shipments, handles documentation, and coordinates with ports and warehouses on your behalf.",
      },
    ],
    benefitsDescription:
      "Sea freight is the most cost-effective option for shipments weighing over 10–15 tons or with flexible delivery windows.",
    benefits: [
      {
        icon: "⚓",
        title: "Lower cost per ton",
        description: "Ocean freight is the most economical choice for high-volume, lower-urgency shipments across continents.",
      },
      {
        icon: "📦",
        title: "Flexible container options",
        description:
          "Choose full container loads (FCL) for complete shipment control, or consolidated less-than-container (LCL) loads to share costs.",
      },
      {
        icon: "🌍",
        title: "Established trade routes",
        description:
          "Access to well-established shipping corridors with frequent sailings and consistent transit performance.",
      },
      {
        icon: "📍",
        title: "Door-to-door coordination",
        description:
          "We arrange pickup, haulage to port, ocean transport, port clearance, and final delivery as one seamless service.",
      },
      {
        icon: "📋",
        title: "Documentation & compliance",
        description: "Bills of lading, export/import permits, customs forms — we handle the paperwork so you don't have to.",
      },
    ],
    ctaHeading: "Ready to ship?",
    ctaDescription:
      "Get a competitive quote for your sea freight shipment. Our team will review your needs and provide transparent pricing within hours.",
    primaryCta: { label: "Get a quote for sea freight", href: localePath(locale, "/get-a-quote") },
    secondaryCta: { label: "Talk to an expert", href: localePath(locale, "/contact") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
