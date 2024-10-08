export const isObjectsEquals = <T>(a: T, b: T): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const hostString = (pathname: string) => {
  const host = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_HOST
    : import.meta.env.VITE_LIVE_HOST

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

export const detectWikiLocale = (str: string) => {
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

export const localeIntlCodes: Record<LocaleKeys, Intl.LocalesArgument> = {
  en: 'en-US',
  by: 'ru-RU'
}

export const getTimestamp = (value: number, unit: 's' | 'm' | 'h') => {
  const MS_IN_SECOND = 1000
  const MS_IN_MINUTE = MS_IN_SECOND * 60
  const MS_IN_HOUR = MS_IN_MINUTE * 60

  switch (unit) {
    case 'h':
      return value * MS_IN_HOUR
    case 'm':
      return value * MS_IN_MINUTE
    case 's':
      return value * MS_IN_SECOND
    default:
      throw new Error('Invalid unit. Use "h" for hours, "m" for minutes, or "s" for seconds.')
  }
}
