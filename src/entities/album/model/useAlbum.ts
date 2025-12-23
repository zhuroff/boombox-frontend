import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useAlbumsWithRelated } from '~shared/model'
import type { AlbumFull } from '../lib/types'
import type { DatabaseService } from '~shared/api'

const useAlbum = (dbService: DatabaseService) => {
  const preRandomState = ref('')
  const pageEntityKey = ref('albums')

  const { mutate: updateAlbumNote } = useMutation({
    mutationFn: ([albumId, note]: [string, string]) => (
      dbService.updateEntry(pageEntityKey.value, albumId, 'note', { note })
    )
  })

  return {
    updateAlbumNote,
    ...useAlbumsWithRelated<AlbumFull>(
      pageEntityKey,
      dbService,
      preRandomState
    )
  }
}

export default useAlbum
