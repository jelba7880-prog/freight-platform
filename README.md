# freight-platform

Global freight logistics platform (Next.js/TS/Supabase) with a specialist-contact booking flow, one unified customer portal and locale-tiered i18n.

This repo is a pnpm + Turborepo monorepo. It currently contains infrastructure/tooling scaffolding only — no pages, components, or business logic yet.

## Structure

```
apps/
  web/       Public marketing site (Next.js, App Router)
  portal/    Authenticated customer portal (Next.js, App Router)
  admin/     Internal admin platform (Next.js, App Router)

packages/
  ui/        Shared design system / component library (empty skeleton — wired up in a follow-up task)
  config/    Shared tsconfig, ESLint (flat config), and Tailwind config consumed by all three apps
  database/  Shared Supabase client + generated types (placeholder client only — no live project yet)
  lib/       Shared domain types/utils (Shipment, Booking, etc.) — empty skeleton
```

## Requirements

- Node.js >= 20
- pnpm 10 (this repo pins `packageManager: pnpm@10.33.0`)

## Install

```bash
pnpm install
```

## Run an app locally

```bash
pnpm --filter web dev      # http://localhost:3000
pnpm --filter portal dev   # http://localhost:3001
pnpm --filter admin dev    # http://localhost:3002
```

## Build / lint / typecheck everything

```bash
pnpm build
pnpm lint
pnpm typecheck
```

Each of these runs across the whole workspace via Turborepo (`turbo run <task>`); scope to a single app with `--filter`, e.g. `pnpm --filter web build`.

## Environment variables

Copy `.env.example` to `.env.local` in whichever app needs it (or `.env` at the root) and fill in real values. See that file for what each variable is for.

## Git hooks

Husky + lint-staged run ESLint and a full typecheck on every commit (`.husky/pre-commit`).
