import { useQuery } from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'
import dbServices from '~/services/database.services'

const useEntityList = <T>(payload: ComputedRef<UseEntityListPayload>, isEnabled?: ComputedRef<boolean>) => {
  const { refetch, isFetched, isError, data, error } = useQuery<ListPageResponse<T>>({
    retry: 3,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryKey: [payload],
    queryFn: () => dbServices.getEntityList(payload.value.entityKey, payload.value.requestConfig),
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
