<template>
  <AlbumPageTemplate
    :isDataFetched="isDataFetched"
    :album="album"
    :relatedAlbums="relatedAlbums"
  >
    <template #hero>
      <AlbumHero
        v-if="album._id"
        :id="album._id"
        :title="album.title"
        :artist="album.artist"
        :genre="album.genre"
        :period="album.period"
        :totalCounts="totalCounts"
        @getRandomAlbum="getRandom"
      >
        <template #cover>
          <CoverArt :cover="album.coverURL" />
        </template>
      </AlbumHero>
    </template>
  </AlbumPageTemplate>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref, watch } from 'vue'
import { RequestFilter } from '~/types/Common'
import { RelatedAlbums } from '~/types/Album'
import { useSinglePage } from '~/hooks/useSinglePage'
import { useLocales } from '~/hooks/useLocales'
import { conjugate } from '~/utils'
import store from '~/store'
import AlbumPage from '~/classes/AlbumPage'
import AlbumItem from '~/classes/AlbumItem'
import AlbumPageTemplate from '~/templates/AlbumPageTemplate.vue'
import CoverArt from '~/components/CoverArt.vue'
import AlbumHero from '~/components/AlbumHero.vue'
import CompilationEntity from '~/classes/CompilationEntity'

export default defineComponent({
  name: 'AlbumPage',
  components: {
    AlbumPageTemplate,
    AlbumHero,
    CoverArt
  },
  setup() {
    const {
      fetchData,
      isDataFetched,
      getRandomAlbum,
      getRelatedAlbums,
      route
    } = useSinglePage<any, CompilationEntity<any>>(CompilationEntity, 'CompilationCard', 'compilations')

    const { lang } = useLocales()
    const { actions } = store
    const album = ref<AlbumPage>({} as AlbumPage)
    const relatedAlbums = ref<RelatedAlbums[]>([])
    const entityType = ref('compilations')

    const getRandom = () => {
      getRandomAlbum(entityType.value)
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
        
        relatedAlbums.value = response.map(({ docs, name}) => ({
          name,
          docs: docs.map<AlbumItem>((album) => new AlbumItem(album, 'AlbumCard', 'albums'))
        }))
      } catch (error) {
        console.error(error)
      }
    }

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

    watch(
      route,
      (newValue) => {
        if (newValue.params.id && newValue.params.id !== album.value._id) {
          album.value = {} as AlbumPage
          fetchData(entityType.value)
            .then((payload) => {
              console.log(payload)
              // if (payload) {
              //   album.value = payload
              //   actions.setPlayerPlaylist(payload)
              //   getRelated()
              // }
            })
        }
      },
      { immediate: false }
    )

    onMounted(() => {
      fetchData(entityType.value)
        .then((payload) => {
          if (payload) {
            console.log(payload)
            // album.value = payload
            // actions.setPlayerPlaylist(payload)
            // getRelated()
          }
        })
    })

    return {
      lang,
      album,
      entityType,
      getRelated,
      totalCounts,
      isDataFetched,
      relatedAlbums,
      getRandom
    }
  }
})
</script>
