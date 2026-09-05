import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";

export const metadata: Metadata = {
  title: "Compliance | Freight Platform",
  description:
    "Freight Platform's approach to trade compliance, sanctions screening, data protection, and ethical business conduct.",
};

export default function CompliancePage() {
  const content: CompanyPageContent = {
    headline: "Compliance",
    intro:
      "Moving freight across borders means operating under customs, export control, and sanctions regimes in every country we touch. We treat compliance as a precondition for taking a shipment, not a step we get to after booking it.",
    sections: [
      {
        type: "prose",
        heading: "Trade and customs compliance",
        paragraphs: [
          "Every shipment is screened against restricted and denied party lists before booking, and our customs documentation teams are trained to the classification and valuation standards of the jurisdictions we clear through. Where a shipment's commodity, destination, or end use raises an export control question, it's escalated to our compliance team before it moves — not flagged after the fact.",
        ],
      },
      {
        type: "prose",
        heading: "Data protection",
        paragraphs: [
          "Shipment, customer, and customs data is handled under data protection practices aligned with the markets we operate in, including access controls limiting who inside the company can see a given customer's shipment or documentation. We don't sell shipment or customer data, and we share it with carriers and customs authorities only as needed to move and clear a shipment.",
        ],
      },
      {
        type: "prose",
        heading: "Ethics and reporting",
        paragraphs: [
          "Our code of conduct sets clear standards on anti-bribery, conflicts of interest, and fair dealing with carriers and partners, and applies to every employee regardless of role or region. Concerns can be raised confidentially through our compliance team, and are reviewed independently of the business unit involved.",
        ],
      },
    ],
  };

  return <CompanyPageTemplate content={content} />;
}
