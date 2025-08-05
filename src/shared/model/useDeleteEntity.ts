import type { Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { ListPageResponse } from '../lib'
import type DatabaseService from '~/shared/api/DatabaseService'

const useDeleteEntity = <T>(
  entityKey: Ref<string> | string,
  entityId: Ref<string | null>,
  dbService: DatabaseService,
  isEnabled: Ref<boolean>
) => {
  const { isFetched, isError, data, error, isFetching } = useQuery<ListPageResponse<T>>({
    queryKey: ['delete', entityKey],
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
    isError,
    error,
    data
  }
}

export default useDeleteEntity
