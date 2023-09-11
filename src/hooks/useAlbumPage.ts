import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlbumItem, AlbumPage } from '~/types/Album'
import { ListPageResponse, RequestConfig } from '~/types/Global'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'

export const useAlbumPage = <T extends object>() => {
  const route = useRoute()
  const router = useRouter()
  const entity = reactive<T>({} as T)
  const booklet = reactive<string[]>([])
  const isDataFetched = ref(false)
  const isBookletOpened = ref(false)
  const isBookletAbsent = ref(false)

  const fetchData = (entityType: string) => {
    DBApiService.getEntity<AlbumPage>(entityType, String(route.params.id))
      .then((data) => {
        Object.assign(entity, data)
        isDataFetched.value = true
      })
      .catch(console.error)
  }

  const fetchBooklet = (path: string) => {
    if (booklet.length > 0) {
      return isBookletOpened.value = true
    }

    if (isBookletAbsent.value) {
      return console.log('Booklet is absent')
    }

    CloudApiService.getFolder(path)

    // DBApiService.getEntity<string[]>(
    //   entityType,
    //   `${String(route.params.id)}/${path}`
    // )
    //   .then((data) => {
    //     console.log(data)
    //   })
    //   .catch(console.error)
  }

  const requestConfig = reactive<RequestConfig>({
    page: 1,
    limit: 1,
    isRandom: true,
    sort: { title: 1 }
  })

  const getRandomAlbum = (entityType: string) => {
    isDataFetched.value = false
    DBApiService.getEntityList<ListPageResponse<AlbumItem>>(requestConfig, entityType)
      .then(({ docs }) => {
        Object.assign(entity, docs[0])
        console.log(route)
        router.push({ params: { id: docs[0]._id } })
        isDataFetched.value = true
      })
      .catch(console.error)
  }

  return {
    fetchData,
    entity,
    isDataFetched,
    fetchBooklet,
    getRandomAlbum,
    booklet
  }
}
