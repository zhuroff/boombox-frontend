import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '~/api'

class Category {
  constructor(data = []) {
    // Object.keys(data).forEach((key) => {
    //   this[key] = data[key]
    // })
  }

  updateCategoryImages(data: any) {
    console.log(data)
    // this.poster = data.poster
    // this.avatar = data.avatar
  }

  fillCategory(data: any) {
    console.log(data)
  //   this.title = data.title
  //   this.listened = data.listened
  //   this.albums = sortAlbumsByYears([...data.albums, ...data.framesAlbums])
  //   this.updateCategoryImages(data)
  }
}

const useCategories = (apiQuery: string) => {
  const router = useRouter()
  const route = useRoute()

  const pageConfig = reactive({
    current: route.query.p || 1,
    limit: 20,
    sorting: { title: 1 }
  })

  const categoryData = reactive({
    isFetched: false,
    pagination: {},
    items: []
  })

  const changeRoutePage = (value: number) => {
    router.push({ query: { p: value } })
  }

  const setFetchedData = (data: any) => {
    console.log(data)
    categoryData.pagination = data?.pagination || {}
    categoryData.items = data?.docs || []
    categoryData.isFetched = true
  }

  const clearfyCategoryList = () => {
    categoryData.isFetched = false
    categoryData.items = []
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

  fetchCategoryList()

  return {
    categoryData,
    switchPagination
  }
}

const useCategory = (apiQuery: string) => {
  const route = useRoute()

  const category = reactive(new Category())
  
  const fetchCategoryEntry = () => {
    api.get(`${apiQuery}/${route.params.id}`)
      .then((response) => category.fillCategory(response.data))
      .catch((error) => console.error(error.response))
  }
  
  fetchCategoryEntry()

  return { category }
}

export { useCategories, useCategory }
