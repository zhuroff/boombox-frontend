import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useState } from '~/hooks/useState'
import { CloudFolderResponse } from '~/types/Cloud'
import { AlbumBooklet, AlbumItem, AlbumPage, BookletSlideState } from '~/types/Album'
import { BasicEntity, CardBasic, RequestConfig, RequestFilter } from '~/types/Common'
import { AlbumCardBoxDTO } from '~/classes/AlbumCardBox'
import { ListPageResponse } from '~/types/ReqRes'
import AlbumTrack from '~/classes/AlbumTrack'
import { BookletState } from '~/states/BookletState'
import dbServices from '~/services/database.services'
import cloudServices from '~/services/cloud.services'

export const useAlbumPage = <T extends BasicEntity, C>(Class: new (prop: T) => C) => {
  const route = useRoute()
  const router = useRouter()
  const store = useState()
  const entity = ref<C>({} as C)
  const relatedEntities = reactive<Map<string, CardBasic[]>>(new Map())
  const booklet = reactive<BookletState>(new BookletState())
  const isDataFetched = ref(false)

  const fetchData = async (entityType: string, id = String(route.params.id)) => {
    isDataFetched.value = false
    Object.assign(booklet, new BookletState())

    try {
      const data = await dbServices.getEntity<T>(entityType, id)
      console.log(data)
      // const preparedData = {
      //   ...data,
      //   tracks: data.tracks.map((track, index) => (
      //     new AlbumTrack(track, index + 1, data.period, data.coverURL)
      //   ))
      // }
      // Object.assign(entity, preparedData)
      // store.commit('setPlayerPlaylist', preparedData)

      if (id === 'random') {
        router.push({ params: { id: data._id } })
      }

      return {
        artist: preparedData.artist.title,
        album: preparedData.title
      }
    } catch (error) {
      console.error(error)
      return null
    } finally {
      isDataFetched.value = true
    }
  }

  const fetchBooklet = async (folder: string) => {
    booklet.isActive = true
    if (booklet.items.length > booklet.offset || !entity.cloudURL) return

    try {
      const bookletContent = await cloudServices.getImages<CloudFolderResponse<AlbumBooklet>>(
        `${folder}/booklet`, booklet.limit, booklet.offset, entity.cloudURL
      )
      if (bookletContent) {
        booklet.items.push(...bookletContent.items)
        booklet.total = bookletContent.total
        
        if (booklet.items.length === booklet.total) {
          booklet.isCompleted = true
        }
      }
    } catch (error) {
      console.error(error)
      booklet.isActive = false
      booklet.isEmpty = true
    } finally {
      booklet.isFetched = true
    }
  }

  const bookletPageChanged = (data: BookletSlideState, folder: string) => {
    if (
      booklet.items.length !== booklet.total
      && data.slidingToIndex === booklet.items.length - 5
    ) {
      booklet.offset += booklet.limit
      fetchBooklet(folder)
    }
  }

  const closeBookletModal = () => {
    booklet.isActive = false
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
      [filter.from]: await dbServices.getEntityList<ListPageResponse<AlbumItem>>(
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
    closeBookletModal,
    bookletPageChanged,
    booklet,
    route
  }
}
