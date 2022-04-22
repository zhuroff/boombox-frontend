<template>
  
<button
  class="player__next"
  :disabled="!isNextTrackExist"
  @click="switchToNextTrack"
>
  <Sprite name="next" />
</button>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import usePlayer from './usePlayer'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const {
      activePlaylistTracks,
      playingTrack,
      store
    } = usePlayer()

    const isNextTrackExist = computed(() => {     
      const playingTrackIndex = activePlaylistTracks.value
        .findIndex((track) => track.fileid === playingTrack.value.fileid)

      return playingTrackIndex < activePlaylistTracks.value.length - 1
    })

    const switchToNextTrack = () => {
      const currentTrackIndex = activePlaylistTracks.value
        .findIndex((track) => track.fileid === playingTrack.value.fileid)

      const nextTrack = activePlaylistTracks.value[currentTrackIndex + 1]

      if (nextTrack) {
        store.dispatch('playTrack', nextTrack.fileid)
      }
    }

    return {
      isNextTrackExist,
      switchToNextTrack
    }
  },
})

</script>

