import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLocales } from './useLocales'
import { UploadImageResult } from '~/types/Common'
import { CategoryPage } from '~/types/Category'
import { AlbumItem } from '~/types/Album'
import DBApiService from '~/services/DBApiService'

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

  const sortAlbumsByYears = (data: AlbumItem[]) => {
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
      const category = await DBApiService.getEntity<CategoryPage>(entityType, String(route.params.id))
      data.value = {
        ...category,
        albums: sortAlbumsByYears(category.albums.map((album) => ({
          ...album,
          caption: `${album.artist.title} / ${album.period.title} / ${album.genre.title}`
        })))
      }
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
    totalCounts
  }
}
