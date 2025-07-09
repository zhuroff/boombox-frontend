import type { Ref } from 'vue'
import { useGetPage } from '~shared/model'
import type { DatabaseService } from '~shared/api'
import type { CategoryFull } from '../lib/types'

const useCategory = (categoryKey: Ref<string>, dbService: DatabaseService) => {
  const { data, isFetched, queryClient, queryKey } = useGetPage<CategoryFull>(categoryKey, dbService)

  const updateCategoryValue = <T extends keyof CategoryFull>(key: T, value: CategoryFull[T]) => {
    queryClient.setQueryData<CategoryFull>(queryKey, (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        [key]: value,
      }
    })
  }

  return {
    isFetched,
    category: data,
    updateCategoryValue
  }
}

export default useCategory
