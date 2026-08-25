/**
 * Shared design system / component library: tokens live in
 * packages/config/tailwind, font loading in ./fonts, and the primitives
 * below. Table and nav/header shells, and forms beyond Input, are
 * deliberately out of scope for this pass — follow-ups once these are
 * reviewed.
 */
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";

export { Card } from "./Card";
export type { CardProps } from "./Card";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { ManifestStrip } from "./ManifestStrip";
export type { ManifestStripProps } from "./ManifestStrip";
