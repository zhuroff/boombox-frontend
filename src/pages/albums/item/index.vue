<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="album"
    :booklet="booklet"
    :relatedAlbums="relatedEntities"
    :discogsTablePayload="discogsTablePayload"
    :discogsFilters="discogsFilters"
    :discogsFiltersStates="discogsFiltersStates"
    :getBooklet="bookletHandler"
    :getRelated="getRelated"
    @filter:update="setDiscogsFilterValue"
    @filter:reset="resetDiscogsFilters"
    @switchPagination="setDiscogsPaginationPage"
    @closeBookletModal="closeBookletModal"
    @bookletPageChanged="(data) => bookletPageChanged(data, album.folderName)"
  >
    <AlbumHero
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
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
import { conjugate } from '~/utils'
import { useSinglePage } from '~/hooks/useSinglePage'
import { useDiscogs } from '~/hooks/useDiscogs'
import { useLocales } from '~/hooks/useLocales'
import store from '~/store'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import AlbumPage from '~/classes/AlbumPage'
import { AlbumPageRes } from '~/types/ReqRes'
import { RequestFilter } from '~/types/Common'

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
      relatedEntities,
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
    const { actions } = store
    const album = reactive<AlbumPage>({} as AlbumPage)
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
      const isAllTracksHaveDuration = album.tracks?.every((track) => (
        Number(track.duration)
      ))
      return `
        ${album.tracks?.length} ${conjugate('tracks', album.tracks?.length)}:
        ${isAllTracksHaveDuration ? calcTotalTracksTime(album.tracks) : lang('unknownTime')}.
        ${lang('listenedTracks')} ${album.tracks?.reduce((acc, { listened }) => (
          acc + (Number(listened) || 0)
        ), 0)}
      `.trim()
    })

    const getRandom = () => {
      getRandomAlbum(entityType.value)
        .then((payload) => payload && fetchDiscogsInfo(payload))
    }

    const getRelated = () => {
      const relatedAlbumsConfig: RequestFilter[] = [
        {
          from: 'artists',
          key: 'artist._id',
          value: album.artist._id,
          excluded: {
            _id: album._id
          }
        },
        {
          from: 'genres',
          key: 'genre._id',
          value: album.genre._id,
          excluded: {
            _id: album._id,
            'artist._id': album.artist._id
          }
        }
      ]

      relatedAlbumsConfig.forEach((config) => {
        getRelatedAlbums(config, entityType.value)
      })
    }

    const bookletHandler = async () => {
      if (booklet.isEmpty) {
        actions.setSnackbarMessage({
          message: lang('bookletNotFound'),
          type: 'error'
        })
        return false
      }

      await fetchBooklet(album.folderName)

      if (booklet.isEmpty) {
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
            Object.assign(album, payload)
            fetchDiscogsInfo(payload)
          }
        })
    })

    watch(
      route,
      (newValue) => {
        if (newValue.params.id && newValue.params.id !== album._id) {
          fetchData(entityType.value)
            .then((payload) => payload && fetchDiscogsInfo(payload))
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
      relatedEntities,
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
  },
});
</script>
