import { MutationTree } from 'vuex'
import { AppStateInterface } from './state'
import { TSnackbar, ReorderPayload } from '~/types/Global'
import { AlbumPage } from '~/types/Album'
import { TrackProgress, PlayerPlaylist } from '~/types/Player'
import { PlaylistPage } from '~/types/Playlist'
import { initPlaylist } from './initStates'
import { playingTrackInitial } from './initStates'
import { RadioStationResponse } from '~/types/Radio'
import { AlbumTrackDTO, PlayerTrackDTO } from '~/dto/AlbumTrackDTO'

const mutations: MutationTree<AppStateInterface> = {
  setSnackbarMessage: (state: AppStateInterface, snackbar: TSnackbar) => {
    state.snackbar.push(snackbar)
    setTimeout(() => state.snackbar.splice(0, 1), 5000)
  },

  closeSnackbar: (state: AppStateInterface, index: number) => {
    state.snackbar.splice(index, 1)
  },

  expandPlayer: (state: AppStateInterface) => {
    state.isPlayerExpanded = !state.isPlayerExpanded
  },

  setPlayerPlaylist: <T extends AlbumPage & PlaylistPage>(state: AppStateInterface, data: T) => {
    if (!state.currentPlaylist._id.length) {
      state.currentPlaylist = data
    } else if (state.currentPlaylist._id !== data._id) {
      state.reservedPlaylist = data
    }
  },

  setPlayingStation: (state: AppStateInterface, station: RadioStationResponse) => {
    if (state.playingTrack._id === station.stationuuid) {
      if (state.playingTrack.isOnPause) {
        state.playingTrack.isOnPause = false
        state.playingTrack.audio.play()
      } else {
        state.playingTrack.isOnPause = true
        state.playingTrack.audio.pause()
      }
    } else {
      state.playingTrack.albumName = station.country
      state.playingTrack.artistName = station.name
      state.playingTrack.audio.src = station.url_resolved
      // state.playingTrack.duration = '--'
      state.playingTrack._id = station.stationuuid
      state.playingTrack.isOnPause = false
      state.playingTrack.isOnRepeat = false
      state.playingTrack.title = station.name
      state.playingTrack.cover = '/img/album.webp'
      state.currentPlaylist = { ...initPlaylist }
      state.playingTrack.audio.play()
    }
  },

  checkOrReplacePlaylists: (state: AppStateInterface, _id: string) => {
    let chosenTrack = state.currentPlaylist.tracks.find((el) => el._id === _id)

    if (!chosenTrack) {
      state.currentPlaylist = { ...state.reservedPlaylist }
      state.reservedPlaylist = { ...initPlaylist } as PlayerPlaylist
    }
  },

  preparePlayerTrack: (state: AppStateInterface, track: AlbumTrackDTO) => {
    state.playingTrack = new PlayerTrackDTO(track)
  },

  nullifyPlayerTrack: (state: AppStateInterface) => {
    state.playingTrack = { ...playingTrackInitial }
  },

  createAudioContext: (state: AppStateInterface) => {
    // if (state.playingTrack.progressHandler) {
    //   state.playingTrack.progressHandler = null
    // }

    state.playingTrack.audio.src = state.playingTrack.source
  },

  setLoadingState: (state: AppStateInterface, _id: string) => {
    state.playingTrack._id = _id
    state.playingTrack.isOnLoading = true
    state.playingTrack.audio.src = ''
  },

  removeLoadingState: (state: AppStateInterface) => {
    state.playingTrack.isOnLoading = false
  },

  updateListeningProgress: (state: AppStateInterface, payload: TrackProgress) => {
    const { progressLine, progressTime } = payload

    state.playingTrack.progressLine = progressLine
    state.playingTrack.progressTime = progressTime
  },

  continuePlay: (state: AppStateInterface) => {
    state.playingTrack.isOnPause = false
    state.playingTrack.audio.play()
  },

  setTrackOnPause: (state: AppStateInterface) => {
    state.playingTrack.isOnPause = true
    state.playingTrack.audio.pause()
  },

  updateListeningCounter: (state: AppStateInterface, id: string) => {
    const targetTrack = state.currentPlaylist.tracks.find((track) => (
      track._id === id
    ))

    if (targetTrack) {
      targetTrack.listened += 1
    }
  },

  setTrackDuration: (state: AppStateInterface, payload) => {
    const { trackID, duration } = payload
    const targetTrack = state.currentPlaylist.tracks.find((track) => (
      track._id === trackID
    ))

    if (targetTrack) {
      state.playingTrack.duration = duration
      targetTrack.duration = duration
    }
  },

  disableOrEnableTrack: (state: AppStateInterface, _id) => {
    const targetTrack = state.currentPlaylist.tracks.find((el) => el._id === _id)
      || state.reservedPlaylist.tracks.find((el) => el._id === _id)

    if (targetTrack) {
      targetTrack.isDisabled = !targetTrack.isDisabled
    }
  },

  changePlaylistOrder: (state: AppStateInterface, payload: ReorderPayload) => {
    const targetPlaylistTracks = state.currentPlaylist._id === payload.entityID
      ? state.currentPlaylist.tracks
      : state.reservedPlaylist.tracks

    targetPlaylistTracks.splice(
      payload.newOrder, 0,
      targetPlaylistTracks.splice(payload.oldOrder, 1)[0]
    )

    /* eslint no-param-reassign: 0 */
    targetPlaylistTracks.forEach((el, index) => {
      el.order = index + 1
    })
  },

  changeRepeatState: (state: AppStateInterface) => {
    state.playingTrack.isOnRepeat = !state.playingTrack.isOnRepeat
  },

  setPosition: (state: AppStateInterface, value: number) => {
    try {
      state.playingTrack.audio.currentTime = value * state.playingTrack.audio.duration
    } catch (ignore) {
      ignore
    }
  },

  setSoundVolume: (state: AppStateInterface, value: number) => {
    state.playingTrack.audio.volume = value
    state.playingTrack.crackle.volume = value
  },

  switchMuteState: (state: AppStateInterface) => {
    state.playingTrack.audio.muted = !state.playingTrack.audio.muted
    state.playingTrack.crackle.muted = !state.playingTrack.crackle.muted
  }
}

export default mutations
