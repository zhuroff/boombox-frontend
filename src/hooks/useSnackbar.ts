import { reactive } from 'vue'
import { getUUID } from '~/utils'

const snackbarQueue = reactive(new Map<string, Snackbar>())

const useSnackbar = () => {
  const setSnackbarMessage = (snackbar: Snackbar) => {
    const snackbarID = getUUID()
    snackbarQueue.set(snackbarID, snackbar)
    setTimeout(() => {
      snackbarQueue.delete(snackbarID)
    }, snackbar.time || 5000)
  }

  const closeSnackbar = (id: string) => {
    snackbarQueue.delete(id)
  }

  return {
    snackbarQueue,
    setSnackbarMessage,
    closeSnackbar
  }
}

export default useSnackbar
