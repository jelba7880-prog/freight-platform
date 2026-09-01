/**
 * Navigation content for Header/Footer, pulled directly from
 * /docs/Project_Overview.md's service/industry lists and Global
 * Navigation & Information Architecture section. Kept as plain data
 * (not props) on purpose: Header and Footer expose exactly one
 * page-configurable thing (Header's `primaryAction`) — everything else
 * here is fixed content, so a page can't casually grow the utility row
 * by passing a prop. Extending it means editing this file, a visible,
 * reviewable change to the shared design system.
 */
export interface NavLink {
  label: string;
  href: string;
}

export interface PrimaryNavItem extends NavLink {
  /** Dropdown content. Undefined = renders as a plain top-level link. */
  items?: NavLink[];
}

/**
 * Services and Industries carry richer content than a plain nav link: the
 * homepage's Services/Industries grids (see app/(intl)/[locale]/page.tsx)
 * render the same entries as cards, and need a stable `slug` (React key,
 * card icon monogram) and a `shortDescription` neither Header's mega-menu
 * nor Footer needs. `label`/`href` stay the fields Header/Footer already
 * consume generically via `NavLink`, so this is additive, not a rename.
 */
export interface ContentNavLink extends NavLink {
  slug: string;
  shortDescription: string;
  /**
   * Label for Header's contextual CTA when the visitor is on this entry's
   * own page — e.g. "Talk to a Sea Freight specialist" on the Sea Freight
   * service page. Absent means this entry's page doesn't override the
   * site-wide default. The CTA targets `ctaHref` when present, falling
   * back to `DEFAULT_PRIMARY_ACTION.href` otherwise. See
   * `resolveContextualCta`.
   */
  ctaLabel?: string;
  /**
   * Href for the contextual CTA above. Absent means the CTA falls back to
   * `DEFAULT_PRIMARY_ACTION.href` (the common case: most services/industries
   * just want a differently-worded specialist CTA, not a different
   * destination).
   */
  ctaHref?: string;
}

export const SERVICES: ContentNavLink[] = [
  {
    slug: "sea-freight",
    label: "Sea freight",
    href: "/services/sea-freight",
    shortDescription: "Full container and consolidated ocean freight across major global trade lanes.",
    ctaLabel: "Talk to a Sea Freight specialist",
    ctaHref: "/contact",
  },
  {
    slug: "air-freight",
    label: "Air freight",
    href: "/services/air-freight",
    shortDescription: "Time-critical air cargo with express, standard, and charter options worldwide.",
    ctaLabel: "Talk to an Air Freight specialist",
    ctaHref: "/contact",
  },
  {
    slug: "road-freight",
    label: "Road freight",
    href: "/services/road-freight",
    shortDescription: "Full-truckload, part-load, and cross-border road transport across regions.",
    ctaLabel: "Talk to a Road Freight specialist",
    ctaHref: "/contact",
  },
  {
    slug: "warehousing-fulfilment-distribution",
    label: "Warehousing, fulfilment and distribution",
    href: "/services/warehousing-fulfilment-distribution",
    shortDescription: "Storage, pick-and-pack, and last-mile distribution from a global facility network.",
    ctaLabel: "Talk to a Warehousing, Fulfilment and Distribution specialist",
    ctaHref: "/contact",
  },
  {
    slug: "customs-clearance",
    label: "Customs clearance",
    href: "/services/customs-clearance",
    shortDescription: "Import and export clearance handled by specialists who know local regulations.",
    ctaLabel: "Talk to a Customs Clearance specialist",
    ctaHref: "/contact",
  },
  {
    slug: "cargo-insurance",
    label: "Cargo insurance",
    href: "/services/cargo-insurance",
    shortDescription: "Protect shipments in transit with coverage tailored to cargo value and risk.",
    ctaLabel: "Talk to a Cargo Insurance specialist",
    ctaHref: "/contact",
  },
  {
    slug: "ecommerce-logistics",
    label: "E-commerce logistics",
    href: "/services/ecommerce-logistics",
    shortDescription: "Fulfilment and returns logistics built for high-volume online retail.",
    ctaLabel: "Talk to an E-commerce Logistics specialist",
    ctaHref: "/contact",
  },
  {
    slug: "cold-chain-logistics",
    label: "Cold-chain logistics",
    href: "/services/cold-chain-logistics",
    shortDescription: "Temperature-controlled transport and storage for sensitive, perishable cargo.",
    ctaLabel: "Talk to a Cold-chain Logistics specialist",
    ctaHref: "/contact",
  },
];

