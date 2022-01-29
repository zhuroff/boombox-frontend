import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ICategoryFull } from '~/types/Category'
import api from '~/api'

const useCategories = (apiQuery: string) => {
  const router = useRouter()
  const route = useRoute()

  const pageConfig = reactive({
    current: route.query.p || 1,
    limit: 40,
    sorting: { title: 1 }
  })

  const categories = reactive({
    isFetched: false,
    pagination: {},
    items: []
  })

  const changeRoutePage = (value: number) => {
    router.push({ query: { p: value } })
  }

  const setFetchedData = (data: any) => {
    categories.pagination = data?.pagination || {}
    categories.items = data?.docs || []
    categories.isFetched = true
  }

  const clearfyCategoryList = () => {
    categories.isFetched = false
    categories.items = []
  }

  const switchPagination = (value: number) => {
    pageConfig.current = value

    clearfyCategoryList()
    changeRoutePage(value)
    fetchCategoryList()
  }
  
  const fetchCategoryList = async () => {
    try {
      const response = await api.post(apiQuery, pageConfig)
      setFetchedData(response.data)
    } catch (error) {
      throw error
    }
  }

  if (!route.query.p) {
    changeRoutePage(pageConfig.current as any)
  }

  onMounted(() => fetchCategoryList())

  return {
    categories,
    switchPagination
  }
}

const useCategory = (apiQuery: string) => {
  const route = useRoute()

  const category: { isFetched: boolean, data: ICategoryFull } = reactive({
    isFetched: false,
    data: {} as unknown as ICategoryFull
  })

  const sortAlbumsByYears = (data: any) => {
    const sorted = data.sort((a: any, b: any) => {
      const aYear = a.period.title
      const bYear = b.period.title

      if (aYear < bYear) return -1
      if (aYear > bYear) return 1
      return 0
    })

    return sorted
  }

  const setCategory = (data: any) => {
    category.data = {
      ...data,
      albums: sortAlbumsByYears([...data.albums, ...data.frames])
    }

    delete category.data.frames

    category.isFetched = true
  }
  
  const fetchCategoryEntry = async () => {
    try {
      const response = await api.get(`${apiQuery}/${route.params.id}`)
      setCategory(response.data)
    } catch (error) {
      throw error
    }
  }
  
  onMounted(() => fetchCategoryEntry())

  return { category }
}

export { useCategories, useCategory }
