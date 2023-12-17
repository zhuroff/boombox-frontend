import {  ReorderPayload, LocaleKeys } from '~/types/Common'
import { AlbumPage } from '~/types/Album'
import { PlaylistPage } from '~/types/Playlist'
import { RadioStationResponse } from '~/types/Radio'
import AlbumTrack from '~/classes/AlbumTrack'

export default {
  // setSnackbarMessage: (state: any /* AppStateInterface */, snackbar: Snackbar) => {
  //   state.snackbar.push(snackbar)
  //   setTimeout(() => state.snackbar.splice(0, 1), snackbar.time || 5000)
  // },

  // closeSnackbar: (state: any /* AppStateInterface */, index: number) => {
  //   state.snackbar.splice(index, 1)
  // },

  // setLocale: (state: any /* AppStateInterface */, locale: LocaleKeys) => {
  //   state.currentLocale = locale
  // },

  // expandPlayer: (state: any /* AppStateInterface */) => {
  //   state.isPlayerExpanded = !state.isPlayerExpanded
  // },

  // setPlayerPlaylist: <T extends AlbumPage & PlaylistPage>(state: any /* AppStateInterface */, data: T) => {
  //   if (!state.currentPlaylist._id || !state.playingTrack._id) {
  //     state.currentPlaylist = data
  //   } else if (state.currentPlaylist._id !== data._id) {
  //     state.reservedPlaylist = data
  //   }
  // },

  // addAlbumToPlaylist: (state: any /* AppStateInterface */) => {
  //   state.currentPlaylist.tracks = [
  //     ...state.currentPlaylist.tracks,
  //     ...state.reservedPlaylist.tracks
  //   ]
  // },

  setPlayingStation: (state: any /* AppStateInterface */, station: RadioStationResponse) => {
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
      state.playingTrack._id = station.stationuuid
      state.playingTrack.isOnPause = false
      state.playingTrack.isOnRepeat = false
      state.playingTrack.title = station.name
      state.playingTrack.cover = '/img/album.webp'
      // state.currentPlaylist = { ...initPlaylist }
      state.currentPlaylist = {}
      state.playingTrack.audio.play()
    }
  },

  // appendTrackToPlaylist: (state: any /* AppStateInterface */, prop: { track: AlbumTrackDTO, order: number }) => {
  //   state.currentPlaylist.tracks = state.currentPlaylist.tracks
  //     .reduce<AlbumTrackDTO[]>((acc, next, index) => {
  //       if (index + 1 === prop.order) {
  //         acc.push({ ...next, order: prop.order })
  //         acc.push({ ...prop.track, order: prop.order + 1 })
  //       } else {
  //         acc.push({ ...next, order: (acc.at(-1)?.order || 0) + 1 })
  //       }
  //       return acc
  //     }, [])
  // },

  // removeTrackFromPlaylist: (state: any /* AppStateInterface */, _id: string) => {
  //   let order = 1
  //   // @ts-ignore
  //   state.currentPlaylist.tracks = state.currentPlaylist.tracks
  //     // @ts-ignore
  //     .reduce<AlbumTrack[]>((acc, next) => {
  //       if (next._id === _id) order--
  //       else acc.push({ ...next, order: order })
  //       order++
  //       return acc
  //     }, [])
  // },

  // checkOrReplacePlaylists: (
  //   state: any /* AppStateInterface */,
  //   { commit, track }: { commit: Commit; track: AlbumTrackDTO }
  // ) => {
  //   const isFromCurrentPlaylist = state.currentPlaylist.tracks.some((el) => el._id === track._id)
  //   const isFromReserverPlaylist = state.reservedPlaylist.tracks.some((el) => el._id === track._id)

  //   if (!isFromCurrentPlaylist) {
  //     if (isFromReserverPlaylist) {
  //       state.currentPlaylist = { ...state.reservedPlaylist }
  //       state.reservedPlaylist = { ...initPlaylist } as PlayerPlaylist
  //     } else {
  //       commit('appendTrackToPlaylist', {
  //         track,
  //         order: track.order === 1 ? 1 : track.order - 1
  //       })
  //     }
  //   }
  // },

  // preparePlayerTrack: (state: any /* AppStateInterface */, track: AlbumTrackDTO) => {
  //   state.playingTrack = new PlayerTrackDTO(track)
  // },

  // nullifyPlayerTrack: (state: any /* AppStateInterface */) => {
  //   state.playingTrack = { ...playingTrackInitial }
  // },

  // setLoadingState: (state: any /* AppStateInterface */, _id: string) => {
  //   state.playingTrack._id = _id
  //   state.playingTrack.isOnLoading = true
  //   state.playingTrack.audio.src = ''
  // },

  // removeLoadingState: (state: any /* AppStateInterface */) => {
  //   state.playingTrack.isOnLoading = false
  // },

  // updateListeningProgress: (state: any /* AppStateInterface */, payload: TrackProgress) => {
  //   const { progressLine, progressTime } = payload

  //   state.playingTrack.progressLine = progressLine
  //   state.playingTrack.progressTime = progressTime
  // },

  // continuePlay: (state: any /* AppStateInterface */) => {
  //   state.playingTrack.isOnPause = false
  //   state.playingTrack.audio.play()
  // },

  // setTrackOnPause: (state: any /* AppStateInterface */) => {
  //   state.playingTrack.isOnPause = true
  //   state.playingTrack.audio.pause()
  // },

  // updateListeningCounter: (state: any /* AppStateInterface */, id: string) => {
  //   const targetTrack = state.currentPlaylist.tracks.find((track) => (
  //     track._id === id
  //   ))

  //   if (targetTrack) {
  //     targetTrack.listened += 1
  //   }
  // },

  // setTrackDuration: (state: any /* AppStateInterface */, payload: { trackID: string; duration: number }) => {
  //   const { trackID, duration } = payload
  //   const targetTrack = state.currentPlaylist.tracks.find((track) => (
  //     track._id === trackID
  //   ))

  //   if (targetTrack) {
  //     targetTrack.duration = duration
  //   }

  //   state.playingTrack.duration = duration
  // },

  // disableOrEnableTrack: (state: any /* AppStateInterface */, _id: string) => {
  //   // @ts-ignore
  //   const targetTrack = state.currentPlaylist.tracks.find((el) => el._id === _id)
  //     // @ts-ignore
  //     || state.reservedPlaylist.tracks.find((el) => el._id === _id)

  //   if (targetTrack) {
  //     targetTrack.isDisabled = !targetTrack.isDisabled
  //   }
  // },

  // changePlaylistOrder: (state: any /* AppStateInterface */, payload: ReorderPayload) => {
  //   const targetPlaylistTracks = state.currentPlaylist._id === payload.entityID
  //     ? state.currentPlaylist.tracks
  //     : state.reservedPlaylist.tracks

  //   targetPlaylistTracks.splice(
  //     payload.newOrder, 0,
  //     targetPlaylistTracks.splice(payload.oldOrder, 1)[0]
  //   )

  //   for (let i = 0; i < targetPlaylistTracks.length; i++) {
  //     targetPlaylistTracks[i].order = i + 1
  //   }
  // },

  // changeRepeatState: (state: any /* AppStateInterface */) => {
  //   state.playingTrack.isOnRepeat = !state.playingTrack.isOnRepeat
  // },

  // setPosition: (state: any /* AppStateInterface */, value: number) => {
  //   try {
  //     state.playingTrack.audio.currentTime = value * state.playingTrack.duration
  //   } catch (ignore) {
  //     ignore
  //   }
  // },

  // setSoundVolume: (state: any /* AppStateInterface */, value: number) => {
  //   state.playingTrack.audio.volume = value
  //   state.playingTrack.crackle.volume = value
  //   localStorage.setItem('playerVolume', String(value))
  // },

  // switchMuteState: (state: any /* AppStateInterface */) => {
  //   state.playingTrack.audio.muted = !state.playingTrack.audio.muted
  //   state.playingTrack.crackle.muted = !state.playingTrack.crackle.muted
  // }
}
