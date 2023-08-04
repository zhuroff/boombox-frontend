import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AlbumPage } from '~/types/Album'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'

export const useAlbumPage = <T extends object>() => {
  const route = useRoute()
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

  return {
    fetchData,
    entity,
    isDataFetched,
    fetchBooklet,
    booklet
  }
}
