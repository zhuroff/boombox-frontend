<template>

<div
  v-if="isOnPlay"
  class="tracklist__row_cell --pointer --fix"
  @click="pauseTrack"
>
  <AppSprite name="playing" />
</div>
  
<div
  v-else
  :class="[{ '--disabled' : isOnLoading }, 'tracklist__row_cell --pointer --fix']"
  @click="playTrack"
>
  <AppSprite v-if="isOnLoading" name="spinner" />
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

    albumID: {
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

    const pauseTrack = (value = true) => {
      store.commit('setPauseState', value)
    }

    const playTrack = () => {
      store.dispatch('playTrack', props.fileid)
      store.dispatch('incrementListeningCounter', {
        albumID: props.albumID,
        fileID: props.fileid
      })
      // store.dispatch('playTrack', { ...payload, playlist: props.album })
      
      // if (props.fileid === store.getters.playingTrack.fileid) {
      //   pauseTrack(false)
      // } else {
      //   emit('playTrack')
      // }
      
      // const payload = {
      //   order: props.track.order || props.index,
      //   fileid: props.track.fileid,
      //   link: props.track.link,
      //   duration: props.track.duration
      // }
    }

    return {
      isOnPlay,
      isOnPause,
      isOnLoading,
      pauseTrack,
      playTrack
    }
  }
})

</script>
