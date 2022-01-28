<template>
  <button
    class="player__youtube"
    @click="proceedToYouTube"
  >
    <AppSprite name="youtube" />
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
    const { playingTrack } = usePlayer()

    const proceedToYouTube = () => {
      const url = `https://www.youtube.com/results?search_query=${playingTrack.value.artistName} ${playingTrack.value.title}`.replaceAll(' ', '+')

      window.open(url)
    }

    return { proceedToYouTube }
  }
})

</script>

