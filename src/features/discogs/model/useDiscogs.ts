import { reactive, computed, watch, ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import type DiscogsService from '../api/DiscogsService'
import type { DiscogsSearchQueryConfig, DiscogsTableRow, DiscogsCollectionRow, DiscogsCollectionQueryConfig } from '../lib/types'
import type { TableFilters } from '~shared/lib'

const useDiscogs = (discogsService: DiscogsService) => {
  const discogsCollection = ref<DiscogsCollectionRow[]>([])
  const discogsSearchResults = ref<DiscogsTableRow[]>([])

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

  const setDiscogsFilters = (data: DiscogsTableRow[]) => {
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

  const { mutateAsync: getDiscogsCollection, isPending: isDiscogsCollectionLoading } = useMutation({
    mutationFn: async (config: DiscogsCollectionQueryConfig) => {
      return await discogsService.getCollection(config)
    },
    onSuccess: (data) => {
      discogsCollection.value = data
    }
  })

  const { mutateAsync: searchDiscogsData, isPending: isDiscogsSearching } = useMutation({
    mutationFn: async (config: DiscogsSearchQueryConfig | DiscogsSearchQueryConfig[]) => {
      if (Array.isArray(config)) {
        const results = await Promise.all(
          config.map((configItem) => 
            discogsService.searchDiscogsData(configItem)
          )
        )

        return results.flat()
      }

      return await discogsService.searchDiscogsData(config)
    },
    onSuccess: (data) => {
      discogsSearchResults.value = data
    }
  })

  const filteredDiscogsData = computed(() => {
    return [...(discogsSearchResults.value || [])]
      .filter((row) => {
        return (
          Object.entries(discogsFiltersState)
            .every(([key, value]) => {
              let rowValue = row[key as keyof DiscogsTableRow]
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
  })

  watch(
    discogsSearchResults,
    (newData) => {
      if (newData) {
        setDiscogsFilters(newData)
      }
    }
  )

  return {
    discogsCollection,
    searchDiscogsData,
    getDiscogsCollection,
    setDiscogsFilterValue,
    isDiscogsCollectionLoading,
    resetDiscogsFilters,
    discogsFiltersState,
    filteredDiscogsData,
    isDiscogsSearching,
    discogsFilters
  }
}

export default useDiscogs
