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
      @click="playTrack"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import store from '~/store'
import AlbumTrack from '~/classes/AlbumTrack'
import Button from '~/components/Button.vue'

export default defineComponent({
  name: 'TrackItemPlay',
  components: {
    Button,
  },
  props: {
    track: {
      type: Object as PropType<AlbumTrack>,
      required: true
    },
    title: {
      type: String,
      required: false
    },
    isSearched: {
      type: Boolean,
      required: false,
      default: false
    },
    isTOY: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const { actions, getters } = store

    const isPlaying = computed(() => (
      getters.playingTrack.value?._id === props.track._id &&
      !getters.playingTrack.value.isOnPause &&
      !getters.playingTrack.value.isOnLoading
    ))

    const isPaused = computed(() => (
      getters.playingTrack.value?._id === props.track._id &&
      getters.playingTrack.value.isOnPause
    ))

    const isOnLoading = computed(() => (
      getters.playingTrack.value?._id === props.track._id &&
      getters.playingTrack.value.isOnLoading
    ))

    const playTrack = () => {
      if (props.isSearched) {
        const index = getters.currentPlaylistTracks.value.findIndex(
          (track) => track._id === getters.playingTrack.value?._id
        )

        actions.addTrackToPlaylist({
          order: index !== -1 ? index : 0,
          track: props.track
        })
      }

      actions.playTrack(props.track, props.isTOY ? 'TOY' : undefined)
      actions.togglePlayerVisibility()
    }

    const pauseTrack = () => {
      actions.setTrackOnPause()
    }

    const playFurther = () => {
      actions.continuePlay()
    }

    return {
      isPlaying,
      isPaused,
      isOnLoading,
      playTrack,
      pauseTrack,
      playFurther
    }
  }
})
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
