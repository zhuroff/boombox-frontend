import { CompilationEntityRes } from '~/types/ReqRes'
import GatheringEntity from './GatheringEntity'

export default class CompilationEntity<T> extends GatheringEntity<CompilationEntityRes<T>> {
  tracks: T[]

  constructor(compilation: CompilationEntityRes<T>, Class?: new (x: T) => T) {
    super(compilation)
    this.tracks = Class
      ? compilation.tracks.map((track) => new Class(track))
      : compilation.tracks
  }
}
