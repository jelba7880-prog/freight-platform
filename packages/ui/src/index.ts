/**
 * Shared design system / component library: tokens live in
 * packages/config/tailwind, font loading in ./fonts, and the primitives
 * below. Row selection/pagination/filtering/column resizing on Table, and
 * forms beyond Input, are deliberately out of scope for this pass —
 * follow-ups once these are reviewed. Header/Footer are wired into
 * apps/web only; apps/portal uses AppShell instead (see its own doc
 * comment for why). apps/admin gets its nav in a later task.
 */
export { Button, buttonClassName } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeVariant } from "./Badge";

export { Card } from "./Card";
export type { CardProps } from "./Card";

export { ContentCard } from "./ContentCard";
export type { ContentCardProps } from "./ContentCard";

export { ServiceIndustryTemplate } from "./ServiceIndustryTemplate";
export type { ServiceIndustryTemplateProps, ServiceIndustryContent } from "./ServiceIndustryTemplate";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Table } from "./Table";
export type { TableProps, Column, ColumnAlign, SortState, SortDirection } from "./Table";

export { ManifestStrip } from "./ManifestStrip";
export type { ManifestStripProps } from "./ManifestStrip";

export { Header } from "./Header";
export type { HeaderProps, PrimaryAction } from "./Header";

export { AppShell } from "./AppShell";
export type { AppShellProps, AppShellNavItem } from "./AppShell";

export { Footer } from "./Footer";
export type { FooterProps } from "./Footer";

export {
  SERVICES,
  INDUSTRIES,
  PRIMARY_NAV,
  UTILITY_LINKS,
  PORTAL_LINK,
  DEFAULT_PRIMARY_ACTION,
  COMPANY_LINKS,
  RESOURCES_LINKS,
} from "./nav-data";
export type { NavLink, PrimaryNavItem, ContentNavLink } from "./nav-data";
