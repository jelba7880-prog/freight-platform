import { Badge, Button, Card, Footer, Header, Input, ManifestStrip } from "@freight/ui";
import { PreviewPair } from "./_components/PreviewPair";
import { Section } from "./_components/Section";
import { Swatch } from "./_components/Swatch";
import { TableDemo } from "./_components/TableDemo";

export const metadata = {
  title: "Style Guide — Meridian Freight",
};

const neutralSwatches = [
  {
    name: "Ink",
    varName: "--palette-ink",
    hex: "#10151B",
    role: "Background — apps/portal & apps/admin only",
  },
  {
    name: "Steel",
    varName: "--palette-steel",
    hex: "#191F27",
    role: "Surface/card — apps/portal & apps/admin only",
  },
  {
    name: "Graphite",
    varName: "--palette-graphite",
    hex: "#2A323C",
    role: "Hairline borders — dark mode",
  },
  {
    name: "Mist",
    varName: "--palette-mist",
    hex: "#5F6B7A",
    role: "Secondary text — light mode, 5.11:1 on paper",
  },
  {
    name: "Mist, on dark",
    varName: "--palette-mist-on-dark",
    hex: "#8B97A6",
    role: "Secondary text — dark mode, 6.18:1 on ink (raw mist is 3.38:1, fails AA)",
  },
  {
    name: "Fog",
    varName: "--palette-fog",
    hex: "#DDE2E8",
    role: "Hairline borders — light mode",
  },
  {
    name: "Paper",
    varName: "--palette-paper",
    hex: "#F7F8FA",
    role: "Background — apps/web. Foreground text — apps/portal & apps/admin",
  },
  {
    name: "Chalk",
    varName: "--palette-chalk",
    hex: "#FFFFFF",
    role: "Card surface — light mode",
  },
];

const brandSwatches = [
  {
    name: "Oxide",
    varName: "--palette-oxide",
    hex: "#B5562B",
    role: "Solid fills, logo, full-bleed buttons — carries chalk text at 4.85:1",
  },
  {
    name: "Oxide, on light",
    varName: "--palette-oxide-on-light",
    hex: "#A34A22",
    role: "Text, icons, rules on paper — 5.55:1",
  },
  {
    name: "Oxide, on dark",
    varName: "--palette-oxide-on-dark",
    hex: "#E08A5A",
    role: "Text, icons, rules on ink — 6.94:1",
  },
];

const statusSwatches = [
  {
    name: "Transit",
    varName: "--palette-transit",
    hex: "#2F6BD0",
    role: "In transit / active — raw hue, solid fills and dots",
  },
  {
    name: "Transit, on light",
    varName: "--palette-transit-on-light",
    hex: "#2457AC",
    role: "In-transit text/icon on paper — 6.51:1",
  },
  {
    name: "Transit, on dark",
    varName: "--palette-transit-on-dark",
    hex: "#7BA6F0",
    role: "In-transit text/icon on ink — 7.47:1",
  },
  {
    name: "Delivered",
    varName: "--palette-delivered",
    hex: "#3E8F73",
    role: "Cleared / delivered — raw hue, solid fills and dots",
  },
  {
    name: "Delivered, on light",
    varName: "--palette-delivered-on-light",
    hex: "#2E6E58",
    role: "Delivered text/icon on paper — 5.67:1",
  },
  {
    name: "Delivered, on dark",
    varName: "--palette-delivered-on-dark",
    hex: "#6BC3A4",
    role: "Delivered text/icon on ink — 8.70:1",
  },
  {
    name: "Exception",
    varName: "--palette-exception",
    hex: "#C4462F",
    role: "Error / validation / customs hold — 4.63:1 on paper, no light variant needed",
  },
  {
    name: "Exception, on dark",
    varName: "--palette-exception-on-dark",
    hex: "#D9604A",
    role: "Exception text on ink — 5.00:1 (raw exception is 3.72:1, fails AA)",
  },
];

const typeScale = [
  { cls: "text-xs", label: "xs / 12px", role: "Timestamps, meta, table captions" },
  { cls: "text-sm", label: "sm / 13px", role: "Form labels, secondary UI text" },
  { cls: "text-base", label: "base / 15px", role: "Default body copy" },
  { cls: "text-lg", label: "lg / 18px", role: "Lead paragraph, card titles" },
  { cls: "text-xl", label: "xl / 22px", role: "Section headings" },
  { cls: "text-2xl", label: "2xl / 28px", role: "Page headings" },
  { cls: "text-3xl", label: "3xl / 36px", role: "Hero subheads" },
  { cls: "text-4xl", label: "4xl / 48px", role: "Hero display" },
];

