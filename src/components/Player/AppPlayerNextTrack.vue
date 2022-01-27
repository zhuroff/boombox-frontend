<template>
  
<button
  class="player__next"
  :disabled="!isNextTrackExist"
  @click="switchToNextTrack"
>
  <AppSprite name="next" />
</button>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import usePlayer from './usePlayer'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
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

