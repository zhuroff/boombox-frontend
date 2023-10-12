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
import usePlayer from '~/hooks/usePlayer'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const {
      isNextTrackExist,
      switchToNextTrack
    } = usePlayer()    

    return {
      isNextTrackExist,
      switchToNextTrack
    }
  },
})

</script>

../../hooks/usePlayer