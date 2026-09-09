import { buttonClassName } from "./Button";
import { cx } from "./cx";

export interface DarkCtaBandProps {
  eyebrow?: string;
  heading: string;
  /** Fine-print line under the CTAs (e.g. response time, footprint stats). */
  meta?: string;
  /** href already locale-resolved by the caller — same convention as
   * ServiceIndustryTemplate's CTAs (see its doc comment). */
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  className?: string;
}

/**
 * A full-bleed dark CTA band — e.g. a closing "talk to a specialist" section
 * before the footer. Self-contained `data-mode="dark"`: apps/web's page
 * background otherwise never paints ink/steel (see palette.css), but a
 * nested `data-mode` block is the sanctioned way to drop a dark section
 * into an otherwise-light page (see modes.css's file comment) — same
 * mechanism the style-guide's dark previews already use.
 */
export function DarkCtaBand({
  eyebrow,
  heading,
  meta,
  primaryCta,
  secondaryCta,
  className,
}: DarkCtaBandProps) {
  return (
    <div data-mode="dark" className={cx("bg-background", className)}>
      <div className="mx-auto flex max-w-6xl flex-col gap-comfortable px-comfortable py-expansive sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-cozy">
          {eyebrow ? (
            <p className="font-mono text-xs font-medium uppercase tracking-wide text-beacon">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="max-w-xl font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {heading}
          </h2>
        </div>
        <div className="flex flex-col items-start gap-cozy">
          <div className="flex flex-wrap gap-cozy">
            <a href={primaryCta.href} className={buttonClassName("primary", "md")}>
              {primaryCta.label}
            </a>
            {secondaryCta ? (
              <a href={secondaryCta.href} className={buttonClassName("secondary", "md")}>
                {secondaryCta.label}
              </a>
            ) : null}
          </div>
          {meta ? <p className="font-mono text-xs uppercase tracking-wide text-muted">{meta}</p> : null}
        </div>
      </div>
    </div>
  );
}
