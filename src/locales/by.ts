import { LocaleDictionary } from '~/types/Common'

export const localesBY: LocaleDictionary = {
  languages: {
    en: 'Англiйская',
    by: 'Беларуская'
  },
  cancel: 'Скасаваць',
  delete: 'Выдалiць',
  delConfirmMessage: 'Вы ўпэўнены, што хочаце выдаліць гэты аб\'ект?',
  navigation: {
    albums: 'Альбомы',
    artists: 'Артысты',
    genres: 'Жанры',
    periods: 'Перыяды',
    embedded: 'Фрэймы',
    collections: 'Калекцыi',
    compilations: 'Кампіляцыi',
    toy: 'TOY',
    settings: 'Налады',
    tracks: 'Трэкi'
  },
  settings: {
    createBackup: 'Стварыць рэзервовую копію',
    synchronize: 'Сінхранізаваць',
  },
  headings: {
    albumsPage: 'У калекцыi {x} альбомаў',
    collectionsPage: 'Усяго калекцый: {x}',
    compilationsPage: 'Усяго компіляцый: {x}'
  },
  getRandomAlbum: 'Выпадковы альбом',
  unknownTime: 'невядомы час',
  listenedTracks: 'Усяго праслуханых трэкаў:',
  conjugated: {
    tracks: {
      singular: 'трэк',
      upToFive: 'трэкi',
      plural: 'трэкаў'
    }
  },
  playButton: 'Граць',
  pauseButton: 'Паўза',
  discogsTable: {
    cover: 'Вокладка',
    country: 'Краiна',
    releaseYear: 'Год',
    releaseFormat: 'Фармат',
    label: 'Лэйбл'
  },
  embeddedForm: {
    title: 'Назва альбому',
    artist: 'Артыст',
    genre: 'Жанр',
    period: 'Год выдання',
    frame: 'Код фрэйму',
    collections: 'У калекцыi',
  },
  formLabels: {
    errorRequired: 'Гэта поле абавязковае'
  },
  table: {
    empty: 'Няма дадзеных'
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
    save: 'Захаваць тэкст'
  },
  wiki: {
    notFound: 'Нічога не знойдзена ў Вікіпедыі',
    frameHeading: 'Выберыце артыкул са спісу вышэй',
    navItem: 'Вікіпедыя'
  },
  collections: {
    add: 'Дадаць у калекцыю',
    namePlaceholder: 'Увядзіце назву калекцыі',
    exists: 'Калекцыя з такой назвай ужо існуе',
    removed: 'Альбом паспяхова выдалены з калекцыі',
    added: 'Альбом паспяхова дададзены ў калекцыю',
    reordered: 'Парадак альбомаў паспяхова зменены',
    cardCaption: 'Альбомаў у калекцыі',
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
    cardCaption: 'Трэкаў у компіляцыі',
    drop: 'Компіляцыя паспяхова выдалена',
    more: 'кампiляцый'
  },
  search: {
    placeholder: 'Пошук...'
  },
  player: {
    playNow: 'Граць зараз',
    playNext: 'Граць наступным',
    addToList: 'Дадаць да плэйлiста',
    removeFromList: 'Выдаліць з плэйлiста'
  },
  totalAlbums: 'Усяго альбомаў',
  deleteEntity: 'Выдаліць альбом',
  deletedEmbeddedMessage: 'Альбом паспяхова выдалены',
  syncResponse: {
    added: 'Дададзеныя альбомы',
    updated: 'Абноўленыя альбомы',
    deleted: 'Выдаленыя альбомы',
    invalid: 'Альбомы, якія не прайшлі валiдацыю',
    invalidValue: {
      album: 'Альбом',
      cloud: 'URL воблака',
      reason: 'Прычына',
      invalid_folder_name: 'Назва папкі не адпавядае патэрну: \'Iмя артыста [год выдання] Назва альбома #Жанр\'',
      invalid_tracks_names: 'Назва трэкаў не адпавядае патэрну: \'Нумар. Назва трэка.пашырэнне файла\'',
      no_tracks: 'Альбом не змяшчае ніводнага трэка'
    }
  },
  toy: {
    emptyGenres: 'Калекцыі пакуль няма',
    emptyYears: 'Перыядаў пакуль няма'
  }
}
