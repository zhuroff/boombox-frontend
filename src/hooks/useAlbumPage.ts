import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { AlbumItem, AlbumPage } from '~/types/Album'
import { DiscogsTablePayload, DiscogsReleaseRow, DiscogsTableSchema, DiscogsQueryConfig } from '~/types/Discogs'
import { BasicEntity, CardBasic, ListPageResponse, Pagination, RequestConfig, RequestFilter } from '~/types/Global'
import { AlbumCardBoxDTO } from '~/dto/AlbumCardBoxDTO'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'
import DiscogsServices from '~/services/DiscogsServices'

export const useAlbumPage = <T extends BasicEntity>() => {
  const route = useRoute()
  const router = useRouter()
  const store = useStore(key)
  const entity = reactive<T>({} as T)
  const discogsData = ref<DiscogsReleaseRow[]>([])
  const discogsPagination = ref<Pagination>({ page: 1, limit: 30 } as Pagination)
  const relatedEntities = reactive<Map<string, CardBasic[]>>(new Map())
  const booklet = reactive<string[]>([])
  const isDataFetched = ref(false)
  const isBookletOpened = ref(false)
  const isBookletAbsent = ref(false)
  const isDiscogsFetched = ref(false)

  /**
   * Aggregate filters by:
   * - country
   * - releaseYear
   * - releaseFormat
   * - label
   * - exclude unofficial
   * - Do not forget to change discogsPagination
   */
  const preparedDiscogsData = computed(() => (
    [...discogsData.value]
      .splice((discogsPagination.value.page - 1) * discogsPagination.value.limit, discogsPagination.value.limit)
  ))

  const discogsTablePayload = computed<DiscogsTablePayload>(() => ({
    rows: preparedDiscogsData.value,
    pagination: discogsPagination.value,
    isFetched: isDiscogsFetched,
    schema: new DiscogsTableSchema(),
    set: setDiscogsPagination
  }))

  const fetchData = async (entityType: string, id = String(route.params.id)) => {
    isDataFetched.value = false
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
    limit: 5,    
    sort: { title: 1 }
  })

  const getRandomAlbum = (entityType: string) => {
    fetchData(entityType, 'random')
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

  const setDiscogsPagination = (payload: Partial<Pagination>) => {
    discogsPagination.value = Object.assign(discogsPagination.value, payload)
  }

  const fetchDiscogsInfo = async (config: Omit<DiscogsQueryConfig, 'page'>) => {
    isDiscogsFetched.value = false
    discogsData.value = []

    try {
      const data = await DiscogsServices.discogs({ ...config, page: 1 })
      discogsData.value = data
      isDiscogsFetched.value = true
      setDiscogsPagination({
        totalDocs: data.length,
        totalPages: Math.ceil(data.length / discogsPagination.value.limit)
      })
    } catch (error) {
      console.error(error)
      isDiscogsFetched.value = true
    }
  };

  return {
    fetchData,
    entity,
    isDataFetched,
    fetchBooklet,
    getRandomAlbum,
    getRelatedAlbums,
    relatedEntities,
    fetchDiscogsInfo,
    discogsTablePayload,
    setDiscogsPagination,
    booklet,
    route
  }
}
