<template>
  <div :class="[{ '--paused': isTrackPaused, '--playing': isTrackPlaying }, 'trackrow']">
    <div :class="[{ '--disabled': isTrackDisabled }, 'trackrow__container']">
      <Button
        icon="drag"
        size="small"
        isText
        className="trackrow__action --drag"
        :isDisabled="isTrackDisabled"
      />
      <div class="trackrow__cell --numeric">
        {{ order }}
      </div>
      <Button
        v-if="isTrackDisabled"
        icon="disable"
        size="small"
        isText
        className="trackrow__action"
        :isDisabled="isTrackDisabled"
      />
      <TrackPlayControl v-else />
      <div
        :title="track.title"
        class="trackrow__cell --title"
      >
        {{ track.title }}
      </div>
      <div class="trackrow__cell --numeric">
        {{ trackDuration }}
      </div>
      <Button
        icon="ellipsis-vertical"
        size="small"
        isText
        className="trackrow__action --options"
        @click="openCloseActions"
      />
    </div>
    <transition name="fade">
      <DropList
        v-if="isActionsOpen"
        ref="droplistRef"
        name=""
        query=""
        :data="trackOptions"
        @selectOption="applyAction"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import { Button, DropList } from '~shared/UI'
import TrackPlayControl from './TrackPlayControl.vue'
import type { SelectInputFieldSchema } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

type Props = {
  track: TrackBasic
  order: number
  isTOYTrack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isTOYTrack: false
})

const isActionsOpen = ref(false)
const isTrackDisabled = ref(false)
const isTrackInPlaylist = ref(false)
const isTrackPlaying = ref(false)
const isTrackPaused = ref(false)
const droplistRef = ref<InstanceType<typeof DropList> | null>(null)

const trackDuration = computed(() => {
  if (!props.track.duration) return '--/--'

  const minutes = Math.floor(props.track.duration / 60)
  const seconds = Math.floor(props.track.duration % 60)
  return `${minutes}:${seconds}`
})

const trackActions: Record<typeof trackOptions.value[number]['value'], () => void> = {
  getLyrics: () => console.log('getLyrics'),
  disableTrack: () => isTrackDisabled.value = !isTrackDisabled.value,
  toPlaylist: () => console.log('toPlaylist'),
  toCompilation: () => console.log('toCompilation')
}

const trackOptions = computed(() => (() => {
  const options = [
    { label: 'Get lyrics', value: 'getLyrics' }
  ]

  if (!isTrackPlaying.value) {
    options.push({
      label: isTrackDisabled.value ? 'Enable track' : 'Disable track',
      value: 'disableTrack'
    })
  }

  options.push({
    label: isTrackInPlaylist.value ? 'Remove from playlist' : 'Add to playlist',
    value: 'toPlaylist'
  })

  if (!props.isTOYTrack) {
    options.push({
      label: 'Add to compilation',
      value: 'toCompilation'
    })
  }

  return options
})())

const handleClickOutside = (event: MouseEvent) => {
  if (droplistRef.value?.$el && !droplistRef.value.$el.contains(event.target as Node)) {
    isActionsOpen.value = !isActionsOpen.value
  }
}

const applyAction = (action: SelectInputFieldSchema['options'][number]) => {
  isActionsOpen.value = !isActionsOpen.value
  trackActions[action.value]?.()
}

const openCloseActions = (event: MouseEvent) => {
  if (!document.querySelector('.droplist')) {
    event.stopPropagation()
    isActionsOpen.value = !isActionsOpen.value
  } else if (isActionsOpen.value) {
    isActionsOpen.value = false
  } else {
    setTimeout(() => {
      isActionsOpen.value = !isActionsOpen.value
    })
  }
}

watch(isActionsOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.trackrow {
  color: var.$black;
  position: relative;

  &__container {
    height: 3rem;
    display: flex;
    align-items: center;

    &:hover:not(.--disabled) {
      border-radius: var.$borderRadiusSM;
      background-color: var.$dark;
      color: var.$white;
      transition: all 0.1s var.$animation;
    }

    &.--disabled {

      & > *:not(.--options) {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }

  &__cell {
    line-height: 1;

    &.--numeric {
      text-align: right;
      white-space: nowrap;
      min-width: var.$elementHeightSM;
      flex: none;
    }

    &.--title {
      flex-grow: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: var.$basicPadding;
    }
  }

  &__action {
    width: var.$elementHeightSM;
    flex: none;

    @include var.media('<laptop') {
      padding: 0;
    }

    .icon {
      width: 18px;
      height: 18px;
      color: var.$paleDP;
      fill: var.$paleDP;
      transition: fill 0.2s ease;

      &.spinner {
        stroke: var.$black;
      }
    }

    &:hover {

      .icon {
        color: var.$white;
        fill: var.$white;
        transition: fill 0.2s ease;
      }
    }

    &.--drag {
      cursor: move;
    }
  }

  &.--playing {
    border-radius: var.$borderRadiusSM;
    background-color: var.$dark;
    color: var.$white;
  }

  &.--paused {
    background-color: var.$paleLW;
  }

  .droplist {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1000;
    width: auto;
  }
}
</style>