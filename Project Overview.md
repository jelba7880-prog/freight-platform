We are building a modern global freight-forwarding and logistics platform inspired by the structure, customer journeys, information architecture, and operational capabilities of the Kuehne+Nagel website, while introducing a substantially more refined visual system, clearer user experience, and a more modern technical foundation.

The platform will function as both a corporate logistics website and an operational digital shipping platform. It will allow customers to discover logistics services, understand available transportation options, talk directly with logistics specialists to get pricing and book a shipment, locate facilities and offices, track shipments, and manage their shipments through a secure customer portal.

The objective is not to create a simple company website. The objective is to build a digital logistics ecosystem in which the public website acts as the acquisition, information, and service-discovery layer while the authenticated customer platform handles actual shipment management.

Core Product Structure

The platform is organised around the same fundamental hierarchy Kuehne+Nagel uses — services, industries, specialist contact, tracking, and a customer portal — but several of these areas are specified more precisely below than a naive reading of the reference site would produce.

1. Transportation & Logistics Services

Customers will be able to explore the company's logistics capabilities across major transportation and supply-chain categories.

Primary services:

Sea freight
Air freight
Road freight
Warehousing, fulfilment and distribution
Customs clearance
Cargo insurance
E-commerce logistics
Project logistics
Sustainable logistics
Integrated logistics / 4PL
Order management
Cold-chain logistics
Supply-chain consulting
Digital logistics services

Kuehne+Nagel groups its offering around transportation, fulfilment, value-added services, supply-chain management and digital services — we follow the same grouping.

Content model per service (amended): each service gets exactly one service page — short, benefit-led, conversion-focused (hero, value proposition, 3–5 key benefits, one dominant CTA). It does not try to also carry deep process detail, an options comparison, and FAQs.

Why: K+N's own service pages (checked against Sea Freight and Healthcare) follow this exact pattern — a hero, a handful of benefit blocks, a sustainability callout, links out to specialised tools, and nothing resembling a process walkthrough or FAQ. Commercial intent and informational intent don't rank or convert the same way; a page trying to do both dilutes both.
Deep informational content (process detail, available options, comparisons, FAQs, glossaries) lives in a separate Guides & Reference content type (see Content & Knowledge Platform below) and is cross-linked from the service page, not embedded in it.
Unlike K+N, we will ship real FAQ content — but as a collapsible block on the guide page, not stacked into the service page's above-the-fold flow.

Each service page still ends in a clear conversion action — a contextual "Talk to a [Service] Specialist" as the dominant CTA, with Track Shipment as the secondary path — matching K+N's pattern of one dominant conversion action per page, though the specific action diverges from K+N's quote-first approach (see Pricing & Booking, below).

2. Industry-Specific Solutions

The site will not present logistics as a one-size-fits-all product. Customers navigate solutions by industry:

Aerospace
Automotive and mobility
Consumer goods
Healthcare
Technology and semiconductors
Industrial
Perishables

This mirrors K+N's industry architecture, where services are connected to sector-specific expertise (certifications, compliance standards, named specialist partners). Industry pages follow the same short, benefit-led template as service pages for the same reason.

3. Pricing & Booking — Direct Specialist Contact (rewritten again)

The previous version of this section replaced a single naive quotation workflow with two explicit tiers: an instant, rate-engine-backed calculation for standard lanes (Tier A), falling back to a request-for-quote queue routed to a sales/ops team for everything else (Tier B). That model has itself been removed in favor of the simpler approach below — documented here, rather than silently rewritten, per this doc's own convention for tracking deviations.

Why the tier split went away: it existed only to justify Tier A — a live rate/tariff engine maintained for a handful of standard lanes. Industry pages never had a Tier A path to begin with; they always led with "Talk to a specialist," and that model works just as well for services. Maintaining a second, calculator-backed path for a minority of lanes was real, ongoing engineering and operations cost for a benefit — a live number instead of a human response — that didn't hold up once every other service and every industry page already worked the same, simpler way.

