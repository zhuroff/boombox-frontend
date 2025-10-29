import { ref, onMounted } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useUpdateEntity } from '~shared/model'
import { proxyCloudUrl } from '~shared/lib'
import { CRACKLE_PATH } from '~shared/constants'
import usePlaylistService from './usePlaylistService'
import type { PlaylistTrack } from '~features/player'
import type { DatabaseService } from '~shared/api'
import type { ListPageResponse } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

const playingTrack = ref<PlaylistTrack | null>(null)
const crackleAudioRef = ref<HTMLAudioElement>(new Audio(CRACKLE_PATH))
const playingTrackRef = ref<HTMLAudioElement | null>(null)
const trackVolume = ref(1)
const progressLine = ref(0)
const progressTime = ref(0)
const isTrackMuted = ref(false)
const isVinylMode = ref(false)
const fetchingTrackId = ref<string | null>(null)
const isSwitchingTrack = ref(false)

const useAudioService = (dbService: DatabaseService) => {
  const entityKey = ref('tracks')

  const { isPlayingStarted, getNextTrack, setTrackDuration } = usePlaylistService()

  const { updateEntity } = useUpdateEntity<ListPageResponse<TrackBasic>, Partial<TrackBasic>>(
    entityKey,
    dbService
  )

  const { mutateAsync: fetchTrackStreamURLAsync } = useMutation<string>({
    mutationFn: () => {
      return dbService.getCloudFiles<string>(
        `${entityKey.value}/audio`,
        `${playingTrack.value?.path}`,
        `cloudURL=${playingTrack.value?.cloudURL}`
      )
    }
  })
  
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
    // Очищаем обработчики событий перед уничтожением элемента
    if (playingTrackRef.value) {
      playingTrackRef.value.pause()
      playingTrackRef.value.onended = null
      playingTrackRef.value.ontimeupdate = null
      playingTrackRef.value = null
    }
    // Не сбрасываем playingTrack здесь, так как это делается в playNextTrack
  }

  const checkAndSetDuration = (trackId: string) => {
    const { duration } = playingTrackRef.value || {}
    if (!duration || duration === Infinity) return
    
    // Используем переданный trackId вместо playingTrack.value._id,
    // так как playingTrack.value может уже указывать на другой трек
    const currentTrack = playingTrack.value
    
    // Проверяем, что это все еще тот же трек
    if (!currentTrack || currentTrack._id !== trackId || currentTrack.duration) return
    
    currentTrack.duration = duration
    setTrackDuration(trackId, duration)

    if (currentTrack.albumKind !== 'toy') {
      updateEntity({ _id: trackId, duration })
    }
  }

  const playTrackStream = (src: string) => {
    if (!playingTrack.value) return
    
    const currentTrackId = playingTrack.value._id
    playingTrack.value.streamURL = src
    const proxyURL = proxyCloudUrl(src) || src
    
    playingTrackRef.value = new Audio(proxyURL)
    playingTrackRef.value.volume = trackVolume.value
    playingTrackRef.value.play()
      .then(() => checkAndSetDuration(currentTrackId))
      .then(() => playingTrackRef.value && playingStateHandler(playingTrackRef.value, currentTrackId))
      .then(() => playingTrack.value && (playingTrack.value.isOnPlaying = true))
      .then(() => {
        fetchingTrackId.value = null
        // Сбрасываем флаг после успешного запуска воспроизведения
        setTimeout(() => {
          if (playingTrack.value?._id === currentTrackId) {
            isSwitchingTrack.value = false
          }
        }, 100)
      })
      .catch((error) => {
        console.error(error)
        isSwitchingTrack.value = false
      })
  }

  const playNextTrack = (track: PlaylistTrack | undefined) => {
    // Защита от множественных одновременных вызовов
    if (isSwitchingTrack.value) return
    if (!track) return

    isSwitchingTrack.value = true
    destroyPlayingTrack()
    
    fetchingTrackId.value = track._id
    playingTrack.value = track
    
    if (!track.streamURL) {
      // Используем mutateAsync для обработки ошибок
      fetchTrackStreamURLAsync()
        .then((src) => {
          playTrackStream(src)
        })
        .catch((error) => {
          console.error('Failed to fetch track stream URL:', error)
          isSwitchingTrack.value = false
        })
    } else {
      playTrackStream(track.streamURL)
    }
  }

  const playingStateHandler = (audio: HTMLAudioElement, trackId: string) => {
    isPlayingStarted.value = true

    // Обработка события ended - срабатывает только один раз при окончании трека
    audio.onended = () => {
      // Проверяем, что это все еще тот же трек (защита от гонки состояний)
      if (playingTrack.value?._id !== trackId || isSwitchingTrack.value) return
      
      if (playingTrack.value.isOnRepeat) {
        playTrackStream(playingTrack.value.streamURL!)
      } else {
        const nextTrack = getNextTrack(trackId)
        playNextTrack(nextTrack)
      }
    }

    audio.ontimeupdate = () => {
      progressTime.value = audio.currentTime
      progressLine.value = audio.currentTime / audio.duration
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
    destroyPlayingTrack,
    isSwitchingTrack
  }
}

export default useAudioService
