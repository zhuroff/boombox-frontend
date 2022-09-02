import api from '~/api'
import { RequestConfig } from '~/types/Global'

export default class MoviesServices {
  static async list(config: RequestConfig) {
    const response = await api.post('/api/movies', config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async movie(id: string, path: string) {
    const response = await api.post(`/api/movies/${id}`, { path })

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }
}
