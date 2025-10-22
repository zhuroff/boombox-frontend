import { ref } from 'vue'
import type { EmbeddedFull } from '../lib/types'
import type { DatabaseService } from '~shared/api'
import { useAlbumsWithRelated } from '~shared/model'

const useEmbedded = (dbService: DatabaseService) => {
  const preRandomState = ref('')
  const pageEntityKey = ref('embedded')

  return useAlbumsWithRelated<EmbeddedFull>(
    pageEntityKey,
    dbService,
    preRandomState
  )
}

export default useEmbedded
