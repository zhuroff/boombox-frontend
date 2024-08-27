<template>
  <div class="tracklist__row-cell --pointer --play">
    <Button
      v-if="isOnLoading"
      icon="spinner"
      size="small"
      isText
      className="tracklist__row-action"
    />
    <Button
      v-else-if="isPlaying"
      icon="playing"
      size="small"
      isText
      className="tracklist__row-action"
      @click="pauseTrack"
    />
    <Button
      v-else-if="isPaused"
      icon="pause"
      size="small"
      isText
      className="tracklist__row-action"
      @click="playFurther"
    />
    <Button
      v-else
      icon="play"
      size="small"
      isText
      className="tracklist__row-action"
      :title="title"
      @click="playAudio"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import usePlaylist from '~/store/playlist'
import usePlayingTrack from '~/store/track'
import AlbumTrack from '~/classes/AlbumTrack'
import Button from '~/components/Button.vue'

interface Props {
  track: AlbumTrack
  title?: string
  isSearched?: boolean
  isTOY: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  isSearched: false
})

const {
  playerGetters: { currentPlaylistTracks },
  playerActions: { appendTrackToPlaylist, togglePlayerVisibility }
} = usePlaylist()

const {
  trackGetters: { playingTrack },
  trackActions: { playTrack, continuePlay, setTrackOnPause }
} = usePlayingTrack()

const isPlaying = computed(() => (
  playingTrack.value?._id === props.track._id &&
  !playingTrack.value.isOnPause &&
  !playingTrack.value.isOnLoading
))

const isPaused = computed(() => (
  playingTrack.value?._id === props.track._id &&
  playingTrack.value.isOnPause
))

const isOnLoading = computed(() => (
  playingTrack.value?._id === props.track._id &&
  playingTrack.value.isOnLoading
))

const playAudio = () => {
  if (props.isSearched) {
    const index = currentPlaylistTracks.value.findIndex(
      (track) => track._id === playingTrack.value?._id
    )

    appendTrackToPlaylist({
      order: index !== -1 ? index : 0,
      // @ts-expect-error: fix
      track: props.track
    })
  }

  // @ts-expect-error: fix
  playTrack(props.track)
  togglePlayerVisibility()
}

const pauseTrack = () => {
  setTrackOnPause()
}

const playFurther = () => {
  continuePlay()
}
</script>

<style lang="scss">
@import '~/scss/variables';

.tracklist__row {

  &-cell {
    
    &.--play {

      .button {
        width: 30px;
        padding: 0;

        .icon {
          width: 1.2rem;
        }
      }
    }
  }
}
</style>
