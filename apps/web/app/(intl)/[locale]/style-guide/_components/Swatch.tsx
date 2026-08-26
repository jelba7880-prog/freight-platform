/**
 * Renders one palette entry for review. The fill always comes from
 * `var(--palette-*)` (never a literal hex baked into a style prop) so the
 * swatch stays truthful if palette.css ever changes; the hex is only
 * printed as reference text, in mono, matching the type system's own rule
 * that data/reference values are mono.
 */
export function Swatch({
  name,
  varName,
  hex,
  role,
}: {
  name: string;
  varName: string;
  hex: string;
  role: string;
}) {
  return (
    <div className="flex flex-col gap-tight">
      <div
        className="h-16 w-full rounded-md border border-border shadow-sm"
        style={{ backgroundColor: `var(${varName})` }}
      />
      <div className="flex flex-col">
        <span className="font-sans text-sm font-medium text-foreground">{name}</span>
        <span className="font-mono text-xs text-muted">{hex}</span>
        <span className="text-xs text-muted">{role}</span>
      </div>
    </div>
  );
}
