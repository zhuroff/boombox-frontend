<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!playlist.isFetched"
        mode="light"
      />
    </transition>
      
    <transition-group name="flyUp">
      <CategoryHero
        v-if="playlist.isFetched"
        key="hero"
        :data="playlist.data"
        :description="playlistDescription"
        slug="playlists"
        noAvatar
        isEditable
        @setUploadedImage="setUploadedImage"
        @saveTitle="saveTitle"
      />

      <div
        v-if="playlist.isFetched"
        key="playlist"
        class="album"
      >
        <div class="album__aside">
          <div class="album__sidebar">
            <CoverArt
              :albumCover="albumCover"
              :isBooklet="false"
              uploadable
              @uploadImage="uploadCover"
            />
          </div>
        </div>

        <div class="album__content">
          <TrackList
            :tracks="playlist.data.tracks"
            :albumID="playlist.data._id"
            isPlaylist
            @orderChanged="orderChanged"
          />
        </div>
      </div>
    </transition-group>
  </section>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { hostString } from '~/shared/media'
import { ImagePayload, ReorderPayload, UploadImageResult } from '~/types/Global'
import { PlaylistPage, PlaylistPageProps } from '~/types/Playlist'
import PlaylistServices from '~/services/PlaylistServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CategoryHero from '~/components/Hero/CategoryHero.vue'
import CoverArt from '~/components/CoverArt/CoverArt.vue'
import TrackList from '~/components/TrackList/TrackList.vue'
import UploadServices from '~/services/UploadServices'

export default defineComponent({
  components: {
    AppPreloader,
    CategoryHero,
    CoverArt,
    TrackList
  },

  setup() {
    const route = useRoute()
    const store = useStore(key)

    const playlist = reactive<PlaylistPageProps>({
      isFetched: false,
      data: {} as PlaylistPage
    })

    const playlistDescription = computed(() => (
      `Tracks in playlist: ${playlist.data.tracks?.length}`
    ))

    const albumCover = computed(() => (
      playlist.data.avatar && host(playlist.data.avatar)
    ))

    const setUploadedImage = (payload: UploadImageResult) => {
      playlist.data[payload.key] = payload.url
    }

    const uploadCover = (file: File) => {
      const payload: ImagePayload = {
        file,
        type: 'avatar',
        slug: 'playlists',
        id: String(route.params.id)
      }

      UploadServices.uploadImage<PlaylistPage>(payload)
        .then((data) => playlist.data.avatar = data.avatar)
        .catch((error) => console.dir(error))
    }

    const orderChanged = (payload: ReorderPayload) => {
      PlaylistServices.reorder(payload)
        .then((message) => store.commit('setSnackbarMessage', { message, type: 'success' }))
        .catch((error) => console.dir(error))
    }

    const setPlaylist = (data: PlaylistPage) => {
      playlist.data = data
      playlist.isFetched = true
    }

    const fetchPlaylist = () => {
      PlaylistServices.single(String(route.params.id))
        .then((response) => {
          setPlaylist(response)
          store.commit('setPlayerPlaylist', response)
        })
        .catch((error) => console.dir(error))
    }

    const saveTitle = (title: string) => {
      if (title !== playlist.data?.title && title.length > 1) {
        PlaylistServices.rename(String(route.params.id), title)
          .catch((error) => console.dir(error))
      }
    }

    const host = (pathname: string) => hostString(pathname)

    onMounted(() => fetchPlaylist())

    return {
      playlist,
      albumCover,
      setUploadedImage,
      uploadCover,
      orderChanged,
      playlistDescription,
      saveTitle
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';
@import 'include-media';

.hero {

  @include media('<laptop') {
    display: none;
  }
}

</style>
