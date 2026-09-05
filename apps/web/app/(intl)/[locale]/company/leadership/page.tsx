import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";

export const metadata: Metadata = {
  title: "Leadership | Freight Platform",
  description:
    "The executive team leading Freight Platform's global freight forwarding and logistics operations.",
};

export default function LeadershipPage() {
  const content: CompanyPageContent = {
    headline: "Leadership",
    intro:
      "Our executive team brings together operators from ocean carriers, customs brokerages, and logistics technology — people who've run the freight, not just studied it.",
    sections: [
      {
        type: "people",
        heading: "Executive team",
        people: [
          {
            name: "Elena Marchetti",
            title: "Chief Executive Officer",
            bio: "Two decades in ocean carrier commercial operations before founding Freight Platform to fix the handoffs between forwarders, carriers, and customs brokers.",
          },
          {
            name: "Kwame Asante",
            title: "Chief Operating Officer",
            bio: "Built and ran regional network operations for a global freight forwarder across three continents before joining to lead day-to-day service delivery.",
          },
          {
            name: "Priya Raman",
            title: "Chief Financial Officer",
            bio: "Former finance lead for a multimodal logistics group, focused on the unit economics of freight capacity and long-term carrier partnerships.",
          },
          {
            name: "Lars Eriksson",
            title: "Chief Technology Officer",
            bio: "Spent a decade building tracking and booking systems for supply-chain software vendors before taking on Freight Platform's own technology stack.",
          },
          {
            name: "Naomi Cohen-Reyes",
            title: "Chief Compliance Officer",
            bio: "Trade compliance attorney turned in-house counsel, responsible for customs, export control, and regulatory compliance across every market we operate in.",
          },
        ],
      },
    ],
  };

  return <CompanyPageTemplate content={content} />;
}
