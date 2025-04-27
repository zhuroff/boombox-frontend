import { watch } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type DatabaseService from '~/services/DatabaseService'

const useSearch = (
  query: Ref<string>,
  dbService: DatabaseService,
  entityKey?: string
) => {
  const { refetch, isFetched, isFetching, data, error } = useQuery<SearchResultState[]>({
    queryKey: [query, entityKey],
    refetchOnWindowFocus: false,
    queryFn: () => dbService.search({ query: query.value, key: entityKey }),
    enabled: false,
    retry: 3
  })

  watch(query, (newVal) => {
    const searchQuery = newVal?.trim()

    if (searchQuery && searchQuery.length > 2) {
      refetch()
    }
  })

  return {
    searchRefetch: refetch,
    isSearchFetched: isFetched,
    isSearchFetching: isFetching,
    searchError: error,
    searchResults: data
  }
}

export default useSearch
