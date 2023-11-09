import { LocaleKeys } from '~/types/Global'
import { useStore } from 'vuex'
import { key } from '~/store'
import locales from '~/locales'

export const useLocales = () => {
  const store = useStore(key)
  const allLocales = Array.from(locales.keys())
  
  const setLocale = (locale: LocaleKeys) => {
    localStorage.setItem('locale', locale)
    store.commit('setLocale', locale)
  }

  const checkAndSetLocale = () => {
    const storedLocale = localStorage.getItem('locale')
    if (storedLocale && allLocales.includes(storedLocale as LocaleKeys)) {
      setLocale(storedLocale as LocaleKeys)
    } else {
      setLocale('en')
    }
  }

  const lang = store.getters.getLocaleValue

  return {
    checkAndSetLocale,
    allLocales,
    setLocale,
    lang
  }
}