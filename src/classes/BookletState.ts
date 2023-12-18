import { AlbumBooklet } from '~/types/Album'
import CloudContent from './CloudContent'

export default class BookletState extends CloudContent<AlbumBooklet> {
  isActive: boolean = false
  isCompleted: boolean = false
  isEmpty: boolean = false

  constructor() {
    super()
  }
}
