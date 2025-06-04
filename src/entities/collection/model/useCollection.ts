import { ref } from 'vue'
import { useGetPage } from '~shared/model'
import type { DatabaseService } from '~shared/api'
import type { CollectionBasic, CollectionFull } from '../lib/types'

const useCollection = (dbService: DatabaseService) => {
  const entityKey = ref('collections')

  const { data, isFetched, queryClient, queryKey } = useGetPage<CollectionBasic>(entityKey, dbService)

  const updateCollectionValue = <T extends keyof CollectionFull>(key: T, value: CollectionFull[T]) => {
    queryClient.setQueryData<CollectionFull>(queryKey, (oldData) => {
      if (!oldData) return oldData

      return {
        ...oldData,
        [key]: value,
      }
    })
  }

  return {
    isFetched,
    collection: data,
    updateCollectionValue
  }
}

export default useCollection
