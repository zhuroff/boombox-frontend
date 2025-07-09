import { reactive } from 'vue'
import type { Snackbar } from '~shared/lib'

const snackbarQueue = reactive(new Set<Snackbar>())

const useSnackbar = () => {
  const setSnackbarMessage = (message: Snackbar) => {
    snackbarQueue.add(message)

    setTimeout(() => {
      snackbarQueue.delete(message)
    }, message.time || 5000)
  }

  const closeSnackbar = (message: Snackbar) => {
    snackbarQueue.delete(message)
  }

  return {
    snackbarQueue,
    setSnackbarMessage,
    closeSnackbar
  }
}

export default useSnackbar
