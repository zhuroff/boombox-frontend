import { computed, ref, type ComputedRef } from 'vue'
import { useGetList, useGetPage, useDevice } from '~shared/model'
import type { RouteParamsGeneric } from 'vue-router'
import type { TOYAlbumFull, TOYAlbumBasic } from '../lib/types'
import type { RelatedAlbums, RequestConfig, UseEntityListPayload } from '~shared/lib'
import type { DatabaseService } from '~shared/api'

const useTOYAlbum = (dbService: DatabaseService, routeParams: ComputedRef<RouteParamsGeneric>) => {
  const { isMobile } = useDevice()

  const preRandomState = ref('')
  const pageEntityKey = ref('toy')

  const relatedAlbumsReqConfig: RequestConfig = {
    page: 1,
    limit: 5,
    isRandom: 1,
    sort: { year: 1 },
    path: 'MelodyMap/TOY'
  }

  const yearsConfig = computed<UseEntityListPayload>(() => (
    album.value
      ? {
          entityKey: pageEntityKey.value,
          requestConfig: {
            ...relatedAlbumsReqConfig,
            filter: {
              from: 'years',
              value: routeParams.value.id,
              excluded: { genre: routeParams.value.genre }
            }
          }
        }
      : {} as UseEntityListPayload
  ))
  
  const genresConfig = computed<UseEntityListPayload>(() => (
    album.value
      ? {
          entityKey: pageEntityKey.value,
          requestConfig: {
            ...relatedAlbumsReqConfig,
            filter: {
              from: 'genres',
              value: routeParams.value.genre,
              excluded: { year: routeParams.value.id }
            }
          }
        }
      : {} as UseEntityListPayload
  ))

  const isAlbumReady = computed(() => (
    !!album.value && isAlbumFetched.value && !isMobile.value
  ))

  const {
    data: album,
    isFetched: isAlbumFetched
  } = useGetPage<TOYAlbumFull>(
    pageEntityKey,
    dbService,
    preRandomState
  )

  const { data: relatedAlbumsByYear } = useGetList<TOYAlbumBasic>(yearsConfig, dbService, isAlbumReady)

  const { data: relatedAlbumsByGenre } = useGetList<TOYAlbumBasic>(genresConfig, dbService, isAlbumReady)

  const relatedAlbums = computed<RelatedAlbums<TOYAlbumBasic>[]>(() => ([
    {
      docs: relatedAlbumsByYear.value?.docs || [],
      name: String(routeParams.value.id)
    },
    {
      docs: relatedAlbumsByGenre.value?.docs || [],
      name: String(routeParams.value.genre)
    }
  ]).filter(({ docs }) => !!docs.length))

  return {
    album,
    isAlbumReady,
    preRandomState,
    relatedAlbums
  }
}

export default useTOYAlbum