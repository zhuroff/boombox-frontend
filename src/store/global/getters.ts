import { computed } from 'vue'
import { findLocaleLangValue } from './utils'

const getters = (state: GlobalState) => {
  const authConfig = computed(() => state.authConfig)

  const currentLocale = computed(() => state.currentLocale)

  const isAuthenticated = computed(() => state.authConfig.isAuthenticated)

  const conjugate = (key: string, amount: number) => {
    const lastDigit = amount % 10
    const lastTwoDigits = amount % 100
    if (lastTwoDigits > 10 && lastTwoDigits < 20) {
      return localize(`conjugated.${key}.plural`)
    }
    if (lastDigit === 1) {
      return localize(`conjugated.${key}.singular`)
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return localize(`conjugated.${key}.upToFive`)
    }
    return localize(`conjugated.${key}.plural`)
  }

  const localize = (path: string, ...vars: string[]) => {
    const parsedPath = path.split('.')
    const dict = state.locales.get(state.currentLocale)
    const value = findLocaleLangValue(parsedPath, dict)

    if (!value) return `{${path}}`
    if (!vars.length) return value
    
    return value.replace(/{x}/g, () => String(vars.shift() ?? '{...}'))
  }

  return {
    localize,
    conjugate,
    authConfig,
    currentLocale,
    isAuthenticated
  }
}

export default getters
