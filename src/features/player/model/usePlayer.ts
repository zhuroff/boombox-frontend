import { computed, ref } from 'vue'
import { DatabaseService } from '~shared/api'
import { useDevice } from '~shared/model'
import useAudioService from '../api/useAudioService'
import usePlaylistService from '../api/usePlaylistService'
import type { TrackBasic } from '~entities/track'

const dbService = new DatabaseService()

const screensaveMode = ref(false)
const isPlaylistExpanded = ref(false)

const usePlayer = () => {
  const {
    trackVolume,
    playingTrack,
    playingTrackRef,
    fetchTrackStreamURLAsync,
    destroyPlayingTrack,
    clearNextPreload,
    fetchingTrackId,
    playTrackStream,
    playNextTrack,
    progressLine,
    progressTime,
    isTrackMuted,
    isSwitchingTrack
  } = useAudioService(dbService)

  const { getNextTrack, getPrevTrack, primaryPlaylist, replacePlaylist, searchTrackInPlaylists } = usePlaylistService()

  const { isMobile } = useDevice()

  const isPrevTrackAvailable = computed(() => {
    const previousTrack = getPrevTrack(playingTrack.value?._id)
    return !!previousTrack && !previousTrack.idDisabled
  })

  const isNextTrackAvailable = computed(() => {
    const nextTrack = getNextTrack(playingTrack.value?._id)
    return !!nextTrack && !nextTrack.idDisabled
  })

  const playingTrackIndex = computed(() => {
    return primaryPlaylist.value.findIndex(({ _id }) => _id === playingTrack.value?._id)
  })

  const playNext = () => {
    const nextTrack = getNextTrack(playingTrack.value?._id)
    playNextTrack(nextTrack)
  }

  const playPrev = () => {
    const prevTrack = getPrevTrack(playingTrack.value?._id)
    playNextTrack(prevTrack)
  }

  const playTrack = (track: TrackBasic) => {
    isSwitchingTrack.value = false

    if (track._id === playingTrack.value?._id && playingTrackRef.value) {
      playingTrack.value.isOnPause = false
      void playingTrackRef.value
        .play()
        .then(() => {
          if (playingTrack.value?._id === track._id) {
            playingTrack.value.isOnPlaying = true
          }
        })
        .catch(console.error)
      return
    }

    clearNextPreload()
    fetchingTrackId.value = track._id
    destroyPlayingTrack()

    const targetTrack = searchTrackInPlaylists(track, replacePlaylist)
    if (!targetTrack) {
      fetchingTrackId.value = null
      return
    }

    targetTrack.isOnPause = false
    playingTrack.value = targetTrack

    if (!targetTrack.streamURL) {
      fetchTrackStreamURLAsync()
        .then((src) => {
          if (playingTrack.value?._id !== track._id) return
          targetTrack.streamURL = src
          playTrackStream(src)
        })
        .catch((error) => {
          console.error('Failed to fetch track stream URL:', error)
          if (fetchingTrackId.value === track._id) {
            fetchingTrackId.value = null
          }
          isSwitchingTrack.value = false
        })
    } else {
      playTrackStream(targetTrack.streamURL)
    }
  }

  const playPauseTrack = (e?: MouseEvent) => {
    e?.stopPropagation()

    if (!playingTrack.value || !playingTrackRef.value) return

    if (playingTrack.value.isOnPause) {
      playingTrackRef.value.play()
    } else {
      playingTrackRef.value.pause()
    }

    playingTrack.value.isOnPause = !playingTrack.value.isOnPause
  }

  const setTrackPosition = (value: number) => {
    if (!playingTrackRef.value) return

    progressLine.value = value
    progressTime.value = value * (playingTrack.value?.duration || 1)
    playingTrackRef.value.currentTime = progressTime.value
  }

  const toggleMuteState = () => {
    playingTrackRef.value!.muted = !playingTrackRef.value!.muted
    isTrackMuted.value = !isTrackMuted.value
  }

  const setSoundVolume = (value: number) => {
    if (isMobile.value) return
    trackVolume.value = value
    playingTrackRef.value!.volume = value
    localStorage.setItem('playerVolume', value.toString())
  }

  return {
    playNext,
    playPrev,
    playTrack,
    trackVolume,
    progressLine,
    progressTime,
    playingTrack,
    playPauseTrack,
    fetchingTrackId,
    toggleMuteState,
    playingTrackIndex,
    isPrevTrackAvailable,
    isNextTrackAvailable,
    isPlaylistExpanded,
    screensaveMode,
    setTrackPosition,
    setSoundVolume,
    isTrackMuted,
    isSwitchingTrack
  }
}

export default usePlayer
