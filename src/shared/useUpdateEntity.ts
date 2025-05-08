import type { ComputedRef, Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type DatabaseService from '~/shared/api/DatabaseService'

const useUpdateEntity = <T, U>(
  entityKey: Ref<string>,
  payload: Ref<U | null>,
  dbService: DatabaseService,
  isEnabled: ComputedRef<boolean>
) => {
  const { refetch, isFetched, isError, data, error, isFetching } = useQuery<ListPageResponse<T>>({
    queryKey: [entityKey],
    retry: 3,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryFn: () => dbService.updateEntity(entityKey.value, payload.value)
  })

  return {
    isFetching,
    isFetched,
    refetch,
    isError,
    error,
    data
  }
}

export default useUpdateEntity
