import type { CollectionBasic } from '~entities/collection'
import type { AlbumBasic, AlbumFull } from '~entities/album'
import type { CompilationBasic, CompilationFull } from '~entities/compilation'
import type { CategoryBasic } from '~entities/category'
import type { EmbeddedBasic, EmbeddedFull } from '~entities/embedded'
import type { TOYAlbumBasic, TOYAlbumFull } from '~entities/toy'

type EntityMap = {
  AlbumBasic: AlbumBasic
  EmbeddedBasic: EmbeddedBasic
  CategoryBasic: CategoryBasic
  CollectionBasic: CollectionBasic
  CompilationBasic: CompilationBasic
  TOYAlbumBasic: TOYAlbumBasic
}

type EntityFullMap = {
  AlbumFull: AlbumFull
  EmbeddedFull: EmbeddedFull
  CompilationFull: CompilationFull
  TOYAlbumFull: TOYAlbumFull
}

export type UnifiedEntityCard = EntityMap[keyof EntityMap]

export type ExcludeFromUnifiedEntityCard<T extends keyof EntityMap> = Exclude<UnifiedEntityCard, EntityMap[T]>

export type UnifiedEntityFullCard = EntityFullMap[keyof EntityFullMap]
