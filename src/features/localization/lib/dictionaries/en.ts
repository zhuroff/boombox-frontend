import { type LocaleDictionary } from '../types'
import { LocaleKeys, type LocaleItem } from '~shared/lib'

export const localeConfigEN: LocaleItem = {
  intlName: 'en-GB',
  locale: LocaleKeys.EN,
  stateFlag: 'flag-en',
  title: 'English'
}

export const localesEN: LocaleDictionary = {
  languages: {
    en: 'English',
    by: 'Беларуская'
  },
  cancel: 'Cancel',
  delete: 'Delete',
  editPassword: 'Change password',
  restore: 'Restore',
  submit: 'Submit',
  signIn: 'Sign in',
  save: 'Save',
  offline: 'You\'re offline',
  delConfirmMessage: 'Are you sure you want to delete this entity?',
  pageNotFound: 'Page not found',
  noBooklet: 'Album has no booklet',
  goBack: 'Go back',
  navigation: {
    albums: 'Albums',
    artists: 'Artists',
    genres: 'Genres',
    periods: 'Periods',
    embedded: 'Embedded',
    collections: 'Collections',
    compilations: 'Compilations',
    toy: 'TOY',
    settings: 'Settings',
    tracks: 'Tracks'
  },
  settings: {
    createUser: 'Create user',
    showUsers: 'Show all users',
    createBackup: 'Create backup',
    getBackups: 'Show all backups',
    restoreBackup: 'Restore backup',
    deleteBackup: 'Delete backup',
    synchronize: 'Synchronize collection',
    logout: 'Logout',
    snackbar: {
      createBackupSuccess: 'Backup created successfully',
      createBackupError: 'Failed to create backup',
      restoreBackupSuccess: 'Backup restored successfully',
      restoreBackupError: 'Failed to restore backup',
      deleteBackupSuccess: 'Backup deleted successfully',
      deleteBackupError: 'Failed to delete backup'
    }
  },
  headings: {
    albumsPage: 'Total albums in the collection: {x}',
    collectionsPage: 'Total collections: {x}',
    compilationsPage: 'Total compilations: {x}',
    artistsPage: 'Total artists in the collection: {x}',
    genresPage: 'Total genres in the collection: {x}',
    periodsPage: 'Total periods in the collection: {x}',
    backups: 'Backups',
    users: 'Users'
  },
  backups: {
    timestamp: 'Date of creation',
    restore: 'Restore backup',
    delete: 'Delete backup'
  },
  getRandomAlbum: 'Random album',
  unknownTime: 'Not all tracks have been listened to yet',
  listenedTracks: 'Total tracks listened:',
  conjugated: {
    tracks: {
      singular: 'Track',
      upToFive: 'Tracks',
      plural: 'Tracks'
    }
  },
  playButton: 'Play',
  pauseButton: 'Pause',
  discogsTable: {
    cover: 'Cover',
    country: 'Country',
    releaseTitle: 'Title',
    releaseYear: 'Year',
    releaseFormat: 'Format',
    label: 'Label',
    resetFilters: 'Reset filters'
  },
  embeddedForm: {
    title: 'Album title',
    titlePlaceholder: 'Enter the album title',
    titleRequired: 'Album title is required',
    artist: 'Artist',
    artistPlaceholder: 'Enter the artist name',
    artistRequired: 'Artist name is required',
    genre: 'Genre',
    genrePlaceholder: 'Enter the genre title',
    genreRequired: 'Genre title is required',
    period: 'Period',
    periodPlaceholder: 'Enter the year of release',
    periodRequired: 'Year of release is required',
    frame: 'Frame code',
    framePlaceholder: 'Enter the frame code snippet',
    frameRequired: 'Frame code is required',
    frameInvalid: 'Invalid frame code',
    collections: 'In collection',
    addAlbum: 'Add album',
    submit: 'Create album',
    entityCreated: 'Embedded album was successfully created'
  },
  loginForm: {
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'Enter the email you\'ve registered on',
    passwordPlaceholder: 'Enter the account password'
  },
  userForm: {
    login: 'Login',
    email: 'Email',
    role: 'Role',
    password: 'Password',
    passwordConfirm: 'Repeat password',
    admin: 'Administrator',
    user: 'User',
    listener: 'Listener',
    created: 'User was successfully created',
    errors: {
      passwordsDoNotMatch: 'Passwords do not match'
    }
  },
  users: {
    delete: 'Delete user',
    id: 'ID',
    login: 'Login',
    email: 'Email',
    role: 'Role'
  },
  formLabels: {
    errorRequired: 'This field is required'
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
    namePlaceholder: 'Enter new collection name, and save',
    exists: 'Collection with this name already exists',
    removed: 'Album successfully removed from collection',
    added: 'Album successfully added to collection',
    reordered: 'Albums order successfully changed',
    drop: 'Collection successfully deleted',
    cardCaption: 'Various Artists'
  },
  compilations: {
    add: 'Add to compilation',
    namePlaceholder: 'Enter compilation name',
    trackDelConfirmation: 'Are you sure you want to remove this track from the compilation?',
    exists: 'Compilation with this name already exists',
    removed: 'Track successfully removed from compilation',
    added: 'Track successfully added to compilation',
    reordered: 'Tracks order successfully changed',
    cardCaption: 'Various Artists',
    drop: 'Compilation successfully deleted',
    more: 'compilations'
  },
  search: {
    placeholder: 'Search...',
    byAlbum: 'By album',
    byArtist: 'By artist',
    byGenre: 'By genre',
    byPeriod: 'By period',
    byTrack: 'By track',
    empty: 'There are no results'
  },
  player: {
    playNow: 'Play now',
    playNext: 'Play next',
    addToList: 'Add to playlist',
    removeFromList: 'Remove from playlist',
    waveButton: 'Play this wave'
  },
  totalLength: 'Length',
  totalAlbums: 'Total albums',
  deleteEntity: 'Delete album',
  deletedEmbeddedMessage: 'Album was successfully deleted',
  syncResponse: {
    added: 'Added albums',
    updated: 'Updated albums',
    deleted: 'Deleted albums',
    invalid: 'Albums that didn\'t pass validation',
    synchronizeEmpty: 'No albums to synchronize',
    invalidValue: {
      album: 'Album',
      cloud: 'Cloud URL',
      reason: 'Reason',
      invalid_folder_name: 'The folder name does not match the pattern: \'Artist name [release year] Album title #Genre\'',
      invalid_tracks_names: 'The tracks names doesn\'t match the pattern: \'Number. Track title.file extension\'',
      no_tracks: 'Album doesn\'t contain any track'
    }
  },
  toy: {
    emptyGenres: 'There are no any collection yet',
    emptyYears: 'There are no any periods yet'
  },
  createEntityLabel: 'Create entity "{x}" with name: "{x}"',
  heroActions: {
    search: 'Search',
    wiki: 'Get wiki info',
    addToCollection: 'Add to collection',
    getRandomAlbum: 'Get random album',
    deleteAlbum: 'Delete album'
  },
  trackActions: {
    getLyrics: 'Get lyrics',
    disableTrack: 'Disable track',
    enableTrack: 'Enable track',
    toPlaylist: 'Add to playlist',
    removeFromPlaylist: 'Remove from playlist',
    toCompilation: 'Add to compilation'
  }
}
