import { localesEN } from './en'
import { localesBY } from './by'
import { LocaleDictionary, LocaleKeys } from '~/types/Common'

export default new Map<LocaleKeys, LocaleDictionary>([
  ['en', localesEN],
  ['by', localesBY]
])
