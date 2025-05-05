import type { ComputedRef, Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type DatabaseService from '~/services/DatabaseService'

const useGetList = <T>(
  payload: ComputedRef<UseEntityListPayload>,
  dbService: DatabaseService,
  isEnabled?: ComputedRef<boolean> | Ref<boolean>
) => {
  const { refetch, isFetched, isFetching, isError, data, error } = useQuery<ListPageResponse<T>>({
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
    isFetching,
    isFetched,
    refetch,
    isError,
    error,
    data
  }
}

export default useGetList
