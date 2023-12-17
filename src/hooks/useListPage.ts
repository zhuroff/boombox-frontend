import { ComputedRef, Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Pagination, RequestConfig, SortingValue } from '~/types/Common'
import dbServices from '~/services/database.services'
import { ListPageResponse } from '~/types/ReqRes'

export const useListPage = <T, C>(Class: new (prop: T) => C) => {
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

  // const sortingOptions = ref<DropdownOption<SortingValue>[]>([
  //   {
  //     title: 'Title ASC',
  //     value: { title: 1 },
  //     isActive: true
  //   },
  //   {
  //     title: 'Title DESC',
  //     value: { title: -1 },
  //     isActive: false
  //   },
  //   {
  //     title: 'Created ASC',
  //     value: { dateCreated: 1 },
  //     isActive: false
  //   },
  //   {
  //     title: 'Created DESC',
  //     value: { dateCreated: -1 },
  //     isActive: false
  //   }
  // ])

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
      // entities.value = docs.map((doc) => new Class(doc))

      pagePagination.value = Object.assign(pagePagination.value, pagination)
      return docs.map((doc) => new Class(doc))
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
    // sortingOptions,
    switchPagination,
    setEntitiesLimit,
    pageStateConfig
  }
}