const actions = (state: GlobalState) => {
  const setLocale = (locale: LocaleKeys) => {
    localStorage.setItem('locale', locale)
    state.currentLocale = locale
  }

  const checkAndSetLocale = () => {
    const storedLocale = localStorage.getItem('locale')
    if (storedLocale && [...state.locales.keys()].includes(storedLocale as LocaleKeys)) {
      setLocale(storedLocale as LocaleKeys)
    } else {
      setLocale('en')
    }
  }  

  const setAuthConfig = <T extends keyof AuthConfig>(key: T, value: AuthConfig[T]) => {
    state.authConfig[key] = value
  }

  return {
    setLocale,
    setAuthConfig,
    checkAndSetLocale
  }
}

export default actions
