import { Card } from "./Card";
import { buttonClassName } from "./Button";

/**
 * Content for a Company sub-page (About, Leadership, Sustainability,
 * Governance, Compliance, Investor info, and the Careers/Newsroom
 * placeholders). Deliberately not ServiceIndustryTemplate: those are
 * commercial hero-checklist-CTA pages selling a service; these are
 * informational/corporate pages that just need a headline, an intro, and a
 * flexible run of sections — a structurally different shape, not a variant
 * of the same one.
 *
 * Two section types cover every page this template actually serves: plain
 * prose (About, Sustainability, Governance, Compliance, the Careers/
 * Newsroom placeholders) and a people grid (Leadership only). No third
 * section type exists because nothing here needs one yet.
 */
export interface CompanyProseSection {
  type: "prose";
  heading: string;
  /** One <p> per entry — kept as separate paragraphs rather than one long
   * string so callers don't have to embed layout markup in copy. */
  paragraphs: string[];
}

export interface CompanyPersonEntry {
  name: string;
  title: string;
  /** A single sentence — this is a bio card, not a full profile. */
  bio: string;
}

export interface CompanyPeopleSection {
  type: "people";
  heading: string;
  people: CompanyPersonEntry[];
}

export type CompanySection = CompanyProseSection | CompanyPeopleSection;

export interface CompanyPageContent {
  headline: string;
  intro: string;
  sections: CompanySection[];
  /**
   * Optional single CTA at the end (Investor info, Careers, Newsroom all
   * point this at /contact). Absent means no CTA renders. href is already
   * locale-resolved by the caller — same convention as
   * ServiceIndustryContent's primaryCta/secondaryCta, for the same reason:
   * packages/ui takes no dependency on apps/web's locale config.
   */
  cta?: { label: string; href: string };
}

export interface CompanyPageTemplateProps {
  content: CompanyPageContent;
}

export function CompanyPageTemplate({ content }: CompanyPageTemplateProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-expansive px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <h1 className="font-display text-4xl font-semibold text-foreground">{content.headline}</h1>
        <p className="max-w-2xl text-base text-muted">{content.intro}</p>
      </header>

      {content.sections.map((section, index) => (
        <section key={index} className="flex flex-col gap-comfortable">
          <h2 className="font-display text-2xl font-semibold text-foreground">{section.heading}</h2>

          {section.type === "prose" ? (
            <div className="flex flex-col gap-cozy">
              {section.paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="max-w-2xl text-base text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2">
              {section.people.map((person, personIndex) => (
                <Card key={personIndex} className="flex flex-col gap-tight">
                  <h3 className="font-display text-base font-semibold text-foreground">{person.name}</h3>
                  <p className="text-sm font-medium text-beacon">{person.title}</p>
                  <p className="text-sm text-muted">{person.bio}</p>
                </Card>
              ))}
            </div>
          )}
        </section>
      ))}

      {content.cta ? (
        <div>
          <a href={content.cta.href} className={buttonClassName("primary", "md")}>
            {content.cta.label}
          </a>
        </div>
      ) : null}
    </div>
  );
}
