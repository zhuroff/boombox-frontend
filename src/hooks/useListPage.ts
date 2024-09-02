import { computed, onMounted, ref } from 'vue'
import type { ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Pagination, RequestConfig, ResponseMessage, SortingValue } from '~/types/Common'
import type { ListPageResponse } from '~/types/ReqRes'
import useGlobalStore from '~/store/global'
import useSnackbar from './useSnackbar'
import dbServices from '~/services/database.services'

export const useListPage = <T, C>(
  Class: new (card: T, type: string, path: string) => C,
  cardType: string,
  cardPath: string
) => {
  const {
    globalGetters: { localize }
  } = useGlobalStore()

  const { setSnackbarMessage } = useSnackbar()

  const { name, query, params } = useRoute()
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
      
      if (pagination) {
        pagePagination.value = Object.assign(pagePagination.value, pagination)
      }

      return docs.map((doc) => new Class(doc, cardType, cardPath))
    } catch (error) {
      console.error(error)
    } finally {
      isDataFetched.value = true
    }
  }

  const deleteEntity = async (entityType: string, entityID: string) => {
    try {
      const response = await dbServices.deleteEntity<ResponseMessage>(entityType, entityID)
      if (response) {
        setSnackbarMessage({
          message: localize(String(response.message)),
          type: 'success'
        })
        pagePagination.value.page = 1
      }
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    const { page } = query

    if (!page && !params.id) {
      changeRouteQuery({ page: pagePagination.value.page })
    }
  })

  return {
    fetchData,
    isDataFetched,
    pagePagination,
    switchPagination,
    setEntitiesLimit,
    pageStateConfig,
    deleteEntity
  }
}
