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
import usePlayer from './usePlayer'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const { playingTrack } = usePlayer()

    const proceedToYouTube = () => {
      const url = `https://www.youtube.com/results?search_query=${playingTrack.value.artistName} ${playingTrack.value.title}`.replaceAll(' ', '+')

      window.open(url)
    }

    return { proceedToYouTube }
  }
})

</script>

