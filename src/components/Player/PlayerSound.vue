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
      <Sprite v-if="!isMuted" name="volume" />
      <Sprite v-else name="volume-off" />
    </button>
  </div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue'
import usePlayer from '~/hooks/usePlayer'
import Sprite from '~/components/Sprite/Sprite.vue'

export default defineComponent({
  components: {
    Sprite
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

../../hooks/usePlayer