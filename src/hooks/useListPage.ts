import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DropdownOption, ListPageResponse, Pagination, RequestConfig, SortingValue } from '~/types/Global'
import DBApiService from '~/services/DBApiService'

export const useListPage = <T>() => {
  const { query } = useRoute()
  const router = useRouter()
  const isDataFetched = ref(false)

  const pageStateConfig = reactive<RequestConfig>({
    page: Number(query.page) || 1,
    sort: { title: 1 },
    limit: 40
  })

  const entities = reactive<T[]>([])
  const pagePagination = ref<Pagination>(null!)

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
    pageStateConfig.page = page
    isDataFetched.value = false
    changeRouteQuery({ page })
  }

  const switchSorting = (value: SortingValue) => {
    // pageStateConfig.sort = value
    // isDataFetched.value = false
    // changeSorting(value)
  }

  const fetchData = (entityType: string) => {
    DBApiService.getEntityList<ListPageResponse<T>>(pageStateConfig, entityType)
      .then(({ docs, pagination }) => {
        entities.length = 0
        // @ts-ignore
        entities.push(...docs)
        pagePagination.value = pagination
        isDataFetched.value = true
      })
      .catch(console.error)
  }

  onMounted(() => {
    const { page } = query

    if (!page) {
      changeRouteQuery({ page: pageStateConfig.page })
    }
  })

  return {
    fetchData,
    isDataFetched,
    entities,
    pagePagination,
    sortingOptions,
    switchPagination,
    pageStateConfig,
    switchSorting
  }
}