import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type {
  UsePaginationProps,
  PaginationState,
  PaginationConfig,
  PaginationStateSetter,
  PaginationConfigSetter
} from '~widgets/Paginator/model/types'

const usePaginator = ({
  docsLimit = 30,
  docsSort = { title: 1 },
  isRouted = true,
  localStorageKey
}: UsePaginationProps) => {
  const { query } = useRoute()
  const router = useRouter()

  const paginationState: PaginationState = reactive({
    page: Number(query.page) || 1,
    limit: docsLimit,
    sort: docsSort
  })

  const paginationConfig: PaginationConfig = reactive({
    limiter: [12, 15, 18, 30, 45, 48, 60, 75, 78, 100, 102],
    increment: true,
    decrement: true,
    totalDocs: 0,
    totalPages: 0,
    selected: paginationState.limit
  })
  
  const updatePaginationState: PaginationStateSetter = (key, value) => {
    paginationState[key] = value

    switch(key) {
      case 'page':
        changeRouteQuery({ page: String(value) })
        break
      case 'limit':
        paginationState.page = 1
        changeRouteQuery({ page: '1' })

        if (localStorageKey) {
          localStorage.setItem(localStorageKey, value.toString())
        }
        break
    }
  }

  const updatePaginationConfig: PaginationConfigSetter = (key, value) => {
    paginationConfig[key] = value
  }

  const changeRouteQuery = (query: Record<string, number | string>) => {
    if (!isRouted) return
    router.push({ query })
  }

  onMounted(() => {
    if (!query.page) {
      changeRouteQuery({ page: paginationState.page })
    }
  })

  return {
    paginationState,
    paginationConfig,
    updatePaginationState,
    updatePaginationConfig
  }
}

export default usePaginator
