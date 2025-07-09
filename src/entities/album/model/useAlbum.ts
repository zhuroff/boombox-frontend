import { ref } from 'vue'
import type { AlbumFull } from '../lib/types'
import type { DatabaseService } from '~shared/api'
import { useAlbumsWithRelated } from '~shared/model'

const useAlbum = (dbService: DatabaseService) => {
  const preRandomState = ref('')
  const pageEntityKey = ref('albums')

  return useAlbumsWithRelated<AlbumFull>(
    pageEntityKey,
    dbService,
    preRandomState
  )
}

export default useAlbum
