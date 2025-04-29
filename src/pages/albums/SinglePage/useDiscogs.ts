import { ref, reactive, computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import type DiscogsService from '~/services/DiscogsService'
import usePagination from '~/hooks/usePagination'
import discogsTableSchema from '~/schemas/DiscogsSchema'

const useDiscogs = (discogsService: DiscogsService, entity: Ref<Album> | Ref<EmbeddedItem> | Ref<undefined>) => {
  const discogsFilters = reactive<DiscogsFilter>({
    country: [],
    releaseYear: [],
    releaseFormat: [],
    label: []
  })

  const discogsFiltersState = reactive<Record<keyof DiscogsFilter, null | string>>({
    country: null,
    releaseYear: null,
    releaseFormat: null,
    label: null
  })

  const discogsResults = ref<DiscogsReleaseRow[]>([])

  const {
    pagination: discogsPagination,
    updatePaginationConfig
  } = usePagination({ isRouted: false })

  const discogsPayloadConfig = computed(() => ({
    artist: entity.value?.artist.title || '',
    album: entity.value?.title || ''
  }))

  const isDiscogsReqEnabled = computed(() => !!entity.value)

  const filteredDiscogsData = computed(() => (
    [...(discogsResults.value || [])]
      .filter((row) => {
        return (
          Object.entries(discogsFiltersState)
            .every(([key, value]) => {
              let rowValue = row[key as keyof DiscogsReleaseRow]
              if (!value) return true
              if (!rowValue) rowValue = 'unknown'
              return Array.isArray(rowValue) ? rowValue.includes(value) : rowValue === value
            })
        )
      })
  ))

  const filteredDiscogsPagination = computed(() => ({
    ...discogsPagination,
    totalDocs: filteredDiscogsData.value.length,
    totalPages: Math.ceil(filteredDiscogsData.value.length / discogsPagination.limit),
  }))

  const preparedDiscogsData = computed(() => (
    [...filteredDiscogsData.value]
      .splice(
        (filteredDiscogsPagination.value.page - 1) * filteredDiscogsPagination.value.limit,
        filteredDiscogsPagination.value.limit
      ) as unknown as Record<string, JSONSchema4Type>[]
  ))

  const discogsTableState = computed<TableConfig<Record<string, JSONSchema4Type>, JSONSchema4>>(() => ({
    rows: preparedDiscogsData.value,
    schema: discogsTableSchema,
    pagination: filteredDiscogsPagination.value,
    setPagination: setDiscogsPagination
  }))

  const resetDiscogsFilters = () => {
    for (const key in discogsFiltersState) {
      discogsFiltersState[key as keyof DiscogsFilter] = null
    }
  }

  const setDiscogsFilterValue = (payload: [keyof DiscogsFilter, string]) => {
    discogsPagination.page = 1
    discogsFiltersState[payload[0]] = payload[1]
  }

  const setDiscogsPagination = (payload: Partial<PaginationState>) => {
    Object.entries(payload).forEach(([key, value]) => {
      discogsPagination[key as keyof PaginationState] = value
    })
  }

  const setDiscogsFilters = (data: DiscogsReleaseRow[]) => {
    const uniqueFilterValues = {
      country: new Set<DiscogsFilter['country'][number]>(),
      releaseYear: new Set<DiscogsFilter['releaseYear'][number]>(),
      releaseFormat: new Set<DiscogsFilter['releaseFormat'][number]>(),
      label: new Set<DiscogsFilter['label'][number]>()
    }

    data.forEach((row) => {
      uniqueFilterValues.country.add(row.country || 'unknown')
      uniqueFilterValues.releaseYear.add(row.releaseYear || 'unknown')
      uniqueFilterValues.releaseFormat.add(row.releaseFormat[0] || 'unknown')
      row.label.forEach((label) => uniqueFilterValues.label.add(label || 'unknown'))
    })
    
    Object.entries(uniqueFilterValues).forEach(([key, value]) => {
      const sortedValues = [...value].sort()
      discogsFilters[key as keyof DiscogsFilter] = sortedValues
    })
  }

  const { isFetching: isDiscogsFetching } = useQuery<DiscogsReleaseRow[]>({
    retry: 3,
    enabled: isDiscogsReqEnabled,
    refetchOnWindowFocus: false,
    queryKey: [entity],
    queryFn: () => (
      discogsService.getData({ ...discogsPayloadConfig.value, page: 1 })
        .then((data) => {
          discogsResults.value = data
          setDiscogsFilters(data)
          updatePaginationConfig('totalDocs', data.length)
          updatePaginationConfig('totalPages', Math.ceil(data.length / discogsPagination.limit))
          return data
        })
    )
  })

  return {
    isDiscogsFetching,
    discogsTableState,
    discogsFiltersState,
    setDiscogsFilterValue,
    resetDiscogsFilters,
    discogsFilters
  }
}

export default useDiscogs
