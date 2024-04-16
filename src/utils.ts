import { LocaleDictionary } from '~/types/Common'
import { useLocales } from '~/hooks/useLocales'

export const findLocaleLangValue = (path: string[], dict?: LocaleDictionary): string | null => {
  const value = dict?.[path[0]]
  if (!value) {
    return null
  }
  if (typeof value === 'string') {
    return path.length === 1 ? value : null
  }
  path.splice(0, 1)
  return findLocaleLangValue(path, value)
}

export const isObjectsEquals = <T>(a: T, b: T): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const hostString = (pathname: string) => {
  const host = process.env.NODE_ENV === 'development'
    ? process.env.VUE_APP_DEV_HOST
    : process.env.VUE_APP_LIVE_HOST

  return `${host}${pathname}`
}

export const coverPlaceholders = (slug: string) => {
  switch(slug) {
    case 'artists':
      return '/img/artist.webp'
    case 'genres':
      return '/img/genre.webp'
    case 'periods':
      return '/img/period.webp'
    case 'frames':
      return '/img/frame.webp'
    default:
      return '/img/album.webp'
  }
}

export const slugify = (str: string) => (
  str.toLowerCase()
    .replace(/[^a-zа-я0-9\s]+/g, '').trim()
    .replace(/\s+/g, '-').trim()
)

export const conjugate = (key: string, amount: number) => {
  const { lang } = useLocales()
  const lastDigit = amount % 10
  const lastTwoDigits = amount % 100
  if (lastTwoDigits > 10 && lastTwoDigits < 20) {
    return lang(`conjugated.${key}.plural`)
  }
  if (lastDigit === 1) {
    return lang(`conjugated.${key}.singular`)
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return lang(`conjugated.${key}.upToFive`)
  }
  return lang(`conjugated.${key}.plural`)
}

export const detectLocale = (str: string) => {
  if (str.match(/[a-zA-Z]/g)) {
    return 'en'
  } else if (str.match(/[а-яА-Я]/g)) {
    return 'ru'
  }

  return 'en'
}

export function debounce <T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) {
  let timerID: ReturnType<typeof setTimeout>
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timerID)
    timerID = setTimeout(() => {
      callback.apply(this, args)
    }, delay)
  }
}

export const secondsToMinutes = (duration?: number) => {
  if (!duration) {
    return '--/--'
  }

  const minutes = Math.floor(duration / 60)
  const seconds = Math.floor(duration - minutes * 60)

  return `${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`
}

export const toCapitalize = (str: string) => (
  str.split(' ')
    .map((word) => word.toLowerCase().charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(' ')
)

export const reduceString = (str: string, length: number) => (
  str.length <= length
    ? str
    : str.slice(0, length).trim() + '...'
)

export const categoryKeyDict: Record<string, string> = {
  genres: 'genre',
  artists: 'artist',
  periods: 'period',
  collections: 'collection',
}
