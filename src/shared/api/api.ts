import axios from 'axios'
import { hostString } from '~shared/utils'
import { cleanUser } from '~shared/model'

export const api = axios.create({
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
