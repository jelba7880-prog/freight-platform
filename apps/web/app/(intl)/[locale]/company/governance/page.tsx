import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";

export const metadata: Metadata = {
  title: "Corporate governance | Freight Platform",
  description:
    "How Freight Platform's board and executive leadership oversee risk, audit, and accountability across the business.",
};

export default function GovernancePage() {
  const content: CompanyPageContent = {
    headline: "Corporate governance",
    intro:
      "Freight forwarding runs on trust — customers hand us their cargo and their customs declarations, carriers extend us credit and capacity, and both expect the company behind that trust to be run with real oversight.",
    sections: [
      {
        type: "prose",
        heading: "Board oversight",
        paragraphs: [
          "Our board of directors includes independent members with backgrounds in international trade, logistics operations, and financial oversight, alongside the company's executive leadership. The board meets quarterly to review operational performance, financial results, and material risks, with standing committees for audit and for compliance matters specific to customs and trade regulation.",
        ],
      },
      {
        type: "prose",
        heading: "Risk and audit",
        paragraphs: [
          "An independent audit function reviews financial controls and operational processes annually, with findings reported directly to the audit committee rather than through operational management. Trade compliance — export control screening, customs documentation accuracy, sanctions list checks — is audited separately given the regulatory exposure specific to moving goods across borders.",
        ],
      },
      {
        type: "prose",
        heading: "Accountability",
        paragraphs: [
          "Executive compensation is tied in part to service reliability and compliance metrics, not solely growth or margin, so leadership incentives stay aligned with the operational trust the business depends on. Material governance and compliance matters are escalated to the board directly, not filtered exclusively through executive reporting.",
        ],
      },
    ],
  };

  return <CompanyPageTemplate content={content} />;
}
