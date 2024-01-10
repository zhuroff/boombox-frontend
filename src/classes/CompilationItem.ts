import { CompilationEntityRes } from '~/types/ReqRes'
import GatheringEntity from './GatheringEntity'

export default class CompilationItem<T> extends GatheringEntity<CompilationEntityRes<T>> {
  tracks: T[]

  constructor(
    compilation: CompilationEntityRes<T>,
    cardType: string,
    cardPath: string
  ) {
    super(compilation, cardType, cardPath)
    this.tracks = compilation.tracks
  }
}
