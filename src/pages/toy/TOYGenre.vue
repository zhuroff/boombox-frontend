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
      :heading="heading || ''"
      :withSearch="false"
    >
      <Button
        size="medium"
        :label="localize('player.waveButton')"
        :disabled="!waveAlbum?.tracks?.length"
        @click="playWave"
      />
    </Header>
    <ul class="toygenres__list">
      <TOYYearCard
        v-for="[key, value] in genreFolders"
        :key="key"
        :card="value"
        :rootPath="`toy/${(heading || '')}`"
      />
    </ul>
  </div>
  <div
    v-else-if="!isPageLoading && !genreFolders.size"
    class="toyempty"
  >{{ localize('toy.emptyYears') }}</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { CloudEntity, CloudEntityRes, TrackRes } from '~/types/ReqRes'
import useGlobalStore from '~/store/global'
import usePlaylist from '~/store/playlist'
import cloudServices from '~/services/cloud.services'
import Preloader from '~/components/Preloader.vue'
import Header from '~/components/Header.vue'
import TOYYearCard from '~/components/Cards/TOYYearCard.vue'
import Button from '~/components/Button.vue'
import AlbumPage from '~/classes/AlbumPage'
import { useRoute } from 'vue-router'

const {
  globalGetters: { localize }
} = useGlobalStore()

const {
  playerGetters: { playingTrack, currentPlaylist },
  playerActions: { setPlayerPlaylist, togglePlayerVisibility, playTrack, continuePlay, setTrackOnPause }
} = usePlaylist()

const route = useRoute()
const isPageLoading = ref(true)
const genreFolders = reactive<Map<string, CloudEntity>>(new Map())
const waveAlbum = ref<null | AlbumPage>(null)

const heading = computed(() => String(route.params.genre))

const playWave = () => {
  if (!waveAlbum.value) return
  if (!playingTrack.value?._id) {
    // @ts-expect-error: fix
    playTrack(waveAlbum.value.tracks[0])
    togglePlayerVisibility()
  } else {
    // @ts-expect-error: fix
    if (currentPlaylist.value?._id !== route.params.genre) {
      setPlayerPlaylist(waveAlbum.value)
      // @ts-expect-error: fix
      playTrack(waveAlbum.value.tracks[0])
      togglePlayerVisibility()
    }

    playingTrack.value.isOnPause
      ? continuePlay()
      : setTrackOnPause()
  }
}

const fetchTOYYears = async () => {
  try {
    const years: string[] = []
    const genreFolder = await cloudServices.getFolderContent({
      path: '',
      cloudURL: String(import.meta.env.VITE_TOY_CLOUD),
      root: encodeURIComponent(`TOY/${route.params.genre}`)
    })

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

    getTOYWave(years)
  } catch (error) {
    console.error(error)
  } finally {
    isPageLoading.value = false
  }
}

const getTOYWave = async (years: string[]) => {
  try {
    const tracks = await cloudServices.getRandomTracks({
      path: '',
      years,
      cloudURL: String(import.meta.env.VITE_TOY_CLOUD),
      root: encodeURIComponent(`TOY/${route.params.genre}`),
      limit: 50
    })
    setTOYWave(tracks, String(route.params.genre))
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
  setPlayerPlaylist(waveAlbum.value)
}

watch(
  route,
  (value) => {
    if (value.params?.genre) {
      fetchTOYYears()
    }
  },
  { immediate: true, deep: true }
)
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
