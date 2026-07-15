# API Layer & Types

## HTTP client (`shared/api/api.ts`)

- Native **fetch** wrapper (not axios).
- `credentials: 'include'` — session cookies.
- **403** → clears user auth state.
- Methods: `api.get`, `post`, `patch`, `put`, `delete`.
- Throws `ApiError` on non-2xx.

## DatabaseService (`shared/api/DatabaseService.ts`)

Generic CRUD mapped to backend `entityKey`:

| Method                                      | HTTP                                  |
| ------------------------------------------- | ------------------------------------- |
| `getEntityList(entityKey, config)`          | `GET /api/{entityKey}?…`              |
| `getEntityPage(entityKey, path)`            | `GET /api/{entityKey}/{path}`         |
| `createEntity`                              | `POST /api/{entityKey}/create`        |
| `updateEntity`                              | `PATCH /api/{entityKey}/update`       |
| `updateEntry(entityKey, id, path, payload)` | `PUT /api/{entityKey}/{id}/{path}`    |
| `deleteEntity`                              | `DELETE /api/{entityKey}/{id}`        |
| `reorderEntities`                           | `PATCH /api/{entityKey}/{id}/reorder` |
| `sync()`                                    | `POST /api/sync`                      |

### Query string builder

`#configToQueryString` flattens nested objects into dot notation:

```typescript
{ page: 1, limit: 12, sort: { dateCreated: -1 }, noteFilter: 'withReviews' }
// → page=1&limit=12&sort.dateCreated=-1&noteFilter=withReviews
```

Matches backend `Parser.parseNestedQuery`.

## Entity keys (frontend ↔ backend)

| entityKey      | Entity      |
| -------------- | ----------- |
| `albums`       | Album       |
| `tracks`       | Track       |
| `artists`      | Artist      |
| `genres`       | Genre       |
| `periods`      | Period      |
| `collections`  | Collection  |
| `compilations` | Compilation |
| `users`        | User        |

## Shared types (`shared/lib/common/types.ts`)

### Pagination

```typescript
PaginationState = { page, limit, sort: Record<string, 1 | -1> }
RequestConfig = PaginationState & {
  isRandom?: true | 1
  path?: string
  filter?: RelatedAlbumsReqFilter
  noteFilter?: AlbumNoteFilter
  vinylFilter?: AlbumVinylFilter
}
```

### Album filters

```typescript
AlbumNoteFilter = 'all' | 'withReviews' | 'withoutReviews'
AlbumVinylFilter = 'all' | 'onVinyl' | 'notOnVinyl'
AlbumSortOption =
  | 'title-asc' | 'title-desc'
  | 'period-asc' | 'period-desc'
  | 'dateCreated-asc' | 'dateCreated-desc'
  | 'modified-asc' | 'modified-desc'
```

### List response

```typescript
ListPageResponse<T> = { docs: T[], pagination: { totalDocs, totalPages, page } }
```

### CloudEntity (not MongoDB track)

`CloudEntity.created` / `modified` are **cloud file metadata strings** — used only during sync on backend, not stored as track `created` field.

## Entity-specific services

| Service          | Location                  |
| ---------------- | ------------------------- |
| `UserService`    | `entities/user/api/`      |
| `DiscogsService` | `features/discogs/api/`   |
| `SearchService`  | `features/search/api/`    |
| `BackupService`  | `features/backup/api/`    |
| `UploadService`  | `features/uploading/api/` |
| `WikiService`    | `features/wiki/api/`      |

Pages typically use `new DatabaseService()` locally and pass to composables.

## Album entity types (`entities/album/lib/types.ts`)

```typescript
AlbumBasic — card/list item
AlbumFull — single page: tracks, note, availableOnVinyl, inCollections
```

## Album mutations (frontend)

```typescript
// useAlbum.ts
updateAlbumNote([albumId, note])
updateAlbumVinyl([albumId, availableOnVinyl]) // PUT /api/albums/:id/vinyl
```

## Type-check scope

- App: `tsconfig.app.json` includes `src/**/*` except `__tests__` and **`src/ai-docs/**`**.
- Run: `yarn type-check` before considering work complete.
