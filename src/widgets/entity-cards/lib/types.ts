import type { Entity } from '~shared/lib'
import type { CollectionBasic } from '~entities/collection'
import type { AlbumBasic } from '~entities/album'
import type { CompilationBasic } from '~entities/compilation'
import type { CategoryBasic } from '~entities/category'
import type { EmbeddedBasic } from '~entities/embedded'
import type { TOYAlbumBasic } from '~entities/toy'

export type UnifiedEntityCard<T extends Entity = Entity> = T extends AlbumBasic ? AlbumBasic :
  T extends EmbeddedBasic ? EmbeddedBasic :
  T extends CategoryBasic ? CategoryBasic :
  T extends CollectionBasic ? CollectionBasic :
  T extends CompilationBasic ? CompilationBasic :
  T extends TOYAlbumBasic ? TOYAlbumBasic :
  Entity