Amended design: every service and industry page's primary conversion path is a direct conversation with a specialist via a contact/inquiry route, not a self-service calculator. No Tier A/B distinction — every mode, standard or not, works identically.

The inquiry form captures: origin, destination, shipment type, cargo details, weight, dimensions, number of packages, container requirements, preferred service, special handling requirements, shipping date, and contact information. Submitting it creates a structured inquiry routed to the sales/ops queue with SLA tracking — what a Tier B request used to produce, now the only path for every service. The UI stays honest about this throughout: no step should ever imply a live calculation is running when the outcome is actually a specialist's response.

4. Shipment Tracking

Shipment tracking is a first-class feature, available in two forms:

Public tracking — anonymous, reference-number-only lookup (no login required), returning current status, milestones, and ETA. Mirrors K+N's public tracking endpoint.
Authenticated tracking (inside the customer portal) — full detail: current shipment status, origin, destination, milestones, current location, estimated arrival, transport mode, vessel/flight/truck information where available, shipment history, relevant documents, exceptions or delays, delivery status, plus proactive milestone alerts.

Tracking is surfaced directly alongside the specialist-contact CTA on the homepage and in the persistent header, matching K+N's real prioritisation of these two actions above everything else.

**Data source — deliberately manual, not carrier-integrated (amended, new):** the tracking data behind both public and authenticated tracking is authored and maintained internally, through the admin platform — operations staff manually create and update tracking events (status changes, milestones, current location, ETA) per shipment. There is no live integration with carrier, ocean-schedule, airline-cargo, or port-system tracking APIs behind this feature.

- *Why:* those integrations require real commercial relationships with carriers and their APIs, which this project doesn't have and isn't assuming. Building the tracking *product* — the data model, the public/portal UX, the milestone and exception surface — doesn't require that data originate externally; it requires that it exist and be structured correctly. Admin-authored data satisfies both the customer-facing experience and the underlying schema identically to API-sourced data.
- This doesn't change the customer-facing feature: public reference-number lookup and authenticated portal tracking work exactly as specified. It changes only where the data comes from.
- The Tracking events admin surface (already scoped as a custom-built core admin domain) is the *primary authoring interface* for shipment status, not a supplementary view onto externally-ingested data.
- A live carrier/tracking-API integration remains a legitimate future enhancement, not a blocking dependency — this feature works end-to-end without it.

5. Customer Portal — Single Unified Application (amended)

The customer portal is the most important operational component. Architectural principle: this is built as one coherent application — one auth/session domain, one design system, one data model — with booking, tracking, documents, and reporting as routes inside that single app, not as separately built products stitched together at the navigation layer.

Why this is called out explicitly: K+N's own myKN is not one app. It's a federation of route islands (/oq/ quote, /fs/ sea, /fa/ air, /ac/ auth, /cc/ dashboard, /public-tracking/, even a mode-specific news feed) — the product of a 10+ year incremental buildout, and myKN's own marketing copy admits it: customers are still being migrated off a predecessor product ("KN Login") that was never fully retired. That fragmentation is a legacy cost K+N is stuck with. We are not — being greenfield is the one advantage we have over the reference site, and the fastest way to squander it is to let "book," "track," and "manage" become separately-owned surfaces that need a second rebuild in five years to unify.

The customer portal allows registered customers to:

Request pricing and booking help from a specialist through the portal
Review and confirm the booking a specialist proposes
Create and manage bookings
Track shipments
View shipment history
Access transportation and commercial documents
Review schedules and routing options
Monitor shipment milestones
Receive shipment alerts
View reporting and analytics
Manage account and preferences

Registration is self-serve and free, matching K+N's model. The portal is a genuine SaaS-style logistics dashboard, not a login page bolted onto the corporate site.

Global Locations — Search-First, Not Map-First (amended)

