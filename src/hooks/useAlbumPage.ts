import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { AlbumItem, AlbumPage } from '~/types/Album'
import { DiscogsPayload, DiscogsReleaseRow, DiscogsTableSchema } from '~/types/Discogs'
import { CardBasic, ListPageResponse, Pagination, RequestConfig, RequestFilter } from '~/types/Global'
import { AlbumCardBoxDTO } from '~/dto/AlbumCardBoxDTO'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'
import DiscogsServices from '~/services/DiscogsServices'

export const useAlbumPage = <T extends object>() => {
  const route = useRoute()
  const router = useRouter()
  const store = useStore(key)
  const entity = reactive<T>({} as T)
  const discogsData = reactive<DiscogsReleaseRow[]>([])
  const discogsPagination = reactive<Pagination>({} as Pagination)
  const relatedEntities = reactive<Map<string, CardBasic[]>>(new Map())
  const booklet = reactive<string[]>([])
  const isDataFetched = ref(false)
  const isBookletOpened = ref(false)
  const isBookletAbsent = ref(false)
  const isDiscogsFetched = ref(false)

  const discogsPayload = computed<DiscogsPayload>(() => ({
    rows: discogsData,
    pagination: discogsPagination,
    isFetched: isDiscogsFetched,
    schema: new DiscogsTableSchema()
  }))

  const fetchData = (entityType: string, id = String(route.params.id)) => {
    isDataFetched.value = false
    DBApiService.getEntity<AlbumPage>(entityType, id)
      .then((data) => {
        const preparedData = {
          ...data,
          tracks: data.tracks.map((track, index) => (
            new AlbumTrackDTO(track, index + 1, data.albumCover, data.period)
          ))
        }
        Object.assign(entity, preparedData)
        isDataFetched.value = true
        store.commit("setPlayerPlaylist", preparedData);
        if (id === 'random') {
          router.push({ params: { id: data._id } })
        }
        fetchDiscogsInfo()
      })
      .catch((error) => {
        console.error(error)
        isDataFetched.value = true
      })
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

  const fetchDiscogsInfo = async () => {
    isDiscogsFetched.value = false
    discogsData.length = 0
    // @ts-ignore
    DiscogsServices.discogs(entity, 1)
      .then((response) => {
        const isValidResponse = response.data.some(({ releaseTitle }) => {
          const dataTitle = releaseTitle.toLowerCase().replace(/[^a-z0-9]/g, '')
          // @ts-ignore
          const entityTitle = entity.title.toLowerCase().replace(/[^a-z0-9]/g, '')
          return dataTitle.includes(entityTitle)
        })
        
        if (isValidResponse) {
          discogsData.push(...response.data)
          Object.assign(discogsPagination, response.pagination)
        }
        
        isDiscogsFetched.value = true
      })
      .catch((error) => console.dir(error));
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
    discogsPayload,
    booklet,
    route
  }
}
