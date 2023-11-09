import { LocaleDictionary } from '~/types/Global'
import { CategoryBasic } from './types/Category'

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
