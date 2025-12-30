# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AgencyOS is a full-stack application for digital agency management built with **Nuxt 3** (frontend) and **Directus** (backend/CMS). It includes a public website, CRM/project tracker, and authenticated client portal with Stripe payments.

## Development Commands

```bash
# Install dependencies (pnpm required)
pnpm install

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Format markdown, yaml, json, vue files
pnpm format
```

### Local Directus Backend

```bash
# Start local Directus instance (http://localhost:8055)
cd .directus && docker compose up
```

## Architecture

### Stack
- **Frontend**: Nuxt 3, Vue 3 (Composition API), TypeScript
- **Backend**: Directus (headless CMS + REST/GraphQL API)
- **Styling**: Tailwind CSS + Nuxt UI component library
- **Forms**: FormKit
- **Payments**: Stripe

### Directory Structure

```
layers/                 # Nuxt layers for modular features
├── portal/            # Client portal (SSR disabled, authenticated)
└── proposals/         # Proposal builder

components/
├── base/              # Base UI components (no prefix needed)
├── blocks/            # Page builder blocks (15+ types)
└── [feature]/         # Feature-specific components

server/
├── api/               # Server API routes
└── utils/             # Server utilities (Directus client)

types/
├── blocks/            # Page builder block types
├── content/           # CMS content types
├── os/                # Agency OS types (projects, invoices, etc.)
├── meta/              # Navigation, globals, SEO
└── schema.ts          # Main Directus schema (Schema interface)
```

### Key Patterns

**Nuxt Layers**: Portal and proposals are separate Nuxt layers with their own pages, components, and configs. Portal layer runs with SSR disabled.

**Page Builder**: Dynamic pages rendered from Directus blocks. Each block type has a corresponding component in `components/blocks/`.

**Directus SDK**: All API calls use `@directus/sdk`. Server-side calls use the admin token (DIRECTUS_SERVER_TOKEN). The main schema is in `types/schema.ts`.

**Base Components**: Components in `components/base/` are auto-imported without a prefix (e.g., `VAlert`, `VText`, `VLoading`).

**Composables**: Use VueUse for composition utilities. Custom composables in `composables/`.

### Environment Variables

```env
DIRECTUS_URL="https://your-instance.directus.app"
DIRECTUS_SERVER_TOKEN="your_admin_token"
NUXT_PUBLIC_SITE_URL="http://localhost:3000"

# Optional: Stripe for portal payments
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Type System

The `types/schema.ts` file defines the complete Directus schema interface. Key collections:

- **Content**: `pages`, `posts`, `categories`, `forms`, `team`
- **Blocks**: `block_hero`, `block_cta`, `block_form`, etc.
- **OS (Agency)**: `os_projects`, `os_tasks`, `os_invoices`, `os_proposals`, `contacts`, `organizations`
- **Help**: `help_articles`, `help_collections`, `inbox`, `conversations`
- **Meta**: `globals`, `navigation`, `redirects`, `seo`

### Authentication

Directus auth is configured in `nuxt.config.ts`. Auth routes redirect to `/auth/signin`. Authenticated users are redirected to `/portal`. The portal layer requires authentication.
