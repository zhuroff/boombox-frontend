import { CollectionEntityRes } from '~/types/ReqRes'
import GatheringEntity from './GatheringEntity'

export default class CollectionEntity<T> extends GatheringEntity<CollectionEntityRes<T>> {
  albums: T[]

  constructor(collection: CollectionEntityRes<T>, Class?: new (x: T) => T) {
    super(collection)
    this.albums = Class
      ? collection.albums.map((album) => new Class(album))
      : collection.albums
  }
}
