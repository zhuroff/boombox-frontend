interface Entity {
  _id: string
  title: string
  dateCreated?: string
  cloudURL?: string
}

// artists, collections, genres, periods
interface Category extends Entity {
  poster?: string
  avatar?: string
  albums: Album[]
  embeddedAlbums?: unknown[]
}

// compilation
interface Compilation extends Entity {
  avatar?: string
  poster?: string
  tracks: Track[]
}

// album
interface Album extends Entity {
  folderName: string
  artist: Entity
  genre: Entity
  period: Entity
  path: string
  created?: string
  modified?: string
  tracks: Track[]
  inCollections: Entity[]
}

type AlbumShort = Required<Pick<Album, '_id' | 'title' | 'cloudURL' | 'folderName'>>

interface TOYAlbum extends Omit<Album, 'inCollections'> {
  metadataContent: MinimumAlbumInfo[] | null
}

// embedded
interface Embedded extends Entity {
  artist: Entity
  genre: Entity
  period: Entity
  frame: string
  inCollections: Entity[]
}

type UnifiedAlbum<T extends Entity, N> = T extends Entity ? N : never

interface Track extends Entity {
  fileName: string
  created?: string
  modified?: string
  path: string
  mimeType?: string
  listened: number
  inAlbum: AlbumShort
  inCompilations: Entity[]
  artist: Entity
  genre: Entity
  period: Entity
}

interface Token {
  _id: string
  user: User
  refreshToken: string
}
