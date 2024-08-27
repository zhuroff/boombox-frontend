<template>
  <button
    class="player__youtube"
    @click="proceedToYouTube"
  >
    <Sprite name="youtube" />
  </button>
</template>

<script setup lang="ts">
import usePlayingTrack from '~/store/track'
import Sprite from '~/components/Sprite/Sprite.vue'

const {
  trackGetters: { playingTrack }
} = usePlayingTrack()

const proceedToYouTube = () => {
  if (!playingTrack.value) {
    throw new Error('No track is playing')
  }
  const { artistName, title } = playingTrack.value
  const url = `https://www.youtube.com/results?search_query=${artistName} ${title}`.replaceAll(' ', '+')

  window.open(url)
}
</script>
