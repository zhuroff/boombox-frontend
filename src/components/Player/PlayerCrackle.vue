<template>  
  <button
    :class="[{ '--active' : isCrackled }, 'player__crackle']"
    @click="toggleCrackle"
  >
    <Sprite name="vinyl" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import usePlaylist from '~/store/playlist'
import Sprite from '~/components/Sprite/Sprite.vue'

const {
  playerActions: { crackleSwitch }
} = usePlaylist()

const isCrackled = ref(false)

const toggleCrackle = () => {
  crackleSwitch()
  isCrackled.value = !isCrackled.value
}
</script>
