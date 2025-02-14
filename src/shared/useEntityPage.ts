import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import dbServices from '~/services/database.services'

const useEntityPage = <T>(entityKey: string, isEnabled = true) => {
  const route = useRoute()
  
  const routePath = computed(() => (
    typeof route.params.id === 'string'
      ? route.params.id
      : route.params.id.join('/')
  ))

  const { refetch, isFetched, isRefetching, isError, data, error, isFetching } = useQuery<T>({
    queryKey: [entityKey, routePath],
    enabled: isEnabled,
    retry: 3,
    refetchOnWindowFocus: false,
    queryFn: () => dbServices.getEntity(entityKey, routePath.value),
  })

  return {
    isRefetching,
    isFetching,
    isFetched,
    refetch,
    isError,
    error,
    data
  }
}

export default useEntityPage
