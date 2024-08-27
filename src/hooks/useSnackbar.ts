import { reactive } from 'vue'

const snackbarQueue = reactive(new Map<string, Snackbar>())

const useSnackbar = () => {
  const setSnackbarMessage = (snackbar: Snackbar) => {
    const snackbarID = new Crypto().randomUUID()
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
