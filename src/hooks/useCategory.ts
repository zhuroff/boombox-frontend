import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocales } from './useLocales'
import { UploadImageResult } from '~/types/Common'
import { CategoryPageRes } from '~/types/ReqRes'
import AlbumItem from '~/classes/AlbumItem'
import EmbeddedItem from '~/classes/EmbeddedItem'
import CategoryPage from '~/classes/CategoryPage'
import dbServices from '~/services/database.services'

export const useCategory = (entityType: string) => {
  const { lang } = useLocales()
  const route = useRoute()
  const data = ref<CategoryPage>()
  const isDataFetched = ref(false)

  const setUploadedImage = (payload: UploadImageResult) => {
    if (data.value) {
      data.value[payload.key] = payload.url
    }
  }
  
  const totalCounts = computed(() => (
    lang('totalAlbums') + `: ${data.value?.albums?.length || 0}`
  ))

  const sortAlbumsByYears = (data: Array<AlbumItem | EmbeddedItem>) => {
    const sorted = data.sort((a, b) => {
      const aYear = Number(a.period.title)
      const bYear = Number(b.period.title)

      if (aYear < bYear) return -1
      if (aYear > bYear) return 1
      return 0
    })

    return sorted
  }

  const fetchCategoryEntry = async () => {
    try {
      const category = await dbServices.getEntity<CategoryPageRes>(entityType, String(route.params.id))
      data.value = new CategoryPage(category)
      isDataFetched.value = true
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => fetchCategoryEntry())

  return {
    data,
    isDataFetched,
    setUploadedImage,
    sortAlbumsByYears,
    totalCounts
  }
}
