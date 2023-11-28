import { AlbumItem } from './Album'
import { BasicEntity } from './Common'
import { TrackResponse } from './Track'

export interface Compilation extends BasicEntity {
  poster?: string
  avatar?: string
  quantity: number
}

export interface CompilationAlbums extends Omit<Compilation, 'quantity'> {
  albums: AlbumItem[]
  order: number
}

export interface CompilationTracks extends Omit<Compilation, 'quantity'> {
  tracks: TrackResponse[]
  order: number
}
