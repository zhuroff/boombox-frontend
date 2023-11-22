import { CloudFolderResponse } from '~/types/Cloud'

export class CloudContentDTO<T> {
  items: T[]
  limit: number
  offset: number
  total: number
  isFetched: boolean

  constructor(folder?: CloudFolderResponse<T>) {
    this.items = folder?.items || []
    this.limit = folder?.limit || 10
    this.offset = folder?.offset || 0
    this.total = folder?.total || 0
    this.isFetched = Boolean(folder)
  }
}
