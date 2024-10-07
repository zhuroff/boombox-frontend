import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const usePagination = () => {
  const { name, query } = useRoute()

  const pagination = reactive<PaginationState>({
    page: Number(query.page) || 1,
    limit: Number(localStorage.getItem(`entitiesLimit:${name?.toString()}`)) || 15,
    sort: { title: 1 }
  })

  const setPaginationPage = (page: number) => {
    pagination.page = page
  }

  const setPaginationLimit = (limit: number) => {
    pagination.limit = limit
    localStorage.setItem(`entitiesLimit:${name?.toString()}`, limit.toString())
  }

  return {
    pagination,
    setPaginationPage,
    setPaginationLimit
  }
}

export default usePagination
