import { computed, reactive, ref } from 'vue'
import type { DiscogsFilter, DiscogsReleaseRow, DiscogsTablePayload } from '~/types/Discogs'
import { DiscogsTableSchema } from '~/types/Discogs'
import type { Pagination } from '~/types/Common'
import discogsServices from '~/services/discogs.services'
import AlbumPage from '~/classes/AlbumPage'
import EmbeddedItem from '~/classes/EmbeddedItem'

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
      .filter((row: DiscogsReleaseRow) => {
        return Object.entries(discogsFiltersStates).every(([key, value]) => {
          // @ts-ignore
          let rowValue = row[key]
          if (!value) return true
          if (!rowValue) rowValue = 'unknown'
          return Array.isArray(rowValue) ? rowValue.includes(value) : rowValue === value
        })
      })
  ))

  const filteredDiscogsPagination = computed(() => ({
    ...discogsPagination.value,
    totalDocs: filteredDiscogsData.value.length,
    totalPages: Math.ceil(filteredDiscogsData.value.length / discogsPagination.value.limit),
  }))

  const preparedDiscogsData = computed(() => (
    [...filteredDiscogsData.value]
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
      uniqueFilterValues.country.add(row.country || 'unknown')
      uniqueFilterValues.releaseYear.add(row.releaseYear || 'unknown')
      uniqueFilterValues.releaseFormat.add(row.releaseFormat[0] || 'unknown')
      row.label.forEach((label) => uniqueFilterValues.label.add(label || 'unknown'))
    })
    
    Object.entries(uniqueFilterValues).forEach(([key, value]) => {
      const sortedValues = [...value].sort()
      discogsFilters[key] = sortedValues
    })
  }

  const fetchDiscogsInfo = async (entity: AlbumPage | EmbeddedItem) => {
    if (!entity.artist) return
    isDiscogsFetched.value = false
    discogsData.value = []
    resetDiscogsFilters()
    setDiscogsPaginationPage(1)

    try {
      const config = {
        artist: entity.artist.title,
        album: entity.title
      }
      const data = await discogsServices.getData({ ...config, page: 1 })
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
