import type { Entity } from '~shared/lib'

export type EmbeddedBasic = Entity & {
  artist: Entity
  genre: Entity
  period: Entity
  frame: string
  kind: 'embedded'
}

export type EmbeddedFull = EmbeddedBasic
