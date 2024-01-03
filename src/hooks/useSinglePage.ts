import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CloudFolderResponse } from '~/types/Cloud'
import { AlbumBooklet, BookletSlideState } from '~/types/Album'
import { BasicEntity, RequestConfig, RequestFilter } from '~/types/Common'
import { AlbumItemRes, ListPageResponse } from '~/types/ReqRes'
import BookletState from '~/classes/BookletState'
import dbServices from '~/services/database.services'
import cloudServices from '~/services/cloud.services'

export const useSinglePage = <T extends BasicEntity, C>(
  Class: new (prop: T, cardType: string, cardPath: string) => C,
  cardType: string,
  cardPath: string
) => {
  const route = useRoute()
  const router = useRouter()
  const booklet = ref<BookletState>(new BookletState())
  const isDataFetched = ref(false)

  const fetchData = async (entityType: string, id = String(route.params.id)) => {
    isDataFetched.value = false
    booklet.value = new BookletState()

    try {
      const data = await dbServices.getEntity<T>(entityType, id)
      const entity = new Class(data, cardType, cardPath)

      if (id === 'random') {
        router.push({ params: { id: data._id } })
      }

      return entity
    } catch (error) {
      console.error(error)
      return null
    } finally {
      isDataFetched.value = true
    }
  }

  const fetchBooklet = async (folder: string, cloud: string) => {
    booklet.value.isActive = true
    if (booklet.value.items.length > booklet.value.offset || !cloud) return

    try {
      const bookletContent = await cloudServices.getImages<CloudFolderResponse<AlbumBooklet>>(
        `${folder}/booklet`, booklet.value.limit, booklet.value.offset, cloud
      )
      if (bookletContent) {
        booklet.value.items.push(...bookletContent.items)
        booklet.value.total = bookletContent.total
        
        if (booklet.value.items.length === booklet.value.total) {
          booklet.value.isCompleted = true
        }
      }
    } catch (error) {
      console.error(error)
      booklet.value.isActive = false
      booklet.value.isEmpty = true
    } finally {
      booklet.value.isFetched = true
    }
  }

  const bookletPageChanged = (data: BookletSlideState, folder: string, cloud: string) => {
    if (
      booklet.value.items.length !== booklet.value.total
      && data.slidingToIndex === booklet.value.items.length - 5
    ) {
      booklet.value.offset += booklet.value.limit
      fetchBooklet(folder, cloud)
    }
  }

  const closeBookletModal = () => {
    booklet.value.isActive = false
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
    try {
      const response = {
        [filter.from]: await dbServices.getEntityList<ListPageResponse<AlbumItemRes>>(
          { ...requestConfig, filter, isRandom: true, },
          entityType
        )
      }  
      return Object.values(response).map((data) => ({ ...data, name: filter.name }))[0]
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    fetchData,
    isDataFetched,
    fetchBooklet,
    getRandomAlbum,
    getRelatedAlbums,
    closeBookletModal,
    bookletPageChanged,
    booklet,
    route
  }
}
