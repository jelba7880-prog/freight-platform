"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { buttonClassName } from "./Button";
import { cx } from "./cx";
import type { NavLink, PrimaryNavItem } from "./nav-data";
import {
  DEFAULT_PRIMARY_ACTION,
  PORTAL_LINK,
  PRIMARY_NAV,
  resolveContextualCta,
  UTILITY_LINKS,
} from "./nav-data";
import { stripLocalePrefix } from "./stripLocalePrefix";

export interface PrimaryAction {
  label: string;
  href: string;
}

export interface HeaderProps {
  /**
   * Site-wide fallback commercial CTA, shown when the current route has no
   * matching `ctaLabel` in `SERVICES`/`INDUSTRIES` (see
   * `resolveContextualCta` in ./nav-data, which Header calls itself from
   * `usePathname()`). A page never passes this prop to get its own CTA —
   * Header resolves that directly from route data; this is only ever set
   * once, site-wide, by `AppShell`.
   */
  primaryAction?: PrimaryAction;
  /**
   * The current locale's routing key (e.g. `"global"`, `"us"`, `"de"`),
   * used only to strip the matching prefix off `usePathname()` before the
   * contextual-CTA lookup (see `stripLocalePrefix`). A plain prop rather
   * than context: `AppShell` renders `Header` directly (no intermediate
   * component in between) and nothing else in this package currently
   * needs the locale value, so a context provider would add a second
   * mechanism with no second consumer. Defaults to `""` (no prefix to
   * strip) for callers that render `Header` outside `AppShell` — e.g. the
   * style-guide's standalone previews.
   */
  locale?: string;
  /**
   * Resolves an internal `href` before it's rendered — e.g. prefixing it
   * with the current locale segment. A plain prop rather than context, for
   * the same reason `locale` above is: `AppShell` renders `Header` directly
   * and nothing else in this package currently needs it. Defaults to the
   * identity function so callers that render `Header` outside `AppShell` —
   * e.g. the style-guide's standalone previews — keep unprefixed hrefs.
   */
  resolveHref?: (href: string) => string;
  className?: string;
}

/**
 * Adds Escape-to-close (with focus returning to `triggerRef`) and
 * click-outside-to-close for a disclosure (nav dropdown, search popover)
 * while it's open.
 */
function useDismissableOpen(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    }

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open, onClose, containerRef, triggerRef]);
}

/** Traps Tab/Shift+Tab within `containerRef` and focuses its first
 * focusable element while `active`. Used for the mobile menu panel. */
function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function getFocusable(): HTMLElement[] {
      return Array.from(container!.querySelectorAll<HTMLElement>(focusableSelector));
    }

    const initial = getFocusable()[0] ?? container;
    initial.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;
      const items = getFocusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="6" />
      <path d="M17 17l-4-4" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  );
}

function IconTrack({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 3l7 3.5v7L10 17l-7-3.5v-7L10 3z" />
      <path d="M10 3v14M3 6.5l7 3.5 7-3.5" />
    </svg>
  );
}

const navLinkClass =
  "rounded-sm px-tight py-tight font-sans text-sm text-foreground transition-colors duration-base hover:text-beacon";

