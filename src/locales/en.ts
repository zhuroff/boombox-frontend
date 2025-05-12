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
    createBackup: 'Create backup',
    synchronize: 'Synchronize',
    logout: 'Logout'
  },
  headings: {
    albumsPage: 'Total albums in the collection: {x}',
    collectionsPage: 'Total collections: {x}',
    compilationsPage: 'Total compilations: {x}',
    artistsPage: 'Total artists in the collection: {x}',
    genresPage: 'Total genres in the collection: {x}',
    periodsPage: 'Total periods in the collection: {x}',
    backups: 'Backups',
    users: 'Users',
    createUser: 'Create user',
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
    label: 'Label'
  },
  embeddedForm: {
    title: 'Album title',
    titlePlaceholder: 'Enter the album title',
    artist: 'Artist',
    artistPlaceholder: 'Enter the artist name',
    genre: 'Genre',
    genrePlaceholder: 'Enter the genre title',
    period: 'Period',
    periodPlaceholder: 'Enter the year of release',
    frame: 'Frame code',
    framePlaceholder: 'Enter the frame code snippet',
    collections: 'In collection',
    notFound: 'Nothing was found among {x}. Create a new one.',
    addAlbum: 'Add album',
    submit: 'Create album'
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
  formLabels: {
    errorRequired: 'This field is required'
  },
  table: {
    empty: 'No data',
    theads: {
      date: 'Date',
      actions: 'Actions',
      id: 'ID',
      login: 'Login',
      email: 'Email',
      role: 'Role',
    }
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
    cardCaption: 'Albums in collection',
    drop: 'Collection successfully deleted'
  },
  compilations: {
    add: 'Add to compilation',
    namePlaceholder: 'Enter compilation name',
    trackDelConfirmation: 'Are you sure you want to remove this track from the compilation?',
    exists: 'Compilation with this name already exists',
    removed: 'Track successfully removed from compilation',
    added: 'Track successfully added to compilation',
    reordered: 'Tracks order successfully changed',
    cardCaption: 'Tracks in compilation',
    drop: 'Compilation successfully deleted',
    more: 'compilations'
  },
  search: {
    placeholder: 'Search...'
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
  createEntityLabel: 'Create entity "{x}" with name: "{x}"'
}
