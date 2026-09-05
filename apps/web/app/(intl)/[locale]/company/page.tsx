import type { Metadata } from "next";
import { Card, COMPANY_LINKS } from "@freight/ui";
import { localePath } from "@/lib/locale/config";
import { getLocale } from "@/lib/locale/server";

export const metadata: Metadata = {
  title: "Company | Freight Platform",
  description:
    "About Freight Platform, our leadership team, sustainability commitments, governance, compliance, careers, investor information, and newsroom.",
};

export default async function CompanyPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-3xl font-semibold text-foreground">Company</h1>
        <p className="max-w-2xl text-base text-muted">
          Who we are, how we&rsquo;re run, and how to reach us about opportunities, partnerships,
          and press.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
        {COMPANY_LINKS.map((link) => (
          <a key={link.href} href={localePath(locale, link.href)} className="block h-full">
            <Card className="flex h-full items-center justify-between gap-cozy transition-colors duration-base hover:border-mist">
              <h3 className="font-display text-lg font-semibold text-foreground">{link.label}</h3>
              <span aria-hidden="true" className="text-muted">
                →
              </span>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