function NavDropdown({
  item,
  isOpen,
  onToggle,
  onClose,
  resolveHref,
}: {
  item: PrimaryNavItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  resolveHref: (href: string) => string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useDismissableOpen(isOpen, onClose, containerRef, buttonRef);

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={onToggle}
        className={cx(navLinkClass, "flex items-center gap-tight")}
      >
        {item.label}
        <IconChevronDown
          className={cx("size-3.5 transition-transform duration-base", isOpen && "rotate-180")}
        />
      </button>
      {isOpen ? (
        <div
          id={panelId}
          role="region"
          aria-label={item.label}
          className="absolute left-0 top-full z-20 mt-tight grid w-[min(90vw,32rem)] grid-cols-2 gap-tight rounded-lg border border-border bg-surface p-comfortable shadow-lg"
        >
          {item.items?.map((link) => (
            <a
              key={link.href}
              href={resolveHref(link.href)}
              className="rounded-sm px-tight py-tight font-sans text-sm text-foreground transition-colors duration-base hover:bg-background hover:text-beacon"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SearchToggle({ resolveHref }: { resolveHref: (href: string) => string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  useDismissableOpen(open, () => setOpen(false), containerRef, buttonRef);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={formId}
        onClick={() => setOpen((o) => !o)}
        className="flex size-8 items-center justify-center rounded-sm text-muted transition-colors duration-base hover:text-foreground"
      >
        <IconSearch className="size-4" />
        <span className="sr-only">Search</span>
      </button>
      {open ? (
        <form
          id={formId}
          action={resolveHref("/search")}
          method="get"
          className="absolute right-0 top-full z-20 mt-tight w-64 rounded-lg border border-border bg-surface p-tight shadow-lg"
        >
          <label htmlFor={`${formId}-input`} className="sr-only">
            Search the site
          </label>
          <input
            ref={inputRef}
            id={`${formId}-input`}
            name="q"
            type="search"
            placeholder="Search the site"
            className="h-10 w-full rounded-sm border border-border bg-surface px-cozy font-sans text-sm text-foreground placeholder:text-muted focus:border-beacon"
          />
        </form>
      ) : null}
    </div>
  );
}

function MobileNavAccordion({
  item,
  resolveHref,
}: {
  item: PrimaryNavItem;
  resolveHref: (href: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (!item.items) {
    return (
      <a
        href={resolveHref(item.href)}
        className="block rounded-sm px-cozy py-snug font-sans text-base text-foreground"
      >
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-sm px-cozy py-snug font-sans text-base text-foreground"
      >
        {item.label}
        <IconChevronDown
          className={cx("size-4 transition-transform duration-base", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div id={panelId} className="flex flex-col gap-tight py-tight pl-cozy">
          {item.items.map((link) => (
            <a
              key={link.href}
              href={resolveHref(link.href)}
              className="rounded-sm px-cozy py-tight font-sans text-sm text-muted transition-colors duration-base hover:text-beacon"
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MobileMenu({
  open,
  onClose,
  triggerRef,
  resolveHref,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  resolveHref: (href: string) => string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, panelRef);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-background md:hidden"
    >
      <div className="flex items-center justify-between border-b border-border px-comfortable py-snug">
        <span className="font-display text-lg font-semibold text-foreground">Menu</span>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-sm text-foreground"
        >
          <IconClose className="size-5" />
          <span className="sr-only">Close menu</span>
        </button>
      </div>

      <nav aria-label="Primary" className="flex flex-col gap-tight px-comfortable py-comfortable">
        {PRIMARY_NAV.map((item) => (
          <MobileNavAccordion key={item.label} item={item} resolveHref={resolveHref} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-tight border-t border-border px-comfortable py-comfortable">
        {UTILITY_LINKS.filter((link) => link.label !== "Track shipment").map((link) => (
          <a
            key={link.href}
            href={resolveHref(link.href)}
            className="rounded-sm py-tight font-sans text-sm text-muted"
          >
            {link.label}
          </a>
        ))}
        <a
          href={resolveHref(PORTAL_LINK.href)}
          className="rounded-sm py-tight font-sans text-sm font-medium text-foreground"
        >
          {PORTAL_LINK.label}
        </a>
      </div>
    </div>
  );
}

function UtilityLink({
  link,
  resolveHref,
}: {
  link: NavLink;
  resolveHref: (href: string) => string;
}) {
  return (
    <a
      href={resolveHref(link.href)}
      className="font-sans text-xs text-muted transition-colors duration-base hover:text-foreground"
    >
      {link.label}
    </a>
  );
}

export function Header({
  primaryAction = DEFAULT_PRIMARY_ACTION,
  locale = "",
  resolveHref = (href) => href,
  className,
}: HeaderProps) {
  const [openNavKey, setOpenNavKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const trackLink = UTILITY_LINKS.find((link) => link.label === "Track shipment");
  // Unique per instance: a page can render more than one Header (e.g. the
  // style-guide's default-vs-overridden comparison), and duplicate DOM ids
  // would make aria-controls ambiguous.
  const mobileMenuId = useId();

  // `usePathname()` carries the current locale segment — for a statically
  // prerendered page that's baked in at build time (e.g.
  // `/global/services/sea-freight` for the default locale's internal
  // rewrite; see DEFAULT_LOCALE in apps/web/lib/locale/config.ts), while a
  // live client-side navigation reports the real, unprefixed browser URL.
  // Strip exactly the known locale value (not a fixed segment count — see
  // stripLocalePrefix) so the remainder matches nav-data.ts's hrefs, then
  // look it up. A route match (via SERVICES/INDUSTRIES' `ctaLabel`) always
  // wins over the site-wide fallback prop. This is a data lookup, not a
  // route string or conditional living in this component.
  const canonicalPath = stripLocalePrefix(pathname, locale);
  const resolvedPrimaryAction = resolveContextualCta(canonicalPath) ?? primaryAction;

  return (
    <header className={cx("relative z-10 border-b border-border bg-surface", className)}>
      {/* Utility bar: persistent, fixed weight, never page-configurable. */}
      <div className="hidden border-b border-border md:block">
        <nav
          aria-label="Utility"
          className="mx-auto flex max-w-6xl items-center justify-end gap-cozy px-comfortable py-tight"
        >
          {UTILITY_LINKS.map((link) => (
            <UtilityLink key={link.href} link={link} resolveHref={resolveHref} />
          ))}
          <SearchToggle resolveHref={resolveHref} />
          <a
            href={resolveHref(PORTAL_LINK.href)}
            className="font-sans text-xs font-medium text-foreground transition-colors duration-base hover:text-beacon"
          >
            {PORTAL_LINK.label}
          </a>
        </nav>
      </div>

      {/* Main bar: logo, primary nav, contextual CTA. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-cozy px-comfortable py-snug">
        <a href={resolveHref("/")} className="font-display text-lg font-semibold text-foreground">
          Freight Platform
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-tight md:flex">
          {PRIMARY_NAV.map((item) =>
            item.items ? (
              <NavDropdown
                key={item.label}
                item={item}
                isOpen={openNavKey === item.label}
                onToggle={() => setOpenNavKey((k) => (k === item.label ? null : item.label))}
                onClose={() => setOpenNavKey((k) => (k === item.label ? null : k))}
                resolveHref={resolveHref}
              />
            ) : (
              <a key={item.label} href={resolveHref(item.href)} className={navLinkClass}>
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-tight">
          {/* Homepage hot paths (per Project_Overview.md): reachable without
              opening the mobile menu, not just tucked inside it. */}
          {trackLink ? (
            <a
              href={resolveHref(trackLink.href)}
              aria-label={trackLink.label}
              className="flex size-8 items-center justify-center rounded-sm text-muted transition-colors duration-base hover:text-foreground md:hidden"
            >
              <IconTrack className="size-4" />
            </a>
          ) : null}
          <div className="md:hidden">
            <SearchToggle resolveHref={resolveHref} />
          </div>

          <a href={resolveHref(resolvedPrimaryAction.href)} className={buttonClassName("primary", "sm")}>
            {resolvedPrimaryAction.label}
          </a>

          <button
            ref={mobileTriggerRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMobileOpen(true)}
            className="flex size-9 items-center justify-center rounded-sm text-foreground md:hidden"
          >
            <IconMenu className="size-5" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <div id={mobileMenuId}>
        <MobileMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          triggerRef={mobileTriggerRef}
          resolveHref={resolveHref}
        />
      </div>
    </header>
  );
}
