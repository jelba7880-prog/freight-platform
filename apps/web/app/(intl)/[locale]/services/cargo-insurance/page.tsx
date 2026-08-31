import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Cargo Insurance | Freight Platform",
  description:
    "Protect shipments in transit with coverage tailored to cargo value and risk. Coverage options that give you peace of mind, alongside every mode of transport we offer.",
};

export default async function CargoInsurancePage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Cargo insurance",
    monogram: "CI",
    monogramTagline: "Coverage matched to shipment value & risk",
    headline: "Protect your shipment's value, wherever it travels.",
    intro:
      "Freight in transit carries risk you can't always control — weather, handling, route disruptions. Our cargo insurance service gives you coverage options to protect your shipment's value, arranged alongside the freight service you're already using, so protection is one less thing to source separately.",
    heroChecklist: [
      "Coverage options to protect your shipment's value",
      "Available across sea, air, and road freight modes",
      "Straightforward claims support if something goes wrong",
      "Arranged alongside your existing shipment booking",
    ],
    valuePropHeading: "Why choose cargo insurance with us",
    valuePropDescription:
      "Sourcing coverage separately from your freight adds friction and delay. We make it part of the same conversation, so you can protect your shipment's value without a separate broker or process.",
    valuePropItems: [
      {
        title: "Coverage that fits your shipment",
        description:
          "Options scaled to what you're actually shipping, so you're not paying for protection you don't need or left exposed on value you do.",
      },
      {
        title: "One point of contact",
        description:
          "Arrange coverage alongside your freight booking instead of managing a separate insurer relationship on every shipment.",
      },
      {
        title: "Support when it matters",
        description:
          "If a claim comes up, our team helps you through the process instead of leaving you to navigate it alone.",
      },
      {
        title: "Coverage across modes",
        description:
          "Whether your cargo moves by sea, air, or road, coverage options travel with it across the full journey.",
      },
    ],
    benefitsDescription:
      "Cargo insurance gives shippers of valuable, sensitive, or high-risk freight a way to protect against loss or damage in transit.",
    benefits: [
      {
        icon: "🛡️",
        title: "Value protection",
        description: "Coverage options to protect your shipment's value against loss or damage while it's in transit.",
      },
      {
        icon: "🚢",
        title: "Cross-mode availability",
        description: "Coverage options that apply whether your shipment moves by sea, air, or road.",
      },
      {
        icon: "📝",
        title: "Simple to arrange",
        description: "Set up coverage as part of your freight booking, without a separate application process.",
      },
      {
        icon: "🤝",
        title: "Claims support",
        description: "Guidance and support from our team if you ever need to file a claim on a covered shipment.",
      },
      {
        icon: "📊",
        title: "Risk-aware guidance",
        description: "Our team helps you think through the right level of coverage for what and how you're shipping.",
      },
    ],
    ctaHeading: "Protect your next shipment",
    ctaDescription:
      "Get a quote for cargo insurance coverage tailored to your shipment's value and route. Our team will walk you through the options.",
    primaryCta: { label: "Get a quote for cargo insurance", href: localePath(locale, "/get-a-quote") },
    secondaryCta: { label: "Talk to an expert", href: localePath(locale, "/contact") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
