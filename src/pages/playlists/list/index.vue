<template>
  <section class="section">
    <transition name="fade">
      <AppPreloader
        v-if="!playlists.isFetched"
        mode="light"
      />
    </transition>

    <div id="scrollspace">
      <transition-group name="flyUp">
        <div
          class="section__heading"
          key="heading"
        >
          <h1 class="section__title">
            There are {{ playlists.data.length }} playlists in your collection
          </h1>
        </div>

        <ul
          v-if="playlists.isFetched"
          class="cardlist"
          key="list"
        >
          <CardWrapper
            v-for="playlist in playlists.data"
            :key="playlist._id"
            deletable
            @deleteItem="deletePlaylist(playlist._id)"
          >
            <CardCollection
              :data="playlist"
              title="Tracks in playlist:"
              slug="playlists"
            />
          </CardWrapper>
        </ul>
      </transition-group>
    </div>
  </section>
</template>

<script lang="ts">

import { defineComponent, onMounted, reactive } from 'vue'
import { PlaylistItemProps, PlayListItem } from '~/types/Playlist'
import PlaylistServices from '~/services/PlaylistServices'
import AppPreloader from '~/components/Preloader/Preloader.vue'
import CardWrapper from '~/components/Cards/CardWrapper.vue'
import CardCollection from '~/components/Cards/CardCollection.vue'

export default defineComponent({
  components: {
    AppPreloader,
    CardWrapper,
    CardCollection
  },

  setup() {
    const playlists = reactive<PlaylistItemProps>({
      isFetched: false,
      data: []
    })

    const setPlaylist = (data: PlayListItem[]) => {
      playlists.data = data
      playlists.isFetched = true
    }

    const deletePlaylist = (id: string) => {
      console.log(id)
    }

    const fetchPlaylists = () => {
      PlaylistServices.list()
        .then((data) => setPlaylist(data))
        .catch((error) => console.dir(error))
    }

    onMounted(() => fetchPlaylists())

    return {
      playlists,
      deletePlaylist
    }
  }
})

</script>
