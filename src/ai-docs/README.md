# Boombox Frontend — AI Context

Documentation for LLM agents working on **boombox-frontend** (SPA **MelodyMap**). Read these files before exploring the codebase.

## What this project is

Vue 3 SPA for managing and playing a personal music collection: albums, artists, genres, periods, collections, compilations, player, sync, backup, Discogs integration. Talks to **boombox-backend** on port 3001 (`/api` and `/uploads` proxied in dev).

## Tech stack

| Item         | Choice                          |
| ------------ | ------------------------------- |
| Framework    | Vue 3 (`<script setup>`)        |
| Build        | Vite 8                          |
| Router       | Vue Router 5 (lazy routes)      |
| Server state | TanStack Vue Query 5            |
| Forms        | TanStack Vue Form               |
| Styles       | SCSS                            |
| Architecture | **Feature-Sliced Design (FSD)** |

## Document map

| File                                             | Contents                                         |
| ------------------------------------------------ | ------------------------------------------------ |
| [architecture.md](./architecture.md)             | FSD layers, routing, entry, aliases              |
| [patterns-and-state.md](./patterns-and-state.md) | EntityListView, pagination, filters, composables |
| [api-and-types.md](./api-and-types.md)           | HTTP client, DatabaseService, shared types       |

## Build & docs exclusion

- **Production build:** `yarn build` → `vue-tsc` + `vite build`.
- **`src/ai-docs/`** excluded from `tsconfig.app.json` — not type-checked as app code.
- Markdown is **never imported** by app code → not in Vite bundle.

## Commands

```bash
yarn dev          # Vite dev server, proxies /api and /uploads → localhost:3001
yarn build        # type-check + production build
yarn type-check   # vue-tsc only
yarn test:unit    # Vitest
```

## Path aliases

| Alias           | Path            |
| --------------- | --------------- |
| `~` / `~shared` | `src/shared/`   |
| `~app`          | `src/app/`      |
| `~pages`        | `src/pages/`    |
| `~views`        | `src/views/`    |
| `~widgets`      | `src/widgets/`  |
| `~features`     | `src/features/` |
| `~entities`     | `src/entities/` |

Import example: `import { EntityListView } from '~views/entity-list-view'`.

## FSD rule

**Import direction:** `app → pages → views → widgets → features → entities → shared`. Lower layers must not import upper layers.

## Locales

EN + BY (`features/localization`). Bootstrapped in `main.ts` via `useTranslate()`. Use `localize('key.path')` in components.
