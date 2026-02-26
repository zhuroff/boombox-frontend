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
        v-if="trackOptionsMenu === track._id"
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
import { ref, computed } from 'vue'
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
  trackOptionsMenu: string | null
}

type Emits = {
  (e: 'refetchTracklist'): void
  (e: 'setTrackOptionsMenu', trackId: string | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const dbService = new DatabaseService()

const { isMobile } = useDevice()
const { localize } = useLocalization()
const { playingTrack, playingTrackIndex, playTrack, playPauseTrack } = usePlayer()
const { toggleTrackAvailability, isTrackInPlaylist, addTrackToPlaylist } = usePlaylistService()

const isLyricsModalActive = ref(false)

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

const trackRowActionHandler = (e: MouseEvent) => {
  e.stopPropagation()

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

  options.push({
    label: localize('trackActions.toCompilation'),
    value: 'toCompilation'
  })

  return options
})())

const trackArtistAndTitle = computed(() => (
  `${props.track.artist.title} - ${props.track.title}`
))

const applyAction = (action: SelectInputFieldSchema['options'][number]) => {
  trackActions[action.value]?.()
  emit('setTrackOptionsMenu', null)
}

const openCloseActions = (e: MouseEvent) => {
  e.stopPropagation()
  emit('setTrackOptionsMenu', props.track._id)
}
</script>

<style lang="scss">
@use '~/app/styles/variables' as var;

.trackrow {
  position: relative;
  cursor: pointer;

  @include var.media('<desktop') {
    color: var.$light;
  }

  @include var.media('>=desktop') {
    color: var.$dark;
    transition: all 0.1s var.$animation;
  }

  &__container {
    height: 3rem;
    display: flex;
    align-items: center;
    position: relative;

    &:hover:not(.--disabled) {
      @include var.media('>=desktop') {
        .trackrow__cell.--title {
          color: var.$accent;
          transition: color 0.2s var.$animation;
        }
      }
    }

    &.--disabled {

      & > *:not(.--options) {
        opacity: 0.5;
        pointer-events: none;
      }
    }
    
    @include var.media('>=desktop') {
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8), 0 -1px 0 rgba(0, 0, 0, 0.15);
      }
    }
  }

  &:first-child {
    @include var.media('>=desktop') {
      .trackrow__container {
        &:before {
          content: '';
          position: absolute;
          top: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          z-index: 1;
          background-color: var.$light;
        }
      }
    }
  }

  &:last-child {
    @include var.media('>=desktop') {
      .trackrow__container {
        &:before {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          z-index: 10;
          background-color: var.$light;
        }
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

      @include var.media('<desktop') {
        font-size: 0.875rem;
      }
    }

    &.--title {
      flex-grow: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: var.$basicPadding;

      @include var.media('<desktop') {
        font-size: 0.875rem;
      }
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
        stroke: var.$light;
      }
    }

    &:hover {

      .icon {
        color: var.$accent;
        fill: var.$accent;
        transition: fill 0.2s ease;
      }
    }

    &.--drag {
      cursor: move;
    }
  }

  &.--playing,
  &.--paused {
    @include var.media('<desktop') {
      color: var.$accent;
    }

    @include var.media('>=desktop') {
      box-shadow: var.$shadowMedium;
      padding-top: var.$fieldPadding;
      padding-bottom: var.$fieldPadding;
      transition: all 0.1s var.$animation;
    }

    .trackrow {

      &__container {
        &:after {
          content: none;
        }
      }
    }
  }

  .droplist {
    position: absolute;
    top: 100%;
    right: var.$fieldPadding;
    z-index: 1000;
    width: auto;
  }
}
</style>