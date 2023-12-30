import { CollectionEntityRes } from '~/types/ReqRes'
import GatheringEntity from './GatheringEntity'

export default class CollectionEntity<T> extends GatheringEntity<CollectionEntityRes<T>> {
  albums: T[]

  constructor(
    collection: CollectionEntityRes<T>,
    cardType: string,
    cardPath: string,
    Class?: new (prop: T) => T
  ) {
    super(collection, cardType, cardPath)
    this.albums = Class
      ? collection.albums.map((album) => new Class(album))
      : collection.albums
  }
}
