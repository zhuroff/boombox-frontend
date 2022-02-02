import { MutationTree } from 'vuex'
import { AppStateInterface } from './state'
import { ISnackbar } from '~/types/Global'
import { IAlbumFull } from '~/types/Album'
import { IOrderPayload, ITrackProgress, IPlaylist } from '~/types/Player'
import { initPlaylist } from './initStates'
import { playingTrackInitial } from './initStates'
import {
  artistName,
  albumName,
  periodName,
  albumCover
} from '~/shared/stringifier'

const getChosenTrack = (playlist: IPlaylist, fileid: number) => (
  playlist.tracks.find((el) => el.fileid === fileid)
)

const mutations: MutationTree<AppStateInterface> = {
  setSnackbarMessage: (state: AppStateInterface, snackbar: ISnackbar) => {
    state.snackbar.push(snackbar)
    setTimeout(() => state.snackbar.splice(0, 1), 5000)
  },

  closeSnackbar: (state: AppStateInterface, index: number) => {
    state.snackbar.splice(index, 1)
  },

  setPlayerPlaylist: (state: AppStateInterface, data: IAlbumFull) => {
    const playlist = { ...data, tracks: data.tracks }

    if (!state.currentPlaylist._id.length) {
      state.currentPlaylist = playlist
    } else if (state.currentPlaylist._id !== data._id) {
      state.reservedPlaylist = playlist
    }
  },

  checkOrReplacePlaylists: (state: AppStateInterface, fileid: number) => {
    let chosenTrack = getChosenTrack(state.currentPlaylist, fileid)

    if (!chosenTrack) {
      state.currentPlaylist = { ...state.reservedPlaylist }
      state.reservedPlaylist = { ...initPlaylist } as IPlaylist
    }
  },

  preparePlayerTrack: (state: AppStateInterface, fileid: number) => {
    const chosenTrack = getChosenTrack(state.currentPlaylist, fileid)

    if (chosenTrack) {
      state.playingTrack.isOnPause = false
      state.playingTrack.isOnRepeat = false
      state.playingTrack.fileid = fileid
      state.playingTrack._id = chosenTrack._id
      state.playingTrack.title = chosenTrack.title
      state.playingTrack.source = chosenTrack.link
      state.playingTrack.duration = chosenTrack?.duration || null
      state.playingTrack.artistName = artistName(state.currentPlaylist.artist)
      state.playingTrack.albumName = albumName(state.currentPlaylist)
      state.playingTrack.year = periodName(state.currentPlaylist.period)
      state.playingTrack.cover = albumCover(state.currentPlaylist)
      state.playingTrack.isOnLoading = true
      state.playingTrack.crackle.loop = true
    }
  },

  nullifyPlayerTrack: (state: AppStateInterface) => {
    state.playingTrack = { ...playingTrackInitial }
  },

  createAudioContext: (state: AppStateInterface) => {
    if (state.playingTrack.progressHandler) {
      // state.playingTrack.audio.removeEventListener('timeupdate', state.playingTrack.progressHandler)
      state.playingTrack.progressHandler = null
    }

    state.playingTrack.audio.src = state.playingTrack.source
  },

  deleteLoadingState: (state: AppStateInterface) => {
    state.playingTrack.isOnLoading = false
  },

  updateListeningProgress: (state: AppStateInterface, payload: ITrackProgress) => {
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

  disableOrEnableTrack: (state: AppStateInterface, fileid) => {
    const targetTrack = state.currentPlaylist.tracks.find((el) => el.fileid === fileid)
      || state.reservedPlaylist.tracks.find((el) => el.fileid === fileid)

    if (targetTrack) {
      targetTrack.isDisabled = !targetTrack.isDisabled
    }
  },

  changePlaylistOrder: (state: AppStateInterface, payload: IOrderPayload) => {
    const targetPlaylistTracks = state.currentPlaylist._id === payload.playlistID
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
    state.playingTrack.audio.currentTime = value * state.playingTrack.audio.duration
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
