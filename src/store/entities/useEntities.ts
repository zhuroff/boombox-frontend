import { useQuery } from '@tanstack/vue-query'
import dbServices from '~/services/database.services'
import usePagination from '~/hooks/usePagination'

const useEntities = (entityKey: string) => {
  const { pagination, setPaginationPage, setPaginationLimit } = usePagination()

  const { isPending, isError, data, error } = useQuery({
    queryKey: [entityKey],
    queryFn: dbServices.getEntityList.bind(this, pagination, entityKey),
  })

  return {
    isPending,
    isError,
    data,
    error,
    pagination,
    setPaginationPage,
    setPaginationLimit
  }
}

export default useEntities
