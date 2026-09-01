import type { Metadata } from "next";
import { ContentCard, SERVICES } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Services | Freight Platform",
  description:
    "Every mode and value-added service, from a single partner — sea, air, and road freight, customs clearance, warehousing, and more.",
};

export default async function ServicesPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Services</h1>
        <p className="max-w-2xl text-base text-muted">
          Every mode and value-added service, from a single partner.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <ContentCard
            key={service.slug}
            entry={service}
            resolveHref={(href) => localePath(locale, href)}
          />
        ))}
      </div>
    </div>
  );
}
