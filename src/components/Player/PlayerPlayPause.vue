<template>  
  <button
    v-if="playingTrack.isOnPause"
    class="player__play"
    @click="continuePlay"  
  >
    <Sprite name="play" />
  </button>
  <button
    v-else
    class="player__pause"
    @click="setTrackOnPause"
  >
    <Sprite name="pause" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePlayer } from '~/hooks/usePlayer'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
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
