import { computed, type Ref } from 'vue'
import { useGetList, useGetPage, useDevice } from '~shared/model'
import type { AlbumBasic, AlbumFull } from '~entities/album'
import type { EmbeddedFull } from '~entities/embedded'
import type { RelatedAlbums, RequestConfig, UseEntityListPayload } from '~shared/lib'
import type { DatabaseService } from '~shared/api'

const useAlbumsWithRelated = <T extends AlbumFull | EmbeddedFull>(
  pageEntityKey: Ref<string>,
  dbService: DatabaseService,
  preRandomState: Ref<string>
) => {
  const { isMobile } = useDevice()

  const relatedAlbumsReqConfig: RequestConfig = {
    page: 1,
    limit: 5,
    sort: { title: 1 },
    isRandom: 1
  }

  const artistConfig = computed<UseEntityListPayload>(() => (
    album.value
      ? {
          qEntity: 'relatedAlbumsByArtist',
          entityKey: 'albums',
          requestConfig: {
            ...relatedAlbumsReqConfig,
            filter: {
              from: 'artists',
              key: 'artist._id',
              name: album.value?.artist.title,
              value: album.value?.artist._id,
              excluded: { _id: album.value?._id }
            }
          }
        }
      : {} as UseEntityListPayload
  ))
  
  const genreConfig = computed<UseEntityListPayload>(() => (
    album.value
      ? {
          qEntity: 'relatedAlbumsNyGenre',
          entityKey: 'albums',
          requestConfig: {
            ...relatedAlbumsReqConfig,
            filter: {
              from: 'genres',
              key: 'genre._id',
              name: album.value.genre.title,
              value: album.value.genre._id,
              excluded: { _id: album.value._id, 'artist>_id': album.value.artist._id }
            }
          }
        }
      : {} as UseEntityListPayload
  ))

  const isAlbumReady = computed(() => !!album.value && isAlbumFetched.value)
  const isReadyForRelated = computed(() => isAlbumReady.value && !isMobile.value)

  const {
    data: album,
    refetch: refetchAlbumPage,
    isFetched: isAlbumFetched
  } = useGetPage<T>(
    pageEntityKey,
    dbService,
    preRandomState
  )

  const { data: relatedAlbumsByArtist } = useGetList<AlbumBasic>(
    artistConfig,
    dbService,
    isReadyForRelated
  )

  const { data: relatedAlbumsByGenre } = useGetList<AlbumBasic>(
    genreConfig,
    dbService,
    isReadyForRelated
  )

  const relatedAlbums = computed<RelatedAlbums<AlbumBasic>[]>(() => ([
    {
      docs: relatedAlbumsByArtist.value?.docs || [],
      name: album.value?.artist.title || ''
    },
    {
      docs: relatedAlbumsByGenre.value?.docs || [],
      name: album.value?.genre.title || ''
    }
  ]).filter(({ docs }) => !!docs.length))

  return {
    album,
    refetchAlbumPage,
    isAlbumReady,
    preRandomState,
    relatedAlbums
  }
}

export default useAlbumsWithRelated
