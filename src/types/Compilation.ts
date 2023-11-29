import { AlbumItem } from './Album'
import { BasicEntity } from './Common'
import { TrackResponse } from './Track'

export interface Compilation extends BasicEntity {
  poster?: string
  avatar?: string
  albums: string[]
}

export interface CompilationCreating {
  entityType: string
  entityID: string
  results: Compilation[]
}

export interface CompilationUpdating {
  entityType: string
  compilationID: string
  entityID: string
  results: Compilation[]
}

export interface CompilationPayloadCreate {
  entityID: string
  title: string
}

export interface CompilationPayloadUpdate {
  entityID: string
  compilationID: string
  isInList: boolean
  order: number
}

export interface CompilationAlbums extends Omit<Compilation, 'albums'> {
  albums: AlbumItem[]
  order: number
}

export interface CompilationTracks extends Omit<Compilation, 'albums'> {
  tracks: TrackResponse[]
  order: number
}
