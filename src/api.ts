import axios from 'axios'

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
    if (error.response) {
      throw error.response.data
    } else {
      console.dir(error)
    }
  }
)

export default api
