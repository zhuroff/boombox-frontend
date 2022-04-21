<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!playlist.isFetched"
        mode="light"
      />
    </transition>
      
    <div id="scrollspace">
      <transition-group name="flyUp">
        <CollectionHero
          v-if="playlist.isFetched"
          key="hero"
          keyWord="Tracks"
          :collection="playlist.data"
          @setCollectionImage="setPlaylistImage"
        />

        <div
          v-if="playlist.isFetched"
          key="playlist"
          class="playlist"
        >
          <TrackList
            :tracks="playlist.data.tracks"
            :albumID="playlist.data._id"
            isPlaylist
            @orderChanged="orderChanged"
          />
        </div>
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { key } from '~/store'
import { ReorderPayload } from '~/types/Global'
import { PlaylistPage, PlaylistPageProps } from '~/types/Playlist'
import PlaylistServices from '~/services/PlaylistServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CollectionHero from '~/components/Hero/CollectionHero.vue'
import TrackList from '~/components/TrackList/TrackList.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CollectionHero,
    TrackList
  },

  setup() {
    const route = useRoute()
    const store = useStore(key)

    const playlist = reactive<PlaylistPageProps>({
      isFetched: false,
      data: {} as PlaylistPage
    })

    const setPlaylistImage = (payload: any) => {
      console.log(payload)
    }

    const orderChanged = (payload: ReorderPayload) => {
      console.log(payload)
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

    onMounted(() => fetchPlaylist())

    return {
      playlist,
      setPlaylistImage,
      orderChanged
    }
  }
})

</script>
