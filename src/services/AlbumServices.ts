import api from '~/api'
import { AlbumPageResponse, AlbumPage } from '~/types/Album'
import { RequestConfig } from '~/types/Global'

export default class AlbumServices {
  static async list(config: RequestConfig) {
    const response = await api.post<AlbumPageResponse>('/api/albums', config)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error()
  }

  static async album(id: string) {
    const response = await api.get<AlbumPage>(`/api/albums/${id}`)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }

  static async description(id: string, description: string): Promise<void> {
    await api.patch(`/api/albums/${id}/description`, { description })
  }

  static async booklet(id: string, path: string): Promise<string[]> {
    const response = await api.get(`/api/albums/${id}/${path}`)

    if (response?.status === 200) {
      return response.data
    }

    throw new Error('Failed request')
  }
}