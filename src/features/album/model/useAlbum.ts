import { computed, ref } from 'vue'
import type DatabaseService from '~/services/DatabaseService'
import useGetList from '~/shared/useGetList'
import useGetPage from '~/shared/useGetPage'

const useAlbum = (dbService: DatabaseService) => {
  const preRandomState = ref('')
  const pageEntityKey = ref('albums')

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

  const isAlbumReady = computed(() => (
    Boolean(album.value) && isAlbumFetched.value
  ))

  const {
    data: album,
    isFetched: isAlbumFetched
  } = useGetPage<Album>(
    pageEntityKey,
    dbService,
    preRandomState
  )

  const { data: relatedAlbumsByArtist } = useGetList<Album>(artistConfig, dbService, isAlbumReady)

  const { data: relatedAlbumsByGenre } = useGetList<Album>(genreConfig, dbService, isAlbumReady)

  const relatedAlbums = computed<RelatedAlbums[]>(() => ([
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
    isAlbumReady,
    preRandomState,
    relatedAlbums
  }
}

export default useAlbum
