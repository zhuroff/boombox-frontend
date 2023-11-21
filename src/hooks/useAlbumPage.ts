import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { AlbumItem, AlbumPage } from '~/types/Album'
import { BasicEntity, CardBasic, ListPageResponse, RequestConfig, RequestFilter } from '~/types/Global'
import { AlbumCardBoxDTO } from '~/dto/AlbumCardBoxDTO'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'

export const useAlbumPage = <T extends BasicEntity>() => {
  const route = useRoute()
  const router = useRouter()
  const store = useStore(key)
  const entity = reactive<T>({} as T)
  const relatedEntities = reactive<Map<string, CardBasic[]>>(new Map())
  const booklet = ref<string[]>([])
  const isDataFetched = ref(false)
  const isBookletOpened = ref(false)

  const fetchData = async (entityType: string, id = String(route.params.id)) => {
    isDataFetched.value = false
    booklet.value.length = 0

    try {
      const data = await DBApiService.getEntity<AlbumPage>(entityType, id)
      const preparedData = {
        ...data,
        tracks: data.tracks.map((track, index) => (
          new AlbumTrackDTO(track, index + 1, data.albumCover, data.period)
        ))
      }
      Object.assign(entity, preparedData)
      isDataFetched.value = true
      store.commit("setPlayerPlaylist", preparedData)

      if (id === 'random') {
        router.push({ params: { id: data._id } })
      }

      return {
        artist: preparedData.artist.title,
        album: preparedData.title
      }
    } catch (error) {
      console.error(error)
      isDataFetched.value = true
      return null
    }
  }

  const fetchBooklet = async (folder: string) => {
    if (booklet.value.length > 0) {
      isBookletOpened.value = true
    }

    try {
      const bookletImages = await CloudApiService.getImages(`${folder}/booklet`)
      booklet.value = bookletImages
      console.log(bookletImages)
    } catch (error) {
      console.error(error)
    }
  }

  const requestConfig = reactive<RequestConfig>({
    page: 1,
    limit: 5,    
    sort: { title: 1 }
  })

  const getRandomAlbum = (entityType: string) => {
    return fetchData(entityType, 'random')
  }

  const getRelatedAlbums = async (filter: RequestFilter, entityType: string) => {
    const response = {
      [filter.from]: await DBApiService.getEntityList<ListPageResponse<AlbumItem>>(
        { ...requestConfig, filter, isRandom: true, },
        entityType
      )
    }
    Object.entries(response).forEach(([key, { docs }]) => {
      relatedEntities.set(key, docs.map((entity) => new AlbumCardBoxDTO(entity)))
    })
  }

  return {
    fetchData,
    entity,
    isDataFetched,
    fetchBooklet,
    getRandomAlbum,
    getRelatedAlbums,
    relatedEntities,
    booklet,
    route
  }
}
