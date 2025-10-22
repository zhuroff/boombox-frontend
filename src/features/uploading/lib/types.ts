export type EntityImagesKeys = 'poster' | 'avatar'

export interface ImagePayload<T> {
  file: File
  type: T
  slug: string
  id: string
}

export interface UploadImageResult {
  key: EntityImagesKeys
  url: string
}
