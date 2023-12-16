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

import { defineComponent } from 'vue'
import store from '~/store'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const { actions, getters } = store

    return {
      isPrevTrackExist: getters.isPrevTrackExists,
      switchToPrevTrack: actions.switchToPrevTrack
    }
  },
})

</script>
