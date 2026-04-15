import { ref, onMounted, onUnmounted } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { useUpdateEntity, useDevice } from '~shared/model'
import { proxyCloudUrl } from '~shared/lib'
import { CRACKLE_PATHS } from '~shared/constants'
import usePlaylistService from './usePlaylistService'
import type { PlaylistTrack } from '~features/player'
import type { DatabaseService } from '~shared/api'
import type { ListPageResponse } from '~shared/lib'
import type { TrackBasic } from '~entities/track'

const PRELOAD_LEAD_SECONDS = 15
const CROSSFADE_SECONDS = 1
const CROSSFADE_BEGIN_SLACK_SECONDS = 0.02
const CROSSFADE_CANCEL_SLACK_SECONDS = 0.03

const playingTrack = ref<PlaylistTrack | null>(null)
const crackleAudioRef = ref<HTMLAudioElement>(new Audio(CRACKLE_PATHS[0]))
const playingTrackRef = ref<HTMLAudioElement | null>(null)
const trackVolume = ref(1)
const progressLine = ref(0)
const progressTime = ref(0)
const isTrackMuted = ref(false)
const isVinylMode = ref(false)
const fetchingTrackId = ref<string | null>(null)
const isSwitchingTrack = ref(false)
const preloadedNextAudioRef = ref<HTMLAudioElement | null>(null)
const preloadedForTrackId = ref<string | null>(null)
const preloadAttemptedForPlayingId = ref<string | null>(null)

let preloadGeneration = 0
let nextPreloadInFlight: Promise<void> | null = null
let nextPreloadInFlightForId: string | null = null
let crossfadeNextEl: HTMLAudioElement | null = null
let crossfadeNextTrack: PlaylistTrack | null = null
let crossfadeFromTrackId: string | null = null

const getOverlapSeconds = (dur: number) => {
  if (!dur || !isFinite(dur)) return CROSSFADE_SECONDS
  return Math.min(CROSSFADE_SECONDS, Math.max(0.08, dur * 0.45))
}

/** Equal-power crossfade over t∈[0,1]: softer perceived blend than linear volume cross-multiply. */
const crossfadeEqualPowerGains = (linearT: number) => {
  const t = Math.min(1, Math.max(0, linearT))
  const q = (Math.PI / 2) * t
  return { outgoing: Math.cos(q), incoming: Math.sin(q) }
}

