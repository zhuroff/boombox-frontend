import { computed } from 'vue'
import { findLocaleLangValue } from './utils'

const getters = (state: GlobalState) => {
  const authConfig = computed(() => state.authConfig)

  const currentLocale = computed(() => state.currentLocale)

  const isAuthenticated = computed(() => state.authConfig.isAuthenticated)

  const isAdmin = computed(() => (
    authConfig.value.user?.role === 'admin'
  ))

  const localize = (path: string, ...vars: string[]) => {
    const parsedPath = path.split('.')
    const dict = state.locales.get(state.currentLocale)
    const value = findLocaleLangValue(parsedPath, dict)

    if (!value) return `{${path}}`
    if (!vars.length) return value
    
    return value.replace(/{x}/g, () => String(vars.shift() ?? '{...}'))
  }

  return {
    isAdmin,
    localize,
    authConfig,
    currentLocale,
    isAuthenticated
  }
}

export default getters
