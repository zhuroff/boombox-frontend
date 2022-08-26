import { PlayerPlaylist, PlayingTrack } from '~/types/Player'

const initPlaylist: PlayerPlaylist = {
  _id: '',
  title: '',
  albumCover: '',
  artist: { _id: '', title: '' },
  period: { _id: '', title: '' },
  tracks: []
}

const playingTrackInitial: PlayingTrack = {
  isOnPause: false,
  duration: null,
  isOnRepeat: false,
  artistName: '',
  albumName: '',
  title: '',
  source: '',
  year: '',
  cover: '/img/album.webp',
  audio: new Audio(),
  crackle: new Audio('/media/vinyl_01.wav'),
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
