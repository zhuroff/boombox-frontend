import type { TrackBasic } from '~entities/track'
import type { Entity } from '~shared/lib'

export type CompilationBasic = Entity & {
  avatar?: string
  entities: string[]
  kind: 'compilation'
}

export type CompilationFull = CompilationBasic & {
  tracks: TrackBasic[]
}
