import { localeConfigEN, localesEN } from './en'
import { localeConfigBY, localesBY } from './by'
import { type LocaleDictionary } from '../types'
import { LocaleKeys, type LocaleItem } from '~shared/lib'

export const locales: Map<LocaleKeys, LocaleItem> = new Map([
  [LocaleKeys.EN, localeConfigEN],
  [LocaleKeys.BY, localeConfigBY]
])

export const dictionaries = new Map<LocaleKeys, LocaleDictionary>([
  [LocaleKeys.EN, localesEN],
  [LocaleKeys.BY, localesBY]
])
