import { type LocaleDictionary } from '../types'
import { LocaleKeys, type LocaleItem } from '~shared/lib'

export const localeConfigBY: LocaleItem = {
  intlName: 'ru-RU',
  locale: LocaleKeys.BY,
  stateFlag: 'flag-by',
  title: 'Беларуская'
}

export const localesBY: LocaleDictionary = {
  languages: {
    en: 'English',
    by: 'Беларуская'
  },
  cancel: 'Скасаваць',
  delete: 'Выдалiць',
  editPassword: 'Змянiць пароль',
  restore: 'Аднавiць',
  submit: 'Даслаць',
  signIn: 'Увайсцi',
  save: 'Захаваць',
  offline: 'Няма далучэння да Iнтэрнэту',
  delConfirmMessage: 'Вы ўпэўнены, што хочаце выдаліць гэты аб\'ект?',
  pageNotFound: 'Старонка не знойдзена',
  noBooklet: 'Альбом не мае буклета',
  goBack: 'Назад',
  album: {
    notePlaceholder: 'Заўвага да альбому'
  },
  navigation: {
    albums: 'Альбомы',
    artists: 'Артысты',
    genres: 'Жанры',
    periods: 'Перыяды',
    embedded: 'Фрэймы',
    collections: 'Калекцыi',
    compilations: 'Кампіляцыi',
    settings: 'Налады',
    tracks: 'Трэкi'
  },
  settings: {
    createUser: 'Стварыць карыстальніка',
    showUsers: 'Паказаць усiх карыстальнікаў',
    createBackup: 'Стварыць бэкап',
    synchronize: 'Сінхранізаваць калекцыю',
    getBackups: 'Паказаць усе бэкапы',
    restoreBackup: 'Аднавіць бэкап',
    deleteBackup: 'Выдаліць бэкап',
    logout: 'Выйсцi',
    snackbar: {
      createBackupSuccess: 'Бэкап паспяхова створаны',
      createBackupError: 'Памылка пры стварэнні бэкапу',
      restoreBackupSuccess: 'Бэкап паспяхова аднавлены',
      restoreBackupError: 'Памылка пры аднавленні бэкапу',
      deleteBackupSuccess: 'Бэкап паспяхова выдалены',
      deleteBackupError: 'Памылка пры выдаленні бэкапу'
    }
  },
  headings: {
    albumsPage: 'Усяго альбомаў: {x}',
    collectionsPage: 'Усяго калекцый: {x}',
    compilationsPage: 'Усяго кампіляцый: {x}',
    artistsPage: 'Усяго артыстаў: {x}',
    genresPage: 'Усяго жанраў: {x}',
    periodsPage: 'Усяго перыядаў: {x}',
    backups: 'Створаныя бэкапы',
    users: 'Карыстальнікі'
  },
  backups: {
    timestamp: 'Дата створання',
    restore: 'Аднавіць бэкап',
    delete: 'Выдаліць бэкап'
  },
  getRandomAlbum: 'Выпадковы альбом',
  unknownTime: 'Н/В',
  listenedTracks: 'Усяго праслуханых трэкаў:',
  conjugated: {
    tracks: {
      singular: 'Трэк',
      upToFive: 'Трэкi',
      plural: 'Трэкаў'
    }
  },
  playButton: 'Граць',
  pauseButton: 'Паўза',
  discogsTable: {
    cover: 'Вокладка',
    country: 'Краiна',
    releaseTitle: 'Назва',
    releaseYear: 'Год',
    releaseFormat: 'Фармат',
    label: 'Лэйбл',
    resetFilters: 'Скінуць фільтры'
  },
  embeddedForm: {
    title: 'Назва альбому',
    titlePlaceholder: 'Увядзiце назву альбому',
    titleRequired: 'Назва альбому абавязковая',
    artist: 'Артыст',
    artistPlaceholder: 'Увядзiце iмя артыста',
    artistRequired: 'Імя артыста абавязковае',
    genre: 'Жанр',
    genrePlaceholder: 'Увядзiце назву жанру',
    genreRequired: 'Назва жанру абавязковая',
    period: 'Год выдання',
    periodPlaceholder: 'Увядзiце год выдання',
    periodRequired: 'Год выдання абавязковы',
    frame: 'Код фрэйму',
    framePlaceholder: 'Увядзiце код фрэйму',
    frameRequired: 'Код фрэйму абавязковы',
    frameInvalid: 'Недапушчальны код фрэйму',
    collections: 'У калекцыi',
    addAlbum: 'Дадаць альбом',
    submit: 'Стварыць альбом',
    entityCreated: 'Альбом паспяхова створаны'
  },
  loginForm: {
    email: 'Email',
    password: 'Пароль',
    emailPlaceholder: 'Увядзiце email, на якi вы рэгiстравалiся',
    passwordPlaceholder: 'Увядзiце пароль да аккаунту'
  },
  userForm: {
    login: 'Логін',
    email: 'Электронная пошта',
    role: 'Роля',
    password: 'Пароль',
    passwordConfirm: 'Паўтарыце пароль',
    admin: 'Адміністратар',
    user: 'Карыстальнік',
    listener: 'Слухач',
    created: 'Карыстальнік паспяхова створаны',
    errors: {
      passwordsDoNotMatch: 'Паролі не супадаюць'
    }
  },
  users: {
    delete: 'Выдаліць карыстальніка',
    id: 'ID',
    login: 'Логін',
    email: 'Электронная пошта',
    role: 'Роля'
  },
  formLabels: {
    errorRequired: 'Гэта поле абавязковае'
  },
  unknown: 'Невядома',
  moreOf: 'Яшчэ альбомы',
  bookletNotFound: 'Буклет не знойдзены',
  lyrics: {
    get: 'Знайсцi тэкст',
    empty: 'Тэкст не ўсталяваны',
    placeholder: 'Вы можаце дадаць тэкст уручную ў гэтым полі або скарыстацца кнопкай пошуку вышэй',
    expand: 'Пашырыць змест',
    collapse: 'Згарнуць змест',
    save: 'Захаваць тэкст',
    saved: 'Тэкст паспяхова захаваны',
    error: 'Тэкст не знойдзены'
  },
  wiki: {
    notFound: 'Нічога не знойдзена ў Вікіпедыі',
    frameHeading: 'Выберыце артыкул са спісу вышэй',
    navItem: 'Вікіпедыя'
  },
  collections: {
    add: 'Дадаць у калекцыю',
    namePlaceholder: 'Увядзіце назву новай калекцыі і захавайце',
    exists: 'Калекцыя з такой назвай ужо існуе',
    removed: 'Альбом паспяхова выдалены з калекцыі',
    added: 'Альбом паспяхова дададзены ў калекцыю',
    reordered: 'Парадак альбомаў паспяхова зменены',
    cardCaption: 'Розныя артысты',
    drop: 'Калекцыя паспяхова выдалена'
  },
  compilations: {
    add: 'Дадаць у компіляцыю',
    trackDelConfirmation: 'Вы ўпэўненыя, што хочаце выдаліць гэты трэк з компіляцыі?',
    namePlaceholder: 'Увядзіце назву компіляцыі',
    exists: 'Компіляцыя з такой назвай ужо існуе',
    removed: 'Трэк паспяхова выдалены з компіляцыі',
    added: 'Трэк паспяхова дададзены ў компіляцыю',
    reordered: 'Парадак трэкаў паспяхова зменены',
    cardCaption: 'Розныя артысты',
    drop: 'Компіляцыя паспяхова выдалена',
    more: 'кампiляцый'
  },
  search: {
    placeholder: 'Пошук...',
    byAlbum: 'Па альбому',
    byArtist: 'Па артысту',
    byGenre: 'Па жанру',
    byPeriod: 'Па перыяду',
    byTrack: 'Па трэку',
    empty: 'Няма вынікаў пошуку'
  },
  player: {
    playNow: 'Граць зараз',
    playNext: 'Граць наступным',
    addToList: 'Дадаць да плэйлiста',
    removeFromList: 'Выдаліць з плэйлiста',
    waveButton: 'Граць гэтую хвалю'
  },
  totalLength: 'Працягласть',
  totalAlbums: 'Усяго альбомаў',
  deleteEntity: 'Выдаліць альбом',
  deletedEmbeddedMessage: 'Альбом паспяхова выдалены',
  syncResponse: {
    added: 'Дададзеныя альбомы',
    updated: 'Абноўленыя альбомы',
    deleted: 'Выдаленыя альбомы',
    invalid: 'Альбомы, якія не прайшлі валiдацыю',
    synchronizeEmpty: 'Няма альбомаў для сінхранізацыі',
    invalidValue: {
      album: 'Альбом',
      cloud: 'URL воблака',
      reason: 'Прычына',
      invalid_folder_name: 'Назва папкі не адпавядае патэрну: \'Iмя артыста [год выдання] Назва альбома #Жанр\'',
      invalid_tracks_names: 'Назва трэкаў не адпавядае патэрну: \'Нумар. Назва трэка.пашырэнне файла\'',
      no_tracks: 'Альбом не змяшчае ніводнага трэка'
    }
  },
  createEntityLabel: 'Стварыць iстоту "{x}" з назвай: "{x}"',
  heroActions: {
    search: 'Пошук',
    wiki: 'Атрымаць iнфармацыю з Вiкіпедыі',
    addToCollection: 'Дадаць у калекцыю',
    getRandomAlbum: 'Выпадковы альбом',
    deleteAlbum: 'Выдаліць альбом'
  },
  trackActions: {
    getLyrics: 'Знайсцi тэкст песнi',
    disableTrack: 'Дэактываваць трэк',
    enableTrack: 'Актываваць трэк',
    playNext: 'Граць наступным',
    toPlaylist: 'Дадаць у плэйлiст',
    removeFromPlaylist: 'Выдаліць з плэйлiста',
    toCompilation: 'Дадаць у кампіляцыю'
  },
  errors: {
    file_upload_error: 'Памылка загрузкі файла',
    file_size_exceeded_5mb: 'Памер файла перавышае 5МБ',
    file_count_exceeded: 'Памер файла перавышае 5МБ',
    unexpected_file_field: 'Нечаканае поле файла',
    only_webp_allowed: 'Дапушчальны тып файла: webp'
  },
  usersTable: {
    id: 'ID',
    email: 'Электронная пошта',
    role: 'Роля',
    delete: 'Выдаліць карыстальніка',
  },
  backupsTable: {
    timestamp: 'Таймстамп',
    restore: 'Аднавіць бэкап',
    delete: 'Выдаліць бэкап'
  },
  snackbars: {
    delete: {
      success: 'Iстота паспяхова выдалена',
      failed: 'Немагчамы вадалiць iстоту'
    }
  },
  release: {
    added: 'Дададзена',
    listen: 'Слухаць'
  }
}
