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

export const cleanAndCapitalize = (str: string): string => {
  const trimmedStr = str.trim().replace(/\s+/g, ' ')
  return trimmedStr
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const assertNever = (value: never, isError = false) => {
  console.warn('Impossible value:', value)

  if (isError) {
    throw new Error('Impossible value')
  }

  return undefined
}
