import { MutationTree } from 'vuex'
import { AppStateInterface } from './state'
import { IAlbumFull } from '~/types/Album'
import { IPlaylist } from '~/types/Player'
import { initPlaylist } from './initStates'
import {
  artistName,
  albumName,
  periodName,
  albumCover
} from '~/shared/stringifier'
import actions from './actions'

const getChosenTrack = (playlist: IPlaylist, fileid: number) => (
  playlist.tracks.find((el) => el.fileid === fileid)
)

const mutations: MutationTree<AppStateInterface> = {
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
      state.playingTrack.title = chosenTrack.title
      state.playingTrack.source = chosenTrack.link
      state.playingTrack.duration = chosenTrack?.duration || '--/--'
      state.playingTrack.artistName = artistName(state.currentPlaylist.artist)
      state.playingTrack.albumName = albumName(state.currentPlaylist)
      state.playingTrack.year = periodName(state.currentPlaylist.period)
      state.playingTrack.cover = albumCover(state.currentPlaylist)
      state.playingTrack.isOnLoading = true
    }
  },

  createAudioContext: (state: AppStateInterface) => {
    if (state.playingTrack.progressHandler) {
      // state.playingTrack.audio.removeEventListener('timeupdate', state.playingTrack.progressHandler)
      state.playingTrack.progressHandler = null
    }

    state.playingTrack.audio.src = state.playingTrack.source
  },

  playAudioTrack: (state: AppStateInterface) => {
    state.playingTrack.audio.play()
      .then(() => {
        state.playingTrack.isOnLoading = false
      })
      .then(() => {
        state.playingTrack.audio.ontimeupdate = () => {
          state.playingTrack.progressLine = (
            state.playingTrack.audio.currentTime / state.playingTrack.audio.duration
          )
  
          state.playingTrack.progressTime = state.playingTrack.audio.currentTime
          console.log(state.playingTrack.progressLine)
  
          if (state.playingTrack.progressLine === 1) {
            console.log(actions)
          }
        }
      })
  }
}

export default mutations
