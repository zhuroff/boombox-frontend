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
      @click="switchMuteState"
    >
      <Sprite v-if="!isMuted" name="volume" />
      <Sprite v-else name="volume-off" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import store from '~/store'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
  },

  setup() {
    const { actions } = store
    const volume = ref(Number(localStorage.getItem('playerVolume')) || 1)
    const isMuted = ref(false)

    const changeSoundVolume = (event: Event) => {
      actions.setSoundVolume(Number((event.target as HTMLInputElement).value))
    }

    const switchMuteState = () => {
      isMuted.value = !isMuted.value
      actions.switchMuteState()
    }

    return {
      volume,
      isMuted,
      changeSoundVolume,
      switchMuteState
    }
  }
})
</script>
