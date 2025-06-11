import type { AlbumBasic } from '~entities/album'

export type SyncResponse = {
  added: AlbumBasic[]
  updated: AlbumBasic[]
  deleted: AlbumBasic[]
  invalid: Record<string, string>[]
}

export type SyncDataPayload = {
  data: SyncResponse
  reset: () => void
}
