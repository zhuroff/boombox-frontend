import { reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlbumItem, AlbumPage } from '~/types/Album'
import { CardBasic, ListPageResponse, RequestConfig, RequestFilter } from '~/types/Global'
import DBApiService from '~/services/DBApiService'
import CloudApiService from '~/services/CloudApiService'
import DiscogsServices from '~/services/DiscogsServices'

export const useAlbumPage = <T extends object>() => {
  const route = useRoute()
  const router = useRouter()
  const entity = reactive<T>({} as T)
  const relatedEntities = reactive<Map<string, CardBasic[]>>(new Map())
  const booklet = reactive<string[]>([])
  const isDataFetched = ref(false)
  const isBookletOpened = ref(false)
  const isBookletAbsent = ref(false)

  const fetchData = (entityType: string) => {
    isDataFetched.value = false
    DBApiService.getEntity<AlbumPage>(entityType, String(route.params.id))
      .then((data) => {
        Object.assign(entity, data)
        isDataFetched.value = true
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
    isDataFetched.value = false
    DBApiService.getEntityList<ListPageResponse<AlbumItem>>(
      {
        ...requestConfig,
        isRandom: true,
        limit: 1
      },
      entityType
    )
      .then(({ docs }) => {
        Object.assign(entity, docs[0])
        router.push({ params: { id: docs[0]._id } })
        isDataFetched.value = true
      })
      .catch(console.error)
  }

  const getRelatedAlbums = async (filter: RequestFilter, entityType: string) => {
    const response = {
      [filter.from]: await DBApiService.getEntityList<ListPageResponse<AlbumItem>>(
        { ...requestConfig, filter, isRandom: true, },
        entityType
      )
    }
    Object.entries(response).forEach(([key, { docs }]) => {
      relatedEntities.set(key, docs.map((entity) => ({
        _id: entity._id,
        title: entity.title,
        coverURL: `${entity.albumCover}`,
        caption: `${entity.artist.title } / ${entity.period.title} / ${entity.genre.title}`,
      })))
    })
  }

  const fetchDiscogsInfo = async () => {
    // @ts-ignore
    DiscogsServices.discogs(entity, 1)
      .then((response) => {
        console.log(response)
        // setDiscogsData(response);

        // if (response.pagination.pages > page) {
        //   fetchDiscogsData(page + 1);
        // } else {
        //   discogs.isFetched = true;
        //   isDiscogsLoading.value = false;
        // }
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
    booklet
  }
}
