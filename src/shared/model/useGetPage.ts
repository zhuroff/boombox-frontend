import { computed, reactive, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useQueryClient } from '@tanstack/vue-query'
import type { DatabaseService } from '~shared/api'

const useGetPage = <T extends Entity>(
  entityKey: Ref<string>,
  dbService: DatabaseService,
  preRandomState?: Ref<string>
) => {
  const route = useRoute()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const routePath = computed(() => {
    if (preRandomState?.value) {
      return 'random'
    }

    return typeof route.params.id === 'string'
      ? route.params.id
      : route.params.id.join('/')
  })

  const queryKey = reactive([routePath, preRandomState])

  const { refetch, isFetched, isRefetching, isError, data, error, isFetching } = useQuery<T>({
    queryKey,
    retry: 3,
    refetchOnWindowFocus: false,
    queryFn: () => dbService.getEntityPage(entityKey.value, routePath.value)
  })

  watch(
    [isFetched, data],
    ([newFetched, newData]) => {
      if (newFetched && preRandomState?.value) {
        router.replace(`/${entityKey.value}/${newData?._id}`)
      }
    },
  )

  watch(
    [route, data],
    ([newRouteState, newDataState], [_, prevDataState]) => {
      if (!prevDataState?._id || !newDataState?._id || !preRandomState) return
      if (newDataState._id !== newRouteState.params.id) {
        preRandomState.value = ''
      }
    }
  )

  return {
    isRefetching,
    queryClient,
    isFetching,
    isFetched,
    queryKey,
    refetch,
    isError,
    error,
    data
  }
}

export default useGetPage
