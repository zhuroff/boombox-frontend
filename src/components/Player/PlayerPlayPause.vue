<template>
  
<button
  v-if="playingTrack.isOnPause"
  class="player__play"
  @click="continuePlay"  
>
  <AppSprite name="play" />
</button>

<button
  v-else
  class="player__pause"
  @click="setTrackOnPause"
>
  <AppSprite name="pause" />
</button>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import usePlayer from './usePlayer'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  setup() {
    const { playingTrack, store } = usePlayer()

    const setTrackOnPause = () => {
      store.commit('setTrackOnPause')
    }

    const continuePlay = () => {
      store.commit('continuePlay')
    }

    return {
      playingTrack,
      setTrackOnPause,
      continuePlay
    }
  },
})

</script>

