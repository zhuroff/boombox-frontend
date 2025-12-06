<template>
  <div
    :class="trackRowClassList"
    @click="trackRowActionHandler"
  >
    <div :class="[{ '--disabled': track?.idDisabled }, 'trackrow__container']">
      <Button
        v-if="!isMobile"
        icon="drag"
        size="small"
        isText
        className="trackrow__action --drag"
        :isDisabled="track?.idDisabled"
      />
      <div class="trackrow__cell --numeric">
        {{ order }}
      </div>
      <Button
        v-if="track?.idDisabled"
        icon="disable"
        size="small"
        isText
        className="trackrow__action"
        :isDisabled="track?.idDisabled"
      />
      <TrackPlayControl
        v-else
        :track="track"
      />
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
  <transition name="fade">
    <Modal
      v-if="isLyricsModalActive"
      :isModalActive="isLyricsModalActive"
      @closeModal="toggleLyricsModal"
    >
      <TrackLyrics
        :heading="trackArtistAndTitle"
        :possibleToSave="!isTOYTrack"
        :track="track"
      />
    </Modal>
  </transition>
  <transition name="fade">
    <Modal
      :isModalActive="isCompilationsModalEnabled"
      @closeModal="isCompilationsModalEnabled = false"
    >
      <Gathering
        :entityID="track._id"
        :isFetching="isGatheringFetching"
        :gatherings="compilations"
        inputPlaceholder="compilations.namePlaceholder"
        placeholderImage="/img/album.webp"
        @onSelectGathering="(payload) => selectCompilation(payload).then(() => emit('refetchTracklist'))"
        @onCreateGathering="createCompilation"
      />
    </Modal>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import { usePlayer } from '~features/player'
import { useCompilations } from '~features/compilation'
import { usePlaylistService, type PlaylistTrack } from '~features/player'
import { useLocalization, useDevice } from '~shared/model'
import { Button, DropList, Modal } from '~shared/UI'
import { DatabaseService } from '~shared/api'
import { Gathering } from '~widgets/gathering'
import TrackPlayControl from './TrackPlayControl.vue'
import TrackLyrics from './TrackLyrics.vue'
import type { SelectInputFieldSchema } from '~shared/lib'

type Props = {
  track: PlaylistTrack
  order: number
  isTOYTrack?: boolean
}

type Emits = {
  (e: 'refetchTracklist'): void
}

const props = withDefaults(defineProps<Props>(), {
  isTOYTrack: false
})

const emit = defineEmits<Emits>()

const dbService = new DatabaseService()

const { isMobile } = useDevice()
const { localize } = useLocalization()
const { playingTrack, playingTrackIndex, playTrack, playPauseTrack } = usePlayer()
const { toggleTrackAvailability, isTrackInPlaylist, addTrackToPlaylist } = usePlaylistService()

const isActionsOpen = ref(false)
const isLyricsModalActive = ref(false)
const droplistRef = ref<InstanceType<typeof DropList> | null>(null)

const {
  compilations,
  selectCompilation,
  createCompilation,
  isGatheringFetching,
  isCompilationsModalEnabled
} = useCompilations(props.track, dbService)

const trackRowClassList = computed(() => [
  'trackrow',
  {
    '--paused': playingTrack.value?._id === props.track._id && playingTrack.value?.isOnPause,
    '--playing': playingTrack.value?._id === props.track._id && !playingTrack.value?.isOnPause
  }
])

const trackDuration = computed(() => {
  if (!props.track.duration) return '--/--'

  const minutes = Math.floor(props.track.duration / 60)
  const seconds = Math.floor(props.track.duration % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})

const trackRowActionHandler = () => {
  if (props.track.idDisabled) return
  playingTrack.value && playingTrack.value._id === props.track._id
    ? playPauseTrack()
    : playTrack(props.track)
}

const toggleLyricsModal = () => {
  isLyricsModalActive.value = !isLyricsModalActive.value
}

const showCompilationModal = () => {
  isCompilationsModalEnabled.value = true
}

const trackActions: Record<typeof trackOptions.value[number]['value'], () => void> = {
  getLyrics: toggleLyricsModal,
  toCompilation: showCompilationModal,
  disableTrack: () => toggleTrackAvailability(props.track),
  playNext: () => addTrackToPlaylist(props.track, playingTrackIndex.value),
  toPlaylist: () => addTrackToPlaylist(props.track)
}

const trackOptions = computed(() => (() => {
  const options = [
    {
      label: localize('trackActions.getLyrics'),
      value: 'getLyrics'
    }
  ]

  if (playingTrack.value?._id !== props.track._id) {
    options.push({
      label: localize(props.track?.idDisabled ? 'trackActions.enableTrack' : 'trackActions.disableTrack'),
      value: 'disableTrack'
    })

    if (!isTrackInPlaylist(props.track._id)) {
      options.push({
        label: localize('trackActions.toPlaylist'),
        value: 'toPlaylist'
      })

      if (playingTrack.value?._id) {
        options.push({
          label: localize('trackActions.playNext'),
          value: 'playNext'
        })
      }
    }
  }

  if (!props.isTOYTrack) {
    options.push({
      label: localize('trackActions.toCompilation'),
      value: 'toCompilation'
    })
  }

  return options
})())

const trackArtistAndTitle = computed(() => (
  props.isTOYTrack
    ? props.track.title
    : `${props.track.artist.title} - ${props.track.title}`
))

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
  position: relative;
  cursor: pointer;

  @include var.media('<desktop') {
    color: var.$paleLT;
  }

  @include var.media('>=desktop') {
    color: var.$black;
  }

  &__container {
    height: 3rem;
    display: flex;
    align-items: center;

    &:hover:not(.--disabled) {
      @include var.media('>=desktop') {
        border-radius: var.$borderRadiusSM;
        background-color: var.$dark;
        color: var.$white;
        transition: all 0.1s var.$animation;
      }
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

    @include var.media('<desktop') {
      padding: 0;
    }

    .icon {
      width: 18px;
      height: 18px;
      color: var.$paleDP;
      fill: var.$paleDP;
      transition: fill 0.2s ease;

      &.spinner {
        stroke: var.$white;
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
    background-color: var.$dark;
    color: var.$white;

    @include var.media('>=desktop') {
      border-radius: var.$borderRadiusSM;
    }
  }

  &.--paused {

    .trackrow__container {
      background-color: var.$paleDP;
      border-radius: var.$borderRadiusSM;
      color: var.$white;
    }

    .icon {
      color: var.$white;
      fill: var.$white;
    }
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