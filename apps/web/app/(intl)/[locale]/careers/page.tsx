import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Careers | Freight Platform",
  description: "Open roles at Freight Platform aren't listed here yet — reach out directly.",
};

export default async function CareersPage() {
  const locale = await getLocale();

  const content: CompanyPageContent = {
    headline: "Careers",
    intro:
      "We're growing our operations, technology, and customer teams, but we don't have a careers site up yet to list roles or take applications through.",
    sections: [
      {
        type: "prose",
        heading: "In the meantime",
        paragraphs: [
          "If you're interested in working at Freight Platform, get in touch through our contact form with a short note about your background and the kind of role you're looking for. We'll follow up directly rather than through an automated applicant system — there isn't one yet.",
        ],
      },
    ],
    cta: { label: "Get in touch about opportunities", href: localePath(locale, "/contact") },
  };

  return <CompanyPageTemplate content={content} />;
}
