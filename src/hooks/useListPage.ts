import { ComputedRef, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Pagination, RequestConfig, SortingValue } from '~/types/Common'
import { ListPageResponse } from '~/types/ReqRes'
import dbServices from '~/services/database.services'

export const useListPage = <T, C>(
  Class: new (card: T, type: string, path: string) => C,
  cardType: string,
  cardPath: string
) => {
  const { name, query } = useRoute()
  const router = useRouter()
  const isDataFetched = ref(false)
  const pageSorting = ref<SortingValue>({ title: 1 })
  const pagePagination = ref<Pagination>({
    page: Number(query.page) || 1,
    limit: localStorage.getItem(`entitiesLimit:${name?.toString()}`)
      ? Number(localStorage.getItem(`entitiesLimit:${name?.toString()}`))
      : 15
  } as Pagination)

  const pageStateConfig: ComputedRef<RequestConfig> = computed(() => ({
    page: pagePagination.value.page,
    limit: pagePagination.value.limit,
    sort: { ...pageSorting.value }
  }))

  const changeRouteQuery = (query: Record<string, number | string>) => {
    router.push({ query })
  }

  const switchPagination = (page: number) => {
    pagePagination.value.page = page
    isDataFetched.value = false
    changeRouteQuery({ page })
  }

  const setEntitiesLimit = (limit: number) => {
    pagePagination.value.limit = limit
    pagePagination.value.page = 1
    isDataFetched.value = false
    name && localStorage.setItem(`entitiesLimit:${name.toString()}`, limit.toString())
    changeRouteQuery({ page: 1 })
  }

  const fetchData = async (entityType: string) => {
    isDataFetched.value = false

    try {
      const { docs, pagination } = await dbServices.getEntityList<ListPageResponse<T>>(
        pageStateConfig.value, entityType
      )
      pagePagination.value = Object.assign(pagePagination.value, pagination)
      return docs.map((doc) => new Class(doc, cardType, cardPath))
    } catch (error) {
      console.error(error)
    } finally {
      isDataFetched.value = true
    }
  }

  onMounted(() => {
    const { page } = query

    if (!page) {
      changeRouteQuery({ page: pagePagination.value.page })
    }
  })

  return {
    fetchData,
    isDataFetched,
    pagePagination,
    switchPagination,
    setEntitiesLimit,
    pageStateConfig
  }
}
