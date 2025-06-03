import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { SyncResponse } from '~shared/lib'
import type { DatabaseService } from '~shared/api'

const useSync = (dbService: DatabaseService) => {
  const queryClient = useQueryClient()

  const { refetch, isFetched, isError, data, error, isFetching } = useQuery<SyncResponse>({
    queryKey: ['sync'],
    retry: 3,
    enabled: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: () => dbService.sync()
  })

  const reset = () => {
    queryClient.resetQueries({ queryKey: ['sync'] })
  }

  return {
    refetch,
    isFetched,
    isError,
    data,
    error,
    isFetching,
    reset
  }
}

export default useSync
