import { useQuery } from '@tanstack/vue-query'
import dbServices from '~/services/database.services'

const useEntities = <T>(entityKey: string, pagination: PaginationState) => {
  const { isPending, isFetched, isError, data, error } = useQuery<ListPageResponse<T>>({
    queryKey: [entityKey, pagination],
    queryFn: () => dbServices.getEntityList(pagination, entityKey),
  })

  return {
    isPending,
    isFetched,
    isError,
    error,
    data
  }
}

export default useEntities
