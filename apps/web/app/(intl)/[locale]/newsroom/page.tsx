import type { Metadata } from "next";
import { CompanyPageTemplate, type CompanyPageContent } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Newsroom | Freight Platform",
  description: "Press and media coverage of Freight Platform isn't compiled here yet — reach out directly.",
};

export default async function NewsroomPage() {
  const locale = await getLocale();

  const content: CompanyPageContent = {
    headline: "Newsroom",
    intro:
      "We don't have a press or media page set up yet to house announcements, coverage, or a media kit.",
    sections: [
      {
        type: "prose",
        heading: "Press inquiries",
        paragraphs: [
          "If you're a journalist or media contact looking for information, comment, or an interview with Freight Platform, reach out through our contact form and let us know your deadline. A member of our team will follow up directly.",
        ],
      },
    ],
    cta: { label: "Contact us about a press inquiry", href: localePath(locale, "/contact") },
  };

  return <CompanyPageTemplate content={content} />;
}
