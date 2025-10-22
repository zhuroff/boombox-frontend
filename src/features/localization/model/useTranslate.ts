import { ref } from 'vue'
import { dictionaries, locales } from '../lib/dictionaries'
import { type LocaleDictionary } from '../lib/types'

import { LocaleKeys, type LocaleItem } from '~shared/lib'
import { setLocalizationConfig } from '~shared/model'

const currentLocale = ref<LocaleItem>(locales.get(LocaleKeys.EN) as LocaleItem)

const useTranslate = () => {
  const findLocaleLangValue = (path: string[], dict?: LocaleDictionary): string | null => {
    const value = dict?.[path[0]]

    if (!value) return null

    if (typeof value === 'string') {
      return path.length === 1 ? value : null
    }

    path.splice(0, 1)

    return findLocaleLangValue(path, value)
  }

  const setLocale = (payload: LocaleItem) => {
    localStorage.setItem('locale', payload.locale)
    currentLocale.value = payload
  }

  const checkAndSetLocale = () => {
    const storedLocale = localStorage.getItem('locale')

    if (storedLocale && [...dictionaries.keys()].includes(storedLocale as LocaleKeys)) {
      setLocale(locales.get(storedLocale as LocaleKeys) as LocaleItem)
    } else {
      setLocale(locales.get(LocaleKeys.EN) as LocaleItem)
    }
  }

  const localize = (path: string, ...vars: string[]) => {
    const parsedPath = path.split('.')
    const dict = dictionaries.get(currentLocale.value.locale)
    const value = findLocaleLangValue(parsedPath, dict)

    if (!value) return `{${path}}`
    if (!vars.length) return value
    
    return value.replace(/{x}/g, () => String(vars.shift() ?? '{...}'))
  }

  setLocalizationConfig({
    locales,
    localize,
    setLocale,
    currentLocale,
    checkAndSetLocale
  })

  return {
    localize,
    locales,
    currentLocale,
    setLocale,
    checkAndSetLocale
  }
}

export default useTranslate