const spacingScale = [
  { cls: "hairline", px: "1px", role: "Dividers" },
  { cls: "tight", px: "6px", role: "Icon-to-label gaps" },
  { cls: "snug", px: "10px", role: "Dense control padding (badge, chip)" },
  { cls: "cozy", px: "16px", role: "Default control padding (button, input)" },
  { cls: "comfortable", px: "24px", role: "Card padding" },
  { cls: "loose", px: "40px", role: "Section spacing" },
  { cls: "expansive", px: "64px", role: "Page-level rhythm" },
];

const radiusScale = [
  { cls: "rounded-sm", label: "sm / 6px", role: "Inputs, badges" },
  { cls: "rounded-md", label: "md / 10px", role: "Buttons, cards" },
  { cls: "rounded-lg", label: "lg / 16px", role: "Panels, modals" },
  { cls: "rounded-full", label: "full", role: "Pills, avatars, status dots" },
];

export default function StyleGuidePage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-expansive px-comfortable py-expansive">
      <header className="flex flex-col gap-tight">
        <p className="font-mono text-xs uppercase tracking-wide text-muted">Internal / review</p>
        <h1 className="font-display text-4xl font-semibold text-foreground">Style guide</h1>
        <p className="max-w-2xl text-base text-muted">
          Every token and primitive from packages/config/tailwind and packages/ui, rendered for
          review before anything downstream builds on top of it. This route always stays light
          (apps/web never renders dark) — the dark panels below simulate apps/portal and
          apps/admin inline.
        </p>
      </header>

      <Section
        title="Color — neutrals"
        description="One cool-slate undertone end to end, ink through chalk. Eight steps, so a border, a surface and an elevated card each get a real value instead of being mixed out of a neighbour at runtime."
      >
        <div className="grid grid-cols-2 gap-cozy sm:grid-cols-4">
          {neutralSwatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Color — brand"
        description="Oxide is the brand accent and the only warm hue in the system: logo, CTA fills, links, eyebrows. It is never a shipment state. Three shades — the solid fill, plus an on-light and an on-dark text shade — so the accent never has to be legible against paper and ink at the same time."
      >
        <div className="grid grid-cols-2 gap-cozy sm:grid-cols-3">
          {brandSwatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Color — status"
        description="Cool hues that mean a literal shipment state and nothing else — transit (in transit / active), delivered (cleared / delivered), exception (error, validation failure, customs hold). None of them is ever used as a brand or CTA color, which is exactly what the previous single amber token was doing in two jobs at once."
      >
        <div className="grid grid-cols-2 gap-cozy sm:grid-cols-4">
          {statusSwatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Color — semantic, by mode"
        description="background / surface / foreground / muted / border resolve differently per mode. Border is a real neutral step in both modes — fog on light, graphite on dark — not a mix of muted into the background. apps/web only ever renders the light column below."
      >
        <PreviewPair
          light={
            <div className="flex flex-col gap-tight font-mono text-xs">
              <p className="text-foreground">background = paper</p>
              <p className="text-foreground">surface = chalk</p>
              <p className="text-foreground">foreground = ink</p>
              <p className="text-muted">muted = mist</p>
              <p className="text-foreground">
                border = <span className="inline-block h-3 w-3 rounded-full border border-border align-middle" />
              </p>
            </div>
          }
          dark={
            <div className="flex flex-col gap-tight font-mono text-xs">
              <p className="text-foreground">background = ink</p>
              <p className="text-foreground">surface = steel</p>
              <p className="text-foreground">foreground = paper</p>
              <p className="text-muted">muted = mist-on-dark</p>
              <p className="text-foreground">
                border = <span className="inline-block h-3 w-3 rounded-full border border-border align-middle" />
              </p>
            </div>
          }
        />
      </Section>

      <Section
        title="Type"
        description='Display — Archivo, set at "wdth" 112 / weight 600 / -0.015em tracking. That width-and-tracking treatment is what separates display type from body copy, so h1/h2/h3 carry it from reset.css and no component re-declares it. Body — IBM Plex Sans, default width. Mono (data/utility: reference numbers, container IDs, coordinates, timestamps) — IBM Plex Mono, tabular figures.'
      >
        <div className="flex flex-col gap-comfortable">
          <div className="flex flex-col gap-tight">
            <h3 className="font-display text-3xl text-foreground">Archivo — display</h3>
            <div className="flex flex-wrap gap-cozy">
              <span className="font-display text-lg font-medium text-foreground">Medium</span>
              <span className="font-display text-lg font-semibold text-foreground">Semibold</span>
              <span className="font-display text-lg font-bold text-foreground">Bold</span>
            </div>
          </div>
          <div className="flex flex-col gap-tight">
            <p className="font-sans text-3xl font-semibold text-foreground">
              IBM Plex Sans — body
            </p>
            <div className="flex flex-wrap gap-cozy">
              <span className="font-sans text-lg font-normal text-foreground">Regular</span>
              <span className="font-sans text-lg font-medium text-foreground">Medium</span>
              <span className="font-sans text-lg font-semibold text-foreground">Semibold</span>
            </div>
          </div>
          <div className="flex flex-col gap-tight">
            <p className="font-mono text-3xl font-medium text-foreground">
              IBM Plex Mono — data
            </p>
            <div className="flex flex-wrap gap-cozy font-mono text-lg text-foreground">
              <span className="font-normal">MSCU 7048291</span>
              <span className="font-medium">51.9225°N 4.4792°E</span>
              <span className="font-normal">2026-08-25T14:32Z</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-cozy">
          {typeScale.map((t) => (
            <div key={t.cls} className="flex items-baseline gap-cozy">
              <span className="w-32 shrink-0 font-mono text-xs text-muted">{t.label}</span>
              <span className={`${t.cls} truncate font-sans text-foreground`}>
                Freight, cleared for departure
              </span>
              <span className="ml-auto hidden shrink-0 text-xs text-muted sm:block">{t.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing">
        <div className="flex flex-col gap-tight">
          {spacingScale.map((s) => (
            <div key={s.cls} className="flex items-center gap-cozy">
              <span className="w-24 shrink-0 font-mono text-xs text-muted">{s.cls}</span>
              <span className="w-12 shrink-0 font-mono text-xs text-muted">{s.px}</span>
              <span
                className="h-3 rounded-full bg-oxide-solid"
                style={{ width: `var(--spacing-${s.cls})` }}
              />
              <span className="text-xs text-muted">{s.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div className="flex flex-wrap gap-comfortable">
          {radiusScale.map((r) => (
            <div key={r.cls} className="flex flex-col items-center gap-tight">
              <div className={`h-16 w-16 border border-border bg-surface shadow-sm ${r.cls}`} />
              <span className="font-mono text-xs text-muted">{r.label}</span>
              <span className="text-xs text-muted">{r.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Shadow"
        description="A cast shadow reads fine on paper, but a black shadow disappears against ink/steel — dark mode swaps the same three tokens to a faint light-colored glow instead. Compare the two panels below."
      >
        <PreviewPair
          light={
            <div className="flex gap-comfortable">
              {(["shadow-sm", "shadow-md", "shadow-lg"] as const).map((s) => (
                <div key={s} className={`h-16 w-16 rounded-md bg-surface ${s}`} />
              ))}
            </div>
          }
          dark={
            <div className="flex gap-comfortable">
              {(["shadow-sm", "shadow-md", "shadow-lg"] as const).map((s) => (
                <div key={s} className={`h-16 w-16 rounded-md bg-surface ${s}`} />
              ))}
            </div>
          }
        />
      </Section>

      <Section
        title="Motion"
        description={
          'Restrained by design — a short, deliberate transition on hover/focus/press only (duration-fast 120ms, duration-base 180ms, ease-standard cubic-bezier(0.2, 0, 0, 1)). No ambient or scroll-triggered motion in this pass. Hover the buttons below to feel it; prefers-reduced-motion collapses all of it to near-zero automatically.'
        }
      >
        <div className="flex gap-cozy">
          <Button variant="primary">Hover me</Button>
          <Button variant="secondary">Hover me</Button>
        </div>
      </Section>

      <Section
        title="Button"
        description='"primary" is oxide-filled and reserved for the one primary action in a real view — shown together with secondary/ghost here only for comparison.'
      >
        <PreviewPair
          light={
            <div className="flex flex-wrap gap-cozy">
              <Button variant="primary">Book shipment</Button>
              <Button variant="secondary">View details</Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          }
          dark={
            <div className="flex flex-wrap gap-cozy">
              <Button variant="primary">Book shipment</Button>
              <Button variant="secondary">View details</Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          }
        />
      </Section>

      <Section
        title="Badge"
        description="Maps directly onto real domain states — in-transit (transit blue) and cleared (delivered green) mean exactly that, plus a neutral variant for everything else. Both are status hues, never the brand accent."
      >
        <PreviewPair
          light={
            <div className="flex flex-col gap-cozy">
              <div className="flex flex-wrap gap-cozy">
                <Badge variant="in-transit">In transit</Badge>
                <Badge variant="cleared">Cleared</Badge>
                <Badge variant="neutral">Draft</Badge>
              </div>
              <p className="font-mono text-xs text-foreground">
                Shipment FR-88213-JP <Badge variant="in-transit">In transit</Badge>
              </p>
            </div>
          }
          dark={
            <div className="flex flex-col gap-cozy">
              <div className="flex flex-wrap gap-cozy">
                <Badge variant="in-transit">In transit</Badge>
                <Badge variant="cleared">Cleared</Badge>
                <Badge variant="neutral">Draft</Badge>
              </div>
              <p className="font-mono text-xs text-foreground">
                Shipment FR-88213-JP <Badge variant="in-transit">In transit</Badge>
              </p>
            </div>
          }
        />
      </Section>

      <Section title="Card">
        <PreviewPair
          light={
            <Card className="max-w-sm">
              <div className="flex flex-col gap-tight">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    FR-88213-JP
                  </h3>
                  <Badge variant="in-transit">In transit</Badge>
                </div>
                <p className="font-mono text-xs text-muted">Rotterdam → Yokohama · 40&apos; HC</p>
                <Button variant="secondary" size="sm" className="mt-tight self-start">
                  View shipment
                </Button>
              </div>
            </Card>
          }
          dark={
            <Card className="max-w-sm">
              <div className="flex flex-col gap-tight">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    FR-88213-JP
                  </h3>
                  <Badge variant="in-transit">In transit</Badge>
                </div>
                <p className="font-mono text-xs text-muted">Rotterdam → Yokohama · 40&apos; HC</p>
                <Button variant="secondary" size="sm" className="mt-tight self-start">
                  View shipment
                </Button>
              </div>
            </Card>
          }
        />
      </Section>

      <Section title="Input" description="Text input with label and error state.">
        <PreviewPair
          light={
            <div className="flex flex-col gap-cozy">
              <Input label="Container number" placeholder="MSCU 7048291" />
              <Input
                label="Reference code"
                defaultValue="FR-8821"
                error="Reference codes must be 8 characters."
              />
            </div>
          }
          dark={
            <div className="flex flex-col gap-cozy">
              <Input label="Container number" placeholder="MSCU 7048291" />
              <Input
                label="Reference code"
                defaultValue="FR-8821"
                error="Reference codes must be 8 characters."
              />
            </div>
          }
        />
      </Section>

      <Section
        title="Manifest strip"
        description="Simulated live shipment feed — decorative chrome, not real data. A new row fades in every 4-6s (randomized, not a metronome) as the oldest fades out; the status dot breathes slowly. Not wired into any real page yet. Marked aria-hidden with a static sr-only label instead of aria-live: the feed churns forever and carries no real information, so polite announcements every few seconds would be pure noise for screen reader users rather than something worth interrupting for."
      >
        <PreviewPair
          light={<ManifestStrip />}
          dark={<ManifestStrip />}
        />
      </Section>

      <Section
        title="Header"
        description="Utility actions (Track, Find a location, Talk to an expert, Search, Portal login) are fixed content, not a prop — a page can't grow that row. The contextual primary CTA is the one thing a page configures, via primaryAction; it always renders oxide-filled and visually heavier than the utility row. The two previews below are the same Header, differing only in that prop, to make the distinction visible."
      >
        <div className="flex flex-col gap-cozy">
          <div className="flex flex-col gap-tight">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              Default fallback CTA (no primaryAction passed)
            </p>
            <div className="rounded-lg border border-border shadow-sm">
              <Header />
            </div>
          </div>
          <div className="flex flex-col gap-tight">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              Overridden primaryAction — {'{ label: "Talk to a Sea Freight specialist", href: "/contact" }'}
            </p>
            <div className="rounded-lg border border-border shadow-sm">
              <Header
                primaryAction={{ label: "Talk to a Sea Freight specialist", href: "/contact" }}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Footer"
        description="Company layer (About, Leadership, Sustainability, Corporate governance, Compliance, Careers, Investor information, Newsroom), pulled directly from Project_Overview.md. Careers lives here only — never alongside Header's commercial actions."
      >
        <div className="rounded-lg border border-border shadow-sm">
          <Footer />
        </div>
      </Section>

      <Section
        title="Table"
        description="Controlled, not self-managing: sort state lives with the caller (client-side here, server-side once packages/database is real) — Table only renders the sort prop it's given and reports the next descriptor via onSort. Horizontal scroll (not row-to-card collapse) preserves column alignment for a dense operational tool; the faint edge gradients hint that it scrolls. Status uses Badge, never a second color system. Reference/ETA use IBM Plex Mono; Route uses IBM Plex Sans. Click a sortable header, or Tab to it and press Enter/Space."
      >
        <div className="flex flex-col gap-comfortable">
          <div className="flex flex-col gap-tight">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">Populated</p>
            <PreviewPair light={<TableDemo variant="populated" />} dark={<TableDemo variant="populated" />} />
          </div>
          <div className="flex flex-col gap-tight">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">
              Loading — shimmer sweep, or a static muted fill under prefers-reduced-motion
            </p>
            <PreviewPair light={<TableDemo variant="loading" />} dark={<TableDemo variant="loading" />} />
          </div>
          <div className="flex flex-col gap-tight">
            <p className="font-mono text-xs uppercase tracking-wide text-muted">Empty</p>
            <PreviewPair light={<TableDemo variant="empty" />} dark={<TableDemo variant="empty" />} />
          </div>
        </div>
      </Section>
    </div>
  );
}
