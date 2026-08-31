import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Customs Clearance | Freight Platform",
  description:
    "Import and export clearance handled by specialists who know local regulations. Documentation coordination that keeps your shipment moving through customs.",
};

export default async function CustomsClearancePage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Customs clearance",
    monogram: "CC",
    monogramTagline: "Import & export clearance coordination",
    headline: "Customs clearance coordinated by people who know the paperwork.",
    intro:
      "Import and export clearance can stall a shipment fast when documentation isn't right. Our customs clearance service is handled by specialists who know local regulations and prepare the paperwork your shipment needs, so it keeps moving through the border.",
    heroChecklist: [
      "Import and export documentation prepared and reviewed",
      "Specialists familiar with local clearance regulations",
      "Coordination alongside your existing freight booking",
      "Support if a shipment needs additional documentation",
    ],
    valuePropHeading: "Why choose customs clearance with us",
    valuePropDescription:
      "Clearance delays usually come down to paperwork, not the shipment itself. We prepare and review documentation ahead of time and coordinate directly with customs authorities, so your shipment isn't waiting on an avoidable hold.",
    valuePropItems: [
      {
        title: "Documentation preparation",
        description:
          "Import and export paperwork prepared to the standard local customs authorities expect, reducing avoidable delays.",
      },
      {
        title: "Regulatory familiarity",
        description:
          "Specialists who stay current on clearance requirements in the regions you ship to and from.",
      },
      {
        title: "Coordinated with your shipment",
        description:
          "Clearance arranged alongside your freight booking, not as a separate process you have to manage yourself.",
      },
      {
        title: "Responsive support",
        description:
          "If a shipment needs additional documentation or information, our team follows up quickly so it doesn't sit idle.",
      },
    ],
    benefitsDescription:
      "Customs clearance support for shippers who want documentation handled by people who deal with it regularly.",
    benefits: [
      {
        icon: "📋",
        title: "Paperwork prepared",
        description: "Import and export documentation prepared and reviewed before your shipment reaches the border.",
      },
      {
        icon: "🌐",
        title: "Local regulation awareness",
        description: "Specialists familiar with clearance requirements across the regions your shipments move through.",
      },
      {
        icon: "🤝",
        title: "Coordinated process",
        description: "Clearance handled alongside your freight booking, not a separate process to manage on your own.",
      },
      {
        icon: "⏱️",
        title: "Fewer avoidable delays",
        description: "Documentation prepared ahead of time to reduce the holds that come from incomplete paperwork.",
      },
      {
        icon: "📞",
        title: "Responsive follow-up",
        description: "Support to resolve additional documentation requests quickly if customs asks for more information.",
      },
    ],
    ctaHeading: "Ready to move your next shipment through customs?",
    ctaDescription:
      "Talk to a customs clearance specialist about your shipment's documentation. Our team will review what's needed and help you prepare it.",
    primaryCta: { label: "Talk to a Customs Clearance specialist", href: localePath(locale, "/contact") },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
