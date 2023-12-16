<template>  
  <button
    v-if="playingTrack?.isOnPause"
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
import store from '~/store'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const { actions, getters } = store

    const setTrackOnPause = () => {
      actions.setTrackOnPause()
    }

    const continuePlay = () => {
      actions.continuePlay()
    }

    return {
      playingTrack: getters.playingTrack.value,
      setTrackOnPause,
      continuePlay
    }
  },
})
</script>
