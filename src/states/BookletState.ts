import { CloudContent } from './CloudContent'
import { AlbumBooklet } from '~/types/Album'

export class BookletState extends CloudContent<AlbumBooklet> {
  isActive: boolean = false
  isCompleted: boolean = false
  isEmpty: boolean = false

  constructor() {
    super()
  }
}
