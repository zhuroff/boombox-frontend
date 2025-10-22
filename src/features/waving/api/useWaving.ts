import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { categoryKeyDict } from '~shared/constants'
import type { DatabaseService } from '~shared/api'
import type { TrackBasic } from '~entities/track'

const useWaving = (dbService: DatabaseService, path = 'tracks/wave') => {
  const waveTracks = ref<TrackBasic[]>([])
  
  const { mutate: fetchWaving } = useMutation({
    mutationFn: ([entityKey, entityTitle]: [string, string]) => {
      return dbService.getEntityList<TrackBasic[]>(path, {
        page: 1,
        limit: 50,
        isRandom: true,
        sort: { createdAt: -1 },
        filter: {
          from: entityKey,
          key: `${categoryKeyDict[entityKey]}.title`,
          name: entityTitle
        }
      })
    },
    onSuccess: (data) => {
      waveTracks.value = data
    },
    onError: (error) => {
      console.error(error)
    }
  })

  return {
    fetchWaving,
    waveTracks
  }
}

export default useWaving
