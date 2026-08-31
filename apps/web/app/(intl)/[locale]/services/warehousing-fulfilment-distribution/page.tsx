import type { Metadata } from "next";
import { ServiceIndustryTemplate, type ServiceIndustryContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Warehousing, Fulfilment and Distribution | Freight Platform",
  description:
    "Storage, pick-and-pack, and last-mile distribution from a global facility network. Scalable space and fulfilment operations built around your inventory.",
};

export default async function WarehousingFulfilmentDistributionPage() {
  const locale = await getLocale();

  const content: ServiceIndustryContent = {
    name: "Warehousing, fulfilment and distribution",
    monogram: "WD",
    monogramTagline: "Storage, pick-and-pack & last-mile distribution",
    headline: "Warehousing and fulfilment that scales with your inventory.",
    intro:
      "From short-term storage to full pick-and-pack fulfilment, our warehousing service gives you space and operations that flex with demand. A global facility network means your inventory sits closer to your customers, wherever they are.",
    heroChecklist: [
      "Short- and long-term storage across a global facility network",
      "Pick-and-pack fulfilment for order volumes of any size",
      "Last-mile distribution to retail and direct-to-consumer channels",
      "Inventory visibility across every facility",
    ],
    valuePropHeading: "Why choose warehousing and fulfilment with us",
    valuePropDescription:
      "Storage and fulfilment needs change with the season and the order volume. We build capacity that scales with you, so you're never short on space during a peak or paying for space you don't need in a slow month.",
    valuePropItems: [
      {
        title: "Scalable storage",
        description:
          "Facility space that expands and contracts with your inventory needs, from a single pallet to a full warehouse footprint.",
      },
      {
        title: "Pick-and-pack fulfilment",
        description:
          "Order fulfilment operations built to handle everyday volume and seasonal spikes without a drop in accuracy or speed.",
      },
      {
        title: "Global facility network",
        description:
          "Storage and distribution points positioned to shorten the last mile to your customers, wherever they're ordering from.",
      },
      {
        title: "Inventory visibility",
        description:
          "Clear visibility into stock levels and movement across every facility, so you always know what you have and where it is.",
      },
    ],
    benefitsDescription:
      "Built for businesses that need storage and fulfilment to move at the pace of their order volume, not the other way around.",
    benefits: [
      {
        icon: "🏭",
        title: "Flexible facility space",
        description: "Storage capacity that scales up or down with your inventory, without long-term overcommitment.",
      },
      {
        icon: "📦",
        title: "Accurate pick-and-pack",
        description: "Fulfilment operations designed for consistent accuracy across everyday and peak order volumes.",
      },
      {
        icon: "🚚",
        title: "Last-mile distribution",
        description: "Distribution coordinated from facility to final destination across retail and direct channels.",
      },
      {
        icon: "🌍",
        title: "Global network reach",
        description: "A facility footprint that positions your inventory closer to the customers you're shipping to.",
      },
      {
        icon: "📊",
        title: "Inventory tracking",
        description: "Visibility into stock levels and movement, so decisions about restocking and allocation stay informed.",
      },
    ],
    ctaHeading: "Ready to scale your warehousing and fulfilment?",
    ctaDescription:
      "Talk to a warehousing and fulfilment specialist about your storage and order volume. Our team will recommend the right facility footprint and fulfilment setup.",
    primaryCta: {
      label: "Talk to a Warehousing, Fulfilment and Distribution specialist",
      href: localePath(locale, "/contact"),
    },
    secondaryCta: { label: "Track shipment", href: localePath(locale, "/track") },
  };

  return <ServiceIndustryTemplate content={content} />;
}
