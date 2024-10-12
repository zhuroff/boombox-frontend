import { useQuery } from '@tanstack/vue-query'
import dbServices from '~/services/database.services'

const useEntities = <T>(entityKey: string, pagination: PaginationState) => {
  const { refetch, isFetched, isError, data, error } = useQuery<ListPageResponse<T>>({
    queryKey: [entityKey, pagination],
    queryFn: () => dbServices.getEntityList(pagination, entityKey),
  })

  const deleteEntity = async (payload: DeletePayload) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 2000);
      })
    } catch (error) {
      throw error
    }
  }

  return {
    deleteEntity,
    isFetched,
    refetch,
    isError,
    error,
    data
  }
}

export default useEntities
