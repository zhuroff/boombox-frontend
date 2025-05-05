import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import dbServices from '~/services/database.services'

export const useSearch = (query: Ref<string>, entityKey?: string) => {
  const { refetch, isFetched, data, error } = useQuery<SearchResultState[]>({
    queryKey: [query, entityKey],
    queryFn: () => dbServices.search({ query: query.value, key: entityKey }),
    enabled: !!query.value
  })

  return {
    searchRefetch: refetch,
    isSearchFetched: isFetched,
    searchError: error,
    searchResults: data
  }
}
