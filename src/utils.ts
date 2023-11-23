import { LocaleDictionary } from '~/types/Global'
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
