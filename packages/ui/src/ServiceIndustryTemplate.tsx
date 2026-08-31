import { Badge } from "./Badge";
import { buttonClassName } from "./Button";
import { Card } from "./Card";

/**
 * Content for a service/industry detail page (Sea Freight, Healthcare, and
 * the rest of SERVICES/INDUSTRIES in nav-data.ts once they're built). Pulled
 * out once two independently hand-built pages — one service, one industry —
 * turned out to share an identical structure, so this is the content those
 * two pages actually needed, not a guess at what future pages might want.
 *
 * Two things every real page so far has kept identical are fixed inside the
 * template instead of living here: the hero Badge's variant ("neutral") and
 * the benefits section's heading ("Key benefits"). Turning those into fields
 * would just invite silent drift across future pages for no content gain.
 *
 * This component takes no `locale` prop and does no locale-awareness of its
 * own — `primaryCta.href`/`secondaryCta.href` are rendered as plain,
 * already-resolved strings. packages/ui must not take a dependency on
 * apps/web's app-specific lib/locale/config.ts (the same boundary issue
 * tracked separately for Header/Footer), so each page still calls
 * `localePath(locale, ...)` itself when building this object.
 */
export interface ServiceIndustryContent {
  /** Badge text AND hero side-panel title — one field, both use sites. */
  name: string;
  /** e.g. "SF" — authored per page, not derived from `name`. */
  monogram: string;
  /** Hero side-panel subtitle — independent copy, not nav-data.ts's shortDescription. */
  monogramTagline: string;
  headline: string;
  intro: string;
  /** Both current examples use 4 — not a hard constraint. */
  heroChecklist: string[];
  valuePropHeading: string;
  valuePropDescription: string;
  /** Both current examples use 4. */
  valuePropItems: { title: string; description: string }[];
  benefitsDescription: string;
  /** 3–5 per Project_Overview.md's content model. */
  benefits: { icon: string; title: string; description: string }[];
  ctaHeading: string;
  ctaDescription: string;
  /** href already locale-resolved by the caller — see the locale note above. */
  primaryCta: { label: string; href: string };
  /** href already locale-resolved by the caller — see the locale note above. */
  secondaryCta: { label: string; href: string };
}

export interface ServiceIndustryTemplateProps {
  content: ServiceIndustryContent;
}

export function ServiceIndustryTemplate({ content }: ServiceIndustryTemplateProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-expansive px-comfortable py-expansive">
      {/* Hero section */}
      <section className="grid grid-cols-1 items-center gap-loose lg:grid-cols-2">
        <div className="flex flex-col gap-cozy">
          <Badge variant="neutral">{content.name}</Badge>
          <h1 className="font-display text-4xl font-semibold text-foreground">{content.headline}</h1>
          <p className="max-w-lg text-base text-muted">{content.intro}</p>
        </div>

        <div className="flex flex-col gap-tight rounded-lg border border-border bg-surface p-comfortable">
          <div className="flex items-center gap-snug">
            <div className="flex size-12 items-center justify-center rounded-md border border-border bg-background font-mono text-lg font-semibold text-foreground">
              {content.monogram}
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-foreground">{content.name}</span>
              <span className="text-xs text-muted">{content.monogramTagline}</span>
            </div>
          </div>
          <div className="border-t border-border pt-comfortable">
            <ul className="flex flex-col gap-snug">
              {content.heroChecklist.map((item, index) => (
                <li key={index} className="flex gap-snug text-sm text-muted">
                  <span className="shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="flex flex-col gap-comfortable rounded-lg border border-border bg-surface p-comfortable lg:p-expansive">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">{content.valuePropHeading}</h2>
          <p className="max-w-2xl text-base text-muted">{content.valuePropDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-comfortable sm:grid-cols-2">
          {content.valuePropItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-tight">
              <h3 className="font-display text-base font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key benefits as cards */}
      <section className="flex flex-col gap-comfortable">
        <div className="flex flex-col gap-tight">
          <h2 className="font-display text-2xl font-semibold text-foreground">Key benefits</h2>
          <p className="max-w-2xl text-base text-muted">{content.benefitsDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-cozy sm:grid-cols-2 lg:grid-cols-3">
          {content.benefits.map((benefit, index) => (
            <Card key={index} className="flex flex-col gap-cozy">
              <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background font-mono text-sm font-medium text-foreground">
                {benefit.icon}
              </div>
              <div className="flex flex-col gap-tight">
                <h3 className="font-display text-base font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="flex flex-col gap-comfortable rounded-lg border border-border/50 bg-background p-comfortable lg:p-expansive">
        <div className="flex flex-col gap-snug">
          <h2 className="font-display text-2xl font-semibold text-foreground">{content.ctaHeading}</h2>
          <p className="max-w-lg text-base text-muted">{content.ctaDescription}</p>
        </div>
        <div className="flex flex-wrap gap-cozy pt-tight">
          <a href={content.primaryCta.href} className={buttonClassName("primary", "md")}>
            {content.primaryCta.label}
          </a>
          <a href={content.secondaryCta.href} className={buttonClassName("secondary", "md")}>
            {content.secondaryCta.label}
          </a>
        </div>
      </section>
    </div>
  );
}
