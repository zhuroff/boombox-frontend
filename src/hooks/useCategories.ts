import api from '~/api'
import { reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { UploadImageResult } from '~/types/Global'
import { CategoryPage } from '~/types/Category'

const useCategory = (apiQuery: string) => {
  const route = useRoute()

  const category = reactive({
    isFetched: false,
    data: {} as CategoryPage
  })

  const categoryDescription = computed(() => (
    `Albums: ${category.data.albums?.length}`
  ))

  const setUploadedImage = (payload: UploadImageResult) => {
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
      albums: sortAlbumsByYears([...data.albums, ...data.framesAlbums])
    }

    // delete category.data.framesAlbums

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

  return {
    category,
    categoryDescription,
    setUploadedImage
  }
}

export { useCategory }
