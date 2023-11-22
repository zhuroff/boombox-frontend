import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { CloudFolderResponse } from '~/types/Cloud'
import { AlbumBooklet, AlbumItem, AlbumPage } from '~/types/Album'
import { BasicEntity, CardBasic, ListPageResponse, RequestConfig, RequestFilter } from '~/types/Global'
import { AlbumCardBoxDTO } from '~/dto/AlbumCardBoxDTO'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import { BookletStateDTO } from '~/dto/BookletStateDTO'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'

export const useAlbumPage = <T extends BasicEntity>() => {
  const route = useRoute()
  const router = useRouter()
  const store = useStore(key)
  const entity = reactive<T>({} as T)
  const relatedEntities = reactive<Map<string, CardBasic[]>>(new Map())
  const booklet = ref<BookletStateDTO>(new BookletStateDTO())
  const isDataFetched = ref(false)

  const fetchData = async (entityType: string, id = String(route.params.id)) => {
    isDataFetched.value = false
    booklet.value = new BookletStateDTO()

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
      store.commit('setPlayerPlaylist', preparedData)

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
    if (booklet.value.items.length === 0) {
      booklet.value.isActive = true
    }

    try {
      const bookletContent = await CloudApiService.getImages<CloudFolderResponse<AlbumBooklet>>(
        `${folder}/booklet`, booklet.value.limit, booklet.value.offset
      )
      if (bookletContent) {
        booklet.value = new BookletStateDTO(bookletContent)
      }
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
