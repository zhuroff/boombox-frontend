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
import { Sprite } from '~shared/UI'

const {
  playerActions: { crackleSwitch }
} = usePlaylist()

const isCrackled = ref(false)

const toggleCrackle = () => {
  crackleSwitch()
  isCrackled.value = !isCrackled.value
}
</script>
