import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const usePagination = ({ isRouted = true }: UsePaginationProps) => {
  const { name, query } = useRoute()
  const router = useRouter()

  const pagination = reactive<PaginationState>({
    page: Number(query.page) || 1,
    limit: Number(localStorage.getItem(`entitiesLimit:${String(name)}`)) || 15,
    sort: { title: 1 }
  })

  const paginationConfig = reactive<PaginationConfig>({
    limiter: [12, 15, 18, 30, 45, 48, 60, 75, 78, 100, 102],
    increment: true,
    decrement: true,
    totalDocs: 0,
    totalPages: 0,
    selected: pagination.limit
  })
  
  const updatePaginationState: PaginationStateSetter = (key, value) => {
    pagination[key] = value

    switch(key) {
      case 'page':
        changeRouteQuery({ page: String(value) })
        break
      case 'limit':
        pagination.page = 1
        changeRouteQuery({ page: '1' })
        localStorage.setItem(`entitiesLimit:${name?.toString()}`, value.toString())
        break
    }
  }

  const updatePaginationConfig: PaginationConfigSetter = (key, value) => {
    paginationConfig[key] = value
  }

  const changeRouteQuery = (query: Record<string, number | string>) => {
    router.push({ query })
  }

  onMounted(() => {
    if (!isRouted) return

    const { page } = query

    if (!page) {
      changeRouteQuery({ page: pagination.page })
    }
  })

  return {
    pagination,
    paginationConfig,
    updatePaginationState,
    updatePaginationConfig
  }
}

export default usePagination
