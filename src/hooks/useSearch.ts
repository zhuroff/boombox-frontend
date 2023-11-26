import { ref } from 'vue'
import { SearchResultState } from '~/types/Search'
import DBApiService from '~/services/DBApiService'

export const useSearch = () => {
  const results = ref<SearchResultState[]>([])

  const searchSubmit = async (query: string, key?: string) => {
    if (query.length === 0) {
      results.value = []
    }

    if (query.length > 2) {
      const data = await DBApiService.search({ query, key })
      results.value = data
    }
  }

  return {
    results,
    searchSubmit
  }
}