export const INDUSTRIES: ContentNavLink[] = [
  {
    slug: "automotive-mobility",
    label: "Automotive and mobility",
    href: "/industries/automotive-mobility",
    shortDescription: "Just-in-time and just-in-sequence logistics for automotive supply chains.",
    ctaLabel: "Talk to an Automotive and Mobility specialist",
    ctaHref: "/contact",
  },
  {
    slug: "consumer-goods",
    label: "Consumer goods",
    href: "/industries/consumer-goods",
    shortDescription: "Reliable, scalable logistics for fast-moving consumer goods brands.",
    ctaLabel: "Talk to a Consumer Goods specialist",
    ctaHref: "/contact",
  },
  {
    slug: "healthcare",
    label: "Healthcare",
    href: "/industries/healthcare",
    shortDescription: "Compliant, temperature-controlled logistics for pharma and medical devices.",
    ctaLabel: "Talk to a Healthcare specialist",
    ctaHref: "/contact",
  },
  {
    slug: "technology-semiconductors",
    label: "Technology and semiconductors",
    href: "/industries/technology-semiconductors",
    shortDescription: "Secure, time-critical logistics for high-value tech and semiconductor cargo.",
    ctaLabel: "Talk to a Technology and Semiconductors specialist",
    ctaHref: "/contact",
  },
  {
    slug: "industrial",
    label: "Industrial",
    href: "/industries/industrial",
    shortDescription: "Heavy machinery and industrial equipment logistics, door to door.",
    ctaLabel: "Talk to an Industrial specialist",
    ctaHref: "/contact",
  },
];

/**
 * Primary navigation: Services -> Industries -> Solutions -> Digital
 * Services -> Locations -> Company -> Resources. Only Services and
 * Industries carry real dropdown content for this pass; the rest are
 * top-level links (stub routes, 404 cleanly for now).
 */
export const PRIMARY_NAV: PrimaryNavItem[] = [
  { label: "Services", href: "/services", items: SERVICES },
  { label: "Industries", href: "/industries", items: INDUSTRIES },
  { label: "Solutions", href: "/solutions" },
  { label: "Digital Services", href: "/digital-services" },
  { label: "Locations", href: "/locations" },
  { label: "Company", href: "/company" },
  { label: "Resources", href: "/resources" },
];

/**
 * Persistent utility actions — lightweight, fixed weight, always present.
 * Deliberately NOT a Header prop (see file comment). Search isn't listed
 * here: it's a disclosure (icon -> input), handled separately in Header.
 * Track/Locations/Contact route to stub pages that 404 cleanly for now.
 */
export const UTILITY_LINKS: NavLink[] = [
  { label: "Track shipment", href: "/track" },
  { label: "Find a location", href: "/locations" },
  { label: "Talk to an expert", href: "/contact" },
];

export const PORTAL_LINK: NavLink = { label: "Portal login", href: "/portal-login" };

/** Site-wide fallback when a page doesn't specify its own contextual CTA. */
export const DEFAULT_PRIMARY_ACTION: NavLink = { label: "Track shipment", href: "/track" };

/**
 * Resolves Header's contextual CTA purely from route data, so Header never
 * needs a hardcoded route string or per-page conditional — adding a new
 * page's CTA (Healthcare, say) means setting `ctaLabel` on its
 * SERVICES/INDUSTRIES entry, not editing Header.tsx.
 *
 * A pure lookup: `path` must already be the canonical, locale-stripped
 * path (matching the `href`s in this file exactly). This function has no
 * opinion on locales or prefixes — that normalization is the caller's job
 * (see `stripLocalePrefix`, used by `Header`) and deliberately doesn't
 * live here, so this stays a plain data lookup.
 */
export function resolveContextualCta(path: string): NavLink | undefined {
  const entry = [...SERVICES, ...INDUSTRIES].find(
    (item) => item.ctaLabel !== undefined && item.href === path,
  );
  return entry
    ? { label: entry.ctaLabel!, href: entry.ctaHref ?? DEFAULT_PRIMARY_ACTION.href }
    : undefined;
}

/**
 * Footer — Company layer. Careers and Newsroom point at their eventual
 * real destinations conceptually; the buy-vs-build decision on those
 * (dedicated ATS / PR platform per Project_Overview.md) is a later infra
 * task, not this one. Careers lives ONLY here (and nowhere in Header):
 * it must never share a row with commercial actions.
 */
export const COMPANY_LINKS: NavLink[] = [
  { label: "About", href: "/company/about" },
  { label: "Leadership", href: "/company/leadership" },
  { label: "Sustainability", href: "/company/sustainability" },
  { label: "Corporate governance", href: "/company/governance" },
  { label: "Compliance", href: "/company/compliance" },
  { label: "Careers", href: "/careers" },
  { label: "Investor information", href: "/company/investors" },
  { label: "Newsroom", href: "/newsroom" },
];

/** Footer — Resources layer (the informational/SEO knowledge hub). */
export const RESOURCES_LINKS: NavLink[] = [
  { label: "Market insights", href: "/resources/market-insights" },
  { label: "Industry insights", href: "/resources/industry-insights" },
  { label: "Success stories", href: "/resources/success-stories" },
  { label: "How-to guides", href: "/resources/how-to-guides" },
  { label: "Webinars", href: "/resources/webinars" },
  { label: "Logistics knowledge", href: "/resources/logistics-knowledge" },
  { label: "Regulatory information", href: "/resources/regulatory-information" },
  { label: "Glossaries", href: "/resources/glossaries" },
  { label: "Shipping references", href: "/resources/shipping-references" },
];
