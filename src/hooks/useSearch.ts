import { ref } from 'vue'
import type { SearchResultState } from '~/types/Search'
import dbServices from '~/services/database.services'

export const useSearch = () => {
  const results = ref<SearchResultState[]>([])

  const searchSubmit = async (query: string, key?: string) => {
    if (query.length === 0) {
      results.value = []
    }

    if (query.length > 2) {
      const data = await dbServices.search({ query, key })
      results.value = data
    }
  }

  return {
    results,
    searchSubmit
  }
}
