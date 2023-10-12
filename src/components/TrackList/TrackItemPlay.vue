<template>
  <div class="tracklist__row-cell --pointer --fix">
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
      @click="playTrack"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { AlbumTrackDTO } from '~/dto/AlbumTrackDTO'
import usePlayer from '~/hooks/usePlayer'
import Button from '~/components/Button.vue'

export default defineComponent({
  components: {
    Button,
  },

  props: {
    track: {
      type: Object as PropType<AlbumTrackDTO>,
      required: true
    },

    index: {
      type: Number,
      required: true
    },
  },

  setup(props) {
    const { playingTrack, store } = usePlayer()

    const isPlaying = computed(() => (
      playingTrack.value._id === props.track._id &&
      !playingTrack.value.isOnPause &&
      !playingTrack.value.isOnLoading
    ))

    const isPaused = computed(() => (
      playingTrack.value._id === props.track._id &&
      playingTrack.value.isOnPause
    ))

    const isOnLoading = computed(() => (
      playingTrack.value._id === props.track._id &&
      playingTrack.value.isOnLoading
    ))

    const playTrack = () => {
      store.dispatch('playTrack', props.track)
      store.commit('expandPlayer')
    }

    const pauseTrack = () => {
      store.commit('setTrackOnPause')
    }

    const playFurther = () => {
      store.commit('continuePlay')
    }

    return {
      isPlaying,
      isPaused,
      isOnLoading,
      playTrack,
      pauseTrack,
      playFurther,
      playingTrack
    }
  }
})
</script>
