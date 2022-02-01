<template>

<div
  v-if="isOnPlay"
  class="tracklist__row_cell --pointer --fix"
>
  <button
    class="tracklist__row_action"
    @click="pauseTrack"
  >
    <AppSprite name="playing" />
  </button>
</div>
  
<div
  v-else
  :class="[{ '--disabled' : isOnLoading }, 'tracklist__row_cell --pointer --fix']"
>
  <button
    class="tracklist__row_action"
    @click="playingStateSplitter"
  >
    <AppSprite v-if="isOnLoading" name="spinner" />
    <AppSprite v-else-if="isOnPause" name="pause" />
    <AppSprite v-else name="play" />
  </button>
</div>

</template>

<script lang="ts">

import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '~/store'
import AppSprite from '~/components/AppSprite.vue'

export default defineComponent({
  components: {
    AppSprite
  },

  props: {
    fileid: {
      type: Number,
      required: true
    },

    trackid: {
      type: String,
      required: true
    },

    index: {
      type: Number,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)

    const isOnPlay = computed(() => (
      store.getters.playingTrack.fileid === props.fileid
      && !store.getters.playingTrack.isOnPause
      && !store.getters.playingTrack.isOnLoading
    ))

    const isOnPause = computed(() => (
      store.getters.playingTrack.fileid === props.fileid
      && store.getters.playingTrack.isOnPause
    ))

    const isOnLoading = computed(() => (
      store.getters.playingTrack.fileid === props.fileid
      && store.getters.playingTrack.isOnLoading
    ))

    const pauseTrack = () => {
      store.commit('setTrackOnPause')
    }

    const playTrack = () => {
      store.dispatch('playTrack', props.fileid)
    }

    const playingStateSplitter = () => {
      if (store.getters.playingTrack.fileid === 0) {
        playTrack()
      } else if (store.getters.playingTrack.fileid === props.fileid) {
        if (!store.getters.playingTrack.isOnPause) {
          playTrack()
        } else {
          store.commit('continuePlay')
        }
      } else {
        playTrack()
      }
    }

    return {
      isOnPlay,
      isOnPause,
      isOnLoading,
      pauseTrack,
      playingStateSplitter
    }
  }
})

</script>
