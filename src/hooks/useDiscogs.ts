import { computed, reactive, ref } from 'vue'
import { DiscogsFilter, DiscogsQueryConfig, DiscogsReleaseRow, DiscogsTablePayload, DiscogsTableSchema } from '~/types/Discogs'
import { Pagination } from '~/types/Global'
import DiscogsServices from '~/services/DiscogsServices'

export const useDiscogs = () => {
  const isDiscogsFetched = ref(false)
  const discogsData = ref<DiscogsReleaseRow[]>([])
  const discogsPagination = ref<Pagination>({ page: 1, limit: 15 } as Pagination)
  const discogsFilters = reactive<DiscogsFilter>({
    country: [],
    releaseYear: [],
    releaseFormat: [],
    label: []
  })

  const discogsFiltersStates = reactive<Record<keyof DiscogsFilter, null | string>>({
    country: null,
    releaseYear: null,
    releaseFormat: null,
    label: null
  })

  const filteredDiscogsData = computed(() => (
    [...discogsData.value]
      .filter((row: DiscogsReleaseRow) => (
        Object.entries(discogsFiltersStates).every(([key, value]) => (
          // @ts-ignore
          !value ? true : Array.isArray(row[key]) ? row[key].includes(value) : row[key] === value
        ))
      ))
  ))

  const filteredDiscogsPagination = computed(() => ({
    ...discogsPagination.value,
    totalDocs: filteredDiscogsData.value.length,
    totalPages: Math.ceil(filteredDiscogsData.value.length / discogsPagination.value.limit),
  }))

  const preparedDiscogsData = computed(() => (
    filteredDiscogsData.value
      .splice(
        (filteredDiscogsPagination.value.page - 1) * filteredDiscogsPagination.value.limit,
        filteredDiscogsPagination.value.limit
      )
  ))

  const discogsTablePayload = computed<DiscogsTablePayload>(() => ({
    rows: preparedDiscogsData.value,
    pagination: filteredDiscogsPagination.value,
    isFetched: isDiscogsFetched,
    schema: new DiscogsTableSchema(),
    set: setDiscogsPagination
  }))

  const resetDiscogsFilters = () => {
    for (const item in discogsFiltersStates) {
      discogsFiltersStates[item] = null
    }
  }

  const setDiscogsFilterValue = (payload: [keyof DiscogsFilter, string]) => {
    setDiscogsPaginationPage(1)
    discogsFiltersStates[payload[0]] = payload[1]
  }

  const setDiscogsPagination = (payload: Partial<Pagination>) => {
    discogsPagination.value = Object.assign(discogsPagination.value, payload)
  }

  const setDiscogsPaginationPage = (page: number) => {
    discogsPagination.value.page = page
  }

  const setDiscogsFilters = (data: DiscogsReleaseRow[]) => {
    const uniqueFilterValues = {
      country: new Set<string>(),
      releaseYear: new Set<string>(),
      releaseFormat: new Set<string>(),
      label: new Set<string>()
    }

    data.forEach((row) => {
      uniqueFilterValues.country.add(row.country)
      uniqueFilterValues.releaseYear.add(row.releaseYear)
      uniqueFilterValues.releaseFormat.add(row.releaseFormat[0])
      row.label.forEach((label) => uniqueFilterValues.label.add(label))
    })
    
    Object.entries(uniqueFilterValues).forEach(([key, value]) => {
      const sortedValues = [...value].sort()
      discogsFilters[key] = sortedValues
    })
  }

  const fetchDiscogsInfo = async (config: Omit<DiscogsQueryConfig, 'page'>) => {
    isDiscogsFetched.value = false
    discogsData.value = []
    resetDiscogsFilters()
    setDiscogsPaginationPage(1)

    try {
      const data = await DiscogsServices.discogs({ ...config, page: 1 })
      discogsData.value = data
      setDiscogsFilters(data)
      isDiscogsFetched.value = true
      setDiscogsPagination({
        totalDocs: data.length,
        totalPages: Math.ceil(data.length / discogsPagination.value.limit)
      })
    } catch (error) {
      console.error(error)
      isDiscogsFetched.value = true
    }
  }

  return {
    fetchDiscogsInfo,
    discogsTablePayload,
    discogsFiltersStates,
    setDiscogsFilterValue,
    setDiscogsPaginationPage,
    resetDiscogsFilters,
    discogsFilters
  }
}
