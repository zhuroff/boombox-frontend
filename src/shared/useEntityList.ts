import type { ComputedRef } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import DatabaseService from '~/services/DatabaseService'

const useEntityList = <T>(
  payload: ComputedRef<UseEntityListPayload>,
  dbService: DatabaseService,
  isEnabled?: ComputedRef<boolean>
) => {
  const { refetch, isFetched, isError, data, error } = useQuery<ListPageResponse<T>>({
    retry: 3,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryKey: [payload],
    queryFn: () => dbService.getEntityList(
      payload.value.entityKey,
      payload.value.requestConfig
    ),
  })

  return {
    isFetched,
    refetch,
    isError,
    error,
    data
  }
}

export default useEntityList
