import axios from 'axios'
import { hostString } from '~/utils'
import { cleanUser } from '~entities/user'

const api = axios.create({
  baseURL: hostString(''),
  withCredentials: true,
  headers: {
    'accept': 'application/json',
    'content-type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(1, error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 403) {
      cleanUser()
      updateAuthHeaders()
    }
    return Promise.reject(error)
  }
)

export const updateAuthHeaders = () => {
  delete api.defaults.headers.common.Authorization
}

export default api
