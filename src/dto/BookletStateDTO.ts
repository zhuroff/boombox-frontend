import { CloudContentDTO } from './CloudContentDTO'
import { AlbumBooklet } from '~/types/Album'
import { CloudFolderResponse } from '~/types/Cloud'

export class BookletStateDTO extends CloudContentDTO<AlbumBooklet> {
  isActive: boolean

  constructor(folder?: CloudFolderResponse<AlbumBooklet>) {
    super(folder)
    this.isActive = Boolean(folder)
  }
}
