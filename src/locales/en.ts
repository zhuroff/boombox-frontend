import { LocaleDictionary } from '~/types/Common'

export const localesEN: LocaleDictionary = {
  languages: {
    en: 'English',
    by: 'Belarusian'
  },
  navigation: {
    albums: 'Albums',
    artists: 'Artists',
    genres: 'Genres',
    periods: 'Periods',
    embedded: 'Embedded',
    collections: 'Collections',
    playlists: 'Playlists',
    youtube: 'YouTube',
    radio: 'Radio',
    toy: 'TOY',
    settings: 'Settings',
    tracks: 'Tracks'
  },
  settings: {
    createBackup: 'Create backup',
    synchronize: 'Synchronize',
  },
  headings: {
    albumsPage: 'The collection contains {x} albums'
  },
  getRandomAlbum: 'Random album',
  unknownTime: 'unknown time',
  listenedTracks: 'Total tracks listened:',
  conjugated: {
    tracks: {
      singular: 'track',
      upToFive: 'tracks',
      plural: 'tracks'
    }
  },
  playButton: 'Play',
  pauseButton: 'Pause',
  discogsTable: {
    cover: 'Cover',
    country: 'Country',
    releaseYear: 'Year',
    releaseFormat: 'Format',
    label: 'Label'
  },
  embeddedForm: {
    title: 'Album title',
    artist: 'Artist',
    genre: 'Genre',
    period: 'Period',
    frame: 'Frame code',
    collections: 'In collection'
  },
  formLabels: {
    errorRequired: 'This field is required'
  },
  table: {
    empty: 'No data'
  },
  unknown: 'Unknown',
  moreOf: 'More of',
  bookletNotFound: 'Booklet not found',
  lyrics: {
    get: 'Get lyrics',
    empty: 'No lyrics yet',
    placeholder: 'You can add lyrics manually in this field, or use the search button above',
    expand: 'Expand content',
    collapse: 'Collapse content',
    save: 'Save lyrics'
  },
  wiki: {
    notFound: 'Nothing was found in Wikipedia',
    frameHeading: 'Select an article from the list above',
    navItem: 'Wikipedia'
  },
  collections: {
    add: 'Add to collection',
    namePlaceholder: 'Enter collection name',
    exists: 'Collection with this name already exists',
    removed: 'Album successfully removed from collection',
    added: 'Album successfully added to collection'
  },
  search: {
    placeholder: 'Search...'
  },
  player: {
    playNow: 'Play now',
    playNext: 'Play next',
    addToList: 'Add to playlist',
    removeFromList: 'Remove from playlist'
  },
  totalAlbums: 'Total albums',
  syncResponse: {
    added: 'Added albums',
    updated: 'Updated albums',
    deleted: 'Deleted albums',
    invalid: 'Albums that didn\'t pass validation',
    invalidValue: {
      album: 'Album',
      cloud: 'Cloud URL',
      reason: 'Reason',
      invalid_folder_name: 'The folder name does not match the pattern: \'Artist name [release year] Album title #Genre\'',
      invalid_tracks_names: 'The tracks names doesn\'t match the pattern: \'Number. Track title.file extension\'',
      no_tracks: 'Album doesn\'t contain any track'
    }
  }
}
