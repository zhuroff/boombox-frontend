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
      isNextTrackExist: getters.isNextTrackExists,
      switchToNextTrack: actions.switchToNextTrack
    }
  },
})

</script>
