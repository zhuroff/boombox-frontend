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

      <!-- <div class="player__sound">
        <div
          class="player__sound_range"
          @mousewheel="changeSoundVolumeMouse"
        >
          <div class="player__sound_range-wrapper">
            <input
              type="range"
              :min="0"
              :max="1"
              :step="0.001"
              @input="changeSoundVolume"
            />
          </div>
        </div>

        <button
          :class="[{ '--disabled' : isSoundOff }, 'player__sound_button']"
          @click="soundOnOff"
        >
          <AppSprite name="sound" />
        </button>
      </div>

      <button
        v-if="playingTrack.artist"
        class="player__youtube"
        @click.prevent="proceedToYouTube"
      >
        <AppSprite name="youtube" />
      </button> -->
    </div>
  </div>
</section>

</template>

<script lang="ts">

import { defineComponent } from 'vue'
import usePlayer from './usePlayer'
import AppSprite from '~/components/AppSprite.vue'
import AppPlayerRepeatTrack from './AppPlayerRepeatTrack.vue'
import AppPlayerPrevTrack from './AppPlayerPrevTrack.vue'
import AppPlayerNextTrack from './AppPlayerNextTrack.vue'
import AppPlayerPlayPause from './AppPlayerPlayPause.vue'
import AppPlayerProgressBar from './AppPlayerProgressBar.vue'
import AppPlayerCrackle from './AppPlayerCrackle.vue'

export default defineComponent({
  components: {
    AppSprite,
    AppPlayerRepeatTrack,
    AppPlayerPrevTrack,
    AppPlayerNextTrack,
    AppPlayerPlayPause,
    AppPlayerProgressBar,
    AppPlayerCrackle
  },

  setup() {
    const { playingTrack } = usePlayer()

    // const isSoundOff = computed(() => store.getters.isSoundOff)

    // const soundOnOff = () => {
    //   store.commit('soundOnOff')
    // }

    // const proceedToYouTube = () => {
    //   const targetTrack = store.getters.playingTrack
    //   const query = `https://www.youtube.com/results?search_query=${targetTrack.artist} ${targetTrack.title}`
      
    //   window.open(query)
    // }

    // const changeSoundVolume = (event: any) => {
    //   console.log(event)
    //   // store.commit('setSoundVolume', Number(event.target.value))
    // }

    // const changeSoundVolumeMouse = () => {
    //   console.log('Mouse scroll')
    // }

    return {
      playingTrack
    }
  }
})

</script>
