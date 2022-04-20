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
