import api from '~/api'
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { TPagination, UploadImageResult } from '~/types/Global'
import { CategoryItem, CategoryPage } from '~/types/Category'

const useCategories = (apiQuery: string) => {
  const router = useRouter()
  const route = useRoute()

  const pageConfig = reactive({
    page: Number(route.query.p) || 1,
    sort: { title: 1 },
    limit: 40
  })

  const categories = reactive({
    isFetched: false,
    data: [] as CategoryItem[],
    pagination: {} as TPagination
  })

  const changeRoutePage = (value: number) => {
    router.push({ query: { p: value } })
  }

  const clearfyCategoryList = () => {
    categories.isFetched = false
    categories.data = []
  }

  const switchPagination = (value: number) => {
    pageConfig.page = value

    clearfyCategoryList()
    changeRoutePage(value)
    fetchCategoryList()
  }

  const setFetchedData = (data: { docs: CategoryItem[], pagination: TPagination }) => {
    categories.isFetched = true

    if (data) {
      categories.pagination = data.pagination
      categories.data = data.docs
    }
  }
  
  const fetchCategoryList = async () => {
    try {
      const response = await api.post(apiQuery, pageConfig)

      if (response?.status === 200) {
        setFetchedData(response?.data)
      }
    } catch (error) {
      throw error
    }
  }

  if (!route.query.p) {
    changeRoutePage(pageConfig.page)
  }

  onMounted(() => fetchCategoryList())

  return {
    categories,
    switchPagination
  }
}

const useCategory = (apiQuery: string) => {
  const route = useRoute()

  const category = reactive({
    isFetched: false,
    data: {} as CategoryPage
  })

  const setCategoryImage = (payload: UploadImageResult) => {
    category.data[payload.key] = payload.url
  }

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

  return { category, setCategoryImage }
}

export { useCategories, useCategory }