The original spec called for the location finder to be made easier to use "through interactive maps." Having checked the live implementation, this is one place where K+N's actual approach is the right one, and we should follow it rather than the original spec's instinct.

K+N's /company/locations page is a filterable search returning a result list — not a live interactive map with ~1,300 pins rendered by default. The homepage shows one static map image purely as a link into that search.
Why: a live map with 1,300+ markers is expensive to build well (clustering, mobile performance, accessibility) and less useful than fast text search for the actual use case — a logistics coordinator searching "office in Rotterdam" wants an address and phone number in one click, not a map to zoom into.

Amended design: search-first as the primary interaction — country / city / postcode / service-type filtering, returning a fast result list with contact info and services offered at each location. A map is a secondary view rendering only the current filtered result set (never all locations at once), available as a toggle, not the default.

Global Navigation & Information Architecture

Primary navigation: Services → Industries → Solutions → Digital Services → Locations → Company → Resources

The Company layer contains: About, Leadership, Sustainability, Corporate governance, Compliance, Careers, Investor information, Newsroom.

The Resources layer contains: Market insights, Industry insights, Success stories, How-to guides, Webinars, Logistics knowledge, Regulatory information, Glossaries, Shipping references.

CTA hierarchy (amended, new): K+N repeats an identical five-action utility panel (Get a quote / Talk to an expert / Track / Find a location / Find a job) on every single page, regardless of context — a sea-freight page surfaces "Find a job" with the same visual weight as "Get a quote," which has nothing to do with a shipper's intent on that page.

Root cause: the header/utility drawer is a shared component injected globally by the CMS templating layer, with no per-page-intent adaptation.
What we do instead: keep lightweight global utility actions (track, contact, locations) persistent in the header, but make the primary CTA contextual and visually dominant per page — e.g. "Talk to a Sea Freight specialist" is the loud action on the sea-freight page, with "Track Shipment" as the secondary; career links live only in the footer/Company nav, never sharing a drawer with commercial actions.
Content & Knowledge Platform

The website functions as a logistics knowledge hub, structured around: industry intelligence, market developments, regulatory changes, customs information, shipping guides, case studies, customer success stories, educational resources, videos, webinars, company news.

Two distinct content types (amended, clarifies the split introduced above):

Service / Industry pages — commercial intent, short, CTA-forward.
Guides & Reference — informational intent, long-form, SEO-driven: process walkthroughs, options comparisons, FAQs, Incoterms, container/trailer sizing, HS/HTS codes, glossaries per mode. Matches K+N's real /how-to/ and knowledge-hub verticals, which are kept deliberately separate from the sales pages.

This split is an SEO-driven acquisition layer as well as a genuine differentiator — our service pages convert cleanly, and our guides actually answer the deep questions K+N's own service pages leave unanswered (K+N ships almost no FAQ content on its commercial pages).

Search

Global search indexes: services, industries, locations, articles, news, resources, knowledge-base content, FAQs, corporate information. K+N exposes a real, present /search route and search icon on every page — validated, no changes from the original spec.

Multi-Region & Internationalisation — Explicit Three-Tier Model (amended)

The original spec assumed a fairly uniform "supports multiple countries and languages" architecture. The live site actually runs three inconsistent patterns simultaneously: major markets get a dedicated localized path (/us, /de, /jp, with multilingual splits for markets like Belgium — /be, /be/nl, /be/fr, /be/de); a second tier gets a /countries/{name} path with presumably lighter localization (Bulgaria, Estonia, Norway, Romania, and others); everything else is folded into a query-string filter on the global directory (?search=kenya), meaning a large share of the "country" nav entries have no real localized site behind them at all.

Root cause: this is the same organic-rollout pattern as the myKN fragmentation — big markets funded first with full localization, smaller ones bolted on cheaply later, three ad hoc patterns accumulating under one nav label.

Amended design — define the tiers on purpose, before any market is built, and give each tier exactly one URL pattern in the Next.js locale/routing config:

