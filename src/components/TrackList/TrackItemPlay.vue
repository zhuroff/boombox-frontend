<template>

<div
  v-if="isOnPlay"
  class="tracklist__row_cell --pointer --fix"
  @click="pauseTrack"
>
  <AppSprite name="pause" />
</div>
  
<div
  v-else
  :class="[{ '--disabled' : loadingTrack === fileid }, 'tracklist__row_cell --pointer --fix']"
  @click="playTrack"
>
  <AppSprite v-if="loadingTrack === fileid" name="spinner" />
  <AppSprite v-else name="play" />
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

    index: {
      type: Number,
      required: true
    }
  },

  setup(props, { emit }) {
    const store = useStore(key)
    const loadingTrack = computed(() => store.getters.loadingTrack)

    const isOnPlay = computed(() => (
      // store.getters.playingTrack.fileid === props.fileid
      // && !store.getters.playingTrack.isOnPause
      // && !loadingTrack.value
      false
    ))

    const isOnPause = computed(() => (
      // store.getters.playingTrack.isOnPause
      false
    ))

    const pauseTrack = (value = true) => {
      store.commit('setPauseState', value)
    }

    const playTrack = () => {
      console.log('play track')
      // if (props.fileid === store.getters.playingTrack.fileid) {
      //   pauseTrack(false)
      // } else {
      //   emit('playTrack')
      // }
    }

    return {
      loadingTrack,
      isOnPlay,
      isOnPause,
      pauseTrack,
      playTrack
    }
  }
})

</script>

<style lang="scss" scoped>

@import '~/scss/variables';

.tracklist__row {

  &_cell {

    &:hover {

      .icon-play,
      .icon-pause,
      .icon-spinner {
        fill: $dark;
        transition: fill 0.2s ease;
      }
    }
  }

  &.--playing {

    .icon-play,
    .icon-pause,
    .icon-spinner {
      fill: $dark;
    }
  }

  .icon-play,
  .icon-pause,
  .icon-spinner  {
    width: 18px;
    height: 18px;
    fill: $pale;
    transition: fill 0.2s ease;
  }

  .icon-spinner {
    animation: rotating 1s linear infinite
  }
}

</style>
