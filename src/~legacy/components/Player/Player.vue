<template>
  <section :class="[{ '--expanded': isPlayerExpanded }, 'player']">
    Player
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

type PlayerKeyNav = 'Space' | 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'

const {
  playerGetters: {
    playingTrack,
    isPlayerExpanded
  },
  playerActions: {
    continuePlay,
    setTrackOnPause,
    switchToPrevTrack,
    switchToNextTrack,
  }
} = usePlaylist()

const playOrPause = () => {
  if (playingTrack.value?.isOnPause) {
    continuePlay()
  } else {
    setTrackOnPause()
  }
}

const volumeUp = () => {
  console.log('Volume up!')
}

const volumeDown = () => {
  console.log('Volume down!')
}

const keyboardPlayerKeys = {
  Space: playOrPause,
  ArrowLeft: switchToPrevTrack,
  ArrowRight: switchToNextTrack,
  ArrowUp: volumeUp,
  ArrowDown: volumeDown
}

const keyboardNavHandler = (event: KeyboardEvent) => {
  const keyCode = event.code as PlayerKeyNav
  const inputTags = ['TEXTAREA', 'INPUT', 'BUTTON']
  const isInputTags = inputTags.includes((event.target as HTMLInputElement).tagName)

  if (keyboardPlayerKeys[keyCode] && !isInputTags && playingTrack.value?._id) {
    keyboardPlayerKeys[keyCode]()
  }
}

onMounted(() => {
  document.addEventListener('keyup', keyboardNavHandler)
})

onUnmounted(() => {
  document.removeEventListener('keyup', keyboardNavHandler)
})
</script>