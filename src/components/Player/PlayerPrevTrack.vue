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
import usePlayer from '~/hooks/usePlayer'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const {
      isPrevTrackExist,
      switchToPrevTrack
    } = usePlayer()    

    return {
      isPrevTrackExist,
      switchToPrevTrack
    }
  },
})

</script>

../../hooks/usePlayer