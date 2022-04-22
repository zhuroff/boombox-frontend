<template>
  
<button
  class="player__previous"
  :disabled="!isPrevTrackExist"
  @click="switchToPrevTrack"
>
  <Sprite name="previous" />
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

    const isPrevTrackExist = computed(() => {
      const playingTrackIndex = activePlaylistTracks.value
        .findIndex((track) => track.fileid === playingTrack.value.fileid)
      
      return playingTrackIndex > 0
    })

    const switchToPrevTrack = () => {
      const currentTrackIndex = activePlaylistTracks.value
        .findIndex((track) => track.fileid === playingTrack.value.fileid)

      const prevTrack = activePlaylistTracks.value[currentTrackIndex - 1]

      if (prevTrack) {
        store.dispatch('playTrack', prevTrack.fileid)
      }
    }

    return {
      isPrevTrackExist,
      switchToPrevTrack
    }
  },
})

</script>

