export type EntityImagesKeys = 'poster' | 'avatar'

export interface ImagePayload {
  file: File
  type: EntityImagesKeys
  slug: string
  id: string
}

export interface UploadImageResult {
  key: EntityImagesKeys
  url: string
}
