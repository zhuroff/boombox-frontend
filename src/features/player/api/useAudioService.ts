import { ref, onMounted } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useUpdateEntity } from '~shared/model'
import usePlaylistService from './usePlaylistService'
import type { PlaylistTrack } from '~features/player'
import type { DatabaseService } from '~shared/api'
import type { ListPageResponse } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

const playingTrack = ref<PlaylistTrack | null>(null)
const crackleAudioRef = ref<HTMLAudioElement>(new Audio('/media/vinyl_01.wav'))
const playingTrackRef = ref<HTMLAudioElement | null>(null)
const trackVolume = ref(1)
const progressLine = ref(0)
const progressTime = ref(0)
const isTrackMuted = ref(false)
const isVinylMode = ref(false)
const fetchingTrackId = ref<string | null>(null)

const useAudioService = (dbService: DatabaseService) => {
  const entityKey = ref('tracks')

  const { isPlayingStarted, getNextTrack, setTrackDuration } = usePlaylistService()

  const { updateEntity } = useUpdateEntity<ListPageResponse<TrackBasic>, Partial<TrackBasic>>(
    entityKey,
    dbService
  )

  const { mutate: fetchTrackStreamURL } = useMutation<string>({
    mutationFn: () => {
      return dbService.getCloudFiles<string>(
        `${entityKey.value}/audio`,
        `${playingTrack.value?.path}`,
        `cloudURL=${playingTrack.value?.cloudURL}`
      )
    },
    onSuccess: (src) => {
      playTrackStream(src)
    }
  })

  const destroyPlayingTrack = () => {
    playingTrack.value = null
    playingTrackRef.value?.pause()
    playingTrackRef.value = null
  }

  const checkAndSetDuration = () => {
    const { duration } = playingTrackRef.value || {}
    if (!playingTrack.value || !duration || duration === Infinity || playingTrack.value.duration) return
    
    playingTrack.value.duration = duration
    setTrackDuration(playingTrack.value._id, duration)

    if (playingTrack.value.albumKind !== 'toy') {
      updateEntity({ _id: playingTrack.value._id, duration })
    }
  }

  const playTrackStream = (src: string) => {
    playingTrack.value!.streamURL = src
    playingTrackRef.value = new Audio(src)
    playingTrackRef.value.volume = trackVolume.value
    playingTrackRef.value.play()
      .then(checkAndSetDuration)
      .then(() => playingTrackRef.value && playingStateHandler(playingTrackRef.value))
      .then(() => playingTrack.value && (playingTrack.value.isOnPlaying = true))
      .then(() => fetchingTrackId.value = null)
      .catch(console.error)
  }

  const playNextTrack = (track: PlaylistTrack | undefined) => {
    destroyPlayingTrack()
    if (!track) return

    fetchingTrackId.value = track._id
    playingTrack.value = track
    !track.streamURL 
      ? fetchTrackStreamURL()
      : playTrackStream(track.streamURL)
  }

  const playingStateHandler = (audio: HTMLAudioElement) => {
    isPlayingStarted.value = true

    audio.ontimeupdate = () => {
      progressTime.value = audio.currentTime
      progressLine.value = audio.currentTime / audio.duration

      if (progressLine.value >= 1) {
        if (playingTrack.value?.isOnRepeat) {
          playTrackStream(playingTrack.value.streamURL!)
        } else {
          const nextTrack = getNextTrack(playingTrack.value?._id)
          playNextTrack(nextTrack)
        }
      }
    }
  }

  onMounted(() => {
    trackVolume.value = Number(localStorage.getItem('playerVolume')) || 1
    crackleAudioRef.value.volume = trackVolume.value
    crackleAudioRef.value.loop = true
  })

  return {
    trackVolume,
    isVinylMode,
    isTrackMuted,
    playingTrack,
    progressLine,
    progressTime,
    playNextTrack,
    fetchingTrackId,
    playingTrackRef,
    crackleAudioRef,
    playTrackStream,
    fetchTrackStreamURL,
    destroyPlayingTrack
  }
}

export default useAudioService
