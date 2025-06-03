import type { Ref } from 'vue'
import type { DatabaseService } from '~shared/api'
import { useGetPage } from '~shared/model'
import type { Category } from '~shared/lib'

const useCategory = (categoryKey: Ref<string>, dbService: DatabaseService) => {
  const { data, isFetched, queryClient, queryKey } = useGetPage<Category>(categoryKey, dbService)

  const updateCategoryValue = <T extends keyof Category>(key: T, value: Category[T]) => {
    queryClient.setQueryData<Category>(queryKey, (oldData) => {
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
