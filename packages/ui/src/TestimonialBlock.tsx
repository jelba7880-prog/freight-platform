import { cx } from "./cx";

export interface TestimonialBlockProps {
  quote: string;
  attributionName: string;
  attributionDetail: string;
  className?: string;
}

/** A pull-quote with a two-line attribution (role, then org) — no photo or
 * logo, matching the rest of the marketing site's text-first, data-dense
 * visual language rather than a typical headshot testimonial card. */
export function TestimonialBlock({
  quote,
  attributionName,
  attributionDetail,
  className,
}: TestimonialBlockProps) {
  return (
    <figure className={cx("flex flex-col gap-comfortable", className)}>
      <blockquote className="max-w-lg font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
        “{quote}”
      </blockquote>
      <figcaption className="font-mono text-xs uppercase leading-relaxed tracking-wide text-muted">
        {attributionName}
        <br />
        {attributionDetail}
      </figcaption>
    </figure>
  );
}
