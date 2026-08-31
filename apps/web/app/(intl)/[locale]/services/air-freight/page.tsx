import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Air Freight | Freight Platform",
  description:
    "Time-critical air cargo with express, standard, and charter options worldwide. Fast transit, global airport coverage, and dedicated handling for urgent shipments.",
};

export default async function AirFreightPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Air freight",
    monogram: "AF",
    monogramTagline: "Express, standard & charter options",
    headline: "Air cargo that moves as fast as your business needs it to.",
    intro:
      "When speed matters more than cost, our air freight service gets your shipment where it needs to be. From express next-flight-out options to standard scheduled cargo and charter capacity for oversized loads, we match the service level to your deadline.",
    heroChecklist: [
      "Express, standard, and charter service levels",
      "Approximate 1–7 day transit depending on route and service",
      "Global airport-to-airport and door-to-door coverage",
      "Dedicated handling for urgent and high-value cargo",
    ],
    valuePropHeading: "Why choose air freight with us",
    valuePropDescription:
      "We know that when you choose air freight, time is the priority. Our network of carrier relationships and airport handling partners means your shipment gets booked, moved, and delivered without unnecessary delay.",
    valuePropItems: [
      {
        title: "Speed when it counts",
        description:
          "Multiple service tiers — from next-flight-out express to standard scheduled cargo — so you only pay for the speed you actually need.",
      },
      {
        title: "Global airport network",
        description:
          "Coverage across major air cargo hubs worldwide, with the connections to reach secondary airports and regional destinations too.",
      },
      {
        title: "Charter flexibility",
        description:
          "For oversized, urgent, or high-volume shipments, we can arrange dedicated charter capacity outside scheduled airline space.",
      },
      {
        title: "Dedicated support",
        description:
          "An account manager who tracks your shipment's booking and handoffs and coordinates with airlines and ground handlers on your behalf.",
      },
    ],
    benefitsDescription:
      "Air freight is the right choice for time-critical shipments, high-value cargo, and situations where transit speed outweighs cost per kilogram.",
    benefits: [
      {
        icon: "✈️",
        title: "Fastest transit option",
        description: "The quickest way to move cargo across long distances, ideal for deadlines that ocean or road transport can't meet.",
      },
      {
        icon: "🎯",
        title: "Express service levels",
        description:
          "Next-flight-out and priority options for shipments where every hour matters, alongside standard and economy alternatives.",
      },
      {
        icon: "🌐",
        title: "Extensive route coverage",
        description: "Access to major and secondary airports worldwide through established carrier and ground-handling partnerships.",
      },
      {
        icon: "📦",
        title: "Charter capacity",
        description: "Dedicated aircraft space for oversized, urgent, or high-volume cargo that doesn't fit scheduled service.",
      },
      {
        icon: "📋",
        title: "Documentation & compliance",
        description: "Air waybills, customs paperwork, and dangerous-goods documentation handled by specialists who know the requirements.",
      },
    ],
    ctaHeading: "Need to move cargo fast?",
    ctaDescription:
      "Get a competitive quote for your air freight shipment. Our team will review your timeline and recommend the right service level.",
    primaryCta: { label: "Get a quote for air freight", href: localePath(locale, "/get-a-quote") },
    secondaryCta: { label: "Talk to an expert", href: localePath(locale, "/contact") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
