import { watch, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { SearchResultState, SearchService } from '~features/search'

const useSearch = (
  query: Ref<string>,
  searchService: SearchService,
  entityKey?: Ref<string>
) => {
  const { refetch, isFetched, isFetching, data, error } = useQuery<SearchResultState[]>({
    queryKey: [query, entityKey],
    refetchOnWindowFocus: false,
    queryFn: () => searchService.search({ query: query.value, key: entityKey?.value }),
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
