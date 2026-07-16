# Architecture (FSD)

## Directory layout

```
src/
├── app/           # Bootstrap: main.ts, App.vue, routes.ts, global SCSS
├── pages/         # Route screens (thin; one index.vue per route)
├── views/         # Cross-page templates (project-specific FSD extension: authorized shell, entity list)
├── widgets/       # Composite UI (header, player, tracklist, page-heads, …)
├── features/      # User capabilities (paginator, search, player, backup, …)
├── entities/      # Domain slices (album, track, collection, …)
└── shared/        # API, UI kit, composables, types, utils
```

## Slice segments (convention)

| Segment    | Contents                             |
| ---------- | ------------------------------------ |
| `UI/`      | Vue SFCs (`AlbumCard.vue`)           |
| `model/`   | Composables (`useAlbum.ts`)          |
| `lib/`     | Types, pure helpers (`albumSort.ts`) |
| `api/`     | Service classes                      |
| `index.ts` | Public barrel exports                |

## Entry & app shell

**`src/main.ts`:** Vue app + VueQuery + router + global styles + localization init (`useTranslate()` before mount).

**`App.vue`:** Auth gate → `AuthorizedView` (sidebar, player, snackbar, `<router-view>`) or `UnauthorizedView` (login).

## Routing (`app/routes.ts`)

- History mode: `createWebHistory(import.meta.env.BASE_URL)`.
- All pages **lazy-loaded** with `webpackChunkName` hints.
- Nested `RouterView` for list + single entity pairs.

| Path                              | Page          | Notes                       |
| --------------------------------- | ------------- | --------------------------- |
| `/`                               | `home-page`   | Discogs physical collection |
| `/albums`, `/albums/:id`          | list + single | Filters in list header      |
| `/artists`, `/genres`, `/periods` | list + single | Category entities           |
| `/collections`, `/compilations`   | list + single | Gatherings                  |
| `/settings`                       | settings      | Backup, sync, users         |
| `/*`                              | `404-page`    |                             |

**Nav:** routes with `meta.navLocaleKey` → Sidebar labels via `localize('navigation.*')`.

**URL state (album list):**

- `?page=` — pagination
- `?noteFilter=` — review filter
- `?vinylFilter=` — vinyl availability
- `?albumSort=` — sort option (e.g. `dateCreated-desc`)

Defaults omitted from URL when equal to default values.

## Pages vs views vs widgets

- **Page** (`pages/album-list-page/`): wires props/slots for one route; minimal logic.
- **View** (`views/entity-list-view/`): reusable list template (loader, header slot, cards, paginator).
- **Widget** (`widgets/page-heads/`): album hero, actions, metadata on single pages.

Example album list page:

```
pages/album-list-page → EntityListView + filter dropdowns in #header slot
```

Example album single:

```
pages/album-single-page → AlbumContent + PageHeadAdapter + TrackList + note editor
```

## Widgets (key)

| Widget         | Role                                                  |
| -------------- | ----------------------------------------------------- |
| `header`       | Sticky page heading + search modal slot               |
| `sidebar`      | Navigation                                            |
| `player`       | Global audio player                                   |
| `entity-cards` | Grid of album/entity cards                            |
| `page-heads`   | Album/compilation hero (cover, actions, vinyl toggle) |
| `tracklist`    | Draggable track list                                  |
| `text-editor`  | TipTap note editor                                    |

## Features (key)

| Feature          | Role                             |
| ---------------- | -------------------------------- |
| `paginator`      | `usePaginator`, `Paginator` UI   |
| `localization`   | Dictionaries, `LanguageSwitcher` |
| `search`         | Global search modal              |
| `player`         | Playlist service                 |
| `backup`, `sync` | Settings actions                 |
| `discogs`        | Home page collection             |

## Entities (key)

| Entity                      | Role                                                |
| --------------------------- | --------------------------------------------------- |
| `album`                     | Cards, filters (note/vinyl/sort), `useAlbum`, types |
| `track`                     | Track types, lyrics hooks                           |
| `collection`, `compilation` | Gathering types                                     |
| `category`                  | Shared category types                               |
| `user`                      | User table schemas                                  |

## Shared

| Area        | Path                                             |
| ----------- | ------------------------------------------------ |
| HTTP        | `shared/api/api.ts`, `DatabaseService.ts`        |
| Composables | `shared/model/useGetList.ts`, `useGetPage.ts`, … |
| UI kit      | `shared/UI/` (Button, Dropdown, Modal, …)        |
| Types       | `shared/lib/common/types.ts`                     |
| Constants   | `shared/constants.ts`                            |

## Styling

- Global: `app/styles/` (`variables.scss`, `reset.scss`, …).
- Component SCSS: `@use '~/app/styles/variables' as var`.
- Breakpoints: `@include var.media('>=desktop')`.

## Env

- `VITE_DEV_HOST` / `VITE_LIVE_HOST` — `hostString()` in utils (no `.env` committed; set locally for dev/prod builds). In dev, point `VITE_DEV_HOST` at the Vite origin (e.g. `http://localhost:5173`) so API and upload URLs stay same-origin and cookies work.
- Dev proxy (Vite): `/api` and `/uploads` → `http://localhost:3001` (uploads require auth cookie, same as production).
