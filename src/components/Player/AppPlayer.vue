<template>
  
<section class="player">
  <div class="player__left">
    <div
      v-if="playingTrack.fileid"
      class="player__left-content"
    >
      <img
        :src="playingTrack.cover"
        :alt="playingTrack.title"
        class="player__cover"
      />
      <div class="player__title">
        <div class="player__title-track">{{ playingTrack.title }}</div>
        <div class="player__title-artist">
          {{ playingTrack.artistName }} ({{ playingTrack.albumName }}, {{ playingTrack.year }})
        </div>
      </div>
    </div>
  </div>
  <div class="player__right">
    <div
      v-if="playingTrack.fileid"
      class="player__right-content"
    >
      <AppPlayerRepeatTrack />
      <AppPlayerPrevTrack />
      <AppPlayerPlayPause />
      <AppPlayerNextTrack />
      <AppPlayerProgressBar />
      <AppPlayerCrackle />
      <AppPlayerSound />
      <AppPlayerExternal />
    </div>
  </div>
</section>

</template>

<script lang="ts">

import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import usePlayer from './usePlayer'
import AppPlayerRepeatTrack from './AppPlayerRepeatTrack.vue'
import AppPlayerPrevTrack from './AppPlayerPrevTrack.vue'
import AppPlayerNextTrack from './AppPlayerNextTrack.vue'
import AppPlayerPlayPause from './AppPlayerPlayPause.vue'
import AppPlayerProgressBar from './AppPlayerProgressBar.vue'
import AppPlayerCrackle from './AppPlayerCrackle.vue'
import AppPlayerSound from './AppPlayerSound.vue'
import AppPlayerExternal from './AppPlayerExternal.vue'

type PlayerKeyNav = 'Space' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

export default defineComponent({
  components: {
    AppPlayerRepeatTrack,
    AppPlayerPrevTrack,
    AppPlayerNextTrack,
    AppPlayerPlayPause,
    AppPlayerProgressBar,
    AppPlayerCrackle,
    AppPlayerSound,
    AppPlayerExternal
  },

  setup() {
    onMounted(() => keyboardNavHandler())

    onUnmounted(() => keyboardNavHandlerDestroy())

    const { playingTrack } = usePlayer()

    const playOrPause = () => {
      console.log('Play or pause!')
    }

    const switchToPrevTrack = () => {
      console.log('Play prev track!')
    }

    const switchToNextTrack = () => {
      console.log('Play next track!')
    }

    const volumeUp = () => {
      console.log('Volume up!')
    }

    const volumeDown = () => {
      console.log('Volume down!')
    }

    const keyboardPlayerKeys = reactive({
      Space: playOrPause,
      ArrowLeft: switchToPrevTrack,
      ArrowRight: switchToNextTrack,
      ArrowUp: volumeUp,
      ArrowDown: volumeDown
    })

    const keyboardNavHandler = () => {
      document.addEventListener('keyup', (event) => {
        const keyCode = event.code as PlayerKeyNav
        const inputTags = ['TEXTAREA', 'INPUT', 'BUTTON']
        const isInputTags = inputTags.includes((event.target as HTMLInputElement).tagName)

        if (keyboardPlayerKeys[keyCode] && !isInputTags && playingTrack.value.fileid) {
          keyboardPlayerKeys[keyCode]()
        }
      })
    }

    const keyboardNavHandlerDestroy = () => {
      document.removeEventListener('keyup', keyboardNavHandler, false)
    }

    return { playingTrack }
  }
})

</script>
