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

export const SERVICES: NavLink[] = [
  { label: "Sea freight", href: "/services/sea-freight" },
  { label: "Air freight", href: "/services/air-freight" },
  { label: "Road freight", href: "/services/road-freight" },
  {
    label: "Warehousing, fulfilment and distribution",
    href: "/services/warehousing-fulfilment-distribution",
  },
  { label: "Customs clearance", href: "/services/customs-clearance" },
  { label: "Cargo insurance", href: "/services/cargo-insurance" },
  { label: "E-commerce logistics", href: "/services/ecommerce-logistics" },
  { label: "Project logistics", href: "/services/project-logistics" },
  { label: "Sustainable logistics", href: "/services/sustainable-logistics" },
  { label: "Integrated logistics / 4PL", href: "/services/integrated-logistics-4pl" },
  { label: "Order management", href: "/services/order-management" },
  { label: "Cold-chain logistics", href: "/services/cold-chain-logistics" },
  { label: "Supply-chain consulting", href: "/services/supply-chain-consulting" },
  { label: "Digital logistics services", href: "/services/digital-logistics-services" },
];

export const INDUSTRIES: NavLink[] = [
  { label: "Aerospace", href: "/industries/aerospace" },
  { label: "Automotive and mobility", href: "/industries/automotive-mobility" },
  { label: "Consumer goods", href: "/industries/consumer-goods" },
  { label: "Healthcare", href: "/industries/healthcare" },
  { label: "Technology and semiconductors", href: "/industries/technology-semiconductors" },
  { label: "Industrial", href: "/industries/industrial" },
  { label: "Perishables", href: "/industries/perishables" },
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
export const DEFAULT_PRIMARY_ACTION: NavLink = { label: "Get a quote", href: "/get-a-quote" };

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
