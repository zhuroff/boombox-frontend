import { ref, watch } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useUpdateEntity } from '~shared/model'
import usePlaylistService from '../api/usePlaylistService'
import type { PlaylistTrack } from '~features/player'
import type { DatabaseService } from '~shared/api'
import type { ListPageResponse } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

const playingTrack = ref<PlaylistTrack | null>(null)
const playingTrackRef = ref<HTMLAudioElement | null>(null)
const progressLine = ref(0)
const progressTime = ref(0)

const useAudioService = (dbService: DatabaseService) => {
  const entityKey = ref('tracks')

  const { getNextTrack, setTrackDuration } = usePlaylistService()

  const { updateEntity } = useUpdateEntity<ListPageResponse<TrackBasic>, Partial<TrackBasic>>(
    entityKey,
    dbService
  )

  const { mutate: fetchTrackStreamURL, isPending: isTrackFetching } = useMutation<string>({
    mutationFn: () => {
      return dbService.getCloudFiles<string>(
        entityKey.value,
        `audio/${playingTrack.value?.path}`,
        `cloudURL=${playingTrack.value?.cloudURL}`
      )
    },
    onSuccess: (src) => {
      playTrackStream(src)
    }
  })

  const checkAndSetDuration = () => {
    const { duration } = playingTrackRef.value || {}
    if (!duration || !playingTrack.value?.inAlbum || playingTrack.value.duration) return
    
    playingTrack.value.duration = duration
    setTrackDuration(playingTrack.value._id, duration)
    updateEntity({ _id: playingTrack.value._id, duration })
  }

  const playTrackStream = (src: string) => {
    playingTrack.value!.streamURL = src
    playingTrackRef.value = new Audio(src)
    playingTrackRef.value.play().then(checkAndSetDuration)
  }

  const playNextTrack = (track: PlaylistTrack | undefined) => {
    if (track) {
      playingTrack.value = track
      !track.streamURL 
        ? fetchTrackStreamURL()
        : playTrackStream(track.streamURL)
    } else {
      playingTrack.value = null
    }
  }

  const playingStateHandler = (audio: HTMLAudioElement) => {
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

  watch(
    playingTrackRef,
    (audio) => {
      if (!audio) return
      playingStateHandler(audio)
      playingTrack.value && (playingTrack.value.isOnPlaying = true)
    }
  )

  return {
    playingTrack,
    progressLine,
    progressTime,
    playNextTrack,
    isTrackFetching,
    playingTrackRef,
    playTrackStream,
    fetchTrackStreamURL
  }
}

export default useAudioService
