<template>
  <section class="section">
    <transition name="fade">
      <Preloader
        v-if="!playlist.isFetched"
        mode="light"
      />
    </transition>

    <transition-group name="flyUp">
      <ul
        key="videos"
        class="cardlist --yt"
        v-if="tracks"
      >
        <li
          v-for="id in tracks"
          :key="id"
          class="card__youtube"
        >
          <div v-html="`<div id='${id}'></div>`"></div>
        </li>
      </ul>

      <Button
        key="button"
        v-if="tracks?.length < totalTracks"
        text="Load more"
        isFullWidth
        @click="nextPageLoad"
      />
    </transition-group>
  </section>
</template>

<script lang="ts">

import { defineComponent, ref, nextTick, onMounted, reactive } from 'vue'
import YouTubeServices from '~/services/YouTubeServices'
import Preloader from '~/components/Preloader.vue'
import Button from '~/components/Button/Button.vue'
import { YTPlaylistResponse, YTPlaylistResponseItem } from '~/types/YouTube'

export default defineComponent({
  components: {
    Preloader,
    Button
  },

  setup() {
    const perPage = ref(10)
    const totalTracks = ref(0)
    const tracks = ref<string[]>([])
    const playlingTrack = ref(null)
    const nextPage = ref<string | null>(null)
    const awaitNextPage = ref(null)

    const playlist = reactive({
      isFetched: false,
      data: [] as any[]
    })

    const nextPageLoad = () => fetchPlaylist()

    const playNextTrack = (finished: any) => {
      const finishedTrackID = finished
      const finishedTrackIndex = tracks.value.findIndex((el: any) => el === finishedTrackID)
      const nextTrackID = tracks.value[finishedTrackIndex + 1]

      const finishedTrackState = playlist.data.find((el: any) => el.h.id === finishedTrackID)

      if (finishedTrackState) {
        finishedTrackState.stopVideo()
      }

      if (nextTrackID) {
        const nextTrackState = playlist.data.find((el: any) => el.h.id === nextTrackID)

        if (nextTrackState) {
          nextTrackState.playVideo()
          awaitNextPage.value = null
        }
      } else if (tracks.value.length < totalTracks.value) {
        awaitNextPage.value = finishedTrackID
        fetchPlaylist()
      }
    }

    const onPlayerStateChange = ($event: any) => {
      console.log($event)
      if ($event.data === 1) {
        const startedTrack = $event.target.m.id

        if (playlingTrack.value && playlingTrack.value !== startedTrack) {
          const stoppedTrackState = playlist.data.find((el: any) => el.h.id === playlingTrack.value)

          if (stoppedTrackState) {
            stoppedTrackState.stopVideo()
          }
        }
        
        playlingTrack.value = $event.target.m.id
      }

      if ($event.data === 0) {
        playNextTrack($event.target.m.id)
      }
    }

    const onPlayerReady = () => {
      if (awaitNextPage.value) {
        playNextTrack(awaitNextPage.value)
      }
    }

    const createTracks = (data: string[]) => {
      const result = data.map((videoID) => {
        const player = new (<any>window).YT.Player(videoID, {
          videoId: videoID,
          events: {
            onStateChange: onPlayerStateChange,
            onReady: onPlayerReady
          }
        })

        return player
      })

      if (!playlist.isFetched) {
        playlist.data = result
        playlist.isFetched = true
      } else {
        playlist.data.push(...result)
      }
    }

    const setTracks = (data: YTPlaylistResponseItem[]) => {
      const isFrameScriptExist = document.querySelector('#yt-script')
      const tracksArray = data.map((el) => el.contentDetails.videoId)

      if (!tracks.value) {
        tracks.value = tracksArray
      } else {
        tracks.value.push(...tracksArray)
      }

      if (!isFrameScriptExist) {
        const frameScript = document.createElement('script')
        
        document.body.append(frameScript)

        frameScript.onload = () => {
          (<any>window).onYouTubeIframeAPIReady = () => createTracks(tracksArray)
        }

        frameScript.src = 'https://www.youtube.com/iframe_api'
        frameScript.id = 'yt-script'
      } else {
        nextTick(() => createTracks(tracksArray))
      }
    }

    const updatePageConfig = (data: YTPlaylistResponse) => {
      nextPage.value = data.nextPageToken
      totalTracks.value = data.pageInfo.totalResults
    }

    async function fetchPlaylist() {
      YouTubeServices.playlist(perPage.value, nextPage.value)
        .then((response) => {
          setTracks(response.items)
          return response
        })
        .then((response) => updatePageConfig(response))
        .catch((error) => console.dir(error))
    }

    onMounted(() => fetchPlaylist())

    return {
      perPage,
      tracks,
      playlist,
      totalTracks,
      nextPageLoad
    }
  }
})

</script>
