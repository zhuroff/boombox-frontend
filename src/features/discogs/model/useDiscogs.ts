import { ref, reactive, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { JSONSchema4, JSONSchema4Type } from 'json-schema'
import type DiscogsService from '~/features/discogs/api/DiscogsService'
import { usePaginator, type PaginationState } from '~widgets/paginator'
import type { MinimumAlbumInfo } from '~shared/model'
import type { DiscogsReleaseRow, DiscogsQueryConfig } from './types'
import { discogsTableSchema } from '~features/discogs'

const useDiscogs = (discogsService: DiscogsService, entity: MinimumAlbumInfo | MinimumAlbumInfo[]) => {
  const discogsFilters = reactive<TableFilters>({
    country: [],
    releaseYear: [],
    releaseFormat: [],
    label: []
  })

  const discogsFiltersState = reactive<Record<keyof TableFilters, null | string | number>>({
    country: null,
    releaseYear: null,
    releaseFormat: null,
    label: null
  })

  const discogsResults = ref<DiscogsReleaseRow[]>([])

  const {
    paginationState: discogsPagination,
    paginationConfig,
    updatePaginationConfig,
    updatePaginationState
  } = usePaginator({ isRouted: false })

  const discogsPayloadConfig = computed<DiscogsQueryConfig | DiscogsQueryConfig[]>(() => {
    if (Array.isArray(entity)) {
      return entity.map(item => ({
        artist: item.albumArtist,
        album: item.albumTitle,
        page: 1
      }))
    }
    return {
      artist: entity.albumArtist,
      album: entity.albumTitle,
      page: 1
    }
  })

  const isDiscogsReqEnabled = computed(() => !!entity)

  const filteredDiscogsData = computed(() => (
    [...(discogsResults.value || [])]
      .filter((row) => {
        return (
          Object.entries(discogsFiltersState)
            .every(([key, value]) => {
              let rowValue = row[key as keyof DiscogsReleaseRow]
              if (!value) return true
              if (!rowValue) rowValue = 'unknown'
              return Array.isArray(rowValue) ? rowValue.includes(String(value)) : rowValue === value
            })
        )
      })
  ))

  const filteredDiscogsPagination = computed(() => ({
    ...discogsPagination,
    totalDocs: filteredDiscogsData.value.length,
    totalPages: Math.floor(filteredDiscogsData.value.length / discogsPagination.limit),
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
      discogsFiltersState[key as keyof TableFilters] = null
    }
  }

  const setDiscogsFilterValue = (payload: [keyof TableFilters, string | number | null]) => {
    discogsPagination.page = 1
    discogsFiltersState[payload[0]] = payload[1]
  }

  const setDiscogsPagination = (payload: Partial<PaginationState>) => {
    Object.entries(payload).forEach(([key, value]) => {
      if (key in discogsPagination) {
        (discogsPagination[key as keyof PaginationState] as any) = value
      }
    })
  }

  const setDiscogsFilters = (data: DiscogsReleaseRow[]) => {
    const uniqueFilterValues = {
      country: new Set<TableFilters['country'][number]>(),
      releaseYear: new Set<TableFilters['releaseYear'][number]>(),
      releaseFormat: new Set<TableFilters['releaseFormat'][number]>(),
      label: new Set<TableFilters['label'][number]>()
    }

    data.forEach((row) => {
      uniqueFilterValues.country.add(row.country || 'unknown')
      uniqueFilterValues.releaseYear.add(row.releaseYear || 'unknown')
      uniqueFilterValues.releaseFormat.add(row.releaseFormat[0] || 'unknown')
      row.label.forEach((label) => uniqueFilterValues.label.add(label || 'unknown'))
    })
    
    Object.entries(uniqueFilterValues).forEach(([key, value]) => {
      const sortedValues = [...value].sort()
      discogsFilters[key as keyof TableFilters] = sortedValues
    })
  }

  const { isFetching: isDiscogsFetching } = useQuery<DiscogsReleaseRow[]>({
    retry: 1,
    enabled: isDiscogsReqEnabled,
    refetchOnWindowFocus: false,
    queryKey: [entity],
    queryFn: async () => {
      if (Array.isArray(entity)) {
        const configs = discogsPayloadConfig.value as DiscogsQueryConfig[]
        const results = await Promise.all(
          configs.map((config) => 
            discogsService.getData({ ...config, page: 1, isMasterOnly: true })
          )
        )
        
        const combinedResults = results.flat()
        discogsResults.value = combinedResults
        setDiscogsFilters(combinedResults)
        updatePaginationConfig('totalDocs', combinedResults.length)
        updatePaginationConfig('totalPages', Math.floor(combinedResults.length / discogsPagination.limit))
        return combinedResults
      } else {
        const config = discogsPayloadConfig.value as DiscogsQueryConfig
        const data = await discogsService.getData({ ...config, page: 1 })
        discogsResults.value = data
        setDiscogsFilters(data)
        updatePaginationConfig('totalDocs', data.length)
        updatePaginationConfig('totalPages', Math.floor(data.length / discogsPagination.limit))
        return data
      }
    }
  })

  return {
    isDiscogsFetching,
    discogsTableState,
    discogsPagination,
    paginationConfig,
    discogsFiltersState,
    updatePaginationState,
    setDiscogsFilterValue,
    resetDiscogsFilters,
    discogsFilters
  }
}

export default useDiscogs
