import { LocaleKeys } from '~/types/Common'
import { useState } from '~/hooks/useState'
import locales from '~/locales'

export const useLocales = () => {
  const { actions, getters } = useState()
  const allLocales = Array.from(locales.keys())
  
  const setLocale = (locale: LocaleKeys) => {
    localStorage.setItem('locale', locale)
    // store.commit('setLocale', locale)
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