import axios from 'axios'
// import { useStore } from 'vuex'
// import { key } from '~/store'

const api = axios.create({
  baseURL: process.env.VUE_APP_DEV_HOST,
  // withCredentials: true,
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // const store = useStore(key)

    if (error.response) {
      const statusCode = error.response?.status
      const responseData = error.response.data
      console.log(statusCode)
      console.log(responseData)

      // if ('error' in responseData) {
      //   store.commit('setSnackbarMessage', {
      //     message: responseData.error,
      //     type: 'error'
      //   })
      // }
    }
  }
)

export default api