Tier 1 (major markets): fully localized subsite — own hero, own contact info, own local case studies, own language. Route pattern: /{countryCode} (and /{countryCode}/{lang} where multilingual).
Tier 2 (secondary markets): lightweight localized landing page — local contact info and office list, content otherwise inherited from the global default. Route pattern: /countries/{country-slug}.
Tier 3 (long-tail markets): no dedicated page — folded into the global Locations directory with a country filter only.

Supports: multiple countries, multiple languages, region-specific content and services, local contact information, local pricing conventions, local currencies, local regulatory information.

Visual Direction

The platform takes inspiration from the structural clarity and enterprise-grade information architecture of Kuehne+Nagel while deliberately moving the visual experience forward — not reproducing K+N's visual identity, but establishing an independent brand language.

Design direction: premium, global, technological, precise, trustworthy, industrial without feeling dated, data-driven, highly responsive, visually confident. Stronger typography, improved spacing, richer interactions, better visual hierarchy, more sophisticated motion, better mobile behaviour, clearer conversion paths than the reference site.

Goal: Kuehne+Nagel's operational breadth + a modern premium digital-product experience.

**Independence from the reference site's language and rules (amended, new):** the "independent brand language" principle above extends beyond visual identity. This platform is not bound to K+N's specific marketing terminology, compliance framing, or operational rules where they don't fit this build — service names, disclaimer language, or process copy can diverge from the reference site's wording wherever a clearer or more accurate alternative fits better. K+N's structure and breadth are the reference; its specific copy and compliance posture are not obligations.

Technical Architecture

Preferred architecture: a modern TypeScript-based stack supporting both the high-performance public site and the authenticated logistics application.

Frontend / Application
Next.js, React, TypeScript, Tailwind CSS
Modern component architecture
Server-side rendering / static generation where appropriate
React Server Components where beneficial

Rendering model (amended, new): the live site is a hybrid — an SSR/SSG marketing shell with client-rendered "islands" wherever something is genuinely transactional (animated stat counters, async location search). This validates the RSC-first plan, with one clarification worth stating explicitly so it isn't relitigated mid-build: the tracking widget and location search-with-map are client components living inside an otherwise server-rendered site — don't force them into RSC, and don't let their presence justify over-hydrating the whole site into one SPA.

Backend
Next.js server-side APIs for application-specific operations
PostgreSQL
Supabase or an equivalent managed backend platform
Secure authentication and role-based access control
Core Data Domains

Customers, Users, Offices, Locations, Services, Industries, Shipments, Tracking events, Bookings, Cargo, Documents, Invoices, Notifications, Customer organizations, Logistics partners, Vehicles / vessels / flights where applicable, Rate cards / tariffs.

Infrastructure

Cloudflare (CDN, security, edge), object storage for documents and shipment assets, managed database infrastructure, transactional email, monitoring and application observability, automated deployments through CI/CD.

Integrations

Integration-ready rather than treating shipping operations as isolated website data:

Carrier APIs (ocean carrier schedules, airline cargo APIs, road transport providers)
Customs systems, port systems
- ~~Shipment tracking APIs~~ — deferred, not required. Tracking is admin-authored via the internal platform (see Shipment Tracking, above); a live integration is a future option, not a dependency.
Mapping and geolocation providers
Payment services
Email/SMS/WhatsApp notification providers
ERP systems, warehouse management systems, CRM systems
Administrative Platform — Buy vs. Build Called Out (amended)

An internal administration system lets authorized staff manage the business without developer involvement for routine changes.

Custom-built (core to the product, no viable off-the-shelf substitute):

Customers, Users, Shipments, Bookings, Tracking events, Locations, Services, Industries, Content, Articles, Resources, Documents, Notifications, Contact inquiries, Staff permissions, Regional content

Buy, don't build (amended, new):

