import { LocaleKeys } from '~/types/Common'
import store from '~/store'
import locales from '~/locales'

export const useLocales = () => {
  const { actions, getters } = store
  const allLocales = Array.from(locales.keys())
  
  const setLocale = (locale: LocaleKeys) => {
    localStorage.setItem('locale', locale)
    actions.setLocale(locale)
  }

  const checkAndSetLocale = () => {
    const storedLocale = localStorage.getItem('locale')
    if (storedLocale && allLocales.includes(storedLocale as LocaleKeys)) {
      setLocale(storedLocale as LocaleKeys)
    } else {
      setLocale('en')
    }
  }

  const lang = getters.getLocaleValue

  return {
    checkAndSetLocale,
    allLocales,
    setLocale,
    lang
  }
}