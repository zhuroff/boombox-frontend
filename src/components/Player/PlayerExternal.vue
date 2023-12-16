<template>
  <button
    class="player__youtube"
    @click="proceedToYouTube"
  >
    <Sprite name="youtube" />
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
    const { getters } = store

    const proceedToYouTube = () => {
      if (!getters.playingTrack.value) {
        throw new Error('No track is playing')
      }
      const { artistName, title } = getters.playingTrack.value
      const url = `https://www.youtube.com/results?search_query=${artistName} ${title}`.replaceAll(' ', '+')

      window.open(url)
    }

    return { proceedToYouTube }
  }
})

</script>
