import axios from 'axios'
import store from './store'
import { hostString } from './utils'

const api = axios.create({
  baseURL: hostString(''),
  withCredentials: true,
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { actions } = store

    if (error.response) {
      if (error.response.status === 403) {
        actions.setAuthConfig('isAuthenticated', false)
        actions.setAuthConfig('user', undefined)
        localStorage.removeItem('token')
      }

      throw error.response.data
    } else {
      console.error(error)
    }
  }
)

export default api
