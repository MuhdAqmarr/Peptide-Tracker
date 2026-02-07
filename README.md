# ProtocolPal

A personal scheduling and tracking tool built with Next.js, Supabase, and TailwindCSS.

> **Disclaimer:** This app is for tracking only. It does not provide medical advice.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** TailwindCSS
- **Auth & DB:** Supabase (OAuth + Postgres)
- **i18n:** next-intl (English + Bahasa Melayu)
- **Validation:** Zod
- **Data Fetching:** TanStack Query (client), Server Actions (mutations)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- A Supabase project (free tier works)

### Setup

1. Clone the repo and install dependencies:

```bash
pnpm install
```

2. Copy the env example and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase project URL and anon key from the Supabase Dashboard.

3. Run the dev server:

```bash
pnpm dev
```

4. Open http://localhost:3000 — you'll be redirected to `/en`.

### Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Project Structure

```
src/
  app/
    [locale]/           # Locale-based routing (en, ms)
      dashboard/        # Dashboard page
      protocols/        # Protocols page
      peptides/         # Peptides page
      settings/         # Settings page
  components/
    ui/                 # Reusable UI components
    layout/             # Layout components (Navbar, etc.)
    forms/              # Form components
  i18n/
    messages/
      en/               # English translations (9 namespaces)
      ms/               # Bahasa Melayu translations (9 namespaces)
    routing.ts          # Locale routing config
    request.ts          # Server request config
    navigation.ts       # Typed navigation helpers
  lib/
    supabase/           # Supabase client/server helpers
    db/
      types.ts          # Database TypeScript types
      dal/              # Data Access Layer modules
    scheduler/          # Scheduling engine
    validators/         # Zod schemas
    logger.ts           # Logging utility
  tests/                # Test files
```

## i18n

The app supports English (`en`) and Bahasa Melayu (`ms`) via locale-prefixed routing:
- `/en/dashboard`
- `/ms/dashboard`

Use the language switcher in the navbar to change languages.
