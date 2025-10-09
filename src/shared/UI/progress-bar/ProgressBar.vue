<template>
  <div class="player__progress">
    <time
      v-if="isLeftTimeVisible"
      class="player__progress-time"
    >
      {{ leftTimeInMinutes }}
    </time>
    <progress
      :max="1"
      :value="progressLine || 0"
      class="player__progress-bar"
      @click="setProgressValue"
    />
    <time
      v-if="isFullTimeVisible"
      class="player__progress-time"
    >
      {{ fullTimeInMinutes }}
    </time>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Props = {
  isLeftTimeVisible: boolean
  isFullTimeVisible: boolean
  progressTime: number
  progressLine: number
  duration: number
}

const emit = defineEmits<{
  (e: 'setTrackPosition', value: number): void
}>()

const props = defineProps<Props>()

const leftTimeInMinutes = computed(() => {
  const minutes = Math.floor(props.progressTime / 60)
  const seconds = Math.floor(props.progressTime - minutes * 60)

  if (Number.isNaN(minutes)) return '0:00'

  return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
})

const fullTimeInMinutes = computed(() => {
  const minutes = Math.floor(Number(props.duration) / 60)
  const seconds = Math.floor(Number(props.duration) - minutes * 60)

  if (Number.isNaN(minutes)) return '0:00'

  return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
})

const setProgressValue = (event: MouseEvent) => {
  const value = event.offsetX / (event.target as HTMLElement).offsetWidth
  emit('setTrackPosition', value)
}
</script>

<style lang="scss">
@use '~app/styles/variables' as var;

.player__progress {
  display: flex;
  align-items: center;

  @include var.media('<desktop') {
    padding: var.$basicPadding 25px;
    width: 100vw;
  }

  &-bar {
    appearance: none;
    background-color: var.$white;
    cursor: pointer;
    margin: 0 var.$basicPadding;
    border: 0;
    border-radius: var.$basicPadding;

    @include var.media('<desktop') {
      flex: 1 1 0;
      height: 5px;
    }

    @include var.media('>=desktop') {
      width: 326px;
      height: var.$basicPadding;
    }

    &::-webkit-progress-bar {
      border: 0;
      border-radius: var.$basicPadding;

      @include var.media('<desktop') {
        height: 5px;
      }

      @include var.media('>=desktop') {
        height: var.$basicPadding;
      }
    }

    &::-webkit-progress-value {
      background-color: var.$accent;
      border-radius: 5px;
    }
  }

  &-time {
    color: var.$white;
    opacity: 0.5;
    font-size: 12px;
    position: relative;
    top: -1px;
  }
}
</style>
