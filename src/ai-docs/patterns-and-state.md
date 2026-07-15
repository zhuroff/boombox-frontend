# Patterns & State

## State management

**No Pinia.** Server state via **TanStack Vue Query**; local UI state via `ref` / `computed` in composables.

### Core composables (`shared/model/`)

| Composable             | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `useGetList`           | Paginated lists; `queryKey: [payload]`            |
| `useGetPage`           | Single entity by route id / `random` / genre path |
| `useCreateEntity`      | POST + cache invalidate                           |
| `useUpdateEntity`      | PATCH/PUT/reorder mutations                       |
| `useDeleteEntity`      | DELETE + feedback                                 |
| `useAlbumsWithRelated` | Album page + related albums queries               |
| `useUser`              | Auth cookies session                              |
| `useLocalization`      | `localize()`                                      |
| `useSnackbar`          | Toast messages                                    |
| `useDevice`            | Mobile/desktop breakpoints                        |

Common query options: `retry: 3`, `refetchOnWindowFocus: false`.

**Important:** Query data from vue-query is **readonly**. For optimistic UI (e.g. vinyl toggle), use a local `ref` synced via `watch` + mutation `onSuccess`, not direct mutation of `data.value`.

## EntityListView pattern

**File:** `views/entity-list-view/UI/EntityListView.vue`

Standard list page template:

1. `usePaginator` → `paginationState` (`page`, `limit`, `sort`).
2. `listQueryConfig` = `{ entityKey, requestConfig: { ...paginationState, ...additionalRequestConfig } }`.
3. `useGetList(listQueryConfig, dbService)`.
4. Renders `Header`, `EntityCardList`, `Paginator`, optional delete modal.

**Props:**

- `entityKey` — API segment (`albums`, `artists`, …).
- `placeholderPreview` — card fallback image.
- `pageHeadingKey` — localization key for title + count.
- `additionalRequestConfig` — optional `MaybeRefOrGetter<Partial<RequestConfig>>` for filters/sort override.

**Slots:** `#header`, `#under-header`.

**Typical category list page:**

```vue
<EntityListView entityKey="artists" placeholderPreview="/img/artist.webp" pageHeadingKey="headings.artistsPage" />
```

## usePaginator

**File:** `features/paginator/lib/usePaginator.ts`

- Syncs `page` to `?page=` query (merges with existing query params).
- Page size persisted: `localStorage` key `docs-limit:{entityKey}`.
- Default limit: `DEFAULT_PAGE_DOCS_LIMIT = 30` (`shared/constants.ts`); album list overrides sort via `useAlbumSort`.

- `isRouted: false` for embedded pagination (e.g. home Discogs tabs).

Changing filters should reset `page` to `1` in route query (see album filter composables).

**Album list mobile:** filter dropdowns in header are hidden below desktop breakpoint (`Header.vue` CSS).

## Album list filters & sort

All in `entities/album/` — same composable pattern:

| Composable            | URL param     | API field                                        |
| --------------------- | ------------- | ------------------------------------------------ |
| `useAlbumNoteFilter`  | `noteFilter`  | `noteFilter`                                     |
| `useAlbumVinylFilter` | `vinylFilter` | `vinylFilter`                                    |
| `useAlbumSort`        | `albumSort`   | `sort` (converted via `albumSortToSortingValue`) |

**UI:** `AlbumNoteFilter`, `AlbumVinylFilter`, `AlbumSortFilter` — `Dropdown` with `isInverted` in dark header.

**Default sort:** `dateCreated-desc` (`entities/album/lib/albumSort.ts`).

**Album list page** merges all three `requestConfigPart` into `EntityListView.additionalRequestConfig`.

## Album single page patterns

- `useAlbum(dbService)` — page data + `updateAlbumNote`, `updateAlbumVinyl`.
- `PageHeadAdapter` → `AlbumPageHead` for album kind only.
- **Vinyl toggle:** `isVinylAvailable` ref passed as prop (not derived from readonly query data).
- Confirmation modal before unsetting vinyl (`Confirmation` component).

## PageHead actions

- Standard actions: search, wiki, add to collection, random — always `isInverted` rounded buttons.
- Vinyl button: `className="--vinyl-toggle"`, `:isInverted="isVinylAvailable"`, custom styles in `PageHeadActions.vue`.

## Localization

- Dictionaries: `features/localization/lib/dictionaries/{en,by}.ts`.
- Keys: dot notation (`headings.albumsPage`, `albumSort.dateCreated-desc`).
- Placeholders: `{x}` in strings.

## UI kit usage

Import from `~shared/UI`. Dropdown inverted variant for header on dark background. Sprites via `<Sprite name="vinyl" />`.

## Adding a new list filter (checklist)

1. Add type to `shared/lib/common/types.ts` + backend `pagination.d.ts`.
2. Implement filter in `AlbumRepository` (combine with `$and` if needed).
3. Create `useAlbumXFilter` composable (route sync + `requestConfigPart`).
4. Create `AlbumXFilter.vue` dropdown.
5. Wire in `album-list-page` + localization strings.
