<template>
  <Button
    v-if="isOnLoading"
    icon="spinner"
    size="small"
    isText
    className="trackrow__action"
  />
  <Button
    v-else-if="isPlaying && !isOnHover"
    icon="playing"
    size="small"
    isText
    className="trackrow__action"
    @mouseenter="isOnHover = true"
  />
  <Button
    v-else-if="isPaused || (isPlaying && isOnHover)"
    icon="pause"
    size="small"
    isText
    className="trackrow__action"
    @click="isPaused ? playFurther() : setOnPause()"
    @mouseleave="isOnHover = false"
  />
  <Button
    v-else
    icon="play"
    size="small"
    isText
    className="trackrow__action"
    @click="playTrack"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~shared/UI'

const isOnLoading = ref(false)
const isPlaying = ref(false)
const isPaused = ref(false)
const isOnHover = ref(false)

const setOnPause = () => {
  isPaused.value = true
  isPlaying.value = false
}

const playFurther = () => {
  isPaused.value = false
  isPlaying.value = true
}

const playTrack = () => {
  // TEMP:
  isOnLoading.value = true

  setTimeout(() => {
    isOnLoading.value = false
    isPlaying.value = true
  }, 3000)
}
</script>