Careers/ATS — K+N's own careers section runs on jobs.kuehne-nagel.com, almost certainly a third-party job board/ATS, not the core CMS. Embed or link out to a specialized platform rather than building bespoke application-tracking tooling.
Newsroom / press distribution — K+N runs this on a separate newsroom.kuehne-nagel.com subdomain, consistent with specialized PR-distribution tooling rather than the core site's CMS. Evaluate a similar buy decision before committing engineering time to a bespoke press-release workflow.

Why this matters: the original spec listed "Content, Articles, Newsroom, Staff permissions" as one undifferentiated admin surface to build. Treating careers and press distribution as core product work is a common overreach — both are well-served by mature, purpose-built vendors, and building them bespoke is time not spent on the parts of the admin platform that are actually differentiated (shipments, bookings, tracking).

Role-based permissions support administrators, operations staff, customer-service teams, sales staff, logistics coordinators, and customers.

End-to-End Customer Journey

Discover a service → Talk to a specialist → Confirm booking → Receive shipment reference → Track shipment → Receive status notifications → Access documents → Receive delivery confirmation → Review shipment history and analytics

The public website is the customer's entry point; the authenticated platform is the customer's ongoing logistics workspace.

Product Philosophy

The project behaves less like a traditional freight company's website and more like a digital logistics company.

The public experience answers: What can you ship, where can you ship it, how much will it cost (now answered through a direct conversation with a specialist, not a self-service calculator), and how can you help me?

The operational product answers: Where is my shipment, what is happening to it, what do I need to do next, and where are all of my logistics documents and information?

The result is a global freight and logistics platform combining corporate content, service discovery, specialist consultation, booking, shipment visibility, customer management, location intelligence and operational analytics within one coherent digital ecosystem.

Appendix: Key Decisions & Deviations from the K+N Reference
Area Original assumption What the live site actually does Amended decision
Quote engine One workflow produces instant quote or request, for any mode Sea/Air have real calculators; Road and non-standard cargo are lead-capture only Explicit two-tier model (Instant vs. RFQ), classified per service before build — later removed entirely: direct specialist contact (no tier distinction) replaced it, since industry pages already worked this way and the two-tier split added engineering complexity (a maintained rate/tariff engine) that a specialist-conversation model doesn't need
Customer portal "Centralized platform" implied as one product myKN is a federation of route islands across quote/sea/air/auth/dashboard, still mid-migration off a predecessor product One unified app: one auth domain, one design system, one data model
Service pages Process + options + FAQs + industries all on one page Short benefit-led template; deep content lives in a separate /how-to/ vertical Two content types: service pages (commercial) vs. guides (informational, with real FAQs)
Locations "Interactive maps" as the headline UX improvement Search-first result list; map is a secondary static link, not a live default view Search-first primary, map as a secondary filtered-result view
Internationalisation Uniform multi-country/language support Three inconsistent patterns: full localized paths, /countries/ paths, and query-filter fallbacks Three tiers defined on purpose, one URL pattern per tier
Navigation CTAs Not addressed Same five equal-weight CTAs repeated on every page regardless of context Contextual primary CTA per page; utility actions stay persistent but secondary
Admin platform Newsroom/careers treated as core CMS work Both run on separate subdomains, consistent with bought/specialized platforms Buy careers/ATS and press distribution; build only the differentiated admin surfaces
Rendering model Next.js + RSC "where beneficial" SSR/SSG shell with client-rendered islands for transactional widgets RSC-first shell; track/location-search explicitly scoped as client islands
Shipment tracking data source Implicitly assumed eventual live carrier/tracking-API integration No such integration exists or is planned as a dependency Tracking data is admin-authored via the internal platform; live integration is an optional future enhancement, not a blocker
Reference-site language & compliance Implicitly treated K+N's terminology/compliance framing as a template to follow N/A — forward decision, not an audit finding Platform is free to diverge from K+N's specific marketing copy and compliance rules; only structure and breadth are the reference
