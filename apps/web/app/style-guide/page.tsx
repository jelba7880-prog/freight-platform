import { Badge, Button, Card, Input, ManifestStrip } from "@freight/ui";
import { PreviewPair } from "./_components/PreviewPair";
import { Section } from "./_components/Section";
import { Swatch } from "./_components/Swatch";

export const metadata = {
  title: "Style Guide — Freight Platform",
};

const baseSwatches = [
  {
    name: "Ink",
    varName: "--palette-ink",
    hex: "#1A1714",
    role: "Background — apps/portal & apps/admin only",
  },
  {
    name: "Steel",
    varName: "--palette-steel",
    hex: "#241F1A",
    role: "Surface/card — apps/portal & apps/admin only",
  },
  {
    name: "Paper",
    varName: "--palette-paper",
    hex: "#F6F7F9",
    role: "Background — apps/web. Foreground text — apps/portal & apps/admin",
  },
  {
    name: "Mist",
    varName: "--palette-mist",
    hex: "#5C6B80",
    role: "Secondary text / borders — both modes",
  },
];

const accentSwatches = [
  {
    name: "Beacon",
    varName: "--palette-beacon",
    hex: "#E2A33B",
    role: "In-transit / active state — raw hue, used for solid fills",
  },
  {
    name: "Cleared",
    varName: "--palette-cleared",
    hex: "#46B893",
    role: "Delivered / cleared state — raw hue, used for solid fills",
  },
];

const adjustedSwatches = [
  {
    name: "Beacon, on light",
    varName: "--palette-beacon-on-light",
    hex: "#96650F",
    role: "Beacon text/icon/border on paper — raw beacon is 2.05:1 on paper, fails AA",
  },
  {
    name: "Cleared, on light",
    varName: "--palette-cleared-on-light",
    hex: "#2E7C63",
    role: "Cleared text/icon/border on paper — raw cleared is 2.29:1 on paper, fails AA",
  },
  {
    name: "Mist, on dark",
    varName: "--palette-mist-on-dark",
    hex: "#7C8CA3",
    role: "Muted text on ink/steel — raw mist is 3.29:1 on ink, fails AA for body text",
  },
];

const addedSwatches = [
  {
    name: "Danger",
    varName: "--palette-danger",
    hex: "#C4462F",
    role: "Input error state — not in the original palette, added (see note below)",
  },
  {
    name: "Danger, on dark",
    varName: "--palette-danger-on-dark",
    hex: "#D35D47",
    role: "Danger text on ink/steel — raw danger is 3.62:1 on ink, fails AA",
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
    <main className="mx-auto flex max-w-5xl flex-col gap-expansive px-comfortable py-expansive">
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
        title="Color — base"
        description="Ink, steel, paper, and mist, exactly as given in the Visual Direction spec."
      >
        <div className="grid grid-cols-2 gap-cozy sm:grid-cols-4">
          {baseSwatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Color — accent"
        description="Beacon (in-transit / active) and cleared (delivered / cleared), as given. These raw hues back solid fills only — see the adjusted variants below for text/icon use."
      >
        <div className="grid grid-cols-2 gap-cozy sm:grid-cols-4">
          {accentSwatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Color — adjusted for contrast"
        description="The Visual Direction spec asked for beacon/cleared to be verified against WCAG AA on both ink and paper, with the shade adjusted (same hue family) if needed. Both failed against paper as given, so a darkened variant exists for use on light surfaces. Mist needed the same treatment against ink, which wasn't explicitly requested but follows the same non-negotiable accessibility floor."
      >
        <div className="grid grid-cols-2 gap-cozy sm:grid-cols-3">
          {adjustedSwatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Color — added"
        description="The given palette has no error/validation color, but Input requires a real error state. This danger token is a deliberate, minimal addition — a warm, muted red pulled from the same undertone as ink rather than a generic bright red — contrast-checked the same way as everything else above."
      >
        <div className="grid grid-cols-2 gap-cozy sm:grid-cols-3">
          {addedSwatches.map((s) => (
            <Swatch key={s.name} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Color — semantic, by mode"
        description="background / surface / foreground / muted / border resolve differently per mode. apps/web only ever renders the light column below."
      >
        <PreviewPair
          light={
            <div className="flex flex-col gap-tight font-mono text-xs">
              <p className="text-foreground">background · surface = paper</p>
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
            </div>
          }
        />
      </Section>

      <Section
        title="Type"
        description="Display — Geist. Body — IBM Plex Sans. Mono (data/utility: reference numbers, container IDs, coordinates, timestamps) — IBM Plex Mono."
      >
        <div className="flex flex-col gap-comfortable">
          <div className="flex flex-col gap-tight">
            <p className="font-display text-3xl font-semibold text-foreground">
              Geist — display
            </p>
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
                className="h-3 rounded-full bg-beacon-solid"
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
        description='"primary" is beacon-filled and reserved for the one primary action in a real view — shown together with secondary/ghost here only for comparison.'
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
        description="Maps directly onto real domain states — in-transit (beacon) and cleared (teal) mean exactly that, plus a neutral variant for everything else."
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
    </main>
  );
}
