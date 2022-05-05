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
          {{ playingTrack.artistName }} <br> ({{ playingTrack.albumName }}, {{ playingTrack.year }})
        </div>
      </div>
    </div>
  </div>
  <div class="player__right">
    <div
      v-if="playingTrack.fileid"
      class="player__right-content"
    >
      <PlayerRepeatTrack />
      <PlayerPrevTrack />
      <PlayerPlayPause />
      <PlayerNextTrack />
      <PlayerProgressBar />
      <PlayerRepeatTrack isMobile />
      <PlayerCrackle />
      <PlayerSound />
      <PlayerExternal />
    </div>
  </div>
</section>

</template>

<script lang="ts">

import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import usePlayer from './usePlayer'
import PlayerRepeatTrack from './PlayerRepeatTrack.vue'
import PlayerPrevTrack from './PlayerPrevTrack.vue'
import PlayerNextTrack from './PlayerNextTrack.vue'
import PlayerPlayPause from './PlayerPlayPause.vue'
import PlayerProgressBar from './PlayerProgressBar.vue'
import PlayerCrackle from './PlayerCrackle.vue'
import PlayerSound from './PlayerSound.vue'
import PlayerExternal from './PlayerExternal.vue'
import './Player.scss'

type PlayerKeyNav = 'Space' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

export default defineComponent({
  components: {
    PlayerRepeatTrack,
    PlayerPrevTrack,
    PlayerNextTrack,
    PlayerPlayPause,
    PlayerProgressBar,
    PlayerCrackle,
    PlayerSound,
    PlayerExternal
  },

  setup() {
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

    onMounted(() => keyboardNavHandler())

    onUnmounted(() => keyboardNavHandlerDestroy())

    return { playingTrack }
  }
})

</script>
