import { AppStateInterface, LocaleKeys, Snackbar } from '~/types/Common';
import { AuthConfig } from '~/types/User';

export const useActionsCommon = (state: AppStateInterface) => {
  const setSnackbarMessage = (snackbar: Snackbar) => {
    state.snackbar.push(snackbar)
    setTimeout(() => state.snackbar.splice(0, 1), snackbar.time || 5000)
  }

  const closeSnackbar = (index: number) => {
    state.snackbar.splice(index, 1)
  }

  const setLocale = (locale: LocaleKeys) => {
    state.currentLocale = locale
  }

  const setAuthConfig = <T extends keyof AuthConfig>(key: T, value: AuthConfig[T]) => {
    state.authConfig[key] = value
  }

  return {
    setAuthConfig,
    setSnackbarMessage,
    closeSnackbar,
    setLocale
  }
}