const useAudioService = (dbService: DatabaseService) => {
  const entityKey = ref('tracks')
  const { isMobile } = useDevice()

  const { isPlayingStarted, getNextTrack, setTrackDuration } = usePlaylistService()

  const { updateEntity } = useUpdateEntity<ListPageResponse<TrackBasic>, Partial<TrackBasic>>(
    entityKey,
    dbService
  )

  const getStreamUrlForTrack = (track: PlaylistTrack) => {
    return dbService.getCloudFiles<string>(
      `${entityKey.value}/audio`,
      `${track.path}`,
      `cloudURL=${track.cloudURL}`
    )
  }

  const { mutateAsync: fetchTrackStreamURLAsync } = useMutation<string>({
    mutationFn: () => {
      if (!playingTrack.value) throw new Error('No track')
      return getStreamUrlForTrack(playingTrack.value)
    }
  })
  
  const { mutate: fetchTrackStreamURL } = useMutation<string>({
    mutationFn: () => {
      if (!playingTrack.value) throw new Error('No track')
      return getStreamUrlForTrack(playingTrack.value)
    },
    onSuccess: (src) => {
      playTrackStream(src)
    }
  })

  const disposePreloadElement = () => {
    if (preloadedNextAudioRef.value) {
      preloadedNextAudioRef.value.pause()
      preloadedNextAudioRef.value.removeAttribute('src')
      preloadedNextAudioRef.value.load()
      preloadedNextAudioRef.value = null
    }
    preloadedForTrackId.value = null
  }

  const cancelCrossfadePlayback = () => {
    if (crossfadeNextEl) {
      crossfadeNextEl.pause()
      crossfadeNextEl.onended = null
      crossfadeNextEl.ontimeupdate = null
      crossfadeNextEl.removeAttribute('src')
      crossfadeNextEl.load()
      crossfadeNextEl = null
    }
    crossfadeNextTrack = null
    crossfadeFromTrackId = null
    if (playingTrackRef.value) {
      const el = playingTrackRef.value
      el.volume = el.muted ? 0 : trackVolume.value
    }
  }

  const clearNextPreload = () => {
    preloadGeneration++
    cancelCrossfadePlayback()
    disposePreloadElement()
    nextPreloadInFlight = null
    nextPreloadInFlightForId = null
  }

  const waitForPreloadReady = (el: HTMLAudioElement) => {
    return new Promise<void>((resolve, reject) => {
      let done = false
      const finish = () => {
        if (done) return
        done = true
        el.removeEventListener('canplaythrough', finish)
        el.removeEventListener('canplay', finish)
        el.removeEventListener('error', onErr)
        resolve()
      }
      const onErr = () => {
        if (done) return
        done = true
        el.removeEventListener('canplaythrough', finish)
        el.removeEventListener('canplay', finish)
        el.removeEventListener('error', onErr)
        reject(new Error('Preload failed'))
      }
      el.addEventListener('canplaythrough', finish, { once: true })
      el.addEventListener('canplay', finish, { once: true })
      el.addEventListener('error', onErr, { once: true })
      el.load()
    })
  }

  const ensureNextTrackPreloaded = async (next: PlaylistTrack, whilePlayingId: string) => {
    if (preloadedForTrackId.value === next._id && preloadedNextAudioRef.value) return

    if (nextPreloadInFlightForId === next._id && nextPreloadInFlight) {
      await nextPreloadInFlight
      return
    }

    const myGen = ++preloadGeneration

    const run = async (): Promise<void> => {
      try {
        let src = next.streamURL
        if (!src) {
          src = await getStreamUrlForTrack(next)
          if (myGen !== preloadGeneration || playingTrack.value?._id !== whilePlayingId) return
          next.streamURL = src
        } else if (myGen !== preloadGeneration || playingTrack.value?._id !== whilePlayingId) {
          return
        }

        disposePreloadElement()

        const proxyURL = proxyCloudUrl(src) || src
        const el = new Audio()
        el.preload = 'auto'
        el.src = proxyURL

        await waitForPreloadReady(el)

        if (myGen !== preloadGeneration || playingTrack.value?._id !== whilePlayingId) {
          el.pause()
          el.removeAttribute('src')
          el.load()
          return
        }

        preloadedNextAudioRef.value = el
        preloadedForTrackId.value = next._id
      } catch (e) {
        console.error('Next track preload failed:', e)
      } finally {
        if (nextPreloadInFlightForId === next._id) {
          nextPreloadInFlight = null
          nextPreloadInFlightForId = null
        }
      }
    }

    nextPreloadInFlightForId = next._id
    nextPreloadInFlight = run()
    await nextPreloadInFlight
  }

  const adoptPreloadedNext = (track: PlaylistTrack) => {
    const currentTrackId = track._id
    const audio = preloadedNextAudioRef.value!
    preloadedNextAudioRef.value = null
    preloadedForTrackId.value = null

    playingTrack.value = track
    playingTrackRef.value = audio
    audio.volume = trackVolume.value
    fetchingTrackId.value = null

    audio
      .play()
      .then(() => checkAndSetDuration(currentTrackId))
      .then(() => playingTrackRef.value && playingStateHandler(playingTrackRef.value, currentTrackId))
      .then(() => playingTrack.value && (playingTrack.value.isOnPlaying = true))
      .then(() => {
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

  const beginCrossfade = (
    current: HTMLAudioElement,
    trackId: string,
    next: PlaylistTrack,
    nextEl: HTMLAudioElement
  ) => {
    if (crossfadeNextEl) return
    preloadedNextAudioRef.value = null
    preloadedForTrackId.value = null
    crossfadeNextEl = nextEl
    crossfadeNextTrack = next
    crossfadeFromTrackId = trackId
    nextEl.volume = 0
    nextEl.muted = current.muted
    void nextEl.play().catch((e) => {
      console.error(e)
      cancelCrossfadePlayback()
    })
  }

  const destroyPlayingTrack = () => {
    if (playingTrackRef.value) {
      playingTrackRef.value.pause()
      playingTrackRef.value.onended = null
      playingTrackRef.value.ontimeupdate = null
      playingTrackRef.value = null
    }
  }

  const checkAndSetDuration = (trackId: string) => {
    const { duration } = playingTrackRef.value || {}
    if (!duration || duration === Infinity) return
    
    const currentTrack = playingTrack.value
    
    if (!currentTrack || currentTrack._id !== trackId || currentTrack.duration) return
    
    currentTrack.duration = duration
    setTrackDuration(trackId, duration)
    updateEntity({ _id: trackId, duration })
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

  const playNextTrack = async (track: PlaylistTrack | undefined) => {
    if (isSwitchingTrack.value) return
    if (!track) return

    if (crossfadeNextEl && crossfadeNextTrack?._id === track._id) {
      isSwitchingTrack.value = true
      finalizeCrossfadeHandoff()
      return
    }

    if (preloadedNextAudioRef.value && preloadedForTrackId.value === track._id) {
      isSwitchingTrack.value = true
      destroyPlayingTrack()
      adoptPreloadedNext(track)
      return
    }

    if (nextPreloadInFlightForId === track._id && nextPreloadInFlight) {
      isSwitchingTrack.value = true
      fetchingTrackId.value = track._id
      destroyPlayingTrack()
      try {
        await nextPreloadInFlight
      } catch {
        /* The error is already logged in ensureNextTrackPreloaded */
      }
      if (preloadedNextAudioRef.value && preloadedForTrackId.value === track._id) {
        adoptPreloadedNext(track)
        return
      }
    }

    isSwitchingTrack.value = true
    clearNextPreload()

    destroyPlayingTrack()
    
    fetchingTrackId.value = track._id
    playingTrack.value = track
    
    if (!track.streamURL) {
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
    preloadAttemptedForPlayingId.value = null

    audio.onended = () => {
      if (playingTrack.value?._id !== trackId || isSwitchingTrack.value) return

      if (crossfadeNextEl && crossfadeFromTrackId === trackId && crossfadeNextTrack) {
        finalizeCrossfadeHandoff()
        return
      }

      if (playingTrack.value.isOnRepeat) {
        clearNextPreload()
        playTrackStream(playingTrack.value.streamURL!)
      } else {
        const nextTrack = getNextTrack(trackId)
        void playNextTrack(nextTrack)
      }
    }

    audio.ontimeupdate = () => {
      progressTime.value = audio.currentTime
      const dur = audio.duration
      progressLine.value = dur && isFinite(dur) ? audio.currentTime / dur : 0

      if (playingTrack.value?._id !== trackId || isSwitchingTrack.value) return
      if (playingTrack.value?.isOnRepeat) return

      const next = getNextTrack(trackId)

      if (crossfadeNextEl && crossfadeFromTrackId === trackId && dur && isFinite(dur)) {
        const nextMeta = getNextTrack(trackId)
        crossfadeNextEl.muted = audio.muted
        if (!nextMeta || !crossfadeNextTrack || crossfadeNextTrack._id !== nextMeta._id) {
          cancelCrossfadePlayback()
        } else {
          const overlap = getOverlapSeconds(dur)
          const overlapStart = Math.max(0, dur - overlap)
          if (audio.currentTime < overlapStart - CROSSFADE_CANCEL_SLACK_SECONDS) {
            cancelCrossfadePlayback()
          } else {
            const overlapBlendFraction = Math.min(1, Math.max(0, (audio.currentTime - overlapStart) / overlap))
            const { outgoing: outgoingGain, incoming: incomingGain } = crossfadeEqualPowerGains(overlapBlendFraction)
            const outgoingVolume = audio.muted ? 0 : trackVolume.value
            const incomingVolume = crossfadeNextEl.muted ? 0 : trackVolume.value
            audio.volume = outgoingVolume * outgoingGain
            crossfadeNextEl.volume = incomingVolume * incomingGain
          }
        }
      }

      if (!next) return

      const hasPreloadBuffer = preloadedForTrackId.value === next._id && preloadedNextAudioRef.value

      if (
        !crossfadeNextEl &&
        hasPreloadBuffer &&
        dur &&
        isFinite(dur)
      ) {
        const remaining = dur - audio.currentTime
        const overlap = getOverlapSeconds(dur)
        if (remaining <= overlap + CROSSFADE_BEGIN_SLACK_SECONDS) {
          beginCrossfade(audio, trackId, next, preloadedNextAudioRef.value!)
        }
      }

      if (hasPreloadBuffer) {
        if (preloadAttemptedForPlayingId.value !== trackId) {
          preloadAttemptedForPlayingId.value = trackId
        }
      } else if (preloadAttemptedForPlayingId.value !== trackId) {
        if (!dur || !isFinite(dur)) return

        const remaining = dur - audio.currentTime
        const shortTrack = dur < PRELOAD_LEAD_SECONDS
        const nearEnd = remaining <= PRELOAD_LEAD_SECONDS
        if (!shortTrack && !nearEnd) return

        preloadAttemptedForPlayingId.value = trackId
        void ensureNextTrackPreloaded(next, trackId)
      }
    }
  }

  function finalizeCrossfadeHandoff() {
    const nextTrack = crossfadeNextTrack
    const nextEl = crossfadeNextEl
    if (!nextTrack || !nextEl) return

    crossfadeNextEl = null
    crossfadeNextTrack = null
    crossfadeFromTrackId = null

    const oldEl = playingTrackRef.value
    if (oldEl && oldEl !== nextEl) {
      oldEl.onended = null
      oldEl.ontimeupdate = null
      oldEl.pause()
    }

    playingTrack.value = nextTrack
    playingTrackRef.value = nextEl
    if (oldEl) nextEl.muted = oldEl.muted
    nextEl.volume = oldEl?.muted ? 0 : trackVolume.value
    fetchingTrackId.value = null

    const id = nextTrack._id
    checkAndSetDuration(id)
    playingStateHandler(nextEl, id)
    if (playingTrack.value) playingTrack.value.isOnPlaying = true
    setTimeout(() => {
      if (playingTrack.value?._id === id) isSwitchingTrack.value = false
    }, 100)
  }

  onMounted(() => {
    trackVolume.value = isMobile.value ? 1 : Number(localStorage.getItem('playerVolume')) ?? 1
    crackleAudioRef.value.volume = trackVolume.value
    crackleAudioRef.value.loop = true
  })

  onUnmounted(() => {
    clearNextPreload()
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
    isSwitchingTrack,
    clearNextPreload
  }
}

export default useAudioService
