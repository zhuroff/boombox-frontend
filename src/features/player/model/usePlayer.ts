import useAudioService from '../api/useAudioService'
import usePlaylistService from '../api/usePlaylistService'
import { DatabaseService } from '~shared/api'
import type { TrackBasic } from '~entities/track'

const dbService = new DatabaseService()

const usePlayer = () => {
  const {
    playingTrack,
    isTrackFetching,
    playingTrackRef,
    fetchTrackStreamURL,
    playNextTrack,
    playTrackStream,
    progressLine,
    progressTime
  } = useAudioService(dbService)
  
  const {
    getNextTrack,
    isPlaylistActive,
    searchTrackInPlaylists
  } = usePlaylistService()

  const playNext = () => {
    const nextTrack = getNextTrack(playingTrack.value?._id)
    playNextTrack(nextTrack)
  }

  const playTrack = (track: TrackBasic) => {
    isPlaylistActive.value = true

    if (track._id === playingTrack.value?._id) {
      return playingTrackRef.value?.play()
    }

    playingTrackRef.value?.pause()
    playingTrackRef.value = null

    const targetTrack = searchTrackInPlaylists(track)

    playingTrack.value = targetTrack
    
    if (!targetTrack.streamURL) {
      fetchTrackStreamURL()
    } else {
      playTrackStream(targetTrack.streamURL)
    }
  }

  const playPauseTrack = () => {
    if (!playingTrack.value || !playingTrackRef.value) return

    if (playingTrack.value.isOnPause) {
      playingTrackRef.value.play()
    } else {
      playingTrackRef.value.pause()
    }

    playingTrack.value.isOnPause = !playingTrack.value.isOnPause
  }

  return {
    playNext,
    playTrack,
    progressLine,
    progressTime,
    playingTrack,
    playPauseTrack,
    isTrackFetching
  }
}

export default usePlayer
