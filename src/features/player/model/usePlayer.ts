import { computed, ref } from 'vue'
import { DatabaseService } from '~shared/api'
import useAudioService from '../api/useAudioService'
import usePlaylistService from '../api/usePlaylistService'
import type { TrackBasic } from '~entities/track'

const dbService = new DatabaseService()

const screensaveMode = ref(false)
const isPlaylistExpanded = ref(false)

const usePlayer = () => {
  const {
    trackVolume,
    isVinylMode,
    playingTrack,
    playingTrackRef,
    crackleAudioRef,
    fetchTrackStreamURL,
    destroyPlayingTrack,
    fetchingTrackId,
    playTrackStream,
    playNextTrack,
    progressLine,
    progressTime,
    isTrackMuted,
    isSwitchingTrack
  } = useAudioService(dbService)
  
  const {
    getNextTrack,
    getPrevTrack,
    primaryPlaylist,
    replacePlaylist,
    searchTrackInPlaylists
  } = usePlaylistService()

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
    // Защита от конфликтов с авто-переключением
    if (isSwitchingTrack.value) return
    
    if (track._id === playingTrack.value?._id) {
      return playingTrackRef.value?.play()
    }

    fetchingTrackId.value = track._id
    destroyPlayingTrack()

    const targetTrack = searchTrackInPlaylists(track, replacePlaylist)
    if (!targetTrack) return

    playingTrack.value = targetTrack
    
    if (!targetTrack.streamURL) {
      fetchTrackStreamURL()
    } else {
      playTrackStream(targetTrack.streamURL)
    }

    screensaveMode.value = true
  }

  const playPauseTrack = () => {
    if (!playingTrack.value || !playingTrackRef.value) return

    if (playingTrack.value.isOnPause) {
      playingTrackRef.value.play()
      isVinylMode.value && crackleAudioRef.value.play()
    } else {
      playingTrackRef.value.pause()
      isVinylMode.value && crackleAudioRef.value.pause()
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
    crackleAudioRef.value.muted = !crackleAudioRef.value.muted
    isTrackMuted.value = !isTrackMuted.value
  }

  const toggleVinylMode = () => {
    if (!playingTrackRef.value || playingTrack.value?.isOnPause) return
    
    if (isVinylMode.value) {
      crackleAudioRef.value.pause()
      isVinylMode.value = false
    } else {
      crackleAudioRef.value.play()
      isVinylMode.value = true
    }
  }

  const setSoundVolume = (value: number) => {
    trackVolume.value = value
    playingTrackRef.value!.volume = value
    crackleAudioRef.value.volume = value
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
    toggleVinylMode,
    setSoundVolume,
    isTrackMuted,
    isVinylMode
  }
}

export default usePlayer
