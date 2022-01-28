<template>  
  <div class="player__sound">
    <div class="player__sound-range">
      <input
        type="range"
        :min="0"
        :max="1"
        :step="0.001"
        class="player__sound-input"
        @input="changeSoundVolume"
      />
    </div>

    <button
      :class="[{ '--muted' : isMuted }, 'player__sound_button']"
      @click="switchMuteState"
    >
      <AppSprite v-if="!isMuted" name="volume" />
      <AppSprite v-else name="volume-off" />
    </button>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import usePlayer from './usePlayer'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  setup() {
    const { store } = usePlayer()

    const isMuted = ref(false)

    const changeSoundVolume = (event: PointerEvent) => {
      store.commit('setSoundVolume', Number((event.target as HTMLInputElement).value))
    }

    const switchMuteState = () => {
      isMuted.value = !isMuted.value
      store.commit('switchMuteState')
    }

    return {
      isMuted,
      changeSoundVolume,
      switchMuteState
    }
  }
})

</script>

