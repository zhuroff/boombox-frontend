<template>  
  <div class="player__sound">
    <div class="player__sound-range">
      <input
        type="range"
        :min="0"
        :max="1"
        :step="0.001"
        :value="volume"
        class="player__sound-input"
        @input="changeSoundVolume"
      />
    </div>
    <button
      :class="[{ '--muted' : isMuted }, 'player__sound_button']"
      @click="toggleMuteState"
    >
      <Sprite v-if="!isMuted" name="volume" />
      <Sprite v-else name="volume-off" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import usePlayingTrack from '~/store/track'
import Sprite from '~/components/Sprite/Sprite.vue'

const {
  trackActions: { setSoundVolume, switchMuteState }
} = usePlayingTrack()

const volume = ref(Number(localStorage.getItem('playerVolume')) || 1)
const isMuted = ref(false)

const changeSoundVolume = (event: Event) => {
  setSoundVolume(Number((event.target as HTMLInputElement).value))
}

const toggleMuteState = () => {
  isMuted.value = !isMuted.value
  switchMuteState()
}
</script>
