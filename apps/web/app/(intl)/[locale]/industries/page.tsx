import type { Metadata } from "next";
import { ContentCard, INDUSTRIES } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Industries | Freight Platform",
  description:
    "Sector expertise, certifications, and specialist partners built in — logistics tailored to your industry.",
};

export default async function IndustriesPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Industries</h1>
        <p className="max-w-2xl text-base text-muted">
          Sector expertise, certifications, and specialist partners built in.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((industry) => (
          <ContentCard
            key={industry.slug}
            entry={industry}
            resolveHref={(href) => localePath(locale, href)}
          />
        ))}
      </div>
    </div>
  );
}
