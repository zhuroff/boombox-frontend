<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="entity"
    :entityType="entityType"
    :discogsTablePayload="discogsTablePayload"
    :discogsFilters="discogsFilters"
    :discogsFiltersStates="discogsFiltersStates"
    :getBooklet="() => fetchBooklet(entity.folderName)"
    @filter:update="setDiscogsFilterValue"
    @filter:reset="resetDiscogsFilters"
    @switchPagination="setDiscogsPaginationPage"
  >
    <AlbumInfo
      :title="entity.title"
      :artist="entity.artist"
      :genre="entity.genre"
      :period="entity.period"
      :entityType="entityType"
      :totalCounts="totalCounts"
      :getRandomAlbum="getRandom"
    />
  </AlbumPageTemplate>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { conjugate } from '~/utils'
import { AlbumPage } from '~/types/Album'
import { useAlbumPage } from '~/hooks/useAlbumPage'
import { useDiscogs } from '~/hooks/useDiscogs'
import { useLocales } from '~/hooks/useLocales'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import AlbumInfo from '~/components/AlbumInfo.vue'

export default defineComponent({
  name: 'AlbumPage',
  components: {
    AlbumPageTemplate,
    AlbumInfo
  },
  setup() {
    const {
      fetchData,
      entity,
      isDataFetched,
      fetchBooklet,
      getRandomAlbum,
      route
    } = useAlbumPage<AlbumPage>()

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
      const isAllTracksHaveDuration = entity.tracks?.every((track) => (
        Number(track.duration)
      ))
      return `
        ${entity.tracks?.length} ${conjugate('tracks', entity.tracks?.length)}:
        ${isAllTracksHaveDuration ? calcTotalTracksTime(entity.tracks) : lang('unknownTime')}.
        ${lang('listenedTracks')} ${entity.tracks?.reduce((acc, { listened }) => (
          acc + (Number(listened) || 0)
        ), 0)}
      `.trim()
    })

    const getRandom = () => {
      getRandomAlbum(entityType.value)
        .then((payload) => payload && fetchDiscogsInfo(payload))
    }

    onMounted(() => {
      fetchData(entityType.value)
        .then((payload) => payload && fetchDiscogsInfo(payload))
    })

    watch(
      route,
      (newValue) => {
        if (newValue.params.id && newValue.params.id !== entity._id) {
          fetchData(entityType.value)
            .then((payload) => payload && fetchDiscogsInfo(payload))
        }
      },
      { immediate: false }
    )

    return {
      isDataFetched,
      entity,
      entityType,
      fetchBooklet,
      getRandomAlbum,
      discogsTablePayload,
      discogsFiltersStates,
      setDiscogsFilterValue,
      setDiscogsPaginationPage,
      resetDiscogsFilters,
      discogsFilters,
      totalCounts,
      getRandom
    }
  },
});
</script>
