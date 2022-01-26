import { IPlaylist, IPlayingTrack } from '~/types/Player'

const initPlaylist: IPlaylist = {
  _id: '',
  title: '',
  albumCover: '',
  artist: { _id: '', title: '' },
  period: { _id: '', title: '' },
  tracks: []
}

const playingTrackInitial: IPlayingTrack = {
  isOnPause: false,
  fileid: 0,
  duration: null,
  isOnRepeat: false,
  artistName: '',
  albumName: '',
  title: '',
  source: '',
  year: '',
  cover: 'https://sverigesradio.se/dist/images/album-cover-placeholder-light.png',
  audio: new Audio(),
  progressHandler: null,
  isOnLoading: false,
  progressLine: 0,
  progressTime: 0,
  _id: ''
}

export {
  initPlaylist,
  playingTrackInitial
}
