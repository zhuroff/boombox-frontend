<template>
  <transition name="fade">
    <Preloader
      v-if="isPageLoading"
      mode="light"
    />
  </transition>
  <div
    v-if="!isPageLoading && genreFolders.size"
    class="toygenres"
  >
    <Header
      :heading="params?.title || ''"
      :withSearch="false"
    >
      <Button
        size="medium"
        :label="lang('player.waveButton')"
        :disabled="!waveAlbum?.tracks?.length"
        @click="playWave"
      />
    </Header>
    <ul class="toygenres__list">
      <TOYYearCard
        v-for="[key, value] in genreFolders"
        :key="key"
        :card="value"
        :rootPath="`toy/${slugify(params?.path || '')}`"
      />
    </ul>
  </div>
  <div
    v-else-if="!isPageLoading && !genreFolders.size"
    class="toyempty"
  >{{ lang('toy.emptyYears') }}</div>
</template>

<script lang="ts">
import { PropType, defineComponent, reactive, ref, watch } from 'vue'
import { CloudEntity, CloudEntityRes, TrackRes } from '~/types/ReqRes'
import { useLocales } from '~/hooks/useLocales'
import { slugify } from '~/utils'
import cloudServices from '~/services/cloud.services'
import Preloader from '~/components/Preloader.vue'
import Header from '~/components/Header.vue'
import TOYYearCard from '~/components/Cards/TOYYearCard.vue'
import Button from '~/components/Button.vue'
import AlbumPage from '~/classes/AlbumPage'
import store from '~/store'

export default defineComponent({
  name: 'TOYGenrePage',
  components: {
    Preloader,
    Header,
    TOYYearCard,
    Button
  },
  props: {
    params: {
      type: Object as PropType<CloudEntity>,
      required: false
    }
  },
  setup(props) {
    const { lang } = useLocales()
    const { actions, getters: { playingTrack, playlists } } = store
    const isPageLoading = ref(true)
    const genreFolders = reactive<Map<string, CloudEntity>>(new Map())
    const waveAlbum = ref<null | AlbumPage>(null)

    const playWave = () => {
      if (!waveAlbum.value) return
      if (!playingTrack.value._id) {
        actions.playTrack(waveAlbum.value.tracks[0])
        actions.togglePlayerVisibility()
      } else {
        if (playlists.value.current._id !== props.params?.title) {
          actions.setPlayerPlaylist(waveAlbum.value)
          actions.playTrack(waveAlbum.value.tracks[0])
          actions.togglePlayerVisibility()
        }

        playingTrack.value.isOnPause
          ? actions.continuePlay()
          : actions.setTrackOnPause()
      }
    }

    const fetchTOYYears = async () => {
      if (!props.params?.cloudURL) return

      try {
        const years: string[] = []
        const genreFolder = await cloudServices.getFolderContent(
          '',
          props.params.cloudURL,
          encodeURIComponent(`TOY/${props.params.path}`)
        )

        genreFolder.items.forEach((item) => {
          if (!item.mimeType && item.title.length === 4) {
            years.push(item.title)
            genreFolders.set(
              item.title,
              {
                ...item,
                path: decodeURIComponent(item.path).replace('MelodyMap/TOY/', '')
              }
            )
            
          }
        })

        isPageLoading.value = false
        getTOYWave(years)
      } catch (error) {
        console.error(error)
      }
    }

    const getTOYWave = async (years: string[]) => {
      if (!props.params?.cloudURL) return
      try {
        const tracks = await cloudServices.getRandomTracks(
          '',
          years,
          props.params.cloudURL,
          encodeURIComponent(`TOY/${props.params.path}`),
          50
        )
        setTOYWave(tracks, props.params.title)
      } catch (error) {
        console.error(error)
      }
    }

    const setTOYWave = (tracks: CloudEntityRes['items'], title: string) => {
      waveAlbum.value = new AlbumPage({
        _id: title,
        title: title,
        tracks: tracks.reduce<TrackRes[]>((acc, next, index) => {
          acc.push({
            _id: next.id,
            title: next.title.replace(/^\d+\.\s|\.\w+$/g, ''),
            artist: { title: 'Various Artists', _id: '' },
            genre: { title: '', _id: '' },
            period: { title: '', _id: '' },
            inAlbum: { title: 'Tracks of the Years', _id: '' },
            path: next.path.replace('MelodyMap%2FTOY%2F', ''),
            isTOY: true,
            order: index,
            cloudURL: String(next.cloudURL)
          })
          return acc
        }, [])
      })
      actions.setPlayerPlaylist(waveAlbum.value)
    }

    watch(
      props,
      (value) => {
        if (value.params) {
          fetchTOYYears()
        }
      },
      { immediate: true, deep: true }
    )

    return {
      isPageLoading,
      genreFolders,
      waveAlbum,
      playWave,
      slugify,
      lang
    }
  }
})
</script>

<style lang="scss" scoped>
.toygenres {

  &__list {
    padding: 25px;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(10, 1fr);
  }
}
</style>
