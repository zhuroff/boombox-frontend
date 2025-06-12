import { reactive, computed, watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type DiscogsService from '../api/DiscogsService'
import type { DiscogsQueryConfig, DiscogsReleaseRow } from '../lib/types'
import type { TableFilters } from '~shared/lib'

const useDiscogs = (discogsService: DiscogsService, payload: Ref<DiscogsQueryConfig | DiscogsQueryConfig[]>) => {
  const discogsFiltersState = reactive<Record<keyof TableFilters, null | string | number | undefined>>({
    country: null,
    releaseYear: null,
    releaseFormat: null,
    label: null
  })

  const discogsFilters = reactive<TableFilters>({
    country: [],
    releaseYear: [],
    releaseFormat: [],
    label: []
  })

  const setDiscogsFilterValue = (payload: [keyof TableFilters, string | number | null | undefined]) => {
    discogsFiltersState[payload[0]] = payload[1]
  }

  const resetDiscogsFilters = () => {
    for (const key in discogsFiltersState) {
      discogsFiltersState[key] = null
    }
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
      discogsFilters[key] = sortedValues
    })
  }

  const { data: discogsData, isFetched: isDiscogsFetched } = useQuery<DiscogsReleaseRow[]>({
    retry: 1,
    enabled: !!payload,
    refetchOnWindowFocus: false,
    queryKey: [payload],
    queryFn: async () => {
      if (Array.isArray(payload.value)) {
        const results = await Promise.all(
          payload.value.map((config) => 
            discogsService.getData(config)
          )
        )
        
        return results.flat()
      }
      
      return await discogsService.getData(payload.value)
    }
  })

  const filteredDiscogsData = computed(() => (
    [...(discogsData.value || [])]
      .filter((row) => {
        return (
          Object.entries(discogsFiltersState)
            .every(([key, value]) => {
              let rowValue = row[key as keyof DiscogsReleaseRow]
              if (!value) return true
              if (!rowValue) rowValue = 'unknown'
              return (
                Array.isArray(rowValue)
                  ? rowValue.includes(String(value))
                  : rowValue === value
              )
            })
        )
      })
  ))

  watch(
    discogsData,
    (newData) => {
      if (newData) {
        setDiscogsFilters(newData)
      }
    }
  )

  return {
    setDiscogsFilterValue,
    resetDiscogsFilters,
    discogsFiltersState,
    filteredDiscogsData,
    isDiscogsFetched,
    discogsFilters
  }
}

export default useDiscogs
