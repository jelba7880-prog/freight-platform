import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Investor information | Freight Platform",
  description:
    "How to reach Freight Platform regarding investment, partnership, or strategic inquiries.",
};

export default async function InvestorsPage() {
  const locale = await getLocale();

  const content: CompanyPageContent = {
    headline: "Investor information",
    intro:
      "Freight Platform is privately held. We don't publish public financial filings or trade on a public exchange, but we're always open to conversations with investors and strategic partners who share our view of where freight forwarding is headed.",
    sections: [
      {
        type: "prose",
        heading: "Investment and partnership inquiries",
        paragraphs: [
          "If you're an investor, financial institution, or potential strategic partner looking to discuss Freight Platform — funding, partnership structures, or broader strategic collaboration — we'd like to hear from you. Reach out through our contact form and let us know the nature of your inquiry so it reaches the right person on our leadership team.",
        ],
      },
      {
        type: "prose",
        heading: "What to expect",
        paragraphs: [
          "Our leadership team, including our CFO, reviews investor and partnership inquiries directly. Given the range of conversations this covers — from capital partnerships to carrier and technology alliances — expect a personal reply rather than an automated response, and be ready to share a short summary of what you're proposing so we can route it appropriately.",
        ],
      },
    ],
    cta: { label: "Contact us about an investment or partnership", href: localePath(locale, "/contact") },
  };

  return <CompanyPageTemplate content={content} />;
}
