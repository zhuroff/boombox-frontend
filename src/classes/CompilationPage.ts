import type { CompilationEntityRes, TrackRes } from '~/types/ReqRes'
import GatheringEntity from './GatheringEntity'
import AlbumTrack from './AlbumTrack'

export default class CompilationPage<T extends TrackRes> extends GatheringEntity<CompilationEntityRes<T>> {
  tracks: AlbumTrack[]

  constructor(
    compilation: CompilationEntityRes<T>,
    cardType: string,
    cardPath: string
  ) {
    super(compilation, cardType, cardPath)
    this.tracks = compilation.tracks.map((track, index) => (
      new AlbumTrack({
        ...track,
        title: `${track.artist.title} - ${track.title} («${track.inAlbum.title}», ${track.period.title})`
      }, index + 1, compilation.avatar)
    ))
  }
}
