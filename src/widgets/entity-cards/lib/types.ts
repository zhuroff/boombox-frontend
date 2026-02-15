import type { CollectionBasic, CollectionFull } from '~entities/collection'
import type { AlbumBasic, AlbumFull } from '~entities/album'
import type { CompilationBasic, CompilationFull } from '~entities/compilation'
import type { CategoryBasic } from '~entities/category'
import type { EmbeddedBasic, EmbeddedFull } from '~entities/embedded'

type EntityMap = {
  AlbumBasic: AlbumBasic
  EmbeddedBasic: EmbeddedBasic
  CategoryBasic: CategoryBasic
  CollectionBasic: CollectionBasic
  CompilationBasic: CompilationBasic
}

type EntityFullMap = {
  AlbumFull: AlbumFull
  EmbeddedFull: EmbeddedFull
  CollectionFull: CollectionFull
  CompilationFull: CompilationFull
}

export type UnifiedEntityCard = EntityMap[keyof EntityMap]

export type ExcludeFromUnifiedEntityCard<T extends keyof EntityMap> = Exclude<UnifiedEntityCard, EntityMap[T]>

export type UnifiedEntityFullCard = EntityFullMap[keyof EntityFullMap]
