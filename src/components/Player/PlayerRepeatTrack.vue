<template>  
  <button
    :class="[{ '--mobile' : isMobile }, 'player__repeat']"
    @click="changeRepeatState"
  >
    <Sprite
      v-if="!playingTrack?.isOnRepeat"
      name="repeat"
    />
    <Sprite
      v-else
      name="repeat-active"
    />
  </button>
</template>

<script setup lang="ts">
import usePlaylist from '~/store/playlist'
import Sprite from '~/components/Sprite/Sprite.vue'

interface Props {
  isMobile?: boolean
}

defineProps<Props>()

const {
  playerGetters: { playingTrack },
  playerActions: { changeRepeatState }
} = usePlaylist()
</script>
