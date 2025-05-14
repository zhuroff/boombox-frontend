import type { ComputedRef, Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type DatabaseService from '~/shared/api/DatabaseService'

const useDeleteEntity = <T>(
  entityKey: Ref<string> | string,
  entityId: Ref<string | null>,
  dbService: DatabaseService,
  isEnabled: Ref<boolean>
) => {
  const { refetch, isFetched, isError, data, error, isFetching } = useQuery<ListPageResponse<T>>({
    queryKey: [entityKey],
    retry: 3,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryFn: () => (
      dbService.deleteEntity(typeof entityKey === 'string' ? entityKey : entityKey.value, entityId.value)
    )
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

export default useDeleteEntity
