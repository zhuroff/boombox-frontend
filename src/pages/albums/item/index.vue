<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="album"
    :booklet="booklet"
    :relatedAlbums="relatedAlbums"
    :discogsTablePayload="discogsTablePayload"
    :discogsFilters="discogsFilters"
    :discogsFiltersStates="discogsFiltersStates"
    :getBooklet="bookletHandler"
    @filter:update="setDiscogsFilterValue"
    @filter:reset="resetDiscogsFilters"
    @switchPagination="setDiscogsPaginationPage"
    @closeBookletModal="closeBookletModal"
    @bookletPageChanged="(data) => {
      bookletPageChanged(data, album.folderName, album.cloudURL)
    }"
  >
    <AlbumHero
      v-if="album._id"
      :id="album._id"
      :title="album.title"
      :artist="album.artist"
      :genre="album.genre"
      :period="album.period"
      :entityType="entityType"
      :totalCounts="totalCounts"
      :getRandomAlbum="getRandom"
    />
  </AlbumPageTemplate>
  <div></div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { AlbumPageRes } from '~/types/ReqRes'
import { RequestFilter } from '~/types/Common'
import { RelatedAlbums } from '~/types/Album'
import { conjugate } from '~/utils'
import { useSinglePage } from '~/hooks/useSinglePage'
import { useDiscogs } from '~/hooks/useDiscogs'
import { useLocales } from '~/hooks/useLocales'
import store from '~/store'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import AlbumPage from '~/classes/AlbumPage'
import AlbumItem from '~/classes/AlbumItem'

export default defineComponent({
  name: 'AlbumPage',
  components: {
    AlbumPageTemplate,
    AlbumHero
  },
  setup() {
    const {
      fetchData,
      booklet,
      isDataFetched,
      fetchBooklet,
      getRandomAlbum,
      getRelatedAlbums,
      closeBookletModal,
      bookletPageChanged,
      route
    } = useSinglePage<AlbumPageRes, AlbumPage>(AlbumPage)

    const {
      fetchDiscogsInfo,
      discogsTablePayload,
      discogsFiltersStates,
      setDiscogsFilterValue,
      setDiscogsPaginationPage,
      resetDiscogsFilters,
      discogsFilters
    } = useDiscogs()

    const { lang } = useLocales()
    const { actions, getters } = store
    const album = ref<AlbumPage>({} as AlbumPage)
    const relatedAlbums = ref<RelatedAlbums[]>([])
    const entityType = ref('albums')

    const calcTotalTracksTime = (tracks: AlbumPage['tracks']): string => {
      const totalDurationInSeconds = tracks.reduce((acc, next) => (
        acc + (Number(next.duration) || 0)
      ), 0)

      const hours = Math.floor(totalDurationInSeconds / 3600)
      const minutes = Math.floor((totalDurationInSeconds % 3600) / 60)
      const seconds = Math.floor(totalDurationInSeconds % 60)

      const formattedTime = `
        ${hours.toString().padStart(2, '0')}:
        ${minutes.toString().padStart(2, '0')}:
        ${seconds.toString().padStart(2, '0')}
      `.replace(/\s+/g, '')

      return formattedTime
    }

    const totalCounts = computed(() => {
      const isAllTracksHaveDuration = album.value.tracks?.every((track) => (
        Number(track.duration)
      ))
      return `
        ${album.value.tracks?.length} ${conjugate('tracks', album.value.tracks?.length)}:
        ${isAllTracksHaveDuration ? calcTotalTracksTime(album.value.tracks) : lang('unknownTime')}.
        ${lang('listenedTracks')} ${album.value.tracks?.reduce((acc, { listened }) => (
          acc + (Number(listened) || 0)
        ), 0)}
      `.trim()
    })

    const getRandom = () => {
      getRandomAlbum(entityType.value)
        .then((payload) => payload && fetchDiscogsInfo(payload))
    }

    const getRelated = async () => {
      const relatedAlbumsConfig: RequestFilter[] = [
        {
          from: 'artists',
          key: 'artist._id',
          name: album.value.artist.title,
          value: album.value.artist._id,
          excluded: {
            _id: album.value._id
          }
        },
        {
          from: 'genres',
          key: 'genre._id',
          name: album.value.genre.title,
          value: album.value.genre._id,
          excluded: {
            _id: album.value._id,
            'artist._id': album.value.artist._id
          }
        }
      ]

      try {
        relatedAlbums.value = []
        const response = await Promise.all(relatedAlbumsConfig.map(async (config) => (
          await getRelatedAlbums(config, entityType.value)
        )))
        
        relatedAlbums.value = response
      } catch (error) {
        console.error(error)
      }
    }

    const bookletHandler = async () => {
      if (booklet.value.isEmpty) {
        actions.setSnackbarMessage({
          message: lang('bookletNotFound'),
          type: 'error'
        })
        return false
      }

      await fetchBooklet(album.value.folderName, album.value.cloudURL)

      if (booklet.value.isEmpty) {
        actions.setSnackbarMessage({
          message: lang('bookletNotFound'),
          type: 'error'
        })
      }
    }

    onMounted(() => {
      fetchData(entityType.value)
        .then((payload) => {
          if (payload) {
            album.value = payload
            actions.setPlayerPlaylist(payload)
            getRelated()
            fetchDiscogsInfo(payload)
          }
        })
    })

    watch(
      route,
      (newValue) => {
        if (newValue.params.id && newValue.params.id !== album.value._id) {
          album.value = {} as AlbumPage
          fetchData(entityType.value)
            .then((payload) => {
              if (payload) {
                album.value = payload
                actions.setPlayerPlaylist(payload)
                getRelated()
                fetchDiscogsInfo(payload)
              }
            })
        }
      },
      { immediate: false }
    )

    return {
      isDataFetched,
      album,
      booklet,
      entityType,
      getRelated,
      bookletHandler,
      getRandomAlbum,
      relatedAlbums,
      closeBookletModal,
      discogsTablePayload,
      discogsFiltersStates,
      setDiscogsFilterValue,
      setDiscogsPaginationPage,
      resetDiscogsFilters,
      bookletPageChanged,
      discogsFilters,
      totalCounts,
      getRandom
    }
  }
})
</script>
