import { ComputedRef, Ref, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DropdownOption, ListPageResponse, Pagination, RequestConfig, SortingValue } from '~/types/Global'
import DBApiService from '~/services/DBApiService'

export const useListPage = <T>() => {
  const { query } = useRoute()
  const router = useRouter()
  const isDataFetched = ref(false)
  const entities = ref<T[]>([]) as Ref<T[]>
  const pageSorting = ref<SortingValue>({ title: 1 })
  const pagePagination = ref<Pagination>({
    page: Number(query.page) || 1,
    limit: 15
  } as Pagination)

  const pageStateConfig: ComputedRef<RequestConfig> = computed(() => ({
    page: pagePagination.value.page,
    limit: pagePagination.value.limit,
    sort: { ...pageSorting.value }
  }))

  const sortingOptions = ref<DropdownOption<SortingValue>[]>([
    {
      title: 'Title ASC',
      value: { title: 1 },
      isActive: true
    },
    {
      title: 'Title DESC',
      value: { title: -1 },
      isActive: false
    },
    {
      title: 'Created ASC',
      value: { dateCreated: 1 },
      isActive: false
    },
    {
      title: 'Created DESC',
      value: { dateCreated: -1 },
      isActive: false
    }
  ])

  const changeRouteQuery = (query: Record<string, number | string>) => {
    router.push({ query })
  }

  const changeSorting = (value: SortingValue) => {
    sortingOptions.value = sortingOptions.value.map((option) => (
      { ...option, isActive: JSON.stringify(option.value) === JSON.stringify(value) }
    ))
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
    changeRouteQuery({ page: 1 })
  }

  const switchSorting = (value: SortingValue) => {
    // pageStateConfig.sort = value
    // isDataFetched.value = false
    // changeSorting(value)
  }

  const fetchData = (entityType: string) => {
    DBApiService.getEntityList<ListPageResponse<T>>(pageStateConfig.value, entityType)
      .then(({ docs, pagination }) => {
        entities.value = docs
        pagePagination.value = Object.assign(pagePagination.value, pagination)
        isDataFetched.value = true
      })
      .catch(console.error)
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
    entities,
    pagePagination,
    sortingOptions,
    switchPagination,
    setEntitiesLimit,
    pageStateConfig,
    switchSorting
  }
}